'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SiteLayout from '@/components/site/SiteLayout'
import Breadcrumb from '@/components/site/Breadcrumb'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, Clock, Award, Users, Truck, CheckCircle, Phone, Target, Eye } from 'lucide-react'

export default function AboutPage() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(console.error)
  }, [])

  const phone = settings?.phone || '0 (536) 740 92 06'
  const phoneRaw = settings?.phone_raw || '05367409206'

  return (
    <SiteLayout>
      <Breadcrumb items={[{ label: 'Hakkımızda' }]} />

      {/* Hero */}
      <section className="relative py-20 bg-primary">
        <div className="container">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Baraj Nakliyat Hakkında</h1>
            <p className="text-xl text-white/80">
              10 yılı aşkın tecrübemizle Adana ve çevresinde güvenilir evden eve nakliyat hizmeti sunuyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Hikayemiz</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Baraj Nakliyat, 2014 yılında Adana'da kurulmuş bir aile şirketidir. 
                  Kuruluşumuzdan bu yana müşteri memnuniyetini ön planda tutarak, 
                  binlerce aileye güvenli taşımacılık hizmeti sunduk.
                </p>
                <p>
                  Sarıçam, Çukurova, Seyhan ve Yüreğir başta olmak üzere Adana'nın 
                  tüm ilçelerinde ve Türkiye genelinde hizmet veriyoruz.
                </p>
                <p>
                  Modern araç filomuz, deneyimli ekibimiz ve sigortalı taşımacılık anlayışımızla 
                  sektörün öncü firmalarından biri haline geldik.
                </p>
              </div>
            </div>
            <div className="relative h-80 lg:h-full min-h-[300px] rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1602750766769-8db8d49cc369?w=800"
                alt="Baraj Nakliyat Ekibi"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10+', label: 'Yıl Tecrübe' },
              { value: '5000+', label: 'Mutlu Müşteri' },
              { value: '15+', label: 'Araç Filosu' },
              { value: '24/7', label: 'Hizmet' },
            ].map((stat, i) => (
              <Card key={i} className="text-center">
                <CardContent className="p-6">
                  <p className="text-4xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-t-4 border-t-primary">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Misyonumuz</h3>
                </div>
                <p className="text-muted-foreground">
                  Müşterilerimizin eşyalarını en güvenli, hızlı ve ekonomik şekilde taşımak. 
                  Her taşınmayı bir başarı hikâyesine dönüştürmek.
                </p>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-secondary">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <Eye className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold">Vizyonumuz</h3>
                </div>
                <p className="text-muted-foreground">
                  Adana'nın ve bölgenin en güvenilir nakliyat firması olmak. 
                  Teknoloji ve inovasyonla sektöre öncülük etmek.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Değerlerimiz</h2>
            <p className="text-muted-foreground">Bizi farklı kılan özellikler</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Güvenilirlik', desc: 'Sigortalı taşımacılık garantisi' },
              { icon: Clock, title: 'Dakiklik', desc: 'Söz verdiğimiz saatte teslim' },
              { icon: Award, title: 'Kalite', desc: 'Profesyonel hizmet anlayışı' },
              { icon: Users, title: 'Müşteri Odaklılık', desc: 'Memnuniyetiniz önceliğimiz' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <Card key={i}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Hizmetlerimiz</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              'Asansörlü Taşımacılık',
              'Şehir İçi Nakliyat',
              'Şehirler Arası Nakliyat',
              'Profesyonel Paketleme',
              'Eşya Depolama',
              'Ofis Taşımacılığı'
            ].map((service, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">{service}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/hizmetler">
              <Button size="lg">Tüm Hizmetlerimizi Görün</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Hemen İletişime Geçin</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Ücretsiz ekspertiz ve fiyat teklifi için bizi arayın
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${phoneRaw}`}>
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Phone className="mr-2 h-5 w-5" /> {phone}
              </Button>
            </a>
            <Link href="/teklif-al">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Ücretsiz Teklif Al
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
