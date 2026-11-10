import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export function formatConfidence(value: number): string {
  return `${(value * 100).toFixed(0)}%`
}

export function confidenceColor(value: number): string {
  if (value >= 0.8) return 'text-green-600'
  if (value >= 0.5) return 'text-yellow-600'
  return 'text-red-600'
}

export function confidenceBadgeVariant(value: number): 'default' | 'secondary' | 'destructive' {
  if (value >= 0.8) return 'default'
  if (value >= 0.5) return 'secondary'
  return 'destructive'
}
