chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'playNotificationSound') {
    const audio = document.getElementById('notification-sound');
    audio.play();
  }
});
