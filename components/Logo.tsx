"use client"

import Link from "next/link"

interface LogoProps {
  isDark?: boolean
}

const Logo = ({ isDark = false }: LogoProps) => {
  return (
    <div className="flex items-center">
      <div className="mr-2 relative">
        <div className="w-9 h-9 bg-gradient-to-br from-[#2e4374] to-[#4d77cf] rounded-lg flex items-center justify-center transform rotate-12 shadow-md">
          <div className="w-7 h-7 bg-white rounded-md transform -rotate-12 flex items-center justify-center">
            <span className="text-[#2e4374] font-bold text-lg">A</span>
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full shadow-sm"></div>
      </div>
      <div className={`font-bold text-xl ${isDark ? "text-[#2e4374]" : "text-white"}`}>
        Agentas
      </div>
    </div>
  )
}

export default Logo 