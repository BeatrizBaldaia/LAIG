
/*
*Aplicar movimento sem capturar
*/
applyMovePC(CurrBoard, NewBoard, [X-Y,NewX-NewY], Player, yes):-
  updateBoardSimpleMove(CurrBoard, NewBoard, X-Y, NewX-NewY, Player).

/*
*Movimento de captura terminado
*(capturou todas as pecas possiveis)
*/
applyMovePC(NewBoard, NewBoard, [X-Y],Player,no).

/*
*Aplicar movimento com capturar
*/
applyMovePC(CurrBoard, NewBoard, [X-Y,NewX-NewY|Rest],Player, no):-
	updateBoardSimpleMove(CurrBoard, _updateBoard, X-Y, NewX-NewY, Player),
	takeAdversary(X-Y, NewX-NewY, _updateBoard, _updateBoard1),
	applyMovePC(_updateBoard1,  NewBoard, [NewX-NewY|Rest],Player, no).

/*
*Predicado para apagar o adversario capturado
*/
takeAdversary(X-Y, NewX-NewY, CurrBoard, NewBoard):-
	ite(X = NewX,
		(ite(NewY > Y, Y1 is NewY-1, Y1 is NewY+1),
		putPiece(CurrBoard, NewBoard, X-Y1, 0)
		),
		(ite(NewX > X, X1 is NewX-1, X1 is NewX+1),
		putPiece(CurrBoard, NewBoard, X1-Y, 0)
		)).


/*
Predicado para encontrar pecas
*/
findPiece(Board, X-Y, Piece):-
    nth1(Y, Board, Row),
    nth1(X, Row, Piece).

/*
Predicado para obter a direcao de um movimento simples
*/
convertToDirection(CurrBoard, Player, X-Y, X1-Y1, D):-
  ite((X = X1, Y = Y1), fail, true),
  ite(Y = Y1,
      (ite(X > X1, isDirection4(CurrBoard, X-Y, X1-Y1, Player, D), isDirection6(CurrBoard, X-Y, X1-Y1, Player, D))),
      ite(X = X1,
        ite(Y > Y1, isDirection8(CurrBoard, X-Y, X1-Y1, Player, D), isDirection2(CurrBoard, X-Y, X1-Y1, Player, D)),
        ite(X1 > X,
          (ite(Y1 > Y, isDirection3(CurrBoard, X-Y, X1-Y1, Player, D), isDirection9(CurrBoard, X-Y, X1-Y1, Player, D))),
          (ite(Y1 > Y, isDirection1(CurrBoard, X-Y, X1-Y1, Player, D), isDirection7(CurrBoard, X-Y, X1-Y1, Player, D)))
        )
      )
  ).

isDirection8(CurrBoard, X-Y, X1-Y1, Player, D):-
  Yaux1 is (Y - Y1),
  abs(Yaux1, Yaux),
  ite(Yaux =< 1,
    D is 8,
    (
      Y2 is Y - 1,
      findPiece(CurrBoard, X-Y2, Player),
      isDirection8(CurrBoard, X-Y2, X1-Y1, Player, D)
    )
  ).

isDirection2(CurrBoard, X-Y, X1-Y1, Player, D):-
  Yaux1 is (Y - Y1),
  abs(Yaux1, Yaux),
  ite(Yaux =< 1,
    D is 2,
    (
      Y2 is Y + 1,
      findPiece(CurrBoard, X-Y2, Player),
      isDirection2(CurrBoard, X-Y2, X1-Y1, Player, D)
    )
  ).

isDirection4(CurrBoard, X-Y, X1-Y1, Player, D):-
  Xaux1 is (X - X1),
  abs(Xaux1, Xaux),
  ite(Xaux =< 1,
    D is 4,
    (
      X2 is X - 1,
      findPiece(CurrBoard, X2-Y, Player),
      isDirection4(CurrBoard, X2-Y, X1-Y1, Player, D)
    )
  ).

isDirection6(CurrBoard, X-Y, X1-Y1, Player, D):-
  Xaux1 is (X - X1),
  abs(Xaux1, Xaux),
  ite(Xaux =< 1,
    D is 6,
    (
      X2 is X + 1,
      findPiece(CurrBoard, X2-Y, Player),
      isDirection6(CurrBoard, X2-Y, X1-Y1, Player, D)
    )
  ).

isDirection7(CurrBoard, X-Y, X1-Y1, Player, D):-
  Xaux1 is (X - X1),
  Yaux1 is (Y - Y1),
  abs(Xaux1, Xaux),
  abs(Yaux1, Yaux),
  ite((Xaux =< 1, Yaux =< 1, Xaux = Yaux),
    D is 7,
    (
      X2 is X - 1,
      Y2 is Y - 1,
      findPiece(CurrBoard, X2-Y2, Player),
      isDirection7(CurrBoard, X2-Y2, X1-Y1, Player, D)
    )
  ).

