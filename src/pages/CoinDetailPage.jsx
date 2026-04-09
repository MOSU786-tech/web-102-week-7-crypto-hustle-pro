import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  assetImageUrl,
  fetchCoinDetails,
  fetchCoinHistory,
  fetchCoinPrice,
} from '../utils/cryptoApi'
import CryptoNews from '../Components/CryptoNews'
import NotFoundPage from './NotFoundPage'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

function CoinDetailPage() {
  const { symbol = '' } = useParams()
  const normalizedSymbol = symbol.toUpperCase()
  const [coinDetails, setCoinDetails] = useState(null)
  const [priceHistory, setPriceHistory] = useState([])
  const [currentPrice, setCurrentPrice] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isMissingCoin, setIsMissingCoin] = useState(false)

  useEffect(() => {
    const loadCoinPage = async () => {
      setIsLoading(true)
      setError('')
      setIsMissingCoin(false)

      try {
        // Promise.all keeps independent API calls parallel, which is a good habit on data pages.
        const [detailData, historyData, priceData] = await Promise.all([
          fetchCoinDetails(normalizedSymbol),
          fetchCoinHistory(normalizedSymbol),
          fetchCoinPrice(normalizedSymbol),
        ])

        if (!detailData) {
          setIsMissingCoin(true)
          return
        }

        setCoinDetails(detailData)
        setPriceHistory(historyData)
        setCurrentPrice(priceData?.USD ?? null)
      } catch (fetchError) {
        setError(fetchError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadCoinPage().catch(console.error)
  }, [normalizedSymbol])

  if (isLoading) {
    return <div className="loading-card">Loading {normalizedSymbol} details...</div>
  }

  if (isMissingCoin) {
    return (
      <NotFoundPage
        title={`No detail page for ${normalizedSymbol}`}
        message="That coin symbol did not return metadata from CryptoCompare."
      />
    )
  }

  if (error) {
    return (
      <section className="detail-page">
        <div className="error-card">
          We hit an API error while loading {normalizedSymbol}.
          <br />
          {error}
        </div>
        <Link className="back-link" to="/">
          Back to the market list
        </Link>
      </section>
    )
  }

  const chartData = priceHistory.map((historyPoint) => ({
    date: new Date(historyPoint.time * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    close: Number(historyPoint.close.toFixed(2)),
  }))

  return (
    <section className="detail-page">
      <Link className="back-link" to="/">
        Back to all coins
      </Link>

      <header className="detail-hero">
        <div className="detail-title-group">
          <img
            className="detail-icon"
            src={assetImageUrl(coinDetails.ImageUrl)}
            alt={`${coinDetails.CoinName} icon`}
          />
          <div>
            <p className="detail-kicker">{coinDetails.Symbol}</p>
            <h1>{coinDetails.CoinName}</h1>
            <p className="detail-price">
              {currentPrice !== null ? currencyFormatter.format(currentPrice) : 'Price unavailable'}
            </p>
          </div>
        </div>

        <div className="detail-meta-grid">
          <article className="stat-card">
            <span className="stat-label">Algorithm</span>
            <strong>{coinDetails.Algorithm || 'Unknown'}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Proof Type</span>
            <strong>{coinDetails.ProofType || 'Unknown'}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Launch Date</span>
            <strong>{coinDetails.AssetLaunchDate || 'Unknown'}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Max Supply</span>
            <strong>
              {coinDetails.MaxSupply && coinDetails.MaxSupply > 0
                ? coinDetails.MaxSupply.toLocaleString()
                : 'Not capped'}
            </strong>
          </article>
        </div>
      </header>

      <article className="detail-card">
        <h2>About {coinDetails.CoinName}</h2>
        <p className="detail-description">
          {coinDetails.Description || 'No description was provided for this asset.'}
        </p>
      </article>

      <article className="detail-card">
        <h2>7-Day Price History</h2>
        <div className="chart-shell">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.75} />
                  <stop offset="95%" stopColor="#fb923c" stopOpacity={0.08} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#dbe4f3" />
              <XAxis dataKey="date" stroke="#475569" />
              <YAxis
                stroke="#475569"
                tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
              />
              <Tooltip formatter={(value) => currencyFormatter.format(value)} />
              <Area
                type="monotone"
                dataKey="close"
                stroke="#ea580c"
                strokeWidth={3}
                fill="url(#priceFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>

      <CryptoNews title={`${coinDetails.CoinName} Headlines`} category={normalizedSymbol} limit={4} />
    </section>
  )
}

export default CoinDetailPage
