'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  Settings,
  FileText,
  HelpCircle,
  MessageSquare,
  Users,
  MapPin,
  Truck,
  Menu,
  X,
  LogOut,
  Inbox,
  ClipboardList,
  Search,
  Image,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/ayarlar', label: 'Site Ayarları', icon: Settings },
  { href: '/admin/anasayfa', label: 'Anasayfa', icon: FileText },
  { href: '/admin/seo', label: 'SEO Ayarları', icon: Search },
  { href: '/admin/hizmetler', label: 'Hizmetler', icon: Truck },
  { href: '/admin/bolgeler', label: 'Bölgeler', icon: MapPin },
  { href: '/admin/blog', label: 'Blog Yazıları', icon: FileText },
  { href: '/admin/galeri', label: 'Galeri', icon: Image },
  { href: '/admin/sss', label: 'SSS', icon: HelpCircle },
  { href: '/admin/yorumlar', label: 'Müşteri Yorumları', icon: Users },
  { href: '/admin/teklif-talepleri', label: 'Teklif Talepleri', icon: ClipboardList },
  { href: '/admin/mesajlar', label: 'Gelen Mesajlar', icon: Inbox },
]

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const session = localStorage.getItem('admin_session')
    if (!session && pathname !== '/admin/giris') {
      router.push('/admin/giris')
    } else if (session) {
      setUser(JSON.parse(session))
    }
    setLoading(false)
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem('admin_session')
    router.push('/admin/giris')
  }

  // Show login page without layout
  if (pathname === '/admin/giris') {
    return (
      <>
        {children}
        <Toaster position="top-right" />
      </>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Mobile Header */}
      <header className="lg:hidden bg-primary text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Truck className="h-6 w-6" />
          <span className="font-bold">Baraj Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white transform transition-transform duration-300 ease-in-out overflow-y-auto
          lg:relative lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-white/10 hidden lg:block">
            <Link href="/admin" className="flex items-center gap-3">
              <Truck className="h-8 w-8 text-secondary" />
              <div>
                <h1 className="font-bold text-lg">Baraj Nakliyat</h1>
                <p className="text-xs text-white/70">Admin Panel</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1 mt-4 lg:mt-0">
            {sidebarLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/10 mt-auto space-y-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full"
            >
              <ExternalLink className="h-5 w-5" />
              <span>Siteyi Görüntüle</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full"
            >
              <LogOut className="h-5 w-5" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      <Toaster position="top-right" />
    </div>
  )
}
