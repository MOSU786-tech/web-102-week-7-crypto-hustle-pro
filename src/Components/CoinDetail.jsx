import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { assetImageUrl, fetchCoinDetails, fetchCoinPrice } from '../utils/cryptoApi'
import CoinChart from './CoinChart'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

function CoinDetail() {
  const { symbol = '' } = useParams()
  const normalizedSymbol = symbol.toUpperCase()
  const [fullDetails, setFullDetails] = useState(null)
  const [priceDetails, setPriceDetails] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    const loadCoinDetails = async () => {
      setIsLoading(true)
      setError('')

      try {
        // Pull metadata and price in parallel so the page loads faster without extra waiting.
        const [coinInfo, livePrice] = await Promise.all([
          fetchCoinDetails(normalizedSymbol, { signal: controller.signal }),
          fetchCoinPrice(normalizedSymbol, { signal: controller.signal }),
        ])

        setFullDetails(coinInfo)
        setPriceDetails(livePrice)
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          // We expect this when the user navigates away before the requests finish.
        } else {
          setError(fetchError.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadCoinDetails().catch(console.error)

    return () => controller.abort()
  }, [normalizedSymbol])

  if (isLoading) {
    return <div className="loading-card">Loading {normalizedSymbol} details...</div>
  }

  if (error || !fullDetails) {
    return (
      <section className="detail-page">
        <div className="error-card">
          We could not find detailed data for <strong>{normalizedSymbol}</strong>.
          <br />
          {error || 'CryptoCompare did not return a matching coin.'}
        </div>
        <Link className="back-link" to="/">
          Back to the home page
        </Link>
      </section>
    )
  }

  const priceData = priceDetails ?? {}

  return (
    <section className="detail-page">
      <Link className="back-link" to="/">
        Back to all coins
      </Link>

      <header className="detail-header-card">
        <img
          className="detail-icon"
          src={assetImageUrl(fullDetails.ImageUrl)}
          alt={`${fullDetails.CoinName} icon`}
        />

        <div className="detail-header-copy">
          <p className="detail-kicker">{fullDetails.Symbol}</p>
          <h1>{fullDetails.CoinName}</h1>
          <p className="detail-price">
            {priceData.USD !== undefined
              ? `${currencyFormatter.format(priceData.USD)} USD`
              : 'Live price unavailable'}
          </p>
          <p className="detail-description">
            {fullDetails.Description || 'No summary was returned for this coin.'}
          </p>
        </div>
      </header>

      <section className="detail-card">
        <h2>Coin Snapshot</h2>

        {/* A plain table is a strong first choice for labeled API data: easy to scan and debug. */}
        <div className="table-wrap">
          <table className="coin-detail-table">
            <tbody>
              <tr>
                <th>Launch Date</th>
                <td>{fullDetails.AssetLaunchDate || 'Unknown'}</td>
              </tr>
              <tr>
                <th>Website</th>
                <td>
                  {fullDetails.AssetWebsiteUrl ? (
                    <a href={fullDetails.AssetWebsiteUrl} target="_blank" rel="noreferrer">
                      {fullDetails.AssetWebsiteUrl}
                    </a>
                  ) : (
                    'Unavailable'
                  )}
                </td>
              </tr>
              <tr>
                <th>Whitepaper</th>
                <td>
                  {fullDetails.AssetWhitepaperUrl ? (
                    <a href={fullDetails.AssetWhitepaperUrl} target="_blank" rel="noreferrer">
                      View whitepaper
                    </a>
                  ) : (
                    'Unavailable'
                  )}
                </td>
              </tr>
              <tr>
                <th>Algorithm</th>
                <td>{fullDetails.Algorithm || 'Unknown'}</td>
              </tr>
              <tr>
                <th>Proof Type</th>
                <td>{fullDetails.ProofType || 'Unknown'}</td>
              </tr>
              <tr>
                <th>Market Cap</th>
                <td>
                  {priceData.USDMKTCAP !== undefined
                    ? currencyFormatter.format(priceData.USDMKTCAP)
                    : 'Unavailable'}
                </td>
              </tr>
              <tr>
                <th>24h Volume</th>
                <td>
                  {priceData.USDVOLUME24HOUR !== undefined
                    ? currencyFormatter.format(priceData.USDVOLUME24HOUR)
                    : 'Unavailable'}
                </td>
              </tr>
              <tr>
                <th>Today&apos;s Open</th>
                <td>
                  {priceData.USDOPEN24HOUR !== undefined
                    ? currencyFormatter.format(priceData.USDOPEN24HOUR)
                    : 'Unavailable'}
                </td>
              </tr>
              <tr>
                <th>Today&apos;s High</th>
                <td>
                  {priceData.USDHIGH24HOUR !== undefined
                    ? currencyFormatter.format(priceData.USDHIGH24HOUR)
                    : 'Unavailable'}
                </td>
              </tr>
              <tr>
                <th>Today&apos;s Low</th>
                <td>
                  {priceData.USDLOW24HOUR !== undefined
                    ? currencyFormatter.format(priceData.USDLOW24HOUR)
                    : 'Unavailable'}
                </td>
              </tr>
              <tr>
                <th>Change From Previous Day</th>
                <td>
                  {priceData.USDCHANGEPCT24HOUR !== undefined
                    ? `${priceData.USDCHANGEPCT24HOUR.toFixed(2)}%`
                    : 'Unavailable'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Pass the symbol down so the chart can request its own time-series data. */}
      <CoinChart symbol={normalizedSymbol} market={priceData.USDLASTMARKET || ''} />
    </section>
  )
}

export default CoinDetail
