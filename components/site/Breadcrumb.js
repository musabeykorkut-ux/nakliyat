import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumb({ items, backgroundImage }) {
  return (
    <div 
      className="relative bg-primary py-16 md:py-20"
      style={{
        backgroundImage: backgroundImage ? `linear-gradient(rgba(0, 60, 120, 0.85), rgba(0, 60, 120, 0.85)), url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center text-white">
          {/* Title */}
          {items && items.length > 0 && (
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {items[items.length - 1].label}
            </h1>
          )}
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm text-white/80">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Ana Sayfa</span>
            </Link>
            {items && items.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4" />
                {index === items.length - 1 ? (
                  <span className="text-white font-medium">{item.label}</span>
                ) : (
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
