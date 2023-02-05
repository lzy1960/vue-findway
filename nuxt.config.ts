// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: true,
  app: {
    head: {
      viewport: 'width=device-width',
      title: 'Vue3 Findway',
      meta: [
        { charset: 'utf-8' },
        {
          key: 'description',
          name: 'description',
          content: 'Vue3 findway visual',
        },
        {
          key: 'name',
          name: 'google-site-verification',
          content: 'W1WLqWMDmqeXOHA0O0K7tSRDbNlJQoGp33OQ2txuhmU',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
  modules: [
    '@unocss/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
  ],
  colorMode: {
    classSuffix: '',
  },
})
