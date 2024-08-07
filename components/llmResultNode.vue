<script setup lang="ts">
import type { ElementData, NodeProps } from '@vue-flow/core'
import { computed } from 'vue'

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
  <div class="bg-white rounded-lg shadow-md p-4">
    {{ formattedResponse }}
  </div>
</template>
