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
  
    function openApp(deepLink, fallback) {
      let startTime = Date.now();
      let timeout = 1000;
  
      window.location.href = deepLink;
      setTimeout(function() {
        if (Date.now() - startTime < timeout + 100) {
          if (currentIndex < apps.length - 1) {
            currentIndex++;
            tryNextApp();
          }
        }
      }, timeout);
    }
  
    function tryNextApp() {
      const app = apps[currentIndex];
      if (isIOS) {
        openApp(app.iosDeepLink, app.iosFallback);
      } else if (isAndroid) {
        openApp(app.androidDeepLink, app.androidFallback);
      }
    }
  
    tryNextApp();
  });
  