'use client'

import { useEffect, useState } from 'react'

interface Programme {
  id: number
  name: string
  primarySector: string
  status: string
  dateJoined?: string
  currencySymbol?: string
  logoUrl?: string
  displayUrl?: string
  commissionRange?: {
    min?: number
    max?: number
  }
}

interface Promotion {
  promotionId?: number
  advertiserId?: number
  advertiserName?: string
  type?: string
  title?: string
  description?: string
  startDate?: string
  endDate?: string
  code?: string
}

export default function AwinPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loadingProgrammes, setLoadingProgrammes] = useState(true)
  const [loadingPromotions, setLoadingPromotions] = useState(true)
  const [errorProgrammes, setErrorProgrammes] = useState<string | null>(null)
  const [errorPromotions, setErrorPromotions] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/awin/programmes')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setProgrammes(Array.isArray(data) ? data : data.programmes ?? [])
      })
      .catch((e) => setErrorProgrammes(e.message))
      .finally(() => setLoadingProgrammes(false))

    fetch('/api/awin/promotions')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setPromotions(Array.isArray(data) ? data : data.promotions ?? [])
      })
      .catch((e) => setErrorPromotions(e.message))
      .finally(() => setLoadingPromotions(false))
  }, [])

  const filtered = programmes.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.primarySector?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Joined Programmes
            {!loadingProgrammes && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({filtered.length} of {programmes.length})
              </span>
            )}
          </h2>
          <input
            type="text"
            placeholder="Search by name or sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loadingProgrammes && (
          <div className="text-sm text-gray-500 animate-pulse">Loading programmes...</div>
        )}

        {errorProgrammes && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
            {errorProgrammes}
          </div>
        )}

        {!loadingProgrammes && !errorProgrammes && filtered.length === 0 && (
          <div className="text-sm text-gray-500">No programmes found.</div>
        )}

        {!loadingProgrammes && !errorProgrammes && filtered.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Programme</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Sector</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Commission</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Website</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        {p.logoUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.logoUrl} alt={p.name} className="h-6 w-auto object-contain" />
                        )}
                        {p.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.primarySector ?? '-'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          p.status === 'joined'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {p.commissionRange
                        ? `${p.commissionRange.min ?? '?'}% – ${p.commissionRange.max ?? '?'}%`
                        : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {p.displayUrl ? (
                        <a
                          href={`https://${p.displayUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate max-w-[160px] block"
                        >
                          {p.displayUrl}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Active Promotions</h2>

        {loadingPromotions && (
          <div className="text-sm text-gray-500 animate-pulse">Loading promotions...</div>
        )}

        {errorPromotions && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
            {errorPromotions}
          </div>
        )}

        {!loadingPromotions && !errorPromotions && promotions.length === 0 && (
          <div className="text-sm text-gray-500">No active promotions.</div>
        )}

        {!loadingPromotions && !errorPromotions && promotions.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {promotions.slice(0, 60).map((promo, i) => (
              <div key={promo.promotionId ?? i} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-medium text-gray-900 text-sm leading-tight">
                    {promo.advertiserName ?? 'Unknown Advertiser'}
                  </span>
                  {promo.type && (
                    <span className="shrink-0 inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {promo.type}
                    </span>
                  )}
                </div>
                {promo.title && (
                  <p className="text-sm text-gray-700 mb-1">{promo.title}</p>
                )}
                {promo.description && (
                  <p className="text-xs text-gray-500 line-clamp-2">{promo.description}</p>
                )}
                {promo.code && (
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-xs text-gray-500">Code:</span>
                    <code className="text-xs bg-gray-100 rounded px-1.5 py-0.5 font-mono text-gray-800">
                      {promo.code}
                    </code>
                  </div>
                )}
                {(promo.startDate || promo.endDate) && (
                  <p className="mt-1 text-xs text-gray-400">
                    {promo.startDate && `From ${promo.startDate.slice(0, 10)}`}
                    {promo.startDate && promo.endDate && ' · '}
                    {promo.endDate && `Until ${promo.endDate.slice(0, 10)}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
