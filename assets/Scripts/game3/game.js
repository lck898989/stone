var Shape = require("Shape");
cc.Class({
    extends: cc.Component,

    properties: {
        //预制体数组
        prefabArr : {
            default : [],
            type    : [cc.Prefab],
        },
        prefabHeight : 20,
        backPrefab  : {
            default : null,
            type    : cc.Prefab,
        },
        //下一个形状显示区域节点
        nextShape   : {
            default : null,
            type    : cc.Node,
        },
        rivalInfoNode : {
            default : null,
            type    : cc.Node,
        },
        //下落按钮
        downButton  : {
            default : null,
            type    : cc.Node,
        }

    },
    // use this for initialization
    onLoad: function () {
        //消除之后待下落数组的集合
        this.afterMoveNodeArr = [];
        this.myyy=0;
        this.myy = ['3'];
        this.nodeWidth = this.node.width;
        this.nodeHeight = this.node.height;
        this.timeDao = 0;
        cc.log("this.nodeWidth is " + this.nodeWidth + "this.nodeHeight is " + this.nodeHeight);
        //定义消除次数
        this.eliminateCount = 0;
        //定义得分
        this.score = 0;
        //存放方格的颜色数组
        this.boxColorArr = [];
        //背景二位数组
        this.backGroundArr = null;
        //形状集合二维数组,将每次生成的形状添加到二维数组里面
        // this.shapeArr = [];
        //预制体的下落速度
        this.speed = this.prefabHeight;
        //这个预制体是否可以改变状态比如旋转，移动
        this.IsChange = true;
        this.createBack();
        //保存临时的形状
        // this.shapeNode = new Shape(this.node,this.createRandomX(this.createRandom(0,6)),this.nodeHeight/2 - this.prefabHeight/2);
        //存放每次生成的预制体数组即是活动的条
        this.nodeArr =this.createShape(this.node,this.createRandomX(this.createRandom(0,6)),this.nodeHeight/2 - this.prefabHeight/2);
        this.downFunction(this.nodeArr,1);
        //将x的所有可能坐标存到一个数组里面
        this.locationSet = null;
        cc.log("this.nodeArr is " + this.nodeArr);
        
        //创建下一个旋转体
        // this.nextShape = new Shape(this.nextShape,0,0);
        
        //当前条是否还可以改变状态
        this.canChangeStatu = true;
        Array.prototype.contain = function(shape){
            if(shape != undefined){
                for(var i = 0;i<this.length;i++){
                        if(this[i].x === shape.x && this[i].y === shape.y && this[i].getComponent("Stone").type === shape.getComponent("Stone").type){
                            return true;
                        }
                }
            }
        }
            return false;
    },
    
    //产生x坐标为[-250,-150,-50,50,150,250]
    createRandomX : function(randomNumber){
        var XArray = [];
        for(var i = 0;i < 6;i++){
            XArray.push((-this.nodeWidth/2 + this.prefabHeight/2) + i * this.prefabHeight);
        }
        return XArray[randomNumber];
    },
    //产生随机数
    createRandom : function(min,max){
         return Math.floor(Math.random()*(max - min) + min);
    },
    //将四个可能的点位加入到相对应的数组中去
    addPointXOrY : function(locationSet,nodeArr){
       
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
    //初始化游戏场景主背景12行6列的网格
    createBack : function(){
        //初始化y坐标
        var y = this.nodeHeight/2 - this.prefabHeight/2;
        //初始化x坐标
        var x = -this.nodeWidth/2 + this.prefabHeight/2;
        cc.log("x is " + x);
        this.backGroundArr = [];
        //12行6列的网格
        for(var i = 0;i < 12; i++){
            //设置它的y坐标
            var tempY =y - i * this.prefabHeight;
            cc.log("tempY is " + tempY);
            this.backGroundArr[i] = [];
            for(var j = 0; j < 6;j++){
                var outArr = this.backGroundArr[i];
                var tempX = x + j * this.prefabHeight;
                cc.log("tempX is " + tempX);
                //y坐标不变，x坐标要变
                var tempPrefab = this.setPrefabPosition(this.backPrefab,tempX,tempY,this.node);
                // var shape = new Shape(tempPrefab,-1);
                tempPrefab.isFilled = 0;
                // var shape = new Shape(tempPrefab,-1);
                outArr[j]=tempPrefab;

                // outArr[j] = 
            }
        }
        cc.log("backGroundArr is " +this.backGroundArr);
    },
    /**
    @param prefab:将要生成预制节点的预制体
    @param x     :将要生成预制节点的x坐标
    @param y     :将要生成预制节点的y坐标
    @param parentNode : 生成的预制节点的父节点
     */
    setPrefabPosition : function(prefab,x,y,parentNode){
           var prefab = this.createPrefab(prefab);
           prefab.setPosition(x,y);
           parentNode.addChild(prefab);
           return prefab;
    },
    createPrefab : function(prefab){
        var prefabNode = cc.instantiate(prefab);
        return prefabNode;
    },
    //生成形状
    createShape : function(parentNode,x,y){
        cc.log("322222222222222" + (this.node.childrenCount-72));
        //创建类型数组
        this.type0Arr = [];
        this.type1Arr = [];
        this.type2Arr = [];
        this.times = 0;
        //动态生成一个新的节点将生成的预制体节点加入到该父节点上
        // var newNode = new cc.Node();
        // parentNode.addChild(newNode);
        //用来存放预制体的数组
        var randomCol = this.createRandom(0,6);
        var prefabArrTemp = [];
        //盛放颜色代码的数组每次重新生成预制体节点的时候将之前的颜色代码数组置空
        this.boxColorArr = [];
        var y = this.nodeHeight/2 + this.prefabHeight/2+2*this.prefabHeight;
        for(var i = 0;i < 3;i++){
            // var offSet = i * this.prefabHeight;
            // cc.log("offSet is " + offSet);
            // //产生0-3的随机数
            var index = Math.floor(Math.random()*6);
            // //将对应的颜色索引存放到该数组中
            // // this.boxColorArr.push(this.prefabArr[index].color);
            // cc.log("index is " + index);
            // //将对应的预制体取出来转化为节点然后显示
            var prefabNode = this.createPrefab(this.prefabArr[index]);
            // cc.log("x is " + x + " and y is "+ y - offSet);
            //设置预制节点的位置
            prefabNode.setPosition(this.backGroundArr[i][randomCol].x,y-i*this.prefabHeight);
            
            prefabNode.getComponent("Stone").type = index;
            prefabNode.active = false;

            this.backGroundArr[i][randomCol].node = prefabNode;
            cc.log("------type is " + prefabNode.getComponent("Stone").type);
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
    // called every frame
    update: function (dt) {
        // this.timeDao += dt;
        // if(this.timeDao >= 1){
        //     this.timeDao = 0;
        //     this.updatePrefatY(this.nodeArr);
        // }
        //如果当前状态是处于可以改变状态
        // if(this.shapeNode.allowRotate){
        //     this.updatePrefatY(dt);
        // }
        // cc.log("当前行是："+ this.getRow() + " 当前列是：" + this.getColumn());
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
    //计时器回调函数
    // callBack     : function(){
    //     this.updatePrefatY();
    // },
    //更新预制体节点的y坐标
    updatePrefatY : function(nodeArr){
        cc.log("nodeArr is " + nodeArr);
        if(nodeArr.length != 0){
            if(nodeArr[0].y > this.nodeHeight/2){
                this.times++;
                // for(let m = 2;m >=0;m--){
                //     nodeArr[m].y -= (this.nodeWidth/6);
                // }
                for(let colN = 0;colN < 6;colN++){
                    if(this.backGroundArr[0][colN].isFilled === 1){
                        //取消所有计时器
                        this.unscheduleAllCallbacks();
                        //使界面变为不可操作状态
                        // alert("游戏结束");
                    }
                }
                for(let m = 0;m<3;m++){
                    nodeArr[m].active = false;
                }
                if(this.times === 1){
                    nodeArr[2].active = true;
                    nodeArr[2].y = this.backGroundArr[0][0].y;
                    // if(this.backGroundArr[0][this.getColumn(nodeArr[2].x)].isFilled != 1){
                    // }else{
                    //     nodeArr[2].active = false;
                    //     //游戏结束
                    //     alert("游戏结束");
                    //     //停止所有计时器
                    //     this.unscheduleAllCallbacks();
                    // }
                    
                }else if(this.times === 2){
                    nodeArr[2].active = true;
                    nodeArr[1].active = true;
                    nodeArr[2].y = this.backGroundArr[1][0].y;
                    nodeArr[1].y = this.backGroundArr[0][0].y;
                    // if(this.backGroundArr[0][this.getColumn(nodeArr[1].x)].isFilled != 1){
                    // }else{
                    //     nodeArr[2].active = false;
                    //     nodeArr[1].active = false;
                    //     this.unscheduleAllCallbacks();
                    // }
                    
                }else if(this.times === 3){
                    nodeArr[2].active = true;
                    nodeArr[1].active = true;
                    nodeArr[0].active = true;
                    nodeArr[2].y = this.backGroundArr[2][0].y;
                    nodeArr[1].y = this.backGroundArr[1][0].y;
                    nodeArr[0].y = this.backGroundArr[0][0].y;
                    // if(this.backGroundArr[0][this.getColumn(nodeArr[0].x)].isFilled != 1){
                    // }else{
                    //     nodeArr[2].active = false;
                    //     nodeArr[1].active = false;
                    //     nodeArr[0].active = false;
                    //     this.unscheduleAllCallbacks();
                    // }
                    
                }
            }else{
                //如果允许下落的话条的y坐标向下移动
                if(this.CheckIsDown(nodeArr)){
                        //下落节点数组
                        this.down(nodeArr);
                    //判断方格是否可以消除
                    //位移3个方格
                    
                }else{
                    //如果不能下落的话改变背景方格状态(背景方格更新完成之后进行再次生成节点数组)
                    this.changeBackBlockStatus(nodeArr);
                    //固定完之后重新生成随机预制体节点
                    this.nodeArr = this.generateNext(this.node,this.createRandomX(this.createRandom(0,6)),this.nodeHeight/2 - this.prefabHeight);
                    //开启计时器
                    this.downFunction(this.nodeArr,1);
                    //如果是不能下落的话就是前一个条形已经固定下来了，固定下来之前已经生成了下一个的形状
                    // for(var j = 0;j<3;j++){
                    //     nodeArr[j].prefabNode.y -= this.speed;
                    // }
                    
                }
            }
            // cc.log("-------->>>>>>>" + nodeArr[0].prefabNode.y);
            
        }
    },
    //方块下落方法
    down : function(nodeArr){
        //位移3个方格
        for(var i = nodeArr.length-1;i >= 0;i--){
            var row = this.getRow(nodeArr[i]);
            var col = this.getColumn(nodeArr[i]);
            //将当前背景节点的node改为null
            this.backGroundArr[row][col].node = null;
            nodeArr[i].y = this.backGroundArr[row+1][col].y;
            var crow = this.getRow(nodeArr[i]);
            var ccol = this.getColumn(nodeArr[i]);
            //将背景节点的node改变
            this.backGroundArr[crow][ccol].node = nodeArr[i];
        }
    },
    //判断下落方块中的颜色个数
    getColorCount : function(){
        var difColorCount = 0;
        for(var i = 0;i<3;i++){
            if(i != 2){
                if(this.boxColorArr[i] != this.boxColorArr[i+1]){
                    difColorCount++;
                }
            }else{
                if(this.boxColorArr[2] != this.boxColorArr[0]){
                    difColorCount++;
                }
            }
        }
        cc.log("*******************" + difColorCount);
        return difColorCount;
    },
    /*创建一个二维数组的方法
     *@param rows : 二维数组的行数
      @param cols : 二维数组的列数
     *@param initial : 二维数组的初始值
    */
    createMatrix : function(rows,cols,initial){
        var arr = [];
        for(var i = 0;i < rows;i++){
            var columns = [];
            for(var j = 0;j<cols;j++){
                columns[j] = initial;
            }
            arr[i] = columns;
        }
        return arr;
    },
    /**
        1：旋转的时候判断旋转的坐标对应的背景方格的状态是否为1
        2：当竖条出现在最左边的时候改变旋转中心为最上面的预制体节点
        3：当竖条出现在最右边的时候改变旋转中心为最下面的预制节点
    **/
    rotate       : function(){
        //判断周围的网格状态是否为true
        /**
         * 
         * 旋转之后方块的颜色变换，第一个变成第二个，第二个变成第三个，第三个变成第一个
         * 
         * ** */
        // cc.log(this.boxColorArr);
        var before0Name = this.nodeArr[0].name;
        var before0Type = this.nodeArr[0].getComponent("Stone").type;
        var before0Frame = this.nodeArr[0].getComponent("cc.Sprite").spriteFrame;
        // cc.log("before0 is " + before0);
        var before1Name = this.nodeArr[1].name;
        var before1Type = this.nodeArr[1].getComponent("Stone").type;
        var before1Frame = this.nodeArr[1].getComponent("cc.Sprite").spriteFrame;
        // cc.log("before1 is " + before1);
        var before2Name = this.nodeArr[2].name;
        var before2Type = this.nodeArr[2].getComponent("Stone").type;
        var before2Frame = this.nodeArr[2].getComponent("cc.Sprite").spriteFrame;
        // cc.log("before2 is " + before2);
        //分别改变颜色
        this.nodeArr[0].name = before2Name;
        this.nodeArr[0].getComponent("Stone").type = before2Type;
        this.nodeArr[0].getComponent("cc.Sprite").spriteFrame = before2Frame;
        this.nodeArr[1].name = before0Name;
        this.nodeArr[1].getComponent("Stone").type = before0Type;
        this.nodeArr[1].getComponent("cc.Sprite").spriteFrame = before0Frame;
        this.nodeArr[2].name = before1Name;
        this.nodeArr[2].getComponent("Stone").type = before1Type;
        this.nodeArr[2].getComponent("cc.Sprite").spriteFrame = before1Frame;
    },
    //左移方法
    moveLeft    : function(){
        for(var i = 0;i < this.nodeArr.length;i++){
            if(this.CheckIsLeft()){
                this.leftMove(this.nodeArr);
                if((this.nodeArr[i].x <= -this.nodeWidth/2 + this.prefabHeight/2)){
                    this.nodeArr[i].x = -this.nodeWidth/2 + this.prefabHeight/2;
                }
            }
        }
    },
    leftMove : function(nodeArr){
        for(var i = nodeArr.length-1;i >= 0;i--){
            var row = this.getRow(nodeArr[i]);
            var col = this.getColumn(nodeArr[i]);
            //将当前背景节点的node改为null
            this.backGroundArr[row][col].node = null;
            nodeArr[i].x = this.backGroundArr[row][col-1].x;
            var crow = this.getRow(nodeArr[i]);
            var ccol = this.getColumn(nodeArr[i]);
            //将背景节点的node改变
            this.backGroundArr[crow][ccol].node = nodeArr[i];
        }
    },
    //右移方法
    moveRight   : function(){
        for(var i = 0;i < this.nodeArr.length;i++){
            if(this.CheckIsRight()){
               this.rightMove(this.nodeArr);
                if((this.nodeArr[i].prefabNode.x >= this.nodeWidth/2 - this.prefabHeight/2)){
                    this.nodeArr[i].prefabNode.x = this.nodeWidth/2 - this.prefabHeight/2;
                }
            }
        }
    },
    rightMove : function(nodeArr){
        for(var i = nodeArr.length-1;i >= 0;i--){
            var row = this.getRow(nodeArr[i]);
            var col = this.getColumn(nodeArr[i]);
            //将当前背景节点的node改为null
            this.backGroundArr[row][col].node = null;
            nodeArr[i].x = this.backGroundArr[row][col+1].x;
            var crow = this.getRow(nodeArr[i]);
            var ccol = this.getColumn(nodeArr[i]);
            //将背景节点的node改变
            this.backGroundArr[crow][ccol].node = nodeArr[i];
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
            //如果是整个方块下落的时候的方法
            // var row = [];
            // for(var i = 0;i<nodeArr.length;i++){
            //     row[i] = this.getRow(nodeArr[i].prefabNode);
            // }
            // var col = this.getColumn(nodeArr[nodeArr.length - 1].prefabNode);
            var row = this.getRow(nodeArr[2]);
            var col = this.getColumn(nodeArr[2]);
            //获取最后一个
            //每下降一个格检测一次
            //遍历3格预制体方格看是否可以下落
            //如果是横着的条就检测下面三个背景方格的属性isFilled是不是为1如果为1的话不允许下落
                //判断最大行下面方格的状态是否为1
                // cc.log("array of row is " + row);
                // var rowN = row[nodeArr.length - 1];
                // var colN = col;
                //如果最大的行号是11的话不用再这里判断这样的情况是触底的情况
                if(row != 11){
                    if(this.backGroundArr[row + 1][col].isFilled === 1){
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
    /**
       检测是否可以向左移动
    **/
   CheckIsLeft : function(){
        var row = [];
        for(var i = 0;i<3;i++){
            row[i] = this.getRow(this.nodeArr[i]);
        }
        var col = this.getColumn(this.nodeArr[2]);
        //每下降一个格检测一次
        //如果列的个数为1的话
        for(var m = 0;m<row.length;m++){
            //获得行数
            var mr = row[m];
            //只要一个方格的左边的背景方格的状态为1的话就停止移动
            if(this.backGroundArr[mr][col - 1].isFilled === 1){
                //一个方格的左边背景方格的状态是1的话就说明不可以向左边移动
                return false;
            }
        }
        return true;
    },
    //检测是否可以向右移动
    CheckIsRight : function(){
        var row = [];
        for(var i = 0;i<3;i++){
            row[i] = this.getRow(this.nodeArr[i]);
        }
        var col = this.getColumn(this.nodeArr[2]);
        //每下降一个格检测一次
        //如果列的个数为1的话说明是竖条的形状
        for(var m = 0;m<row.length;m++){
            //获得行数
            var mr = row[m];
            //只要一个方格的左边的背景方格的状态为1的话就停止移动
            if(this.backGroundArr[mr][col + 1].isFilled === 1){
                //一个方格的左边背景方格的状态是1的话就说明不可以向左边移动
                return false;
            }
        }
        return true;
    },
    //快速下落
    quickDown : function(){
         //停止正常下落的计时器
         this.unscheduleAllCallbacks();
         //开始快速下落的计时器
         this.downFunction(this.nodeArr,0.02);
        //  for(var i = 2;i >= 0;i--){
        //      this.checkDownHasBlock(this.nodeArr[i].prefabNode);
        //  }
    },
    //改变背景方格的状态
    changeBackBlockStatus : function(nodeArr){
        if(nodeArr.length != 0){
            this.willDeleteArr = [];
            //定义访问removeAndDown方法的次数
            this.visitRemoveAndDownFunctionCount = 0;
            this.hasBlockUpNode = false;
            var row = [];
            for(var i = 0;i<nodeArr.length;i++){
                row[i] = this.getRow(nodeArr[i]);
            }
            var col = this.getColumn(nodeArr[nodeArr.length - 1]);
            for(var n=0;n<row.length;n++){
                //设置对应格的数据为1
                this.backGroundArr[row[n]][col].isFilled = 1;
                //将背景方格的颜色属性改为下落方格的颜色
                // this.backGroundArr[row[n]][col].prefabNode.color = nodeArr[n].prefabNode.color;
                //设置类型值
                this.backGroundArr[row[n]][col].type = nodeArr[n].getComponent("Stone").type;
            }
            //待移动队列
            this.willMoveNodes = [];
            //该竖条对应的待消队列里面存放的是预制节点
            var willDeleteNodes = [];
            for(var m = 0;m<row.length;m++){
                this.addWillDeleteArr(nodeArr[m],willDeleteNodes);
            }
            //待消队列都找出来了进行消除下落
            if(willDeleteNodes.length >= 3){
                //找到了待消队列
                cc.log("找到了3个以上的待消队列");
                //
            }
        } 
        this.unscheduleAllCallbacks();
    },
    addWillDeleteArr(node,willDeleteArr){
        //用于存放该节点类型数组,存放个数>=3个的节点
        var typeArr = [];
        // for(var count = 0;count < 4;count++){
        //     colorBlockTypeArr[count] = [];
        // }
        // //定义一个存放135度和-45度方向需要消除的队列
        // var slant0Arr = colorBlockTypeArr[0];
        // //定义存放45度和-135度方向需要消除的队列
        // var slant1Arr = colorBlockTypeArr[1];
        // //定义存放0度和270度方向需要消除的队列
        // var slant2Arr = colorBlockTypeArr[2];
        // //定义存放90度和180度方向需要消除的队列
        // var slant3Arr = colorBlockTypeArr[3];
        // var color = node.prefabNode.color;
        //获得宝石的类型
        var type = node.getComponent("Stone").type;
        //获得当前方格节点所在的行
        var row = this.getRow(node);
        //获得当前节点所在的列
        var col = this.getColumn(node);
        for(var i = 0;i<4;i++){
            //135度和-45度两个方向寻找
            if(i === 0){
               this.directorFind(typeArr,row,col,i,type,node);
            }else if(i === 1){
             //45度和-135度方向寻找
              this.directorFind(typeArr,row,col,i,type,node);
            }else if(i === 2){
                this.directorFind(typeArr,row,col,i,type,node);
            }else if(i === 3){
                this.directorFind(typeArr,row,col,i,type,node);
            }
        }
        cc.log("typeArr is " + typeArr);
        if(typeArr.length >= 3){
            for(let t = 0;t<typeArr.length;t++){
                //将待消除的节点添加到待消队列里面去
                if(!willDeleteArr.contain(typeArr[t])){
                    //将该节点push进待消队列
                    willDeleteArr.push(typeArr[t]);
                }
            }
        }
        cc.log("willDeleteArr is " + willDeleteArr);
        //这时候colorBlockTypeArr里面是有东西的或者没东西遍历该数组
        // for(var i = 0;i<4;i++){
        //     var len = colorBlockTypeArr[i].length;
        //     if(len < 3){
        //         continue;
        //     }else{
        //         //有三个或者三个以上类型相同的宝石
        //         //定义一个全局的等待消除的节点数组每次消除完之后将其还原
        //         this.waitRemoveNodeArr = colorBlockTypeArr[i];
        //         //证明是可以消除的
        //         return true;
        //     }
        // }
        // return false;
    },
    //判断如果待消队列在同一列的话判断是否可以退出当前循环
    commonColCanBreak : function(node){
        if(this.isCommonX(this.waitRemoveNodeArr)){
                for(let b = 0;b<this.waitRemoveNodeArr.length;b++){
                    if(node.x === this.waitRemoveNodeArr[b].prefabNode.x &&
                       node.y === this.waitRemoveNodeArr[b].prefabNode.y &&
                       node.waitRemove === true){
                        //如果该节点上的待消标记为true的话退出当前循环
                        return true;   
                    }
                }
            return false;
        }
    },
    findDiffFromRemoveNode : function(nodeArr,moveNodeType,diffArr){
        for(let i = 0;i<nodeArr.length;i++){
            if(nodeArr[i].type != moveNodeType){
                if(!diffArr.contain(nodeArr[i]))
                    diffArr.push(nodeArr[i]);
            }
        }
    },
    
    //消除和下落操作
    removeAndDown : function(waitRemoveNodeArr){
             var x;
            //  var backArr = [];
            //  for(var i = 0;i<waitRemoveNodeArr.length;i++){
            //     var backP = this.backGroundArr[this.getRow(waitRemoveNodeArr[i].prefabNode)][this.getColumn(waitRemoveNodeArr[i].prefabNode)].prefabNode;
            //     backArr.push(backP);
            //  }
             if(arguments.length === 2){
                 //如果参数个数为2的话说明有upNodes
                 for(let m = 0;m<waitRemoveNodeArr.length;m++){
                    x = this.removeNodeFromGameScene(waitRemoveNodeArr[m].prefabNode,arguments[1]);
                }
                //同一列的待消节点上方的待下落节点全都下落完毕检查是否可以连消传入的参数也是一个形状数组
                cc.log("arguments is " + arguments[1]);
                arguments[1].reverse();
                //将之前的this.waitRemoveNodeArr置空
                this.waitRemoveNodeArr = [];
                this.changeBackBlockStatus(arguments[1]);
             }else{
                //删除需要消除的节点,不是同一列的情况下每下落一个待消节点上方的待移动节点检查一遍是否可以重复消除
                for(let m = 0;m<waitRemoveNodeArr.length;m++){
                    //删除一个节点然后接着下落上面的节点
                    x = this.removeNodeFromGameScene(waitRemoveNodeArr[m].prefabNode);
                }
                //将之前的this.waitRemoveNodeArr置空
                this.waitRemoveNodeArr = [];
                for(let i = 0;i<this.afterMoveNodeArr.length;i++){
                    this.changeBackBlockStatus(this.afterMoveNodeArr[i]);
                }
                this.afterMoveNodeArr = [];
             }
            this.type0Arr = [];
            this.type1Arr = [];
            this.type2Arr = [];
    },
    //直接删除从节点树中删除该节点
    directDeletNodeFromGameScene : function(waitRemoveNode){
        for(var child = 72;child < this.node.children.length;child++){
            if(this.node.children[child].x === waitRemoveNode.x && this.node.children[child].y === waitRemoveNode.y){
                 //销毁该节点
                 this.node.children[child].destroy();
                 cc.log("%%%%%%%%%%%%%%%" + this.node.children[child].x);
                 cc.log("%%%%%%%%%%%%%%%" + this.node.children[child].y);
                //  waitRemoveNode.color = cc.Color.WHITE;
                //  waitRemoveNode.opacity = 50;
                 //从节点树的孩子移出该节点防止下次遍历出错
                 //  this.node.children.splice(child,1);
                 var row = this.getRow(waitRemoveNode);
                 var col = this.getColumn(waitRemoveNode);
                 //设置该节点对应的背景方格的属性
                 this.backGroundArr[row][col].prefabNode.isFilled = 0;
                 this.backGroundArr[row][col].type = -1;
                 return true;
            }
        }
        return false;
    },
    //检查待消除的节点数组是否在同一列上
    isCommonX : function(waitRemoveNodeArr,backArr){
        if(arguments.length === 2){
            if(backArr != undefined && backArr.length > 0){
                var commonCount = 0;
                var originX = backArr[0].x;
                for(var i = 1;i<backArr.length;i++){
                    if(backArr[i].x === originX){
                        commonCount++;
                    }
                }
                if(commonCount === backArr.length - 1){
                    return true;
                }else{
                    return false;
                }
            }
        }else{
            if(waitRemoveNodeArr != undefined && waitRemoveNodeArr.length > 0){
                var commonCount = 0;
                var originX = waitRemoveNodeArr[0].prefabNode.x;
                for(var i = 1;i<waitRemoveNodeArr.length;i++){
                    if(waitRemoveNodeArr[i].prefabNode.x === originX){
                        commonCount++;
                    }
                }
                if(commonCount === waitRemoveNodeArr.length - 1){
                    return true;
                }else{
                    return false;
                }
            }
        }
    },
    //获得将要删除的节点上的节点数组
    getWillRemoveUpNode : function(row,col,willDeleteArr){
        var waitMoveNode = [];
        if(arguments.length === 2){
            while(row > 0){
                row--;
                var targetNode = this.findPrefabNodeFromGameScene(row,col);
                if(this.getTypeByColor(targetNode.color) != undefined && !targetNode.isRemove){
                    //将该目标节点添加进数组中去
                    waitMoveNode.push(targetNode);
                }
            }
            return waitMoveNode;
        }else{
            
            // var node = this.findPrefabNodeFromGameScene(row,col);
            // var mx=this.getRow(node);
            // var my=this.getColumn(node);
            // var back = this.backGroundArr[mx][my].prefabNode;
            while(row > 0){
                row--;
                var node = this.findPrefabNodeFromGameScene(row,col); 
                //如果找出来的节点不包含之前需要消除的节点话就加入进来
                cc.log("node is " + node);     
                // var back = this.backGroundArr[mx][my].prefabNode;
                if(node != undefined){
                    //并且这个节点的状态不是待消状态的话就添加到待移动队列
                    if(!node.getComponent("Stone").isRemove){
                        var shape = new Shape(node,this.getTypeByColor(node.color));
                        waitMoveNode.push(shape);
                    }
                }else{
                   break;
                }
                // mx--;
            }
            // this.myy = waitMoveNode;
            return waitMoveNode;
        }
        
    },
     /*根据角度填充各个方向数组
     *@param :removeArr -->待消除队列
     *@param : row ------->当前节点所在的行
     *@param : col ------->当前节点所在的列 
     *@param : direction ------>需要搜索的方向(0表示水平方向的消除，1表示竖直方向，2表示45度方向消除，3表示135度方向消除)
      @param : type   ----->当前需要寻找的宝石的类型
      @param : node   ----->当前需要检查的节点
     */
    directorFind : function(typeArr,row,col,direction,type,node){
        //存放这个方向的临时数组
        var directionArr = [];
        //45度和-135度方向检测
        var leftRow = row;
        var leftCol = col;
        //先把自己push进去(前提是类型相同)
        directionArr.push(node);
        while(leftRow >= 0 || leftRow <= 11 || leftCol >= 0 || leftCol <= 5){
             //行和列都减1
             //0度方向
             if(direction === 0){
                leftCol++;
             }else if(direction === 1){
                 //90度方向
                 leftRow--;
             }else if(direction === 2){
                 //45度方向
                 leftRow--;
                 leftCol++;
             }else if(direction === 3){
                 //135度方向
                 leftCol--;
                 leftRow--;
             }
             //如果寻找的行或者列超出边界
             if(leftRow < 0 || leftRow >11 || leftCol < 0 || leftCol > 5){
                 break;
             }
             if(this.isCommonType(leftRow,leftCol,type)){
                 //将该节点标记为待消状态
                 //如果当前数组里有当前的元素就不加进去了
                 var nextNode = this.findPrefabNodeFromGameScene(leftRow,leftCol,type);
                //  var nextShape = new Shape(this.findPrefabNodeFromGameScene(leftRow,leftCol,type),type);
                 if(!directionArr.contain(nextNode)){
                    //如果找到跟自己颜色一样的话将它放到消除队列里面
                    directionArr.push(nextNode);
                 }
             }else{
                 break;
             }
        }
        leftRow = row;
        leftCol = col;
        while(leftRow >= 0 || leftRow <= 11 || leftCol >=0 || leftCol <= 5){
            if(direction === 1){
                //-90度方向
                leftRow++;
            }else if(direction === 0){
                //180度方向
                leftCol--;
            }else if(direction === 2){
                //-135度方向
                leftRow++;
                leftCol--;
            }else if(direction === 3){
                //-45度方向
                leftCol++;
                leftRow++;
            }
            //如果超出了边界就退出当前循环
            if(leftRow < 0 || leftRow >11 || leftCol < 0 || leftCol > 5){
                break;
            }
            if(this.isCommonType(leftRow,leftCol,type)){
                var nextNode = this.findPrefabNodeFromGameScene(leftRow,leftCol,type);
                //将该节点的待消状态设置为true
                if(!directionArr.contain(nextNode)){
                    //如果找到跟自己颜色一样的话将它放到消除队列里面
                    directionArr.push(nextNode);
                 }
            }else{
                break;
            }
        }
        if(directionArr.length >= 3){
             //加上自己就满足消除条件了
            //  return typeArr;
             for(let j = 0;j<directionArr.length;j++){
                 //将这些节点的待消状态改为true
                 directionArr[j].getComponent("Stone").isRemove = true;
                 //将该形状类加入到相同类型的数组里
                 typeArr.push(directionArr[j]);
             }
        }
    },
    //根据行和列查找到节点树当中的预制节点而不是背景节点,并且类型相同
    findPrefabNodeFromGameScene : function(row,col,type){
        var targetX = this.backGroundArr[row][col].x;
        var targetY = this.backGroundArr[row][col].y;
        if(arguments.length === 3){
            for(var i = 72;i<this.node.children.length;i++){
                //如果孩子节点的坐标等于目标节点的坐标的时候将这个节点返回回去
                if(this.node.children[i].x === targetX && this.node.children[i].y === targetY && this.node.children[i].getComponent("Stone").type === type){
                    return this.node.children[i];
                }
            }
        }else{
            for(var i = 72;i<this.node.children.length;i++){
                //如果孩子节点的坐标等于目标节点的坐标的时候将这个节点返回回去
                if(this.node.children[i].x === targetX && this.node.children[i].y === targetY){
                    return this.node.children[i];
                }
            }
        }
    },
    //从父节点清除符合条件的节点
    removeNodeFromGameScene : function(waitRemoveNode){
        waitRemoveNode.getComponent("Stone").isRemove = true;
        //定义一个数组专门负责记录每下落一次需要消除的节点数组（预制节点数组）
        var deleteShape = new Shape(waitRemoveNode,this.getTypeByColor(waitRemoveNode.color));
        this.willDeleteArr.push(deleteShape);
        //查找待消除节点上方的待下落方块时候看看是否在willDeleteArr里面如果再的话就不找了
        if(arguments.length === 2){
            //如果待消节点是处于同一列的时候让上面的节点下落完毕再进行判断是否可以连消
            //shape类型
             var upNodes = arguments[1];
             cc.log("upNodes is " + upNodes);
             for(var child = 72;child < this.node.children.length;child++){
                if(this.node.children[child].x === waitRemoveNode.x && this.node.children[child].y === waitRemoveNode.y){
                    var row = this.getRow(waitRemoveNode);
                    var col = this.getColumn(waitRemoveNode);
                    cc.log("row is " + row + " col is " + col);
                    this.backGroundArr[row][col].prefabNode.isFilled = 0;
                    this.backGroundArr[row][col].type = -1;
                    cc.log(this.backGroundArr[row][col].prefabNode.isFilled + "******" + this.backGroundArr[row][col].type);
                    //销毁该节点
                     this.node.children[child].destroy();
                     this.node.children[child].x = Math.floor(Math.random()*100000);
                     cc.log("该节点是否可用 : " + this.node.children[child].isValid);
                    //找到上面的格子
                    cc.log("upNodes is " + upNodes.length);
                    if(upNodes.length != 0){
                        //下落格子
                        for(var i = 0;i<upNodes.length;i++){
                            //改变背景方格的状态
                            this.backGroundArr[this.getRow(upNodes[i].prefabNode)][this.getColumn(upNodes[i].prefabNode)].prefabNode.isFilled = 0;
                            this.backGroundArr[this.getRow(upNodes[i].prefabNode)][this.getColumn(upNodes[i].prefabNode)].type = -1;
                            upNodes[i].prefabNode.y -= 100;
                            upNodes[i].y = upNodes[i].prefabNode.y;
                            this.backGroundArr[this.getRow(upNodes[i].prefabNode)][this.getColumn(upNodes[i].prefabNode)].prefabNode.isFilled = 1;
                            this.backGroundArr[this.getRow(upNodes[i].prefabNode)][this.getColumn(upNodes[i].prefabNode)].type = upNodes[i].type;
                        }
                        cc.log("%%%%%%%%%%%%%%%" + this.node.children[child].x);
                        cc.log("%%%%%%%%%%%%%%%" + this.node.children[child].y);
                        //  waitRemoveNode.color = cc.Color.WHITE;
                        //  waitRemoveNode.opacity = 50;
                        //从节点树的孩子移出该节点防止下次遍历出错
                        //  this.node.children.splice(child,1);
                        break;
                    }
                    
                }
            }
        }else{
            for(var child = 72;child < this.node.children.length;child++){
                if(this.node.children[child].x === waitRemoveNode.x && this.node.children[child].y === waitRemoveNode.y){
                    var row = this.getRow(waitRemoveNode);
                    var col = this.getColumn(waitRemoveNode);
                    cc.log("row is " + row + " col is " + col);
                    this.backGroundArr[row][col].prefabNode.isFilled = 0;
                    this.backGroundArr[row][col].type = -1;
                    cc.log(this.backGroundArr[row][col].prefabNode.isFilled + "******" + this.backGroundArr[row][col].type);
                    //销毁该节点
                    this.node.children[child].destroy();
                    this.node.children[child].x = Math.floor(Math.random()*100000);
                    //找到上面的格子
                    var upNodes = this.getWillRemoveUpNode(row,col,this.willDeleteArr);
                    cc.log("upNodes is " + upNodes.length);
                    //下落格子
                    for(var i = 0;i<upNodes.length;i++){
                        //改变背景方格的状态
                        this.backGroundArr[this.getRow(upNodes[i].prefabNode)][this.getColumn(upNodes[i].prefabNode)].prefabNode.isFilled = 0;
                        this.backGroundArr[this.getRow(upNodes[i].prefabNode)][this.getColumn(upNodes[i].prefabNode)].type = -1;
                        upNodes[i].prefabNode.y -= 100;
                        upNodes[i].y = upNodes[i].prefabNode.y;
                        this.backGroundArr[this.getRow(upNodes[i].prefabNode)][this.getColumn(upNodes[i].prefabNode)].prefabNode.isFilled = 1;
                        this.backGroundArr[this.getRow(upNodes[i].prefabNode)][this.getColumn(upNodes[i].prefabNode)].type = upNodes[i].type;
                    }
                     cc.log("%%%%%%%%%%%%%%%" + this.node.children[child].x);
                     cc.log("%%%%%%%%%%%%%%%" + this.node.children[child].y);
                    //  waitRemoveNode.color = cc.Color.WHITE;
                    //  waitRemoveNode.opacity = 50;
                     //从节点树的孩子移出该节点防止下次遍历出错
                     //  this.node.children.splice(child,1);
                     //检查是否可以重复消除如果可以连消的话进行连消
                     this.afterMoveNodeArr.push(upNodes);
                    return upNodes;
                }
            }
        }
        return false;
    },
    //判断类型是否和传进来的类型相同
    isCommonType : function(row,col,type){
          if(this.findPrefabNodeFromGameScene(row,col) === undefined){
              return false;
          }else{
              return this.findPrefabNodeFromGameScene(row,col).getComponent("Stone").type === type ? true : false;
          }
          
    },
   
    getTypeByColor : function(color){
        var colorValue = color.toHEX("#rrggbb").toLocaleUpperCase();
        cc.log("------------>colorValue is " +colorValue);
        switch(colorValue){
            case 'FF0000':
                return 2;
            case '00FF00':
                return 0;
            case '0000FF':
                return 1;        
        }

    },
    
    //生成下一个形状
    generateNext : function(parentNode,x,y){
        return this.createShape(parentNode,x,y);

    },
    //通过列号获得对应的X坐标
    getLocationByCol:function(colNumber){
        switch(colNumber){
            case 0:
                return this.backGroundArr[0][0].x;
            case 1:
                return this.backGroundArr[0][1].x;  
            case 2:
                return this.backGroundArr[0][2].x;
            case 3:
                return this.backGroundArr[0][3].x;   
            case 4:
                return this.backGroundArr[0][4].x;
            case 5:
                return this.backGroundArr[0][5].x;            
        }
    },
    //通过行号获得y坐标
    getLocationByRow:function(rowNumber){
        switch(rowNumber){
            case 0:
                return this.backGroundArr[0][0].y;
            case 1:
                return this.backGroundArr[1][0].y;
            case 2:
                return this.backGroundArr[2][0].y;
            case 3:
                return this.backGroundArr[3][0].y;
            case 4:
                return this.backGroundArr[4][0].y;
            case 5:
                return this.backGroundArr[5][0].y;
            case 6:
                return this.backGroundArr[6][0].y;
            case 7:
                return this.backGroundArr[7][0].y;      
            case 8:
                return this.backGroundArr[8][0].y;
            case 9:
                return this.backGroundArr[9][0].y;
            case 10:
                return this.backGroundArr[10][0].y;
            case 11:
                return this.backGroundArr[11][0].y;       
        }
    },
    //根据方块类型得到对应的类型数组
    getTypeArrByType : function(type){
        switch(type){
            case 0:
                return this.type0Arr;
            case 1:
                return this.type1Arr;
            case 2:
                return this.type2Arr;        
        }
    },
});
