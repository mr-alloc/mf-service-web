import {defineStore} from "pinia";
import {reactive} from "vue";

export const useLeftMenuStore = defineStore("leftMenu", () => {
    const state = reactive({
        isCollapsed: true,
        activeCollapseMenu: false,
        activeHomeMenu: false,
        activeCalendarMenu: false,
        activeFamiliesMenu: false,
        activeMissionMenu: false,
    });

    function collapseMenu() {
        state.isCollapsed = !state.isCollapsed;
        state.activeCollapseMenu = state.isCollapsed;
    }

    function refreshAllActivated() {
        state.activeHomeMenu = false;
        state.activeCalendarMenu = false;
        state.activeFamiliesMenu = false;
        state.activeMissionMenu = false;
    }

    return {
        state,
        collapseMenu,
        refreshAllActivated

    }
})
