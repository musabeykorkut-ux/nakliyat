'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SiteLayout from '@/components/site/SiteLayout'
import Breadcrumb from '@/components/site/Breadcrumb'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, Calendar, Search, Tag, Truck, Phone } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

const defaultPosts = [
  { id: '1', title: 'Taşınma İpuçları: Stressiz Bir Taşınma İçin', slug: 'tasinma-ipuclari', excerpt: 'Taşınma sürecini kolaylaştıracak pratik öneriler...', category: 'Taşınma İpuçları', image: 'https://images.unsplash.com/photo-1602750766769-8db8d49cc369?w=400', published_at: '2024-01-15' },
  { id: '2', title: 'Asansörlü Taşımacılık Rehberi', slug: 'asansorlu-tasimacilik-rehberi', excerpt: 'Yüksek katlara taşınırken bilmeniz gerekenler...', category: 'Rehber', image: 'https://images.unsplash.com/photo-1585541571714-01aa54eaf7c2?w=400', published_at: '2024-01-10' },
  { id: '3', title: 'Adana\'da Taşınırken Dikkat Edilmesi Gerekenler', slug: 'adanada-tasinirken-dikkat', excerpt: 'Adana\'da ev taşırken bilmeniz gereken önemli noktalar...', category: 'Bölgesel', image: 'https://images.unsplash.com/photo-1577075473292-5f62dfae5522?w=400', published_at: '2024-01-05' },
]

export default function BlogPage() {
  const [posts, setPosts] = useState(defaultPosts)
  const [services, setServices] = useState([])
  const [settings, setSettings] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, servicesRes, settingsRes] = await Promise.all([
          fetch('/api/blog'),
          fetch('/api/services'),
          fetch('/api/settings')
        ])
        const [postsData, servicesData, settingsData] = await Promise.all([
          postsRes.json(),
          servicesRes.json(),
          settingsRes.json()
        ])
        if (postsData.length) setPosts(postsData)
        if (servicesData.length) setServices(servicesData.slice(0, 5))
        if (settingsData) setSettings(settingsData)
      } catch (error) {
        console.error('Data fetch error:', error)
      }
    }
    fetchData()
  }, [])

  const phone = settings?.phone || '0 (536) 740 92 06'
  const phoneRaw = settings?.phone_raw || '05367409206'

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const categories = [...new Set(posts.map(p => p.category).filter(Boolean))]

  return (
    <SiteLayout>
      <Breadcrumb items={[{ label: 'Blog' }]} />

      <section className="py-12">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Blog & Makaleler</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Taşınma ipuçları, rehberler ve nakliyat hakkında faydalı bilgiler
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Search */}
              <div className="mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Yazılarda ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image || 'https://images.unsplash.com/photo-1602750766769-8db8d49cc369?w=400'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        {post.category && (
                          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                            {post.category}
                          </span>
                        )}
                        {post.published_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(post.published_at), 'dd MMM yyyy', { locale: tr })}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="link" className="p-0 h-auto text-primary">
                          Devamını Oku <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Aramanıza uygun yazı bulunamadı.</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* CTA Card */}
                <Card className="bg-primary text-white">
                  <CardContent className="p-6 text-center">
                    <Phone className="h-10 w-10 mx-auto mb-3" />
                    <h3 className="font-bold mb-2">Hemen Arayın</h3>
                    <p className="text-sm text-white/80 mb-4">Ücretsiz teklif alın</p>
                    <a href={`tel:${phoneRaw}`}>
                      <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                        {phone}
                      </Button>
                    </a>
                  </CardContent>
                </Card>

                {/* Categories */}
                {categories.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Tag className="h-5 w-5" /> Kategoriler
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <span key={cat} className="px-3 py-1 bg-muted rounded-full text-sm cursor-pointer hover:bg-primary hover:text-white transition-colors">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Services */}
                {services.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Truck className="h-5 w-5" /> Hizmetlerimiz
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {services.map((service) => (
                          <Link key={service.id} href={`/hizmetler/${service.slug}`}>
                            <div className="flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors">
                              <ArrowRight className="h-4 w-4 text-primary" />
                              <span className="text-sm">{service.title}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
