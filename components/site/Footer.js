'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  const [settings, setSettings] = useState(null)
  const [footerSettings, setFooterSettings] = useState(null)
  const [services, setServices] = useState([])

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings)
    fetch('/api/admin/footer').then(r => r.json()).then(setFooterSettings)
    fetch('/api/services').then(r => r.json()).then(data => setServices((data || []).slice(0, 5)))
  }, [])

  const phone = settings?.phone || '0 (536) 740 92 06'
  const phoneRaw = settings?.phone_raw || '05367409206'
  const email = settings?.email || 'info@barajnakliyat.com'
  const address = settings?.address || 'Adana, Türkiye'
  const logo = settings?.logo

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            {logo ? (
              <img src={logo} alt="Baraj Nakliyat" className="h-12 mb-4 brightness-0 invert" />
            ) : (
              <h3 className="text-white text-xl font-bold mb-4">Baraj Nakliyat</h3>
            )}
            <p className="text-sm">
              {footerSettings?.about_text || 'Adana ve çevresinde profesyonel evden eve nakliyat hizmeti sunuyoruz.'}
            </p>
            <div className="flex gap-3 mt-4">
              {settings?.facebook && <a href={settings.facebook} target="_blank" className="hover:text-white"><Facebook className="h-5 w-5" /></a>}
              {settings?.instagram && <a href={settings.instagram} target="_blank" className="hover:text-white"><Instagram className="h-5 w-5" /></a>}
              {settings?.twitter && <a href={settings.twitter} target="_blank" className="hover:text-white"><Twitter className="h-5 w-5" /></a>}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hizmetlerimiz</h4>
            <ul className="space-y-2 text-sm">
              {services.map(service => (
                <li key={service.id}>
                  <Link href={`/hizmetler/${service.slug}`} className="hover:text-white transition">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/hakkimizda" className="hover:text-white transition">Hakkımızda</Link></li>
              <li><Link href="/hizmetler" className="hover:text-white transition">Hizmetler</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/sss" className="hover:text-white transition">SSS</Link></li>
              <li><Link href="/iletisim" className="hover:text-white transition">İletişim</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">İletişim</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a href={`tel:${phoneRaw}`} className="hover:text-white transition">{phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition">{email}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4 text-center text-sm">
          <p>{footerSettings?.copyright_text || '© 2024 Baraj Nakliyat. Tüm hakları saklıdır.'}</p>
        </div>
      </div>
    </footer>
  )
}
