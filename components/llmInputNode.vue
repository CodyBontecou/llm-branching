<script setup lang="ts">
import { useVueFlow, type ElementData, type NodeProps } from '@vue-flow/core'
import { NodeResizer } from '@vue-flow/node-resizer'
import {
  sendRequest,
  type MessageContent,
  type Model,
  type RequestConfig,
} from '~/lib/sendRequest'

interface Props {
  nodeProps: NodeProps<ElementData, object, string>
  editMode: boolean
}

const runtimeConfig = useRuntimeConfig()
const userInput = ref('')
const fileContent = ref('')
const selectedModel = ref<Model>({
  name: 'GPT4o Mini',
  code: 'gpt-4o-mini',
  endpoint: 'https://api.openai.com/v1/chat/completions',
})

const getConversationHistory = inject('getConversationHistory')
const emit = defineEmits(['requestComplete', 'responseReceived'])
const props = defineProps<Props>()
const { updateNode } = useVueFlow()

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

const handleSendRequest = async () => {
  updateNode(props.nodeProps.id, {
    data: {
      ...props.nodeProps.data,
      content: userInput.value,
    },
  })
  const history = getConversationHistory(props.nodeProps.id)

  const messages: MessageContent[] = [
    ...history,
    { role: 'user', content: userInput.value },
  ]

  const config: RequestConfig = {
    model: selectedModel.value,
  }

  try {
    await sendRequest(
      messages,
      config,
      runtimeConfig,
      data => {
        emit('requestComplete', data, props.nodeProps.id, {
          x: props.nodeProps.position.x,
          y: props.nodeProps.position.y,
        })
      },
      error => {
        emit('responseReceived', {
          error: 'An error occurred while sending the request.',
        })
      }
    )
  } catch (error) {
    console.error('Error:', error)
  }
}

const updateSelectedModel = (model: Model) => {
  selectedModel.value = model
}
</script>

<template>
  <NodeResizer :min-width="100" :min-height="50" color="transparent" />

  <ChatInput
    class="h-full w-full"
    v-model="userInput"
    placeholder="How can Claude help you today?"
    :model-name="selectedModel.name"
    @addContent="handleFileInput"
    @update:selectedModel="updateSelectedModel"
  />

  <button
    @click="handleSendRequest"
    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  >
    Send Request
  </button>
</template>
