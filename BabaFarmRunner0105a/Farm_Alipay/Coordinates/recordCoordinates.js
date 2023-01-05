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

toastLog("开始创建坐标记录文件");
let basicModule = require(projectPath + "/modules/basicModule.js");
basicModule.waitingForAutoService();
basicModule.getScreenCapture();
basicModule.exitWhenVolumeDown();

app.startActivity({
    action: "VIEW",
    data: "alipays://platformapi/startapp?appId=68687599"
});
className("android.widget.Button").text("我的收获").waitFor();
log("已进入芭芭农场页面");
sleep(2000);

//截屏保存
captureScreen(projectPath + "/Farm_Alipay/image/homepage.jpg");
log("已保存截图");
sleep(1000);

//读取配置文件
var txt = files.read(projectPath + "/Farm_Alipay/config.json");
var myConfig = JSON.parse(txt);

//找图
let imageFilePath = projectPath + "/Farm_Alipay/image/";
var p_homepage = images.read(imageFilePath + "homepage.jpg"); //主页

function findPosition(imageName) {
    let imageAwaited = images.read(imageFilePath + imageName); //注意imageFilePath
    let point = findImage(p_homepage, imageAwaited, {
        threshold: 0.6
    }); //注意p_homepage 和 threshold:
    if (point == null) {
        point = {
            x: 0,
            y: 0
        };
        log("未找到" + imageName + "在主页的位置");
    } else {
        point.x = point.x + imageAwaited.width / 2;
        point.y = point.y + imageAwaited.height / 2;
    }
    imageAwaited.recycle(); //回收 
    log(attribute + "查找的结果：" + point);
    return point;
}

function findAndRecord(imageName, attribute) { //找图，将图片的坐标写入myConfig
    let point = findPosition(imageName);
    let configObject = myConfig; //注意myconfig
    if (!configObject[attribute])
        log(configObject[attribute] + "的属性为空，将被创建");
    configObject[attribute].x = point.x;
    configObject[attribute].y = point.y;
    return point.x;
}
findAndRecord("applyFertilizer.png", "applyFertilizer");
findAndRecord("taskList.png", "taskList");
findAndRecord("signIn.png", "signIn");

if (!findAndRecord("vegetable_unripe.png", "vegetable")) {
    log("未找到未熟蔬菜，再找成熟蔬菜");
    findAndRecord("vegetable_ripe.png", "vegetable");
}



p_homepage.recycle();

//保存更新
var configText = JSON.stringify(myConfig, null, "\t");
files.write(projectPath + "/Farm_Alipay/config.json", configText);
toastLog("坐标配置已更新");





//