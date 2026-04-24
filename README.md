# Burak Kaya Kişisel Web Sitesi

Saf HTML, CSS ve JavaScript ile hazırlanmış statik kişisel web sitesi projesidir. Proje herhangi bir framework veya build aracı gerektirmez.

## Dosya Yapısı

```text
.
├── index.html
├── hakkinda.html
├── hobiler.html
├── iletisim.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/
    ├── icons/
    └── images/
        └── originals/
```

## Kullanım

Dosyaları doğrudan tarayıcıda açabilirsiniz. Yerel sunucu ile çalıştırmak için:

```bash
python -m http.server 8000
```

Ardından `http://localhost:8000` adresini açın.

## Özellikler

- Responsive portfolyo düzeni
- Açık/koyu tema desteği ve `localStorage` ile kalıcılık
- Mobil navigasyon menüsü
- Hash destekli accordion yapısı
- Demo amaçlı iletişim formu doğrulaması
- Optimize edilmiş görsel/favikon dosya yapısı
