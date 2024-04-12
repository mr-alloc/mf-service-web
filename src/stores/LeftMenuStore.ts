import {defineStore} from "pinia";
import {reactive} from "vue";

export const useLeftMenuStore = defineStore("leftMenu", () => {
    const state = reactive({
        isCollapsed: false
    });

    function collapseMenu() {
        state.isCollapsed = !state.isCollapsed;
        console.log('collapseMenu', state.isCollapsed)
    }

    return {
        state,
        collapseMenu
    }
})
