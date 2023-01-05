var projectPath = function() {
    let testPath = files.cwd();
    let pathArray = testPath.split('/');
    for (let i = pathArray.length - 1; i--;) {
        testPath = pathArray.join("/");
        if (!files.exists(testPath + "/project.json")) pathArray.pop();
        else return testPath;
    }
}

engines.execScriptFile(projectPath() + "/Farm_Alipay/main_Alipay.js");



//