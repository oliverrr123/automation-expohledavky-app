"use client"

import { useState, useEffect } from 'react'
import { ROUTES, CANONICAL_TO_LOCALIZED } from '@/lib/route-mapping'
import { getCurrentLocale } from '@/lib/i18n'

export default function DebugRoutesPage() {
  const [currentLocale, setCurrentLocale] = useState<string>('')
  
  useEffect(() => {
    setCurrentLocale(getCurrentLocale())
  }, [])
  
  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-8">Route Mapping Debug</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Current Locale: {currentLocale || 'Not detected'}</h2>
        <p className="text-sm text-gray-500">This is the locale detected from the hostname.</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Route Mappings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.entries(ROUTES).map(([locale, routes]) => (
            <div key={locale} className="border rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2 capitalize">{locale} Routes</h3>
              <div className="text-sm">
                <div className="mb-2 font-medium">Localized → Canonical</div>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left py-1 px-2">Localized</th>
                      <th className="text-left py-1 px-2">Canonical</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(routes).map(([localized, canonical]) => (
                      <tr key={localized} className="border-t">
                        <td className="py-1 px-2">{localized}</td>
                        <td className="py-1 px-2">{canonical}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Reverse Mappings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.entries(CANONICAL_TO_LOCALIZED).map(([locale, routes]) => (
            <div key={locale} className="border rounded-lg p-4">
              <h3 className="text-lg font-bold mb-2 capitalize">{locale} Routes</h3>
              <div className="text-sm">
                <div className="mb-2 font-medium">Canonical → Localized</div>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left py-1 px-2">Canonical</th>
                      <th className="text-left py-1 px-2">Localized</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(routes).map(([canonical, localized]) => (
                      <tr key={canonical} className="border-t">
                        <td className="py-1 px-2">{canonical}</td>
                        <td className="py-1 px-2">{localized}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Current URL Info</h2>
        <div className="border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="font-semibold">Hostname:</div>
              <div className="text-sm mb-2">{typeof window !== 'undefined' ? window.location.hostname : 'Not available'}</div>
              
              <div className="font-semibold">Current Path:</div>
              <div className="text-sm mb-2">{typeof window !== 'undefined' ? window.location.pathname : 'Not available'}</div>
              
              <div className="font-semibold">Full URL:</div>
              <div className="text-sm mb-2">{typeof window !== 'undefined' ? window.location.href : 'Not available'}</div>
            </div>
            
            <div>
              <div className="font-semibold">Middleware Header:</div>
              <div className="text-sm mb-2">X-Locale: {currentLocale}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 