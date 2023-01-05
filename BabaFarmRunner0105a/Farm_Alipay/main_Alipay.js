function getProjectPath() {
    let testPath = files.cwd();
    let pathArray = testPath.split('/');
    for (let i = pathArray.length - 1; i--;) {
        testPath = pathArray.join("/");
        if (!files.exists(testPath + "/project.json")) pathArray.pop();
        else return testPath;
    }
};
let projectPath = getProjectPath();

var basicModule = require(projectPath + "/modules/basicModule.js");
var skipToFarm = require(projectPath + "/modules/skipToFarm.js");


basicModule.waitingForAutoService();
basicModule.exitWhenVolumeDown();

skipToFarm.Alipay();

//导入坐标配置
let txt = files.read(projectPath + "/Farm_Alipay/config copy.json");
let myConfig = JSON.parse(txt);

function myClick(pointInConfig) {
    click(myConfig[pointInConfig].x, myConfig[pointInConfig].y);
}

//签到
myClick("signIn"); //click(880, 1480); //点击肥料袋的图标
sleep(3000);
if (textMatches(/(.*明日.*可领.*|.*7点.* |.*今日.*可领.*)/).exists()) {
    log("发现明天再来弹窗");
    className("android.widget.Button").text("关闭").findOne().click();
    log("关闭明天再来弹窗");
} else {
    log("未发现明天再来弹窗")
};


//看广告
var FertilizerTaskList = className("android.view.View").scrollable(true);

function nfl() { //打开领肥料面板
    if (!FertilizerTaskList.exists()) {
        myClick("taskList"); //click(950, 1880);
        sleep(1000);
    }
}

function nfl_gb() { //关闭领肥料
    if (FertilizerTaskList.exists()) {
        click(device.width / 2, device.height / 5); //点击浮窗上方空白区，关闭浮窗进入施肥页面
        sleep(1000);
    }
}

function dianji_renwu(kj) { //点击任务后的控件  需先保证控件存在且唯一  
    let Text_midH = kj.bounds().centerY();
    let Text_right = kj.bounds().right;
    log(Text_right);
    let Button_toFinish = clickable(true).boundsInside(Text_right, Text_midH - 100, device.width, Text_midH + 150).findOne(5000);
    //log("寻找范围"+[Text_right, Text_midH - 100, device.width, Text_midH + 150]);
    if (Button_toFinish) {
        log(Button_toFinish);
        Button_toFinish.click();
        log("已点 去完成");
    } else {
        click(device.width / 6 * 5, Text_midH - 10);
        log("未找到 去完成 尝试点击");
    }
}

function kgg_huadong() {
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
    let kj_kggwz = ggcswz;
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
        // let kj_kggwz = textContains(renwubiaoti).findOne();
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
duocikgg("逛精选好物得1500肥料");
/*
duocikgg("送！500肥料");
duocikgg("精选好物");
*/

toastLog("看广告完成，开始施肥。");


//施肥
function sf() {
    myClick("applyFertilizer"); //click(560, 1860); //施肥
    sleep(1000);
}

function nq() { //领取
    var kj_djnq = textMatches(/点击领取|立即领奖/);
    var kj_ljnq = textMatches(/立即领取/);
    sleep(2000);
    if (kj_djnq.exists()) {
        kj_djnq.findOne().click();
    } else {
        return 0;
    }
    sleep(600);
    kj_ljnq.findOne().click();
    sleep(2000);
    if (kj_ljnq.exists()) {
        kj_ljnq.findOne().click();
        sleep(2000);
    }
}

threads.start(function () { //关闭升级弹窗
    while (true) {
        //className("android.view.View").text("好的").waitFor();
        className("android.view.View").text("好的").click();
    }
});

function shifei() {
    for (var sfcs = 1; sfcs < 10; sfcs++) { //判断每次领取周期中的施肥次数 
        if (text("还差" + sfcs + "次可领").exists()) {
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
nq();
shifei();
shifei();

toastLog("施肥结束，芭芭农场自动签到程序关闭。");


//engines.execScriptFile("./Farm_Alipay/HelpingOthers/lantian.js");




exit();








 //