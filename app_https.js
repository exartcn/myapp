const fs = require("fs");
const PORT = process.env.PORT || 3000;
const express = require("express");
const path = require("path");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type, X-Msg-Update-Time");
  res.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

let uploadedJson = null;
let msgUpdateTime = "";
const DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

function formatDateTime(date) {
  const pad = (value) => String(value).padStart(2, "0");

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    " " +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds())
  );
}

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

// app.get("/deeplink/:id", (req, res) => {
//   const userAgent = req.headers["user-agent"].toLowerCase();
//   console.log(userAgent);

//   if (/iphone|ipad|ipod/.test(userAgent)) {
//     // iOS デバイス - App Store へリダイレクト
//     res.redirect("itms-apps://apps.apple.com/app/id1235601864");
//   } else if (/android/.test(userAgent)) {
//     // Android デバイス - Google Play へリダイレクト
//     res.redirect("market://details?id=com.zhiliaoapp.musically");
//   } else if (/windows/.test(userAgent)) {
//     res.redirect("ms-windows-store://pdp/?ProductId=9NH2GPH4JZS4");
//   } else if (/mac/.test(userAgent)) {
//     res.redirect("macappstore://itunes.apple.com/app/id1235601864");
//   } else {
//     // その他のデバイス - デフォルトページを表示
//     res.send("iOS または Android デバイスでアクセスしてください。");
//   }
// });

