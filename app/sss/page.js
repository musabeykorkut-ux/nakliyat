'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SiteLayout from '@/components/site/SiteLayout'
import Breadcrumb from '@/components/site/Breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Phone, HelpCircle } from 'lucide-react'

const defaultFaqs = [
  { id: '1', question: 'Evden eve nakliyat fiyatları nasıl belirlenir?', answer: 'Fiyatlarımız eşya miktarı, mesafe, kat sayısı ve ek hizmetlere göre belirlenir. Ücretsiz ekspertiz ile kesin fiyat alabilirsiniz.', category: 'Genel' },
  { id: '2', question: 'Asansörlü taşımacılık hangi durumlarda gereklidir?', answer: 'Yüksek katlar, dar merdiven boşlukları ve büyük eşyalar için asansörlü taşımacılık ideal bir çözümdür. Asansörümüz 8. kata kadar ulaşabilmektedir.', category: 'Asansörlü Taşımacılık' },
  { id: '3', question: 'Eşyalarım sigortalı mı?', answer: 'Evet, tüm taşımacılık hizmetlerimiz sigorta kapsamındadır. Olası hasarlarda tam güvence sağlıyoruz.', category: 'Genel' },
  { id: '4', question: 'Şehirler arası taşımacılık yapıyor musunuz?', answer: 'Evet, Türkiye genelinde şehirler arası evden eve nakliyat hizmeti sunuyoruz.', category: 'Şehirlerarası' },
  { id: '5', question: 'Paketleme hizmeti var mı?', answer: 'Evet, profesyonel paketleme ekibimiz eşyalarınızı özenle paketler. Koliler, streetch film, köpük ve koruma malzemeleri kullanıyoruz.', category: 'Paketleme' },
  { id: '6', question: 'Taşınma ne kadar sürer?', answer: 'Taşınma süresi eşya miktarına ve mesafeye göre değişir. Ortalama bir ev taşıması 1 gün içinde tamamlanır.', category: 'Genel' },
]

export default function FaqPage() {
  const [faqs, setFaqs] = useState(defaultFaqs)
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [faqsRes, settingsRes] = await Promise.all([
          fetch('/api/faq'),
          fetch('/api/settings')
        ])
        const [faqsData, settingsData] = await Promise.all([
          faqsRes.json(),
          settingsRes.json()
        ])
        if (faqsData.length) setFaqs(faqsData)
        if (settingsData) setSettings(settingsData)
      } catch (error) {
        console.error('Data fetch error:', error)
      }
    }
    fetchData()
  }, [])

  const phone = settings?.phone || '0 (536) 740 92 06'
  const phoneRaw = settings?.phone_raw || '05367409206'

  // Group FAQs by category
  const categories = [...new Set(faqs.map(f => f.category).filter(Boolean))]
  const groupedFaqs = categories.length > 0
    ? categories.reduce((acc, cat) => {
        acc[cat] = faqs.filter(f => f.category === cat)
        return acc
      }, {})
    : { 'Genel': faqs }

  return (
    <SiteLayout>
      <Breadcrumb items={[{ label: 'Sık Sorulan Sorular' }]} />

      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-primary mb-4">Sık Sorulan Sorular</h1>
            <p className="text-lg text-muted-foreground">
              Nakliyat hizmetlerimiz hakkında merak ettikleriniz
            </p>
          </div>

          <div className="space-y-8">
            {Object.entries(groupedFaqs).map(([category, items]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-xl">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {items.map((faq, index) => (
                      <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <Card className="mt-12 bg-primary text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Sorunuzun Cevabını Bulamadınız mı?</h2>
              <p className="text-white/80 mb-6">Bizi arayın, tüm sorularınızı yanıtlayalım</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={`tel:${phoneRaw}`}>
                  <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    <Phone className="mr-2 h-5 w-5" /> {phone}
                  </Button>
                </a>
                <Link href="/iletisim">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                    Mesaj Gönder
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </SiteLayout>
  )
}
