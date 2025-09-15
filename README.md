# Poker Stats Site 🎲

Bu site, arkadaş grubunuzun haftalık poker oyunlarını kaydetmek ve istatistiklerini görüntülemek için tasarlanmıştır.  

Site tamamen **GitHub Pages uyumlu** ve **dinamik JSON dosyaları** üzerinden çalışır.  

---

## 🗂 Proje Yapısı

poker-stats-site/
│
├── index.html # Anasayfa (en son oyun + geçmiş oyunlar)
├── stats.html # Tüm zaman istatistikleri + grafikler
├── game.html # Oyun detayı sayfası
├── css/
│ └── style.css # Stil dosyası
├── js/
│ ├── viewer.js # Anasayfa ve geçmiş oyun listesi
│ ├── stats.js # Stats sayfası ve grafikler
│ └── game.js # Game detayı sayfası
└── data/
├── games.json # Tüm JSON oyun dosyalarının listesi
├── YYYY-MM-DD.json # Her haftanın oyun verisi (örnek)

---

## 📝 JSON Formatı

Her haftalık oyun bir JSON dosyasında saklanır. Örnek:

```json
{
  "date": "2025-09-07",
  "potSize": 50,
  "players": {
    "Alice": [23, 32, 32, 54, 65],
    "Bob": [12, 45, 30, 60, 40],
    "Charlie": [0, -10, 5, 15, 20]
  }
}
date: Oyun tarihi

potSize: Haftalık pot büyüklüğü

players: Her oyuncunun round sonuçları

Dizideki her sayı, round sonunda elde edilen miktardır

📌 Nasıl Kullanılır?

1/Yeni Oyun Eklemek

data/ klasörüne yeni JSON dosyası ekle (örn: 2025-09-21.json)

data/games.json dosyasına JSON dosya adını ekle:
[
  "2025-09-07.json",
  "2025-09-14.json",
  "2025-09-21.json"
]

2.Siteyi Yayınlamak

Tüm dosyaları GitHub reposuna pushla

GitHub Pages’i main branch veya docs/ klasöründen yayınla

3.Sayfalar

index.html: En son oyun ve geçmiş oyun listesi

stats.html: Tüm zaman istatistikleri ve grafikler

game.html: Tek bir oyunun detayları (game.html?file=YYYY-MM-DD.json)

⚡ Notlar

Oyuncu sayısı dinamik: JSON dosyalarında istediğiniz kadar oyuncu ekleyebilirsiniz

Grafikler otomatik olarak tüm JSON dosyalarına göre güncellenir

Dosya isimleri ve yollar case sensitive (büyük/küçük harf uyumu önemli)

🎨 Teşekkürler

Bu site, arkadaş grubunuzun poker oyunlarını kolayca takip edebilmesi için hazırlanmıştır.