app.get("/cmm-bff/common/auth/deeplink/:id?", (req, res) => {
  const userAgent = req.headers["user-agent"].toLowerCase();
  console.log(userAgent);

  if (/iphone|ipad|ipod/.test(userAgent)) {
    // iOS デバイス - App Store へリダイレクト
    res.redirect(
      "https://apps.apple.com/jp/app/%E4%BD%8F%E5%AE%85%E9%87%91%E8%9E%8D%E6%94%AF%E6%8F%B4%E6%A9%9F%E6%A7%8B%E8%AA%8D%E8%A8%BC%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3/id6747013128"
    );
  } else if (/android/.test(userAgent)) {
    // Android デバイス - Google Play へリダイレクト
    res.redirect(
      "https://play.google.com/store/apps/details?id=jp.go.jhf.authenticator"
    );
  } else if (/windows/.test(userAgent)) {
    res.redirect("ms-windows-store://pdp/?ProductId=9NL7KQRVBZH4");
  } else if (/mac/.test(userAgent)) {
    res.redirect(
      "macappstore://apps.apple.com/jp/app/%E4%BD%8F%E5%AE%85%E9%87%91%E8%9E%8D%E6%94%AF%E6%8F%B4%E6%A9%9F%E6%A7%8B%E8%AA%8D%E8%A8%BC%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3forpc/id6749533650"
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

app.get("/json-upload", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>JSON Upload</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 24px;
          color: #222;
          background: #f6f8fa;
        }

        main {
          max-width: 960px;
          margin: 0 auto;
        }

        button {
          padding: 10px 16px;
          font-size: 16px;
          color: #fff;
          background: #0a66c2;
          border: 0;
          border-radius: 6px;
          cursor: pointer;
        }

        button:hover {
          background: #084f96;
        }

        button:disabled {
          background: #8c959f;
          cursor: not-allowed;
        }

        input[type="file"] {
          display: none;
        }

        .field {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          margin: 16px 0 8px;
        }

        label {
          font-weight: 700;
        }

        input[type="text"] {
          width: 220px;
          max-width: 100%;
          padding: 9px 10px;
          font-size: 16px;
          border: 1px solid #d0d7de;
          border-radius: 6px;
        }

        pre {
          min-height: 240px;
          padding: 16px;
          overflow: auto;
          background: #fff;
          border: 1px solid #d0d7de;
          border-radius: 6px;
          white-space: pre-wrap;
          word-break: break-word;
        }

        #status {
          margin: 12px 0;
          min-height: 20px;
        }
      </style>
    </head>
    <body>
      <main>
        <h1>JSON Upload</h1>
        <button id="uploadButton" type="button">Upload JSON</button>
        <input id="jsonFile" type="file" accept="application/json,.json">
        <div class="field">
          <label for="msgUpdateTime">msgupdatetime</label>
          <input id="msgUpdateTime" type="text" placeholder="yyyy-MM-dd HH:mm:ss">
          <button id="saveButton" type="button" disabled>Save</button>
        </div>
        <p id="status"></p>
        <pre id="jsonPreview">No JSON uploaded.</pre>
      </main>

      <script>
        const uploadButton = document.getElementById("uploadButton");
        const saveButton = document.getElementById("saveButton");
        const jsonFile = document.getElementById("jsonFile");
        const msgUpdateTime = document.getElementById("msgUpdateTime");
        const status = document.getElementById("status");
        const jsonPreview = document.getElementById("jsonPreview");
        const dateTimePattern = /^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$/;

        let currentJson = null;

        function formatDateTime(date) {
          const pad = (value) => String(value).padStart(2, "0");

          return (
            date.getFullYear() +
            "-" +
            pad(date.getMonth() + 1) +
            "-" +
            pad(date.getDate()) +
            " " +
            pad(date.getHours()) +
            ":" +
            pad(date.getMinutes()) +
            ":" +
            pad(date.getSeconds())
          );
        }

        async function saveJson() {
          if (currentJson === null) {
            status.textContent = "Upload JSON first.";
            return;
          }

          const updateTime = msgUpdateTime.value.trim();

          if (!dateTimePattern.test(updateTime)) {
            status.textContent = "msgupdatetime must be yyyy-MM-dd HH:mm:ss.";
            return;
          }

          status.textContent = "Saving to server memory...";

          const response = await fetch("/json-upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Msg-Update-Time": updateTime,
            },
            body: JSON.stringify(currentJson),
          });

          if (!response.ok) {
            throw new Error("Save failed: " + response.status);
          }

          status.textContent = "JSON and msgupdatetime saved in server memory.";
        }

        uploadButton.addEventListener("click", () => {
          jsonFile.click();
        });

        saveButton.addEventListener("click", async () => {
          try {
            await saveJson();
          } catch (error) {
            status.textContent = "Save failed.";
            jsonPreview.textContent = error.message;
          }
        });

        jsonFile.addEventListener("change", async () => {
          const file = jsonFile.files[0];

          if (!file) {
            return;
          }

          try {
            const text = await file.text();
            const json = JSON.parse(text);

            currentJson = json;
            msgUpdateTime.value = formatDateTime(new Date());
            saveButton.disabled = false;
            jsonPreview.textContent = JSON.stringify(json, null, 2);
            await saveJson();
          } catch (error) {
            status.textContent = "Invalid JSON or save failed.";
            jsonPreview.textContent = error.message;
          } finally {
            jsonFile.value = "";
          }
        });
      </script>
    </body>
    </html>
  `);
});

app.post("/json-upload", (req, res) => {
  uploadedJson = req.body;
  const requestedUpdateTime = req.get("X-Msg-Update-Time") || "";
  msgUpdateTime = DATE_TIME_PATTERN.test(requestedUpdateTime)
    ? requestedUpdateTime
    : formatDateTime(new Date());
  res.json({ saved: true, updateTime: msgUpdateTime });
});

app.get("/cmm/msg", (req, res) => {
  if (uploadedJson === null) {
    return res.status(404).json({ error: "No JSON uploaded." });
  }

  res.json(uploadedJson);
});

app.get("/cmm/msgupdatetime", (req, res) => {
  res.json({ updateTime: msgUpdateTime });
});


app.get("/deeplink/check", (req, res) => {
  res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deeplink Demo</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 10px;
    }

    h1 {
      text-align: center;
      margin-bottom: 20px;
    }

    button {
      display: block;
      width: 100%;
      padding: 15px;
      font-size: 16px;
      margin: 10px 0;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <h1>同様なドメインでディープリンクの検証</h1>

  <button onclick="window.location.href='https://deeplink.pt-common.jhf.go.jp/cmm-bff/common/auth/deeplink/B40955a715ba43E893eF4398e24fc1d6'">
    ディープリンクドメインは：https://deeplink.pt-common.jhf.go.jp
  </button>

  <button onclick="window.location.href='https://deeplink.st-common.jhf.go.jp/cmm-bff/common/auth/deeplink/B40955a715ba43E893eF4398e24fc1d6'">
    ディープリンクドメインは：https://deeplink.st-common.jhf.go.jp
  </button>

  <button onclick="window.location.href='https://deeplink-test-e53b3c0ebf7b.herokuapp.com/cmm-bff/common/auth/deeplink/B40955a715ba43E893eF4398e24fc1d6'">
    結合テストディープリンクドメインは：https://deeplink-test-e53b3c0ebf7b.herokuapp.com
  </button>

</body>
</html>


  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
