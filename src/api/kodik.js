// ⚠️ Замени TOKEN на свой токен с kodikres.com
const TOKEN = 'ecc052e27cd7c4fe1c781701a2f574a6'
const BASE = 'https://kodik-api.com'

const request = async (endpoint, params = {}) => {
  const url = new URL(`${BASE}${endpoint}`)
  url.searchParams.set('token', TOKEN)
  url.searchParams.set('with_material_data', 'true')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Kodik API error: ${res.status}`)
  return res.json()
}

// Поиск по названию
export const searchAnime = (query, limit = 20) =>
  request('/search', { title: query, limit, types: 'anime,anime-serial' })

// Список аниме (каталог)
export const getAnimeList = (params = {}) =>
  request('/list', {
    limit: 24,
    types: 'anime,anime-serial',
    with_episodes: 'true',
    ...params
  })

// Получить по shikimori ID
export const getByShikimoriId = (id) =>
  request('/search', { shikimori_id: id, with_episodes: 'true' })

// Топ аниме по рейтингу
export const getTopAnime = (limit = 20) =>
  request('/list', {
    limit,
    types: 'anime-serial',
    sort: 'shikimori_rating',
    order: 'desc',
    with_episodes: 'true'
  })

// По жанру
export const getByGenre = (genre, limit = 24) =>
  request('/list', {
    limit,
    types: 'anime,anime-serial',
    genre: genre
  })

// Недавно обновлённые
export const getRecent = (limit = 20) =>
  request('/list', {
    limit,
    types: 'anime,anime-serial',
    sort: 'updated_at',
    order: 'desc'
  })
