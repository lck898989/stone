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
    },
    //初始化游戏场景
    init : function(){
        //获得该节点的宽和高
        this.nodeHeight = this.node.height;
        this.nodeWidth = this.node.width;
        this.createMap();
        // game3.prototype.createShape(this.node,2,2,"Image");
        this.createShape(this.node,2,2,"Image");
    },
    createMap : function(){
        //初始化y坐标
        var y = this.nodeHeight/2 - this.gridSize/2;
        //初始化x坐标
        var x = -this.nodeWidth/2 + this.gridSize/2;
        cc.log("x is " + x);
        this.backGroundArr = [];
        this.map = [];
        //12行6列的网格
        for(var i = 0;i < this.row; i++){
            //设置它的y坐标
            var tempY =y - i * this.gridSize;
            cc.log("tempY is " + tempY);
            this.backGroundArr[i] = [];
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
            prefabNode.active = false;

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
            return game3.prototype.getColumn(node);
    },
    //根据坐标选择位于哪个列
    chooseColumnByLocation : function(x){
         return game3.prototype.chooseColumnByLocation(x);
    },
    //根据坐标获得位于哪一行
    getRow : function(node){
       return game3.prototype.getRow(node);
    },
    /***
        根据y坐标数值得到对应的行
        返回对应的行数
        @param : y 传入方法中的y坐标
        @return 返回坐标对应的行号
    * */
    chooseRawByLocation : function(y){
        return game3.chooseRawByLocation(y);
    },
    update (dt) {
        for(let colN = 0;colN < 6;colN++){
                //如果有一列的背景状态为1就停止游戏
                if(this.backGroundArr[0][colN].isFilled === 1){
                    //取消所有计时器
                    this.unscheduleAllCallbacks();
                    //使界面变为不可操作状态
                    this.gameOver = true;
                    // alert("游戏结束");
                    this.over.active = true;
                }
        }
    },
});
