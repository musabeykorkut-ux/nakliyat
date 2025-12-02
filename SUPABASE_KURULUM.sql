-- BARAJ NAKLİYAT - SUPABASE DATABASE SCHEMA
-- Bu dosyayı Supabase SQL Editor'de çalıştırın

-- 1. SETTINGS
DROP TABLE IF EXISTS settings CASCADE;
CREATE TABLE settings (
  id TEXT PRIMARY KEY,
  phone TEXT DEFAULT '0 (536) 740 92 06',
  phone_raw TEXT DEFAULT '05367409206',
  email TEXT DEFAULT 'info@barajnakliyat.com',
  address TEXT DEFAULT 'Adana, Türkiye',
  whatsapp TEXT DEFAULT '5367409206',
  company_name TEXT DEFAULT 'Baraj Nakliyat',
  slogan TEXT DEFAULT 'Adana''da Güvenilir Evden Eve Nakliyat',
  about_short TEXT,
  facebook TEXT,
  instagram TEXT,
  twitter TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON settings FOR UPDATE USING (true);

INSERT INTO settings (id, phone, phone_raw, email, address, whatsapp, company_name, slogan)
VALUES ('default', '0 (536) 740 92 06', '05367409206', 'info@barajnakliyat.com', 'Adana, Türkiye', '5367409206', 'Baraj Nakliyat', 'Adana''da Güvenilir Evden Eve Nakliyat');

-- 2. SERVICES
DROP TABLE IF EXISTS services CASCADE;
CREATE TABLE services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  content TEXT,
  category TEXT,
  is_featured BOOLEAN DEFAULT true,
  icon TEXT DEFAULT 'Truck',
  image TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_image TEXT,
  canonical_url TEXT,
  status TEXT DEFAULT 'published',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON services FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON services FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON services FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON services FOR DELETE USING (true);

INSERT INTO services (id, title, slug, short_description, icon, is_featured, display_order, status, meta_title, content, image) VALUES
('svc-1', 'Asansörlü Taşımacılık', 'asansorlu-tasimacilik', 'Yüksek katlara güvenli ve hızlı taşımacılık', 'Building2', true, 1, 'published', 'Adana Asansörlü Taşımacılık | Baraj Nakliyat', 'Asansörlü taşımacılık hizmetimiz ile yüksek katlardaki evlerinizi güvenle taşıyoruz.', 'https://images.unsplash.com/photo-1585541571714-01aa54eaf7c2?w=800'),
('svc-2', 'Şehir İçi Nakliyat', 'sehir-ici-nakliyat', 'Adana içi hızlı ve ekonomik taşımacılık', 'Truck', true, 2, 'published', 'Adana Şehir İçi Nakliyat | Baraj Nakliyat', 'Adana merkez ve tüm ilçelerinde şehir içi evden eve nakliyat hizmeti sunuyoruz.', 'https://images.unsplash.com/photo-1602750766769-8db8d49cc369?w=800'),
('svc-3', 'Şehirler Arası Nakliyat', 'sehirler-arasi-nakliyat', 'Türkiye geneli güvenli taşımacılık', 'MapPin', true, 3, 'published', 'Şehirler Arası Nakliyat | Baraj Nakliyat', 'Türkiye''nin her yerine şehirler arası evden eve nakliyat hizmeti.', 'https://images.unsplash.com/photo-1586864387634-29caff60e48e?w=800');

-- 3. LOCATIONS
DROP TABLE IF EXISTS locations CASCADE;
CREATE TABLE locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON locations FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON locations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON locations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON locations FOR DELETE USING (true);

INSERT INTO locations (id, name, slug, short_description, display_order, is_active, meta_title) VALUES
('loc-1', 'Sarıçam', 'saricam', 'Sarıçam ilçesinde evden eve nakliyat hizmeti', 1, true, 'Sarıçam Nakliyat | Baraj Nakliyat'),
('loc-2', 'Çukurova', 'cukurova', 'Çukurova ilçesinde evden eve nakliyat hizmeti', 2, true, 'Çukurova Nakliyat | Baraj Nakliyat'),
('loc-3', 'Seyhan', 'seyhan', 'Seyhan ilçesinde evden eve nakliyat hizmeti', 3, true, 'Seyhan Nakliyat | Baraj Nakliyat');

-- 4. BLOG POSTS
DROP TABLE IF EXISTS blog_posts CASCADE;
CREATE TABLE blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  image TEXT,
  category TEXT,
  tags TEXT[],
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_image TEXT,
  canonical_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON blog_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON blog_posts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON blog_posts FOR DELETE USING (true);

INSERT INTO blog_posts (id, title, slug, excerpt, content, category, tags, image, status, published_at, meta_title) VALUES
('blog-1', 'Taşınma İpuçları: Stressiz Bir Taşınma İçin', 'tasinma-ipuclari', 'Taşınma sürecini kolaylaştıracak pratik öneriler', 'Taşınma stresli bir süreç olabilir ama doğru planlama ile bu süreci kolaylaştırabilirsiniz.', 'Taşınma İpuçları', ARRAY['taşınma', 'ipuçları'], 'https://images.unsplash.com/photo-1602750766769-8db8d49cc369?w=800', 'published', NOW(), 'Taşınma İpuçları | Baraj Nakliyat Blog'),
('blog-2', 'Asansörlü Taşımacılık Rehberi', 'asansorlu-tasimacilik-rehberi', 'Yüksek katlara taşınırken bilmeniz gerekenler', 'Asansörlü taşımacılık, özellikle yüksek katlı binalarda vazgeçilmez bir hizmettir.', 'Rehber', ARRAY['asansörlü', 'taşımacılık'], 'https://images.unsplash.com/photo-1585541571714-01aa54eaf7c2?w=800', 'published', NOW(), 'Asansörlü Taşımacılık Rehberi | Baraj Nakliyat');

-- 5. FAQS
DROP TABLE IF EXISTS faqs CASCADE;
CREATE TABLE faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'Genel',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON faqs FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON faqs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON faqs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON faqs FOR DELETE USING (true);

INSERT INTO faqs (id, question, answer, category, display_order, is_active) VALUES
('faq-1', 'Evden eve nakliyat fiyatları nasıl belirlenir?', 'Fiyatlarımız eşya miktarı, mesafe, kat sayısı ve ek hizmetlere göre belirlenir.', 'Genel', 1, true),
('faq-2', 'Asansörlü taşımacılık hangi durumlarda gereklidir?', 'Yüksek katlar, dar merdiven boşlukları ve büyük eşyalar için asansörlü taşımacılık ideal bir çözümdür.', 'Asansörlü Taşımacılık', 2, true),
('faq-3', 'Eşyalarım sigortalı mı?', 'Evet, tüm taşımacılık hizmetlerimiz sigorta kapsamındadır.', 'Genel', 3, true);

-- 6. TESTIMONIALS
DROP TABLE IF EXISTS testimonials CASCADE;
CREATE TABLE testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  district TEXT,
  rating INTEGER DEFAULT 5,
  comment TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON testimonials FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON testimonials FOR DELETE USING (true);

INSERT INTO testimonials (id, name, district, rating, comment, display_order, is_active) VALUES
('test-1', 'Ahmet Yılmaz', 'Sarıçam', 5, 'Harika bir hizmet aldık. Ekip çok özverili ve dikkatli çalıştı.', 1, true),
('test-2', 'Fatma Demir', 'Çukurova', 5, 'Zamanında geldiler ve tüm eşyalarımızı özenle taşıdılar.', 2, true),
('test-3', 'Mehmet Kaya', 'Seyhan', 5, 'Fiyat/performans çok iyi. Profesyonel ekip, kaliteli hizmet.', 3, true);

-- 7. QUOTE REQUESTS
DROP TABLE IF EXISTS quote_requests CASCADE;
CREATE TABLE quote_requests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  from_district TEXT,
  to_district TEXT,
  move_date DATE,
  has_elevator BOOLEAN DEFAULT false,
  from_floor INTEGER,
  to_floor INTEGER,
  notes TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON quote_requests FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON quote_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON quote_requests FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON quote_requests FOR DELETE USING (true);

-- 8. CONTACT MESSAGES
DROP TABLE IF EXISTS contact_messages CASCADE;
CREATE TABLE contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON contact_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON contact_messages FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON contact_messages FOR DELETE USING (true);

-- 9. GALLERY
DROP TABLE IF EXISTS gallery CASCADE;
CREATE TABLE gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  category TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON gallery FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON gallery FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON gallery FOR DELETE USING (true);

INSERT INTO gallery (id, title, image, category, display_order, is_active) VALUES
('gal-1', 'Ev Taşıma', 'https://images.unsplash.com/photo-1602750766769-8db8d49cc369?w=600', 'Nakliyat', 1, true),
('gal-2', 'Nakliye Aracı', 'https://images.unsplash.com/photo-1585541571714-01aa54eaf7c2?w=600', 'Araçlar', 2, true),
('gal-3', 'Paketleme', 'https://images.unsplash.com/photo-1577075473292-5f62dfae5522?w=600', 'Hizmetler', 3, true);

-- 10. SEO SETTINGS
DROP TABLE IF EXISTS seo_settings CASCADE;
CREATE TABLE seo_settings (
  id TEXT PRIMARY KEY,
  page_name TEXT NOT NULL UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  canonical_url TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON seo_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON seo_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON seo_settings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON seo_settings FOR DELETE USING (true);

INSERT INTO seo_settings (id, page_name, meta_title, meta_description, meta_keywords) VALUES
('seo-1', 'anasayfa', 'Baraj Nakliyat | Adana Evden Eve Nakliyat', 'Adana evden eve nakliyat, asansörlü taşımacılık hizmetleri.', 'adana nakliyat, evden eve nakliyat'),
('seo-2', 'hizmetler', 'Hizmetlerimiz | Baraj Nakliyat', 'Adana evden eve nakliyat hizmetleri.', 'nakliyat hizmetleri');

-- 11. HOMEPAGE
DROP TABLE IF EXISTS homepage CASCADE;
CREATE TABLE homepage (
  id TEXT PRIMARY KEY,
  hero_title TEXT DEFAULT 'Adana Evden Eve Nakliyat',
  hero_subtitle TEXT DEFAULT 'Sarıçam ve Çukurova''da Profesyonel Taşımacılık',
  hero_description TEXT DEFAULT '10+ yıllık tecrübemizle sigortalı, güvenli ve ekonomik evden eve nakliyat hizmeti sunuyoruz.',
  hero_image TEXT DEFAULT 'https://images.unsplash.com/photo-1602750766769-8db8d49cc369?w=1920',
  cta_title TEXT DEFAULT 'Adana''da Güvenilir Evden Eve Nakliyat',
  cta_description TEXT DEFAULT 'Hemen arayın, ücretsiz ekspertiz ve fiyat teklifi alın!',
  why_us_title TEXT DEFAULT 'Neden Baraj Nakliyat?',
  why_us_subtitle TEXT DEFAULT 'Yılların tecrübesi ve binlerce mutlu müşteri',
  process_title TEXT DEFAULT 'Nasıl Çalışırız?',
  process_subtitle TEXT DEFAULT '5 kolay adımda taşınma süreci',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE homepage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON homepage FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON homepage FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON homepage FOR UPDATE USING (true);

INSERT INTO homepage (id) VALUES ('default');
