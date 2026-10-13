import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/Button'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-24 text-center max-w-md mx-auto">
      <span className="font-serif text-6xl font-bold text-plum block">404</span>
      <h2 className="font-serif text-2xl font-bold text-ink-main mt-2">
        Page not found
      </h2>
      <p className="text-sm text-ink-secondary mt-1 leading-relaxed">
        The workforce page or employee resource you are looking for has been moved or does not exist.
      </p>

      <div className="mt-6 flex justify-center gap-3">
        <Link to="/">
          <Button variant="primary" size="sm" icon={<Home className="w-3.5 h-3.5" />}>
            Overview Dashboard
          </Button>
        </Link>
        <Link to="/people">
          <Button variant="secondary" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
            Directory
          </Button>
        </Link>
      </div>
    </div>
  )
}
