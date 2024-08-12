export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxt/icon'],
  runtimeConfig: {
    public: {
      CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    },
  },
})
