<template>
  <div class="mission-comments-container">
    <div class="container-title">
      <span class="title-text">댓글</span>
    </div>
    <TransitionGroup name="fade" tag="ul" class="comments-wrapper">
      <li v-show="state.comments.length === 0" class="no-comment-text" :key="0">댓글이 없습니다.</li>
      <li class="comment-item" :class="{ me: memberInfoStore.memberInfo.id === comment.memberId}"
          v-for="(comment, index) in state.comments"
          :key="index">
        <div class="chatting-balloons-layer">
          <ImageNicknamePair v-if="memberInfoStore.memberInfo.id !== comment.memberId"
                             :option="methods.getMemberInfo(comment.memberId)"/>
          <TransitionGroup tag="ul" class="text-balloons">
            <li class="balloon-item" v-show="commentText" v-for="(commentText, index) in comment.comments" :key="index">
              <span class="comment-text">{{ commentText.content }}</span>
            </li>
          </TransitionGroup>
          <div class="time-area">
            <span class="time-text">{{
                `${TemporalUtil.secondsToTimeStr((comment.minuteAsSecond + TemporalUtil.getOffsetSecond()) % TemporalUtil.SECONDS_IN_DAY, true)}`
              }}</span>
          </div>
        </div>
      </li>
    </TransitionGroup>
    <div class="new-comment-area">
      <ImageNicknamePair :option="state.currentMember as SelectImageOption"/>
      <div class="comments-input">
        <BlinkTextArea ref="commentInput" place-holder="타인을 존중하는 마음으로 댓글을 작성해요!" :on-input="methods.whenCommentInput"/>
        <SimpleButton button-name="작성" :submittable="state.isSubmittable" :click-behavior="methods.submitComment"/>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import {useProfileMemberStore} from "@/stores/ProfileMemberStore";
import SelectImageOption from "@/classes/api-spec/SelectImageOption";
import {onMounted, reactive, ref} from "vue";
import ImageNicknamePair from "@/components/global/ImageNicknamePair.vue";
import BlinkTextArea from "@/components/global/BlinkTextArea.vue";
import SimpleButton from "@/components/global/SimpleButton.vue";
import type {GetStringValueExpose} from "@/types/ExposeType";
import {call} from "@/utils/NetworkUtil";
import MissionState from "@/constant/api-meta/MissionState";
import {RequestBody, ResponseBody} from "@/classes/api-spec/mission-state/CreateMissionComment";
import MissionDetail from "@/classes/MissionDetail";
import type CalendarWeekMission from "@/classes/CalendarWeekMission"
import type MissionComment from "@/classes/api-spec/MissionComment";
import {useOwnFamiliesStore} from "@/stores/OwnFamiliesStore";
import LocalAsset from "@/constant/LocalAsset";
import {useMemberInfoStore} from "@/stores/MemberInfoStore";
import * as GetComments from "@/classes/api-spec/mission-state/GetComments";
import {useFamiliesViewStore} from "@/stores/FamiliesViewStore";
import UserComments from "@/classes/UserComments";
import TemporalUtil from "../../utils/TemporalUtil";

