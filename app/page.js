'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SiteLayout from '@/components/site/SiteLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Phone, Truck, Shield, Clock, Award, CheckCircle, ArrowRight, Star, MapPin, Building2 } from 'lucide-react'

// Default data for when database is empty
const defaultServices = [
  { id: '1', title: 'Asansörlü Taşımacılık', slug: 'asansorlu-tasimacilik', short_description: 'Yüksek katlara güvenli ve hızlı taşımacılık', icon: 'Building2' },
  { id: '2', title: 'Şehir İçi Nakliyat', slug: 'sehir-ici-nakliyat', short_description: 'Adana içi hızlı ve ekonomik taşımacılık', icon: 'Truck' },
  { id: '3', title: 'Şehirler Arası Nakliyat', slug: 'sehirler-arasi-nakliyat', short_description: 'Türkiye geneli güvenli taşımacılık', icon: 'MapPin' },
  { id: '4', title: 'Sarıçam Nakliyat', slug: 'saricam-nakliyat', short_description: 'Sarıçam bölgesi özel hizmet', icon: 'Truck' },
  { id: '5', title: 'Çukurova Nakliyat', slug: 'cukurova-nakliyat', short_description: 'Çukurova bölgesi özel hizmet', icon: 'Truck' },
]

const defaultLocations = [
  { id: '1', name: 'Sarıçam', slug: 'saricam' },
  { id: '2', name: 'Çukurova', slug: 'cukurova' },
  { id: '3', name: 'Seyhan', slug: 'seyhan' },
  { id: '4', name: 'Yüreğir', slug: 'yuregir' },
  { id: '5', name: 'Ceyhan', slug: 'ceyhan' },
]

const defaultFaqs = [
  { id: '1', question: 'Evden eve nakliyat fiyatları nasıl belirlenir?', answer: 'Fiyatlarımız eşya miktarı, mesafe, kat sayısı ve ek hizmetlere göre belirlenir. Ücretsiz ekspertiz ile kesin fiyat alın.', category: 'Genel' },
  { id: '2', question: 'Asansörlü taşımacılık hangi durumlarda gereklidir?', answer: 'Yüksek katlar, dar merdiven boşlukları ve büyük eşyalar için asansörlü taşımacılık ideal bir çözümdür.', category: 'Asansörlü Taşımacılık' },
  { id: '3', question: 'Eşyalarım sigortalı mı?', answer: 'Evet, tüm taşımacılık hizmetlerimiz sigorta kapsamındadır.', category: 'Genel' },
]

const defaultTestimonials = [
  { id: '1', name: 'Ahmet Yılmaz', district: 'Sarıçam', rating: 5, comment: 'Harika bir hizmet aldık. Ekip çok özverili ve dikkatli çalıştı. Teşekkürler Baraj Nakliyat!' },
  { id: '2', name: 'Fatma Demir', district: 'Çukurova', rating: 5, comment: 'Zamanında geldiler ve tüm eşyalarımızı özenle taşıdılar. Kesinlikle tavsiye ederim.' },
  { id: '3', name: 'Mehmet Kaya', district: 'Seyhan', rating: 5, comment: 'Fiyat/performans çok iyi. Profesyonel ekip, kaliteli hizmet.' },
]

const defaultBlogPosts = [
  { id: '1', title: 'Taşınma İpuçları: Stressiz Bir Taşınma İçin', slug: 'tasinma-ipuclari', excerpt: 'Taşınma sürecini kolaylaştıracak pratik öneriler...', category: 'Taşınma İpuçları', image: 'https://images.unsplash.com/photo-1602750766769-8db8d49cc369?w=400' },
  { id: '2', title: 'Asansörlü Taşımacılık Rehberi', slug: 'asansorlu-tasimacilik-rehberi', excerpt: 'Yüksek katlara taşınırken bilmeniz gerekenler...', category: 'Rehber', image: 'https://images.unsplash.com/photo-1585541571714-01aa54eaf7c2?w=400' },
]

const iconMap = {
  Truck: Truck,
  Building2: Building2,
  MapPin: MapPin,
  Shield: Shield,
}

