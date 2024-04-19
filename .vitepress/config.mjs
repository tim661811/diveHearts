import { defineConfig } from 'vitepress'
import { fetchArticles } from '../utils'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'nl-NL',
  base: '/diveHearts/',
  title: "Dive Hearts",
  description: "Snorkel en duik vereniging in omgeving Valkenswaard",
  cleanUrls: true,
  themeConfig: {
    logo: '/images/logo.jpg',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Nieuws berichten',
        items: fetchArticles('posts')
      }
    ],

    socialLinks: [
      { icon: 'facebook', link: 'https://www.facebook.com/thijs.dewit.5' }
    ],

    outline: {
      level: 'deep',
    },

    footer: {
      message: 'Released under the MIT License.',
    },
  }
})
