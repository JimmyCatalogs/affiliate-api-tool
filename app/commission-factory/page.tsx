'use client'

import { useEffect, useState } from 'react'

interface Merchant {
  Id: number
  Name: string
  Category?: string
  Category2?: string
  CommissionType?: string
  CommissionRate?: number
  CommissionMinimum?: number
  CommissionMaximum?: number
  Status?: string
  AvatarUrl?: string
  Summary?: string
  TargetUrl?: string
  TrackingUrl?: string
}

interface DataFeed {
  Id: number
  Name?: string
  MerchantId?: number
  MerchantName?: string
  Type?: string
  ItemCount?: number
}

interface DataFeedItem {
  Id?: number
  SKU?: string
  Name?: string
  Category?: string
  Description?: string
  Price?: number
  Currency?: string
  ImageUrl?: string
  TargetUrl?: string
  Brand?: string
}

interface Banner {
  Id: number
  MerchantName?: string
  GroupName?: string
  Name?: string
  ImageUrl?: string
  TrackingUrl?: string
  Width?: number
  Height?: number
  ExpiryDate?: string
}

interface Coupon {
  Id: number
  MerchantName?: string
  Description?: string
  Code?: string
  TrackingUrl?: string
  StartDate?: string
  EndDate?: string
  TermsAndConditions?: string
}

interface Promotion {
  Id: number
  MerchantName?: string
  Description?: string
  TrackingUrl?: string
  StartDate?: string
  EndDate?: string
  TermsAndConditions?: string
}

interface Transaction {
  Id: number
  DateCreated?: string
  MerchantName?: string
  Status2?: string
  Commission?: number
  SaleValue?: number
}

