import fs from 'fs';
import path from 'path';

export function getStringBeforeNthOccurrence(str, delimiter, n) {
    const parts = str.split(delimiter);
    return parts.slice(0, n).join(delimiter);
}

/**
 * Extracts the title from the given markdown content.
 *
 * @param {string} markdownContent - The markdown content from which to extract the title.
 * @return {string|null} The extracted title, or null if no title is found.
 */
export function extractTitle(markdownContent) {
    const titleRegex = /title:\s*(.*)\n/;
    const match = markdownContent.match(titleRegex);
    if (match && match[1]) {
        return match[1];
    } else {
        return null;
    }
}

/**
 * Fetches the file structure from a given directory.
 *
 * @param {string} directory - The directory to fetch articles from.
 * @return {Array} An array containing the file structure of the chosen directory.
 */
export function fetchFileStructure(directory) {
    let result = []
    try {
        const files = fs.readdirSync(directory);

        for (const file of files) {
            const filePath = path.join(directory, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                result.push({ name: file, children: fetchFileStructure(filePath) }) // Recursively read subdirectories
            } else {
                result.push({ name: file, modifiedAt: new Date(stats.mtime), createdAt: new Date(stats.ctime), content: fs.readFileSync(filePath, 'utf8') })
            }
        }
    } catch (err) {
        console.error('Error reading directory:', err);
    }

    return result
}

/**
 * Fetches articles from a given directory.
 *
 * @param {string} directory - The directory to fetch articles from.
 * @return {Array} An array of fetched articles.
 */
export function fetchArticles(directory) {
    const restructure = (fileData, isFirstLayer = true) => {
        let result = null
        if (fileData.children != null) {
            result = { text: fileData.name, base: isFirstLayer ? `/${directory}/${fileData.name}` : `/${fileData.name}`, items: fileData.children.map(child => restructure(child, false)) } // Recursively restructure
        } else if (fileData !== 'index.md') {
            result = { text: extractTitle(fileData.content), link: `/${fileData.name}` }
        }
        return result
    }

    let result = fetchFileStructure(directory).map(fileData => restructure(fileData))

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