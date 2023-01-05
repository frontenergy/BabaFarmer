//
auto();
toastLog("开始创建坐标记录文件");

//截屏权限
function getScreenCapture() {
    let Thread = threads.start(function() {
        if (auto.service != null) { //如果已经获得无障碍权限
            //由于系统间同意授权的文本不同，采用正则表达式
            let Allow = textMatches(/(允许|立即开始|同意)/).findOne(10 * 1000);
            if (Allow) {
                Allow.click();
            }
        }
    });
    if (!requestScreenCapture()) {
        log("请求截图权限失败");
        return false;
    } else {
        Thread.interrupt()
        log("已获得截图权限");
        return true;
    }
}
getScreenCapture();

//直达界面
app.startActivity({
    action: "VIEW",
    data: "alipays://platformapi/startapp?appId=68687599"
});
className("android.widget.Button").text("我的收获").waitFor();
log("已进入芭芭农场页面");
sleep(2000);


//截屏保存
captureScreen("../pictures/homepage.jpg");
log("已保存截图");
sleep(1000);

//记录坐标
var p_bnzy = images.read("../pictures/homepage.jpg");  //主页
var p_sf = images.read("../pictures/applyFertilizer.png");   //施肥
var p_qd = images.read("../pictures/signIn.png");  //签到
var p_nfl = images.read("../pictures/receiveFertilizer.png");  //领肥料
var p_xunzhao = [p_qd, p_nfl, p_sf];

file_xr = open("./坐标.txt", "w"); //写入
/*
for (let cixv = 0; cixv < p_xunzhao.length; cixv++) { //次序  
    let point = findImage(p_bnzy, p_xunzhao[cixv],{threshold: 0.6});
    log(point);
    file_xr.writeline(cixv + "," + point.x + "," + point.y );
    p_xunzhao[cixv].recycle();
}
*/
//file_xr.writeline(4 + "," + 80 + "," + 170);

function findPosition (readedImages){
    let point = findImage(p_bnzy, readedImages,{threshold: 0.6});
    log(point);
    if(point==null){
        return false;
    }
    return point;
}


p_bnzy.recycle();
file_xr.close();

toastLog("文件创建完成");






//