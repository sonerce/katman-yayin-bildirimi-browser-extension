/**
 * @author Eurores (instagram.com/soycel) - KRMNGraphic (instagram.com/krmngraphic)
 */

const CHANNEL_NAME = 'hype';

async function checkAndUpdateStatus() {
  const statusDiv = document.getElementById('status');
  
  try {
    const response = await fetch(`https://kick.com/api/v2/channels/${CHANNEL_NAME}`);
    const data = await response.json();
    
    const isLive = data.livestream !== null;
    
    statusDiv.className = `status ${isLive ? 'online' : 'offline'}`;
    statusDiv.textContent = isLive 
      ? `Hype şu anda YAYINDA!` 
      : `Hype şu anda çevrimdışı`;
      
  } catch (error) {
    statusDiv.textContent = 'Durum kontrol edilirken hata oluştu';
  }
}

document.addEventListener('DOMContentLoaded', checkAndUpdateStatus);
