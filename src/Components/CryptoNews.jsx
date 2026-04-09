import { useEffect, useState } from 'react'
import { fetchCoinNews } from '../utils/cryptoApi'

function CryptoNews({ title = 'Latest Crypto News', category = '', limit = 6 }) {
  const [newsList, setNewsList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadNews = async () => {
      try {
        const articles = await fetchCoinNews(category, limit, { signal: controller.signal })
        setNewsList(articles)
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          // Abort is expected during navigation, so we quietly ignore it.
        } else {
          setError(fetchError.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadNews().catch(console.error)

    return () => controller.abort()
  }, [category, limit])

  return (
    <section className="crypto-news">
      <h2>{title}</h2>
      <ul>
        {isLoading ? <li className="news-item">Loading news...</li> : null}

        {!isLoading && error ? (
          <li className="news-item">
            News is unavailable right now.
            <br />
            {error}
          </li>
        ) : null}

        {!isLoading && !error && newsList.length ? (
          newsList.map((article) => (
            <li key={article.id} className="news-item">
              <a href={article.url} target="_blank" rel="noreferrer">
                {article.title}
              </a>
            </li>
          ))
        ) : null}

        {!isLoading && !error && !newsList.length ? (
          <li className="news-item">No matching articles were returned for this coin yet.</li>
        ) : null}
      </ul>
    </section>
  )
}

export default CryptoNews
