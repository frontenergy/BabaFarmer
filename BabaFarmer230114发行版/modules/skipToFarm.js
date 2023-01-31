//

//跳转至芭农
var SkipToFarm = {};
SkipToFarm.Alipay = function(whetherReenter) { //是否重新进入农场,刷新页面  true false 
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


SkipToFarm.TaoBao = function() {
    home();
    log("z");
}

module.exports = SkipToFarm;



//