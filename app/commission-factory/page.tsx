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

  const [merchantSearch, setMerchantSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')

  useEffect(() => {
    fetch('/api/commission-factory/merchants')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setMerchants(Array.isArray(data) ? data : [])
      })
      .catch((e) => setErrorMerchants(e.message))
      .finally(() => setLoadingMerchants(false))

    fetch('/api/commission-factory/datafeeds')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setDatafeeds(Array.isArray(data) ? data : [])
      })
      .catch((e) => setErrorFeeds(e.message))
      .finally(() => setLoadingFeeds(false))
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
          <h2 className="text-lg font-semibold text-gray-800">
            Merchants
            {!loadingMerchants && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({filteredMerchants.length} of {merchants.length})
              </span>
            )}
          </h2>
          <input
            type="text"
            placeholder="Search by name or category..."
            value={merchantSearch}
            onChange={(e) => setMerchantSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loadingMerchants && (
          <div className="text-sm text-gray-500 animate-pulse">Loading merchants...</div>
        )}

        {errorMerchants && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
            {errorMerchants}
          </div>
        )}

        {!loadingMerchants && !errorMerchants && filteredMerchants.length === 0 && (
          <div className="text-sm text-gray-500">No merchants found.</div>
        )}

        {!loadingMerchants && !errorMerchants && filteredMerchants.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Merchant</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Commission</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Data Feeds</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMerchants.map((m) => {
                  const merchantFeeds = datafeeds.filter((f) => f.MerchantId === m.Id)
                  return (
                    <tr key={m.Id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
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
                              <div className="text-xs text-gray-400 font-normal line-clamp-1 max-w-xs">
                                {m.Summary}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {[m.Category, m.Category2].filter(Boolean).join(', ') || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {m.CommissionType
                          ? `${m.CommissionType}: ${m.CommissionRate ?? '?'}%`
                          : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            m.Status === 'Active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {m.Status ?? '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {loadingFeeds ? (
                          <span className="text-gray-400 text-xs">Loading...</span>
                        ) : merchantFeeds.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {merchantFeeds.map((f) => (
                              <button
                                key={f.Id}
                                onClick={() => loadFeedItems(f.Id)}
                                className={`text-xs rounded px-2 py-0.5 border transition-colors ${
                                  selectedFeedId === f.Id
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
                                }`}
                              >
                                {f.Name ?? `Feed #${f.Id}`}
                                {f.ItemCount != null && ` (${f.ItemCount})`}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">None</span>
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
            <h2 className="text-lg font-semibold text-gray-800">
              Products — {selectedFeed?.MerchantName ?? ''}{' '}
              {selectedFeed?.Name ? `· ${selectedFeed.Name}` : ''}
              {!loadingItems && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredItems.length} of {feedItems.length})
                </span>
              )}
            </h2>
            <input
              type="text"
              placeholder="Search products..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {loadingItems && (
            <div className="text-sm text-gray-500 animate-pulse">Loading products...</div>
          )}

          {errorItems && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
              {errorItems}
            </div>
          )}

          {!loadingItems && !errorItems && filteredItems.length === 0 && (
            <div className="text-sm text-gray-500">No products found.</div>
          )}

          {!loadingItems && !errorItems && filteredItems.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.slice(0, 100).map((item, i) => (
                <a
                  key={item.Id ?? i}
                  href={item.TargetUrl ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {item.ImageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.ImageUrl}
                      alt={item.Name ?? ''}
                      className="w-full h-40 object-contain bg-gray-50 p-2"
                    />
                  )}
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600">
                      {item.Name}
                    </p>
                    {item.Brand && (
                      <p className="text-xs text-gray-500 mt-0.5">{item.Brand}</p>
                    )}
                    {item.Category && (
                      <p className="text-xs text-gray-400 mt-0.5">{item.Category}</p>
                    )}
                    {item.Price != null && (
                      <p className="text-sm font-semibold text-gray-800 mt-1">
                        {item.Currency ?? ''} {item.Price}
                      </p>
                    )}
                    {item.SKU && (
                      <p className="text-xs text-gray-400 mt-0.5">SKU: {item.SKU}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
          {!loadingItems && filteredItems.length > 100 && (
            <p className="mt-3 text-sm text-gray-500">
              Showing first 100 of {filteredItems.length} products. Use the search box to filter.
            </p>
          )}
        </section>
      )}
    </div>
  )
}
