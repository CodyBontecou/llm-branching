import axios from 'axios'

interface RequestConfig {
  endpoint: string
  model: string
  apiKey: string
  maxTokens?: number
}

interface MessageContent {
  role: 'user' | 'assistant'
  content: string
}

const defaultConfig: RequestConfig = {
  endpoint: 'https://api.anthropic.com/v1/messages',
  model: 'claude-3-opus-20240229',
  apiKey: '',
  maxTokens: 1000,
}

const sendRequest = async (
  messages: MessageContent[],
  config: Partial<RequestConfig> = {},
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  const { endpoint, model, apiKey, maxTokens } = { ...defaultConfig, ...config }

  try {
    const res = await axios.post(
      endpoint,
      {
        messages,
        model,
        max_tokens: maxTokens,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
      }
    )

    if (onSuccess) {
      onSuccess(res.data)
    }

    return res.data
  } catch (error) {
    console.error('Error:', error)
    if (onError) {
      onError(error)
    }
    throw error
  }
}

export { sendRequest }
export type { RequestConfig, MessageContent }
