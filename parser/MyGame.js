'use strict';
let ANIMATION_VELOCITY = 10;
let ANIMATION_HEIGHT = 3;
let BOT_VS_BOT = 3;
let HUMAN_VS_HUMAN = 1;
let HUMAN_VS_BOT = 2;
let FILM = 4;
function MyGame(scene) {
  this.scene = scene;

  this.initInterfaceVariables();
  this.initIndexVariables();
  this.initObjectsVariables();
  this.initPlayInfoVariables();
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
  let auxiliarDate = new Date();
  this.beforeTime = auxiliarDate.getTime();
}

MyGame.prototype.initInterfaceVariables = function () {
    this.level = 0;
    this.type = HUMAN_VS_HUMAN;
    this.isRecording = 1;
    this.film = [];
    this.capturedPieces = [];
}

MyGame.prototype.initIndexVariables = function () {
    this.selectIndex = 0;
    this.player = 1;
}

MyGame.prototype.initObjectsVariables = function () {
    this.board = [[1,1,1,1,1,1,1,1],[0,1,1,1,1,1,1,0],[0,0,1,1,1,1,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,2,2,2,2,0,0],[0,2,2,2,2,2,2,0],[2,2,2,2,2,2,2,2]];
    this.pieceToMove = null;
    this.tileToMove = null;
    this.pieces = [];
    this.tiles = [];
}

