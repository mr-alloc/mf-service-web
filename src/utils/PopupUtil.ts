import {CurrentPopup, PopupType} from "@/stores/status/CurrentPopup";
import {AlertType, useAlertStore} from "@/stores/AlertStore";
import {useBackgroundStore} from "@/stores/BackgroundStore";
import MissionType from "@/constant/MissionType";
import {useCalendarStore} from "@/stores/CalendarStore";
import type CalendarMission from "@/classes/CalendarMission";

function popupCreateMission(emitter: any, timestamp: number) {
    const backgroundStore = useBackgroundStore();

    const createMissionPopup = new CurrentPopup(PopupType.NORMAL, `미션 생성`)
        .addBodyComponent("CreateMission", {timestamp: timestamp})
        .addButton("생성", () => {
            emitter.emit("validateCreateMissionForm");
        })
        .addButton("취소", () => {
            backgroundStore.returnGlobalPopup();
            emitter.off("validateCreateMissionForm");
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
            alertStore.alert(AlertType.WARNING, "패밀리 생성 취소", "이 메세지가 사라지기 전까지 한번 더 취소 버튼을 누르시면 취소돼요!", 5)
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

function popupMissionDetail(mission: CalendarMission) {
    const backgroundStore = useBackgroundStore();

    const missionDetailPopup = new CurrentPopup(PopupType.NORMAL, `${MissionType.fromValue(mission.type).name} 상세정보`)
        .addBodyComponent("MissionDetail", {missionId: mission.id})
        .addButton("닫기", () => backgroundStore.returnGlobalPopup())
        .addProgress();

    backgroundStore.useGlobalPopup(missionDetailPopup);
}

function confirm(title: string, message: string, ifConfirm: () => void, ifCancel?: () => void) {
    const backgroundStore = useBackgroundStore();

    const confirmPopup = new CurrentPopup(PopupType.NORMAL, title, message)
        .addButton("확인", () => {
            ifConfirm();
            backgroundStore.returnGlobalPopup()
        })
        .addButton("취소", () => {
            ifCancel && ifCancel();
            backgroundStore.returnGlobalPopup()
        });

    backgroundStore.useGlobalPopup(confirmPopup);
}

function alert(title: string, message: string) {
    const backgroundStore = useBackgroundStore();

    const alertPopup = new CurrentPopup(PopupType.NORMAL, title, message)
        .addButton("확인", () => {
            backgroundStore.returnGlobalPopup()
        });

    backgroundStore.useGlobalPopup(alertPopup);
}

function innerConfirm(title: string, description: string, ifConfirm: () => void, ifCancel?: () => void) {
    const backgroundStore = useBackgroundStore();

    const confirmPopup = new CurrentPopup(PopupType.NORMAL, title, description)
        .addButton("확인", () => {
            ifConfirm();
            backgroundStore.returnInnerPopup()
        })
        .addButton("취소", () => {
            ifCancel && ifCancel();
            backgroundStore.returnInnerPopup()
        });

    backgroundStore.useInnerPopup(confirmPopup);
}

function innerAlert(type: PopupType, title: string, description: string) {
    const backgroundStore = useBackgroundStore();

    const alertPopup = new CurrentPopup(type, title, description)
        .addButton("확인", () => {
            backgroundStore.returnInnerPopup()
        });

    backgroundStore.useInnerPopup(alertPopup);
}

function popupCreateAnniversary(emitter: any) {
    const calendarStore = useCalendarStore();
    const backgroundStore = useBackgroundStore();

    const currentPopup = new CurrentPopup(PopupType.NORMAL, "휴가 또는 기념일 생성")
        .addBodyComponent("CreateAnniversary", {
            timestamp: calendarStore.timestamp,
        })
        .addButton("생성", () => {
            emitter.emit("validateCreateAnniversaryForm");
        })
        .addButton("취소", () => {
            backgroundStore.returnGlobalPopup();
            emitter.off("validateCreateAnniversaryForm");
        });

    backgroundStore.useGlobalPopup(currentPopup);
}

export default {
    popupCreateMission,
    popupCreateFamily,
    popupInviteFamily,
    popupRequestJoinFamily,
    popupMissionDetail,
    confirm,
    alert,
    innerConfirm,
    innerAlert,
    popupCreateAnniversary,
}
