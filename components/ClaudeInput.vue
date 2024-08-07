<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <div class="flex items-center justify-between mb-2">
      <input
        v-model="inputValue"
        :placeholder="placeholder"
        class="flex-grow text-lg outline-none mr-4"
        @input="emitInput"
      />
    </div>
    <div class="flex justify-between items-center text-sm text-gray-600">
      <DropdownMenu>
        <DropdownMenuTrigger
          class="flex items-center justify-center focus:outline-none"
        >
          {{ selectedModel }}
          <Icon name="material-symbols:keyboard-arrow-down" class="ml-1" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            v-for="model in models"
            :key="model"
            @click="selectModel(model)"
          >
            {{ model }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

interface Props {
  placeholder?: string
  modelName?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'How can Claude help you today?',
  modelName: 'Claude 3.5 Sonnet',
})

const inputValue = ref('')
const fileContent = ref('')
const selectedModel = ref(props.modelName)
const models = ['Claude 3.5 Sonnet', 'Claude 3 Opus', 'Claude 3 Haiku']
const emit = defineEmits([
  'update:modelValue',
  'addContent',
  'update:modelName',
])

const selectModel = (model: string) => {
  selectedModel.value = model
  emit('update:modelName', model)
}

const emitInput = () => {
  emit('update:modelValue', inputValue.value)
}

const addContent = () => {
  emit('addContent')
}

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
</script>
