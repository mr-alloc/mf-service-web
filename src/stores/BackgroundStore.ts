import {defineStore} from "pinia";
import {ref} from "vue";
import type {CurrentPopup} from "@/stores/status/CurrentPopup";

export const useBackgroundStore = defineStore('background', () => {

    const needBackground = ref<boolean>(false)
    const needNicknameInitializer = ref<boolean>(false)
    const needCurtainManager = ref<boolean>(false)
    const needPopup = ref<boolean>(false)

    const popupInfo = ref<CurrentPopup>();
    const loadingInfo = ref({
        title: '',
        content: ''
    })

    //최초 닉네임 초기화
    function useNicknameInitializer() {
        needNicknameInitializer.value = true
        updateBackgroundNeeds()
    }

    function returnNicknameInitializer() {
        needNicknameInitializer.value = false
        updateBackgroundNeeds()
    }

    //로딩 커튼 관리
    function useCurtainManager(title: string, content: string) {
        loadingInfo.value = {
            title: title,
            content: content
        }
        needCurtainManager.value = true
        updateBackgroundNeeds()
    }

    function returnCurtainManager() {
        needCurtainManager.value = false
        loadingInfo.value = {
            title: '',
            content: ''
        }
        updateBackgroundNeeds()
    }

    function updateBackgroundNeeds() {
        needBackground.value = needNicknameInitializer.value || needCurtainManager.value || needPopup.value;
    }


    function useGlobalPopup(popup: CurrentPopup, autoCloseSecond?: number) {
        if (needPopup.value) {
            console.error('Already has popup.')
            return;
        }

        popupInfo.value = popup;
        needPopup.value = true;
        updateBackgroundNeeds();

        if (autoCloseSecond) {
            setTimeout(() => {
                returnGlobalPopup();
            }, autoCloseSecond * 1000)
        }
    }

    function returnGlobalPopup() {
        needPopup.value = false;
        //팝업이 사라지기 전까지 정보를 보여줘야하므로 딜레이를 준다.
        setTimeout(() => {
            popupInfo.value = undefined;
            updateBackgroundNeeds();
        }, 300)
    }


    return {
        needBackground,
        needNicknameInitializer,
        needCurtainManager,
        useNicknameInitializer,
        returnNicknameInitializer,
        useCurtainManager,
        loadingInfo,
        needPopup,
        popupInfo,
        useGlobalPopup,
        returnGlobalPopup,
    }
})
