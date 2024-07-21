<template>
  <div class="markdown-textarea-container">
    <textarea v-if="state.isEditorMode" class="markdown-editor blink-input"
              v-model="state.content" v-on:focusout="() => state.isEditorMode = false"></textarea>
    <div v-else class="markup-content-wrapper" v-html="methods.toMarkUp(state.content)"
         v-on:click="() => state.isEditorMode = true"></div>
  </div>
</template>
<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import { reactive } from 'vue'

const methods = {
  toMarkUp(markdown: string) {
    if (!markdown || markdown === "") return "";

    const md = new MarkdownIt({
      html: true,
      xhtmlOut: true,
    });
    return md.render(markdown);
  }
}
const props = defineProps<{
  content: string
}>();
const state = reactive({
  isEditorMode: false,
  content: props.content
});
</script>
<style scoped lang="scss">
@import '@assets/main';

.markdown-textarea-container {
  padding: 10px 20px;

  .markup-content-wrapper {
    min-height: 40px;
    transition: $duration;
    padding: 5px 12px;
    border-radius: 5px;

    ul {
      list-style: unset;

      li {
        padding-left: 30px;
      }
    }

    &:hover {
      background-color: $standard-light-gray-in-white;
      cursor: pointer;
    }

  }

  .markdown-editor {
    width: 100%;
    border-radius: 5px;
    border: 1px transparent solid;
    resize: none;
    background-color: white;

    &:focus {
      outline: none;
      border: 1px $standard-weight-gray-in-white solid;
    }

  }
}
</style>
