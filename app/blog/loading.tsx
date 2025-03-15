import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
        <p className="text-lg font-medium text-zinc-700">Načítání článků...</p>
      </div>
    </div>
  )
}

