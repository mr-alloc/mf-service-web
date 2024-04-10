<script setup lang="ts">
import SimpleItemSelect from "@/components/global/SimpleItemSelect.vue";
import type SelectItemValue from "@/classes/SelectItemValue";
import {useMemberInfoStore} from "@/stores/MemberInfo";
import {useOwnFamiliesStore} from "@/stores/OwnFamiliesStore";
import {setSelectedFamilyId} from "@/utils/LocalCache";
import {inject} from "vue";

const memberInfoStore = useMemberInfoStore();
const ownFamiliesStore = useOwnFamiliesStore();
const emitter = inject("emitter")!;

const methods = {
  changeFamily(item: SelectItemValue) {
    setSelectedFamilyId(item.id);
    memberInfoStore.fetchMemberInfo(item.title);
    emitter.emit("drawMemberCalendar");
  }
}
</script>
<template>
  <SimpleItemSelect v-if="!memberInfoStore.needMemberInfo() && ownFamiliesStore.families.length > 0"
                    :items="ownFamiliesStore.toSelectItemValue()"
                    default-selected-title="패밀리 이동"
                    :select-function="(item: SelectItemValue) => methods.changeFamily(item)"/>
</template>
<style scoped lang="scss">

</style>
