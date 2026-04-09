import { Link } from 'react-router'

function NotFoundPage({
  title = '404 Coin Not Found',
  message = 'That route does not match a page in Crypto Hustle Pro.',
}) {
  return (
    <section className="not-found-page">
      <div className="not-found-card">
        <p className="detail-kicker">Routing Checkpoint</p>
        <h1>{title}</h1>
        <p>{message}</p>
        <Link className="back-link" to="/">
          Return home
        </Link>
      </div>
    </section>
  )
}

export default NotFoundPage
