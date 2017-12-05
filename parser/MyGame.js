function MyGame(scene) {
  this.scene = scene;
  this.selectIndex = 0;
  this.selectNodesList = {};
  this.pieceToMove = null;
  this.pieces = [];
  this.player = 1;
  this.move = [];
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
      this.move.push(this.pieceToMove.position);
      this.move.push(obj.position);
      getPrologRequest('laigInterface(' + this.showBoard() + '-' + this.player + '-' + this.showMove() + ')');
      if(this.scene.nodesWithAnimation.indexOf(this.pieceToMove.nodeID) == -1)
      this.scene.nodesWithAnimation.push(this.pieceToMove.nodeID);
      this.pieceToMove.animation.push('movePiece');
      this.pieceToMove = null;
      this.move = [];
    }
  }
}
