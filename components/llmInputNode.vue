<script setup lang="ts">
import axios from 'axios'
import type { ElementData, NodeProps } from '@vue-flow/core'

interface Props {
  nodeProps: NodeProps<ElementData, object, string>
  editMode: boolean
}

const apiKey = ref('')
const userInput = ref('')
const fileContent = ref('')
const response = ref('')
const emit = defineEmits(['requestComplete'])
const props = defineProps<Props>()

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

const sendRequest = async () => {
  try {
    const res = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        messages: [
          { role: 'user', content: userInput.value },
          { role: 'user', content: fileContent.value },
        ],
        model: 'claude-3-opus-20240229',
        max_tokens: 1000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey.value,
        },
      }
    )
    response.value = JSON.stringify(res.data, null, 2)
    emit('requestComplete', res.data, {
      x: props.nodeProps.position.x,
      y: props.nodeProps.position.y,
    })
  } catch (error) {
    console.error('Error:', error)
    response.value = 'An error occurred while sending the request.'
  }
}
</script>

<template>
  <div class="container mx-auto p-4">
    <ChatInput
      v-model="userInput"
      placeholder="How can Claude help you today?"
      modelName="Claude 3.5 Sonnet"
      @addContent="handleFileInput"
    />

    <!-- <div class="mb-4">
      <label for="fileInput" class="block mb-2">File Input:</label>
      <input
        type="file"
        id="fileInput"
        @change="handleFileInput"
        class="w-full p-2 border rounded text-black"
      />
    </div> -->

    <button
      @click="sendRequest"
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Send Request
    </button>

    <div v-if="response" class="mt-4">
      <h2 class="text-xl font-bold mb-2">Response:</h2>
      <pre id="llm-input-response" class="bg-gray-100 p-4 rounded text-black">
        {{ response }}
      </pre>
    </div>
  </div>
</template>
