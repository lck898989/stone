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
        groundPrefab:{
            default:null,
            type:cc.Prefab
        },
        groundParent:{
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
         //初始化背景子节点
         this.groundChild=[];
         for(var i=0;i<=9;i++)
          {
              this.groundChild[i]=[];
          }
          this.GetGround();
    },
     //生成背景
     GetGround:function(){
        for(var i=0;i<=5;i++)
        {
            for(var j=0;j<=11;j++)
            {
                var groundNode=cc.instantiate(this.groundPrefab);
                groundNode.parent=this.groundParent;
                groundNode.setPosition(cc.p(i*65,j*65));
                this.groundChild[i].push(groundNode);
            }
        }    
    },
    start () {

    },

    // update (dt) {},
});
