import {CurrentPopup, PopupType} from "@/stores/status/CurrentPopup";
import {AlertType, useAlertStore} from "@/stores/AlertStore";
import {useBackgroundStore} from "@/stores/BackgroundStore";

function popupCreateMission(emitter: any) {
    const backgroundStore = useBackgroundStore();
    const alertStore = useAlertStore();

    const createMissionPopup = new CurrentPopup(PopupType.NORMAL, "미션 생성")
        .addBodyComponent("CreateMission", {})
        .addButton("생성", () => {
            emitter.emit("validateCreateMissionForm")
        })
        .addCancelButton("취소", () => {
            backgroundStore.returnGlobalPopup()
            emitter.off("validateCreateMissionForm")
        }, () => {
            alertStore.alert(AlertType.WARNING, "미션생성 취소", "이 메세지가 사라지기 전까지 한번 더 취소 버튼을 누르시면 취소되요!", 5)
            return 5;
        });
    backgroundStore.useGlobalPopup(createMissionPopup);
}

function popupCreateFamily(emitter: any) {
    const backgroundStore = useBackgroundStore();
    const alertStore = useAlertStore();

    const createFamilyPopup = new CurrentPopup(PopupType.NORMAL, "패밀리 생성")
        .addBodyComponent("CreateFamily", {})
        .addButton("생성", () => {
            emitter.emit("validateCreateFamilyForm");
        })
        .addCancelButton("취소", () => {
            backgroundStore.returnGlobalPopup()
            emitter.off("validateCreateFamilyForm")
        }, () => {
            alertStore.alert(AlertType.WARNING, "패밀리 생성 취소", "이 메세지가 사라지기 전까지 한번 더 취소 버튼을 누르시면 취소되요!", 5)
            return 5;
        });
    backgroundStore.useGlobalPopup(createFamilyPopup);
}

function popupInviteFamily(emitter: any) {
    const backgroundStore = useBackgroundStore();

    const inviteFamilyPopup = new CurrentPopup(PopupType.NORMAL, "패밀리 초대")
        .addBodyComponent("InviteFamily", {})
        .addButton("초대", () => {
            emitter.emit("validateInviteFamilyForm");
        })
        .addButton("취소", () => {
            backgroundStore.returnGlobalPopup()
            emitter.off("validateInviteFamilyForm")
        });
    backgroundStore.useGlobalPopup(inviteFamilyPopup);
}

function popupRequestJoinFamily(emitter: any) {
    const backgroundStore = useBackgroundStore();

    const joinRequestPopup = new CurrentPopup(PopupType.NORMAL, "초대코드 입력")
        .addBodyComponent("FamilyInviteCode", {})
        .addButton("가입 요청", () => emitter.emit("validateInviteCodeForm"))
        .addButton("취소", () => {
            backgroundStore.returnGlobalPopup()
            emitter.off("validateInviteCodeForm")
        });

    backgroundStore.useGlobalPopup(joinRequestPopup);

}

function confirm(title: string, message: string, ifConfirm: () => void) {
    const backgroundStore = useBackgroundStore();

    const confirmPopup = new CurrentPopup(PopupType.NORMAL, title, message)
        .addButton("확인", () => {
            ifConfirm();
            backgroundStore.returnGlobalPopup()
        })
        .addButton("취소", () => {
            backgroundStore.returnGlobalPopup()
        });

    backgroundStore.useGlobalPopup(confirmPopup);
}

export default {
    popupCreateMission,
    popupCreateFamily,
    popupInviteFamily,
    popupRequestJoinFamily,
    confirm
}
