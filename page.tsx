import { Phone, Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="bg-zinc-900 text-zinc-200 py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+420 735 500 003</span>
            </div>
            <div className="hidden sm:block text-zinc-400">9:30 – 16:00</div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-zinc-200">
                <Globe className="h-4 w-4 mr-2" />
                Česká republika
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>Deutsch</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center gap-12">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-zinc-800">EX</span>
              <span className="text-2xl font-bold text-orange-500">POHLEDÁVKY</span>
            </a>
            <div className="hidden lg:flex items-center gap-8">
              <a href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                O nás
              </a>
              <a href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                Naše služby
              </a>
              <a href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                Ceník
              </a>
              <a href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                Slovník a vzory
              </a>
              <a href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                Kariéra
              </a>
              <a href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                Kontakt
              </a>
            </div>
          </div>
          <Button variant="outline" className="hidden lg:flex">
            Klientská zóna
          </Button>
        </div>
      </nav>

      {/* Hero section */}
      <div className="relative h-[80vh] flex items-center justify-center bg-cover bg-center">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            KOMPLEXNÍ ŘEŠENÍ
            <br />
            VAŠICH POHLEDÁVEK
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-zinc-200">
            Konec dluhům! Vymáháme směnky, faktury, půjčky, nájemné a další...
          </p>
          <p className="text-orange-400 font-medium mb-8">"Z vašich pohledávek uděláme EXit"</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
              Chci VYMÁHAT
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              Chci PRODAT
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

