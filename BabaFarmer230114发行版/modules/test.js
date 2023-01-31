var b=require("./basicModule.js");
let thread_exitWhenVolumeDown=b.exitWhenVolumeDown();

b.exitWhenVolumeDown();


sleep(1000);
let a=threads.currentThread();
log(a);
log(thread_exitWhenVolumeDown);
//a.interrupt();



for(i=10;i--;){
log (i);
sleep(1000);

}
