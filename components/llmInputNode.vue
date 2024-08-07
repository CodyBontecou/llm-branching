<script setup lang="ts">
import axios from 'axios'
import type { ElementData, NodeProps } from '@vue-flow/core'
import {
  sendRequest,
  type MessageContent,
  type RequestConfig,
} from '~/lib/sendRequest'

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

const handleSendRequest = async () => {
  const messages: MessageContent[] = [
    { role: 'user', content: userInput.value },
    { role: 'user', content: fileContent.value },
  ]

  const config: Partial<RequestConfig> = {
    apiKey: apiKey.value,
  }

  try {
    const result = await sendRequest(
      messages,
      config,
      data => {
        response.value = JSON.stringify(data, null, 2)
        emit('requestComplete', data, {
          x: props.nodeProps.position.x,
          y: props.nodeProps.position.y,
        })
      },
      error => {
        response.value = 'An error occurred while sending the request.'
      }
    )
  } catch (error) {
    console.error('Error:', error)
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
