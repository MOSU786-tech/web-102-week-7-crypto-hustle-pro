import { Link } from 'react-router'
import { assetImageUrl } from '../utils/cryptoApi'

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

function CoinInfo({ image, name, symbol, currentPrice }) {
  const detailPath = `/coinDetails/${symbol}`

  return (
    <li className="main-list">
      <Link
        className="coin-link"
        to={detailPath}
        aria-label={`Open the ${name} detail page`}
      >
        <img
          className="icons"
          src={assetImageUrl(image)}
          alt={`Small icon for ${name} crypto coin`}
        />
        <span className="coin-name">{name}</span>
        <span className="coin-price">
          {currentPrice !== undefined && currentPrice !== null
            ? priceFormatter.format(currentPrice)
            : 'Loading price...'}
        </span>
      </Link>
    </li>
  )
}

export default CoinInfo
