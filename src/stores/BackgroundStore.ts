import {defineStore} from "pinia";
import {ref} from "vue";
import type {CurrentPopup} from "@/stores/status/CurrentPopup";
import {AlertType, useAlertStore} from "@/stores/AlertStore";

export const useBackgroundStore = defineStore('background', () => {

    const needBackground = ref<boolean>(false);
    const needNicknameInitializer = ref<boolean>(false);
    const needCurtainManager = ref<boolean>(false);
    const needPopup = ref<boolean>(false);
    const needInnerPopup = ref<boolean>(false);
    const isPopupPrepare = ref<boolean>(false);

    const popupInfo = ref<CurrentPopup>();
    const innerPopupInfo = ref<CurrentPopup>();
    const loadingInfo = ref({
        title: '',
        content: ''
    });

    const nicknameInitializerInfo = ref({
        title: '',
        noQuitButton: false
    });


    //최초 닉네임 초기화
    function useNicknameInitializer(title: string, noQuitButton?: boolean) {
        needNicknameInitializer.value = true;
        nicknameInitializerInfo.value.title = title;
        nicknameInitializerInfo.value.noQuitButton = noQuitButton || false;
        updateBackgroundNeeds();
    }

    function returnNicknameInitializer() {
        needNicknameInitializer.value = false;
        nicknameInitializerInfo.value.title = '';
        updateBackgroundNeeds();
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
            const alertStore = useAlertStore();
            alertStore.alert(AlertType.WARNING, "문제가 있어요.", "진행중인 작업을 완료해주세요.")
            return;
        }

        popupInfo.value = popup;
        needPopup.value = true;
        isPopupPrepare.value = popup.progress;
        updateBackgroundNeeds();

        if (autoCloseSecond) {
            setTimeout(() => {
                returnGlobalPopup();
            }, autoCloseSecond * 1000)
        }
    }

    function useInnerPopup(popup: CurrentPopup) {
        innerPopupInfo.value = popup;
        needInnerPopup.value = true;
    }

    function doIfHasPopup(callback: (popup: CurrentPopup) => void) {
        if (popupInfo.value) {
            callback(popupInfo.value);
        }
    }

    function returnGlobalPopup() {
        needPopup.value = false;
        needInnerPopup.value = false;
        //팝업이 사라지기 전까지 정보를 보여줘야하므로 딜레이를 준다.
        setTimeout(() => {
            popupInfo.value = undefined;
            innerPopupInfo.value = undefined;
            updateBackgroundNeeds();
        }, 300)
    }

    function returnInnerPopup() {
        needInnerPopup.value = false;
        //팝업이 사라지기 전까지 정보를 보여줘야하므로 딜레이를 준다.
        setTimeout(() => innerPopupInfo.value = undefined, 300)
    }

    function readyPopup() {
        isPopupPrepare.value = false;
    }


    return {
        needBackground,
        needNicknameInitializer,
        needCurtainManager,
        useNicknameInitializer,
        nicknameInitializerInfo,
        returnNicknameInitializer,
        useCurtainManager,
        loadingInfo,
        needPopup,
        needInnerPopup,
        innerPopupInfo,
        popupInfo,
        useGlobalPopup,
        returnGlobalPopup,
        doIfHasPopup,
        returnInnerPopup,
        useInnerPopup,
        isPopupPrepare,
        readyPopup
    }
})
