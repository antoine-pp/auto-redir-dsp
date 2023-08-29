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


function showFallbackButtons() {
    const fallbackButtons = document.getElementById('fallbackButtons');
    fallbackButtons.style.display = 'block';

    document.getElementById('spotifyButton').addEventListener('click', function() {
        window.location = apps[0].iosFallback;
    });

    document.getElementById('deezerButton').addEventListener('click', function() {
        window.location = apps[1].iosFallback;
    });

    document.getElementById('appleButton').addEventListener('click', function() {
        window.location = apps[2].iosFallback;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
  
    const apps = [
      {
        iosDeepLink: 'spotify://track/3XVBdLihbNbxUwZosxcGuJ?si=475f0ccda60448c2&si=475f0ccda60448c2',
        iosFallback: 'https://open.spotify.com/track/3XVBdLihbNbxUwZosxcGuJ?si=475f0ccda60448c2',
        androidDeepLink: 'spotify://track/3XVBdLihbNbxUwZosxcGuJ?si=3b9cc7d835e74279&si=3b9cc7d835e74279',
        androidFallback: 'https://open.spotify.com/track/3XVBdLihbNbxUwZosxcGuJ?si=3b9cc7d835e74279'
      },
      {
        iosDeepLink: 'deezer://en/track/629466',
        iosFallback: 'https://www.deezer.com/en/track/629466',
        androidDeepLink: 'intent://www.deezer.com/en/track/629466/#Intent;package=deezer.android.app;scheme=deezer;end',
        androidFallback: 'https://www.deezer.com/en/track/629466'
      },
      {
        iosDeepLink: 'music://music.apple.com/us/album/if-i-aint-got-you/255342344?i=255343130&i=255343130',
        iosFallback: 'https://music.apple.com/us/album/if-i-aint-got-you/255342344?i=255343130',
        androidDeepLink: 'intent://music.apple.com/us/album/if-i-aint-got-you/255342344?i=255343130/#Intent;package=com.apple.android.music;scheme=https;end&i=255343130',
        androidFallback: 'https://music.apple.com/us/album/if-i-aint-got-you/255342344?i=255343130'
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
                    } else {
                        showFallbackButtons(); // Show buttons when all deep links have been tried and failed
                    }
                } else {
                    setCookie('lastWorkingDeepLink', deepLink, 30);
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

    if (!isIOS && !isAndroid) {
        logDebug('Device not supported.');
        showFallbackButtons();
    }
});
  