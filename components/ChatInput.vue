<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <div class="flex items-center justify-between mb-2">
      <input
        v-model="inputValue"
        :placeholder="`Chat with ${selectedModel.name}`"
        class="flex-grow text-lg outline-none mr-4"
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
}

withDefaults(defineProps<Props>(), {
  placeholder: 'How can Claude help you today?',
  modelName: 'Claude 3.5 Sonnet',
})

const inputValue = ref('')
const models = ref<Model[]>([
  { name: 'Claude 3.5 Sonnet', code: 'claude-3-sonnet-20240229' },
  { name: 'Claude 3 Opus', code: 'claude-3-opus-20240229' },
  { name: 'Claude 3 Haiku', code: 'claude-3-haiku-20240307' },
])
const selectedModel = ref(models.value[0])

const emit = defineEmits([
  'update:modelValue',
  'addContent',
  'update:modelName',
  'requestComplete',
])

const selectModel = (model: Model) => {
  selectedModel.value = model
  emit('update:modelName', model)
}

const emitInput = () => {
  emit('update:modelValue', inputValue.value)
}
</script>
