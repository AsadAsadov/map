# Map Leads Desktop

Windows üçün OpenStreetMap əsaslı biznes əlaqə məlumatı çıxarma proqramı.

## Nə edir?

- Şəhər, rayon, qəsəbə və ya küçə adı ilə ərazi tapır.
- Restoran, otel, aptek, klinika, market, salon, bank, tikinti şirkəti, əmlak agentliyi və digər kateqoriyaları axtarır.
- Müəssisə adı, kateqoriya, telefon, e-poçt, sayt, ünvan, koordinat və OpenStreetMap linkini çıxarır.
- Xəritədə e-poçt yoxdursa, müəssisənin ictimai saytındakı əlaqə səhifələrini məhdud şəkildə yoxlayır.
- Nəticələri CSV, Excel (`.xlsx`) və JSON formatında ixrac edir.
- Son axtarışların xülasəsini kompüterdə lokal saxlayır.
- Axtarışı dayandırmağa imkan verir.

## Quraşdırma

Node.js 20 və ya daha yeni versiya tövsiyə olunur.

```bash
npm install
npm start
```

## Windows `.exe` yaratmaq

```bash
npm install
npm run dist
```

Hazır installer `dist/Map-Leads-Setup-1.0.0.exe` yolunda yaranacaq.

## Məlumat mənbələri

- OpenStreetMap / Overpass API
- Nominatim geokodlaşdırma
- Müəssisələrin ictimai rəsmi saytları

Proqram CAPTCHA keçmir, giriş tələb edən səhifələri açmır, gizli və şəxsi məlumat toplamır. Açıq serverlərdən sui-istifadə etməmək üçün sorğular məhdudlaşdırılır və sayt yoxlaması paralel olaraq maksimum üç axınla aparılır.

## Vacib qeyd

OpenStreetMap-də hər obyekt üçün telefon və ya e-poçt doldurulmayıb. Buna görə nəticələrin bir hissəsində yalnız ad, kateqoriya və ünvan ola bilər. Böyük həcmli kommersiya istifadəsi üçün ictimai Overpass/Nominatim serverləri əvəzinə ayrıca servis və ya rəsmi kommersiya API-si istifadə edilməlidir.
