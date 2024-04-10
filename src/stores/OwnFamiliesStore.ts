import {defineStore} from "pinia";
import {ref} from "vue";
import {call} from "@/utils/NetworkUtil";
import Family from "@/constant/api-meta/Family";
import {convertList} from "@/utils/CollectionUtil";
import SelectItemValue from "@/classes/SelectItemValue";
import {useMemberInfoStore} from "@/stores/MemberInfo";

export const useOwnFamiliesStore = defineStore("ownFamilies", () => {
    const families = ref<Array<FamilySummary>>([])

    type FamilySummary = {
        id: number,
        color: string,
        image: string,
        name: string,
        description: string,
        registeredAt: number,
    }


    async function fetchOwnFamilies(forceFetch: boolean) {
        const memberInfoStore = useMemberInfoStore();
        if (memberInfoStore.needMemberInfo()) return;
        if (!forceFetch && families.value.length > 0) return;

        await call(Family.GetOwnFamilies, {}, (res) => {
            const {ownFamilies} = res.data
            const list = ownFamilies.map((family: any) => {
                return {
                    id: family.familyId,
                    color: family.hexColor,
                    image: family.imageUrl,
                    name: family.familyName,
                    description: family.familyDescription,
                    registeredAt: family.registeredAt
                }
            });
            families.value = list;
        });
    }

    function toSelectItemValue(): SelectItemValue [] {
        return convertList<SelectItemValue>(families.value, (item: FamilySummary) => new SelectItemValue(item.id, item.color, item.image ?? "", item.name))
    }


    return {
        families,
        fetchOwnFamilies,
        toSelectItemValue
    }
})
