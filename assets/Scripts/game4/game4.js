var game3 = require("../game3/game.js");
cc.Class({
    extends: cc.Component,

    properties: {
       row : 12,
       col : 6,
       prefabArr : {
           default : [],
           type    : [cc.Prefab],
       },
       //背景
       back : {
           default : null,
           type    : cc.Prefab,
       },
       gridSize : 116.7,
       //游戏结束图片
       over : {
           default : null,
           type    : cc.Node,
       }
    },

    // LIFE-CYCLE CALLBACKS:
    
    onLoad () {
        cc.log("game3 is " + game3);
        this.init();
        //1秒后开始游戏
        this.scheduleOnce(function(){
            this.startGame();
        },1);
        //注册键盘监听
        this.registerKeyBoard();
        
    },
    registerKeyBoard : function(){
        //注册键盘监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);
    },
    onKeyDown : function(event){
        switch(event.keyCode){
            case cc.KEY.down:
                 this.quickDown();
                 break;
            case cc.KEY.left:
                 this.moveLeft();
                 cc.log("<-----");
                 break;
            case cc.KEY.right:
                 this.moveRight();
                 cc.log("----->");
                 break;  
            case cc.KEY.f:
                 this.rotate();
                 //旋转操作
                 break;                  
        }
    },
    onKeyUp   : function(event){
        switch(event.keyCode){
            case cc.KEY.down:
                 break;
            case cc.KEY.left:
                 break;
            case cc.KEY.right:
                 break;  
            case cc.KEY.f:
                 //旋转操作
                 break;                  
        }
    },
    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },
    //初始化游戏场景
    init : function(){
        //下落方式
        // this.down = {
        //     NORMAL : 0,
        //     QUICK  : 1,
        // }
        //正常下落
        this.downType = 0;
        //获得该节点的宽和高
        this.nodeHeight = this.node.height;
        this.nodeWidth = this.node.width;
        this.createMap();
        // game3.prototype.createShape(this.node,2,2,"Image");
        //下落单元
        this.nodeArr = this.createShape(this.node,2,2,"Image");
        this.downFunction(this.nodeArr,1);
        //生成下一个
        this.createNext();
        //结束按钮不显示
        this.over.active = false;
        this.gameOver = false;
        //update用时
        this.costTime = 0;
        //游戏状态
        this.iState = 0;
    },
    //开始游戏
    startGame : function(){
        //更改游戏状态为1
        this.iState = 1;
        this.updatePrefatY(this.nodeArr);
    },
    createMap : function(){
        //初始化y坐标
        var y = this.nodeHeight/2 - this.gridSize/2;
        //初始化x坐标
        var x = -this.nodeWidth/2 + this.gridSize/2;
        cc.log("x is " + x);
        this.backGroundArr = [];
        //定义一个地图
        this.map = [];
        //12行6列的网格
        for(var i = 0;i < this.row; i++){
            //设置它的y坐标
            var tempY =y - i * this.gridSize;
            cc.log("tempY is " + tempY);
            this.backGroundArr[i] = [];
            //地图信息
            this.map[i] = [];
            for(var j = 0; j < this.col;j++){
                var outArr = this.backGroundArr[i];
                var mapData = this.map[i];
                var tempX = x + j * this.gridSize;
                cc.log("tempX is " + tempX);
                //y坐标不变，x坐标要变
                var tempPrefab = this.setPrefabPosition(this.back,tempX,tempY,this.node);
                // var shape = new Shape(tempPrefab,-1);
                tempPrefab.isFilled = 0;
                tempPrefab.type = -1;
                tempPrefab.node = null,
                // var shape = new Shape(tempPrefab,-1);
                outArr[j]=tempPrefab;
                mapData[j] = 0;

                // outArr[j] = 
            }
        }
        cc.log("backGroundArr is " +this.backGroundArr);
    },
    createShape : function(parentNode,count,scope,sc){
        var self = this;
        this.times = 0;
        //动态生成一个新的节点将生成的预制体节点加入到该父节点上
        // var newNode = new cc.Node();
        // parentNode.addChild(newNode);
        //用来存放预制体的数组
        var randomCol = game3.prototype.createRandom(0,6);
        var prefabArrTemp = [];
        //盛放颜色代码的数组每次重新生成预制体节点的时候将之前的颜色代码数组置空
        this.boxColorArr = [];
        var y = this.nodeHeight/2 + this.gridSize/2+1*this.gridSize;
        for(var i = 0;i < count;i++){
            // var offSet = i * this.prefabHeight;
            // cc.log("offSet is " + offSet);
            // //产生0-3的随机数
            var index = Math.floor(Math.random()*200000) % scope;
            // //将对应的颜色索引存放到该数组中
            // // this.boxColorArr.push(this.prefabArr[index].color);
            // cc.log("index is " + index);
            // //将对应的预制体取出来转化为节点然后显示
            var prefabNode = game3.prototype.createPrefab(self.prefabArr[index]);
            // cc.log("x is " + x + " and y is "+ y - offSet);
            //设置预制节点的位置
            prefabNode.setPosition(this.backGroundArr[i][randomCol].x,y-i*this.gridSize);
            
            prefabNode.getComponent(sc).type = index;
            // prefabNode.active = false;

            this.backGroundArr[i][randomCol].node = prefabNode;
            cc.log("------type is " + prefabNode.getComponent(sc).type);
            //将该预制节点添加为parentNode的孩子
            parentNode.addChild(prefabNode);
            // var shape = new Shape(prefabNode,index);
            //将当前预制体节点存放到预制体临时数组里面
            prefabArrTemp.push(prefabNode);
        }
        console.log(prefabArrTemp);
        //将当前生成的预制体拼成的形状加到形状数组中去
        // this.shapeArr.push(prefabArrTemp);
        // cc.log("shapeArr is " + this.shapeArr);
        // cc.log("shapeArr's length is " + this.shapeArr.length);
        //显示下一个预制体拼成的图形
        // this.generateNext(this.nextShape,0,0);
        // this.getColorCount();
        return prefabArrTemp;
    },
    //生成下一个形状
    createNext : function(){
        this.nextBlock = this.createShape(this.node,2,2,"Image");
        
        // //显示下一个形状
        // this.showNextShape(this.nextBlock,this.nextShape);
        // //生成下下个形状
        // this.next2Block = this.generateNext(this.node,this.createRandomX(this.createRandom(0,6)),this.nodeHeight/2 - this.prefabHeight);
        // //显示下下个形状
        // this.showNextShape(this.next2Block,this.next2);
    },
    //显示下一个形状
    showNextShape : function(nextBlock,parentNode){
        //显示下一个形状之前删除这个节点的所有子节点
        if(parentNode.childrenCount > 0){
            for(let k = 0;k<parentNode.childrenCount;k++){
                //销毁该子节点,如果销毁节点成功的话就显示下一个形状
                parentNode.children[k].destroy();
            }
        }
        //依次生成预制节点组成的节点数组
        for(let i = 0;i<3;i++){
            var type = nextBlock[i].getComponent("Stone").type;
            // var spriteFrame = nextBlock[i].getComponent("cc.Sprite").spriteFrame;
            this.setPrefabPosition(this.prefabArr[type],0,140-i*this.prefabHeight,parentNode);
        }
        // for(let k = 0;k<3;k++){
        //     var pre = ;
        //     this.setPrefabPosition(,50,50+k*this.prefabHeight,this.nextShape);
        // }
    },
    //定时器控制下落
    downFunction : function(nodeArr,time){
        var self = this;
        // var promise = new Promise(function(resolve){
        //      //一秒下落一次
        //     self.schedule(function(){
                
        //     }.bind(self),time);
        // });
        // promise.then(function(){
        //     cc.log("222222222222222222222222");
        //     self.updatePrefatY(nodeArr);
        // });
        
        self.schedule(function(dt){
            cc.log("dt is " + dt);
            self.updatePrefatY(nodeArr);
        }.bind(self),time);
    },
    //更新预制体节点的y坐标
    updatePrefatY : function(nodeArr){
        cc.log("nodeArr is " + nodeArr);
        if(nodeArr.length != 0){
            if(nodeArr[0].y > this.nodeHeight/2){
                this.times++;
                // for(let m = 2;m >=0;m--){
                //     nodeArr[m].y -= (this.nodeWidth/6);
                // }
                
                if(this.times === 1){
                    nodeArr[1].active = true;
                    nodeArr[1].y = this.backGroundArr[0][0].y;
                }else if(this.times === 2){
                    nodeArr[1].active = true;
                    nodeArr[0].active = true;
                    nodeArr[1].y = this.backGroundArr[1][0].y;
                    nodeArr[0].y = this.backGroundArr[0][0].y;
                }
            }else{
                   if(this.CheckIsDown(this.nodeArr)){
                    //    this.down(this.nodeArr);
                    cc.log("this.down is " + this.down);
                    this.down(this.nodeArr);
                   }else{
                        // //关闭所有计时器
                        this.unscheduleAllCallbacks();
                        this.updateMap(this.nodeArr);
                        //固定完之后重新生成随机预制体节点
                        this.nodeArr = this.nextBlock;
                        this.times = 0;
                        cc.log("----->this.nodeArr is "+this.nodeArr);
                        this.downFunction(this.nodeArr,1);
                        //生成下一个形状
                        this.createNext();
                        // //显示下一个形状
                   }
            }
        }
    },
    /**
        检测是否可以向下移动
        返回true或者false
        @return true  : 可以下落
        @return false : 不可以下落
    **/
    CheckIsDown : function(nodeArr){
        if(nodeArr.length != 0){
            
            var row = this.getRow(nodeArr[1]);
            var col = this.getColumn(nodeArr[1]);
            cc.log("row'y is " + nodeArr[1].y);
            cc.log("row is " + row);
            cc.log("col is " + col);
            if(row != 11){
                cc.log(this.map[row+1][col]);
                if(this.map[row + 1][col] === 1){
                    //将对应的背景方格的状态改为1
                    return false;
                }else{
                    return true;
                }
            }else{
                return false;
            }
        }
    },
    //方块下落方法
    down : function(nodeArr){
        //位移3个方格
        for(var i = nodeArr.length-1;i >= 0;i--){
            var row = this.getRow(nodeArr[i]);
            var col = this.getColumn(nodeArr[i]);
            //将当前背景节点的node改为null
            // this.backGroundArr[row][col].node = null;
            nodeArr[i].y = this.backGroundArr[row+1][col].y; 
            var crow = this.getRow(nodeArr[i]);
            var ccol = this.getColumn(nodeArr[i]);
            //将背景节点的node改变h
            // this.backGroundArr[crow][ccol].node = nodeArr[i];
        }
    },
     //左移方法
    moveLeft    : function(){
        if(this.CheckIsLeft()){
            for(var i = 0;i < this.nodeArr.length;i++){
                this.leftMove(this.nodeArr[i]);
                cc.log(this.getColumn(this.nodeArr[i]));
            }
        }    
    },
    CheckIsLeft : function(){
        //如果两个形状还没有完全落下来不能左移右移
        if(this.nodeArr[0].y > this.nodeHeight/2){
                return false;
        }
        var xArr = [];
        var rowArr = [];
        var colArr = [];
        for(let i = 0;i< this.nodeArr.length;i++){
            xArr.push(this.nodeArr[i].x);
            rowArr.push(this.getRow(this.nodeArr[i]));
            colArr.push(this.getColumn(this.nodeArr[i]));
        }
        var minX = Math.min.apply(Math,xArr);
        cc.log("minX is " + minX);
        //找到最小列
        var col = this.chooseColumnByLocation(minX);
        if(xArr.length > 0){
            if(xArr[0] === xArr[xArr.length-1]){
                if(col === 0){
                    return false;
                }
                //说明是同一列
                //找出x坐标最小的左边看看它的坐标地图状态值是多少
                if(this.map[rowArr[0]][col-1] === 0 && this.map[rowArr[1]][col-1] === 0){
                    return true;
                }else{
                    return false;
                }

            }else{
               //同一行
               if(this.map[rowArr[0]][col-1] === 0){
                   return true;
               }else{
                   return false;
               }

            }
        }
    },
    leftMove : function(node){
        var row = this.getRow(node);
        var col = this.getColumn(node);
        //将当前背景节点的node改为null
        // this.backGroundArr[row][col].node = null;
        node.x = this.backGroundArr[row][col-1].x;
    },
    //右移方法
    moveRight   : function(){
        if(this.CheckIsRight()){
            for(var i = 0;i < this.nodeArr.length;i++){
                this.rightMove(this.nodeArr[i]);
            }
        }
    },
    CheckIsRight : function(){
        //如果两个形状还没有完全落下来不能左移右移
        if(this.nodeArr[0].y > this.nodeHeight/2){
                return false;
        }
        var xArr = [];
        var rowArr = [];
        var colArr = [];
        for(let i = 0;i< this.nodeArr.length;i++){
            xArr.push(this.nodeArr[i].x);
            rowArr.push(this.getRow(this.nodeArr[i]));
            colArr.push(this.getColumn(this.nodeArr[i]));
        }
        var maxX = Math.max.apply(Math,xArr);
        cc.log("maxX is " + maxX);
        //找到最大列
        var col = this.chooseColumnByLocation(maxX);
        if(xArr.length > 0){
            if(xArr[0] === xArr[xArr.length-1]){
                if(col === 5){
                    return false;
                }
                //说明是同一列
                //找出x坐标最小的左边看看它的坐标地图状态值是多少
                if(this.map[rowArr[0]][col+1] === 0 && this.map[rowArr[1]][col+1] === 0){
                    return true;
                }else{
                    return false;
                }
            }else{
               //同一行
               if(this.map[rowArr[0]][col+1] === 0){
                   //如果最大行右边的背景方格的状态是0的话就可以移动
                   return true;
               }else{
                   return false;
               }

            }
        }
    },
    rightMove : function(node){
        var row = this.getRow(node);
        var col = this.getColumn(node);
        //将当前背景节点的node改为null
        node.x = this.backGroundArr[row][col+1].x;
       
    },
    quickDown : function(data){
        this.downType = data;
    },
    //更新地图信息(模型信息)
    updateMap : function(nodeArr){
        if(nodeArr.length > 0){
            for(let i = 0;i<nodeArr.length;i++){
                //当前停止的节点对应的地图位置
                var row = this.getRow(nodeArr[i]);
                var col = this.getColumn(nodeArr[i]);
                this.map[row][col] = 1;
            }
        }
    },
    setPrefabPosition : function(prefab,x,y,parentNode){
        var prefab = game3.prototype.createPrefab(prefab);
        prefab.setPosition(x,y);
        parentNode.addChild(prefab);
        return prefab;

    },
    start () {

    },
     //查看当前的棍处于哪一列
    getColumn : function(node){
            //竖行的条
            var indexGrid = this.chooseColumnByLocation(node.x); 
            //放回列号
            return indexGrid;
    },
    //根据坐标选择位于哪个列
    chooseColumnByLocation : function(x){
        switch(x){
            case this.backGroundArr[0][0].x:
                return 0;
            case this.backGroundArr[0][1].x:
                return 1;
            case this.backGroundArr[0][2].x: 
                return 2;
            case this.backGroundArr[0][3].x: 
                return 3;
            case this.backGroundArr[0][4].x:
                return 4;
            case this.backGroundArr[0][5].x:
                return 5;                 
        }
    },
    //根据坐标获得位于哪一行
    getRow : function(node){
        var yIndexResult;
        cc.log("node is " + node);
        yIndexResult = this.chooseRawByLocation(node.y);
        return yIndexResult;
    },
    /***
        根据y坐标数值得到对应的行
        返回对应的行数
        @param : y 传入方法中的y坐标
        @return 返回坐标对应的行号
    * */
    chooseRawByLocation : function(y){
        switch(y){
            case this.backGroundArr[11][0].y:
                return 11;
            case this.backGroundArr[10][0].y:
                return 10;
            case this.backGroundArr[9][0].y: 
                return 9;
            case this.backGroundArr[8][0].y: 
                return 8;
            case this.backGroundArr[7][0].y:
                return 7;
            case this.backGroundArr[6][0].y:
                return 6;
            case this.backGroundArr[5][0].y:
                return 5;
            case this.backGroundArr[4][0].y:
                return 4;
            case this.backGroundArr[3][0].y: 
                return 3;
            case this.backGroundArr[2][0].y: 
                return 2;
            case this.backGroundArr[1][0].y:
                return 1;
            case this.backGroundArr[0][0].y:
                return 0;    
        }
    },
    update (dt) {
        switch(this.iState){
            case 0:
                cc.log("开始游戏前");
                break;
            case 1:
                //开始游戏
                cc.log("开始游戏");
                // this.downByType(this.downType,this.costTime,this.nodeArr);
                break;
            case 2:
                //消除操作
                 break;
            case 3:
                 break;     
        }
        for(let colN = 0;colN < 6;colN++){
            //如果有一列的背景状态为1就停止游戏
            if(this.backGroundArr[0][colN].isFilled === 1){
                // //取消所有计时器
                // this.unscheduleAllCallbacks();
                //使界面变为不可操作状态
                this.gameOver = true;
                // alert("游戏结束");
                this.over.active = true;
            }
        }
    },
});
