'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClipboardList, Inbox, Truck, FileText, Users, MapPin, Image, HelpCircle, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_quotes: 0, new_quotes: 0,
    total_messages: 0, unread_messages: 0,
    total_services: 0, total_blogs: 0
  })
  const [recentQuotes, setRecentQuotes] = useState([])
  const [recentMessages, setRecentMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, quotesRes, messagesRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/quote-requests'),
          fetch('/api/admin/contact-messages')
        ])
        const [statsData, quotesData, messagesData] = await Promise.all([
          statsRes.json(),
          quotesRes.json(),
          messagesRes.json()
        ])
        setStats(statsData)
        if (Array.isArray(quotesData)) setRecentQuotes(quotesData.slice(0, 5))
        if (Array.isArray(messagesData)) setRecentMessages(messagesData.slice(0, 5))
      } catch (error) {
        console.error('Stats fetch error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statCards = [
    { title: 'Teklif Talepleri', value: stats.total_quotes, subValue: `${stats.new_quotes} yeni`, icon: ClipboardList, color: 'text-blue-600', bgColor: 'bg-blue-100', href: '/admin/teklif-talepleri' },
    { title: 'Gelen Mesajlar', value: stats.total_messages, subValue: `${stats.unread_messages} okunmamış`, icon: Inbox, color: 'text-green-600', bgColor: 'bg-green-100', href: '/admin/mesajlar' },
    { title: 'Hizmetler', value: stats.total_services, subValue: 'Toplam hizmet', icon: Truck, color: 'text-purple-600', bgColor: 'bg-purple-100', href: '/admin/hizmetler' },
    { title: 'Blog Yazıları', value: stats.total_blogs, subValue: 'Toplam yazı', icon: FileText, color: 'text-orange-600', bgColor: 'bg-orange-100', href: '/admin/blog' }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Baraj Nakliyat yönetim paneline hoş geldiniz</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link key={index} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold">{loading ? '-' : stat.value}</p>
                      <p className="text-sm text-muted-foreground mt-1">{stat.subValue}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quotes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Son Teklif Talepleri</CardTitle>
            <Link href="/admin/teklif-talepleri" className="text-sm text-primary hover:underline">Tümünü Gör</Link>
          </CardHeader>
          <CardContent>
            {recentQuotes.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Henüz teklif talebi yok</p>
            ) : (
              <div className="space-y-3">
                {recentQuotes.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{quote.name}</p>
                      <p className="text-sm text-muted-foreground">{quote.from_district} → {quote.to_district}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded ${quote.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {quote.status === 'new' ? 'Yeni' : quote.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {quote.created_at && format(new Date(quote.created_at), 'dd.MM.yyyy', { locale: tr })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Son Mesajlar</CardTitle>
            <Link href="/admin/mesajlar" className="text-sm text-primary hover:underline">Tümünü Gör</Link>
          </CardHeader>
          <CardContent>
            {recentMessages.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Henüz mesaj yok</p>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <div key={msg.id} className={`p-3 rounded-lg ${!msg.is_read ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-muted'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{msg.name}</p>
                      {!msg.is_read && <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">Yeni</span>}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{msg.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {msg.created_at && format(new Date(msg.created_at), 'dd.MM.yyyy HH:mm', { locale: tr })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { href: '/admin/hizmetler', icon: Truck, label: 'Hizmet Ekle', color: 'text-blue-600' },
            { href: '/admin/blog', icon: FileText, label: 'Blog Ekle', color: 'text-green-600' },
            { href: '/admin/bolgeler', icon: MapPin, label: 'Bölge Ekle', color: 'text-purple-600' },
            { href: '/admin/galeri', icon: Image, label: 'Galeri', color: 'text-orange-600' },
            { href: '/admin/sss', icon: HelpCircle, label: 'SSS Ekle', color: 'text-red-600' },
            { href: '/admin/yorumlar', icon: Users, label: 'Yorum Ekle', color: 'text-teal-600' },
          ].map((item, i) => (
            <Link key={i} href={item.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer text-center p-4">
                <item.icon className={`h-8 w-8 mx-auto mb-2 ${item.color}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
