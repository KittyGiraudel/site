import Fetch from '@11ty/eleventy-fetch'
import { CONFIG } from '../.eleventy.js'
import utilities from '../_plugins/utilities.js'

const STATIC_DATA = {
  'https://github.com/KittyGiraudel/a11y-dialog': utilities.formatNumber(2500),
  'https://github.com/KittyGiraudel/SJSJ': utilities.formatNumber(2300),
  'https://github.com/KittyGiraudel/sass-guidelines': utilities.formatNumber(900),
  'https://github.com/SassDoc/sassdoc': utilities.formatNumber(1400),
}

export default async function () {
  if (!CONFIG.githubStars) {
    return {
      stargazers: STATIC_DATA,
    }
  }

  const repositories = [
    'https://api.github.com/repos/KittyGiraudel/a11y-dialog',
    'https://api.github.com/repos/KittyGiraudel/SJSJ',
    'https://api.github.com/repos/KittyGiraudel/sass-guidelines',
    'https://api.github.com/repos/SassDoc/sassdoc',
  ]

  try {
    const repositoriesData = await Promise.all(
      repositories.map(url => Fetch(url, { duration: '1w', type: 'json' })),
    )

    const data = repositoriesData.reduce((acc, repo) => {
      acc[repo.clone_url.replace('.git', '')] = utilities.formatNumber(repo.stargazers_count)
      return acc
    }, {})

    return {
      stargazers: data,
    }
  } catch (error) {
    console.error(error)
    return {
      stargazers: STATIC_DATA,
    }
  }
}
