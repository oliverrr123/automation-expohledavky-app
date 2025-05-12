import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-200 to-white">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="animate-pulse text-center space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-8"></div>
          <div className="h-96 bg-gray-300 rounded"></div>
        </div>
      </div>
      <Footer />
    </main>
  )
} 