export default function CommissionFactoryPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [datafeeds, setDatafeeds] = useState<DataFeed[]>([])
  const [loadingMerchants, setLoadingMerchants] = useState(true)
  const [loadingFeeds, setLoadingFeeds] = useState(true)
  const [errorMerchants, setErrorMerchants] = useState<string | null>(null)
  const [errorFeeds, setErrorFeeds] = useState<string | null>(null)

  const [selectedFeedId, setSelectedFeedId] = useState<number | null>(null)
  const [feedItems, setFeedItems] = useState<DataFeedItem[]>([])
  const [loadingItems, setLoadingItems] = useState(false)
  const [errorItems, setErrorItems] = useState<string | null>(null)

  const [banners, setBanners] = useState<Banner[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingBanners, setLoadingBanners] = useState(true)
  const [loadingCoupons, setLoadingCoupons] = useState(true)
  const [loadingPromotions, setLoadingPromotions] = useState(true)
  const [loadingTransactions, setLoadingTransactions] = useState(true)
  const [errorBanners, setErrorBanners] = useState<string | null>(null)
  const [errorCoupons, setErrorCoupons] = useState<string | null>(null)
  const [errorPromotions, setErrorPromotions] = useState<string | null>(null)
  const [errorTransactions, setErrorTransactions] = useState<string | null>(null)

  const [merchantSearch, setMerchantSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')

  function fetchMerchants() {
    setLoadingMerchants(true)
    setErrorMerchants(null)
    fetch('/api/commission-factory/merchants')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setMerchants(Array.isArray(data) ? data : [])
      })
      .catch((e) => setErrorMerchants(e.message))
      .finally(() => setLoadingMerchants(false))
  }

  function fetchDatafeeds() {
    setLoadingFeeds(true)
    setErrorFeeds(null)
    fetch('/api/commission-factory/datafeeds')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setDatafeeds(Array.isArray(data) ? data : [])
      })
      .catch((e) => setErrorFeeds(e.message))
      .finally(() => setLoadingFeeds(false))
  }

  function fetchBanners() {
    setLoadingBanners(true)
    setErrorBanners(null)
    fetch('/api/commission-factory/banners')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setBanners(Array.isArray(data) ? data : [])
      })
      .catch((e) => setErrorBanners(e.message))
      .finally(() => setLoadingBanners(false))
  }

  function fetchCoupons() {
    setLoadingCoupons(true)
    setErrorCoupons(null)
    fetch('/api/commission-factory/coupons')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setCoupons(Array.isArray(data) ? data : [])
      })
      .catch((e) => setErrorCoupons(e.message))
      .finally(() => setLoadingCoupons(false))
  }

  function fetchPromotions() {
    setLoadingPromotions(true)
    setErrorPromotions(null)
    fetch('/api/commission-factory/promotions')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setPromotions(Array.isArray(data) ? data : [])
      })
      .catch((e) => setErrorPromotions(e.message))
      .finally(() => setLoadingPromotions(false))
  }

  function fetchTransactions() {
    setLoadingTransactions(true)
    setErrorTransactions(null)
    fetch('/api/commission-factory/transactions')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setTransactions(Array.isArray(data) ? data : [])
      })
      .catch((e) => setErrorTransactions(e.message))
      .finally(() => setLoadingTransactions(false))
  }

  useEffect(() => {
    fetchMerchants()
    setTimeout(fetchDatafeeds, 400)
    setTimeout(fetchBanners, 800)
    setTimeout(fetchCoupons, 1200)
    setTimeout(fetchPromotions, 1600)
    setTimeout(fetchTransactions, 2000)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function loadFeedItems(feedId: number) {
    setSelectedFeedId(feedId)
    setFeedItems([])
    setErrorItems(null)
    setLoadingItems(true)
    setProductSearch('')
    fetch(`/api/commission-factory/datafeeds/${feedId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        const items = data.Items ?? data.items ?? []
        setFeedItems(Array.isArray(items) ? items : [])
      })
      .catch((e) => setErrorItems(e.message))
      .finally(() => setLoadingItems(false))
  }

  const filteredMerchants = merchants.filter(
    (m) =>
      m.Name?.toLowerCase().includes(merchantSearch.toLowerCase()) ||
      m.Category?.toLowerCase().includes(merchantSearch.toLowerCase())
  )

  const filteredItems = feedItems.filter(
    (item) =>
      item.Name?.toLowerCase().includes(productSearch.toLowerCase()) ||
      item.Category?.toLowerCase().includes(productSearch.toLowerCase()) ||
      item.Brand?.toLowerCase().includes(productSearch.toLowerCase())
  )

  const selectedFeed = datafeeds.find((f) => f.Id === selectedFeedId)

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Merchants
            {!loadingMerchants && (
              <span className="ml-2 text-sm font-normal text-slate-400 dark:text-slate-500">
                ({filteredMerchants.length} of {merchants.length})
              </span>
            )}
          </h2>
          <input
            type="text"
            placeholder="Search by name or category..."
            value={merchantSearch}
            onChange={(e) => setMerchantSearch(e.target.value)}
            className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm w-64 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          />
        </div>

        {loadingMerchants && (
          <div className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading merchants...</div>
        )}

        {errorMerchants && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400 flex items-center justify-between gap-4">
            <span>{errorMerchants}</span>
            <button onClick={fetchMerchants} className="shrink-0 rounded-md bg-red-100 dark:bg-red-900/40 px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors">Retry</button>
          </div>
        )}

        {!loadingMerchants && !errorMerchants && filteredMerchants.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-slate-400">No merchants found.</div>
        )}

        {!loadingMerchants && !errorMerchants && filteredMerchants.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Merchant</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Commission</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Data Feeds</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredMerchants.map((m) => {
                  const merchantFeeds = datafeeds.filter((f) => f.MerchantId === m.Id)
                  return (
                    <tr key={m.Id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-2">
                          {m.AvatarUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={m.AvatarUrl}
                              alt={m.Name}
                              className="h-6 w-auto object-contain"
                            />
                          )}
                          <div>
                            <div>{m.Name}</div>
                            {m.Summary && (
                              <div className="text-xs text-slate-400 dark:text-slate-500 font-normal line-clamp-1 max-w-xs">
                                {m.Summary}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {[m.Category, m.Category2].filter(Boolean).join(', ') || '-'}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {m.CommissionType
                          ? `${m.CommissionType}: ${m.CommissionRate ?? '?'}%`
                          : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            m.Status === 'Active'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {m.Status ?? '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {loadingFeeds ? (
                          <span className="text-slate-400 dark:text-slate-500 text-xs">Loading...</span>
                        ) : merchantFeeds.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {merchantFeeds.map((f) => (
                              <button
                                key={f.Id}
                                onClick={() => loadFeedItems(f.Id)}
                                className={`text-xs rounded-md px-2 py-0.5 border transition-colors ${
                                  selectedFeedId === f.Id
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                                }`}
                              >
                                {f.Name ?? `Feed #${f.Id}`}
                                {f.ItemCount != null && ` (${f.ItemCount})`}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-xs">None</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedFeedId !== null && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Products — {selectedFeed?.MerchantName ?? ''}{' '}
              {selectedFeed?.Name ? `· ${selectedFeed.Name}` : ''}
              {!loadingItems && (
                <span className="ml-2 text-sm font-normal text-slate-400 dark:text-slate-500">
                  ({filteredItems.length} of {feedItems.length})
                </span>
              )}
            </h2>
            <input
              type="text"
              placeholder="Search products..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm w-64 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
          </div>

          {loadingItems && (
            <div className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading products...</div>
          )}

          {errorItems && (
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
              {errorItems}
            </div>
          )}

          {!loadingItems && !errorItems && filteredItems.length === 0 && (
            <div className="text-sm text-slate-500 dark:text-slate-400">No products found.</div>
          )}

          {!loadingItems && !errorItems && filteredItems.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.slice(0, 100).map((item, i) => (
                <a
                  key={item.Id ?? i}
                  href={item.TargetUrl ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                >
                  {item.ImageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.ImageUrl}
                      alt={item.Name ?? ''}
                      className="w-full h-40 object-contain bg-slate-50 dark:bg-slate-800 p-2"
                    />
                  )}
                  <div className="p-3">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {item.Name}
                    </p>
                    {item.Brand && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.Brand}</p>
                    )}
                    {item.Category && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{item.Category}</p>
                    )}
                    {item.Price != null && (
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                        {item.Currency ?? ''} {item.Price}
                      </p>
                    )}
                    {item.SKU && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">SKU: {item.SKU}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
          {!loadingItems && filteredItems.length > 100 && (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Showing first 100 of {filteredItems.length} products. Use the search box to filter.
            </p>
          )}
        </section>
      )}

      {/* Banners */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Banners
          {!loadingBanners && (
            <span className="ml-2 text-sm font-normal text-slate-400 dark:text-slate-500">
              ({banners.length})
            </span>
          )}
        </h2>

        {loadingBanners && (
          <div className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading banners...</div>
        )}
        {errorBanners && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400 flex items-center justify-between gap-4">
            <span>{errorBanners}</span>
            <button onClick={fetchBanners} className="shrink-0 rounded-md bg-red-100 dark:bg-red-900/40 px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors">Retry</button>
          </div>
        )}
        {!loadingBanners && !errorBanners && banners.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-slate-400">No banners found.</div>
        )}
        {!loadingBanners && !errorBanners && banners.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {banners.map((b) => (
              <a
                key={b.Id}
                href={b.TrackingUrl ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
              >
                {b.ImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={b.ImageUrl}
                    alt={b.Name ?? b.GroupName ?? ''}
                    className="w-full h-32 object-contain bg-slate-50 dark:bg-slate-800 p-2"
                  />
                )}
                <div className="p-3">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {b.MerchantName}
                  </p>
                  {b.GroupName && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{b.GroupName}</p>
                  )}
                  {b.Width != null && b.Height != null && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{b.Width}×{b.Height}</p>
                  )}
                  {b.ExpiryDate && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      Expires: {new Date(b.ExpiryDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Coupons */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Coupons
          {!loadingCoupons && (
            <span className="ml-2 text-sm font-normal text-slate-400 dark:text-slate-500">
              ({coupons.length})
            </span>
          )}
        </h2>

        {loadingCoupons && (
          <div className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading coupons...</div>
        )}
        {errorCoupons && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400 flex items-center justify-between gap-4">
            <span>{errorCoupons}</span>
            <button onClick={fetchCoupons} className="shrink-0 rounded-md bg-red-100 dark:bg-red-900/40 px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors">Retry</button>
          </div>
        )}
        {!loadingCoupons && !errorCoupons && coupons.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-slate-400">No coupons found.</div>
        )}
        {!loadingCoupons && !errorCoupons && coupons.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Merchant</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Dates</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {coupons.map((c) => (
                  <tr key={c.Id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">{c.MerchantName ?? '-'}</td>
                    <td className="px-4 py-3">
                      {c.Code ? (
                        <span className="inline-flex rounded-md bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 text-xs font-mono font-semibold text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                          {c.Code}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-sm">
                      <p className="line-clamp-2">{c.Description ?? '-'}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs">
                      {c.StartDate ? new Date(c.StartDate).toLocaleDateString() : '—'}
                      {' → '}
                      {c.EndDate ? new Date(c.EndDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {c.TrackingUrl ? (
                        <a
                          href={c.TrackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:underline text-xs"
                        >
                          Redeem
                        </a>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Promotions */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Promotions
          {!loadingPromotions && (
            <span className="ml-2 text-sm font-normal text-slate-400 dark:text-slate-500">
              ({promotions.length})
            </span>
          )}
        </h2>

        {loadingPromotions && (
          <div className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading promotions...</div>
        )}
        {errorPromotions && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400 flex items-center justify-between gap-4">
            <span>{errorPromotions}</span>
            <button onClick={fetchPromotions} className="shrink-0 rounded-md bg-red-100 dark:bg-red-900/40 px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors">Retry</button>
          </div>
        )}
        {!loadingPromotions && !errorPromotions && promotions.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-slate-400">No promotions found.</div>
        )}
        {!loadingPromotions && !errorPromotions && promotions.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Merchant</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Dates</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {promotions.map((p) => (
                  <tr key={p.Id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">{p.MerchantName ?? '-'}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-sm">
                      <p className="line-clamp-2">{p.Description ?? '-'}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs">
                      {p.StartDate ? new Date(p.StartDate).toLocaleDateString() : '—'}
                      {' → '}
                      {p.EndDate ? new Date(p.EndDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {p.TrackingUrl ? (
                        <a
                          href={p.TrackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:underline text-xs"
                        >
                          View
                        </a>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Transactions */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Transactions
          {!loadingTransactions && (
            <span className="ml-2 text-sm font-normal text-slate-400 dark:text-slate-500">
              ({transactions.length})
            </span>
          )}
        </h2>

        {loadingTransactions && (
          <div className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading transactions...</div>
        )}
        {errorTransactions && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400 flex items-center justify-between gap-4">
            <span>{errorTransactions}</span>
            <button onClick={fetchTransactions} className="shrink-0 rounded-md bg-red-100 dark:bg-red-900/40 px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors">Retry</button>
          </div>
        )}
        {!loadingTransactions && !errorTransactions && transactions.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-slate-400">No transactions found.</div>
        )}
        {!loadingTransactions && !errorTransactions && transactions.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Merchant</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Commission</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sale Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.map((t) => (
                  <tr key={t.Id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono text-xs">{t.Id}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap text-xs">
                      {t.DateCreated ? new Date(t.DateCreated).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">{t.MerchantName ?? '-'}</td>
                    <td className="px-4 py-3">
                      {t.Status2 ? (
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          t.Status2 === 'Approved'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : t.Status2 === 'Pending'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {t.Status2}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-800 dark:text-slate-200 font-medium">
                      {t.Commission != null ? `$${t.Commission.toFixed(2)}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                      {t.SaleValue != null ? `$${t.SaleValue.toFixed(2)}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
