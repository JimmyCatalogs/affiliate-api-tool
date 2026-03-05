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

interface Transaction {
  id: number
  advertiserId: number
  advertiserName: string
  commissionStatus: string
  commissionAmount: { amount: number; currency: string }
  saleAmount: { amount: number; currency: string }
  transactionDate: string
  orderRef?: string
}

interface AdvertiserReport {
  advertiserId: number
  advertiserName: string
  clicks: number
  impressions: number
  transactions: number
  commissionAmount: { amount: number; currency: string }
  saleAmount: { amount: number; currency: string }
}

const STATUS_COLOURS: Record<string, string> = {
  approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
  declined: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400',
  deleted: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
}

function fmt(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export default function AwinPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [advertiserReport, setAdvertiserReport] = useState<AdvertiserReport[]>([])

  const [loadingProgrammes, setLoadingProgrammes] = useState(true)
  const [loadingPromotions, setLoadingPromotions] = useState(true)
  const [loadingTransactions, setLoadingTransactions] = useState(true)
  const [loadingReport, setLoadingReport] = useState(true)

  const [errorProgrammes, setErrorProgrammes] = useState<string | null>(null)
  const [errorPromotions, setErrorPromotions] = useState<string | null>(null)
  const [errorTransactions, setErrorTransactions] = useState<string | null>(null)
  const [errorReport, setErrorReport] = useState<string | null>(null)

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

    fetch('/api/awin/transactions')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setTransactions(Array.isArray(data) ? data : [])
      })
      .catch((e) => setErrorTransactions(e.message))
      .finally(() => setLoadingTransactions(false))

    fetch('/api/awin/reports/advertiser')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setAdvertiserReport(Array.isArray(data) ? data : [])
      })
      .catch((e) => setErrorReport(e.message))
      .finally(() => setLoadingReport(false))
  }, [])

  const filtered = programmes.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.primarySector?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Joined Programmes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Joined Programmes
            {!loadingProgrammes && (
              <span className="ml-2 text-sm font-normal text-slate-400 dark:text-slate-500">
                ({filtered.length} of {programmes.length})
              </span>
            )}
          </h2>
          <input
            type="text"
            placeholder="Search by name or sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm w-64 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          />
        </div>

        {loadingProgrammes && (
          <div className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading programmes...</div>
        )}
        {errorProgrammes && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
            {errorProgrammes}
          </div>
        )}
        {!loadingProgrammes && !errorProgrammes && filtered.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-slate-400">No programmes found.</div>
        )}
        {!loadingProgrammes && !errorProgrammes && filtered.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Programme</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sector</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Commission</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Website</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-2">
                        {p.logoUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.logoUrl} alt={p.name} className="h-6 w-auto object-contain" />
                        )}
                        {p.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{p.primarySector ?? '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.status === 'joined'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
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
                          className="text-indigo-600 dark:text-indigo-400 hover:underline truncate max-w-[160px] block"
                        >
                          {p.displayUrl}
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

      {/* Active Promotions */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">Active Promotions</h2>

        {loadingPromotions && (
          <div className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading promotions...</div>
        )}
        {errorPromotions && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
            {errorPromotions}
          </div>
        )}
        {!loadingPromotions && !errorPromotions && promotions.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-slate-400">No active promotions.</div>
        )}
        {!loadingPromotions && !errorPromotions && promotions.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {promotions.slice(0, 60).map((promo, i) => (
              <div key={promo.promotionId ?? i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-medium text-slate-900 dark:text-slate-100 text-sm leading-tight">
                    {promo.advertiserName ?? 'Unknown Advertiser'}
                  </span>
                  {promo.type && (
                    <span className="shrink-0 inline-flex rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:text-indigo-400">
                      {promo.type}
                    </span>
                  )}
                </div>
                {promo.title && (
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">{promo.title}</p>
                )}
                {promo.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{promo.description}</p>
                )}
                {promo.code && (
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Code:</span>
                    <code className="text-xs bg-slate-100 dark:bg-slate-800 rounded px-1.5 py-0.5 font-mono text-slate-800 dark:text-slate-200">
                      {promo.code}
                    </code>
                  </div>
                )}
                {(promo.startDate || promo.endDate) && (
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
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

      {/* Recent Transactions */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Recent Transactions
          <span className="ml-2 text-sm font-normal text-slate-400 dark:text-slate-500">(last 30 days)</span>
        </h2>

        {loadingTransactions && (
          <div className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading transactions...</div>
        )}
        {errorTransactions && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
            {errorTransactions}
          </div>
        )}
        {!loadingTransactions && !errorTransactions && transactions.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-slate-400">No transactions in the last 30 days.</div>
        )}
        {!loadingTransactions && !errorTransactions && transactions.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Advertiser</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Order Ref</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sale</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Commission</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {t.transactionDate?.slice(0, 10) ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-900 dark:text-slate-100">{t.advertiserName}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono text-xs">{t.orderRef ?? '-'}</td>
                    <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {t.saleAmount ? fmt(t.saleAmount.amount, t.saleAmount.currency) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {t.commissionAmount ? fmt(t.commissionAmount.amount, t.commissionAmount.currency) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOURS[t.commissionStatus] ?? STATUS_COLOURS.deleted}`}>
                        {t.commissionStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Advertiser Performance */}
      <section>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Advertiser Performance
          <span className="ml-2 text-sm font-normal text-slate-400 dark:text-slate-500">(last 30 days · US)</span>
        </h2>

        {loadingReport && (
          <div className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading report...</div>
        )}
        {errorReport && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
            {errorReport}
          </div>
        )}
        {!loadingReport && !errorReport && advertiserReport.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-slate-400">No data for this period.</div>
        )}
        {!loadingReport && !errorReport && advertiserReport.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Advertiser</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Clicks</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Transactions</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sale Amount</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {advertiserReport.map((r) => (
                  <tr key={r.advertiserId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{r.advertiserName}</td>
                    <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{r.clicks?.toLocaleString() ?? '-'}</td>
                    <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{r.transactions?.toLocaleString() ?? '-'}</td>
                    <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                      {r.saleAmount ? fmt(r.saleAmount.amount, r.saleAmount.currency) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900 dark:text-slate-100">
                      {r.commissionAmount ? fmt(r.commissionAmount.amount, r.commissionAmount.currency) : '-'}
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
