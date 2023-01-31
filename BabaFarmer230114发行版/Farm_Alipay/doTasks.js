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

let mark_TaskList = className("android.view.View").scrollable(true);
function nfl() { //打开领肥料面板
    if (!mark_TaskList.exists()) {
        myClick("taskList"); //click(950, 1880);
        sleep(1000);
    }
}

function nfl_gb() { //关闭领肥料
    if (mark_TaskList.exists()) {
        click(device.width / 2, device.height / 5); //点击浮窗上方空白区，来关闭浮窗进入施肥页面
        sleep(1000);
    }
}


//提取任务文字
nfl();
let view_taskTitle = textMatches(/.*(逛|看).*\/3.*/).findOne();  //获取控件 “逛一逛领1500肥料 (0/3)”的信息，来定位其他任务标题  看精选商品得1500
//log(view_taskTitle);
let mark_taskTitle = className(view_taskTitle.className()).depth(view_taskTitle.depth());
//log(mark_taskTitle);
let taskTitleArr = new Array(),
    taskTitleDescArr = new Array();

let view_TaskList_children = mark_TaskList.findOne().find(mark_taskTitle);
//log(view_TaskList_children);

for (let i = 2; i + 1 <= view_TaskList_children.length; i = i + 4) {
    let taskTitle = view_TaskList_children.findOne(depth(view_taskTitle.depth()).indexInParent(i));
    let taskTitleDesc = view_TaskList_children.findOne(depth(view_taskTitle.depth()).indexInParent(i + 1));
    if (taskTitle && taskTitleDesc) {
        taskTitleArr.push(taskTitle.text().toString());  //任务标题
        taskTitleDescArr.push(taskTitleDesc.text().toString());  //任务描述
    }
}

log("taskTitleArr \n" + taskTitleArr);
log("taskTitleDescArr \n" + taskTitleDescArr);
//exit();

//测量相关坐标
if (taskTitleArr[1].search("/") == -1) {
    log("检测到的任务文字有误！\n")
}
let view_taskTitle_position1 = text(taskTitleArr[1]).findOne().bounds().top;  //获取间距
let view_taskTitle_position2 = text(taskTitleArr[2]).findOne().bounds().top;
let spaceDistance = Math.abs(view_taskTitle_position2 - view_taskTitle_position1);
log("间距是 " + spaceDistance);
let Text_right = text(taskTitleArr[1]).findOne().bounds().right;  //文字离屏幕右侧间距
if (Text_right > device.width / 5 * 4 || Text_right < device.width / 2) {
    Text_right = device.width / 2;
    log("检测到的任务文字右边距有误！" + Text_right + "\n已将其设为默认\n")
}

//筛选可完成的任务
let evaluatedTaskList = new Array;
for (let i = 0; i < taskTitleArr.length; i++) {
    let evaluationResult = { text: taskTitleArr[i], method: "未知", repeatNumber: 0, order: i };
    //提取 method
    if (taskTitleArr[i].match(/.*逛一逛领1500肥料.*|.*逛精选好物.*|看精选商品.*/)) {
        evaluationResult.method = "A";
    } else if (taskTitleDescArr[i].match(/.*(浏览|逛一逛)即可.*/)) {
        evaluationResult.method = "B";
    } else continue;
    //提取repeatNumber
    evaluationResult.repeatNumber = evaluationResult.text.substr(-2, 1) - evaluationResult.text.substr(-4, 1); //获取控件文本倒数第四个字符
    evaluatedTaskList.push(evaluationResult);
}
log("\n任务列表识别结果：")
log(evaluatedTaskList);

evaluatedTaskList = evaluatedTaskList.filter((evaluationResult) => {   //删除repeatNumber==0的元素
    if (evaluationResult.repeatNumber == 0) {
        log("去除了" + evaluationResult.text);
        return false;
    }
    return true;
});


//执行看广告任务
for (let obj of evaluatedTaskList) {
    log("\n---------开始处理 " + obj.text);
    if (obj.method == "A") {
        method_A(taskTitleArr[obj.order], taskTitleDescArr[obj.order], obj.repeatNumber);
    } else if (obj.method == "B") {
        method_B(taskTitleArr[obj.order], taskTitleDescArr[obj.order], obj.repeatNumber);
    }
    log("---------处理完成");
}





