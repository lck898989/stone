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
       
        // //获取地板附体
        // getGroundParent:{
        //     default:null,
        //     type:cc.Node
        // },
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
        //初始化俄罗斯方块的形状
        this.stringBoloekShape="";
        //初始化俄罗斯方块的旋转角度
        this.nRotateAngle=0;
        //初始化旋转次数
        // this.nRotate=0;
         //初始化物体下落计时器
         this.fDownTime=0;
        //判断下落方块是否固定
        this.isStationary=false;
        //初始化物体触底，触碰方块计时器
        this.fCollisionTime=0;
        //判断物体是否和底部或 方块触碰
        this.isCollision=false;
        //判断俄罗斯方块最低点物体的下面是否有方块或者触碰底部
        this.isHasBox=false;
        //判断是否改变父体结束
        this.isChangeParent=false;
        // //判断俄罗斯方块是否有一个方块进入游戏场景
        // this.isJoin=false;
        //初始化方块下面为false的方块个数
        this.nBox=0; 
        //初始化游戏结束
        this.isGameOver=false;
        //判断在四次for循环中是否下落过一次
         this.isDown=false;
        //  cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },
    start () {
    },
    
    //计算方块下面为false的方块的个数
    AddBoxNumber:function(a,b){
        if(Global.game1Main.groundChild[a-1][b-2].getComponent("PrefabState").isBox==false)
        {
            this.nBox++;    
        }
        else
        {
            if(b==21)
            {
                this.isGameOver=true;
            }
        }
    },
    onKeyUp: function (event) {
        switch(event.keyCode) {
            case cc.KEY.a:
                console.log('release a key');
                break;
            case cc.KEY.d:
                break;
            case cc.KEY.s:
                break;
        }
    },
    //下落物体并将物体的false置为true
    DownBlock:function(){
        if(this.isDown==false)
        {
             //存取俄罗斯方块的行数
            var nArrayRow=[];
           //存取俄罗斯方块的列数
           var nArrayList=[];
            //获取节点子节点数组
            var blockChild=this.node.getChildren(); 
            for(var i=0;i<=3;i++)
            {
              //获取此时组成俄罗斯方块元素的行列
              var nX=(blockChild[i].getPositionX()+this.node.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
              var nY=(blockChild[i].getPositionY()+this.node.getPositionY()-cc.find("GroundParent").getPositionY())/65+1; 
              nArrayList.push(nX);
              nArrayRow.push(nY);
            //   this.blockChild[i].y -=65;
              //获取下落后的行列
              if(i==3)
              {
                  //从小到大排序行数
                  for(var j=0;j<=3;j++)
                  {   
                    if(j<=2)
                    {
                        for(var k=j+1;k<=3;k++)
                        {
                            if(nArrayRow[k]<nArrayRow[j])
                            {
                                var nOldY=nArrayRow[j];
                                nArrayRow[j]=nArrayRow[k];
                                nArrayRow[k]=nOldY;
                                var nOldX=nArrayList[j];
                                nArrayList[j]=nArrayList[k];
                                nArrayList[k]=nOldX;
                            }        
                        }  
                    }
                  }
                  for(var l=0;l<=3;l++)
                  {
                    if(nArrayRow[l]==21)
                    {
                         Global.game1Main.groundChild[nArrayList[l]-1][nArrayRow[l]-2].getComponent("PrefabState").isBox=true;
                    }
                    else
                    {
                        if(nArrayRow[0]==2)
                        {
                             Global.game1Main.groundChild[nArrayList[l]-1][nArrayRow[l]-1].getComponent("PrefabState").isBox=false;
                             Global.game1Main.groundChild[nArrayList[l]-1][nArrayRow[l]-2].getComponent("PrefabState").isBox=true;
                             this.isCollision=true;
                             //初始化1s计时器
                             this.fCollisionTime=0;
                        }
                        else
                        {
                          Global.game1Main.groundChild[nArrayList[l]-1][nArrayRow[l]-1].getComponent("PrefabState").isBox=false;
                          Global.game1Main.groundChild[nArrayList[l]-1][nArrayRow[l]-2].getComponent("PrefabState").isBox=true;
                        }
                    }
                  }
                  this.node.y -=65;   
              } 
        }
        }
        this.isDown=true;
    },
    //根据形状判断俄罗斯方块下落时是否可以下落
    GetShape:function(stringBlock,nArray,nx,ny,nRotate1){
        switch(stringBlock)
        {
            case "L":
                     if(nRotate1==0||nRotate1==360)
                     {
                         switch(nArray)
                         {
                             case 0:
                                   this.AddBoxNumber(nx,ny);
                                   break;
                             case 1:
                                  this.AddBoxNumber(nx,ny);
                                   break;
                             case 2:
                                  this.AddBoxNumber(nx,ny);
                                  break;
                         }
                       
                         if(this.nBox==3)
                         {
                             this.DownBlock();
                         }
                         else
                         {
                             if(nArray==3)
                             {
                                
                                this.isCollision=true;
                                 //初始化触碰1秒计时
                                 this.fCollisionTime=0;
                             }      
                         }
                     }
                     else if(nRotate1==90)
                    {
                        switch(nArray)
                        {
                            case 0:
                                  this.AddBoxNumber(nx,ny);
                                  break;
                            case 3:
                                this.AddBoxNumber(nx,ny);
                                 break;
                        }
                        
                        if(this.nBox==2)
                        {
                            this.DownBlock();
                        }
                        else
                        {
                            if(nArray==3)
                            {
                                
                               this.isCollision=true;
                                //初始化触碰1秒计时
                                this.fCollisionTime=0;
                            }      
                        }
   
                    }
                    else if(nRotate1==180)
                     {
                        switch(nArray)
                        {
                            case 0:
                                  this.AddBoxNumber(nx,ny);
                                  break;
                            case 1:
                                 this.AddBoxNumber(nx,ny);
                                  break;
                            case 3:
                                 this.AddBoxNumber(nx,ny);
                                 break;
                        }
                     
                        if(this.nBox==3)
                        {
                            this.DownBlock();
                        }
                        else
                        {
                            if(nArray==3)
                            {
                               
                               this.isCollision=true;
                                //初始化触碰1秒计时
                                this.fCollisionTime=0;
                            }      
                        }
                    }
                    else
                    {
                        switch(nArray)
                        {
                            case 2:
                                  this.AddBoxNumber(nx,ny);
                                  break;
                            case 3:
                                 this.AddBoxNumber(nx,ny);
                                 break;
                        }
                      
                        if(this.nBox==2)
                        {
                            this.DownBlock();
                        }
                        else
                        {
                            if(nArray==3)
                            {
                                
                               this.isCollision=true;
                                //初始化触碰1秒计时
                                this.fCollisionTime=0;
                            }      
                        }
                    }                      
                     break;
            case "Long":
                     if(nRotate1==0||nRotate1==360)
                    {
                        switch(nArray)
                        {
                            case 0:
                                  this.AddBoxNumber(nx,ny);
                                  break;
                            case 1:
                                 this.AddBoxNumber(nx,ny);
                                  break;
                            case 2:
                                 this.AddBoxNumber(nx,ny);
                                 break;``
                            case 3:
                                 this.AddBoxNumber(nx,ny);
                                 break;
                        }
                        if(this.nBox==4)
                        {
                            this.DownBlock();

                        }
                        else
                        {
                            if(nArray==3)
                            {
                                if(ny==21)
                                {
                                  
                                    this.isGameOver=true;
                                } 
                                this.isCollision=true;
                                 //初始化触碰1秒计时
                                 this.fCollisionTime=0;
                            }    
                        }
                    }
                    else if(nRotate1==90)
                    {
                        if(nArray==3)
                        {
                            this.AddBoxNumber(nx,ny);
                        }
                        if(this.nBox==1)
                        {
                            this.DownBlock();
                        }
                        else
                        {
                            if(nArray==3)
                            {
                               this.isCollision=true;
                                //初始化触碰1秒计时
                                this.fCollisionTime=0;
                            }      
                        }

                    }
                    else if(nRotate1==180)
                    {
                        switch(nArray)
                        {
                            case 0:
                                  this.AddBoxNumber(nx,ny);
                                  break;
                            case 1:
                                 this.AddBoxNumber(nx,ny);
                                  break;
                            case 2:
                                 this.AddBoxNumber(nx,ny);
                                 break;
                            case 3:
                                 this.AddBoxNumber(nx,ny);
                                 break;
                        }
                        if(this.nBox==4)
                        {
                            this.DownBlock();

                        }
                        else
                        {
                            if(nArray==3)
                            {
                                if(ny==21)
                                {
                                    this.isGameOver=true;

                                } 
                                this.isCollision=true;
                                 //初始化触碰1秒计时
                                 this.fCollisionTime=0;                                     
                            }    
                        }
                    }
                    else
                   {
                       if(nArray==0)
                        {
                            this.AddBoxNumber(nx,ny);
                        }
                        if(this.nBox==1)
                        {
                            this.DownBlock();
                        }
                        else
                        {
                            if(nArray==3)
                            {
                               this.isCollision=true;
                                //初始化触碰1秒计时
                                this.fCollisionTime=0;
                            }      
                        }

                   }   
                     break;
            case "Square":
                    switch(nArray)
                    {
                        case 0:
                             this.AddBoxNumber(nx,ny);
                              break;
                        case 1:
                              this.AddBoxNumber(nx,ny);
                              break;
                    }
                   
                  
                    if(this.nBox==2)
                    {
                        this.DownBlock();
                    }
                    else
                    {
                        if(nArray==3)
                        {
                           this.isCollision=true;
                            //初始化触碰1秒计时
                            this.fCollisionTime=0;
                        }      
                    }
                     break;
            case "T":
                    if(nRotate1==0||nRotate1==360)
                    {
                        switch(nArray)
                        {
                            case 0:
                                    this.AddBoxNumber(nx,ny);
                                   break;
                            case 2:
                                     this.AddBoxNumber(nx,ny); 
                                   break;
                            case  3:
                                    this.AddBoxNumber(nx,ny);
                                  break;

                        }
                       
                        if(this.nBox==3)
                        {
                            this.DownBlock();
                        }
                        else
                        {
                            if(nArray==3)
                            {
                               
                               this.isCollision=true;
                                //初始化触碰1秒计时
                                this.fCollisionTime=0;
                            }      
                        }
                    }
                    else if(nRotate1==90)
                    {
                        switch(nArray)
                        {
                            case 2:
                                 this.AddBoxNumber(nx,ny);
                                  break;
                            case 3:
                                  this.AddBoxNumber(nx,ny);
                                  break;
                        }
                      
                        if(this.nBox==2)
                        {
                           
                            this.DownBlock();
                        }
                        else
                        {
                            if(nArray==3)
                            {
                               this.isCollision=true;
                                //初始化触碰1秒计时
                                this.fCollisionTime=0;
                            }      
                        }

                    }
                    else if(nRotate1==180)
                    {
                        switch(nArray)
                        {
                            case 0:
                                 this.AddBoxNumber(nx,ny);
                                  break;
                            case 1:
                                  this.AddBoxNumber(nx,ny);
                                  break;
                            case 3:
                                  this.AddBoxNumber(nx,ny);
                                  break;
                        }
                       
                        if(this.nBox==3)
                        {
                            this.DownBlock();
                        }
                        else
                        {
                            if(nArray==3)
                            {
                            
                               this.isCollision=true;
                                //初始化触碰1秒计时
                                this.fCollisionTime=0;
                            }      
                        }
       
                    }
                    else
                    {
                        switch(nArray)
                        {
                            case 0:
                                 this.AddBoxNumber(nx,ny);
                                  break;
                            case 2 :
                                  this.AddBoxNumber(nx,ny);
                                  break;
                        }
                       
                        if(this.nBox==2)
                        {
                            this.DownBlock();
                        }
                        else
                        {
                            if(nArray==3)
                            {
                                
                               this.isCollision=true;
                                //初始化触碰1秒计时
                                this.fCollisionTime=0;
                            }      
                        }
                    }   
                     break;
            case "Z":
                     if(nRotate1==0||nRotate1==360)
                    {
                        switch(nArray)
                        {
                            case 0:
                                 this.AddBoxNumber(nx,ny);
                                  break;
                            case 2:
                                  this.AddBoxNumber(nx,ny);
                                  break;
                            case 3:
                                  this.AddBoxNumber(nx,ny);
                                  break;
                        }
                        if(this.nBox==3)
                        {
                            this.DownBlock();
                        }
                        else
                        {
                            if(nArray==3)
                            {
                               this.isCollision=true;
                                //初始化触碰1秒计时
                                this.fCollisionTime=0;
                            }      
                        }
                    }
                    else if(nRotate1==90)
                    {
                        switch(nArray)
                        {
                            case 1:
                                 this.AddBoxNumber(nx,ny);
                                  break;
                            case 3:
                                  this.AddBoxNumber(nx,ny);
                                  break;
                        }
                        if(this.nBox==2)
                        {
                            this.DownBlock();
                        }
                        else
                        {
                            if(nArray==3)
                            {
                               this.isCollision=true;
                                //初始化触碰1秒计时
                                this.fCollisionTime=0;
                            }      
                        }

                    }
                    else if(nRotate1==180)
                   {
                       switch(nArray)
                        {
                            case 0:
                                 this.AddBoxNumber(nx,ny);
                                  break;
                            case 1:
                                  this.AddBoxNumber(nx,ny);
                                  break;
                            case 3:
                                  this.AddBoxNumber(nx,ny);
                                  break;
                        }
                        if(this.nBox==3)
                        {
                            this.DownBlock();
                        }
                        else
                        {
                            if(nArray==3)
                            {
                               this.isCollision=true;
                                //初始化触碰1秒计时
                                this.fCollisionTime=0;
                            }      
                        }
                    }
                    else
                    {
                        switch(nArray)
                        {
                            case 0:
                                 this.AddBoxNumber(nx,ny);
                                  break;
                            case 2:
                                  this.AddBoxNumber(nx,ny);
                                  break;
                        }
                        if(this.nBox==2)
                        {
                            this.DownBlock();
                        }
                        else
                        {
                            if(nArray==3)
                            {
                                
                               this.isCollision=true;
                                //初始化触碰1秒计时
                               this.fCollisionTime=0;
                            }     
                        }
                    }   
                    break;
        }   
    },
    //俄罗斯方块下落
    BlockDown:function(){
        //判断俄罗斯方块是否移动过一次
        var isMove=true;
        //获取节点子节点数组
        var blockChild=this.node.getChildren(); 
       //  //判断俄罗斯方块是否结束地面
       //  var isCollisionGround=false;
       //判断俄罗斯方块中是否含有22行
       for(var i=0;i<=3;i++)
       {
           var nY=(blockChild[i].getPositionY()+this.node.getPositionY()-cc.find("GroundParent").getPositionY())/65+1;
           if(nY==22)
           {   
               isMove=false;
           }
       }
       if(isMove==false)
       {
           //初始化俄罗斯方块中第21行方块的数组下表
           var nBoxArray=[];
           //初始化俄罗斯方块中第21行方块的数组列
           var nXArray=[];
           //初始化俄罗斯方块中第21行方块的数组行
           var nYArray=[];
           //遍历俄罗斯方块并并判断第21行的下面是否为true
           for(var i=0;i<=3;i++)
           {
                //获取此时组成俄罗斯方块元素的行列
                var nX=(blockChild[i].getPositionX()+this.node.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
                var nY=(blockChild[i].getPositionY()+this.node.getPositionY()-cc.find("GroundParent").getPositionY())/65+1; 
                if(nY==21)
                {      
                   if(Global.game1Main.groundChild[nX-1][nY-2].getComponent("PrefabState").isBox)
                   {
                       this.isGameOver=true;
                   }
                   else
                   {
                       nBoxArray.push(i);
                       nXArray.push(nX);
                       nYArray.push(nY);
                   }
                }
                if(i==3&&this.isGameOver==false)
                {
                    //关闭碰撞
                    this.node.y -=65;
                    if(nBoxArray.length>=2)
                    {
                       for(var j=0;j<=nBoxArray.length-1;j++)
                       {
                          Global.game1Main.groundChild[nXArray[j]-1][nYArray[j]-2].getComponent("PrefabState").isBox=true;     
                       }
                    }
                    else
                    {
                       Global.game1Main.groundChild[nXArray[0]-1][nYArray[0]-2].getComponent("PrefabState").isBox=true;  
                    }
                    //初始化计时器
                    this.fDownTime=0; 
                }     
           }
       }
       else
       {            
       //     //获取此时组成俄罗斯方块元素的行列
       //    var nX=(blockChild[i].getPositionX()+this.node.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
       //    var nY=(blockChild[i].getPositionY()+this.node.getPositionY()-cc.find("GroundParent").getPositionY())/65+1; 
           //存取俄罗斯方块的行数
           var nArrayRow=[];
           //存取俄罗斯方块的列数
           var nArrayList=[]; 
           //将俄罗斯方块的行列存入数组中
           for(var i=0;i<=3;i++)
           {
                //获取此时组成俄罗斯方块元素的行列
                var nX=(blockChild[i].getPositionX()+this.node.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
                var nY=(blockChild[i].getPositionY()+this.node.getPositionY()-cc.find("GroundParent").getPositionY())/65+1; 
                nArrayList.push(nX);
                nArrayRow.push(nY);
           }
           //从小到大排序行数
           for(var j=0;j<=3;j++)
           {   
             if(j<=2)
             {
                 for(var k=j+1;k<=3;k++)
                 {
                     if(nArrayRow[k]<nArrayRow[j])
                     {
                         var nOldY=nArrayRow[j];
                         nArrayRow[j]=nArrayRow[k];
                         nArrayRow[k]=nOldY;
                         var nOldX=nArrayList[j];
                         nArrayList[j]=nArrayList[k];
                         nArrayList[k]=nOldX;
                     }        
                 }  
             }
           }
           if(nArrayRow[0]==1)
           {
            //    this.fCollisionTime=0;
               this.isCollision=true;
               return;
           }
           else
           {
               for(var i=0;i<=3;i++)
               {        
                    //获取此时组成俄罗斯方块元素的行列
                    var nX=(blockChild[i].getPositionX()+this.node.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
                    var nY=(blockChild[i].getPositionY()+this.node.getPositionY()-cc.find("GroundParent").getPositionY())/65+1;     
                    if(i==0)
                    {                  
                        this.nBox=0;
                        this.isDown=false;
                    }  
                    this.GetShape(this.stringBoloekShape,i,nX,nY,Global.game1Main.nRotateAngle);
                    if(i==3)
                    {
                        this.fDownTime=0;
                    }                                    
               }     
           }
       }
    },
    update (dt) {
         //物体下落,开始计时
         this.fDownTime +=dt;
         if(this.fDownTime>=1&&this.isStationary==false)
         {
             this.isCollision=false;
             this.BlockDown();
         } 
         if(this.isCollision)     
         {    
             this.fCollisionTime +=dt;
             if(this.fCollisionTime>=1)
             { 
                // this.isHasBox=true;
                this.isStationary=true;
                this.isCollision=false;
             }
         }  
    },
});
