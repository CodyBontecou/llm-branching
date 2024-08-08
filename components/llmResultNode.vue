<script setup lang="ts">
import { NodeResizer } from '@vue-flow/node-resizer'
import type { ElementData, NodeProps } from '@vue-flow/core'
import { computed } from 'vue'
import '@vue-flow/node-resizer/dist/style.css'

interface Props {
  nodeProps: NodeProps<ElementData, object, string>
}

const props = defineProps<Props>()

const formattedResponse = computed(() => {
  return JSON.stringify(
    props.nodeProps.data.response.choices[0].message.content,
    null,
    2
  )
})
</script>

<template>
  <NodeResizer :min-width="100" :min-height="50" color="transparent" />
  <div class="bg-white rounded-lg shadow-md p-4 h-full w-full max-w-sm">
    {{ formattedResponse }}
  </div>
</template>
