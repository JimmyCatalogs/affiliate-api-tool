'use client'

import { useEffect, useState } from 'react'

interface Program {
  id?: string | number
  name?: string
  category?: string
  status?: string
  homepage?: string
  commission_base?: string | number
  commission_type?: string
}

interface Banner {
  id?: string | number
  name?: string
  program_name?: string
  program_id?: string | number
  width?: number
  height?: number
  image_url?: string
  tracking_url?: string
  start_date?: string
  end_date?: string
}

interface Coupon {
  id?: string | number
  name?: string
  program_name?: string
  program_id?: string | number
  coupon_code?: string
  description?: string
  start_date?: string
  end_date?: string
  tracking_url?: string
}

interface Promotion {
  id?: string | number
  name?: string
  program_name?: string
  program_id?: string | number
  description?: string
  start_date?: string
  end_date?: string
  tracking_url?: string
}

const _cache: {
  programs?: Program[]
  banners?: Banner[]
  coupons?: Coupon[]
  promotions?: Promotion[]
} = {}

function fmtDate(s?: string) {
  if (!s) return ''
  try { return new Date(s).toLocaleDateString() } catch { return s }
}

function commissionDisplay(p: Program) {
  const rate = typeof p.commission_base === 'string'
    ? parseFloat(p.commission_base)
    : (p.commission_base ?? 0)
  if (!rate) return '—'
  return p.commission_type === 'flat' ? `$${rate}` : `${rate}%`
}

