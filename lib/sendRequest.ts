import axios from 'axios'
import type { RuntimeConfig } from 'nuxt/schema'

interface Model {
  name: string
  code: string
  endpoint: string
}

interface RequestConfig {
  model: Model
  maxTokens?: number
}

interface MessageContent {
  role: 'user' | 'assistant'
  content: string
}

const defaultConfig: Partial<RequestConfig> = {
  maxTokens: 1000,
}

const sendRequest = async (
  messages: MessageContent[],
  config: RequestConfig,
  runtimeConfig: RuntimeConfig,
  onSuccess?: (data: any) => void,
  onError?: (error: any) => void
) => {
  const { model, maxTokens } = { ...defaultConfig, ...config }

  const apiKey = model.endpoint.includes('openai.com')
    ? runtimeConfig.public.OPENAI_API_KEY
    : runtimeConfig.public.CLAUDE_API_KEY

  try {
    const res = await axios.post(
      model.endpoint,
      {
        messages,
        model: model.code,
        max_tokens: maxTokens,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
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
export type { RequestConfig, MessageContent, Model }
