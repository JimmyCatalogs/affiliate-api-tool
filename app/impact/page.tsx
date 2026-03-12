'use client'

import { useEffect, useMemo, useState } from 'react'

interface Contract {
  CampaignId?: number | string
  CampaignName?: string
  Description?: string
  Category?: string
  Status?: string
  MobileTrackingCertified?: boolean
  MediaPartnerProperties?: {
    PropertyId?: string
    PropertyName?: string
  }[]
  DefaultPayout?: {
    Type?: string
    Amount?: number
    Percentage?: number
  }
  ContractUri?: string
  CampaignImageUri?: string
}

interface Ad {
  Id?: number | string
  Name?: string
  CampaignId?: number | string
  CampaignName?: string
  Type?: string
  SubType?: string
  Width?: number
  Height?: number
  TrackingLink?: string
  ImageLink?: string
  StartDate?: string
  EndDate?: string
}

interface Action {
  Id?: string
  EventDate?: string
  CampaignId?: number | string
  CampaignName?: string
  Status?: string
  Amount?: number
  Payout?: number
  Currency?: string
  OrderId?: string
}

interface Report {
  Id?: number | string
  Name?: string
  Description?: string
  Handle?: string
}

interface Catalog {
  Id?: number | string
  Name?: string
  CampaignId?: number | string
  CampaignName?: string
  NumItems?: number
  LastUpdated?: string
}

interface CatalogItem {
  CatalogItemId?: string
  Name?: string
  Description?: string
  Category?: string
  Price?: number
  Currency?: string
  ImageUrl?: string
  DirectUrl?: string
  TrackingLink?: string
  Brand?: string
  Sku?: string
}

const _cache: {
  contracts?: Contract[]
  ads?: Ad[]
  actions?: Action[]
  reports?: Report[]
  catalogs?: Catalog[]
} = {}

