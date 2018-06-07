// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
window.Global = {
    //声明全局Game1Main
     game1Main:null,
 
};

cc.Class({
    extends: cc.Component,

    properties: {
        //获取canvas节点
        nodeCanvas:{
            default:null,
            type:cc.Node
        },
        //获取地板预制体元素
        groundPrefab:{
            default:null,
            type:cc.Prefab
        },
        //获取方块父节点
        boxParent:{
            default:null,
            type:cc.Node
        },
        //获取地板父节点
        groundParent:{
            default:null,
            type:cc.Node
        }
        ,
        //获取L形状方块预制体
        prefabL:{
            default:null,
            type:cc.Prefab
        },
         //获取正方形方块预制体
         prefabSquare:{
            default:null,
            type:cc.Prefab
        },
         //获取Z形状方块预制体
         prefabZ:{
            default:null,
            type:cc.Prefab
        }, //获取长条形状方块预制体
        prefabLong:{
            default:null,
            type:cc.Prefab
        },
         //获取T形状方块预制体
         prefabT:{
            default:null,
            type:cc.Prefab
        },
        //获取俄罗斯方块父节点
        blockParent:{
            default:null,
            type:cc.Node
        },
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
      
        Global.game1Main=this;
        //初始化背景子节点
        this.groundChild=[];
        for(var i=0;i<=9;i++)
         {
             this.groundChild[i]=[];
         }
         //初始化当前俄罗斯方块颜色
         this.stringColor="";
          //初始化当前俄罗斯方块形状
          this.stringShape="";
           //初始化当前俄罗斯方块角度
         this.stringRotate="";
        // cc.log(this.nodeCanvas.getComponent("Game1Main").stringShape);
         //初始化旋转角度
         this.nRotateAngle=0; 
         //生成游戏背景
         this.GetGround();
         //随机生成俄罗斯方块
         this.GetBlock();  
         this.boxParent1=this.boxParent.getChildren();
         cc.log(this.boxParent1);
         //声明数组，当俄罗斯方块固定后将俄罗斯方块的子块存入该数组   
         cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this); 
    },
    start () {
      
   
    },
    onKeyDown: function (event) {
        var self=this;
        switch(event.keyCode) {
            case cc.KEY.a:
                 self.MoveLeft();
                
                break;
            case cc.KEY.d:
                 self.MoveRight();
                break;
            case cc.KEY.s:
                self.DownQuick();
              
                break;
            case cc.KEY.l:
                 self.RotateBlock();
                break;
        }
    },
    //俄罗斯方块向左移动
    MoveLeft:function(){
      //存取俄罗斯方块的行数
      var nArrayRow=[];
      //存取俄罗斯方块的列数
      var nArrayList=[]; 
       //获取节点子节点数组
       var blockChild=this.nodeBlock.getChildren(); 
      //将俄罗斯方块的行列存入数组中
      for(var i=0;i<=3;i++)
      {
           //获取此时组成俄罗斯方块元素的行列
           var nX=(blockChild[i].getPositionX()+this.nodeBlock.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
           var nY=(blockChild[i].getPositionY()+this.nodeBlock.getPositionY()-cc.find("GroundParent").getPositionY())/65+1; 
           nArrayList.push(nX);
           nArrayRow.push(nY);
      }       //从小到大排序行数
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
        if(nArrayRow[0]<=19||(nArrayRow[0]==20&&this.nodeBlock.getComponent("OperateBlock").stringBoloekShape=="L"))
        {
             //从小到大排序列数
      for(var j=0;j<=3;j++)
      {   
        if(j<=2)
        {
            for(var k=j+1;k<=3;k++)
            {
                if(nArrayList[k]<nArrayList[j])
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
         if(nArrayList[0]==1)
         {
             return; 
         }
         else
         {
             //判断方块的前一列是否有方块
             var isHas=false;
             for(var i=0;i<=3;i++)
             {
                //将俄罗斯方块所在方格置为false
                this.groundChild[nArrayList[i]-1][nArrayRow[i]-1].getComponent("PrefabState").isBox=false;
                //判断方块的前一列的方块属性是否为true
                if( this.groundChild[nArrayList[i]-2][nArrayRow[i]-1].getComponent("PrefabState").isBox)
                {
                    isHas=true;
                }
                if(i==3)
                {
                    if(isHas)
                    {
                        for(var j=0;j<=3;j++)
                        {
                            //将俄罗斯方块所在方格置为false
                            this.groundChild[nArrayList[j]-1][nArrayRow[j]-1].getComponent("PrefabState").isBox=true;
                        }
                        return;
                    }
                    else
                    {
                        for(var k=0;k<=3;k++)
                        {
                            //将前一列的方块所在方格置为true
                            this.groundChild[nArrayList[k]-2][nArrayRow[k]-1].getComponent("PrefabState").isBox=true;
                            if(k==3)
                            {
                                //俄罗斯方块向左移动
                                 this.nodeBlock.x -=65;
                                 if(this.nodeBlock.getComponent("OperateBlock").isCollision)
                                 {
                                     //初始化 1s计时器
                                     this.nodeBlock.getComponent("OperateBlock").fDownTime=0;
                                 }
                            }   
                        }
                    }
                }
             }
         }
            
        }
        else
        {
            return;
        }
    },
    //俄罗斯方块向右移动
    MoveRight:function(){
         //存取俄罗斯方块的行数
      var nArrayRow=[];
      //存取俄罗斯方块的列数
      var nArrayList=[]; 
       //获取节点子节点数组
       var blockChild=this.nodeBlock.getChildren(); 
      //将俄罗斯方块的行列存入数组中
      for(var i=0;i<=3;i++)
      {
           //获取此时组成俄罗斯方块元素的行列
           var nX=(blockChild[i].getPositionX()+this.nodeBlock.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
           var nY=(blockChild[i].getPositionY()+this.nodeBlock.getPositionY()-cc.find("GroundParent").getPositionY())/65+1; 
        //    cc.log(nX);
        //    cc.log(nY);
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
         if(nArrayRow[0]<=19||(nArrayRow[0]==20&&this.nodeBlock.getComponent("OperateBlock").stringBoloekShape=="L"))
         {
              //从小到大排序列数
      for(var j=0;j<=3;j++)
      {   
        if(j<=2)
        {
            for(var k=j+1;k<=3;k++)
            {
                if(nArrayList[k]<nArrayList[j])
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
         if(nArrayList[3]==10)
         {
             return;
         }
         else
         {
             //判断方块的下一列是否有方块
             var isHas=false;
             for(var i=3;i>=0;i--)
             {
                  //将俄罗斯方块所在方格置为false
                this.groundChild[nArrayList[i]-1][nArrayRow[i]-1].getComponent("PrefabState").isBox=false;
                //判断方块的下一列的方块属性是否为true
                if(this.groundChild[nArrayList[i]][nArrayRow[i]-1].getComponent("PrefabState").isBox)
                {
                    isHas=true;
                }
                if(i==0)
                {
                    if(isHas)
                    {
                        for(var j=0;j<=3;j++)
                        {
                            //将俄罗斯方块所在方格置为true
                            this.groundChild[nArrayList[j]-1][nArrayRow[j]-1].getComponent("PrefabState").isBox=true;
                        }
                        return;
                    }
                    else
                    {
                        for(var k=0;k<=3;k++)
                        {
                            //将下一列的方块所在方格置为true
                            this.groundChild[nArrayList[k]][nArrayRow[k]-1].getComponent("PrefabState").isBox=true;
                            if(k==3)
                            {
                                  //俄罗斯方块向右移动
                                   this.nodeBlock.x +=65;  
                                   if(this.nodeBlock.getComponent("OperateBlock").isCollision)
                                   {
                                       //初始化 1s计时器
                                       this.nodeBlock.getComponent("OperateBlock").fDownTime=0;
                                   }
                                //   //初始化 1s计时器
                                //   this.nodeBlock.getComponent("OperateBlock").fCollisionTime=0;
                            }
                        }
                    }
                }
             }
         }

             
         }
         else
         {
             return;
             
         }
    },
    //生成背景
    GetGround:function(){
        for(var i=0;i<=9;i++)
        {
            for(var j=0;j<=19;j++)
            {
                var groundNode=cc.instantiate(this.groundPrefab);
                groundNode.parent=this.groundParent;
                groundNode.setPosition(cc.p(i*65,j*65));
                this.groundChild[i].push(groundNode);
            }
        }    
    },
   //生成方块
   CopyBlock:function(prefabLBlock,stringShape1){
       //生成俄罗斯方块
    this.nodeBlock=cc.instantiate(prefabLBlock);
    //获取此时方块的形状
    this.nodeBlock.parent=this.blockParent;
    //随机方块位置
    this.nodeBlock.setPosition(this.setBlockPosition(this.shapeBlock[this.nShape])); 
    this.nodeBlock.getComponent("OperateBlock").stringBoloekShape=stringShape1;
   },
  //根据俄罗斯方块类型设置位置
   setBlockPosition:function(stringShape1){
       switch(stringShape1)
       {
           case "Square":
                          //获取方块的世界坐标
                           var v2WorldY=this.groundParent.getPositionY()+20*65+32.5;
                           var nRandom=195+Math.floor(cc.random0To1()*6)*65;
                           var v1WorldX=(nRandom+nRandom+65)/2;
                           return cc.p(v1WorldX,v2WorldY);
                        break;
           case "T":
                         switch(this.rotateBlock[this.nRotate])
                         {
                             case "0":
                                     //获取方块的世界坐标              
                                   var v2WorldY=this.groundParent.getPositionY()+21*65;
                                   var v1WorldX=195+Math.floor(cc.random0To1()*6)*65;
                                   return cc.p(v1WorldX,v2WorldY);
                                    break;
                             case "180":
                                       //获取方块的世界坐标    
                                       var v2WorldY=this.groundParent.getPositionY()+20*65;
                                      var v1WorldX=195+Math.floor(cc.random0To1()*6)*65;
                                      return cc.p(v1WorldX,v2WorldY);
                                      break;
                         }
                        break;
           case "L":   
                         switch(this.rotateBlock[this.nRotate])
                        {
                            case "0":
                            //获取方块的世界坐标
                             var v2WorldY=this.groundParent.getPositionY()+20*65;
                             var v1WorldX=195+Math.floor(cc.random0To1()*6)*65;
                             return cc.p(v1WorldX,v2WorldY);
                               break;
                             case "180":
                             //获取方块的世界坐标    
                             var v2WorldY=this.groundParent.getPositionY()+21*65;
                             var v1WorldX=195+Math.floor(cc.random0To1()*6)*65;
                             return cc.p(v1WorldX,v2WorldY);
                             break;
                         }
                        break;
           case "Long":
                          var v2WorldY=this.groundParent.getPositionY()+20*65;
                          var v1WorldX=195+Math.floor(cc.random0To1()*6)*65;
                          return cc.p(v1WorldX,v2WorldY);
                      break;
            case "Z":
                        switch(this.rotateBlock[this.nRotate])
                      {
                            case "0":
                                    //获取方块的世界坐标
                                    var v2WorldY=this.groundParent.getPositionY()+21*65;
                                    var v1WorldX=195+Math.floor(cc.random0To1()*6)*65;
                                    return cc.p(v1WorldX,v2WorldY);
                                    break;
                           case "180":
                                   //获取方块的世界坐标    
                                   var v2WorldY=this.groundParent.getPositionY()+20*65;
                                   var v1WorldX=195+Math.floor(cc.random0To1()*6)*65;
                                   return cc.p(v1WorldX,v2WorldY);
                                   break;
                        }
                     break;                
       }
   },
      //俄罗斯方块旋转
      RotateBlock:function(){
        if(this.nodeBlock.getComponent("OperateBlock").isStationary==false)
        {     
            if(this.shapeBlock[this.nShape]=="Square")
            {
                return;
            }
            else
            {
                this.TraverseRotate();     
            }
        }
    },
     //判断方块颜色
    IsColor:function(stringColor,nColor){
        switch(stringColor[nColor])
        {
            case "blue":  
                     this.ChangeColor(20,10,140,255);
                     break;
            case "green":    
                     this.ChangeColor(20,250,0,255);
                      break;
            case "red":
                     this.ChangeColor(250,0,50,255);
                      break;
        }    
    },
    //改变方块颜色
    ChangeColor:function(a,b,c,d){
        var  nodeBlockChild=this.nodeBlock.getChildren();
        for(var i=0;i<=nodeBlockChild.length-1;i++)
        {
            nodeBlockChild[i].setColor(cc.color(a,b,c,d));  
        }  
    },
    //判断方块形状
    IsShape:function(stringShape,nShape){
        switch(stringShape[nShape])
        {
            case "T":
                    //生成方块
                     this.CopyBlock(this.prefabT,"T");
                     //判断方块颜色
                     this.IsColor(this.colorBlock,this.nColor);
                     this.IsRotate(this.rotateBlock,this.nRotate,"T");     
                    //  this.nRotateAngle   
                     break;
            case "L":    
                      this.CopyBlock(this.prefabL,"L"); 
                      //判断方块颜色
                      this.IsColor(this.colorBlock,this.nColor);   
                      this.IsRotate(this.rotateBlock,this.nRotate,"L");     
                      break;
            case "Long":
                     this.CopyBlock(this.prefabLong,"Long");
                     //判断方块颜色
                     this.IsColor(this.colorBlock,this.nColor);   
                     this.IsRotate(this.rotateBlock,this.nRotate,"Long");     
                      break;
            case "Z":
                     this.CopyBlock(this.prefabZ,"Z");
                     //判断方块颜色
                     this.IsColor(this.colorBlock,this.nColor);   
                     this.IsRotate(this.rotateBlock,this.nRotate,"Z");     
                      break;
            case "Square":
                      this.CopyBlock(this.prefabSquare,"Square");
                       //判断方块颜色
                      this.IsColor(this.colorBlock,this.nColor);    
                      this.IsRotate(this.rotateBlock,this.nRotate,"Square");     
                      break;
        }  
    },
    //出生时根据角度改变子块位置
    ChangeRotate:function(nAngle){
         //获取此方块的数组
         var nodeBoxArray=this.nodeBlock.getChildren();
         if(nAngle==180)
         {
            this.nRotateAngle=nAngle;
            for(var i=0;i<=3;i++)
            {
                nodeBoxArray[i].setPosition(cc.p(nodeBoxArray[i].getPositionY(),-nodeBoxArray[i].getPositionX()));
                if(i==3)
                {
                   for(var j=0;j<=3;j++)
                   {
                    nodeBoxArray[j].setPosition(cc.p(nodeBoxArray[j].getPositionY(),-nodeBoxArray[j].getPositionX()));
                   }
                }
            }
        }
        else
        {
            this.nRotateAngle=nAngle;
        }
    },
    //遍历俄罗斯方块并旋转
    TraverseRotate:function(){
           //获取此方块的数组
          var nodeBoxArray=this.nodeBlock.getChildren();
          //判断俄罗斯方块旋转之后是否含有方块
          var isHasBox=false;
          //判断俄罗斯方块旋转之后是否超过墙
          var isOutWall=false;
         //判断俄罗斯方块旋转之后是否超过背景的上方或下方、
         var isOutGround=false;
         //存储俄罗斯方块未旋转前的行列
         var nRowY=[];
         var nLineX=[];
         //存入俄罗斯方块旋转后子元素的行和列
          var arrayX=[];
          var arrayY=[];
          //将俄罗斯方块的行数从小到大排列
          for(var j=0;j<=3;j++)
          {   
               var nX1=(nodeBoxArray[j].getPositionX()+this.nodeBlock.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
               var nY1=(nodeBoxArray[j].getPositionY()+this.nodeBlock.getPositionY()-cc.find("GroundParent").getPositionY())/65+1;
               nLineX.push(nX1);
               nRowY.push(nY1);
               if(j==3)
               {   
                 for(var k=0;k<=3;k++)
                 {
                     if(k<=2)
                     {
                         for(var l=k+1;l<=3;l++)
                         {
                             if(nRowY[l]<nRowY[k])
                             {
                                 var oldX=nLineX[k];
                                 nLineX[k]=nLineX[l];
                                 nLineX[l]=oldX;
                                  var oldY=nRowY[k];
                                  nRowY[k]=nRowY[l];
                                  nRowY[l]=oldY;
                             }
                         }
                     }
                 }
               }
          }
          if(this.nodeBlock.getComponent("OperateBlock").stringBoloekShape=="Long")
          {
              if(nRowY[0]==21)
              {
                 return;
              }
          }
          else
          {
              if(nRowY[0]>=19)
              {
                 return;
              }
          }
         for(var i=0;i<=3;i++)
         {
              //判断旋转的字块是否为原点
             var isZero=false;
              //获取旋转后的坐标 
             var v2RotateX=nodeBoxArray[i].getPositionY();
             var v2RotateY=-nodeBoxArray[i].getPositionX();
            //当旋转后的坐标与旋转前的坐标相同时
            if(v2RotateX==nodeBoxArray[i].getPositionX()&&v2RotateY==nodeBoxArray[i].getPositionY())
            {
                  //将旋转前的方块置为false
                 var nX1=(nodeBoxArray[i].getPositionX()+this.nodeBlock.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
                 var nY1=(nodeBoxArray[i].getPositionY()+this.nodeBlock.getPositionY()-cc.find("GroundParent").getPositionY())/65+1;
                 nLineX.push(nX1);
                 nRowY.push(nY1);
                 this.groundChild[nX1-1][nY1-1].getComponent("PrefabState").isBox=false;
                 isZero=true;
            }
            else
            {
                 //将旋转前的方块置为false
                 var nX1=(nodeBoxArray[i].getPositionX()+this.nodeBlock.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
                 var nY1=(nodeBoxArray[i].getPositionY()+this.nodeBlock.getPositionY()-cc.find("GroundParent").getPositionY())/65+1;
                 nLineX.push(nX1);
                 nRowY.push(nY1);
                 this.groundChild[nX1-1][nY1-1].getComponent("PrefabState").isBox=false;
            }
            // //旋转坐标
            // nodeBoxArray[i].setPosition(cc.p(nodeBoxArray[i].getPositionY(),-nodeBoxArray[i].getPositionX()));
            //获取旋转后组成俄罗斯方块元素的行列
            var nX=(v2RotateX+this.nodeBlock.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
            var nY=(v2RotateY+this.nodeBlock.getPositionY()-cc.find("GroundParent").getPositionY())/65+1; 
            arrayX.push(nX);
            arrayY.push(nY);
            //当俄罗斯方块旋转后超过场景上方或下方时
            if(nY>20||nY<1)
            {
                isOutGround=true;
            }
            //当超出墙壁时
            if(nX>10||nX<1)
            {  
                isOutWall=true;
            }       
            else
            {
                if(isOutGround==false)
                {
                    if(this.groundChild[nX-1][nY-1].getComponent("PrefabState").isBox&&isZero==false)
                    {
                        isHasBox=true;
                    }
                }
            }
            if(i==3)
            {
                if(isHasBox==false&&isOutWall==false&&isOutGround==false)
                 {
                      //旋转俄罗斯方块
                     for(var i=0;i<=3;i++)
                     {   
                        //  var nX=(nodeBoxArray[i].getPositionX()+this.nodeBlock.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
                        //  var nY=(nodeBoxArray[i].getPositionY()+this.nodeBlock.getPositionY()-cc.find("GroundParent").getPositionY())/65+1; 
                        //  this.groundChild[nX-1][nY-1].getComponent("PrefabState").isBox=false;
                          nodeBoxArray[i].setPosition(cc.p(nodeBoxArray[i].getPositionY(),-nodeBoxArray[i].getPositionX()));
                          var nX1=(nodeBoxArray[i].getPositionX()+this.nodeBlock.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
                         var nY1=(nodeBoxArray[i].getPositionY()+this.nodeBlock.getPositionY()-cc.find("GroundParent").getPositionY())/65+1; 
                         this.groundChild[nX1-1][nY1-1].getComponent("PrefabState").isBox=true;
                      }   
                      //初始化 1s计时器
                      this.nodeBlock.getComponent("OperateBlock").fCollisionTime=0;
                      this.nRotateAngle +=90;
                      if(this.nRotateAngle==360)
                      {
                         this.nRotateAngle=0;
                      }                      
                 }
                 if(isHasBox)
                 {
                     //将置为false的方块还原属性
                     for(var i=0;i<=3;i++)
                     {
                         this.groundChild[nLineX[i]-1][nRowY[i]-1].getComponent("PrefabState").isBox=true;
                     }
                 }
                 //当旋转以后超过游戏场景上方或下方
                 if(isOutGround)
                 {
                    for(var j=0;j<=3;j++)
                    {
                       if(j==3)
                       {
                           //将旋转后的行数从小到大排列
                           for(var k=0;k<=3;k++)
                           {
                               if(k<=2)
                               {
                                   for(var l=k+1;l<=3;l++)
                                   {
                                       if(arrayY[l]<arrayY[k])
                                       {
                                           var oldX=arrayX[k];
                                            arrayX[k]=arrayX[l];
                                            arrayX[l]=oldX;

                                            var oldY=arrayY[k];
                                            arrayY[k]=arrayY[l];
                                            arrayY[l]=oldY;
                                       }
                                   }
                               }     
                               if(k==3)
                               {
                                 
                                   if(arrayY[3]>20)
                                   {
                                       //向下移动的单位个数
                                       var nMove=arrayY[3]-20;
                                       //存取移动后的行 ，列
                                       var nMoveX=[];
                                       var nMoveY=[];
                                       //存取移动过后的位置
                                       var arrayMoveX=[];
                                       var arrayMoveY=[];
                                       //判断旋转移动后是否有方块
                                       var isHasBox=false;
                                       for(var l=0;l<=3;l++)
                                       {
                                           //  //获取旋转前的行列
                                           //  var nX0=(nodeBoxArray[i].getPositionX()+this.nodeBlock.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
                                           //  var nY0=(nodeBoxArray[i].getPositionY()+this.nodeBlock.getPositionY()-cc.find("GroundParent").getPositionY())/65+1;
                                           //  this.groundChild[nX0-1][nY0-1].getComponent("PrefabState").isBox=false;
                                            //获取旋转后的坐标 
                                            var v2RotateX=nodeBoxArray[l].getPositionY();
                                            var v2RotateY=-nodeBoxArray[l].getPositionX();
                                            // //获取移动后的坐标
                                            var v2RotateY1=v2RotateY-65*nMove;
                                            //获取移动后俄罗斯方块元素的行列
                                            var nX1=(v2RotateX+this.nodeBlock.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
                               
                                            var nY1=(v2RotateY1+this.nodeBlock.getPositionY()-cc.find("GroundParent").getPositionY())/65+1; 
                                          
                                            if(this.groundChild[nX1-1][nY1-1].getComponent("PrefabState").isBox)
                                            {
                                                isHasBox=true;
                                            }
                                            //获取本地坐标
                                            var positionX=v2RotateX;
                                            var positionY=v2RotateY1;
                                            arrayMoveX.push(positionX);
                                            arrayMoveY.push(positionY);
                                           //  nodeBoxArray[i].setPosition(cc.p(positionX,positionY));
                                            nMoveX.push(nX1);
                                            nMoveY.push(nY1);
                                            if(l==3)
                                            {
                                                if(isHasBox)
                                                {
                                                      
                                                    //还原未旋转移动前的box的true属性
                                                    for(var j=0;j<=3;j++)
                                                    {
                                                       this.groundChild[nLineX[j]-1][nRowY[j]-1].getComponent("PrefabState").isBox=true;
                                                    }
                                                    return;
                                                }
                                                else
                                                {
                                                     //初始化 1s计时器
                                                     this.nodeBlock.getComponent("OperateBlock").fCollisionTime=0;
                                                    this.nRotateAngle +=90;
                                                    if(this.nRotateAngle==360)
                                                    {
                                                        this.nRotateAngle=0;
                                                   }    
                                                   for(var i=0;i<=3;i++)
                                                   {           
                                                       //获取旋转后的坐标 
                                                         var v2RotateX=nodeBoxArray[i].getPositionY();
                                                        var v2RotateY=-nodeBoxArray[i].getPositionX();                                       
                                                        nodeBoxArray[i].setPosition(cc.p(v2RotateX,v2RotateY));
                                                       if(i==3)
                                                       {
                                                           this.nodeBlock.y -=65*nMove;
                                                       }
                                                       //将旋转移动后的方块置为true
                                                       this.groundChild[nMoveX[i]-1][nMoveY[i]-1].getComponent("PrefabState").isBox=true;
                                                   }
                                                }
                                            }
                                       }
                                   }
                                   if(arrayY[0]<1)
                                   {
                                        //向上移动的单位个数
                                       var nMove=1-arrayY[0];
                                       //存取移动后的行 ，列
                                       var nMoveX=[];
                                       var nMoveY=[];
                                       //存取移动过后的位置
                                       var arrayMoveX=[];
                                       var arrayMoveY=[];
                                       //判断旋转移动后是否有方块
                                       var isHasBox=false;
                                       for(var l=0;l<=3;l++)
                                       {
                                            //获取旋转后的坐标 
                                            var v2RotateX=nodeBoxArray[l].getPositionY();
                                            var v2RotateY=-nodeBoxArray[l].getPositionX();
                                            //获取移动后的坐标
                                            var v2RotateY1=v2RotateY+65*nMove;
                                            //获取移动后俄罗斯方块元素的行列
                                            var nX1=(v2RotateX+this.nodeBlock.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
                                            var nY1=(v2RotateY1+this.nodeBlock.getPositionY()-cc.find("GroundParent").getPositionY())/65+1; 
                        
                                            if(this.groundChild[nX1-1][nY1-1].getComponent("PrefabState").isBox)
                                            {
                                                isHasBox=true;
                                            }
                                            //获取本地坐标
                                            var positionX=v2RotateX;
                                            var positionY=v2RotateY1;
                                            arrayMoveX.push(positionX);
                                            arrayMoveY.push(positionY);
                                           //  nodeBoxArray[i].setPosition(cc.p(positionX,positionY));
                                            nMoveX.push(nX1);
                                            nMoveY.push(nY1);
                                            if(l==3)
                                            {
                                                if(isHasBox)
                                                {
                                                    //还原未旋转移动前的box的true属性
                                                    for(var j=0;j<=3;j++)
                                                    {
                                                       this.groundChild[nLineX[j]-1][nRowY[j]-1].getComponent("PrefabState").isBox=true;
                                                    }
                                                    return;
                                                }
                                                else
                                                {
                                                     //初始化 1s计时器
                                                     this.nodeBlock.getComponent("OperateBlock").fCollisionTime=0;
                                                    this.nRotateAngle +=90;
                                                    if(this.nRotateAngle==360)
                                                    {
                                                        this.nRotateAngle=0;
                                                   }    
                                                   for(var i=0;i<=3;i++)
                                                   {        
                                                      //获取旋转后的坐标 
                                                      var v2RotateX=nodeBoxArray[i].getPositionY();
                                                      var v2RotateY=-nodeBoxArray[i].getPositionX();                                       
                                                      nodeBoxArray[i].setPosition(cc.p(v2RotateX,v2RotateY));
                                                     if(i==3)
                                                     {
                                                         this.nodeBlock.y +=65*nMove;
                                                     }
                                                     //将旋转移动后的方块置为true
                                                     this.groundChild[nMoveX[i]-1][nMoveY[i]-1].getComponent("PrefabState").isBox=true;
                                                   }
                                                }
                                            }
                                       }
                                   }
                               }                      
                           }      
                       }
                    }

                 }
                 //当旋转以后超过墙时
                 if(isOutWall)
                 {
                     for(var j=0;j<=3;j++)
                     {
                        if(j==3)
                        {
                            //将旋转后的列数从小到大排列
                            for(var k=0;k<=3;k++)
                            {
                                if(k<=2)
                                {
                                    for(var l=k+1;l<=3;l++)
                                    {
                                        if(arrayX[l]<arrayX[k])
                                        {
                                            var oldX=arrayX[k];
                                             arrayX[k]=arrayX[l];
                                             arrayX[l]=oldX;
                                             var oldY=arrayY[k];
                                             arrayY[k]=arrayY[l];
                                             arrayY[l]=oldY;
                                        }
                                    }
                                }     
                                if(k==3)
                                {
                                    cc.log(arrayX);
                                    if(arrayX[3]>10)
                                    {
                                        cc.log("777777777777777777777777");
                                        //向左移动的单位个数
                                        var nMove=arrayX[3]-10;
                                        //存取移动后的行 ，列
                                        var nMoveX=[];
                                        var nMoveY=[];
                                        //存取移动过后的位置
                                        var arrayMoveX=[];
                                        var arrayMoveY=[];
                                        //判断旋转移动后是否有方块
                                        var isHasBox=false;
                                        for(var l=0;l<=3;l++)
                                        {
                                            //  //获取旋转前的行列
                                            //  var nX0=(nodeBoxArray[i].getPositionX()+this.nodeBlock.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
                                            //  var nY0=(nodeBoxArray[i].getPositionY()+this.nodeBlock.getPositionY()-cc.find("GroundParent").getPositionY())/65+1;
                                            //  this.groundChild[nX0-1][nY0-1].getComponent("PrefabState").isBox=false;
                                             //获取旋转后的坐标 
                                             var v2RotateX=nodeBoxArray[l].getPositionY();
                                             var v2RotateY=-nodeBoxArray[l].getPositionX();
                                             //获取移动后的坐标
                                             var v2RotateX1=v2RotateX-65*nMove;
                                             //获取移动后俄罗斯方块元素的行列
                                             var nX1=(v2RotateX1+this.nodeBlock.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
                                
                                             var nY1=(v2RotateY+this.nodeBlock.getPositionY()-cc.find("GroundParent").getPositionY())/65+1; 
                                             if(this.groundChild[nX1-1][nY1-1].getComponent("PrefabState").isBox)
                                             {
                                                 cc.log("666666666666");
                                                 isHasBox=true;
                                             }
                                             //获取本地坐标
                                             var positionX=v2RotateX1;
                                             var positionY=v2RotateY;
                                             arrayMoveX.push(positionX);
                                             arrayMoveY.push(positionY);
                                            //  nodeBoxArray[i].setPosition(cc.p(positionX,positionY));
                                             nMoveX.push(nX1);
                                             nMoveY.push(nY1);
                                             if(l==3)
                                             {
                                                 if(isHasBox)
                                                 {
                                                     //还原未旋转移动前的box的true属性
                                                     for(var j=0;j<=3;j++)
                                                     {
                                                        this.groundChild[nLineX[j]-1][nRowY[j]-1].getComponent("PrefabState").isBox=true;
                                                     }
                                                     return;
                                                 }
                                                 else
                                                 {
                                                     cc.log("55555555555");
                                                       //初始化 1s计时器
                                                     this.nodeBlock.getComponent("OperateBlock").fCollisionTime=0;
                                                     this.nRotateAngle +=90;
                                                     if(this.nRotateAngle==360)
                                                     {
                                                         this.nRotateAngle=0;
                                                    }    
                                                    for(var i=0;i<=3;i++)
                                                    {                                                  
                                                        //获取旋转后的坐标 
                                                        var v2RotateX=nodeBoxArray[i].getPositionY();
                                                        var v2RotateY=-nodeBoxArray[i].getPositionX();                                       
                                                        nodeBoxArray[i].setPosition(cc.p(v2RotateX,v2RotateY));
                                                       if(i==3)
                                                       {
                                                           this.nodeBlock.x -=65*nMove;
                                                       }
                                                       //将旋转移动后的方块置为true
                                                       this.groundChild[nMoveX[i]-1][nMoveY[i]-1].getComponent("PrefabState").isBox=true;
                                                    }

                                                 }
                                             }
                                        }
                                    }
                                    if(arrayX[0]<1)
                                    {
                                         //向右移动的单位个数
                                        var nMove=1-arrayX[0];
                                        //存取移动后的行 ，列
                                        var nMoveX=[];
                                        var nMoveY=[];
                                        //存取移动过后的位置
                                        var arrayMoveX=[];
                                        var arrayMoveY=[];
                                        //判断旋转移动后是否有方块
                                        var isHasBox=false;
                                        for(var l=0;l<=3;l++)
                                        {
                                             //获取旋转后的坐标 
                                             var v2RotateX=nodeBoxArray[l].getPositionY();
                                             var v2RotateY=-nodeBoxArray[l].getPositionX();
                                             //获取移动后的坐标
                                             var v2RotateX1=v2RotateX+65*nMove;
                                              
                                             //获取移动后俄罗斯方块元素的行列
                                             var nX1=(v2RotateX1+this.nodeBlock.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
                                
                                             var nY1=(v2RotateY+this.nodeBlock.getPositionY()-cc.find("GroundParent").getPositionY())/65+1; 
                                             if(this.groundChild[nX1-1][nY1-1].getComponent("PrefabState").isBox)
                                             {
                                                 isHasBox=true;
                                             }
                                             //获取本地坐标
                                             var positionX=v2RotateX1;
                                             var positionY=v2RotateY;
                                             arrayMoveX.push(positionX);
                                             arrayMoveY.push(positionY);
                                            //  nodeBoxArray[i].setPosition(cc.p(positionX,positionY));
                                             nMoveX.push(nX1);
                                             nMoveY.push(nY1);
                                             if(l==3)
                                             {
                                                 if(isHasBox)
                                                 {
                                                     //还原未旋转移动前的box的true属性
                                                     for(var j=0;j<=3;j++)
                                                     {
                                                        this.groundChild[nLineX[j]-1][nRowY[j]-1].getComponent("PrefabState").isBox=true;
                                                     }
                                                     return;
                                                 }
                                                 else
                                                 {
                                                       //初始化 1s计时器
                                                     this.nodeBlock.getComponent("OperateBlock").fCollisionTime=0;
                                                     this.nRotateAngle +=90;
                                                     if(this.nRotateAngle==360)
                                                     {
                                                         this.nRotateAngle=0;
                                                    }    
                                                    for(var i=0;i<=3;i++)
                                                    {
                                                        //获取旋转后的坐标 
                                                        var v2RotateX=nodeBoxArray[i].getPositionY();
                                                        var v2RotateY=-nodeBoxArray[i].getPositionX();                                       
                                                        nodeBoxArray[i].setPosition(cc.p(v2RotateX,v2RotateY));
                                                        if(i==3)
                                                       {
                                                           this.nodeBlock.x +=65*nMove;
                                                       }
                                                       //将旋转移动后的方块置为true
                                                       this.groundChild[nMoveX[i]-1][nMoveY[i]-1].getComponent("PrefabState").isBox=true;
                                                    }

                                                 }
                                             }
                                        }
                                    }
                                }                      
                            }      
                        }
                     }
                 }
            }
        }   
    },
     //判断方块角度
     IsRotate:function(stringRotate,nRotate,stringShape2){ 
         if(stringShape2!="Square")
         {
            switch(stringRotate[nRotate])
            {
                case "0":           
                         this.ChangeRotate(0);
                         break;
                case "180":  
                          this.ChangeRotate(180);  
                          break;
             }    
         }
         else
         { 
             this.nRotateAngle=0;
         }
    },
    //随机生成俄罗斯方块
    GetBlock:function(){
        //声明颜色数组
          this.colorBlock=["blue","green","red"];
        //声明形状数组
         this.shapeBlock=["T","L","Long","Z","Square"];
        //声明角度数组
         this.rotateBlock=["0","180"]; 
         this.nColor=Math.floor(cc.random0To1()*3);
         this.nShape=Math.floor(cc.random0To1()*5);
         this.nRotate=Math.floor(cc.random0To1()*2);
         //根据俄罗斯方块形状生成
         this.IsShape(this.shapeBlock,this.nShape);
         
    },
    //获取子块在地板父体下的坐标
    GetBoxNode:function(childBox){
        //获取子块在地板附体下的行列
        var nX=(childBox.getPositionX()+this.nodeBlock.getPositionX()-this.groundParent.getPositionX())/65+1;
        var nY=(childBox.getPositionY()+this.nodeBlock.getPositionY()-this.groundParent.getPositionY())/65+1;
        var x=this.groundChild[nX-1][nY-1].getPositionX();
        var y=this.groundChild[nX-1][nY-1].getPositionY();
         return cc.p(x,y);
    },
    //遍历全局字块数组并消除整行方块isBox都为true的节点
    TraversalNodeBox:function(nPositionY)
    {
        // var boxParent1=this.boxParent.getChildren();
        var nLength= this.boxParent1.length;
        //存储被销毁的俄罗斯方块数组的下标
        var  nDestroy=[]; 
        cc.log(nPositionY+"nPositionY");
        for(var j=0;j<=nLength-1;j++)
        {
            cc.log( this.boxParent1[j].getPositionY());
        }  
    //    cc.log(boxParent1[0].getPositionY());
    //    cc.log(nPositionY);
        for(var i=0;i<=nLength-1;i++)
        {
            // var boxParent1=this.boxParent.getChildren();
            if( this.boxParent1[i].getPositionY()==nPositionY)
            {    
                cc.log("ssssssss");
                //销毁该俄罗斯方块自方块
                this.boxParent1[i].destroy();
                //  //移除数组中的方块元素
                //  this.boxParent1.splice(i,1);
           
                 
            }
        }
    },
    //快速下落
    DownQuick:function(){
        cc.log("ssssssssss");
        //使俄罗斯方块时间为1s
        this.nodeBlock.getComponent("OperateBlock").fDownTime=1;
    },
    //遍历全局字块数组并将最高消层数以上的方块下落
    BoxDown:function(nMaxDisappea,nDisappearAll){
        for(var i=nMaxDisappea+1;i<=19;i++)
        {
            for(var j=0;j<=9;j++)
            {
                if(this.groundChild[j][i].getComponent("PrefabState").isBox)
                {
                
                    for(var l=0;l<=this.boxParent1.length-1;l++)
                     {
                         if( this.boxParent1[l].getPositionY()==this.groundChild[j][i].getPositionY()&& this.boxParent1[l].getPositionX()==this.groundChild[j][i].getPositionX())
                          {
                             this.boxParent1[l].setPosition(cc.p(this.groundChild[j][i].getPositionX(),this.groundChild[j][i].getPositionY()-65*nDisappearAll));   
                         }
                     }
                    this.groundChild[j][i].getComponent("PrefabState").isBox=false;
                    this.groundChild[j][i-nDisappearAll].getComponent("PrefabState").isBox=true;
                }
                if(i==19&&j==9)
                {
                    this.DisappearBox();
                }
            }
        }
    },
    //遍历游戏场景的字块中的isBox属性是否为true,并消除代码
    DisappearBox:function(){
        //初始化消行行数
        var nDisappear=[];
        for(var i=0;i<=19;i++)
        {
            for(var j=0;j<=9;j++)
            {
                if(j==0)
                {
                   //判断i行有多少个true
                   this.nTrue=0;
                }
                if(this.groundChild[j][i].getComponent("PrefabState").isBox)
                {
                    this.nTrue++;
                }
                if(j==9)
                {
                    for(var a=0;a<=9;a++)
                    {
                        cc.log(this.groundChild[a][i].getComponent("PrefabState").isBox);
                    }
                    if(this.nTrue==10)
                    {
                        // for(var b=0;b<=9;b++)
                        // {
                        //     cc.log(this.groundChild[b][i].getPositionY());
                        // }
                         //遍历全局字块数组并消除整行方块isBox都为true的节点
                        this.TraversalNodeBox(this.groundChild[j][i].getPositionY());  
                        //将消除的方块的isBox重置false
                        for(var k=0;k<=9;k++)
                        {
                            this.groundChild[k][i].getComponent("PrefabState").isBox=false;
                        }
                        nDisappear.push(i);
                    }
                    if(i==19&&nDisappear.length!=0)
                    {
                        //当消行层总数为1行是
                        if(nDisappear.length==1)
                        {
                            this.BoxDown(nDisappear[0],nDisappear.length);
                        }
                        else
                        {
                            //从小到达排序行数
                            for(var k=0;k<=nDisappear.length-1;k++)
                            {
                                for(var l=k+1;l<=nDisappear.length-1;l++)
                                {
                                    if(k<=2)
                                    {
                                        if(nDisappear[l]<nDisappear[k])
                                        {  
                                             var nMin=nDisappear[k];
                                             nDisappear[k]=nDisappear[l];
                                             nDisappear[l]=nMin;
                                         }   
                                    }          
                                }
                            }
                            this.BoxDown(nDisappear[nDisappear.length-1],nDisappear.length);
                        }
                    }
                }
            }
        }
    },
    update (dt) {   
        if(this.nodeBlock.getComponent("OperateBlock").isStationary)
        {
            // this.boxParent1=this.boxParent.getChildren();
            //获取此方块的数组
            var nodeBoxArray=this.nodeBlock.getChildren();
            for(var i=0;i<=3;i++)
            {          
               
                nodeBoxArray[0].setPosition(this.GetBoxNode( nodeBoxArray[0]));
                nodeBoxArray[0].parent=this.boxParent;
                if(i==3)
                {
                    this.nodeBlock.getComponent("OperateBlock").isChangeParent=true;
                }
            }
        }
        if(this.nodeBlock.getComponent("OperateBlock").isChangeParent)
        {
            //消除以后落下俄罗斯方块
            this.DisappearBox();
            //生成新的俄罗斯方块
            this.GetBlock();
            this.nodeBlock.getComponent("OperateBlock").isStationary=false;
            this.nodeBlock.getComponent("OperateBlock").isChangeParent=false;
        }
    },
});
