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

var basicModule = require(projectPath + "/modules/basicModule.js");
var skipToFarm = require(projectPath + "/modules/skipToFarm.js");
var commonFunction = require(projectPath + "/modules/commonFunction.js");

basicModule.waitingForAutoService();
basicModule.exitWhenVolumeDown();

skipToFarm.Alipay();

//var allMainProgress=
require(projectPath + "/Farm_Alipay/basicReceiveFertilizer.js");










exit();

//   */