export default function HomePage() {
  const [services, setServices] = useState(defaultServices)
  const [locations, setLocations] = useState(defaultLocations)
  const [faqs, setFaqs] = useState(defaultFaqs)
  const [testimonials, setTestimonials] = useState(defaultTestimonials)
  const [blogPosts, setBlogPosts] = useState(defaultBlogPosts)
  const [settings, setSettings] = useState(null)
  const [sliders, setSliders] = useState([])
  const [heroContent, setHeroContent] = useState(null)
  const [tabs, setTabs] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, locationsRes, faqsRes, testimonialsRes, blogRes, settingsRes, slidersRes, heroRes, tabsRes] = await Promise.all([
          fetch('/api/services/featured'),
          fetch('/api/locations'),
          fetch('/api/faq'),
          fetch('/api/testimonials'),
          fetch('/api/blog/featured'),
          fetch('/api/settings'),
          fetch('/api/admin/sliders'),
          fetch('/api/admin/hero-content'),
          fetch('/api/admin/tabs')
        ])

        const [servicesData, locationsData, faqsData, testimonialsData, blogData, settingsData, slidersData, heroData, tabsData] = await Promise.all([
          servicesRes.json(),
          locationsRes.json(),
          faqsRes.json(),
          testimonialsRes.json(),
          blogRes.json(),
          settingsRes.json(),
          slidersRes.json(),
          heroRes.json(),
          tabsRes.json()
        ])

        if (servicesData.length) setServices(servicesData)
        if (locationsData.length) setLocations(locationsData)
        if (faqsData.length) setFaqs(faqsData)
        if (testimonialsData.length) setTestimonials(testimonialsData)
        if (blogData.length) setBlogPosts(blogData)
        if (settingsData) setSettings(settingsData)
        if (slidersData.length) setSliders(slidersData)
        if (heroData) setHeroContent(heroData)
        if (tabsData.length) setTabs(tabsData)
      } catch (error) {
        console.error('Data fetch error:', error)
      }
    }
    fetchData()
  }, [])

  const phone = settings?.phone || '0 (536) 740 92 06'
  const phoneRaw = settings?.phone_raw || '05367409206'

  return (
    <SiteLayout>
      {/* Hero/Slider Section */}
      {sliders.length > 0 ? (
        <section className="relative">
          <div className="relative h-[500px] md:h-[600px]">
            {sliders.filter(s => s.is_active).map((slider, index) => (
              <div key={slider.id} className={`absolute inset-0 ${index === 0 ? 'block' : 'hidden'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 z-10" />
                <img src={slider.image} alt={slider.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 z-20 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl text-white">
                      <h1 className="text-4xl md:text-6xl font-bold mb-4">{slider.title}</h1>
                      {slider.subtitle && <h2 className="text-xl md:text-2xl mb-4">{slider.subtitle}</h2>}
                      {slider.description && <p className="text-lg mb-6 opacity-90">{slider.description}</p>}
                      {slider.button_text && slider.button_link && (
                        <Link href={slider.button_link}>
                          <Button size="lg" className="bg-secondary hover:bg-secondary/90">{slider.button_text}</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="relative min-h-[600px] flex items-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1602750766769-8db8d49cc369?w=1920&q=80"
              alt="Baraj Nakliyat - Adana Evden Eve Nakliyat"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 hero-gradient"></div>
          </div>
          
          <div className="container relative z-10 py-20">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Adana Evden Eve Nakliyat
              </h1>
              <p className="text-xl md:text-2xl mb-4 text-white/90">
                Sarıçam ve Çukurova'da Profesyonel Taşımacılık
              </p>
              <p className="text-lg mb-8 text-white/80">
                10+ yıllık tecrübemizle sigortalı, güvenli ve ekonomik evden eve nakliyat hizmeti sunuyoruz.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a href={`tel:${phoneRaw}`}>
                  <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8">
                    <Phone className="mr-2 h-5 w-5" />
                    Hemen Ara: {phone}
                  </Button>
                </a>
                <a href={`https://wa.me/90${phoneRaw}`} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary text-lg px-8">
                    <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Contact Strip */}
      <section className="bg-secondary py-4">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-secondary-foreground">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              <span className="font-semibold text-lg">{phone}</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-secondary-foreground/30"></div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">7/24 Hizmet</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-secondary-foreground/30"></div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">Sigortalı Taşımacılık</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Content - Slider Altı Makale */}
      {heroContent && heroContent.is_active && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">{heroContent.title}</h1>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: heroContent.content }} />
          </div>
        </section>
      )}

      {/* Featured Services - Öne Çıkan 3 Hizmet */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Öne Çıkan Hizmetlerimiz</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              En çok tercih edilen hizmetlerimiz
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.slice(0, 3).map((service) => {
              const IconComponent = iconMap[service.icon] || Truck
              return (
                <Card key={service.id} className="group hover:shadow-xl transition-all">
                  {service.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                      <IconComponent className="h-7 w-7 text-primary group-hover:text-white" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription>{service.short_description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/hizmetler/${service.slug}`}>
                      <Button className="w-full">
                        Detaylı Bilgi <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/hizmetler">
              <Button variant="outline" size="lg">
                Tüm Hizmetleri Gör <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tabs Section - 3 Tab + Makaleler */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Nakliyat Hakkında</h2>
            <p className="text-lg text-muted-foreground">Bilmeniz gereken her şey</p>
          </div>
          
          <Tabs defaultValue={tabs[0]?.tab_id || "tab1"} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto mb-8 h-auto" style={{gridTemplateColumns: `repeat(${tabs.length || 3}, minmax(0, 1fr))`}}>
              {tabs.map(tab => (
                <TabsTrigger key={tab.id} value={tab.tab_id} className="py-3">{tab.title}</TabsTrigger>
              ))}
            </TabsList>
            
            {tabs.map(tab => (
              <TabsContent key={tab.id} value={tab.tab_id}>
                <Card className="max-w-4xl mx-auto">
                  <CardHeader>
                    <CardTitle className="text-2xl">{tab.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="prose max-w-none" dangerouslySetInnerHTML={{ __html: tab.content }} />
                </Card>
              </TabsContent>
            ))}

            {tabs.length === 0 && (
              <>
                <TabsContent value="tab1">
                  <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                      <CardTitle className="text-2xl">Adana Nakliyat Hizmetleri</CardTitle>
                    </CardHeader>
                    <CardContent className="prose max-w-none">
                      <p className="text-lg mb-4">
                        Adana'da evden eve nakliyat hizmeti arıyorsanız, doğru yerdesiniz. Baraj Nakliyat olarak 10 yılı aşkın tecrübemizle 
                        Adana'nın tüm ilçelerinde profesyonel taşımacılık hizmeti sunuyoruz.
                      </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Adana'da Hizmet Verdiğimiz Bölgeler</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Sarıçam:</strong> Sarıçam ilçesinde yerel bilgimiz ve tecrübemizle hızlı hizmet</li>
                    <li><strong>Çukurova:</strong> Çukurova'nın her noktasına profesyonel taşımacılık</li>
                    <li><strong>Seyhan:</strong> Seyhan merkez ve tüm mahallelerinde güvenli nakliyat</li>
                    <li><strong>Yüreğir:</strong> Yüreğir bölgesinde ekonomik ve kaliteli hizmet</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Neden Baraj Nakliyat?</h3>
                  <p>
                    Adana'da evden eve nakliyat sektöründe uzun yıllardır hizmet veren firmamız, müşteri memnuniyetini 
                    ön planda tutar. Sigortalı taşımacılık, profesyonel ekip ve uygun fiyat politikamızla tercih edilen 
                    nakliyat firmasıyız.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tab2">
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl">Adana Ev Taşıma Hizmeti</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p className="text-lg mb-4">
                    Ev taşıma işlemi stresli bir süreç olabilir. Ancak Baraj Nakliyat ile Adana'da ev taşımak artık çok kolay! 
                    Deneyimli ekibimiz ve modern araç filomu ile eşyalarınızı güvenle yeni adresinize taşıyoruz.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Ev Taşıma Sürecimiz</h3>
                  <ol className="list-decimal pl-6 space-y-3">
                    <li><strong>Ücretsiz Keşif:</strong> Uzman ekibimiz evinize gelir, eşyalarınızı inceler ve size ücretsiz fiyat teklifi sunar</li>
                    <li><strong>Paketleme:</strong> Profesyonel paketleme malzemeleri ile tüm eşyalarınızı özenle paketleriz</li>
                    <li><strong>Taşıma:</strong> Eğitimli personelimiz ve modern araçlarımızla güvenli taşıma gerçekleştiririz</li>
                    <li><strong>Yerleştirme:</strong> Yeni evinizde eşyalarınızı istediğiniz yerlere yerleştiririz</li>
                  </ol>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Özel Hizmetlerimiz</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Asansörlü taşımacılık (8 kata kadar)</li>
                    <li>Eşya demontaj ve montaj hizmeti</li>
                    <li>Özel paketleme (cam eşya, antika, elektronik)</li>
                    <li>Sigortalı taşımacılık garantisi</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tab3">
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl">Evden Eve Nakliyat Süresi</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p className="text-lg mb-4">
                    Evden eve nakliyat ne kadar sürer? Bu, en çok merak edilen sorulardan biridir. Taşınma süresi birçok faktöre 
                    bağlı olarak değişkenlik gösterir. İşte detaylı bilgiler:
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Süreyi Etkileyen Faktörler</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Ev Büyüklüğü:</strong> 1+1 daire: 2-4 saat, 2+1 daire: 4-6 saat, 3+1 veya daha büyük: 6-8 saat</li>
                    <li><strong>Eşya Miktarı:</strong> Eşya miktarı arttıkça taşıma süresi de doğal olarak uzar</li>
                    <li><strong>Kat Sayısı:</strong> Asansörlü binalarda daha hızlı, asansörsüz binalarda süre uzar</li>
                    <li><strong>Mesafe:</strong> Şehir içi kısa mesafelerde 4-6 saat, uzak mesafelerde 8-10 saat sürebilir</li>
                    <li><strong>Özel Eşyalar:</strong> Piyano, antika gibi özel eşyalar ekstra zaman gerektirir</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Ortalama Süre Tablosu</h3>
                  <div className="bg-muted p-4 rounded-lg mt-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Ev Tipi</th>
                          <th className="text-left py-2">Ortalama Süre</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b"><td className="py-2">1+1 Daire</td><td className="py-2">3-4 saat</td></tr>
                        <tr className="border-b"><td className="py-2">2+1 Daire</td><td className="py-2">5-6 saat</td></tr>
                        <tr className="border-b"><td className="py-2">3+1 Daire</td><td className="py-2">7-8 saat</td></tr>
                        <tr><td className="py-2">Villa/Müstakil</td><td className="py-2">1-2 gün</td></tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <p className="mt-6">
                    <strong>Not:</strong> Bu süreler ortalama değerlerdir. Kesin süre için ücretsiz keşif hizmetimizden 
                    faydalanabilirsiniz. Ekibimiz size detaylı bilgi verecektir.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Featured Blog Posts - Öne Çıkan 3 Blog */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Blog Yazılarımız</h2>
            <p className="text-lg text-muted-foreground">Taşınma ile ilgili ipuçları ve bilgiler</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post) => (
              <Card key={post.id} className="group hover:shadow-xl transition-all overflow-hidden">
                {post.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded">{post.category}</span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="outline" className="w-full">
                      Devamını Oku <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/blog">
              <Button variant="outline" size="lg">
                Tüm Yazıları Gör <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Neden Baraj Nakliyat?</h2>
            <p className="text-lg text-muted-foreground">Yılların tecrübesi ve binlerce mutlu müşteri</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 border-t-4 border-t-primary">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Sigortalı Taşıma</h3>
              <p className="text-muted-foreground">Tüm eşyalarınız sigorta güvencesi altında</p>
            </Card>
            
            <Card className="text-center p-6 border-t-4 border-t-secondary">
              <Clock className="h-12 w-12 mx-auto mb-4 text-secondary" />
              <h3 className="text-xl font-semibold mb-2">Zamanında Teslim</h3>
              <p className="text-muted-foreground">Söz verdiğimiz saatte, eksiksiz teslim</p>
            </Card>
            
            <Card className="text-center p-6 border-t-4 border-t-primary">
              <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Deneyimli Ekip</h3>
              <p className="text-muted-foreground">10+ yıl tecrübeli profesyonel kadro</p>
            </Card>
            
            <Card className="text-center p-6 border-t-4 border-t-secondary">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-secondary" />
              <h3 className="text-xl font-semibold mb-2">Uygun Fiyat</h3>
              <p className="text-muted-foreground">Kaliteli hizmet, makul fiyat politikası</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nasıl Çalışırız?</h2>
            <p className="text-lg text-primary-foreground/80">5 kolay adımda taşınma süreci</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: 1, title: 'Ücretsiz Ekspertiz', desc: 'Sizi arayın, ücretsiz kesin fiyat teklifi alın' },
              { step: 2, title: 'Planlama', desc: 'Taşınma tarihini ve detayları planlayoruz' },
              { step: 3, title: 'Paketleme', desc: 'Eşyalarınızı özenle paketliyoruz' },
              { step: 4, title: 'Taşıma', desc: 'Güvenli bir şekilde yeni adresinize taşıyoruz' },
              { step: 5, title: 'Kurulum', desc: 'Eşyalarınızı yerine yerleştiriyoruz' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary text-secondary-foreground font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-primary-foreground/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Müşteri Yorumları</h2>
            <p className="text-lg text-muted-foreground">Mutlu müşterilerimizin görüşleri</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial) => (
              <Card key={testimonial.id} className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.comment}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.district}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Blog & Makaleler</h2>
            <p className="text-lg text-muted-foreground">Taşınma ipuçları ve rehberler</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={post.image || 'https://images.unsplash.com/photo-1602750766769-8db8d49cc369?w=400'}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">{post.category}</span>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-primary font-medium hover:underline">
                    Devamını Oku <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/blog">
              <Button variant="outline" size="lg">
                Tüm Yazılar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section - SSS */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Sık Sorulan Sorular</h2>
            <p className="text-lg text-muted-foreground">Merak ettikleriniz hakkında her şey</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.id} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            <div className="text-center mt-8">
              <Link href="/sss">
                <Button variant="outline" size="lg">
                  Tüm Soruları Gör <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-primary">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Adana'da Güvenilir Evden Eve Nakliyat
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Hemen arayın, ücretsiz ekspertiz ve fiyat teklifi alın!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${phoneRaw}`}>
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8">
                <Phone className="mr-2 h-5 w-5" />
                {phone}
              </Button>
            </a>
            <Link href="/teklif-al">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary text-lg px-8">
                Ücretsiz Teklif Al
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
