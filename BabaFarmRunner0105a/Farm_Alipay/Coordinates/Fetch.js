//

//导入坐标文件
if (files.exists("./coordinates.txt")) {
    toastLog("找到坐标记录文件")
} else {
    toastLog("坐标记录不存在");
    exit();
}
file_zb = open("./coordinates.txt", "r");
var zuobiao = file_zb.readlines();
var zuobiaozu = new Array(zuobiao.length);
for (let i1 = 0; i1 < zuobiao.length; i1++) {
    zuobiaozu[i1] = zuobiao[i1].split(",");
    for (let i2 = 1; i2 < 3; i2++) {
        zuobiaozu[i1][i2] = Number(zuobiaozu[i1][i2]);
    }
}
log("读取到的坐标是");
log(zuobiaozu);
file_zb.close();

function dianji(i1) {
    click(zuobiaozu[i1][1] + 100, zuobiaozu[i1][2] + 100);
}


//