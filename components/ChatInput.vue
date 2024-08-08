<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <div class="flex items-center justify-between mb-2">
      <textarea
        ref="textareaRef"
        v-model="inputValue"
        :placeholder="`Chat with ${selectedModel.name}`"
        class="flex-grow text-lg outline-none mr-4 resize-none overflow-hidden min-h-[40px] w-full min-w-96 overflow-y-scroll"
        @input="emitInput"
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
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  placeholder?: string
  modelName?: string
}

interface Model {
  name: string
  code: string
  endpoint: string
}

withDefaults(defineProps<Props>(), {
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
])

const selectModel = (model: Model) => {
  selectedModel.value = model
  emit('update:modelName', model.name)
  emit('update:selectedModel', model)
}

const emitInput = () => {
  adjustTextareaHeight()
  emit('update:modelValue', inputValue.value)
}

const adjustTextareaHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    const newHeight = Math.min(textareaRef.value.scrollHeight, 600)
    textareaRef.value.style.height = `${newHeight}px`
  }
}

onMounted(() => {
  adjustTextareaHeight()
})
</script>
