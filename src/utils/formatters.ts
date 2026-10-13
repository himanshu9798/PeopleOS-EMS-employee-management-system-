export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  if (!dateString) return '—'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function formatTime(timeString: string): string {
  if (!timeString || timeString === '--') return '—'
  return timeString
}

export function getInitials(name: string): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Calculates working hours from 'HH:mm' checkIn and 'HH:mm' checkOut
 * Returns rounded decimal hours, or 0 if missing.
 */
export function calculateWorkingHours(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut || checkIn === '--' || checkOut === '--') return 0
  
  const [inH, inM] = checkIn.split(':').map(Number)
  const [outH, outM] = checkOut.split(':').map(Number)
  
  if (isNaN(inH) || isNaN(inM) || isNaN(outH) || isNaN(outM)) return 0
  
  const inMinutes = inH * 60 + inM
  const outMinutes = outH * 60 + outM
  
  if (outMinutes < inMinutes) return 0 // invalid or overnight without date
  
  const diffMinutes = outMinutes - inMinutes
  // Subtract typical 1 hour lunch break if > 5 hours
  const netMinutes = diffMinutes > 300 ? diffMinutes - 60 : diffMinutes
  const hours = netMinutes / 60
  return Number(Math.max(0, hours).toFixed(1))
}
