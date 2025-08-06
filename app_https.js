const fs = require("fs");
const PORT = process.env.PORT || 3000;
const express = require("express");
const path = require("path");

const app = express();

// 读取 SSL 证书和私钥
const options = {
  key: fs.readFileSync(path.join(__dirname, "server.key")),
  cert: fs.readFileSync(path.join(__dirname, "server.cert")),
};

app.use("/.well-known/assetlinks.json", (req, res, next) => {
  console.log(`[Deeplink] User-Agent: ${req.headers["user-agent"]}`);
  next();
});

app.use("/.well-known/apple-app-site-association", (req, res, next) => {
  console.log(`[Deeplink] User-Agent: ${req.headers["user-agent"]}`);
  next();
});

app.use(
  "/.well-known",
  express.static(path.join(__dirname, "public"), {
    setHeaders: function (res, path) {
      res.set("Content-Type", "application/json");
    },
  })
);

app.use(
  "/windows-app-web-link",
  express.static(path.join(__dirname, "public", "windows-app-web-link"), {
    setHeaders: function (res, path) {
      res.set("Content-Type", "application/json");
    },
  })
);
//json作成

const combinedConfig = {
  ios: {
    applinks: {
      apps: [],
      details: [
        {
          appID: "7Y9M87SSC3.com.tis.test76",
          paths: ["/cmm-bff/common/auth/deeplink/*"],
        },
      ],
    },
  },
  android: [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "com.JHFAuthenticator",
        sha256_cert_fingerprints: [
          "FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C",
        ],
      },
    },
  ],
  windows: [
    {
      packageFamilyName: "51b9d83b-b970-4f68-8dba-1647c3741a3b_n36ep7xv46m82",
      paths: ["*"],
      excludePaths: ["/news/*", "/blog/*"],
    },
  ],
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

app.get("/deeplink/:id", (req, res) => {
  const userAgent = req.headers["user-agent"].toLowerCase();
  console.log(userAgent);

  if (/iphone|ipad|ipod/.test(userAgent)) {
    // iOS デバイス - App Store へリダイレクト
    res.redirect("itms-apps://apps.apple.com/app/id1235601864");
  } else if (/android/.test(userAgent)) {
    // Android デバイス - Google Play へリダイレクト
    res.redirect("market://details?id=com.zhiliaoapp.musically");
  } else if (/windows/.test(userAgent)) {
    res.redirect("ms-windows-store://pdp/?ProductId=9NH2GPH4JZS4");
  } else if (/mac/.test(userAgent)) {
    res.redirect("macappstore://itunes.apple.com/app/id1235601864");
  } else {
    // その他のデバイス - デフォルトページを表示
    res.send("iOS または Android デバイスでアクセスしてください。");
  }
});

app.get("/cmm-bff/common/auth/deeplink/:id?", (req, res) => {
  const userAgent = req.headers["user-agent"].toLowerCase();
  console.log(userAgent);

  if (/iphone|ipad|ipod/.test(userAgent)) {
    // iOS デバイス - App Store へリダイレクト
    res.redirect(
      "https://apps.apple.com/jp/app/tiktok-%E3%83%86%E3%82%A3%E3%83%83%E3%82%AF%E3%83%88%E3%83%83%E3%82%AF/id1235601864"
    );
  } else if (/android/.test(userAgent)) {
    // Android デバイス - Google Play へリダイレクト
    res.redirect(
      "https://play.google.com/store/apps/details?id=com.ss.android.ugc.trill"
    );
  } else if (/windows/.test(userAgent)) {
    res.redirect("ms-windows-store://pdp/?ProductId=9nh2gph4jzs4");
  } else if (/mac/.test(userAgent)) {
    res.redirect(
      "macappstore://apps.apple.com/jp/app/tiktok-%E3%83%86%E3%82%A3%E3%83%83%E3%82%AF%E3%83%88%E3%83%83%E3%82%AF/id1235601864"
    );
  } else {
    // その他のデバイス - デフォルトページを表示
    res.send("iOS または Android デバイスでアクセスしてください。");
  }
});




// app.get('/cmm-bff/common/auth/deeplink/:id?', (req, res) => {
//   const userAgent = req.headers['user-agent'].toLowerCase();
//   console.log(userAgent);

//   let redirectUrl = '';
//   if (/iphone|ipad|ipod/.test(userAgent)) {
//     // iOS デバイス - App Store
//     redirectUrl = 'https://apps.apple.com/jp/app/tiktok-%E3%83%86%E3%82%A3%E3%83%83%E3%82%AF%E3%83%88%E3%83%83%E3%82%AF/id1235601864';
//   } else if (/android/.test(userAgent)) {
//     // Android デバイス - Google Play
//     redirectUrl = 'https://play.google.com/store/apps/details?id=com.ss.android.ugc.trill';
//   } else if (/windows/.test(userAgent)) {
//     redirectUrl = 'ms-windows-store://pdp/?ProductId=9nh2gph4jzs4';
//   } else if (/mac/.test(userAgent)) {
//     redirectUrl = 'macappstore://apps.apple.com/jp/app/tiktok-%E3%83%86%E3%82%A3%E3%83%83%E3%82%AF%E3%83%88%E3%83%83%E3%82%AF/id1235601864';
//   }

//   if (redirectUrl) {
//     res.send(`
//       <!DOCTYPE html>
//       <html lang="ja">
//       <head>
//         <meta charset="UTF-8" />
//         <title>リダイレクト中...</title>
//         <script>
//           setTimeout(() => {
//             location.href = "${redirectUrl}";
//             setTimeout(() => {
//               window.close();
//             }, 1000);
//           }, 0);
//         </script>
//       </head>
//       <body>
//         <p>アプリに移動しています...自動で移動しない場合は <a href="${redirectUrl}">こちらをクリック</a></p>
//       </body>
//       </html>
//     `);
//   } else {
//     res.send('iOS または Android デバイスでアクセスしてください。');
//   }
// });

app.get("/privacy/privacy-policy", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <title>プライバシーポリシー</title>
    </head>
    <body>
      <h1>プライバシーポリシー</h1>
      <p>当アプリは、QRコードの読み取りおよび写真撮影などの目的でカメラを使用します。</p>
      <p>カメラで取得された画像データや情報は、ユーザーの端末内でのみ使用され、サーバー等に送信されることはありません。</p>
      <p>当アプリは、個人情報を第三者に提供することはありません。</p>
      <p>今後、プライバシーポリシーに変更があった場合は、このページにてお知らせいたします。</p>
      <p>本ポリシーに関するお問い合わせは、以下のメールアドレスまでお願いいたします：</p>
      <p>contact@example.com</p>
    </body>
    </html>
  `);
});


app.get("/deeplink/check", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="zh">
    <head>
      <meta charset="UTF-8">
      <title>Deeplink 打开测试</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: sans-serif; padding: 20px; }
        button { font-size: 18px; padding: 10px 20px; margin: 10px; }
      </style>
    </head>
    <body>
      <h2>📱 Deeplink 测试页</h2>
      <p>点击下方按钮分别测试通过不同方式打开 Deeplink URL：</p>

      <button onclick="openViaWindowOpen()">window.open() 打开</button>
      <button onclick="openViaLocationHref()">location.href 打开</button>

      <script>
        const deeplinkUrl = 'https://st-common.jhf.go.jp/cmm-bff/common/auth/deeplink/B40955a715ba43E893eF4398e24fc1d6';

        function openViaWindowOpen() {
          window.open(deeplinkUrl);
        }

        function openViaLocationHref() {
          window.location.href = deeplinkUrl;
        }
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
