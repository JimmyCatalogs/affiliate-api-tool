'use client'

import { useEffect, useState, useMemo } from 'react'

interface Brand {
  id: string
  name: string
  network: 'Awin' | 'Commission Factory' | 'Impact'
  logoUrl?: string
  sector?: string
  status: string
  commissionDisplay: string
  commissionSortValue: number
  hasPromos: boolean
  hasFeed: boolean
  networkHref: string
}

interface ImpactAd {
  Id?: number | string
  Name?: string
  CampaignId?: number | string
  CampaignName?: string
  Type?: string
  SubType?: string
  TrackingLink?: string
  ImageLink?: string
  Width?: number
  Height?: number
}

interface AwinPromotion {
  promotionId?: number
  advertiserId?: number
  type?: string
  title?: string
  description?: string
  code?: string
  startDate?: string
  endDate?: string
}

interface CFBanner {
  Id: number
  MerchantName?: string
  Name?: string
  ImageUrl?: string
  TrackingUrl?: string
  Width?: number
  Height?: number
  ExpiryDate?: string
}

interface CFCoupon {
  Id: number
  MerchantName?: string
  Description?: string
  Code?: string
  TrackingUrl?: string
  StartDate?: string
  EndDate?: string
}

interface CFPromo {
  Id: number
  MerchantName?: string
  Description?: string
  TrackingUrl?: string
  StartDate?: string
  EndDate?: string
}

type SortKey = 'commission' | 'name'
type NetworkFilter = 'all' | 'Awin' | 'Commission Factory' | 'Impact'

const _cache: { brands?: Brand[]; promotions?: AwinPromotion[] } = {}

const _cfCollateralCache: {
  banners?: CFBanner[]
  coupons?: CFCoupon[]
  promos?: CFPromo[]
  loaded?: boolean
} = {}

const _impactAdsCache: {
  ads?: ImpactAd[]
  loaded?: boolean
} = {}

function fmtDate(s?: string) {
  if (!s) return ''
  try { return new Date(s).toLocaleDateString() } catch { return s }
}

