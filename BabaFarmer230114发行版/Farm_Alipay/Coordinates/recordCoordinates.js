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
sleep(500);

//读取配置文件
let txt = files.read(projectPath + "/Farm_Alipay/config.json");
let config = JSON.parse(txt);
log(config);
let config_coordinates = config.coordinates;

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
    log(imageName + "查找的结果：" + point);
    return point;
}

function findAndRecord(imageName, attribute) { //找图，将图片的坐标写入myConfig
    let point = findPosition(imageName);
    let configObject = config_coordinates; //注意config_coordinates
    if (!configObject[attribute]) {
        log(attribute + " 的属性为空! 属性将被创建");
    }
    configObject[attribute] = point;
    return point.x;
}
findAndRecord("applyFertilizer.png", "applyFertilizer");
findAndRecord("taskList.png", "taskList");
findAndRecord("signIn.png", "signIn");

if (!findAndRecord("vegetable_unripe.png", "vegetable")) {
    log("未找到未熟蔬菜，再找成熟蔬菜");
    if (!findAndRecord("vegetable_ripe.png", "vegetable")) {
        log("也未找到，再找收割蔬菜");
        findAndRecord("vegetable_reaped.png", "vegetable");
    }
}



p_homepage.recycle();

//保存更新
config.coordinates = config_coordinates;
let configText = JSON.stringify(config, null, "\t");
files.write(projectPath + "/Farm_Alipay/config.json", configText);
toastLog("坐标配置已更新");




exit();


//    */