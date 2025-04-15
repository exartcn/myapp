const fs = require('fs');
const PORT = process.env.PORT || 3000;
const express = require('express');
const path = require('path');

const app = express();

// 读取 SSL 证书和私钥
const options = {
    key: fs.readFileSync(path.join(__dirname, 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
};

app.use('/.well-known', express.static(path.join(__dirname, 'public'),{
  setHeaders: function (res, path) {
    res.set('Content-Type', 'application/json');
  }
}));
//json作成

const combinedConfig = {
  ios: {
    "applinks": {
      "apps": [],
      "details": [
        {
          "appID": "7Y9M87SSC3.com.tis.test76",
          "paths": ["/cmm-bff/common/auth/deeplink/*"]
        }
      ]
    }
  },
  android: [
    {
      "relation": ["delegate_permission/common.handle_all_urls"],
      "target": {
        "namespace": "android_app",
        "package_name": "com.JHFAuthenticator",
        "sha256_cert_fingerprints": [
          "FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C"
        ]
      }
    }
  ],
  windows:[
    {
      "packageFamilyName": "51b9d83b-b970-4f68-8dba-1647c3741a3b_n36ep7xv46m82",
      "paths": [ "*" ],
      "excludePaths" : [ "/news/*", "/blog/*" ]
    }
  ]
};

// iOS
// app.get('/.well-known/apple-app-site-association', (req, res) => {
//   res.set('Content-Type', 'application/json');
//   res.json(combinedConfig.ios);
// });

// // Android
// app.get('/.well-known/assetlinks.json', (req, res) => {
//   res.set('Content-Type', 'application/json');
//   res.json(combinedConfig.android);
// });

// // windows
// app.get('/.well-known/windows-app-web-link', (req, res) => {
//   res.set('Content-Type', 'application/json');
//   res.json(combinedConfig.windows);
// });

// app.get('/windows-app-web-link', (req, res) => {
//   res.set('Content-Type', 'application/json');
//   res.json(combinedConfig.windows);
// });





app.get('/deeplink/:id', (req, res) => {
    const userAgent = req.headers['user-agent'].toLowerCase();
    console.log(userAgent);
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
      // iOS デバイス - App Store へリダイレクト
      res.redirect('itms-apps://apps.apple.com/app/id1235601864');
    } else if (/android/.test(userAgent)) {
      // Android デバイス - Google Play へリダイレクト
      res.redirect('market://details?id=com.zhiliaoapp.musically');
    } else if (/windows/.test(userAgent)) {
      res.redirect('ms-windows-store://pdp/?ProductId=9NH2GPH4JZS4');
    } else if (/mac/.test(userAgent)) {
      res.redirect('macappstore://itunes.apple.com/app/id1235601864');
    } else {
      // その他のデバイス - デフォルトページを表示
      res.send('iOS または Android デバイスでアクセスしてください。');
    }
});

app.get('/cmm-bff/common/auth/deeplink/:id?', (req, res) => {
  const userAgent = req.headers['user-agent'].toLowerCase();
  console.log(userAgent);
  
  if (/iphone|ipad|ipod/.test(userAgent)) {
    // iOS デバイス - App Store へリダイレクト
    res.redirect('https://apps.apple.com/jp/app/tiktok-%E3%83%86%E3%82%A3%E3%83%83%E3%82%AF%E3%83%88%E3%83%83%E3%82%AF/id1235601864');
  } else if (/android/.test(userAgent)) {
    // Android デバイス - Google Play へリダイレクト
    res.redirect('https://play.google.com/store/apps/details?id=com.ss.android.ugc.trill');
  } else if (/windows/.test(userAgent)) {
    res.redirect('https://apps.microsoft.com/detail/9NH2GPH4JZS4?hl=neutral&gl=JP&ocid=pdpshare');
  } else if (/mac/.test(userAgent)) {
    res.redirect('https://apps.apple.com/jp/app/tiktok-%E3%83%86%E3%82%A3%E3%83%83%E3%82%AF%E3%83%88%E3%83%83%E3%82%AF/id1235601864');
  } else {
    // その他のデバイス - デフォルトページを表示
    res.send('iOS または Android デバイスでアクセスしてください。');
  }
});


app.get('/webpage', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="zh">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Webpage</title>
    </head>
    <body>
        <h1>ようこそ</h1>
        <p><a href="https://apps.apple.com/jp/app/google-authenticator/id388497605" target="_blank">こちらをクリック</a></p>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });