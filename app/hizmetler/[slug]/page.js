'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import SiteLayout from '@/components/site/SiteLayout'
import Breadcrumb from '@/components/site/Breadcrumb'
import Sidebar from '@/components/site/Sidebar'
import ImageGallery from '@/components/site/ImageGallery'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { CheckCircle, Phone, ArrowRight, Truck } from 'lucide-react'
import { toast } from 'sonner'

const defaultServices = [
  { id: '1', title: 'Asansörlü Taşımacılık', slug: 'asansorlu-tasimacilik', short_description: 'Yüksek katlara güvenli ve hızlı taşımacılık', content: '<h2>Asansörlü Taşımacılık Hizmeti</h2><p>Yüksek katlı binalarda taşınma işlemleri için profesyonel asansörlü taşımacılık hizmeti sunuyoruz. 8 kata kadar ulaşabilen modern asansör sistemimiz ile eşyalarınızı güvenle taşıyoruz.</p><h3>Hizmetin Avantajları</h3><ul><li>Hızlı ve güvenli taşıma</li><li>Eşyalara zarar vermeden taşıma</li><li>Zaman tasarrufu</li><li>Profesyonel ekip</li></ul>', image: 'https://images.unsplash.com/photo-1585541571714-01aa54eaf7c2?w=800' },
  { id: '2', title: 'Şehir İçi Nakliyat', slug: 'sehir-ici-nakliyat', short_description: 'Adana içi hızlı ve ekonomik taşımacılık', content: '<h2>Şehir İçi Nakliyat</h2><p>Adana merkez ve tüm ilçelerinde şehir içi evden eve nakliyat hizmeti sunuyoruz.</p>', image: 'https://images.unsplash.com/photo-1602750766769-8db8d49cc369?w=800' },
  { id: '3', title: 'Şehirler Arası Nakliyat', slug: 'sehirler-arasi-nakliyat', short_description: 'Türkiye geneli güvenli taşımacılık', content: '<h2>Şehirler Arası Nakliyat</h2><p>Türkiye genelinde şehirler arası taşımacılık hizmeti.</p>', image: 'https://images.unsplash.com/photo-1586864387634-29caff60e48e?w=800' },
]

const defaultFaqs = [
  { id: '1', question: 'Asansörlü taşımacılık hangi durumlarda gereklidir?', answer: 'Yüksek katlar, dar merdiven boşlukları ve büyük eşyalar için asansörlü taşımacılık ideal bir çözümdür.' },
  { id: '2', question: 'Fiyatlar nasıl belirlenir?', answer: 'Fiyatlarımız kat sayısı, eşya miktarı ve mesafeye göre belirlenir.' },
  { id: '3', question: 'Sigorta var mı?', answer: 'Evet, tüm taşımacılık hizmetlerimiz sigorta kapsamındadır.' },
]

export default function ServiceDetailPage() {
  const params = useParams()
  const [service, setService] = useState(null)
  const [services, setServices] = useState(defaultServices)
  const [faqs, setFaqs] = useState(defaultFaqs)
  const [gallery, setGallery] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ name: '', phone: '', from_district: '', to_district: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to fetch from API
        const [serviceRes, servicesRes, faqsRes, galleryRes, settingsRes] = await Promise.all([
          fetch(`/api/services/${params.slug}`),
          fetch('/api/services'),
          fetch('/api/faq'),
          fetch('/api/gallery'),
          fetch('/api/settings')
        ])
        
        const [serviceData, servicesData, faqsData, galleryData, settingsData] = await Promise.all([
          serviceRes.json(),
          servicesRes.json(),
          faqsRes.json(),
          galleryRes.json(),
          settingsRes.json()
        ])
        
        // Use API data if available, otherwise use defaults
        if (!serviceData.error && serviceData.slug) {
          setService(serviceData)
        } else {
          // Use default data
          const defaultService = defaultServices.find(s => s.slug === params.slug)
          setService(defaultService || null)
        }
        
        if (servicesData && servicesData.length > 0) {
          setServices(servicesData.filter(s => s.slug !== params.slug))
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
        // Use default data on error
        const defaultService = defaultServices.find(s => s.slug === params.slug)
        setService(defaultService || null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.slug])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/quote-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        toast.success('Teklif talebiniz alındı! En kısa sürede sizinle iletişime geçeceğiz.')
        setFormData({ name: '', phone: '', from_district: '', to_district: '', notes: '' })
      } else {
        toast.error('Bir hata oluştu, lütfen tekrar deneyin.')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <SiteLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </SiteLayout>
    )
  }

  if (!service) {
    return (
      <SiteLayout>
        <Breadcrumb items={[{ label: 'Hizmetler', href: '/hizmetler' }, { label: 'Hizmet Bulunamadı', href: '#' }]} />
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Truck className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Hizmet Bulunamadı</h2>
              <p className="text-muted-foreground mb-4">Aradığınız hizmet bulunamadı.</p>
              <Link href="/hizmetler">
                <Button>Tüm Hizmetler</Button>
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
          { label: 'Hizmetler', href: '/hizmetler' },
          { label: service.title, href: '#' }
        ]}
        backgroundImage={service.image}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Image */}
            {service.image && (
              <div className="rounded-lg overflow-hidden">
                <img src={service.image} alt={service.title} className="w-full h-[400px] object-cover" />
              </div>
            )}

            {/* Service Content */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{service.title}</CardTitle>
                {service.short_description && (
                  <p className="text-muted-foreground">{service.short_description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: service.content }} />
              </CardContent>
            </Card>

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

            {/* Quote Form */}
            <Card>
              <CardHeader>
                <CardTitle>Ücretsiz Teklif Alın</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Adınız Soyadınız *</Label>
                      <Input 
                        value={formData.name} 
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefon *</Label>
                      <Input 
                        value={formData.phone} 
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nereden</Label>
                      <Input 
                        value={formData.from_district} 
                        onChange={(e) => setFormData(prev => ({ ...prev, from_district: e.target.value }))} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nereye</Label>
                      <Input 
                        value={formData.to_district} 
                        onChange={(e) => setFormData(prev => ({ ...prev, to_district: e.target.value }))} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notlar</Label>
                    <Textarea 
                      value={formData.notes} 
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} 
                      rows={4}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? 'Gönderiliyor...' : 'Teklif Al'}
                  </Button>
                </form>
              </CardContent>
            </Card>

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
              currentSlug={service.slug}
            />
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
