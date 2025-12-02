'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import SiteLayout from '@/components/site/SiteLayout'
import Breadcrumb from '@/components/site/Breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Tag, ArrowRight, Phone, Truck, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function BlogDetailPage() {
  const params = useParams()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [services, setServices] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, postsRes, servicesRes, settingsRes] = await Promise.all([
          fetch(`/api/blog/${params.slug}`),
          fetch('/api/blog'),
          fetch('/api/services'),
          fetch('/api/settings')
        ])
        const [postData, postsData, servicesData, settingsData] = await Promise.all([
          postRes.json(),
          postsRes.json(),
          servicesRes.json(),
          settingsRes.json()
        ])
        if (!postData.error) setPost(postData)
        if (postsData.length) setRelatedPosts(postsData.filter(p => p.slug !== params.slug).slice(0, 3))
        if (servicesData.length) setServices(servicesData.slice(0, 5))
        if (settingsData) setSettings(settingsData)
      } catch (error) {
        console.error('Data fetch error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.slug])

  const phone = settings?.phone || '0 (536) 740 92 06'
  const phoneRaw = settings?.phone_raw || '05367409206'

  if (loading) {
    return (
      <SiteLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </SiteLayout>
    )
  }

  if (!post) {
    return (
      <SiteLayout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Yazı Bulunamadı</h1>
          <Link href="/blog">
            <Button>Tüm Yazılar</Button>
          </Link>
        </div>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout>
      <Breadcrumb items={[
        { href: '/blog', label: 'Blog' },
        { label: post.title }
      ]} />

      <article className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Back Link */}
              <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" /> Tüm Yazılara Dön
              </Link>

              {/* Cover Image */}
              {post.image && (
                <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                {post.category && (
                  <span className="flex items-center gap-1">
                    <Tag className="h-4 w-4" /> {post.category}
                  </span>
                )}
                {post.published_at && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(post.published_at), 'dd MMMM yyyy', { locale: tr })}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{post.title}</h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{post.excerpt}</p>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none mb-12">
                {post.content ? (
                  <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
                ) : (
                  <p>Bu yazının içeriği henüz eklenmemiş.</p>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mb-8">
                  <span className="font-semibold">Etiketler:</span>
                  {post.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-muted rounded-full text-sm">{tag}</span>
                  ))}
                </div>
              )}

              {/* CTA */}
              <Card className="bg-primary text-white">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Profesyonel Nakliyat Hizmeti Mi Arıyorsunuz?</h3>
                    <p className="text-white/80">Hemen arayın, ücretsiz teklif alın!</p>
                  </div>
                  <a href={`tel:${phoneRaw}`}>
                    <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      <Phone className="mr-2 h-5 w-5" /> {phone}
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold mb-6">İlgili Yazılar</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {relatedPosts.map((p) => (
                      <Link key={p.id} href={`/blog/${p.slug}`}>
                        <Card className="hover:shadow-md transition-shadow h-full">
                          {p.image && (
                            <div className="h-32 overflow-hidden">
                              <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <CardContent className="p-4">
                            <h3 className="font-semibold line-clamp-2">{p.title}</h3>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* CTA Card */}
                <Card className="bg-secondary">
                  <CardContent className="p-6 text-center">
                    <Phone className="h-10 w-10 mx-auto mb-3 text-secondary-foreground" />
                    <h3 className="font-bold mb-2 text-secondary-foreground">Hemen Arayın</h3>
                    <a href={`tel:${phoneRaw}`}>
                      <Button className="w-full bg-primary text-white hover:bg-primary/90">
                        {phone}
                      </Button>
                    </a>
                  </CardContent>
                </Card>

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

                {/* Quote CTA */}
                <Link href="/teklif-al">
                  <Button className="w-full" size="lg">
                    Ücretsiz Teklif Al <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </SiteLayout>
  )
}
