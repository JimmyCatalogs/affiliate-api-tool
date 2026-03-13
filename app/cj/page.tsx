'use client'

import { useEffect, useState } from 'react'

interface CJAdvertiser {
  'advertiser-id'?: string | number
  'advertiser-name'?: string
  'primary-category'?: { parent?: string; child?: string }
  'seven-day-epc'?: string
  'three-month-epc'?: string
  'commission-terms'?: string
  'network-rank'?: string
}

const _cache: { advertisers?: CJAdvertiser[] } = {}

export default function CJPage() {
  const [advertisers, setAdvertisers] = useState<CJAdvertiser[]>(_cache.advertisers ?? [])
  const [loading, setLoading] = useState(!_cache.advertisers)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (_cache.advertisers) {
      setAdvertisers(_cache.advertisers)
      setLoading(false)
      return
    }

    fetch('/api/cj/advertisers')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        const result = Array.isArray(data) ? data : []
        _cache.advertisers = result
        setAdvertisers(result)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = advertisers.filter((a) => {
    const q = search.toLowerCase()
    const name = (a['advertiser-name'] ?? '').toLowerCase()
    const cat = a['primary-category']
    const sector = [cat?.parent, cat?.child].filter(Boolean).join(' ').toLowerCase()
    return name.includes(q) || sector.includes(q)
  })

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Joined Advertisers
            {!loading && (
              <span className="ml-2 text-sm font-normal text-slate-400 dark:text-slate-500">
                ({filtered.length} of {advertisers.length})
              </span>
            )}
          </h2>
          <input
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm w-64 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {loading && (
          <div className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading advertisers...</div>
        )}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-slate-400">No advertisers found.</div>
        )}
        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Advertiser</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Commission Terms</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">7-Day EPC</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">3-Month EPC</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Network Rank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((a, i) => {
                  const cat = a['primary-category']
                  const sector = [cat?.parent, cat?.child].filter(Boolean).join(' › ')
                  return (
                    <tr key={a['advertiser-id'] ?? i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                        {a['advertiser-name'] ?? `Advertiser #${a['advertiser-id']}`}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-[180px] truncate">
                        {sector || '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {a['commission-terms'] || '—'}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400 font-mono text-xs">
                        {a['seven-day-epc'] ? `$${a['seven-day-epc']}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400 font-mono text-xs">
                        {a['three-month-epc'] ? `$${a['three-month-epc']}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {a['network-rank'] ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                            {a['network-rank']}
                          </span>
                        ) : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
