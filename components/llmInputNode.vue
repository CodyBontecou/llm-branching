<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Claude API Interaction</h1>

    <div class="mb-4">
      <label for="apiKey" class="block mb-2">API Key:</label>
      <input
        v-model="apiKey"
        type="password"
        id="apiKey"
        class="w-full p-2 border rounded"
        placeholder="Enter your Anthropic API key"
      />
    </div>

    <div class="mb-4">
      <label for="userInput" class="block mb-2">User Input:</label>
      <textarea
        v-model="userInput"
        id="userInput"
        class="w-full p-2 border rounded"
        rows="4"
        placeholder="Enter your message to Claude"
      ></textarea>
    </div>

    <div class="mb-4">
      <label for="fileInput" class="block mb-2">File Input:</label>
      <input
        type="file"
        id="fileInput"
        @change="handleFileInput"
        class="w-full p-2 border rounded"
      />
    </div>

    <button
      @click="sendRequest"
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Send Request
    </button>

    <div v-if="response" class="mt-4">
      <h2 class="text-xl font-bold mb-2">Response:</h2>
      <pre class="bg-gray-100 p-4 rounded">{{ response }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const apiKey = ref('')
const userInput = ref('')
const fileContent = ref('')
const response = ref('')

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
  } catch (error) {
    console.error('Error:', error)
    response.value = 'An error occurred while sending the request.'
  }
}
</script>
