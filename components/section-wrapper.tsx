"use client"

import React, { useEffect, useRef, useState } from "react"

type AnimationType = "fade-up" | "fade-down" | "fade-left" | "fade-right" | "fade" | "bounce"

interface SectionWrapperProps {
  children: React.ReactNode
  animation?: AnimationType
  delay?: number
  className?: string
}

export const SectionWrapper = ({
  children,
  animation = "fade-up",
  delay = 0,
  className = "",
}: SectionWrapperProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const getAnimationClass = () => {
    if (!isVisible) return "opacity-0"

    switch (animation) {
      case "fade-up":
        return "animate-fade-up"
      case "fade-down":
        return "animate-fade-down"
      case "fade-left":
        return "animate-fade-left"
      case "fade-right":
        return "animate-fade-right"
      case "fade":
        return "animate-fade"
      case "bounce":
        return "animate-bounce"
      default:
        return "animate-fade-up"
    }
  }

  return (
    <div
      ref={sectionRef}
      className={`transition-all duration-700 ${getAnimationClass()} ${className}`}
      style={{ 
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}

