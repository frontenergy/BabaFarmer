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


//签到
myClick("signIn"); //click(880, 1480); //点击肥料袋的图标
sleep(4000);
if (textMatches(/.*明日.*可领.*|.*7点.* |.*今日.*可领.*/).exists()) {
    log("发现明天再来弹窗");
    className("android.widget.Button").text("关闭").findOne().click();
    log("关闭明天再来弹窗");
} else {
    log("未发现明天再来弹窗");
};


//任务栏签到
let mark_TaskList = className("android.view.View").scrollable(true);

function nfl() { //打开领肥料面板
    if (!mark_TaskList.exists()) {
        myClick("taskList"); //click(950, 1880);
        sleep(1000);
    }
}

function nfl_gb() { //关闭领肥料
    if (mark_TaskList.exists()) {
        click(device.width / 2, device.height / 5); //点击浮窗上方空白区，关闭浮窗进入施肥页面
        sleep(1000);
    }
}

sleep(1000);
nfl();
sleep(2000);
click("领取");
sleep(1000);
toastLog("已领取每日基础肥料");
nfl_gb();


if (thread_exitWhenVolumeDown != "already")
thread_exitWhenVolumeDown.interrupt();
toastLog("基础签到完成");

//  */