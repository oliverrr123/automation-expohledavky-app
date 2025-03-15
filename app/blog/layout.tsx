import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Blog | ExPohledávky",
  description: "Odborný portál o správě a vymáhání pohledávek. Články s praktickými radami pro firmy a podnikatele.",
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}

