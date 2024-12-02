/**
 * @author Eurores (instagram.com/soycel) - KRMNGraphic (instagram.com/krmngraphic)
 */

// Ses nesnesini oluştur
let notificationSound = null;

// Ses mesajını dinle
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'playNotificationSound') {
    try {
      // Eğer ses nesnesi daha önce oluşturulmadıysa oluştur
      if (!notificationSound) {
        notificationSound = new Audio(chrome.runtime.getURL('notification.mp3'));
        notificationSound.volume = 1.0; // Tam ses
      }
      
      // Sesi çal
      notificationSound.currentTime = 0; // Başa sar
      notificationSound.play()
        .then(() => console.log('Bildirim sesi çalındı'))
        .catch(error => console.error('Ses çalma hatası:', error));
    } catch (error) {
      console.error('Ses nesnesi oluşturma hatası:', error);
    }
  }
});
