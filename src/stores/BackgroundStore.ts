import {defineStore} from "pinia";
import {ref} from "vue";

export const useBackgroundStore = defineStore('background', () => {

    const needBackground = ref<boolean>(false)
    const needNicknameInitializer = ref<boolean>(false)

    function useNicknameInitializer() {
        needNicknameInitializer.value = true
        updateBackgroundNeeds()
    }

    function updateBackgroundNeeds() {
        needBackground.value = needNicknameInitializer.value
    }

    function returnNicknameInitializer() {
        needNicknameInitializer.value = false
        updateBackgroundNeeds()
    }

    return {
        needBackground,
        useNicknameInitializer,
        returnNicknameInitializer
    }
})
