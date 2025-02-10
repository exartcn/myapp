//expressモジュールの読み込み
const express = require('express')
//expressのインスタンス化
const app = express();
const path = require("path")

const staticpath = path.resolve(__dirname,"C:/Users/tikk76111/svn/Vup/202409/共通/57124_cmmVup(18)/cmm-web-spa/dist/cmm-auth-app")

console.log("path = " + staticpath);

app.use('/cmm/auth',express.static(staticpath))

app.get('*',(req,res)=>{
    res.sendFile(path.resolve(staticpath,'index.html'))
})
//8080番ポートでサーバーを待ちの状態にする。
//またサーバーが起動したことがわかるようにログを出力する
app.listen(4200, () => {
  console.log("サーバー起動中");
});




