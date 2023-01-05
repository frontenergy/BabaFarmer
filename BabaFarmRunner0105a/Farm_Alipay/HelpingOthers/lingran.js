//助力 泠然善也 的芭农

app.startActivity({
    action: 'VIEW',
    data: "https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D68687599%26nbversion%3D0.1.2101201150.51%26nbupdate%3Dsynctry%26startMultApp%3DYES%26appClearTop%3DNO%26source%3Dshare%26shareId%3DMjA4ODE0MjgyNjM0Mzk1MTBpNnpqeUFOVEZBUk1fT1JDSEFSRF9TSEFSRV9QMlA%3D%26userId%3D2088142826343951%26chInfo%3Dch_share__chsub_CopyLink%26fxzjshareChinfo%3Dch_share__chsub_CopyLink%26apshareid%3D7377504a-9dc4-4cb1-ba65-d56e574d819c%26shareBizType%3DBABAFarm", //     
    packageName: "com.eg.android.AlipayGphone"
});

var zhuli = className("android.widget.Button").text("为Ta助力");
zhuli.waitFor();
zhuli.findOne().click();
toastLog("已为他助力");
text("去种果树").findOne(2000).click();


//