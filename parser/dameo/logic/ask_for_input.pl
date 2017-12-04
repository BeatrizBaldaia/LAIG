/*
*Jogador escolhe a peça que vai jogar
*e o sentido do movimento da mesma.
*Movimento sem captura
*/
selectPiece(CurrBoard, NewBoard, PlayerNum):-
  showBoard(CurrBoard),
  repeat,
  write('/_!_\\ Choose your piece:'), nl,
  write('Row (Number)'), getInteger(Y),
  write('Column (Letter)'), getLetter(L), nl,convertLetterToNum(L, X),
  findPiece(CurrBoard, X-Y, Player),
  ite(
	PlayerNum = 1,
	member(Player, [1, 11]),
	member(Player, [2, 22])),
  !,
  defineDirection(CurrBoard, NewBoard, X-Y, Player).

/*
*Jogador vai escolher a direcao do movimento (casa destino)
*da peca escolhida.
*Caso em que a peca escolhida e um Homem
*/
defineDirection(CurrBoard, NewBoard, X-Y, Player):-
  member(Player, [1, 2]), !,
  write('\33\[2J'),
  ite(member(Player, [1, 11]), displayPlayer1Turn, displayPlayer2Turn),
  showBoard(CurrBoard),
  nl, write('>>>>>>>>>>>>>MOVE PIECE<<<<<<<<<<<<<<'), nl, nl, nl,
  repeat,
  write('Row (Number)'), getInteger(Y1),
  write('Column (Letter)'), getLetter(L),
  convertLetterToNum(L, X1),
  convertToDirection(CurrBoard, Player, X-Y, X1-Y1, D),

  ite(
  	Player = 1,
  	validMan1Move(CurrBoard, X-Y, NewX-NewY, D),
  	validMan2Move(CurrBoard, X-Y, NewX-NewY, D)),
  updateBoardSimpleMove(CurrBoard, NewBoard, X-Y, NewX-NewY, Player).

/*
*Jogador vai escolher a direcao do movimento (numero que representa a direcao)
*da peca escolhida.
*Caso em que a peca escolhida e um Rei
*/
defineDirection(CurrBoard, FinalBoard, X-Y, Player):-
  member(Player, [11, 22]), !,
  write('\33\[2J'),
  ite(member(Player, [1, 11]), displayPlayer1Turn, displayPlayer2Turn),
  showBoard(CurrBoard),
  nl, write('>>>>>>>>>>>>>MOVE PIECE<<<<<<<<<<<<<<'), nl, nl, nl,
  repeat,
  write('Define direction'),
  getInteger(D),
  member(D, [1, 2, 3, 4, 6, 7, 8, 9]),
  keepMovingKing(CurrBoard, FinalBoard, X-Y, Player, D).
/*
*Peca Rei vai continuar a andar
*enquanto o jogador continuar a introduzir o numero da
*direcao escolhida anteriormente
*/
keepMovingKing(CurrBoard, FinalBoard, X-Y, Player, D):-
  validKingMove(CurrBoard, X-Y, NewX-NewY, Player, D),
  updateBoardSimpleMove(CurrBoard, NewBoard, X-Y, NewX-NewY, Player),
  write('\33\[2J'),
  ite(Player = 11, displayPlayer1Turn, displayPlayer2Turn),
  showBoard(NewBoard),
  ite(validKingMove(NewBoard, NewX-NewY, X1-Y1, Player, D),
   (ite(keepMoving(D),
	    keepMovingKing(NewBoard, FinalBoard, NewX-NewY, Player, D),
	    FinalBoard = NewBoard)),
	  FinalBoard = NewBoard).

/*
*O rei pode andar mais do que uma
*casa na mesma linha de percurso
*(na mesma direcao e sentidos anteriormente escolhidos)
*/
keepMoving(Direction):-
  getInteger(D),
  ite(D = Direction,
    true,
    ite(member(D, [1, 2, 3, 4, 6, 7, 8, 9]), keepMoving(Direction), fail)).

/*
*Jogador escolhe a peça que vai jogar.
*Movimento com captura obrigatoria.
*
*Jogador so pode fazer um dos movimentos de captura
*da lista Moves que tem as capturas otimas
*/
selectCapturePiece(CurrBoard, Player, Moves, MaxCaptureNum, NewBoard) :-
  showBoard(CurrBoard),
  ite(Player = 1, King is 11, King is 22),
  repeat,
  write('/_!_\\ Choose your piece:'), nl,
  write('Row (Number)'), getInteger(Y),
  write('Column (Letter)'), getLetter(L), convertLetterToNum(L, X),
  findPiece(CurrBoard, X-Y, P),
  member(P, [Player, King]),
  removeCaptures(X-Y, 1, Moves, UpdatedMoves),
  \+length(UpdatedMoves, 0), !,
  moveCapturePiece(CurrBoard, X-Y, P, UpdatedMoves, MaxCaptureNum, 2, NewBoard).

/*
*Jogador vai escolhendo as posicoes que tem
*de ocupar no percurso de captura
*/
moveCapturePiece(CurrBoard,  X-Y, Player, Moves, MaxCaptureNum, CurrNum, NewBoard) :-
  ite(CurrNum > (MaxCaptureNum + 1),
    (
      write('No more pieces to capture'), nl,
      NewBoard = CurrBoard
    ),
    (
      write('\33\[2J'),
      ite(member(Player, [1, 11]), displayPlayer1Turn, displayPlayer2Turn),
      showBoard(CurrBoard),
      nl, write('>>>>>>>>>>>>>MOVE PIECE<<<<<<<<<<<<<<'), nl, nl, nl,
      repeat,
      write('Row (Number)'), getInteger(Y1),
      write('Column (Letter)'), getLetter(L), convertLetterToNum(L, X1),
      findPiece(CurrBoard, X1-Y1, 0),
      removeCaptures(X1-Y1, CurrNum, Moves, UpdatedMoves),
      ite(length(UpdatedMoves, 0),
        fail,
        (
        updateBoardCaptureMove(CurrBoard, UpdatedBoard, X-Y, X1-Y1, Player, 0),
        NewNum is CurrNum + 1,
        moveCapturePiece(UpdatedBoard, X1-Y1, Player, Moves, MaxCaptureNum, NewNum, NewBoard))
        )
     )
  ).
