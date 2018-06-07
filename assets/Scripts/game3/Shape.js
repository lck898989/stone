// // Learn cc.Class:
// //  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
// //  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// // Learn Attribute:
// //  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
// //  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// // Learn life-cycle callbacks:
// //  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
// //  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

// cc.Class({
//     extends: cc.Component,

//     properties: {
//         // foo: {
//         //     // ATTRIBUTES:
//         //     default: null,        // The default value will be used only when the component attaching
//         //                           // to a node for the first time
//         //     type: cc.SpriteFrame, // optional, default is typeof default
//         //     serializable: true,   // optional, default is true
//         // },
//         // bar: {
//         //     get () {
//         //         return this._bar;
//         //     },
//         //     set (value) {
//         //         this._bar = value;
//         //     }
//         // },
//     },

//     // LIFE-CYCLE CALLBACKS:

//     // onLoad () {},

//     start () {

//     },

//     // update (dt) {},
// });
//创建一个形体类
function Shape(prefabNode,type){
    //预制体节点
    this.prefabNode = prefabNode;
    //是否允许变换
    this.allowRotate = true;
    //这个形状的类型
    this.type = type;
    this.x = this.prefabNode.x;
    this.y = this.prefabNode.y;
    this.waitRemove = false;
}
//是否填充完方格
Shape.prototype.isFilled = function(){

}
Shape.prototype.setAllowRotate = function(allowRotate){
    this.allowRotate = allowRotate;
}
module.exports = Shape;