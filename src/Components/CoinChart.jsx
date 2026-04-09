import { useEffect, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { fetchCoinHistory } from '../utils/cryptoApi'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const cleanData = (data) => {
  // The API returns timestamps in seconds, so we convert each point into a readable day label.
  return data.map((item) => ({
    time: new Date(item.time * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    'open price': Number(item.open.toFixed(2)),
  }))
}

const CoinChart = ({ symbol, market }) => {
  const [histData, setHistData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const getCoinHist = async () => {
      setError('')

      try {
        const history = await fetchCoinHistory(symbol, 30, { signal: controller.signal })
        setHistData(cleanData(history))
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          // Route changes can interrupt chart loading, and that is completely fine.
        } else {
          setError(fetchError.message)
        }
      }
    }

    getCoinHist().catch(console.error)

    return () => controller.abort()
  }, [symbol])

  return (
    <div className="detail-card">
      <h2>30-Day Price Chart</h2>
      <p className="chart-copy">
        {symbol} open price over time
        {market ? ` on ${market}` : ''}.
      </p>

      {error ? <div className="error-card chart-error">{error}</div> : null}

      {histData ? (
        <div className="chart-shell">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={histData} margin={{ top: 20, right: 20, left: 12, bottom: 20 }}>
              {/* Label every axis clearly so someone reading the chart instantly knows what they are seeing. */}
              <CartesianGrid strokeDasharray="4 4" stroke="#dbe4f3" />
              <XAxis
                dataKey="time"
                label={{ value: 'Date', position: 'insideBottom', offset: -10 }}
                minTickGap={24}
                stroke="#475569"
              />
              <YAxis
                dataKey="open price"
                label={{ value: 'Open Price (USD)', angle: -90, position: 'insideLeft' }}
                tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                stroke="#475569"
                width={95}
              />
              <Tooltip
                formatter={(value) => currencyFormatter.format(value)}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="open price"
                stroke="#ea580c"
                strokeWidth={3}
                dot={{ r: 3, fill: '#ea580c' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : null}
    </div>
  )
}

export default CoinChart
