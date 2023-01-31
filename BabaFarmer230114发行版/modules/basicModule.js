var basicModule = new Object;

basicModule.waitingForAutoService = function () {
    //程序开始运行之前判断无障碍服务并等待开启
    var WaitingTime = 20;
    if (auto.service == null) {
        toastLog("请开启或重启无障碍服务\n若" + WaitingTime + "秒内开启则自动开始运行");
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
    };
    while (auto.service == null && WaitingTime > 0) {
        sleep(500);
        WaitingTime = WaitingTime - 0.5;
    }
    if (auto.service == null) {
        toastLog("权限仍未开启，结束运行");
        exit();
    }
};

basicModule.getScreenCapture = function () {
    let Thread = threads.start(function () {
        if (auto.service != null) { //如果已经获得无障碍权限
            //由于系统间同意授权的文本不同，采用正则表达式
            let Allow = textMatches(/(允许|立即开始|同意)/).findOne(10 * 1000);
            if (Allow) {
                Allow.click();
            }
        }
    });
    if (!requestScreenCapture()) {
        log("请求截图权限失败");
        return false;
    } else {
        Thread.interrupt();
        log("已获得截图权限");
        return true;
    }
};

basicModule.exitWhenVolumeDown = function () {
    //该功能会先检查运行环境中是否存在变量 thread_exitWhenVolumeDown，如果存在就不重复开启新线程  
    if (typeof (thread_exitWhenVolumeDown) == "undefined") {
        toastLog("开启了：按音量下键可终止脚本");
        let Thread = threads.start(function () {
            events.observeKey();
            events.on("key_down", function (keyCode, events) {
                if (keyCode == keys.volume_down) { //音量下键关闭脚本
                    toastLog("脚本被强制关闭！");
                    exit();
                }
            });
        });
        return Thread;
    } else {
        log("音量下键终止脚本功能已在开启状态，不重复开启");
        return "already";
    }
};

//找到脚本项目的绝对路径 
basicModule.getProjectPath = function () {
    let testPath = files.cwd();
    let pathArray = testPath.split('/');
    for (let i = pathArray.length - 1; i--;) {
        testPath = pathArray.join("/");
        if (!files.exists(testPath + "/project.json")) pathArray.pop();
        else return testPath;
    }
    log("至" + testPath + "也未找到路径");
};














module.exports = basicModule;


//