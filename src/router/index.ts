import {createRouter, createWebHistory} from 'vue-router'
import SignIn from '../views/SignIn.vue'
import SignUp from '../views/SignUp.vue'
import {ProfileMember, useMemberInfoStore} from "@/stores/MemberInfoStore";
import {call} from "@/utils/NetworkUtil";
import MemberAPI from "@/constant/api-meta/Member";
import {useBackgroundStore} from "@/stores/BackgroundStore";
import {noAccessToken, noTokens} from "@/utils/LocalCache";
import {useAlertStore} from "@/stores/AlertStore";
import MemberProfile from "@/views/authorized/MemberProfile.vue";
import {useOwnFamiliesStore} from "@/stores/OwnFamiliesStore";
import Main from "@/views/MainIndex.vue";
import {useLeftMenuStore} from "@/stores/LeftMenuStore";
import Missions from "@/views/authorized/Missions.vue";
import Families from "@/views/authorized/Families.vue";
import MainCalendar from "@/views/MainCalendar.vue";
import RefreshToken from "@/views/RefreshToken.vue";
import type ApiSpecification from '@/constant/api-meta/ApiSpecification'
import { AxiosError } from 'axios'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      {path: '/', name: 'home', component: Main, meta: {role: 0}},
      {path: '/calendar', name: 'calendar', component: MainCalendar, meta: {role: 1}},
      {path: '/sign-in', name: 'sign-in', component: SignIn, meta: {role: 0}},
      {path: '/sign-up', name: 'sign-up', component: SignUp, meta: {role: 0}},
      {path: '/profile', name: 'profile', component: MemberProfile, meta: {role: 1}},
      {path: '/missions', name: 'missions', component: Missions, meta: {role: 1}},
      {path: '/families', name: 'families', component: Families, meta: {role: 1}},
      {path: '/refresh', name: 'refresh', component: RefreshToken, meta: {role: 0}}
  ]
});

router.afterEach((to, from) => {
    const leftMenuStore = useLeftMenuStore();
    leftMenuStore.refreshAllActivated();
    switch (to.path) {
        case '/':
            leftMenuStore.state.activeHomeMenu = true;
            break;
        case '/calendar':
            leftMenuStore.state.activeCalendarMenu = true;
            break;
        case '/families':
            leftMenuStore.state.activeFamiliesMenu = true;
            break;
        case '/missions':
            leftMenuStore.state.activeMissionMenu = true;
            break;
    }
});
router.beforeEach(async (to, from, next) => {
    const memberInfoStore = useMemberInfoStore();
    const ownFamiliesStore = useOwnFamiliesStore();
    const backgroundStore = useBackgroundStore();
    const alertStore = useAlertStore();

    const onlyForGuest = ['/sign-in', '/sign-up', '/refresh'];

    console.debug(`${from.path} → ${to.path} [No Session: ${noAccessToken()} / No Member: ${memberInfoStore.needMemberInfo()}]`)


    //토큰 재발급 페이지
    if (!noTokens() && to.path === '/refresh') {
        return next();
    }

    //로그인 정보가 없는 경우
    if (noAccessToken() && to.meta.role !== 0) {
        console.debug('no access token')
        return next({ path: '/sign-in' })
    }

    // 미로그인, 게스트일때만 들어갈수 있는 페이지 인경우
    if (!noAccessToken() && onlyForGuest.includes(to.path)) {
        console.debug('not allow for signed in user')
      return next({ path: '/' })
    }

    //미로그인, 접근이 가능한 페이지 인경우
    if (noAccessToken() && onlyForGuest.includes(to.path) && to.meta.role === 0) {
        return next()
    }

    //로그인은 했지만, 멤버 정보가 없는경우.
    if (!noAccessToken() && memberInfoStore.needMemberInfo()) {
        console.debug('call member info in router proxy')
        await call<any, any>(MemberAPI.GetInfo, null,
            (response) => {
                const {id, nickname, role, profileImageUrl} = response.data
                if (nickname === null) {
                    alertStore.guide("반가워요!", "사용할 닉네임을 정해주세요. 닉네임은 다음에도 변경할 수 있어요.");
                    backgroundStore.useNicknameInitializer("합류를 시작하기 위해 닉네임을 정해주세요!");
                } else {
                    alertStore.none("반가워요!", `${nickname}님, 오늘도 좋은 하루 되세요!`)
                }
                memberInfoStore.updateMemberInfo(new ProfileMember(id, nickname, role, profileImageUrl))
                ownFamiliesStore.fetchOwnFamiliesAsync(true);
                return;
            },
            (spec: ApiSpecification, error: AxiosError) => {
                if (error.response?.status === 401) {
                    return next({ path: '/refresh' });
                }
            }
          );

        const memberInfo = memberInfoStore.memberInfo;
        const authorityRole: number = memberInfo.role

        const { role } = to.meta as { role: number }
        if (role && role > authorityRole) {
            alertStore.warning("부적절한 접근 경고", "잘못된 방법으로 접근이 감지 되었습니다. 지속적으로 올바르지 않은 접근시 이용에 제한이 될 수 있습니다.", 10)
            return next({path: '/sign-in'})
        }
    }
    console.debug('All pass router guard')
    return next()
});

export default router
