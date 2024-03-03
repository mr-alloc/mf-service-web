import {createRouter, createWebHistory} from 'vue-router'
import Main from '../views/Main.vue'
import SignIn from '../views/SignIn.vue'
import SignUp from '../views/SignUp.vue'
import {MemberInfo, useMemberInfoStore} from "@/stores/MemberInfo";
import {call} from "@/utils/NetworkUtil";
import MemberAPI from "@/constant/api-meta/Member";
import {useBackgroundStore} from "@/stores/BackgroundStore";
import {noAccessToken, removeAccessToken, removeTokens} from "@/utils/LocalCache";
import {NotificationType, useNotificationStore} from "@/stores/NotificationStore";
import MemberProfile from "@/views/authorized/MemberProfile.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      {path: '/', name: 'main', component: Main, meta: {role: 1}},
      {path: '/sign-in', name: 'sign-in', component: SignIn, meta: {role: 0}},
      {path: '/sign-up', name: 'sign-up', component: SignUp, meta: {role: 0}},
      {path: '/profile', name: 'profile', component: MemberProfile, meta: {role: 1}}
  ]
})

router.beforeEach(async (to, from, next) => {
    const memberInfoStore = useMemberInfoStore();
    const backgroundStore = useBackgroundStore();
    const notificationStore = useNotificationStore();

    const onlyForGuest = ['/sign-in', '/sign-up'];

    console.log(`[${to.path}] [No Session: ${noAccessToken()} / No Member: ${memberInfoStore.needMemberInfo()}]`)

    //로그인 정보가 없는 경우
    if (noAccessToken() && to.meta.role !== 0) {
        console.log('no access token')
        return next({ path: '/sign-in' })
    }

    // 미로그인, 게스트일때만 들어갈수 있는 페이지 인경우
    if (!noAccessToken() && onlyForGuest.includes(to.path)) {
      console.log('not allow for signed in user')
      return next({ path: '/' })
    }

    //미로그인이지만, 접근이 가능한 페이지 인경우
    if (noAccessToken() && !onlyForGuest.includes(to.path) && to.meta.role === 0) {
        console.log('no session but, accessible page')
        return next()
    }

    //로그인은 했지만, 멤버 정보가 없는경우.
    if (!noAccessToken() && memberInfoStore.needMemberInfo()) {
        console.log('need member info. (renew member info)')

        await call(MemberAPI.GetInfo, null,
            (response) => {
                const { id, nickname, role } = response.data
                if (nickname === null) {
                    notificationStore.notice(NotificationType.GUIDE, "반가워요!", "사용할 닉네임을 정해주세요. 닉네임은 다음에도 변경할 수 있어요.")
                    backgroundStore.useNicknameInitializer()
                } else {
                    notificationStore.notice(NotificationType.NONE, "반가워요!", `${nickname}님, 오늘도 좋은 하루 되세요!`)
                }
                memberInfoStore.updateMemberInfo(new MemberInfo(id, nickname, role))
                console.log('Successfully renew member profile.')
                return;
            },
            (sepc, error) => {
                const res = error.response;
                //인증 실패
                if (res.status === 401) {
                    removeTokens()
                    return next({ path: '/sign-in' })
                }
                console.error('[Failed to Get Member Info]', error);
                removeAccessToken()
                return next({ path: '/sign-in' })
            })

        const memberInfo = memberInfoStore.memberInfo;
        const authorityRole: number = memberInfo.role

        const { role } = to.meta as { role: number }
        console.info(`${to.path}: Need: ${role} / Current: ${authorityRole}`)
        if (role && role > authorityRole) {
            notificationStore.notice(NotificationType.WARNING, "부적절한 접근 경고", "잘못된 방법으로 접근이 감지 되었습니다. 지속적으로 올바르지 않은 접근시 이용에 제한이 될 수 있습니다.", 10)
            return next({ path: '/' })
        }
    }

    console.log('no reachable to any condition')
    return next()
})

export default router
