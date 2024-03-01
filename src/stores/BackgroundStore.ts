import {defineStore} from "pinia";
import {ref} from "vue";

export const useBackgroundStore = defineStore('background', () => {

    const needBackground = ref<boolean>(false)
    const needNicknameInitializer = ref<boolean>(false)
    const needCurtainManager = ref<boolean>(false)
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
        needBackground.value = needNicknameInitializer.value || needCurtainManager.value
    }


    return {
        needBackground,
        needNicknameInitializer,
        needCurtainManager,
        useNicknameInitializer,
        returnNicknameInitializer,
        useCurtainManager,
        loadingInfo
    }
})
