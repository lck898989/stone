// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //初始化用code获取的accesstoken
        this.accessToken="";
        //初始化用code获取的openid
        this.openId="";
        this.is=false;
    },
   //点击按钮
   pressButton:function(){
    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","wxLogin","()V")
},
   //通过code获取微信accesstoken
   GetAccessToken:function(code1){
    var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx72f9006d0b1d9b7f&secret=fe9036e8fdb8bc990a318227d0e68a5e&code="+code1+"&grant_type=authorization_code";
    // var str = "shop=钻石";
    // var str="name=1&password=1";
    var  self=this;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {

        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
              var response = xhr.responseText;
             cc.find("New Label").getComponent(cc.Label).string="cccccccccccccccccccccccccc";
            cc.find("New Label").getComponent(cc.Label).string= response ;
            self.SendServer(response);
            var msg=JSON.parse(response);
            self.accessToken=msg.access_token;
            self.openId=msg.openid;
           
        
        }
    };
    cc.find("New Label").getComponent(cc.Label).string="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    //    xhr.send("name=100"+"&password=1");
    xhr.open("GET", url, true);
     xhr.send();
   },
   //将获取到的accesstoken信息发给服务器

   SendServer:function(str){
    cc.find("New Label").getComponent(cc.Label).string="eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
    var url = "http://192.168.1.55:6000/login";
    var str1="{\"tag\":\"wxLogin\",\"body\":"+str+"}";
    var xhr = new XMLHttpRequest();
    var self = this;
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
             var response = xhr.responseText;  
            var msg1=JSON.parse(response);
          
            if(msg1.result=="ok")
            {
                if(msg1.msg=="getUser")
                {
                    cc.find("New Label").getComponent(cc.Label).string=response;
                    self.GetUserMsg();

                }

            }
            else
            {

            }
            // cc.find("New Label").getComponent(cc.Label).string="bbbbbbbbbbbbbbbbbbbbb";
            // cc.find("PebmanentNode").getComponent("UserInfo").msgUser=msg.data;
            // cc.find("PebmanentNode").getComponent("UserInfo").tokenMsg=msg.token;
        }
    };
    xhr.open("POST", url);
    xhr.send(str1);
   },
   //登陆成功后访问微信获取用户信息
   GetUserMsg:function(){
    var url = "https://api.weixin.qq.com/sns/userinfo?access_token="+this.accessToken+"&openid="+this.openId;
    // var str = "shop=钻石";
    // var str="name=1&password=1";
    var  self=this;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            cc.find("New Label").getComponent(cc.Label).string="fffffffffffffffffffffffffffffffffffffffff";
              var response = xhr.responseText;
              var msg1=JSON.parse(response);
             cc.find("PebmanentNode").getComponent("UserInfo").nameUser=msg1.nickname;
             cc.find("PebmanentNode").getComponent("UserInfo").pictureUser=msg1.headimgurl;
             self.SendUserInfo(response);
             

          
            
        }
    };
    cc.find("New Label").getComponent(cc.Label).string="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    //    xhr.send("name=100"+"&password=1");
    xhr.open("GET", url, true);
     xhr.send();
   },
   //将获取到的用户信息发给服务器
   SendUserInfo:function(str){
    cc.find("New Label").getComponent(cc.Label).string="gggggggggggggggggggggggggggggggggggggggg";
    var url = "http://192.168.1.55:6000/UserMsg";
    var str1="{\"tag\":\"UserMsg\",\"body\":"+str+"}";
    var xhr = new XMLHttpRequest();
    var self = this;
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
             var response = xhr.responseText;  
            var msg1=JSON.parse(response);
            if(msg1.result=="ok")
            {
                if(msg1.msg=="userMsg")
                {
                    cc.find("New Label").getComponent(cc.Label).string=msg1.token;
                    cc.find("PebmanentNode").getComponent("UserInfo").tokenMsg=msg1.token;

                }

            }
            else
            {
            }
            // cc.find("New Label").getComponent(cc.Label).string="bbbbbbbbbbbbbbbbbbbbb";
            // cc.find("PebmanentNode").getComponent("UserInfo").msgUser=msg.data;
            // cc.find("PebmanentNode").getComponent("UserInfo").tokenMsg=msg.token;
        }
    };
    xhr.open("POST", url);
    xhr.send(str1);

   },
   
    start () {

    },

    update (dt) {
        //判断用户微信是否登录
        switch(jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","GetWeChatState","()I"))
        {
            //当未登录成功时
            case 0:
                  return;
                  break;
            case 1:
                this.GetAccessToken(jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","GetCode","()Ljava/lang/String;"));
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","Init","()V")
                break;
        }
    },
});
