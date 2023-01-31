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
let commonFunction = require(projectPath + "/modules/commonFunction.js");
let thread_exitWhenVolumeDown = commonFunction.exitWhenVolumeDown();
commonFunction.skipToFarm_Alipay();

//导入坐标配置
let txt = files.read(projectPath + "/Farm_Alipay/config.json");
let myConfig = JSON.parse(txt);

function myClick(pointInConfig) {
    click(myConfig.coordinates[pointInConfig].x, myConfig.coordinates[pointInConfig].y);
}


//施肥
function sf() {
    myClick("applyFertilizer");
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
    return "success"
}

let adInterrupt = 0;
/*
let thread_closeUpgrade = threads.start(function () { //关闭升级弹窗
    while (true) {
        className("android.view.View").text("好的").findOne().click();
        adInterrupt++;
    }
});
*/
function waitAndCloseAd(mark_ad) {
    if (mark_ad.exists()) {
        mark_ad.findOne(1000).click();
        adInterrupt++;
        log("关闭弹窗一次，冷却1s");
        sleep(1000);
    }
}
let boundsArea = [device.width / 3, device.height / 2, device.width * 2 / 3, device.height - 200];  //左，上，右，下
let mark_ad_1 = text("关闭").boundsInside(boundsArea[0], boundsArea[1], boundsArea[2], boundsArea[3]);
let mark_ad_2 = desc("关闭").boundsInside(boundsArea[0], boundsArea[1], boundsArea[2], boundsArea[3]);
let mark_ad_3 = idContains("close").boundsInside(boundsArea[0], boundsArea[1], boundsArea[2], boundsArea[3]);

function closeAd_required() {
    waitAndCloseAd(mark_ad_1);
    waitAndCloseAd(mark_ad_2);
    waitAndCloseAd(mark_ad_3);
    log("主动请求关广告一次");
}

let thread_closeAd = threads.start(function () { //关闭广告弹窗
    while (true) {
        if (textMatches(/点击领取|立即领奖|立即领取/).exists()) {  //避免误关
            sleep(1000);
            continue;
        }
        waitAndCloseAd(mark_ad_1);
        waitAndCloseAd(mark_ad_2);
        waitAndCloseAd(mark_ad_3);
    }
});

function getApplyNum() {
    let str = textMatches(/还差.*次可领/).findOne(3000);
    if (str) {
        str = Number(str.text().replace(/[^\d]/g, ""))
        return str;
    }
    return 0;
}

function applyFertilizer_1cercle() {

    let faultTimes = 0;
    for (let expectNum = getApplyNum(); expectNum > 0 && faultTimes < 2;) {
        sf();
        gesture(1000, [500, 500], [500, 1800]);
        expectNum--;
        if (expectNum != getApplyNum()) {
            log("异常\n expectNum：" + (expectNum) + "\n getApplyNum：" + getApplyNum());
            sleep(4000);
            faultTimes++;
            expectNum = getApplyNum();
            if (expectNum == 0 || expectNum == null) {
                log("弹窗关闭失败");
                closeAd_required();
                break;
            }
        }
    }
    sleep(1000);
    //nq();
    log("完成了一个周期，faultimes=" + faultTimes);
    if (faultTimes == 2 || !nq())
        return "异常结束";  //或者是施肥完成了
}

function checkallFinished() {
    if ((!nq()) && getApplyNum == null)
        return true;
}


let faultCycleTime = 0;
for (let i = 10; i-- && faultCycleTime <= 1;) {
    let aCycleResult = applyFertilizer_1cercle();
    if (aCycleResult == "异常结束") {
        faultCycleTime++;
    }
}







//thread_closeUpgrade.interrupt();
thread_closeAd.interrupt();

if (thread_exitWhenVolumeDown != "already")
    thread_exitWhenVolumeDown.interrupt();

toastLog("施肥结束，芭芭农场自动签到程序关闭。");


//   */