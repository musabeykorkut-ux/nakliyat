import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react'

export default function Sidebar({ services = [], faqs = [], settings = null, currentSlug = null }) {
  const phone = settings?.phone || '0 (536) 740 92 06'
  const phoneRaw = settings?.phone_raw || '05367409206'
  const email = settings?.email || 'info@barajnakliyat.com'
  const address = settings?.address || 'Adana, Türkiye'

  return (
    <div className="space-y-6">
      {/* Quick Contact Card */}
      <Card className="border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Hızlı İletişim
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <a href={`tel:${phoneRaw}`} className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors">
            <Phone className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-xs text-muted-foreground">Hemen Arayın</p>
              <p className="font-semibold text-secondary">{phone}</p>
            </div>
          </a>
          
          <a href={`mailto:${email}`} className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">E-posta</p>
              <p className="font-medium text-sm">{email}</p>
            </div>
          </a>

          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Adres</p>
              <p className="font-medium text-sm">{address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <Clock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Çalışma Saatleri</p>
              <p className="font-medium text-sm">7/24 Hizmet</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      {services && services.length > 0 && (
        <Card>
          <CardHeader className="bg-muted">
            <CardTitle className="text-lg">Hizmetlerimiz</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {services.map((service) => (
                <li key={service.id}>
                  <Link 
                    href={`/hizmetler/${service.slug}`}
                    className={`flex items-center justify-between p-4 hover:bg-muted transition-colors ${
                      currentSlug === service.slug ? 'bg-primary/5 border-l-4 border-primary' : ''
                    }`}
                  >
                    <span className={currentSlug === service.slug ? 'font-semibold text-primary' : ''}>
                      {service.title}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* FAQs */}
      {faqs && faqs.length > 0 && (
        <Card>
          <CardHeader className="bg-muted">
            <CardTitle className="text-lg">Sık Sorulan Sorular</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Accordion type="single" collapsible>
              {faqs.slice(0, 5).map((faq, index) => (
                <AccordionItem key={faq.id} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left text-sm">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
