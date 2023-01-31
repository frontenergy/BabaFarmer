var commonFunction = {};

let basicModule=require(projectPath+"/modules/basicModule.js");
commonFunction.waitingForAutoService=basicModule.waitingForAutoService;
commonFunction.getScreenCapture=basicModule.getScreenCapture;
commonFunction.exitWhenVolumeDown=basicModule.exitWhenVolumeDown;


//跳转至芭农
commonFunction.skipToFarm_Alipay = function(whetherReenter) { //是否重新进入农场,刷新页面  true false 
    let aViewInPage = className("android.widget.Button").text("我的收获"); //判断标准  
    if ((!whetherReenter) && aViewInPage.exists()) {
        return 0;
    }
    app.startActivity({
        action: "VIEW",
        data: "alipays://platformapi/startapp?appId=68687599"
    });
    aViewInPage.waitFor();
    sleep(2000);
    toastLog("检测到已进入芭芭农场页面");
}


commonFunction.scrollAds = function() { //看广告
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

commonFunction.thread_closeAd=function(){
    let boundsArea = [device.width / 3, device.height / 2, device.width * 2 / 3, device.height - 200];  //左，上，右，下 
    let mark_ad_1 = text("关闭").boundsInside(boundsArea[0], boundsArea[1], boundsArea[2], boundsArea[3]);
    let mark_ad_2 = desc("关闭").boundsInside(boundsArea[0], boundsArea[1], boundsArea[2], boundsArea[3]);
    let mark_ad_3 = idContains("close").boundsInside(boundsArea[0], boundsArea[1], boundsArea[2], boundsArea[3]); 
    function waitAndCloseAd(mark_ad) {
        if (mark_ad.exists()) {
            mark_ad.findOne(1000).click();
            adInterrupt++;
            log("关闭弹窗一次，冷却1s");
            sleep(1000);
        }
    }
    let Thread = threads.start(function () { //关闭广告弹窗
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
return Thread;
}












module.exports = commonFunction;