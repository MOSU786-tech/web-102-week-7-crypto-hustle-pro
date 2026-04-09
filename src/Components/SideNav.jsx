import { NavLink } from 'react-router'
import CryptoNews from './CryptoNews'

function SideNav() {
  return (
    <aside className="sidenav">
      {/* NavLink is handy because later you can style the active route without extra state. */}
      <NavLink className="brand-link" to="/">
        Crypto Hustle Pro
      </NavLink>
      <p className="sidebar-copy">
        Track the market, open direct coin pages, and compare price movement without
        leaving the app.
      </p>
      <CryptoNews />
    </aside>
  )
}

export default SideNav