function downloadCSV(
  brand: Brand,
  awinPromos: AwinPromotion[],
  cfBanners: CFBanner[],
  cfCoupons: CFCoupon[],
  cfPromos: CFPromo[],
  impactAds: ImpactAd[]
) {
  const rows: string[][] = [
    ['Type', 'Name / Description', 'Code', 'Tracking URL', 'Image URL', 'Width', 'Height', 'Start Date', 'End / Expiry Date'],
  ]

  for (const p of awinPromos) {
    rows.push(['Promotion', p.title ?? p.description ?? '', p.code ?? '', '', '', '', '', fmtDate(p.startDate), fmtDate(p.endDate)])
  }
  for (const p of cfPromos) {
    rows.push(['Promotion', p.Description ?? '', '', p.TrackingUrl ?? '', '', '', '', fmtDate(p.StartDate), fmtDate(p.EndDate)])
  }
  for (const c of cfCoupons) {
    rows.push(['Coupon', c.Description ?? '', c.Code ?? '', c.TrackingUrl ?? '', '', '', '', fmtDate(c.StartDate), fmtDate(c.EndDate)])
  }
  for (const b of cfBanners) {
    rows.push(['Banner', b.Name ?? '', '', b.TrackingUrl ?? '', b.ImageUrl ?? '', String(b.Width ?? ''), String(b.Height ?? ''), '', fmtDate(b.ExpiryDate)])
  }
  for (const a of impactAds) {
    rows.push(['Ad', a.Name ?? '', '', a.TrackingLink ?? '', a.ImageLink ?? '', String(a.Width ?? ''), String(a.Height ?? ''), '', ''])
  }

  const csv = rows
    .map((r) => r.map((v) => `"${(v ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = `${brand.name.replace(/[^a-z0-9]/gi, '_')}_assets.csv`
  a.click()
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>(_cache.brands ?? [])
  const [loading, setLoading] = useState(!_cache.brands)
  const [error, setError] = useState<string | null>(null)

  const [sort, setSort] = useState<SortKey>('commission')
  const [networkFilter, setNetworkFilter] = useState<NetworkFilter>('all')
  const [joinedOnly, setJoinedOnly] = useState(true)
  const [search, setSearch] = useState('')

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [collateralLoading, setCollateralLoading] = useState(false)

  useEffect(() => {
    if (_cache.brands) return

    async function load() {
      try {
        const [progRes, promoRes, merchantRes, feedRes, contractsRes, adsRes] = await Promise.all([
          fetch('/api/awin/programmes'),
          fetch('/api/awin/promotions'),
          fetch('/api/commission-factory/merchants'),
          fetch('/api/commission-factory/datafeeds'),
          fetch('/api/impact/contracts'),
          fetch('/api/impact/ads'),
        ])

        const programmes = progRes.ok ? await progRes.json() : []
        const promotions: AwinPromotion[] = promoRes.ok ? await promoRes.json() : []
        const merchants = merchantRes.ok ? await merchantRes.json() : []
        const datafeeds = feedRes.ok ? await feedRes.json() : []
        const contractsData = contractsRes.ok ? await contractsRes.json() : {}
        const adsData = adsRes.ok ? await adsRes.json() : {}

        const impactContracts: {
          CampaignId?: number | string
          CampaignName?: string
          Category?: string
          Status?: string
          CampaignImageUri?: string
          DefaultPayout?: { Type?: string; Amount?: number; Percentage?: number }
        }[] = Array.isArray(contractsData) ? contractsData : contractsData.Contracts ?? []

        const impactAdsAll: ImpactAd[] = Array.isArray(adsData) ? adsData : adsData.Ads ?? []
        _impactAdsCache.ads = impactAdsAll
        _impactAdsCache.loaded = true

        const impactAdCampaignIds = new Set(impactAdsAll.map((a) => String(a.CampaignId)))

        _cache.promotions = Array.isArray(promotions) ? promotions : []

        const awinPromoIds = new Set<number>(
          _cache.promotions.map((p) => Number(p.advertiserId)).filter((id) => !isNaN(id) && id !== 0)
        )

        const cfFeedMerchantIds = new Set<number>(
          (Array.isArray(datafeeds) ? datafeeds : []).map(
            (f: { MerchantId?: number }) => f.MerchantId
          ).filter(Boolean) as number[]
        )

        const awinBrands: Brand[] = (Array.isArray(programmes) ? programmes : []).map(
          (p: {
            id: number
            name: string
            primarySector?: string
            status?: string
            logoUrl?: string
            commissionRange?: { min?: number; max?: number }
          }) => {
            const min = p.commissionRange?.min ?? 0
            const max = p.commissionRange?.max
            const commissionDisplay =
              max && max !== min ? `${min}–${max}%` : min ? `${min}%` : '—'
            return {
              id: `awin-${p.id}`,
              name: p.name,
              network: 'Awin' as const,
              logoUrl: p.logoUrl,
              sector: p.primarySector,
              status: p.status ?? 'joined',
              commissionDisplay,
              commissionSortValue: min,
              hasPromos: awinPromoIds.has(Number(p.id)),
              hasFeed: false,
              networkHref: '/awin',
            }
          }
        )

        const cfBrands: Brand[] = (Array.isArray(merchants) ? merchants : []).map(
          (m: {
            Id: number
            Name: string
            Category?: string
            Category2?: string
            CommissionType?: string
            CommissionRate?: number
            Status?: string
            AvatarUrl?: string
          }) => {
            const rate = m.CommissionRate ?? 0
            const commissionDisplay =
              m.CommissionType && rate
                ? `${m.CommissionType}: ${rate}%`
                : rate
                ? `${rate}%`
                : '—'
            const sector = [m.Category, m.Category2].filter(Boolean).join(', ') || undefined
            return {
              id: `cf-${m.Id}`,
              name: m.Name,
              network: 'Commission Factory' as const,
              logoUrl: m.AvatarUrl,
              sector,
              status: m.Status ?? 'Active',
              commissionDisplay,
              commissionSortValue: rate,
              hasPromos: false,
              hasFeed: cfFeedMerchantIds.has(m.Id),
              networkHref: '/commission-factory',
            }
          }
        )

        const impactBrands: Brand[] = impactContracts.map((c) => {
          const payout = c.DefaultPayout
          const commissionDisplay = payout
            ? payout.Type === 'FLAT'
              ? `$${payout.Amount ?? '?'}`
              : `${payout.Percentage ?? '?'}%`
            : '—'
          const commissionSortValue = payout
            ? (payout.Amount ?? payout.Percentage ?? 0)
            : 0
          return {
            id: `impact-${c.CampaignId}`,
            name: c.CampaignName ?? `Campaign #${c.CampaignId}`,
            network: 'Impact' as const,
            logoUrl: c.CampaignImageUri,
            sector: c.Category,
            status: c.Status ?? 'ACTIVE',
            commissionDisplay,
            commissionSortValue,
            hasPromos: impactAdCampaignIds.has(String(c.CampaignId)),
            hasFeed: false,
            networkHref: '/impact',
          }
        })

        const all = [...awinBrands, ...cfBrands, ...impactBrands]
        _cache.brands = all
        setBrands(all)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load brands')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  async function handleRowClick(brand: Brand) {
    if (expandedId === brand.id) {
      setExpandedId(null)
      return
    }
    setExpandedId(brand.id)
    if (brand.network === 'Commission Factory' && !_cfCollateralCache.loaded) {
      setCollateralLoading(true)
      try {
        const [bRes, cRes, pRes] = await Promise.all([
          fetch('/api/commission-factory/banners'),
          fetch('/api/commission-factory/coupons'),
          fetch('/api/commission-factory/promotions'),
        ])
        const toArray = (data: unknown): unknown[] => Array.isArray(data) ? data : []
        _cfCollateralCache.banners = bRes.ok ? toArray(await bRes.json()) as CFBanner[] : []
        _cfCollateralCache.coupons = cRes.ok ? toArray(await cRes.json()) as CFCoupon[] : []
        _cfCollateralCache.promos = pRes.ok ? toArray(await pRes.json()) as CFPromo[] : []
        _cfCollateralCache.loaded = true
      } finally {
        setCollateralLoading(false)
      }
    }
  }

  const filtered = useMemo(() => {
    let list = brands
    if (networkFilter !== 'all') list = list.filter((b) => b.network === networkFilter)
    if (joinedOnly)
      list = list.filter(
        (b) =>
          b.network === 'Awin' ||
          b.network === 'Impact' ||
          b.status.toLowerCase() === 'active' ||
          b.status.toLowerCase() === 'joined'
      )
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (b) => b.name.toLowerCase().includes(q) || b.sector?.toLowerCase().includes(q)
      )
    }
    return [...list].sort((a, b) => {
      if (sort === 'commission') return b.commissionSortValue - a.commissionSortValue
      return a.name.localeCompare(b.name)
    })
  }, [brands, sort, networkFilter, joinedOnly, search])

  // Derive collateral for the currently expanded brand
  const expandedBrand = brands.find((b) => b.id === expandedId) ?? null
  const expandedNumericId = expandedBrand ? parseInt(expandedBrand.id.split('-')[1]) : null

  const normalize = (s?: string) => s?.trim().toLowerCase() ?? ''

  const awinPromos: AwinPromotion[] =
    expandedBrand?.network === 'Awin' && expandedNumericId != null
      ? (_cache.promotions ?? []).filter((p) => Number(p.advertiserId) === expandedNumericId)
      : []

  const brandNameNorm = normalize(expandedBrand?.name)

  const cfBanners: CFBanner[] =
    expandedBrand?.network === 'Commission Factory'
      ? (_cfCollateralCache.banners ?? []).filter(
          (b) => normalize(b.MerchantName) === brandNameNorm
        )
      : []

  const cfCoupons: CFCoupon[] =
    expandedBrand?.network === 'Commission Factory'
      ? (_cfCollateralCache.coupons ?? []).filter(
          (c) => normalize(c.MerchantName) === brandNameNorm
        )
      : []

  const cfPromos: CFPromo[] =
    expandedBrand?.network === 'Commission Factory'
      ? (_cfCollateralCache.promos ?? []).filter(
          (p) => normalize(p.MerchantName) === brandNameNorm
        )
      : []

  const impactAds: ImpactAd[] =
    expandedBrand?.network === 'Impact'
      ? (_impactAdsCache.ads ?? []).filter(
          (a) => String(a.CampaignId) === String(expandedBrand.id.split('-').slice(1).join('-'))
        )
      : []

  const hasAnyCollateral =
    awinPromos.length > 0 ||
    cfBanners.length > 0 ||
    cfCoupons.length > 0 ||
    cfPromos.length > 0 ||
    impactAds.length > 0 ||
    (expandedBrand?.hasFeed ?? false)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">All Brands</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {loading
            ? 'Loading…'
            : `${filtered.length} of ${brands.length} brands across all networks`}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <input
          type="search"
          placeholder="Search brands…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="commission">Highest Commission</option>
          <option value="name">A–Z</option>
        </select>
        <select
          value={networkFilter}
          onChange={(e) => setNetworkFilter(e.target.value as NetworkFilter)}
          className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Networks</option>
          <option value="Awin">Awin</option>
          <option value="Commission Factory">Commission Factory</option>
          <option value="Impact">Impact</option>
        </select>
        <label className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={joinedOnly}
            onChange={(e) => setJoinedOnly(e.target.checked)}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Joined only
        </label>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-sm text-slate-500 dark:text-slate-400">Loading brands…</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-slate-500 dark:text-slate-400">No brands match your filters.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700/60 text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400 w-6" />
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Brand</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Network</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Sector</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Commission</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-400">Collateral</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((brand) => {
                const isExpanded = expandedId === brand.id
                return (
                  <>
                    <tr
                      key={brand.id}
                      onClick={() => handleRowClick(brand)}
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Expand chevron */}
                      <td className="pl-4 pr-2 py-3 text-slate-400 dark:text-slate-500">
                        <svg
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {brand.logoUrl ? (
                            <img
                              src={brand.logoUrl}
                              alt={brand.name}
                              className="w-8 h-8 rounded object-contain bg-white border border-slate-100 dark:border-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-slate-400">
                                {brand.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {brand.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            brand.network === 'Awin'
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                              : brand.network === 'Impact'
                              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          }`}
                        >
                          {brand.network}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 max-w-[160px] truncate">
                        {brand.sector ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {brand.commissionDisplay}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            brand.status.toLowerCase() === 'active' ||
                            brand.status.toLowerCase() === 'joined' ||
                            brand.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {brand.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          {brand.hasPromos && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                              Promos
                            </span>
                          )}
                          {brand.hasFeed && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                              Feed
                            </span>
                          )}
                          {!brand.hasPromos && !brand.hasFeed && (
                            <span className="text-slate-300 dark:text-slate-600 text-xs">—</span>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expanded collateral row */}
                    {isExpanded && (
                      <tr key={`${brand.id}-expanded`} className="bg-slate-50 dark:bg-slate-800/30">
                        <td colSpan={7} className="px-6 py-5">
                          {collateralLoading ? (
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              Loading assets…
                            </div>
                          ) : !hasAnyCollateral ? (
                            <div className="text-sm text-slate-400 dark:text-slate-500 italic">
                              No collateral assets found for this brand.
                            </div>
                          ) : (
                            <div className="space-y-5">
                              {/* Awin Promotions */}
                              {awinPromos.length > 0 && (
                                <section>
                                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                    Promotions ({awinPromos.length})
                                  </h3>
                                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {awinPromos.map((p) => (
                                      <div
                                        key={p.promotionId}
                                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm"
                                      >
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                          <span className="font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                                            {p.title ?? p.description ?? '—'}
                                          </span>
                                          {p.type && (
                                            <span className="shrink-0 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 px-1.5 py-0.5 rounded">
                                              {p.type}
                                            </span>
                                          )}
                                        </div>
                                        {p.code && (
                                          <code className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono">
                                            {p.code}
                                          </code>
                                        )}
                                        {(p.startDate || p.endDate) && (
                                          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                            {fmtDate(p.startDate)}
                                            {p.startDate && p.endDate && ' – '}
                                            {fmtDate(p.endDate)}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </section>
                              )}

                              {/* CF Promotions */}
                              {cfPromos.length > 0 && (
                                <section>
                                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                    Promotions ({cfPromos.length})
                                  </h3>
                                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {cfPromos.map((p) => (
                                      <div
                                        key={p.Id}
                                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm"
                                      >
                                        <p className="text-slate-800 dark:text-slate-200 line-clamp-3">
                                          {p.Description ?? '—'}
                                        </p>
                                        {p.TrackingUrl && (
                                          <a
                                            href={p.TrackingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="mt-1 inline-block text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                                          >
                                            Tracking link ↗
                                          </a>
                                        )}
                                        {(p.StartDate || p.EndDate) && (
                                          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                            {fmtDate(p.StartDate)}
                                            {p.StartDate && p.EndDate && ' – '}
                                            {fmtDate(p.EndDate)}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </section>
                              )}

                              {/* CF Coupons */}
                              {cfCoupons.length > 0 && (
                                <section>
                                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                    Coupons ({cfCoupons.length})
                                  </h3>
                                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {cfCoupons.map((c) => (
                                      <div
                                        key={c.Id}
                                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm"
                                      >
                                        <p className="text-slate-800 dark:text-slate-200 line-clamp-2">
                                          {c.Description ?? '—'}
                                        </p>
                                        {c.Code && (
                                          <code className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono">
                                            {c.Code}
                                          </code>
                                        )}
                                        {c.TrackingUrl && (
                                          <a
                                            href={c.TrackingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="mt-1 block text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                                          >
                                            Tracking link ↗
                                          </a>
                                        )}
                                        {(c.StartDate || c.EndDate) && (
                                          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                            {fmtDate(c.StartDate)}
                                            {c.StartDate && c.EndDate && ' – '}
                                            {fmtDate(c.EndDate)}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </section>
                              )}

                              {/* CF Banners */}
                              {cfBanners.length > 0 && (
                                <section>
                                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                    Banners ({cfBanners.length})
                                  </h3>
                                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {cfBanners.map((b) => (
                                      <div
                                        key={b.Id}
                                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm"
                                      >
                                        {b.ImageUrl && (
                                          <img
                                            src={b.ImageUrl}
                                            alt={b.Name ?? 'Banner'}
                                            className="max-w-full max-h-24 object-contain mb-2 rounded"
                                          />
                                        )}
                                        <p className="font-medium text-slate-700 dark:text-slate-300 text-xs truncate">
                                          {b.Name ?? '—'}
                                        </p>
                                        {(b.Width || b.Height) && (
                                          <p className="text-xs text-slate-400 dark:text-slate-500">
                                            {b.Width} × {b.Height}px
                                          </p>
                                        )}
                                        {b.ExpiryDate && (
                                          <p className="text-xs text-slate-400 dark:text-slate-500">
                                            Expires {fmtDate(b.ExpiryDate)}
                                          </p>
                                        )}
                                        {b.TrackingUrl && (
                                          <a
                                            href={b.TrackingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="mt-1 block text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                                          >
                                            Tracking link ↗
                                          </a>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </section>
                              )}

                              {/* Impact Ads */}
                              {impactAds.length > 0 && (
                                <section>
                                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                    Ads ({impactAds.length})
                                  </h3>
                                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {impactAds.map((a, i) => (
                                      <div
                                        key={a.Id ?? i}
                                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm"
                                      >
                                        {a.ImageLink && (
                                          <img
                                            src={a.ImageLink}
                                            alt={a.Name ?? 'Ad'}
                                            className="max-w-full max-h-24 object-contain mb-2 rounded"
                                          />
                                        )}
                                        <p className="font-medium text-slate-700 dark:text-slate-300 text-xs truncate">
                                          {a.Name ?? a.SubType ?? a.Type ?? '—'}
                                        </p>
                                        {(a.Width || a.Height) && (
                                          <p className="text-xs text-slate-400 dark:text-slate-500">
                                            {a.Width} × {a.Height}px
                                          </p>
                                        )}
                                        {a.TrackingLink && (
                                          <a
                                            href={a.TrackingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="mt-1 block text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                                          >
                                            Tracking link ↗
                                          </a>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </section>
                              )}

                              {/* Product Feed */}
                              {brand.hasFeed && (
                                <section>
                                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                    Product Feed
                                  </h3>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Product feed available.{' '}
                                    <a
                                      href="/commission-factory"
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                                    >
                                      Browse products in Commission Factory tab ↗
                                    </a>
                                  </p>
                                </section>
                              )}
                            </div>
                          )}

                          {/* Footer: Download CSV */}
                          {!collateralLoading && hasAnyCollateral && (
                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  downloadCSV(brand, awinPromos, cfBanners, cfCoupons, cfPromos)
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download CSV
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
