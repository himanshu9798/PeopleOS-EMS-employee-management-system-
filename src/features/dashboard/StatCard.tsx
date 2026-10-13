import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, TrendingUp } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { cn } from '../../utils/cn'

interface StatCardProps {
  title: string
  value: string | number
  growthText?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: React.ReactNode
  linkTo?: string
  badgeText?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  growthText,
  trend = 'up',
  icon,
  linkTo,
  badgeText,
}) => {
  const content = (
    <Card className="p-5 hover:shadow-card hover:border-edge-dark transition-all group relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
            {title}
          </span>
          <div className="text-3xl font-bold text-ink-main mt-1 tracking-tight font-serif sm:font-sans">
            {value}
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-ivory-page border border-edge flex items-center justify-center text-plum shadow-soft group-hover:scale-105 transition-transform">
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        {growthText && (
          <div className="flex items-center gap-1 font-medium text-sage-dark">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{growthText}</span>
          </div>
        )}
        {badgeText && (
          <span className="px-2 py-0.5 rounded-full bg-plum/10 text-plum font-semibold text-[11px]">
            {badgeText}
          </span>
        )}
        {linkTo && (
          <span className="text-plum group-hover:text-terracotta transition-colors flex items-center gap-0.5 ml-auto font-semibold">
            <span>View</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        )}
      </div>

      {/* Subtle bottom terracotta accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-terracotta/20 group-hover:bg-terracotta transition-colors" />
    </Card>
  )

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>
  }

  return content
}
