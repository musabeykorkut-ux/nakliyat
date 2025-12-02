'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, Truck, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function Header({ settings, services = [], locations = [] }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const phone = settings?.phone || '0 (536) 740 92 06'
  const phoneRaw = settings?.phone_raw || '05367409206'
  const logo = settings?.logo || null

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const mainNavLinks = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/hakkimizda', label: 'Hakkımızda' },
    { href: '/blog', label: 'Blog' },
    { href: '/galeri', label: 'Galeri' },
    { href: '/sss', label: 'SSS' },
    { href: '/iletisim', label: 'İletişim' },
  ]

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'}`}>
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span>7/24 Hizmetinizdeyiz</span>
          </div>
          <a href={`tel:${phoneRaw}`} className="flex items-center gap-2 font-semibold hover:text-secondary transition-colors">
            <Phone className="h-4 w-4" />
            {phone}
          </a>
        </div>
      </div>

      {/* Main Header */}
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {logo ? (
              <img src={logo} alt="Baraj Nakliyat" className="h-12 w-auto" />
            ) : (
              <>
                <div className="bg-primary p-2 rounded-lg">
                  <Truck className="h-8 w-8 text-secondary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-primary">Baraj Nakliyat</h1>
                  <p className="text-xs text-muted-foreground">Adana Evden Eve Nakliyat</p>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 text-sm font-medium transition-colors ${pathname === '/' ? 'text-primary' : 'text-foreground hover:text-primary'}`}
            >
              Ana Sayfa
            </Link>

            {/* Hizmetler Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Hizmetler <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/hizmetler" className="w-full cursor-pointer font-semibold">
                    Tüm Hizmetler
                  </Link>
                </DropdownMenuItem>
                <div className="border-t my-1" />
                {services.length > 0 ? services.map((service) => (
                  <DropdownMenuItem key={service.id} asChild>
                    <Link href={`/hizmetler/${service.slug}`} className="w-full cursor-pointer">
                      {service.title}
                    </Link>
                  </DropdownMenuItem>
                )) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/hizmetler/asansorlu-tasimacilik" className="w-full cursor-pointer">Asansörlü Taşımacılık</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/hizmetler/sehir-ici-nakliyat" className="w-full cursor-pointer">Şehir İçi Nakliyat</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/hizmetler/sehirler-arasi-nakliyat" className="w-full cursor-pointer">Şehirler Arası Nakliyat</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Bölgeler Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Bölgeler <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {locations.length > 0 ? locations.map((location) => (
                  <DropdownMenuItem key={location.id} asChild>
                    <Link href={`/bolgeler/${location.slug}`} className="w-full cursor-pointer">
                      {location.name} Nakliyat
                    </Link>
                  </DropdownMenuItem>
                )) : (
                  <>
                    <DropdownMenuItem asChild><Link href="/bolgeler/saricam" className="w-full cursor-pointer">Sarıçam Nakliyat</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/bolgeler/cukurova" className="w-full cursor-pointer">Çukurova Nakliyat</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/bolgeler/seyhan" className="w-full cursor-pointer">Seyhan Nakliyat</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/bolgeler/yuregir" className="w-full cursor-pointer">Yüreğir Nakliyat</Link></DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {mainNavLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium transition-colors ${pathname === link.href ? 'text-primary' : 'text-foreground hover:text-primary'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/teklif-al">
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold">
                Ücretsiz Teklif Al
              </Button>
            </Link>
            <a href={`tel:${phoneRaw}`}>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                <Phone className="h-4 w-4 mr-2" />
                Hemen Ara
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-2">
              <Link href="/" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg" onClick={() => setIsOpen(false)}>Ana Sayfa</Link>
              <Link href="/hizmetler" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg" onClick={() => setIsOpen(false)}>Hizmetler</Link>
              <Link href="/bolgeler/saricam" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg pl-8" onClick={() => setIsOpen(false)}>- Sarıçam</Link>
              <Link href="/bolgeler/cukurova" className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg pl-8" onClick={() => setIsOpen(false)}>- Çukurova</Link>
              {mainNavLinks.slice(1).map((link) => (
                <Link key={link.href} href={link.href} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg" onClick={() => setIsOpen(false)}>{link.label}</Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                <Link href="/teklif-al" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-secondary text-secondary-foreground">Ücretsiz Teklif Al</Button>
                </Link>
                <a href={`tel:${phoneRaw}`}>
                  <Button variant="outline" className="w-full border-primary text-primary">
                    <Phone className="h-4 w-4 mr-2" /> Hemen Ara
                  </Button>
                </a>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