export default function ImpactPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [ads, setAds] = useState<Ad[]>([])
  const [actions, setActions] = useState<Action[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [catalogs, setCatalogs] = useState<Catalog[]>([])

  const [loadingContracts, setLoadingContracts] = useState(true)
  const [loadingAds, setLoadingAds] = useState(true)
  const [loadingActions, setLoadingActions] = useState(true)
  const [loadingReports, setLoadingReports] = useState(true)
  const [loadingCatalogs, setLoadingCatalogs] = useState(true)

  const [errorContracts, setErrorContracts] = useState<string | null>(null)
  const [errorAds, setErrorAds] = useState<string | null>(null)
  const [errorActions, setErrorActions] = useState<string | null>(null)
  const [errorReports, setErrorReports] = useState<string | null>(null)
  const [errorCatalogs, setErrorCatalogs] = useState<string | null>(null)

  const [selectedCatalogId, setSelectedCatalogId] = useState<string | number | null>(null)
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([])
  const [loadingItems, setLoadingItems] = useState(false)
  const [errorItems, setErrorItems] = useState<string | null>(null)

  const [contractSearch, setContractSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')

  function fetchContracts() {
    if (_cache.contracts) {
      setContracts(_cache.contracts)
      setLoadingContracts(false)
      return
    }
    setLoadingContracts(true)
    setErrorContracts(null)
    fetch('/api/impact/contracts')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        const result = Array.isArray(data) ? data : data.Contracts ?? []
        _cache.contracts = result
        setContracts(result)
      })
      .catch((e) => setErrorContracts(e.message))
      .finally(() => setLoadingContracts(false))
  }

  function fetchAds() {
    if (_cache.ads) {
      setAds(_cache.ads)
      setLoadingAds(false)
      return
    }
    setLoadingAds(true)
    setErrorAds(null)
    fetch('/api/impact/ads')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        const result = Array.isArray(data) ? data : data.Ads ?? []
        _cache.ads = result
        setAds(result)
      })
      .catch((e) => setErrorAds(e.message))
      .finally(() => setLoadingAds(false))
  }

  function fetchActions() {
    if (_cache.actions) {
      setActions(_cache.actions)
      setLoadingActions(false)
      return
    }
    setLoadingActions(true)
    setErrorActions(null)
    fetch('/api/impact/actions')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        const result = Array.isArray(data) ? data : []
        _cache.actions = result
        setActions(result)
      })
      .catch((e) => setErrorActions(e.message))
      .finally(() => setLoadingActions(false))
  }

  function fetchReports() {
    if (_cache.reports) {
      setReports(_cache.reports)
      setLoadingReports(false)
      return
    }
    setLoadingReports(true)
    setErrorReports(null)
    fetch('/api/impact/reports')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        const result = Array.isArray(data) ? data : data.Reports ?? []
        _cache.reports = result
        setReports(result)
      })
      .catch((e) => setErrorReports(e.message))
      .finally(() => setLoadingReports(false))
  }

  function fetchCatalogs() {
    if (_cache.catalogs) {
      setCatalogs(_cache.catalogs)
      setLoadingCatalogs(false)
      return
    }
    setLoadingCatalogs(true)
    setErrorCatalogs(null)
    fetch('/api/impact/catalogs')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        const result = Array.isArray(data) ? data : data.Catalogs ?? []
        _cache.catalogs = result
        setCatalogs(result)
      })
      .catch((e) => setErrorCatalogs(e.message))
      .finally(() => setLoadingCatalogs(false))
  }

  useEffect(() => {
    const allCached = _cache.contracts && _cache.ads && _cache.actions && _cache.reports && _cache.catalogs
    if (allCached) {
      fetchContracts()
      fetchAds()
      fetchActions()
      fetchReports()
      fetchCatalogs()
    } else {
      fetchContracts()
      setTimeout(fetchAds, 400)
      setTimeout(fetchActions, 800)
      setTimeout(fetchReports, 1200)
      setTimeout(fetchCatalogs, 1600)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function loadCatalogItems(catalogId: string | number) {
    setSelectedCatalogId(catalogId)
    setCatalogItems([])
    setErrorItems(null)
    setLoadingItems(true)
    setProductSearch('')
    fetch(`/api/impact/catalogs/${catalogId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        const items = Array.isArray(data) ? data : data.Items ?? data.CatalogItems ?? []
        setCatalogItems(items)
      })
      .catch((e) => setErrorItems(e.message))
      .finally(() => setLoadingItems(false))
  }

  const filteredContracts = useMemo(
    () =>
      contracts.filter(
        (c) =>
          c.CampaignName?.toLowerCase().includes(contractSearch.toLowerCase()) ||
          c.Category?.toLowerCase().includes(contractSearch.toLowerCase())
      ),
    [contracts, contractSearch]
  )

  const filteredItems = useMemo(
    () =>
      catalogItems.filter(
        (item) =>
          item.Name?.toLowerCase().includes(productSearch.toLowerCase()) ||
          item.Category?.toLowerCase().includes(productSearch.toLowerCase()) ||
          item.Brand?.toLowerCase().includes(productSearch.toLowerCase())
      ),
    [catalogItems, productSearch]
  )

  const selectedCatalog = catalogs.find((c) => c.Id === selectedCatalogId)

  return (
    <div className="space-y-8">

      {/* Contracts / Programs */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Contracts
            {!loadingContracts && (
              <span className="ml-2 text-sm font-normal text-slate-400 dark:text-slate-500">
                ({filteredContracts.length} of {contracts.length})
              </span>
            )}
          </h2>
          <input
            type="text"
            placeholder="Search by name or category..."
            value={contractSearch}
            onChange={(e) => setContractSearch(e.target.value)}
            className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm w-64 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          />
        </div>

        {loadingContracts && (
          <div className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading contracts...</div>
        )}
        {errorContracts && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400 flex items-center justify-between gap-4">
            <span>{errorContracts}</span>
            <button onClick={fetchContracts} className="shrink-0 rounded-md bg-red-100 dark:bg-red-900/40 px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors">Retry</button>
          </div>
        )}
        {!loadingContracts && !errorContracts && filteredContracts.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-slate-400">No contracts found.</div>
        )}
        {!loadingContracts && !errorContracts && filteredContracts.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Campaign</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Payout</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Catalogs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredContracts.map((c, i) => {
                  const campaignCatalogs = catalogs.filter(
                    (cat) => String(cat.CampaignId) === String(c.CampaignId)
                  )
                  return (
                    <tr key={c.CampaignId ?? i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-2">
                          {c.CampaignImageUri && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={c.CampaignImageUri}
                              alt={c.CampaignName ?? ''}
                              className="h-6 w-auto object-contain"
                            />
                          )}
                          <div>
                            <div>{c.CampaignName ?? `Campaign #${c.CampaignId}`}</div>
                            {c.Description && (
                              <div className="text-xs text-slate-400 dark:text-slate-500 font-normal line-clamp-1 max-w-xs">
                                {c.Description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{c.Category ?? '-'}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {c.DefaultPayout
                          ? c.DefaultPayout.Type === 'FLAT'
                            ? `$${c.DefaultPayout.Amount ?? '?'}`
                            : `${c.DefaultPayout.Percentage ?? '?'}%`
                          : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          c.Status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {c.Status ?? '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {loadingCatalogs ? (
                          <span className="text-slate-400 dark:text-slate-500 text-xs">Loading...</span>
                        ) : campaignCatalogs.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {campaignCatalogs.map((cat) => (
                              <button
                                key={cat.Id}
                                onClick={() => loadCatalogItems(cat.Id!)}
                                className={`text-xs rounded-md px-2 py-0.5 border transition-colors ${
                                  selectedCatalogId === cat.Id
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                                }`}
                              >
                                {cat.Name ?? `Catalog #${cat.Id}`}
                                {cat.NumItems != null && ` (${cat.NumItems})`}
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

      {/* Catalog Items */}
      {selectedCatalogId !== null && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Products — {selectedCatalog?.CampaignName ?? ''}{selectedCatalog?.Name ? ` · ${selectedCatalog.Name}` : ''}
              {!loadingItems && (
                <span className="ml-2 text-sm font-normal text-slate-400 dark:text-slate-500">
                  ({filteredItems.length} of {catalogItems.length})
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
                  key={item.CatalogItemId ?? i}
                  href={item.TrackingLink ?? item.DirectUrl ?? '#'}
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
                    {item.Sku && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">SKU: {item.Sku}</p>
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

      {/* Ads / Creatives */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Ads
          {!loadingAds && (
            <span className="ml-2 text-sm font-normal text-slate-400 dark:text-slate-500">({ads.length})</span>
          )}
        </h2>

        {loadingAds && (
          <div className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading ads...</div>
        )}
        {errorAds && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400 flex items-center justify-between gap-4">
            <span>{errorAds}</span>
            <button onClick={fetchAds} className="shrink-0 rounded-md bg-red-100 dark:bg-red-900/40 px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors">Retry</button>
          </div>
        )}
        {!loadingAds && !errorAds && ads.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-slate-400">No ads found.</div>
        )}
        {!loadingAds && !errorAds && ads.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ads.map((ad, i) => (
              <a
                key={ad.Id ?? i}
                href={ad.TrackingLink ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
              >
                {ad.ImageLink && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ad.ImageLink}
                    alt={ad.Name ?? ''}
                    className="w-full h-32 object-contain bg-slate-50 dark:bg-slate-800 p-2"
                  />
                )}
                <div className="p-3">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {ad.CampaignName ?? '-'}
                  </p>
                  {ad.Name && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{ad.Name}</p>
                  )}
                  {ad.Type && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{ad.SubType ?? ad.Type}</p>
                  )}
                  {ad.Width != null && ad.Height != null && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{ad.Width}×{ad.Height}</p>
                  )}
                  {ad.EndDate && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      Expires: {new Date(ad.EndDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Actions / Transactions */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Actions (Last 30 Days)
          {!loadingActions && (
            <span className="ml-2 text-sm font-normal text-slate-400 dark:text-slate-500">({actions.length})</span>
          )}
        </h2>

        {loadingActions && (
          <div className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading actions...</div>
        )}
        {errorActions && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400 flex items-center justify-between gap-4">
            <span>{errorActions}</span>
            <button onClick={fetchActions} className="shrink-0 rounded-md bg-red-100 dark:bg-red-900/40 px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors">Retry</button>
          </div>
        )}
        {!loadingActions && !errorActions && actions.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-slate-400">No actions found in the last 30 days.</div>
        )}
        {!loadingActions && !errorActions && actions.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Campaign</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Payout</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {actions.map((a, i) => (
                  <tr key={a.Id ?? i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono text-xs">{a.Id ?? '-'}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap text-xs">
                      {a.EventDate ? new Date(a.EventDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {a.CampaignName ?? '-'}
                    </td>
                    <td className="px-4 py-3">
                      {a.Status ? (
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          a.Status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : a.Status === 'PENDING'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                            : a.Status === 'REVERSED'
                            ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {a.Status}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-800 dark:text-slate-200 font-medium">
                      {a.Payout != null ? `$${Number(a.Payout).toFixed(2)}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                      {a.Amount != null ? `$${Number(a.Amount).toFixed(2)}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Available Reports */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Available Reports
          {!loadingReports && (
            <span className="ml-2 text-sm font-normal text-slate-400 dark:text-slate-500">({reports.length})</span>
          )}
        </h2>

        {loadingReports && (
          <div className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading reports...</div>
        )}
        {errorReports && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400 flex items-center justify-between gap-4">
            <span>{errorReports}</span>
            <button onClick={fetchReports} className="shrink-0 rounded-md bg-red-100 dark:bg-red-900/40 px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors">Retry</button>
          </div>
        )}
        {!loadingReports && !errorReports && reports.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-slate-400">No reports found.</div>
        )}
        {!loadingReports && !errorReports && reports.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Handle</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {reports.map((r, i) => (
                  <tr key={r.Id ?? i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">{r.Name ?? '-'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{r.Handle ?? r.Id ?? '-'}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-md">
                      <p className="line-clamp-2">{r.Description ?? '-'}</p>
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
