import {defineStore} from "pinia";
import {ref} from "vue";
import {call} from "@/utils/NetworkUtil";
import Family from "@/constant/api-meta/Family";
import CollectionUtil from "@/utils/CollectionUtil";
import SelectFamilyOption from "@/classes/SelectFamilyOption";
import {useMemberInfoStore} from "@/stores/MemberInfoStore";
import * as GetOwnFamilies from "@/classes/api-spec/family/GetOwnFamilies";
import {hasSelectedFamilyId, setSelectedFamilyId} from "@/utils/LocalCache";
import {useFamiliesViewStore} from "@/stores/FamiliesViewStore";
import {useFamilyMemberInfoStore} from "@/stores/FamilyMemberInfoStore";

export const useOwnFamiliesStore = defineStore("ownFamilies", () => {
    const notSelectedOption = new SelectFamilyOption(0, "", "NO_IMAGE", "본캐 선택");
    const families = ref<Array<GetOwnFamilies.FamilySummary>>([]);
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

        emitter.emit("familyChanged");

        if (hasSelectedFamilyId()) {
            //패밀리 멤버목록 정보
            await familiesViewStore.fetchFamilyMembersAsync();
            //패밀리 정보
            await familiesViewStore.fetchFamilyInfoAsync();
            //현재 패밀리 멤버정보
            await familyMemberInfoStore.fetchFamilyMemberAsync();
        } else {
            await memberInfoStore.fetchMemberInfo();
        }
    }


    return {
        families,
        selectorState,
        fetchOwnFamiliesAsync,
        toSelectItemValue,
        changeFamily,
        hasSelectFamily
    }
})
