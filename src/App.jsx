import { Outlet, Route, Routes } from 'react-router'
import SideNav from './Components/SideNav'
import HomePage from './pages/HomePage'
import DetailView from './routes/DetailView'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

function AppLayout() {
  return (
    <div className="app-shell">
      {/* A layout route is a clean Router pattern: shared UI lives once, pages swap in below it. */}
      <SideNav />
      <main className="whole-page">
        <Outlet />
      </main>
    </div>
  )
}

function App() {
  return (
    <Routes>
      {/* Nested routes let us keep the sidebar visible on home, detail, and 404 pages. */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        {/* Step 2 lab route: the symbol part of the URL tells the page which coin to load. */}
        <Route path="coinDetails/:symbol" element={<DetailView />} />
        {/* Keeping the older route as a friendly alias avoids broken links while we iterate. */}
        <Route path="coins/:symbol" element={<DetailView />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
