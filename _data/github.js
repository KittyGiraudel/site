import Fetch from '@11ty/eleventy-fetch'

export default async function () {
  const repositories = [
    'https://api.github.com/repos/KittyGiraudel/a11y-dialog',
    'https://api.github.com/repos/KittyGiraudel/SJSJ',
    'https://api.github.com/repos/KittyGiraudel/sass-guidelines',
  ]

  const repositoriesData = await Promise.all(
    repositories.map(url => Fetch(url, { duration: '1w', type: 'json' })),
  )

  const data = repositoriesData.reduce((acc, repo) => {
    acc[repo.clone_url.replace('.git', '')] = repo.stargazers_count
    return acc
  }, {})

  return {
    stargazers: data,
  }
}
