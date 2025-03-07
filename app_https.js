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

app.use('/.well-known', express.static(path.join(__dirname, 'public')));

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

app.get('/deeplinkb/:id', (req, res) => {
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