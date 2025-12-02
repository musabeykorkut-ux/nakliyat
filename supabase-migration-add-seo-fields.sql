-- =============================================
-- BARAJ NAKLİYAT - SEO ALANLARI EKLEMESİ
-- =============================================
-- Bu script'i Supabase SQL Editor'de çalıştırın
-- https://xwlpldcywqcubxedeeed.supabase.co

-- Services tablosuna og_image ve canonical_url alanlarını ekle
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS og_image TEXT,
ADD COLUMN IF NOT EXISTS canonical_url TEXT;

-- Blog posts tablosuna og_image ve canonical_url alanlarını ekle
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS og_image TEXT,
ADD COLUMN IF NOT EXISTS canonical_url TEXT;

-- Başarılı mesajı
SELECT 'SEO alanları başarıyla eklendi!' as message;
