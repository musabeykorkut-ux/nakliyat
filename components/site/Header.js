'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, Mail, Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState(null)
  const [menuItems, setMenuItems] = useState([])

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings)
    fetch('/api/admin/menu').then(r => r.json()).then(data => setMenuItems(data || []))
  }, [])

  const phone = settings?.phone || '0 (536) 740 92 06'
  const phoneRaw = settings?.phone_raw || '05367409206'
  const email = settings?.email || 'info@barajnakliyat.com'
  const logo = settings?.logo

  const parentMenus = menuItems.filter(item => !item.parent_id && item.is_active)
  const getChildren = (parentId) => menuItems.filter(item => item.parent_id === parentId && item.is_active)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex gap-4">
            <a href={`tel:${phoneRaw}`} className="flex items-center gap-1 hover:text-secondary transition">
              <Phone className="h-4 w-4" />
              <span>{phone}</span>
            </a>
            <a href={`mailto:${email}`} className="flex items-center gap-1 hover:text-secondary transition">
              <Mail className="h-4 w-4" />
              <span className="hidden md:inline">{email}</span>
            </a>
          </div>
          <div className="text-xs">7/24 Hizmet</div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {logo ? (
              <img src={logo} alt="Baraj Nakliyat" className="h-12 object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">B</div>
                <span className="text-xl font-bold text-primary">Baraj Nakliyat</span>
              </div>
            )}
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-6">
            {parentMenus.map((menu) => {
              const children = getChildren(menu.id)
              if (menu.is_dropdown && children.length > 0) {
                return (
                  <div key={menu.id} className="relative group">
                    <button className="flex items-center gap-1 hover:text-primary transition">
                      {menu.title}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      {children.map(child => (
                        <Link key={child.id} href={child.url || '#'} className="block px-4 py-2 hover:bg-primary/5 transition">
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              }
              return (
                <Link key={menu.id} href={menu.url || '#'} className="hover:text-primary transition font-medium">
                  {menu.title}
                </Link>
              )
            })}
            <Link href="/teklif-al">
              <Button className="bg-secondary hover:bg-secondary/90">Ücretsiz Teklif Al</Button>
            </Link>
          </nav>

          <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t pt-4">
            {parentMenus.map((menu) => {
              const children = getChildren(menu.id)
              return (
                <div key={menu.id} className="py-2">
                  <Link href={menu.url || '#'} className="block font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                    {menu.title}
                  </Link>
                  {children.length > 0 && (
                    <div className="ml-4 mt-2 space-y-2">
                      {children.map(child => (
                        <Link key={child.id} href={child.url || '#'} className="block text-sm text-muted-foreground hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
            <Link href="/teklif-al" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full mt-4">Ücretsiz Teklif Al</Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
