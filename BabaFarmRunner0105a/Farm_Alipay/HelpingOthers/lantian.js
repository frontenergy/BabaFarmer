//助力 蓝天 的芭农

app.startActivity({
    action: 'VIEW',
    data: "https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D68687599%26nbversion%3D0.1.2101201150.51%26nbupdate%3Dsynctry%26startMultApp%3DYES%26appClearTop%3DNO%26source%3Dshare%26shareId%3DMjA4ODkwMjI2NjkzNjY1NDBzbmRkdUFOVEZBUk1fT1JDSEFSRF9TSEFSRV9QMlA%3D%26userId%3D2088902266936654%26chInfo%3Dch_share__chsub_CopyLink%26fxzjshareChinfo%3Dch_share__chsub_CopyLink%26apshareid%3D64c4eba4-f6d8-452d-8486-c8b13fd01b00%26shareBizType%3DBABAFarm",  //      
    packageName: "com.eg.android.AlipayGphone"
});

var zhuli = className("android.widget.Button").text("为Ta助力");
zhuli.waitFor();
zhuli.findOne().click();
toastLog("已为他助力");
text("去种果树").findOne(2000).click();


//