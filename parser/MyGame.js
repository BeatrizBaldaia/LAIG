let ANIMATION_VELOCITY = 10;
let ANIMATION_HEIGHT = 3;
function MyGame(scene) {
  this.scene = scene;
  this.selectIndex = 0;
  this.selectNodesList = {};
  this.pieceToMove = null;
  this.tileToMove = null;
  this.pieces = [];
  this.tiles = [];
  this.player = 1;
  this.move = [];
  this.animations = [];
  this.captureRequired = false;
  this.level = 1;
  this.type = 1;
  this.film = [];
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
  if((this.pieces.indexOf(obj.nodeID) != -1) && (this.captureRequired == false)) {//obj is piece
    this.pieceToMove = obj; //Escolher a peça
  } else {
    if((this.pieces.indexOf(obj.nodeID) == -1) && (this.pieceToMove != null) && (this.tiles.indexOf(obj.nodeID) != -1)){
      this.move = [];
      this.move.push(this.pieceToMove.position);
      this.move.push(obj.position);
      this.tileToMove = obj;
      //console.log(this.showBoard());
      getPrologRequest(this,'jogadaValida(' + this.showBoard() + '-' + this.player + '-' + this.showMove() + ')', onSuccess);
    } else {
      switch (obj.nodeID) {
        case 'type':{
          obj.textureID = 'coroa';
          break;
        }
        case 'film':{
          obj.textureID = 'coroa';
          console.log(this);
          this.playFilm();
          break;
        }
        default:
        console.log('NAo sei');//TODO
      }
    }
  }
}
function onSuccess(data) {
  switch (data.target.response) {
    case 'OK':{
      this.asker.moveOK();
      this.asker.promotionToKing();
      break;
    }
    case 'NCapture':{
      this.asker.removeCapturePiece();
      this.asker.moveOK();
      this.asker.promotionToKing();
      this.asker.captureRequired = false;
      break;
    }
    case 'Capture':{
      let auxPiece = this.asker.pieceToMove;
      let auxPlayer = this.asker.player;
      this.asker.removeCapturePiece();
      this.asker.moveOK();
      this.asker.pieceToMove = auxPiece;
      this.asker.player = auxPlayer;
      this.asker.captureRequired = true;
      break;
    }
    default:
      console.log('Invalid response from server! '+ data.target.response);
  }
  this.asker.endGame();
}
MyGame.prototype.moveOK = function () {
  if(this.scene.nodesWithAnimation.indexOf(this.pieceToMove.nodeID) == -1){
    this.scene.nodesWithAnimation.push(this.pieceToMove.nodeID);
  } else {
    this.pieceToMove.initialAnimTime = 0;
  }
  if(this.scene.graph.animations.indexOf(this.showMove()) == -1){
    //Create animation
    let p1 = [this.pieceToMove.position.x, 0, this.pieceToMove.position.y];
    let p2 = [this.pieceToMove.position.x, ANIMATION_HEIGHT, this.pieceToMove.position.y];
    let p3 = [this.tileToMove.position.x, ANIMATION_HEIGHT, this.tileToMove.position.y];
    let p4 = [this.tileToMove.position.x, 0, this.tileToMove.position.y];
    let aux_animation = new MyBezierAnimation(this.scene.graph, p1, p2, p3, p4, ANIMATION_VELOCITY);
    this.scene.graph.animations[this.showMove()] = aux_animation;
    //console.log('Created animation: '+ this.showMove());
  }
  this.pieceToMove.animation.push(this.showMove());
  this.board[this.pieceToMove.position.y-1][this.pieceToMove.position.x-1] = 0;
  if(this.pieceToMove.king){
    this.board[this.tileToMove.position.y-1][this.tileToMove.position.x-1] = (this.player==1)?11:22;
  } else {
    this.board[this.tileToMove.position.y-1][this.tileToMove.position.x-1] = this.player;
  }
  this.pieceToMove.position.x = this.tileToMove.position.x;
  this.pieceToMove.position.y = this.tileToMove.position.y;
  this.pieceToMove = null;
  this.tileToMove = null;

  this.film.push(this.move);
  this.move = [];
  console.log(this.film);
  this.player = (this.player == 1)? 2 : 1;
}
MyGame.prototype.removeCapturePiece = function () {
  let position = {x: 0, y: 0};
  if (this.tileToMove.position.x == this.pieceToMove.position.x) {
    position.x = this.tileToMove.position.x;
  } else {
    if (this.tileToMove.position.x < this.pieceToMove.position.x) {
      position.x = this.tileToMove.position.x + 1;
    } else {
      position.x = this.tileToMove.position.x - 1;
    }
  }
  if (this.tileToMove.position.y == this.pieceToMove.position.y) {
    position.y = this.tileToMove.position.y;
  } else {
    if (this.tileToMove.position.y < this.pieceToMove.position.y) {
      position.y = this.tileToMove.position.y + 1;
    } else {
      position.y = this.tileToMove.position.y - 1;
    }
  }
  this.board[position.y-1][position.x-1] = 0;
  if(this.scene.graph.animations.indexOf('remove' + position.x + position.y) == -1){
    //Create animation
    let p1 = [position.x, 0, position.y];
    let p2 = [position.x, ANIMATION_HEIGHT, position.y];
    let p3 = [0, ANIMATION_HEIGHT, 0];
    let p4 = [0, 0, 0];
    let aux_animation = new MyBezierAnimation(this.scene.graph, p1, p2, p3, p4, ANIMATION_VELOCITY);
    this.scene.graph.animations['remove' + position.x + position.y] = aux_animation;
    //console.log('Created animation: '+ this.showMove());
  }
  this.capturedPiece = this.findPieceByPosition(position);
  if(this.scene.nodesWithAnimation.indexOf(this.capturedPiece.nodeID) == -1){
    this.scene.nodesWithAnimation.push(this.capturedPiece.nodeID);
  } else {
    this.capturedPiece.initialAnimTime = 0;
  }
  this.capturedPiece.animation.push('remove' + position.x + position.y);
  this.capturedPiece.position.x = 0;
  this.capturedPiece.position.y = 0;
  this.capturedPiece = null;
}
MyGame.prototype.promotionToKing = function () {
  for(let i = 0; i < this.board[0].length; i++){
    if(this.board[0][i] == 2){
      this.board[0][i] = 22;
      this.findPieceByPosition({x: (i+1), y: 1}).king = true;
    }
  }
  for(let i = 0; i < this.board[this.board.length - 1].length; i++){
    if (this.board[this.board.length - 1][i] == 1) {
      this.board[0][i] = 11;
      this.findPieceByPosition({x: 8, y: (i+1)}).king = true;
    }
  }
};
MyGame.prototype.findPieceByPosition = function (position) {
  for (let i = 0; i < this.pieces.length; i++){
    let obj = this.scene.graph.nodes[this.pieces[i]];
    if ((obj.position.x == position.x) && (obj.position.y == position.y)) {
      return obj;
    }
  }
  return null;
};
MyGame.prototype.endGame = function () {
  getPrologRequest(this,'endofGame('+this.showBoard() + '-' + this.player+')', gameOver);
};
gameOver = function (data) {
  switch (data.target.response) {
    case 'Continue':{
      console.log('Game is still going!');
      break;
    }
    case 'End':{
      console.log('Game has ended');
      break;
    }
    default:
      console.log('Invalid response from server! '+ data.target.response);
  }
};
MyGame.prototype.playFilm = function () {
  this.scene.graph.nodes[this.scene.graph.idRoot].resetPositions();
  this.board =  [[1,1,1,1,1,1,1,1],[0,1,1,1,1,1,1,0],[0,0,1,1,1,1,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,2,2,2,2,0,0],[0,2,2,2,2,2,2,0],[2,2,2,2,2,2,2,2]];
  for (let i = 0; i < this.film.length; i++){

    //sleep(3);
  }
};
MyGame.prototype.playFilm_part2 = function () {
  this.move = this.film[i];
  this.findPieceByPosition({x:this.move[0].x,y:this.move[0].y});
  getPrologRequest(this,'jogadaValida(' + this.showBoard() + '-' + this.player + '-' + this.showMove() + ')', onSuccess);
}
