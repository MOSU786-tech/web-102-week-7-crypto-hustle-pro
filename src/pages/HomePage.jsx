import { useEffect, useState } from 'react'
import CoinInfo from '../Components/CoinInfo'
import { fetchTopCoins } from '../utils/cryptoApi'

function HomePage() {
  const [coins, setCoins] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadCoins = async () => {
      try {
        const coinData = await fetchTopCoins(30, { signal: controller.signal })
        setCoins(coinData)
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          // We intentionally stop this request when the page unmounts or the route changes.
        } else {
          setError(fetchError.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadCoins().catch(console.error)

    return () => controller.abort()
  }, [])

  const normalizedSearch = searchInput.trim().toLowerCase()
  const visibleCoins = coins.filter((coinData) => {
    const coinInfo = coinData?.CoinInfo

    if (!coinInfo || coinInfo.Algorithm === 'N/A' || coinInfo.ProofType === 'N/A') {
      return false
    }

    if (!normalizedSearch) {
      return true
    }

    // Search both fields so users can type "btc" or "bitcoin" and still win.
    return (
      coinInfo.Name.toLowerCase().includes(normalizedSearch) ||
      coinInfo.FullName.toLowerCase().includes(normalizedSearch)
    )
  })

  return (
    <>
      <h1>Crypto Hustle Pro</h1>
      <p className="intro-text">
        Search the market, then open any coin to see its description, algorithm, and
        recent price history.
      </p>

      <input
        className="search-input"
        type="text"
        placeholder="Search by symbol or name..."
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
      />

      {isLoading ? <div className="loading-card">Loading live crypto data...</div> : null}

      {error ? (
        <div className="error-card">
          The market feed could not be loaded right now.
          <br />
          {error}
        </div>
      ) : null}

      {!isLoading && !error ? (
        <ul className="coin-list">
          {visibleCoins.map((coinData) => (
            <CoinInfo
              key={coinData.CoinInfo.Name}
              image={coinData.CoinInfo.ImageUrl}
              name={coinData.CoinInfo.FullName}
              symbol={coinData.CoinInfo.Name}
              currentPrice={coinData.RAW?.USD?.PRICE}
            />
          ))}
        </ul>
      ) : null}
    </>
  )
}

export default HomePage
