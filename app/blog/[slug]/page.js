'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import SiteLayout from '@/components/site/SiteLayout'
import Breadcrumb from '@/components/site/Breadcrumb'
import Sidebar from '@/components/site/Sidebar'
import ImageGallery from '@/components/site/ImageGallery'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Tag, Clock, ArrowRight } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const defaultPosts = [
  { 
    id: '1', 
    title: 'Taşınma İpuçları: Stressiz Bir Taşınma İçin', 
    slug: 'tasinma-ipuclari', 
    excerpt: 'Taşınma sürecini kolaylaştıracak pratik öneriler...', 
    content: '<h2>Stressiz Taşınma İçin İpuçları</h2><p>Taşınma stresli bir süreç olabilir ama doğru planlama ile bu süreci kolaylaştırabilirsiniz.</p><h3>1. Erken Başlayın</h3><p>Taşınmadan en az 2-3 hafta önce hazırlıklara başlayın.</p><h3>2. Eşyalarınızı Kategorize Edin</h3><p>Eşyalarınızı odalara göre ayırın ve etiketleyin.</p><h3>3. Gereksiz Eşyalardan Kurtulun</h3><p>Taşınma, kullanmadığınız eşyalardan kurtulmak için harika bir fırsattır.</p>',
    category: 'Taşınma İpuçları',
    tags: ['taşınma', 'ipuçları'],
    image: 'https://images.unsplash.com/photo-1602750766769-8db8d49cc369?w=800',
    published_at: '2024-01-15'
  },
  { 
    id: '2', 
    title: 'Asansörlü Taşımacılık Rehberi', 
    slug: 'asansorlu-tasimacilik-rehberi', 
    excerpt: 'Yüksek katlara taşınırken bilmeniz gerekenler...', 
    content: '<h2>Asansörlü Taşımacılık Nedir?</h2><p>Yüksek katlı binalarda eşya taşımak için kullanılan özel asansör sistemidir.</p>',
    category: 'Rehber',
    tags: ['asansörlü', 'taşımacılık'],
    image: 'https://images.unsplash.com/photo-1585541571714-01aa54eaf7c2?w=800',
    published_at: '2024-01-10'
  },
]

const defaultFaqs = [
  { id: '1', question: 'Blog yazılarınızı ne sıklıkla yayınlıyorsunuz?', answer: 'Haftada 2-3 kez yeni blog yazıları yayınlıyoruz.' },
  { id: '2', question: 'Taşınma ile ilgili özel sorularım var, nasıl iletişime geçebilirim?', answer: 'Telefon veya email yoluyla bize ulaşabilirsiniz.' },
]

export default function BlogDetailPage() {
  const params = useParams()
  const [post, setPost] = useState(null)
  const [recentPosts, setRecentPosts] = useState(defaultPosts)
  const [services, setServices] = useState([])
  const [faqs, setFaqs] = useState(defaultFaqs)
  const [gallery, setGallery] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, postsRes, servicesRes, faqsRes, galleryRes, settingsRes] = await Promise.all([
          fetch(`/api/blog/${params.slug}`),
          fetch('/api/blog'),
          fetch('/api/services'),
          fetch('/api/faq'),
          fetch('/api/gallery'),
          fetch('/api/settings')
        ])
        
        const [postData, postsData, servicesData, faqsData, galleryData, settingsData] = await Promise.all([
          postRes.json(),
          postsRes.json(),
          servicesRes.json(),
          faqsRes.json(),
          galleryRes.json(),
          settingsRes.json()
        ])
        
        if (!postData.error && postData.slug) {
          setPost(postData)
        } else {
          const defaultPost = defaultPosts.find(p => p.slug === params.slug)
          setPost(defaultPost || null)
        }
        
        if (postsData && postsData.length > 0) {
          setRecentPosts(postsData.filter(p => p.slug !== params.slug).slice(0, 3))
        }
        
        if (servicesData && servicesData.length > 0) {
          setServices(servicesData)
        }
        
        if (faqsData && faqsData.length > 0) {
          setFaqs(faqsData)
        }
        
        if (galleryData && galleryData.length > 0) {
          setGallery(galleryData.slice(0, 8))
        }
        
        if (settingsData) {
          setSettings(settingsData)
        }
      } catch (error) {
        console.error('Data fetch error:', error)
        const defaultPost = defaultPosts.find(p => p.slug === params.slug)
        setPost(defaultPost || null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.slug])

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
        <Breadcrumb items={[{ label: 'Blog', href: '/blog' }, { label: 'Yazı Bulunamadı', href: '#' }]} />
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h2 className="text-2xl font-bold mb-2">Yazı Bulunamadı</h2>
              <p className="text-muted-foreground mb-4">Aradığınız blog yazısı bulunamadı.</p>
              <Link href="/blog">
                <button className="px-4 py-2 bg-primary text-white rounded">Tüm Yazılar</button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout>
      <Breadcrumb 
        items={[
          { label: 'Blog', href: '/blog' },
          { label: post.title, href: '#' }
        ]}
        backgroundImage={post.image}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Post Image */}
            {post.image && (
              <div className="rounded-lg overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-[400px] object-cover" />
              </div>
            )}

            {/* Post Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.published_at || post.created_at).toLocaleDateString('tr-TR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span>{post.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>5 dk okuma</span>
              </div>
            </div>

            {/* Post Content */}
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{post.title}</CardTitle>
                {post.excerpt && (
                  <p className="text-lg text-muted-foreground">{post.excerpt}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
              </CardContent>
            </Card>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium">Etiketler:</span>
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Galeri</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageGallery images={gallery} />
                </CardContent>
              </Card>
            )}

            {/* Recent Posts */}
            {recentPosts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>İlgili Yazılar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPosts.map((relatedPost) => (
                      <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                        <div className="flex gap-4 p-4 hover:bg-muted rounded-lg transition-colors">
                          {relatedPost.image && (
                            <img src={relatedPost.image} alt={relatedPost.title} className="w-24 h-24 object-cover rounded" />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{relatedPost.title}</h3>
                            <p className="text-sm text-muted-foreground">{relatedPost.excerpt}</p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Sık Sorulan Sorular</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {faqs.map((faq, index) => (
                      <AccordionItem key={faq.id} value={`faq-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar 
              services={services} 
              faqs={faqs.slice(0, 3)} 
              settings={settings}
            />
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
