let ANIMATION_VELOCITY = 10;
let ANIMATION_HEIGHT = 3;
function MyGame(scene) {
  this.scene = scene;
  this.selectIndex = 0;
  this.selectNodesList = {};
  this.pieceToMove = null;
  this.pieces = [];
  this.player = 1;
  this.move = [];
  this.animations = [];
  this.board = [[1,1,1,1,1,1,1,1],[0,1,1,1,1,1,1,0],[0,0,1,1,1,1,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,2,2,2,2,0,0],[0,2,2,2,2,2,2,0],[2,2,2,2,2,2,2,2]];
  this.showBoard = function() {
    let s = "[";
    for (let i = 0; i < this.board.length; i++) {
      s += '[';
      for (let j = 0; j < this.board[i].length; j++) {
        s += this.board[i][j]+',';
      }
      s = s.slice(0, -1) + ']';
      s += ',';
    }
    s = s.slice(0, -1) + ']';
    return s;
  }
  this.showMove = function() {
      let s = "[";
      for (let i = 0; i < this.move.length; i++){
        s += this.move[i].x + '-' + this.move[i].y + ',';
      }
      s = s.slice(0, -1) + ']';
      return s;
  }
}
MyGame.prototype.logPicking = function (obj) {
  if(this.pieces.indexOf(obj.nodeID) != -1) {//obj is piece
    this.pieceToMove = obj;
  } else {
    if(this.pieces.indexOf(obj.nodeID) == -1 && this.pieceToMove != null){
      this.move = [];
      this.move.push(this.pieceToMove.position);
      this.move.push(obj.position);
      getPrologRequest('laigInterface(' + this.showBoard() + '-' + this.player + '-' + this.showMove() + ')');
      if(this.scene.nodesWithAnimation.indexOf(this.pieceToMove.nodeID) == -1)
        this.scene.nodesWithAnimation.push(this.pieceToMove.nodeID);
      if(this.scene.graph.animations.indexOf(this.showMove()) == -1){
        //Create animation
        let p1 = [this.pieceToMove.position.x, 0, this.pieceToMove.position.y];
        let p2 = [this.pieceToMove.position.x, ANIMATION_HEIGHT, this.pieceToMove.position.y];
        let p3 = [obj.position.x, ANIMATION_HEIGHT, obj.position.y];
        let p4 = [obj.position.x, 0, obj.position.y];
        let aux_animation = new MyBezierAnimation(this.scene.graph, p1, p2, p3, p4, ANIMATION_VELOCITY);
        this.scene.graph.animations[this.showMove()] = aux_animation;
        console.log('Created animation: '+ this.showMove());
      }
      this.pieceToMove.animation.push(this.showMove());
      this.pieceToMove = null;
      this.move = [];
    }
  }
}
