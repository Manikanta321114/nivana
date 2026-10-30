import React from 'react'
import { Link } from 'react-router-dom'
import { Home, Search, HelpCircle } from 'lucide-react'
import { Button } from '../../components/ui/Button'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="pt-24 pb-20 min-h-[75vh] flex items-center justify-center bg-bg-base">
      <div className="page-container text-center max-w-lg">
        <div className="w-20 h-20 bg-primary-100 text-primary-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Home size={38} />
        </div>

        <span className="text-xs uppercase font-bold tracking-widest text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
          404 Error
        </span>

        <h1 className="text-3xl sm:text-4xl font-display font-bold text-stone-900 mt-4 mb-3">
          Page Not Found
        </h1>

        <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-8">
          The property listing, page, or link you are looking for might have been moved, occupied, or does not exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button variant="primary" leftIcon={<Home size={16} />}>
              Return Home
            </Button>
          </Link>
          <Link to="/properties">
            <Button variant="outline" leftIcon={<Search size={16} />}>
              Explore Properties
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="ghost" leftIcon={<HelpCircle size={16} />}>
              Contact Desk
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
