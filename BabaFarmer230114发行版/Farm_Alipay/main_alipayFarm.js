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

commonFunction.waitingForAutoService();
let thread_exitWhenVolumeDown = commonFunction.exitWhenVolumeDown();
commonFunction.skipToFarm_Alipay(true);

log("*****启动全付宝芭芭农场全过程*******\n");
require(projectPath+"/Farm_Alipay/basicReceiveFertilizer.js");
sleep(2000);
require(projectPath+"/Farm_Alipay/doTasks.js");
sleep(2000);
require(projectPath+"/Farm_Alipay/applyFertilizer.js")











toastLog("*****支付宝芭农场全过程 执行完成！*****\n");
exit();