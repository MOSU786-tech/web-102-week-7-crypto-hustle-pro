const API_BASE_URL = 'https://min-api.cryptocompare.com/data'
const ASSET_BASE_URL = 'https://www.cryptocompare.com'
const API_KEY = import.meta.env.VITE_APP_API_KEY

function buildApiUrl(path, params = {}) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value)
    }
  })

  if (API_KEY) {
    searchParams.set('api_key', API_KEY)
  }

  return `${API_BASE_URL}${path}?${searchParams.toString()}`
}

async function fetchJson(path, params, options = {}) {
  const response = await fetch(buildApiUrl(path, params), options)
  const data = await response.json()

  if (!response.ok || data.Response === 'Error') {
    throw new Error(data.Message || 'CryptoCompare request failed.')
  }

  return data
}

export function assetImageUrl(imagePath) {
  return imagePath ? `${ASSET_BASE_URL}${imagePath}` : '/favicon.svg'
}

export async function fetchTopCoins(limit = 30, options = {}) {
  const data = await fetchJson('/top/totalvolfull', {
    limit,
    tsym: 'USD',
  }, options)

  return data.Data ?? []
}

export async function fetchCoinPrice(symbol, options = {}) {
  return fetchJson('/price', {
    fsym: symbol,
    tsyms: 'USD',
  }, options)
}

export async function fetchCoinDetails(symbol, options = {}) {
  const data = await fetchJson('/all/coinlist', {
    fsym: symbol,
  }, options)

  return data.Data?.[symbol] ?? null
}

export async function fetchCoinHistory(symbol, limit = 7, options = {}) {
  const data = await fetchJson('/v2/histoday', {
    fsym: symbol,
    tsym: 'USD',
    limit,
  }, options)

  return data.Data?.Data ?? []
}

export async function fetchCoinNews(symbol, limit = 6, options = {}) {
  const data = await fetchJson('/v2/news/', {
    lang: 'EN',
    categories: symbol,
  }, options)

  return (data.Data ?? []).slice(0, limit)
}
