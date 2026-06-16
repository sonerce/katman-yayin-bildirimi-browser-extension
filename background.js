/**
 * @author Eurores (instagram.com/soycel) - KRMNGraphic (instagram.com/krmngraphic)
 */

const CHANNEL_NAME = 'hype';
const CHECK_INTERVAL = 0.167; // Her 10 saniyede bir kontrol et (0.167 dakika)
const NOTIFICATION_INTERVAL = 50000; // Her 50 saniyede bir bildirim göster (milisaniye)
const MAX_NOTIFICATIONS = 2; // Maksimum bildirim sayısı

let notificationInterval = null;
let lastNotificationTime = 0;
let notificationCount = 0;
let badgeInterval = null;
let badgeState = false;

// Uzantı kurulduğunda başlat
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('checkStream', {
    periodInMinutes: CHECK_INTERVAL
  });
  // Bildirim sayacını sıfırla
  chrome.storage.local.set({ notificationCount: 0 });
});

// Offscreen document oluşturma ve ses çalma
async function playNotificationSound() {
  const offscreenUrl = chrome.runtime.getURL('offscreen.html');
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [offscreenUrl]
  });

  if (existingContexts.length > 0) {
    chrome.runtime.sendMessage({ action: 'playNotificationSound' });
    return;
  }

  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['AUDIO_PLAYBACK'],
    justification: 'Playing a notification sound when the streamer goes live.',
  });
  // Gecikme, offscreen dokümanının yüklenmesini beklemek için
  setTimeout(() => {
    chrome.runtime.sendMessage({ action: 'playNotificationSound' });
  }, 500);
}

// Yayın durumunu kontrol et
async function checkStream() {
  try {
    const response = await fetch(`https://kick.com/api/v2/channels/${CHANNEL_NAME}`);
    const data = await response.json();
    
    // Önceki canlı durumu ve bildirim sayısını al
    chrome.storage.local.get(['wasLive', 'notificationCount'], (result) => {
      const wasLive = result.wasLive || false;
      const isLive = data.livestream !== null;
      notificationCount = result.notificationCount || 0;

      // Yayın yeni başladıysa
      if (isLive && !wasLive) {
        // Bildirim sayacını sıfırla
        notificationCount = 0;
        chrome.storage.local.set({ notificationCount: 0 });
        
        // Bildirim sesi çal
        playNotificationSound();
        
        // İlk bildirimi göster
        showNotification(true);
        notificationCount++;
        chrome.storage.local.set({ notificationCount: notificationCount });

        // Periyodik bildirim başlat
        startPeriodicNotification();
        
        // Badge animasyonunu başlat
        startBadgeAnimation();
      }

      // Yayın bittiyse
      if (!isLive && wasLive) {
        stopPeriodicNotification();
        stopBadgeAnimation();
        // Bildirim sayacını sıfırla
        chrome.storage.local.set({ notificationCount: 0 });
      }

      // Mevcut durumu kaydet
      chrome.storage.local.set({ wasLive: isLive });
    });
  } catch (error) {
    console.error('Yayın durumu kontrol edilirken hata oluştu:', error);
  }
}

// Bildirim göster
function showNotification(isFirstNotification = false) {
  const options = {
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: isFirstNotification ? 'Yayın Başladı!' : 'Yayın Devam Ediyor!',
    message: `${CHANNEL_NAME} şu anda Kick.com'da yayinda!`,
    priority: 2,
    requireInteraction: false,
    silent: true // Chrome'un kendi bildirim sesini kapatıyoruz
  };

  chrome.notifications.create(options);
}

// Periyodik bildirim başlat
function startPeriodicNotification() {
  if (!notificationInterval) {
    notificationInterval = setInterval(() => {
      const now = Date.now();
      // Son bildirimden en az NOTIFICATION_INTERVAL kadar zaman geçtiyse 
      // ve maksimum bildirim sayısına ulaşılmadıysa yeni bildirim göster
      if (now - lastNotificationTime >= NOTIFICATION_INTERVAL && notificationCount < MAX_NOTIFICATIONS) {
        showNotification(false);
        lastNotificationTime = now;
        notificationCount++;
        chrome.storage.local.set({ notificationCount: notificationCount });
        
        // Maksimum bildirim sayısına ulaşıldıysa interval'i durdur
        if (notificationCount >= MAX_NOTIFICATIONS) {
          stopPeriodicNotification();
        }
      }
    }, NOTIFICATION_INTERVAL);
  }
}

// Periyodik bildirimi durdur
function stopPeriodicNotification() {
  if (notificationInterval) {
    clearInterval(notificationInterval);
    notificationInterval = null;
  }
}

// Badge'i yanıp söndür
function toggleBadge() {
  badgeState = !badgeState;
  chrome.action.setBadgeText({ text: badgeState ? 'Canlı' : '' });
  chrome.action.setBadgeBackgroundColor({ color: badgeState ? '#ff0000' : '#800080' });
}

// Yanıp sönme efektini başlat
function startBadgeAnimation() {
  if (!badgeInterval) {
    badgeInterval = setInterval(toggleBadge, 1000); // Her saniye değiş
  }
}

// Yanıp sönme efektini durdur
function stopBadgeAnimation() {
  if (badgeInterval) {
    clearInterval(badgeInterval);
    badgeInterval = null;
    chrome.action.setBadgeText({ text: '' });
  }
}

// Alarm dinle
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkStream') {
    checkStream();
  }
});
