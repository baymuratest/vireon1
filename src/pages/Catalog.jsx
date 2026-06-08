import React, { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import AnimeGrid from '../components/AnimeGrid'
import { getAnimeList, getTopAnime, getRecent, getByGenre } from '../api/kodik'

const GENRES = ['Все', 'экшн', 'комедия', 'романтика', 'фэнтези', 'драма', 'триллер', 'ужасы', 'спорт', 'повседневность']

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [nextPage, setNextPage] = useState(null)
  const [genre, setGenre] = useState(params.get('genre') || 'Все')
  const [sort, setSort] = useState(params.get('sort') || 'top')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      let data
      if (genre !== 'Все') {
        data = await getByGenre(genre, 24)
      } else if (sort === 'recent') {
        data = await getRecent(24)
      } else {
        data = await getTopAnime(24)
      }
      setItems(data?.results || [])
      setNextPage(data?.next_page || null)
    } finally {
      setLoading(false)
    }
  }, [genre, sort])

  useEffect(() => { load() }, [load])

  const loadMore = async () => {
    if (!nextPage) return
    setLoading(true)
    try {
      const res = await fetch(`${nextPage}&token=ecc052e27cd7c4fe1c781701a2f574a6&with_material_data=true`)
      const data = await res.json()
      setItems(p => [...p, ...(data?.results || [])])
      setNextPage(data?.next_page || null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ paddingTop: 100, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 32 }}>
        Каталог <span className="gradient-text">аниме</span>
      </h1>

      {/* Filters */}
      <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Sort */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[['top', '⭐ По рейтингу'], ['recent', '🆕 Новинки']].map(([val, label]) => (
            <button key={val} onClick={() => { setSort(val); setGenre('Все') }} style={{
              padding: '9px 18px', borderRadius: 10, border: 'none',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: sort === val && genre === 'Все'
                ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                : 'var(--bg-card)',
              color: sort === val && genre === 'Все' ? 'white' : 'var(--text-secondary)',
              border: `1px solid ${sort === val && genre === 'Все' ? 'transparent' : 'var(--border)'}`,
              transition: 'all 0.2s'
            }}>{label}</button>
          ))}
        </div>

        {/* Genres */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {GENRES.map(g => (
            <button key={g} onClick={() => setGenre(g)} style={{
              padding: '7px 16px', borderRadius: 8, border: 'none',
              cursor: 'pointer', fontSize: 13, fontWeight: 500,
              background: genre === g
                ? 'rgba(124,58,237,0.2)'
                : 'rgba(255,255,255,0.05)',
              color: genre === g ? 'var(--accent-light)' : 'var(--text-secondary)',
              border: `1px solid ${genre === g ? 'rgba(124,58,237,0.4)' : 'var(--border)'}`,
              transition: 'all 0.2s'
            }}>{g}</button>
          ))}
        </div>
      </div>

      <AnimeGrid items={items} loading={loading} />

      {nextPage && !loading && (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button onClick={loadMore} style={{
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            border: 'none', borderRadius: 12,
            padding: '14px 40px', color: 'white',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(124,58,237,0.3)'
          }}>Загрузить ещё</button>
        </div>
      )}
    </div>
  )
}
