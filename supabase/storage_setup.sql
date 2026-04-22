-- Blog kapak görselleri için public Supabase Storage bucket'ı
-- Supabase dashboard → SQL editor'de bu dosyayı çalıştırın (ya da bucket'ı UI'dan
-- manuel açın: Storage → New bucket → name=blog-images, public ✅).
--
-- Service role key ile POST /api/blog-image-upload bu bucket'a yazar.
-- Public URL'ler istemci tarafından okunabilir.

-- 1) Bucket'ı oluştur (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2) Public okuma policy'si (herkes görüntüleyebilir)
DROP POLICY IF EXISTS "Public read blog-images" ON storage.objects;
CREATE POLICY "Public read blog-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

-- 3) Service role zaten tüm işlemleri yapabilir (bypass RLS).
--    Yükleme /api/blog-image-upload üzerinden SUPABASE_SERVICE_ROLE_KEY ile yapılır,
--    bu yüzden INSERT policy'si gerekmez.
