function WaitingForAutoService() {
    //程序开始运行之前判断无障碍服务并等待开启
    var WaitingTime = 20;
    if (auto.service == null) {
        toastLog("请开启或重启无障碍服务\n若" + WaitingTime + "秒内开启则自动开始运行");
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
    };
    while (auto.service == null && WaitingTime > 0) {
        sleep(500);
        WaitingTime = WaitingTime - 0.5;
    }
    if (auto.service == null) {
        toastLog("权限仍未开启，结束运行");
        exit();
    }
}
WaitingForAutoService();

threads.start(function() {
    events.observeKey();
    events.on("key_down", function(keyCode, events) {
        //音量下键关闭脚本
        if (keyCode == keys.volume_down) {
            toastLog("脚本被强制关闭！");
            exit();
        }
    });
});
toastLog("已开始运行，按音量下键可终止脚本。");


//跳转至芭农
app.startActivity({
    action: "VIEW",
    data: "alipays://platformapi/startapp?appId=68687599"
});
className("android.widget.Button").text("我的收获").waitFor();
sleep(2000);
toastLog("已进入芭芭农场页面");


//导入坐标文件
if (files.exists("./Farm_Alipay/Coordinates/coordinates.txt")) {
    toastLog("找到坐标记录文件")
} else {
    toastLog("坐标记录不存在");
    exit();
}
file_zb = open("./Farm_Alipay/Coordinates/coordinates.txt", "r");
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


//签到
dianji(0); //click(880, 1480); //点击肥料袋的图标
sleep(3000);
if (textContains("7:00可领").exists()) {
    className("android.widget.Button").text("关闭").findOne().click();
    //className(android.widget.Button).textContains("去开启" || "去领更多肥料").findOne().click();
    log("关闭明天再来弹窗");
} //关闭明天再来弹窗


//看广告
function nfl() { //打开领肥料面板
    if (!className("android.view.View").scrollable(true).exists()) {
        dianji(1); //click(950, 1880);
        sleep(1000);
    }
}

function nfl_gb() { //关闭领肥料
    if (className("android.view.View").scrollable(true).exists()) {
        click(540, 300); //点击浮窗上方空白区，关闭浮窗进入施肥页面
        sleep(1000);
    }
}

function dianji_renwu(kj) { //点击任务后的控件  需先保证控件存在且唯一  
    let kj_midH = kj.bounds().centerY();
    log("寻找范围" + 0 + "," + (kj_midH - 100) + "," + device.width + "," + (kj_midH + 150));
    let kj_qwc = clickable(true).boundsInside(0.5 * device.width, kj_midH - 100, device.width, kj_midH + 150).findOne();
    kj_qwc.click();
    log("已点");
}

function kgg_huadong() {
    //click("去完成", [0]); //看广告
    textContains("下单").waitFor();
    sleep(1000);
    gesture(4000, [500, 1800], [500, 500]);
    if (textContains("下单").exists()) {
        gesture(4000, [500, 1800], [500, 500]);
    }
    sleep(7000);
    gesture(2000, [500, 500], [500, 1800]);
    sleep(7000);
    back();
    sleep(1000);
}

function duocikgg(renwubiaoti) { //多次看广告 任务标题
    log("正在寻找：" + renwubiaoti);
    nfl();
    var ggcswz = className("android.view.View").textContains(renwubiaoti).findOne(4000);
    if (ggcswz) {
        ggcswz = " " + ggcswz.getText(); //获取广告次数文字 
        log("已获取控件文本：" + ggcswz);
    } else {
        log("获取控件文本失败：" + ggcswz);
        nfl_gb();
        return 0;
    }
    var kggcs = ggcswz.substr(-2, 1) - ggcswz.substr(-4, 1); //获取控件文本倒数第四个字符
    toastLog("还要看" + kggcs + "次广告");
    for (let i = 0; i < kggcs; i++) {
        nfl();
        let kj_kggwz = textContains(renwubiaoti).findOne();
        dianji_renwu(kj_kggwz);
        kgg_huadong();
        log("广告滑动已进行一次");
    }
    nfl_gb();
    log("已完成：" + renwubiaoti);
}

sleep(1000);
nfl();
sleep(2000);
click("领取");
sleep(1000);
toastLog("签到完成，开始看广告。");


duocikgg("逛一逛领1500肥料");
duocikgg("送！500肥料");
duocikgg("精选好物");


toastLog("看广告完成，开始施肥。");


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

engines.execScriptFile("./Farm_Alipay/HelpingOthers/lantian.js");

log("1");



exit();








//