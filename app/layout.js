import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  title: 'Baraj Nakliyat | Adana Evden Eve Nakliyat',
  description: 'Adana evden eve nakliyat, asansörlü taşımacılık, şehir içi ve şehirler arası nakliyat hizmetleri. Sarıçam ve Çukurova bölgelerinde güvenilir taşımacılık.',
  keywords: 'Adana evden eve nakliyat, Adana nakliyat, Adana ev taşıma, asansörlü taşımacılık, Sarıçam nakliyat, Çukurova nakliyat',
  openGraph: {
    title: 'Baraj Nakliyat | Adana Evden Eve Nakliyat',
    description: 'Adana evden eve nakliyat, asansörlü taşımacılık hizmetleri',
    type: 'website',
    locale: 'tr_TR',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
