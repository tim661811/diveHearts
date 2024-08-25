import { defineConfig } from 'vitepress'
import { fetchArticles, getStringBeforeNthOccurrence } from '../utils'

const articles = fetchArticles('posts')

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'nl-NL',
  title: "Dive Hearts",
  description: "Snorkel en duik vereniging in omgeving Valkenswaard",
  cleanUrls: true,
  lastUpdated: true,
  appearance: false,

  themeConfig: {
    logo: '/images/logo.jpg',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Nieuws berichten', link: articles.at(0).base + articles.at(0).items.at(0).link, activeMatch: getStringBeforeNthOccurrence(articles.at(0).base, '/', 2) }
    ],

    sidebar: [
      {
        text: 'Nieuws berichten',
        items: articles
      }
    ],

    socialLinks: [
      { icon: 'facebook', link: 'https://www.facebook.com/people/Onderwatersport-vereniging-Dive-Hearts/61564223949194/' }
    ],

    outline: {
      level: 'deep',
    },

    footer: {
      message: 'Released under the MIT License.',
    },

    head: [
      ['link', { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" }],
      ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" }],
      ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" }],
      ['link', { rel: "manifest", href: "/site.webmanifest" }],
      ['link', { rel: "shortcut icon", href: "/favicon.ico" }],
    ],
  }
})
