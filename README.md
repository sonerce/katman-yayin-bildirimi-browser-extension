# Katman Browser Notification Extension

Chrome tarayıcı eklentisi olarak geliştirilen bu proje, Kick.com üzerinden yayın yapan Katman'ın yayın durumunu kontrol eder ve bildirimlerle kullanıcıyı haberdar eder.

## Özellikler

- 🎯 Her 30 saniyede bir yayın durumu kontrolü
- 🔔 Yayın başladığında sesli bildirim
- 📢 Toplam 2 bildirim (başlangıç ve 50 saniye sonra)
- 💫 Yanıp sönen "LIVE" göstergesi
- 🎨 Mor-sarı gradient tasarım
- 🔊 Özel bildirim sesi

## Geliştiriciler

- Eurores (instagram.com/soycel)
- KRMNGraphic (instagram.com/krmngraphic)

## Kurulum

1. Chrome tarayıcınızda `chrome://extensions/` adresine gidin
2. Sağ üst köşeden "Geliştirici modu"nu aktif edin
3. "Paketlenmemiş öğe yükle" butonuna tıklayın
4. İndirdiğiniz klasörü seçin

## Kullanım

Eklenti yüklendikten sonra otomatik olarak çalışmaya başlar. Yayın başladığında:

1. İlk bildirim ve ses uyarısı gelir
2. 50 saniye sonra ikinci bildirim gelir
3. Eklenti ikonu üzerinde yanıp sönen "LIVE" yazısı belirir

## Teknik Detaylar

- Chrome Extension Manifest V3
- Yayın kontrolü: 30 saniye
- Bildirim aralığı: 50 saniye
- Maksimum bildirim sayısı: 2
- Hedef kanal: kick.com/hype

## İzinler

- notifications: Bildirimler için
- alarms: Periyodik kontroller için
- storage: Durum saklamak için
- tabs: Ses çalma için
- host permissions: kick.com erişimi için

## Lisans

MIT License

## Sürüm Geçmişi

### v1.0
- İlk sürüm
- Temel bildirim sistemi
- Özel ses desteği
- Yanıp sönen badge özelliği
