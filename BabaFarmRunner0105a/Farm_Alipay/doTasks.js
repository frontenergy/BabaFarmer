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
    click(myConfig[pointInConfig].x, myConfig[pointInConfig].y);
}


////看广告
let FertilizerTaskList = className("android.view.View").scrollable(true);

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
    let kj_kggwz = className("android.view.View").textContains(renwubiaoti).findOne(4000);
    let ggcswz="";
    if (kj_kggwz) {
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

duocikgg("逛一逛领1500肥料");
duocikgg("逛精选好物得1500肥料");


nfl_gb();
toastLog("看广告完成");










//   */