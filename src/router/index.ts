import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/Main.vue'
import SignIn from '../views/SignIn.vue'
import SignUp from '../views/SignUp.vue'
import {MemberInfo, useMemberInfoStore} from "@/stores/MemberInfo";
import {useSessionStore} from "@/stores/SessionStore";
import {get} from "@/utils/NetworkUtil";
import MemberAPI from "@/constant/api-meta/Member";
import {useBackgroundStore} from "@/stores/BackgroundStore";
import { noAccessToken } from "@/utils/LocalCache";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
      meta: { role: 1 }
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: SignIn,
      meta: { role: 0 }
    },
    {
        path: '/sign-up',
        name: 'sign-up',
        component: SignUp,
        meta: { role: 0 }
    },

  ]
})

router.beforeEach(async (to, from, next) => {
    const memberInfoStore = useMemberInfoStore();
    const sessionStore = useSessionStore();
    let backgroundStore = useBackgroundStore();

    let onlyForGuest = ['/sign-in', '/sign-up'];

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

    //로그이인은 했지만, 멤버 정보가 없는경우.
    if (!noAccessToken() && memberInfoStore.needMemberInfo()) {
        console.log('need member info. (renew member info)')
        await get(MemberAPI.MEMBER_INFO_V1.name, {})
            .then(res => {
                const { id, nickname, role } = res.data
                console.log(`MemberInfo: { id: ${id}, nickname: ${nickname} }`)
                if (nickname === null) {
                    console.log('Need to initialize nickname')
                    backgroundStore.useNicknameInitializer()
                }
                memberInfoStore.updateMemberInfo(new MemberInfo(id, nickname, role))

                console.log('Successfully renew member profile.')
                return;
            })
            .catch(err => {
                console.error("Failed to get member info. Please sign in again.")
                sessionStore.removeCredential()
                return next({ path: '/sign-in' })
            })

        let memberInfo = memberInfoStore.memberInfo;
        console.log('User with ', memberInfo)
        const authorityRole: number = memberInfo.role

        const { role } = to.meta
        console.log(`${to.path}: Need: ${role} / Current: ${authorityRole}`)
        if (role && role > authorityRole) {
            alert("접근 권한이 없습니다.")
            return next({ path: '/' })
        }
    }

    console.log('no reachable to any condition')
    return next()
})

export default router
