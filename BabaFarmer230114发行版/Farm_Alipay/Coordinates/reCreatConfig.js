let config = {};

config.coordinates = {
    signIn: {
        x: 0,
        y: 0
    },
    taskList: {
        x: 0,
        y: 0
    },
    applyFertilizer: {
        x: 0,
        y: 0
    },
    vegetable : {
        x: 0,
        y: 0
    },
}
config.matchView ={
    
    }

config.matchText={
    taskTitle_Mark:{
        match:".*(逛|看).*\/3.*",
        desc:""
    } 
}


log(config);




var configText = JSON.stringify(config, null, "\t");
files.write("../config.json", configText);




var txt = files.read("../config.json");
var myconfig = JSON.parse(txt);




//    */