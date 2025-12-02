'use client'

import Link from 'next/link'
import { Truck, Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer({ settings, services = [], locations = [] }) {
  const phone = settings?.phone || '0 (536) 740 92 06'
  const phoneRaw = settings?.phone_raw || '05367409206'
  const email = settings?.email || 'info@barajnakliyat.com'
  const address = settings?.address || 'Adana, Türkiye'
  const whatsapp = settings?.whatsapp || phoneRaw

  const quickLinks = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/hizmetler', label: 'Hizmetler' },
    { href: '/hakkimizda', label: 'Hakkımızda' },
    { href: '/blog', label: 'Blog' },
    { href: '/galeri', label: 'Galeri' },
    { href: '/sss', label: 'SSS' },
    { href: '/iletisim', label: 'İletişim' },
  ]

  const defaultServices = [
    { slug: 'asansorlu-tasimacilik', title: 'Asansörlü Taşımacılık' },
    { slug: 'sehir-ici-nakliyat', title: 'Şehir İçi Nakliyat' },
    { slug: 'sehirler-arasi-nakliyat', title: 'Şehirler Arası Nakliyat' },
  ]

  const serviceList = services.length > 0 ? services : defaultServices

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* CTA Strip */}
      <div className="bg-secondary py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-secondary-foreground">Adana'da Güvenilir Evden Eve Nakliyat</h3>
              <p className="text-secondary-foreground/80">Hemen arayın, ücretsiz ekspertiz hizmeti alın!</p>
            </div>
            <div className="flex gap-4">
              <a href={`tel:${phoneRaw}`} className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                <Phone className="h-5 w-5" /> Hemen Ara
              </a>
              <a href={`https://wa.me/90${whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-secondary p-2 rounded-lg">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Baraj Nakliyat</h2>
                <p className="text-xs text-primary-foreground/70">Adana Evden Eve Nakliyat</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 mb-4">Adana'da 10+ yıllık tecrübemizle evden eve nakliyat, asansörlü taşımacılık ve şehirler arası nakliyat hizmetleri sunuyoruz.</p>
            <div className="flex gap-4">
              {settings?.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-secondary"><Facebook className="h-5 w-5" /></a>}
              {settings?.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-secondary"><Instagram className="h-5 w-5" /></a>}
              {settings?.twitter && <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-secondary"><Twitter className="h-5 w-5" /></a>}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-primary-foreground/80 hover:text-secondary transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hizmetlerimiz</h3>
            <ul className="space-y-2">
              {serviceList.slice(0, 5).map((service) => (
                <li key={service.slug}>
                  <Link href={`/hizmetler/${service.slug}`} className="text-primary-foreground/80 hover:text-secondary transition-colors">{service.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-secondary mt-0.5" />
                <a href={`tel:${phoneRaw}`} className="text-primary-foreground/80 hover:text-secondary">{phone}</a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-secondary mt-0.5" />
                <a href={`mailto:${email}`} className="text-primary-foreground/80 hover:text-secondary">{email}</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary mt-0.5" />
                <span className="text-primary-foreground/80">{address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-secondary mt-0.5" />
                <span className="text-primary-foreground/80">7/24 Hizmet</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/70">
            <p>© {new Date().getFullYear()} Baraj Nakliyat. Tüm hakları saklıdır.</p>
            <div className="flex gap-4">
              <Link href="/gizlilik-politikasi" className="hover:text-secondary">Gizlilik Politikası</Link>
              <Link href="/kullanim-sartlari" className="hover:text-secondary">Kullanım Şartları</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
