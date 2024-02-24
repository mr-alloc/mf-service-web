import {defineStore} from "pinia";
import {ref} from "vue";

export const useSessionStore = defineStore('session', () => {
    const credential = ref("")

    function needSignIn(): boolean {
        return credential.value.length === 0
    }

    function updateCredential (newCredential: string) {
        credential.value = newCredential
    }

    function removeCredential() {
        credential.value = ""
    }

    return {
        credential,
        updateCredential,
        needSignIn,
        removeCredential
    }
})
