<script setup lang="ts">
import {
  Handle,
  Position,
  type ElementData,
  type NodeProps,
} from '@vue-flow/core'
import { NodeResizer } from '@vue-flow/node-resizer'
import { type Model } from '~/lib/sendRequest'

interface Props {
  nodeProps: NodeProps<ElementData, object, string>
  editMode: boolean
}

const userInput = ref('')
const fileContent = ref('')
const selectedModel = ref<Model>({
  name: 'GPT4o Mini',
  code: 'gpt-4o-mini',
  endpoint: 'https://api.openai.com/v1/chat/completions',
})

defineProps<Props>()
const emit = defineEmits(['requestComplete', 'responseReceived'])

const handleFileInput = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      fileContent.value = e.target?.result as string
    }
    reader.readAsText(file)
  }
}

const updateSelectedModel = (model: Model) => {
  selectedModel.value = model
}
const forwardRequestComplete = (...args: any[]) => {
  emit('requestComplete', ...args)
}

const forwardRequestResponse = (...args: any[]) => {
  emit('responseReceived', ...args)
}
</script>

<template>
  <NodeResizer :min-width="100" :min-height="50" color="transparent" />

  <ChatInput
    class="h-full w-full"
    v-model="userInput"
    placeholder="How can Claude help you today?"
    :model-name="selectedModel.name"
    :nodeProps="nodeProps"
    @addContent="handleFileInput"
    @update:selectedModel="updateSelectedModel"
    @requestComplete="forwardRequestComplete"
    @responseReceived="forwardRequestResponse"
  />

  <Handle type="target" :position="Position.Bottom" />
</template>
