'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { label: 'Awin', href: '/awin' },
  { label: 'Commission Factory', href: '/commission-factory' },
]

export default function TabNav() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 gap-1">
          <span className="text-sm font-semibold text-gray-500 mr-4">Affiliate Networks</span>
          {tabs.map((tab) => {
            const active = pathname.startsWith(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