//-----------构建method_A和method_B

function click_ToFinish(taskDescTxt) { //点击文字后的控件，需先保证文字存在且唯一   使用了spaceDistance和Text_right
    let Text_midH = text(taskDescTxt).findOne().bounds().centerY();
    log("位置高度" + Text_midH);
    while (Text_midH > device.height - 2 * spaceDistance) {
        log("超出屏幕" + device.height + " - 安全距离" + 2 * spaceDistance);
        gesture(800, [500, device.height - 2 * spaceDistance], [500, device.height / 2], [600, device.height / 2]);
        sleep(300);
        Text_midH = text(taskDescTxt).findOne().bounds().centerY();
        log("位置高度" + Text_midH);
    }
    let boundsArea = [Text_right, Text_midH - spaceDistance, device.width, Text_midH + spaceDistance];  //左，上，右，下
    //log("寻找范围" + boundsArea);
    let Button_toFinish = className("android.widget.Button").clickable(true).boundsInside(boundsArea[0], boundsArea[1], boundsArea[2], boundsArea[3]).findOne(5000);
    // Button_toFinish这个控件通常depth不同，className也不同
    if (Button_toFinish) {
        //log(Button_toFinish);
        Button_toFinish.click();
        log("已点 去完成");
    } else {
        click(device.width / 6 * 5, Text_midH + 20);
        toastLog("未找到 去完成 尝试点击");
    }
}

function strollAdds() {
    if (!textContains("下单").findOne(4000)) {
        return "error";
    }
    sleep(1500);
    gesture(4000, [500, 1800], [500, 500]);
    if (!textMatches(/.*已浏览.*秒.*/).exists()) {
        gesture(4000, [500, 1800], [500, 500]);
    }
    sleep(7000);
    gesture(2000, [500, 500], [500, 1800]);
    sleep(7000);
    if (!textContains("浏览完成").exists()) { return "error"; }
    sleep(1000);
}

function checkIfUnfinishedATask(taskTitleTxt) {
    let matchTxt = ".*" + taskTitleTxt.substr(0, taskTitleTxt.length - 6) + ".*\/.*";
    matchTxt = new RegExp(matchTxt);
    let newTxt = textMatches(matchTxt).findOne(3000);
    if (!newTxt) {
        log("异常！未识别到文字" + taskTitleTxt);
        return 0;
    }
    newTxt = newTxt.text();
    let remainNum = Number(newTxt.substr(-2, 1) - newTxt.substr(-4, 1));
    if (remainNum != 0) {
        log("检测到未完全完成该广告,还剩" + remainNum + "次");
        return 1;
    }
}

//-------------

function tryDo15sTaskOnce(taskDescTxt) {
    nfl();
    click_ToFinish(taskDescTxt);
    if (strollAdds() != "error") {
        back();
        log("广告滑动已尝试进行一次");
    }
    else {
        log("异常：tryDo15sTaskOnce");
        return "error";
    }
}

function method_A(taskTitleTxt, taskDescTxt, repeatNum) {  //taskTitleTxt, taskDescTxt, repeatNum 
    let faultTimes = 0;
    for (let i = 0; i < repeatNum; i++) {
        tryDo15sTaskOnce(taskDescTxt);
    }
    sleep(2000);
    if (checkIfUnfinishedATask(taskTitleTxt) && faultTimes <= 1) {
        faultTimes++;
        tryDo15sTaskOnce(taskDescTxt);
    }
    nfl_gb();
}

function method_B(taskTitleTxt, taskDescTxt, repeatNum) {
    nfl();
    click_ToFinish(taskDescTxt);
    sleep(6000);
    back();
    sleep(500);
    mark_TaskList.waitFor();
    click("领取");
    sleep(500);
    return 0;
}











if (thread_exitWhenVolumeDown != "already")
    thread_exitWhenVolumeDown.interrupt();
toastLog("看广告完成");

//   */