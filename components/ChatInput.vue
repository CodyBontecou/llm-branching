<script setup lang="ts">
import { useVueFlow, type ElementData, type NodeProps } from '@vue-flow/core'
import {
  sendRequest,
  type MessageContent,
  type RequestConfig,
} from '~/lib/sendRequest'

interface Props {
  placeholder?: string
  modelName?: string
  nodeProps: NodeProps<ElementData, object, string>
}

interface Model {
  name: string
  code: string
  endpoint: string
}

const runtimeConfig = useRuntimeConfig()
const getConversationHistory = inject('getConversationHistory')
const { updateNode } = useVueFlow()

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'How can Claude help you today?',
  modelName: 'Claude 3.5 Sonnet',
})

const inputValue = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const models = ref<Model[]>([
  {
    name: 'GPT4o Mini',
    code: 'gpt-4o-mini',
    endpoint: 'https://api.openai.com/v1/chat/completions',
  },
  {
    name: 'Claude 3.5 Sonnet',
    code: 'claude-3-sonnet-20240229',
    endpoint: 'https://api.anthropic.com/v1/messages',
  },
  {
    name: 'Claude 3 Opus',
    code: 'claude-3-opus-20240229',
    endpoint: 'https://api.anthropic.com/v1/messages',
  },
  {
    name: 'Claude 3 Haiku',
    code: 'claude-3-haiku-20240307',
    endpoint: 'https://api.anthropic.com/v1/messages',
  },
])
const selectedModel = ref(models.value[0])

const emit = defineEmits([
  'update:modelValue',
  'addContent',
  'update:modelName',
  'update:selectedModel',
  'requestComplete',
  'responseReceived',
])

const selectModel = (model: Model) => {
  selectedModel.value = model
  emit('update:modelName', model.name)
  emit('update:selectedModel', model)
}

const adjustTextareaHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    const newHeight = Math.min(textareaRef.value.scrollHeight, 600)
    textareaRef.value.style.height = `${newHeight}px`
  }
}

const handleSendRequest = async () => {
  updateNode(props.nodeProps.id, {
    data: {
      ...props.nodeProps.data,
      content: inputValue.value,
    },
  })
  // @ts-expect-error: Provide/Inject unknown
  const history = getConversationHistory(props.nodeProps.id)

  const messages: MessageContent[] = [
    ...history,
    { role: 'user', content: inputValue.value },
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

onMounted(() => {
  adjustTextareaHeight()
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <div class="flex items-center justify-between mb-2">
      <textarea
        ref="textareaRef"
        v-model="inputValue"
        :placeholder="`Chat with ${selectedModel.name}`"
        class="flex-grow text-lg outline-none mr-4 resize-none overflow-hidden min-h-[40px] w-full min-w-96 overflow-y-scroll"
      />
    </div>
    <div class="flex justify-between items-center text-sm text-gray-600">
      <DropdownMenu>
        <DropdownMenuTrigger
          class="flex items-center justify-center focus:outline-none"
        >
          {{ selectedModel.name }}
          <Icon name="material-symbols:keyboard-arrow-down" class="ml-1" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            v-for="model in models"
            :key="model.code"
            @click="selectModel(model)"
          >
            {{ model.name }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <button
        @click="handleSendRequest"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Send Request
      </button>
    </div>
  </div>
</template>
