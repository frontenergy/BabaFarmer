//跳转至芭农
app.startActivity({
    action: "VIEW",
    data: "alipays://platformapi/startapp?appId=68687599"
});
className("android.widget.Button").text("我的收获").waitFor();
sleep(2000);
toastLog("已进入芭芭农场页面");


//导入坐标文件
if (files.exists("../支付宝芭农/坐标读写/坐标.txt")) {
    toastLog("找到坐标记录文件")
} else {
    toastLog("坐标记录不存在");
    exit();
}
file_zb = open("../支付宝芭农/坐标读写/坐标.txt", "r");
var zuobiao = file_zb.readlines();
var zuobiaozu = new Array(zuobiao.length);
for (let i1 = 0; i1 < zuobiao.length; i1++) {
    zuobiaozu[i1] = zuobiao[i1].split(",");
    for (let i2 = 0; i2 < 3; i2++) {
        zuobiaozu[i1][i2] = Number(zuobiaozu[i1][i2]);
    }
}
log("读取到的坐标是");
log(zuobiaozu);
file_zb.close();

function dianji(i1) {
    click(zuobiaozu[i1][1] + 100, zuobiaozu[i1][2] + 100);
}


//施肥
function sf() {
    dianji(2); //click(560, 1860); //施肥
    sleep(1000);
}

function nq() { //领取
    var kj_djnq = text("点击领取");
    var kj_ljnq = text("立即领取");
    sleep(2000);
    kj_djnq.findOne().click();
    sleep(600);
    kj_ljnq.findOne().click();
    sleep(2000);
    if (kj_ljnq.exists()) {
        kj_ljnq.findOne().click();
        sleep(2000);
    }
}

threads.start(function() { //关闭升级弹窗
    while (true) {
        className("android.view.View").text("好的").waitFor();
        className("android.view.View").text("好的").click();
    }
});

function shifei() {
    for (var sfcs = 1; sfcs < 10; sfcs++) { //判断每次领取周期中的施肥次数 
        if (text("施肥" + sfcs + "次可领").exists()) {
            for (let i = 1; i <= sfcs; i++) {
                sf();
            }
            nq();
        } else if (sfcs > 5) {
            break;
        }
    }
}

sleep(2000);
shifei();
shifei();

toastLog("施肥结束，芭芭农场自动签到程序关闭。");





//