let ANIMATION_VELOCITY = 10;
let ANIMATION_HEIGHT = 3;
let BOT_VS_BOT = 3;
let HUMAN_VS_HUMAN = 1;
let HUMAN_VS_BOT = 2;
let FILM = 4;
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
  //let aux = this;
  //window.setInterval(function(){aux.gameCycle();},1000);
  //this.game.gameCycle();
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
      this.move.push({x:this.pieceToMove.position.x,y:this.pieceToMove.position.y});
      this.move.push({x:obj.position.x,y:obj.position.y});
      this.tileToMove = obj;
      getPrologRequest(this,'jogadaValida(' + this.showBoard() + '-' + this.player + '-' + this.showMove() + ')', onSuccess);
    } else {
      switch (obj.nodeID) {
        case 'type':{
          obj.textureID = 'coroa';
          switch (this.type) {
            case HUMAN_VS_HUMAN:{
              this.type = HUMAN_VS_BOT;
              this.gameCycle();
              break;
            }
            case HUMAN_VS_BOT:{
              this.type = BOT_VS_BOT;
              this.gameCycle();
              break;
            }
            case BOT_VS_BOT:{
              this.type = HUMAN_VS_HUMAN;
              this.gameCycle();
              break;
            }
            default:
              console.error("No valid type");
          }
          break;
        }
        case 'film':{
          obj.textureID = 'coroa';
          this.type = FILM;
          this.playFilm();
          break;
        }
        case 'level':{
          if(this.level == 1) {
            this.level = 2;
            obj.materialID = 'red';
          } else if (this.level == 2) {
            this.level = 1;
            obj.materialID = 'green';
          }
          break;
        }
        case 'undo':{
          this.undoPlay();
          break;
        }
        default:
        console.error('Objecto sem funcionalidade neste momento.');//TODO
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
      console.warn('Invalid response from server! '+ data.target.response);
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
  let aux = this;
  window.setTimeout(function(){aux.gameCycle();},this.scene.graph.animations[this.showMove()].time);
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

  this.film.push(this.move.slice());
  this.move = [];
  //console.log(this.film);
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
      this.findPieceByPosition({x: 1, y: (i+1)}).king = true;
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
MyGame.prototype.findTileByPosition = function (position) {
  for (let i = 0; i < this.tiles.length; i++){
    let obj = this.scene.graph.nodes[this.tiles[i]];
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
      console.warn('Invalid response from server! '+ data.target.response);
  }
};
MyGame.prototype.playFilm = function () {
  this.scene.graph.nodes[this.scene.graph.idRoot].resetPositions();
  this.board =  [[1,1,1,1,1,1,1,1],[0,1,1,1,1,1,1,0],[0,0,1,1,1,1,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,2,2,2,2,0,0],[0,2,2,2,2,2,2,0],[2,2,2,2,2,2,2,2]];
  this.player = 1;
  let aux = this;
  let auxFilm = this.film.slice();
  for (let i = 0; i < this.film.length; i++){
    window.setTimeout(function(){playFilm_part2(aux,i);},1000*i);
  }
  window.setTimeout(function(){aux.film = auxFilm; aux.type=BOT_VS_BOT;/*TODO ten de ser dinamico*/},1000*this.film.length);
};
MyGame.prototype.undoPlay = function () {
     console.log(this.film[this.film.length - 1]);
     /*this.board[][]=0;
     this.board[][]=this.player;
     this.findPieceByPosition();*/
};
playFilm_part2 = function (mySelf, i) {
  //console.log(mySelf);
  mySelf.move = mySelf.film[i];
  mySelf.pieceToMove = mySelf.findPieceByPosition({x:mySelf.move[0].x, y:mySelf.move[0].y});
  mySelf.tileToMove = mySelf.findTileByPosition({x:mySelf.move[1].x, y:mySelf.move[1].y});
  getPrologRequest(mySelf,'jogadaValida(' + mySelf.showBoard() + '-' + mySelf.player + '-' + mySelf.showMove() + ')', onSuccess);
}
MyGame.prototype.gameCycle = function () {
  switch (this.type) {
    case HUMAN_VS_HUMAN:{
      console.log('TOUUUUUUUU');
      break;
    }
    case BOT_VS_BOT:{
      getPrologRequest(this,'nextMove('+this.showBoard()+'-'+this.player+'-'+this.level+')', PCplay);
      break;
    }
    case HUMAN_VS_BOT:{
      if(this.player == 2){
        getPrologRequest(this,'nextMove('+this.showBoard()+'-'+this.player+'-'+this.level+')', PCplay);
      }
      break;
    }
    case FILM:{

      break;
    }
    default:
      console.error('Chegao ao inchegavel');
  }
};
function PCplay(data){
  console.log(data.target.response);
  let a = data.target.response;
  a = a.replace(/[[\]]/g, '');
  console.log(a);
  let aa = a.split(',');
  this.asker.move = [{x:aa[0][0],y:aa[0][2]},{x:aa[1][0],y:aa[1][2]}];
  this.asker.pieceToMove = this.asker.findPieceByPosition(this.asker.move[0]);
  this.asker.tileToMove = this.asker.findTileByPosition({x:this.asker.move[1].x, y:this.asker.move[1].y});
  getPrologRequest(this.asker,'jogadaValida(' + this.asker.showBoard() + '-' + this.asker.player + '-' + this.asker.showMove() + ')', onSuccess);
}