export default function PepperjamPage() {
  const [programs, setPrograms] = useState<Program[]>(_cache.programs ?? [])
  const [banners, setBanners] = useState<Banner[]>(_cache.banners ?? [])
  const [coupons, setCoupons] = useState<Coupon[]>(_cache.coupons ?? [])
  const [promotions, setPromotions] = useState<Promotion[]>(_cache.promotions ?? [])

  const [loadingPrograms, setLoadingPrograms] = useState(!_cache.programs)
  const [loadingBanners, setLoadingBanners] = useState(!_cache.banners)
  const [loadingCoupons, setLoadingCoupons] = useState(!_cache.coupons)
  const [loadingPromotions, setLoadingPromotions] = useState(!_cache.promotions)

  const [errorPrograms, setErrorPrograms] = useState<string | null>(null)
  const [errorBanners, setErrorBanners] = useState<string | null>(null)
  const [errorCoupons, setErrorCoupons] = useState<string | null>(null)
  const [errorPromotions, setErrorPromotions] = useState<string | null>(null)

  const [search, setSearch] = useState('')

  useEffect(() => {
    if (_cache.programs) {
      setPrograms(_cache.programs)
      setLoadingPrograms(false)
    } else {
      fetch('/api/pepperjam/programs')
        .then((r) => r.json())
        .then((data) => {
          if (data.error) throw new Error(data.error)
          const result = Array.isArray(data) ? data : []
          _cache.programs = result
          setPrograms(result)
        })
        .catch((e) => setErrorPrograms(e.message))
        .finally(() => setLoadingPrograms(false))
    }

    if (_cache.banners) {
      setBanners(_cache.banners)
      setLoadingBanners(false)
    } else {
      fetch('/api/pepperjam/creatives/banners')
        .then((r) => r.json())
        .then((data) => {
          if (data.error) throw new Error(data.error)
          const result = Array.isArray(data) ? data : []
          _cache.banners = result
          setBanners(result)
        })
        .catch((e) => setErrorBanners(e.message))
        .finally(() => setLoadingBanners(false))
    }

    if (_cache.coupons) {
      setCoupons(_cache.coupons)
      setLoadingCoupons(false)
    } else {
      fetch('/api/pepperjam/creatives/coupons')
        .then((r) => r.json())
        .then((data) => {
          if (data.error) throw new Error(data.error)
          const result = Array.isArray(data) ? data : []
          _cache.coupons = result
          setCoupons(result)
        })
        .catch((e) => setErrorCoupons(e.message))
        .finally(() => setLoadingCoupons(false))
    }

    if (_cache.promotions) {
      setPromotions(_cache.promotions)
      setLoadingPromotions(false)
    } else {
      fetch('/api/pepperjam/creatives/promotions')
        .then((r) => r.json())
        .then((data) => {
          if (data.error) throw new Error(data.error)
          const result = Array.isArray(data) ? data : []
          _cache.promotions = result
          setPromotions(result)
        })
        .catch((e) => setErrorPromotions(e.message))
        .finally(() => setLoadingPromotions(false))
    }
  }, [])

  const filteredPrograms = programs.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Joined Programs */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Joined Programs
            {!loadingPrograms && (
              <span className="ml-2 text-sm font-normal text-slate-400 dark:text-slate-500">
                ({filteredPrograms.length} of {programs.length})
              </span>
            )}
          </h2>
          <input
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm w-64 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {loadingPrograms && (
          <div className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading programs...</div>
        )}
        {errorPrograms && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
            {errorPrograms}
          </div>
        )}
        {!loadingPrograms && !errorPrograms && filteredPrograms.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-slate-400">No programs found.</div>
        )}
        {!loadingPrograms && !errorPrograms && filteredPrograms.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Program</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Commission</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Website</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPrograms.map((p, i) => (
                  <tr key={p.id ?? i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{p.name ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{p.category ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.status?.toLowerCase() === 'active'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {p.status ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                      {commissionDisplay(p)}
                    </td>
                    <td className="px-4 py-3">
                      {p.homepage ? (
                        <a
                          href={p.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-rose-600 dark:text-rose-400 hover:underline truncate max-w-[200px] block"
                        >
                          {p.homepage.replace(/^https?:\/\//, '')}
                        </a>
                      ) : '—'}
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
          {!loadingPromotions && promotions.length > 0 && (
            <span className="ml-2 text-sm font-normal text-slate-400 dark:text-slate-500">({promotions.length})</span>
          )}
        </h2>

        {loadingPromotions && (
          <div className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading promotions...</div>
        )}
        {errorPromotions && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
            {errorPromotions}
          </div>
        )}
        {!loadingPromotions && !errorPromotions && promotions.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-slate-400">No promotions found.</div>
        )}
        {!loadingPromotions && !errorPromotions && promotions.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {promotions.map((p, i) => (
              <div key={p.id ?? i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                <p className="text-xs font-medium text-rose-600 dark:text-rose-400 mb-1">{p.program_name}</p>
                <p className="text-sm text-slate-800 dark:text-slate-200 line-clamp-3">{p.name ?? p.description ?? '—'}</p>
                {(p.start_date || p.end_date) && (
                  <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                    {fmtDate(p.start_date)}
                    {p.start_date && p.end_date && ' – '}
                    {fmtDate(p.end_date)}
                  </p>
                )}
                {p.tracking_url && (
                  <a
                    href={p.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-xs text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    Tracking link ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Coupons */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Coupons
          {!loadingCoupons && coupons.length > 0 && (
            <span className="ml-2 text-sm font-normal text-slate-400 dark:text-slate-500">({coupons.length})</span>
          )}
        </h2>

        {loadingCoupons && (
          <div className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading coupons...</div>
        )}
        {errorCoupons && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
            {errorCoupons}
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
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Program</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Dates</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {coupons.map((c, i) => (
                  <tr key={c.id ?? i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">{c.program_name ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200 max-w-[240px]">
                      <span className="line-clamp-2">{c.description ?? c.name ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      {c.coupon_code ? (
                        <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono">
                          {c.coupon_code}
                        </code>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                      {fmtDate(c.start_date)}
                      {c.start_date && c.end_date && ' – '}
                      {fmtDate(c.end_date)}
                    </td>
                    <td className="px-4 py-3">
                      {c.tracking_url ? (
                        <a
                          href={c.tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-rose-600 dark:text-rose-400 hover:underline"
                        >
                          Link ↗
                        </a>
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Banners */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Banners
          {!loadingBanners && banners.length > 0 && (
            <span className="ml-2 text-sm font-normal text-slate-400 dark:text-slate-500">({banners.length})</span>
          )}
        </h2>

        {loadingBanners && (
          <div className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading banners...</div>
        )}
        {errorBanners && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
            {errorBanners}
          </div>
        )}
        {!loadingBanners && !errorBanners && banners.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-slate-400">No banners found.</div>
        )}
        {!loadingBanners && !errorBanners && banners.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {banners.map((b, i) => (
              <div key={b.id ?? i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                {b.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={b.image_url}
                    alt={b.name ?? 'Banner'}
                    className="max-w-full max-h-24 object-contain mb-3 rounded"
                  />
                )}
                <p className="text-xs font-medium text-rose-600 dark:text-rose-400 truncate">{b.program_name}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">{b.name ?? '—'}</p>
                {(b.width || b.height) && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{b.width} × {b.height}px</p>
                )}
                {(b.start_date || b.end_date) && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {fmtDate(b.start_date)}
                    {b.start_date && b.end_date && ' – '}
                    {fmtDate(b.end_date)}
                  </p>
                )}
                {b.tracking_url && (
                  <a
                    href={b.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-xs text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    Tracking link ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
