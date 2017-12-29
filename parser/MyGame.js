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
  this.previousTime;
}

MyGame.prototype.initInterfaceVariables = function () {
    this.level = 0;
    this.type = -1;
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
    this.timeBeforeNextPlay = 30;
    this.maxTime = 30;
    this.timeAux = 30;
}
MyGame.prototype.updateGameTime = function (currTime) {
    if(this.type != -1) {
        this.timeAux -= (currTime - this.previousTime)/1000;
        this.previousTime = currTime;
        this.timeBeforeNextPlay = Math.floor(this.timeAux);
        let timeDigit1 = this.scene.graph.nodes['time_digit1'];
        let timeDigit2 = this.scene.graph.nodes['time_digit2'];
        if (this.timeBeforeNextPlay < 0){
            console.log('Timeout, game lost!');
        } else {
            timeDigit1.textureID = 'number' + Math.floor(this.timeBeforeNextPlay / 10);
            timeDigit2.textureID = 'number' + this.timeBeforeNextPlay % 10;
        }
    }
};
MyGame.prototype.logPicking = function (obj) {
        if ((this.pieces.indexOf(obj.nodeID) != -1) /*&& (this.captureRequired == false)*/ && (this.type == HUMAN_VS_HUMAN || this.type == HUMAN_VS_BOT)) {//obj is piece
            this.pieceToMove = obj; //Escolher a peça
        } else {
            if ((this.pieces.indexOf(obj.nodeID) == -1) && (this.pieceToMove != null) && (this.tiles.indexOf(obj.nodeID) != -1) && (this.type == HUMAN_VS_HUMAN || this.type == HUMAN_VS_BOT)) {
                this.move = [];
                this.move.push({x: this.pieceToMove.position.x, y: this.pieceToMove.position.y});
                this.move.push({x: obj.position.x, y: obj.position.y});
                this.tileToMove = obj;
                getPrologRequest(this, 'jogadaValida(' + this.showBoard() + '-' + this.player + '-' + this.showMove() + ')', onSuccess);
            } else {
                let substr;
                let prefix;
                if(obj.nodeID.length > 5) {
                    substr = obj.nodeID.substring(4, obj.nodeID.length);
                    prefix = obj.nodeID.substring(0, 4);
                } else {
                    substr = "";
                }
                console.log("substring: "+substr);
                switch (substr) {
                    case 'buton_1Vs1': {

                        if ((obj.pressed == 0) && (obj.invert == 0) && (obj.initialAnimTime == -1)) {
                            obj.pressed = 1;
                            // obj.materialID = 'yellow_buton_on';
                            obj.initialAnimTime = 0;
                            let buton1 = this.scene.graph.nodes[prefix+'buton_1VsPC'];
                            let buton2 = this.scene.graph.nodes[prefix+'buton_PCVsPC'];
                            this.turnOffButons(buton1, buton2);
                            this.type = HUMAN_VS_HUMAN;
                            this.resetGameTime();
                            this.resetGame();
                            this.gameCycle();
                        }
                        break;
                    }

                    case 'buton_1VsPC': {
                        if ((obj.pressed == 0) && (obj.invert == 0) && (obj.initialAnimTime == -1)) {
                            obj.pressed = 1;
                            // obj.materialID = 'yellow_buton_on';
                            obj.initialAnimTime = 0;
                            let buton1 = this.scene.graph.nodes[prefix+'buton_1Vs1'];
                            let buton2 = this.scene.graph.nodes[prefix+'buton_PCVsPC'];
                            this.turnOffButons(buton1, buton2);
                            this.type = HUMAN_VS_BOT;
                            this.resetGameTime();
                            this.resetGame();
                            this.gameCycle();
                        }

                        break;
                    }
                    case 'buton_PCVsPC': {
                        if ((obj.pressed == 0) && (obj.invert == 0) && (obj.initialAnimTime == -1)) {
                            obj.pressed = 1;
                            obj.materialID = 'yellow_buton_on';
                            obj.initialAnimTime = 0;
                            let buton1 = this.scene.graph.nodes[prefix+'buton_1Vs1'];
                            let buton2 = this.scene.graph.nodes[prefix+'buton_1VsPC'];
                            this.turnOffButons(buton1, buton2);
                            this.type = BOT_VS_BOT;
                            this.resetGameTime();
                            this.resetGame();
                            this.gameCycle();
                        }

                        break;
                    }
                    case 'buton_film': {
                        this.verifyNodeAnimation(obj);
                        if (this.isRecording == 0) {
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
                    case 'buton_level': {
                        this.verifyNodeAnimation(obj);

                        if (this.level == 0) {
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
                    case 'buton_undo': {
                        obj.pressed = obj.pressed == 0 ? 1 : 0;

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
      this.asker.captureRequired = false;
      if(this.asker.player == 1) {
        this.asker.nCaptureBy1++;
        this.asker.updatePoints(1);
      } else {
        this.asker.nCaptureBy2++;
        this.asker.updatePoints(2);
      }
      this.asker.removeCapturePiece();
      this.asker.moveOK();
      this.asker.promotionToKing();

      break;
    }
    case 'Capture':{
      this.asker.captureRequired = true;
      let auxPiece = this.asker.pieceToMove;
      let auxPlayer = this.asker.player;
      if(auxPlayer == 1) {
        this.asker.nCaptureBy1++;
        this.asker.updatePoints(1);
      } else {
        this.asker.nCaptureBy2++;
        this.asker.updatePoints(2);
      }
      this.asker.removeCapturePiece();
      this.asker.moveOK();
      this.asker.pieceToMove = auxPiece;
      this.asker.player = auxPlayer;
      break;
    }
    default:
      console.warn('Invalid response from server! '+ data.target.response);
  }
  this.asker.endGame();
  this.asker.timeAux = this.asker.maxTime;
}
/*
* Movimento da peca no tabuleiro (animacao da peca a saltar)
* */
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
  this.resetGame();
  let aux = this;
  let auxFilm = this.film.slice();
  for (let i = 0; i < this.film.length; i++){
    window.setTimeout(function(){playFilm_part2(aux,i);},1000*i);
  }
  window.setTimeout(function(){aux.film = auxFilm; aux.type=BOT_VS_BOT;/*TODO ten de ser dinamico*/},1000*this.film.length);
};
MyGame.prototype.undoPlay = function () {
  if(this.film.length == 0)
    return;
  let move = this.film[this.film.length - 1].slice();//buscar ultimo movimento (unitario)
  let aux = move[0];//inverter
  move[0] = move[1];//as coordenadas
  move[1] = aux;//do ultimo movimento
  let piece = this.capturedPieces[this.film.length-1];//peca que foi capturada no ultimo movimento guardado
  let captureRequired = false;
  if(piece) {
      captureRequired = piece.captureRequired;
      console.log(piece.materialID);
  }
  if(captureRequired)
    this.player = (this.player == 1)? 2 : 1;
  if(piece){
    this.undoCapturePiece(piece);//repor no tabuleiro a peca que tinha sido capturada
    if(this.player == 1) {
        this.nCaptureBy2--;
        this.updatePoints(2);
    } else {
        this.nCaptureBy1--;
        this.updatePoints(1);
    }
  }
  this.move = move;
  this.pieceToMove = this.findPieceByPosition(this.move[0]);
  this.tileToMove = this.findTileByPosition(this.move[1]);
  this.player = (this.player == 1)? 2 : 1;
  this.moveOK();
  this.player = (this.player == 1)? 2 : 1;

  this.capturedPieces[this.film.length-2] = null;//a peca que antes tinha sido capturada ja esta de volta no tabuleiro
  this.film.length = this.film.length - 2;//apagar ultimo movimento e movimento do undo do array de movimentos ja feitos
  if(captureRequired){
    this.pieceToMove = this.findPieceByPosition(move[1]);//move[1] = posicao da peca apos o undo
  }
  /*atualizar a flag captureRequired*/
  piece = this.capturedPieces[this.film.length-1];
  captureRequired = false;
  if(piece)
    captureRequired = piece.captureRequired;
  this.captureRequired = captureRequired;
};

/*
* Volta a por no tabuleiro a peça na posicao anterior
* */
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

MyGame.prototype.turnOffButons = function (buton1, buton2) {
    if(buton1.pressed) {
        if(buton1.pressed) {
            if(buton1.initialAnimTime != -1) {
                buton1.invert = 1;
            } else {
                buton1.pressed = 0;
                buton1.initialAnimTime = 0;
                buton1.materialID = 'yellow_buton_off';
            }
        }
    }
    if(buton2.pressed) {
        if(buton2.initialAnimTime != -1) {
            buton2.invert = 1;
        } else {
            buton2.pressed = 0;
            buton2.initialAnimTime = 0;
            buton2.materialID = 'yellow_buton_off';
        }
    }


}

MyGame.prototype.resetGame = function () {
  this.scene.graph.nodes[this.scene.graph.idRoot].resetPositions();
  this.board =  [[1,1,1,1,1,1,1,1],[0,1,1,1,1,1,1,0],[0,0,1,1,1,1,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,2,2,2,2,0,0],[0,2,2,2,2,2,2,0],[2,2,2,2,2,2,2,2]];
  this.player = 1;
};

MyGame.prototype.resetGameTime = function () {
    let auxiliarDate = new Date();
    this.previousTime = auxiliarDate.getTime();
    this.timeBeforeNextPlay = this.maxTime;
    this.timeAux = this.maxTime;
}

MyGame.prototype.updatePoints = function(player) {
    if(player == 1) {
        let pointsDigit1 = this.scene.graph.nodes['P1points_digit1'];
        let pointsDigit2 = this.scene.graph.nodes['P1points_digit2'];
        pointsDigit1.textureID = 'number' + Math.floor(this.nCaptureBy1 / 10);
        pointsDigit2.textureID = 'number' + this.nCaptureBy1 % 10;
    } else {
        let pointsDigit1 = this.scene.graph.nodes['P2points_digit1'];
        let pointsDigit2 = this.scene.graph.nodes['P2points_digit2'];
        pointsDigit1.textureID = 'number' + Math.floor(this.nCaptureBy2 / 10);
        pointsDigit2.textureID = 'number' + this.nCaptureBy2 % 10;
    }
}
