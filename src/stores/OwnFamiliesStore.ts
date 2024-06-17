import {defineStore} from "pinia";
import {ref} from "vue";
import {call} from "@/utils/NetworkUtil";
import Family from "@/constant/api-meta/Family";
import CollectionUtil from "@/utils/CollectionUtil";
import SelectFamilyOption from "@/classes/SelectFamilyOption";
import {useMemberInfoStore} from "@/stores/MemberInfoStore";
import * as GetOwnFamilies from "@/classes/api-spec/family/GetOwnFamilies";
import * as GetFamilyMember from "@/classes/api-spec/family/GetFamilyMember";
import {hasSelectedFamilyId, setSelectedFamilyId} from "@/utils/LocalCache";
import {useFamiliesViewStore} from "@/stores/FamiliesViewStore";
import {useFamilyMemberInfoStore} from "@/stores/FamilyMemberInfoStore";

export const useOwnFamiliesStore = defineStore("ownFamilies", () => {
    const notSelectedOption = new SelectFamilyOption(0, "", "NO_IMAGE", "본캐 선택");
    const families = ref<Array<GetOwnFamilies.FamilySummary>>([]);
    const members = ref<Array<GetFamilyMember.FamilyMember>>([]);
    const selectorState = ref({
        defaultOption: notSelectedOption,
        selectedOption: notSelectedOption,
        isCollapsed: false,
    });

    const hasSelectFamily = ref<boolean>(false);

    async function fetchOwnFamiliesAsync(forceFetch: boolean) {
        const memberInfoStore = useMemberInfoStore();
        if (memberInfoStore.needMemberInfo()) return;
        if (!forceFetch && families.value.length > 0) return;

        await call<any, GetOwnFamilies.ResponseBody>(Family.GetOwnFamilies, {}, (res) => {
            const responseBody = GetOwnFamilies.ResponseBody.fromJson(res.data);
            families.value = responseBody.families;
        });
    }

    async function fetchFamilyMembersAsync(forceFetch: boolean) {
        const memberInfoStore = useMemberInfoStore();
        if (memberInfoStore.needMemberInfo()) return;
        if (!forceFetch && members.value.length > 0) return;

        await call<any, GetFamilyMember.ResponseBody>(Family.GetFamilyMembers, {}, (response) => {
            const responseBody = GetFamilyMember.ResponseBody.fromJson(response.data);
            members.value = responseBody.members;
        });
    }

    function toSelectItemValue(): SelectFamilyOption [] {
        return CollectionUtil.convertList<SelectFamilyOption>(
            families.value,
            (item: GetOwnFamilies.FamilySummary) => new SelectFamilyOption(item.id, item.color, item.image ?? "", item.name)
        )
    }


    async function changeFamily(emitter: any) {
        const memberInfoStore = useMemberInfoStore();
        const familiesViewStore = useFamiliesViewStore();
        const familyMemberInfoStore = useFamilyMemberInfoStore();
        const item = selectorState.value.selectedOption;

        //패밀리 선택시 갱신정보
        setSelectedFamilyId(item.id);
        //캘린더 갱신
        emitter.emit("drawCalendar")
        emitter.emit("fetchFamiliesView")
        if (hasSelectedFamilyId()) {
            await familiesViewStore.fetchFamilyMembersAsync();
            await familiesViewStore.fetchFamilyInfoAsync();
            await familyMemberInfoStore.fetchFamilyMemberAsync();
            await fetchFamilyMembersAsync(true);
        } else {
            await memberInfoStore.fetchMemberInfo();
        }
    }


    return {
        families,
        members,
        selectorState,
        fetchOwnFamiliesAsync,
        fetchFamilyMembersAsync,
        toSelectItemValue,
        changeFamily,
        hasSelectFamily
    }
})
