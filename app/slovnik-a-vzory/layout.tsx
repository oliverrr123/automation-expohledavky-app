import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function SlovnikAVzoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}

