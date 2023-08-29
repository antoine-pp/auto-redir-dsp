// https://antoine-pp.github.io/auto-redir-dsp/

// Add this function to set a cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Add this function to get a cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function logDebug(message, cookieAction = false, cookieContent = null) {
    const debugLog = document.getElementById('debugLog');
    const timestamp = new Date().toLocaleTimeString();
    
    if (cookieAction) {
      debugLog.innerHTML += `<h2>${cookieAction}</h2>`;
      debugLog.innerHTML += `<p>Time: ${timestamp}</p>`;
      debugLog.innerHTML += `<p>Cookie Content: ${cookieContent}</p>`;
    } else {
      debugLog.innerHTML += `<p>${timestamp} - ${message}</p>`;
    }
  }

document.addEventListener('DOMContentLoaded', function() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
  
    const apps = [
      {
        iosDeepLink: 'spotify://track/id',
        iosFallback: 'https://open.spotify.com/track/id',
        androidDeepLink: 'intent://track/id/#Intent;package=spotify.android.app;scheme=spotify;end',
        androidFallback: 'https://open.spotify.com/track/id'
      },
      {
        iosDeepLink: 'deezer://en/track/id',
        iosFallback: 'https://www.deezer.com/en/track/id',
        androidDeepLink: 'intent://www.deezer.com/en/track/id/#Intent;package=deezer.android.app;scheme=deezer;end',
        androidFallback: 'https://www.deezer.com/en/track/id'
      },
      {
        iosDeepLink: 'music://music.apple.com/us/album/id',
        iosFallback: 'https://music.apple.com/us/album/id',
        androidDeepLink: 'intent://music.apple.com/us/album/id/#Intent;package=com.apple.android.music;scheme=https;end',
        androidFallback: 'https://music.apple.com/us/album/id'
      }
    ];
  
    let currentIndex = 0;
  
    function openOrTryNextApp() {
        let startTime = Date.now();
        let timeout = 1000;
        const app = apps[currentIndex];
        const deepLink = isIOS ? app.iosDeepLink : isAndroid ? app.androidDeepLink : null;
    
        if (deepLink) {
          logDebug(`Trying to open: ${deepLink}`);
          window.location = deepLink;
    
          setTimeout(function() {
            if (Date.now() - startTime < 100 + timeout) {
              if (currentIndex < apps.length - 1) {
                currentIndex++;
                logDebug(`Could not open: ${deepLink}`);
                openOrTryNextApp();
              }
            } else {
              setCookie('lastWorkingDeepLink', deepLink, 30); // Save the deep link in a cookie for 30 days
              logDebug(null, "Cookie has been created", deepLink);
            }
          }, timeout);
        } else {
          logDebug('Device not supported.');
        }
    }
    
    const lastWorkingDeepLink = getCookie('lastWorkingDeepLink');
    if (lastWorkingDeepLink) {
        window.location = lastWorkingDeepLink; // Open the last working deep link if available
        logDebug(null, "Cookie has been read", lastWorkingDeepLink);
    } else {
        openOrTryNextApp();
    }
});
  