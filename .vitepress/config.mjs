import { defineConfig } from 'vitepress'
import fs from 'fs';
import path from 'path';

function extractTitle(markdownContent) {
  const titleRegex = /title:\s*(.*)\n/;
  const match = markdownContent.match(titleRegex);
  if (match && match[1]) {
    return match[1];
  } else {
    return null;
  }
}

function fetchArticles(directory, isFirstLayer = true) {
  let result = []
  try {
    const files = fs.readdirSync(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        result.push({ text: file, base: isFirstLayer ? `/${directory}/${file}` : `/${file}`, items: fetchArticles(filePath) }) // Recursively read subdirectories
      } else if (file !== 'index.md') {
        result.push({ text: extractTitle(fs.readFileSync(filePath, 'utf8')), link: `/${file}` })
      }
    }
  } catch (err) {
    console.error('Error reading directory:', err);
  }

  //sort results DESC
  result = result.sort((a, b) => b.text.localeCompare(a.text));

  //collapse all folders apart from the first one
  let shouldCollapse = false
  result.map(item => {
    if (item.items) {
      if (!shouldCollapse) {
        item.collapsed = false
        shouldCollapse = true
      }
      else {
        item.collapsed = true
      }
    }
    return item
  })

  return result
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'nl-NL',
  title: "Dive Hearts",
  description: "Snorkel en duik vereniging in omgeving Valkenswaard",
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