const ownFamiliesStore = useOwnFamiliesStore();
const familiesViewStore = useFamiliesViewStore();
const memberInfoStore = useMemberInfoStore();
const profileMemberStore = useProfileMemberStore();
const commentInput = ref<GetStringValueExpose | null>(null);
const props = defineProps<{
  mission: CalendarWeekMission,
  detail: MissionDetail
}>()
const state = reactive({
  currentMember: SelectImageOption.ofDefault(),
  isSubmittable: false,
  comments: [] as Array<UserComments>,
  notFoundUserOption: SelectImageOption.of(0, "알수없는 유저", LocalAsset.DEFAULT_NO_IMAGE),
  commentGroup: new Map<string, Map<number, MissionComment []>>()
});
const methods = {
  whenCommentInput(event: InputEvent) {
    const comment = commentInput.value?.getValue() ?? "";
    if (comment.length > 0) {
      state.isSubmittable = true;
      return
    }
    state.isSubmittable = false;
  },
  getStateId() {
    return props.detail.schedule.mode.isRepeat()
        ? props.detail.states.find((state) => state.startAt === props.mission.startAt)?.id ?? 0
        : props.detail.states[0]?.id ?? 0;
  },
  submitComment() {
    const comment = commentInput.value?.getValue() ?? "";
    if (comment.length === 0) {
      return;
    }

    //반복일 경우 stateId가 없을수도 있기때문에 찾아서 확인해야하고, 아닌경우는 stateId를 바로 가져다 쓴다.
    const stateId = methods.getStateId();

    const requestBody = RequestBody.of(stateId, props.detail.id, comment, props.mission.startAt);
    call<RequestBody, ResponseBody>(MissionState.CreateComment, requestBody, (response) => {
      const responseBody = ResponseBody.fromJson(response.data);
      const textArea = commentInput.value?.getInput() as HTMLTextAreaElement;
      textArea.value = "";
      methods.fetchComments();
    });
  },
  getMemberInfo(memberId: number): SelectImageOption {
    if (ownFamiliesStore.hasSelectFamily) {
      const found = familiesViewStore.members.find((member) => member.id === memberId);
      return found
          ? SelectImageOption.of(found.id, found.name, found.image)
          : state.notFoundUserOption as SelectImageOption;
    }
    throw new Error(`Illegal state with: ${memberId}`)
  },
  fetchComments() {
    call<any, GetComments.ResponseBody>(MissionState.GetComments, {stateId: methods.getStateId()}, (response) => {
      const responseBody = GetComments.ResponseBody.fromJson(response.data);
      state.comments = responseBody.comments.sort((a, b) => a.createdAt.timestamp - b.createdAt.timestamp)
          .reduce((users, comment) => {
            const modular = comment.createdAt.timestamp % 60;
            const minuteAsComment = comment.createdAt.timestamp - modular;
            if (users.length === 0) {
              users.push(new UserComments(comment.memberId, minuteAsComment, [comment]));
              return users;
            }
            //멤버와 도 같고 같은 분단위이라면 넣는다.
            const lastComments = users[users.length - 1];
            if (lastComments.memberId === comment.memberId && lastComments.minuteAsSecond === minuteAsComment) {
              lastComments.comments.push(comment);
              return users;
            }

            //다른 멤버라면 새로운 유저를 추가한다.
            if (lastComments.memberId !== comment.memberId || lastComments.minuteAsSecond !== minuteAsComment) {
              users.push(new UserComments(comment.memberId, minuteAsComment, [comment]));
              return users;
            }

            return users;
          }, new Array<UserComments>);


    });
  }
}
onMounted(() => {
  state.currentMember = SelectImageOption.ofProfileMember(profileMemberStore.profileMember);
  methods.fetchComments();
})
</script>
<style scoped lang="scss">
@import "@assets/main";

.mission-comments-container {
  display: flex;
  flex-direction: column;
  padding: 5px 10px;

  .container-title {

    .title-text {
      font-size: 1rem;
      font-weight: bold;
      color: $soft-dark;
    }

  }

  .comments-wrapper {
    display: flex;
    flex-direction: column;
    max-height: 400px;
    overflow-y: auto;

    .no-comment-text {
      margin: 0 auto;
      padding: 5px 10px;
      display: inline-block;
      font-weight: bold;
      font-size: .84rem;
      line-height: 1;
      border-radius: 15px;
      color: $standard-dark-gray-in-white;
      background-color: $standard-light-gray-in-white;
      user-select: none;
    }

    .comment-item {
      display: flex;
      align-items: flex-start;
      padding: 2px 10px;
      position: relative;
      justify-content: flex-start;
      flex-direction: row;

      .chatting-balloons-layer {
        display: flex;
        flex-direction: column;
        position: relative;
        width: 100%;

        .text-balloons {
          width: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;

          .balloon-item {
            padding: 2px 0;

            .comment-text {
              padding: 5px 10px;
              font-size: .92rem;
              line-height: 1.2;
              background-color: $standard-light-gray-in-white;
              color: $standard-clean-black;
              max-width: 200px;
              width: max-content;
              white-space: pre-wrap;
              word-break: break-all;
              overflow-wrap: break-word; /* 내용이 넘칠 경우 줄바꿈 */

              border-radius: 3px 10px 10px 10px;
              display: inline-block;
              margin-left: 25px;
            }
          }

        }

        .time-area {
          display: flex;
          justify-content: flex-start;

          .time-text {
            width: 100%;
            font-size: .64rem;
            align-items: flex-end;
            padding: 0 5px;
            margin-left: 25px;
          }
        }
      }


      &.me {
        justify-content: flex-end;

        .chatting-balloons-layer {

          .text-balloons {
            justify-content: center;
            align-items: flex-end;


            .comment-text {
              border-radius: 10px 3px 10px 10px;
              background-color: $standard-dark-gray-in-white;
              color: white;
              transition: $duration;

              &:hover {
                background-color: $standard-clean-black;
                cursor: pointer;
              }
            }

          }

          .time-area {
            justify-content: flex-end;

            .time-text {
              text-align: right;
            }
          }
        }
      }
    }
  }

  .new-comment-area {

    .comments-input {
      display: flex;
      flex-direction: column;
      align-items: center;

      .blink-textarea-container:first-child {
        display: flex;
      }

      .simple-button:last-child {
        padding: 3px 10px;
      }
    }
  }
}
</style>
