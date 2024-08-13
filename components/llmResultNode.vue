<script setup lang="ts">
import { NodeResizer } from '@vue-flow/node-resizer'
import {
  Handle,
  Position,
  type ElementData,
  type NodeProps,
} from '@vue-flow/core'
import { computed } from 'vue'
import { marked } from 'marked'
import '@vue-flow/node-resizer/dist/style.css'

interface Props {
  nodeProps: NodeProps<ElementData, object, string>
}

const props = defineProps<Props>()
// const md = new MarkdownIt()

const formattedResponse = computed(() => {
  const content = props.nodeProps.data.response.choices[0].message.content
  // const codePattern = /`([^`]+)`/g
  // const formattedContent = content.replace(codePattern, '<code>$1</code>')
  return marked.parse(content)
})
</script>

<template>
  <Handle type="source" :position="Position.Top" />

  <NodeResizer :min-width="100" :min-height="50" color="transparent" />
  <div
    v-html="formattedResponse"
    class="bg-white rounded-lg shadow-md p-4 h-full w-full max-w-sm"
  ></div>

  <Handle type="target" :position="Position.Bottom" />
</template>
