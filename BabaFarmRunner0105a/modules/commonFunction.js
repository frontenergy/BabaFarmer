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














module.exports = commonFunction;