isDirection9(CurrBoard, X-Y, X1-Y1, Player, D):-
  Xaux1 is (X - X1),
  Yaux1 is (Y - Y1),
  abs(Xaux1, Xaux),
  abs(Yaux1, Yaux),
  ite((Xaux =< 1, Yaux =< 1, Xaux = Yaux),
    D is 9,
    (
      X2 is X + 1,
      Y2 is Y - 1,
      findPiece(CurrBoard, X2-Y2, Player),
      isDirection9(CurrBoard, X2-Y2, X1-Y1, Player, D)
    )
  ).

isDirection1(CurrBoard, X-Y, X1-Y1, Player, D):-
  Xaux1 is (X - X1),
  Yaux1 is (Y - Y1),
  abs(Xaux1, Xaux),
  abs(Yaux1, Yaux),
  ite((Xaux =< 1, Yaux =< 1, Xaux = Yaux),
    D is 1,
    (
      X2 is X - 1,
      Y2 is Y + 1,
      findPiece(CurrBoard, X2-Y2, Player),
      isDirection1(CurrBoard, X2-Y2, X1-Y1, Player, D)
    )
  ).

isDirection3(CurrBoard, X-Y, X1-Y1, Player, D):-
  Xaux1 is (X - X1),
  Yaux1 is (Y - Y1),
  abs(Xaux1, Xaux),
  abs(Yaux1, Yaux),
  ite((Xaux =< 1, Yaux =< 1, Xaux = Yaux),
    D is 3,
    (
      X2 is X + 1,
      Y2 is Y + 1,
      findPiece(CurrBoard, X2-Y2, Player),
      isDirection3(CurrBoard, X2-Y2, X1-Y1, Player, D)
    )
  ).
/*
Predicados para colocar/mover peças no Tabuleiro
 */
putPiece(OldBoard, NewBoard, X-Y, Piece):-
	X < 1, !, fail.
putPiece(OldBoard, NewBoard, X-Y, Piece):-
  X > 8, !, fail.
putPiece(OldBoard, NewBoard, X-Y, Piece):-
	Y < 1, !, fail.
putPiece(OldBoard, NewBoard, X-Y, Piece):-
  Y > 8, !, fail.
putPiece(OldBoard, NewBoard, X-Y, Piece):-
	nth1(Y, OldBoard, OldRow),
	putPieceInRow(OldRow, NRow, X, Piece),
	putRowInBoard(OldBoard, NewBoard, Y, NRow).

putPieceInRow([_|OldRow], [Piece|OldRow], 1, Piece).
putPieceInRow([_R|OldRow], [_R|NewRow], X, Piece):-
  X1 is X - 1,
  putPieceInRow(OldRow, NewRow, X1, Piece).

putRowInBoard([_|OldBoard], [Row|OldBoard], 1, Row).
putRowInBoard([_R|OldBoard], [_R|NewBoard], Y, Row):-
  Y1 is Y - 1,
  putRowInBoard(OldBoard, NewBoard, Y1, Row).


convertLetterToNum(L, N):-
  (L = 'A') -> N is 1;
  (L = 'B') -> N is 2;
  (L = 'C') -> N is 3;
  (L = 'D') -> N is 4;
  (L = 'E') -> N is 5;
  (L = 'F') -> N is 6;
  (L = 'G') -> N is 7;
  (L = 'H') -> N is 8.

/*
Predicado que atualiza o tabuleiro
*/
updateBoardSimpleMove(OldBoard, NewBoard, X-Y, NewX-NewY, Player):-
	findPiece(OldBoard, X-Y, King),
	putPiece(OldBoard, _UpdatedBoard, X-Y, 0),
	putPiece(_UpdatedBoard, NewBoard, NewX-NewY, King).

updateBoardCaptureMove(OldBoard, NewBoard, X-Y, NewX-NewY, Player, Mark):-
  putPiece(OldBoard, _UpdatedBoard, X-Y, 0),
  ite(X = NewX,
    X1 is X,
    (ite(X > NewX, X1 is NewX + 1, X1 is NewX - 1))),

  ite(Y = NewY,
    Y1 is Y,
    (ite(Y > NewY, Y1 is NewY + 1, Y1 is NewY - 1))),

  putPiece(_UpdatedBoard, _UpdatedBoard2, X1-Y1, Mark),%3 = marca o capturado; 0 = apaga o capturado
  putPiece(_UpdatedBoard2, NewBoard, NewX-NewY, Player).