MyGame.prototype.initPlayInfoVariables = function () {
    this.move = [];
    this.animations = [];
    this.captureRequired = false;
    this.nCaptureBy1 = 0;
    this.nCaptureBy2 = 0;
    this.selectNodesList = {};
    this.timeBeforeNextPlay = 18;
    this.maxTime = 18;
    this.timeAux = 18;
}
MyGame.prototype.updateGameTime = function (currTime) {
  this.timeAux -= (currTime - this.beforeTime)/1000;
  this.beforeTime = currTime;
  this.timeBeforeNextPlay = Math.floor(this.timeAux);
  if (this.timeBeforeNextPlay < 0){
    console.log('Tiimeout, game lost!');
  } else if (this.scene.graph.nodes['time_panel']) {
    this.scene.graph.nodes['time_panel'].textureID = 'number' + this.timeBeforeNextPlay;
  }
};
MyGame.prototype.logPicking = function (obj) {
  if((this.pieces.indexOf(obj.nodeID) != -1) /*&& (this.captureRequired == false)*/) {//obj is piece
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
        case 'buton_1Vs1':{
          obj.pressed = obj.pressed == 0 ? 1 : 0;
          if(obj.pressed) {
              obj.materialID = 'yellow_buton_on';
          } else {
              obj.materialID = 'yellow_buton_off';
          }
          obj.initialAnimTime = 0;
          this.type = HUMAN_VS_HUMAN;
          this.gameCycle();

          break;
        }

        case 'buton_1VsPC':{
          obj.pressed = obj.pressed == 0 ? 1 : 0;
          if(obj.pressed) {
              obj.materialID = 'yellow_buton_on';
          } else {
              obj.materialID = 'yellow_buton_off';
          }
          obj.initialAnimTime = 0;
          this.type = HUMAN_VS_BOT;
          this.gameCycle();

          break;
        }
        case 'buton_PCVsPC':{
          obj.pressed = obj.pressed == 0 ? 1 : 0;
          if(obj.pressed) {
              obj.materialID = 'yellow_buton_on';
          } else {
              obj.materialID = 'yellow_buton_off';
          }
          obj.initialAnimTime = 0;
          this.type = BOT_VS_BOT;
          this.gameCycle();

          break;
        }
        case 'buton_film':{
          this.verifyNodeAnimation(obj);
          if(this.isRecording == 0) {
              this.isRecording = 1;
              obj.initialAnimTime = 0;
              obj.pressed = 0;
          } else {
              this.isRecording = 0;
              obj.initialAnimTime = 0;
              obj.pressed = 1;
               this.playFilm();
          }
          break;
        }
        case 'buton_level':{
          this.verifyNodeAnimation(obj);

          if(this.level == 0) {
            this.level = 1;
              obj.initialAnimTime = 0;
              obj.pressed = 1;
          } else {
            this.level = 0;
              obj.initialAnimTime = 0;
              obj.pressed = 0;
          }

          break;
        }
        case 'buton_undo':{
          obj.pressed = obj.pressed == 0 ? 1 : 0;
          if(obj.pressed) {
            obj.materialID = 'red_buton_on';
          } else {
            obj.materialID = 'red_buton_off';
          }
          obj.initialAnimTime = 0;
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
      if(auxPlayer == 1) {
        this.nCaptureBy1++;
      } else {
        this.nCaptureBy2++;
      }

      break;
    }
    default:
      console.warn('Invalid response from server! '+ data.target.response);
  }
  this.asker.endGame();
  this.asker.timeAux = this.asker.maxTime;
}
MyGame.prototype.moveOK = function () {
  let move = this.showMove();
  let x = this.pieceToMove.position.x;
  let y = this.pieceToMove.position.y;
  if(this.scene.graph.animations.indexOf(move) == -1){
    //Create animation
    let p1 = [x, 0, y];
    let p2 = [x, ANIMATION_HEIGHT, y];
    let p3 = [this.tileToMove.position.x, ANIMATION_HEIGHT, this.tileToMove.position.y];
    let p4 = [this.tileToMove.position.x, 0, this.tileToMove.position.y];
    let aux_animation = new MyBezierAnimation(this.scene.graph, p1, p2, p3, p4, ANIMATION_VELOCITY);
    this.scene.graph.animations[move] = aux_animation;
    //console.log('Created animation: '+ this.showMove());
  }
  let aux = this;
  window.setTimeout(function(){aux.gameCycle();},aux.scene.graph.animations[move].time);
  this.verifyNodeAnimation(this.pieceToMove);
  this.pieceToMove.animation.push(move);
  //console.log(move);
  this.board[y-1][x-1] = 0;
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
  this.player = (this.player == 1)? 2 : 1;//proximo jogador a jogar
  console.log(this.showBoard());
}
MyGame.prototype.removeCapturePiece = function () {
  let position = {x: 0, y: 0};
  let pieceX = this.pieceToMove.position.x;
  let pieceY = this.pieceToMove.position.y;
  let tileX = this.tileToMove.position.x;
  let tileY = this.tileToMove.position.y;
  if (tileX == pieceX) {
    position.x = tileX;
  } else {
    if (tileX < pieceX) {
      position.x = tileX + 1;
    } else {
      position.x = tileX - 1;
    }
  }
  if (tileY == pieceY) {
    position.y = tileY;
  } else {
    if (tileY < pieceY) {
      position.y = tileY + 1;
    } else {
      position.y = tileY - 1;
    }
  }
  this.board[position.y-1][position.x-1] = 0;

  if(this.scene.graph.animations.indexOf('remove' + position.x + position.y) == -1){
    //Create animation
    this.createCaptureAnimation(position);
  }
  this.capturedPiece = this.findPieceByPosition(position);
  this.verifyNodeAnimation(this.capturedPiece);
  this.capturedPiece.animation.push('remove' + position.x + position.y);
  //this.capturedPieces.push(move: this.film.length, x:this.capturedPiece.position.x,y:this.capturedPiece.position.y,piece:this.capturedPiece);
  this.capturedPieces[this.film.length] = {x:this.capturedPiece.position.x,y:this.capturedPiece.position.y,piece:this.capturedPiece,captureRequired:this.captureRequired};
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
      this.board[this.board.length - 1][i] = 11;
      this.findPieceByPosition({x: (i+1), y: 8}).king = true;
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
function gameOver(data) {
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
  let move = this.film[this.film.length - 1].slice();
  let aux = move[0];
  move[0] = move[1];
  move[1] = aux;
  let piece = this.capturedPieces[this.film.length-1];
  let captureRequired = false;
  if(piece)
    captureRequired = piece.captureRequired;
  if(captureRequired)
    this.player = (this.player == 1)? 2 : 1;
  if(piece)
    this.undoCapturePiece(piece);
  this.move = move;
  this.pieceToMove = this.findPieceByPosition(this.move[0]);
  this.tileToMove = this.findTileByPosition(this.move[1]);
  this.player = (this.player == 1)? 2 : 1;
  this.moveOK();
  if(!captureRequired){
    this.player = (this.player == 1)? 2 : 1;
  }
  this.capturedPieces[this.film.length-2] = null;
  this.film.length = this.film.length - 2;
  if(captureRequired){
    this.pieceToaMove = this.findPieceByPosition(move[1]);
  }
  // piece = this.capturedPieces[this.film.length-1];
  // captureRequired = false;
  // if(piece)
  //   captureRequired = piece.captureRequired;
  this.captureRequired = captureRequired;
};
MyGame.prototype.undoCapturePiece = function (piece) {
    this.board[piece.y-1][piece.x-1] = this.player;

    if(this.scene.graph.animations.indexOf('add' + piece.x + piece.y) == -1){
      //Create animation
      this.createAddPieceAnimation(piece);
    }
    this.verifyNodeAnimation(piece.piece);
    piece.piece.animation.push('add' + piece.x + piece.y);
    piece.piece.position.x = piece.x;
    piece.piece.position.y = piece.y;
}

function playFilm_part2(mySelf, i) {
  mySelf.move = mySelf.film[i];
  mySelf.pieceToMove = mySelf.findPieceByPosition({x:mySelf.move[0].x, y:mySelf.move[0].y});
  mySelf.tileToMove = mySelf.findTileByPosition({x:mySelf.move[1].x, y:mySelf.move[1].y});
  getPrologRequest(mySelf,'jogadaValida(' + mySelf.showBoard() + '-' + mySelf.player + '-' + mySelf.showMove() + ')', onSuccess);
}
MyGame.prototype.gameCycle = function () {
  switch (this.type) {
    case HUMAN_VS_HUMAN:{
      //console.log('TOUUUUUUUU');
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
  // console.log(data.target.response);
  let a = data.target.response;
  a = a.replace(/[[\]]/g, '');
  // console.log(a);
  let aa = a.split(',');
  this.asker.move = [{x:aa[0][0],y:aa[0][2]},{x:aa[1][0],y:aa[1][2]}];
  this.asker.pieceToMove = this.asker.findPieceByPosition(this.asker.move[0]);
  this.asker.tileToMove = this.asker.findTileByPosition({x:this.asker.move[1].x, y:this.asker.move[1].y});
  getPrologRequest(this.asker,'jogadaValida(' + this.asker.showBoard() + '-' + this.asker.player + '-' + this.asker.showMove() + ')', onSuccess);
}

MyGame.prototype.createCaptureAnimation = function (position) {
    let p1 = [position.x, 0, position.y];
    let p2 = [position.x, ANIMATION_HEIGHT, position.y];
    let n;
    if(this.player == 1) {
        n = this.nCaptureBy1;
    } else {
        n = this.nCaptureBy2;
    }

    let p3 = [0, ANIMATION_HEIGHT, 0];
    let p4;
    if(n >= ANIMATION_HEIGHT) {
        p4 = [0, 4 + n*0.5, 0];
    } else {
        p4 = [0, ANIMATION_HEIGHT, 0];
    }
    let aux_animation = new MyBezierAnimation(this.scene.graph, p1, p2, p3, p4, ANIMATION_VELOCITY);
    this.scene.graph.animations['remove' + position.x + position.y] = aux_animation;
    return p4;
    //console.log('Created animation: '+ this.showMove());
}
MyGame.prototype.createAddPieceAnimation = function (position) {
    let p4 = [position.x, 0, position.y];
    let p3 = [position.x, ANIMATION_HEIGHT, position.y];
    let n;
    if(this.player == 1) {
        n = this.nCaptureBy1;
    } else {
        n = this.nCaptureBy2;
    }

    let p2 = [5, ANIMATION_HEIGHT, 5];
    let p1;
    if(n >= ANIMATION_HEIGHT) {
        p1 = [5, 4 + n*0.5, 5];
    } else {
        p1 = [5, ANIMATION_HEIGHT, 5];
    }
    let aux_animation = new MyBezierAnimation(this.scene.graph, p1, p2, p3, p4, ANIMATION_VELOCITY);
    this.scene.graph.animations['add' + position.x + position.y] = aux_animation;
    return p4;
    //console.log('Created animation: '+ this.showMove());
}

MyGame.prototype.verifyNodeAnimation = function (piece) {
    if(this.scene.nodesWithAnimation.indexOf(piece.nodeID) == -1){
        this.scene.nodesWithAnimation.push(piece.nodeID);
    } else {
        piece.initialAnimTime = 0;
    }
}
