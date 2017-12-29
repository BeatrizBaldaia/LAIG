    /*Movimento dos reis sem captura*/


/*
Verificar se o movimento (de uma unidade)
do rei é valido
*/
validKingMove(CurrBoard, X-Y, X-NewY, Player, 2):-
    findPiece(CurrBoard, X-Y, Player),
  	Y1 is Y + 1,
  	findPiece(CurrBoard, X-Y1, 0),
  	NewY is Y1.
validKingMove(CurrBoard, X-Y, X-NewY, Player, 8):-
    findPiece(CurrBoard, X-Y, Player),
  	Y1 is Y - 1,
  	findPiece(CurrBoard, X-Y1, 0),
  	NewY is Y1.
validKingMove(CurrBoard, X-Y, NewX-Y, Player, 4):-
    findPiece(CurrBoard, X-Y, Player),
  	X1 is X - 1,
  	findPiece(CurrBoard, X1-Y, 0),
  	NewX is X1.
validKingMove(CurrBoard, X-Y, NewX-Y, Player, 6):-
    findPiece(CurrBoard, X-Y, Player),
  	X1 is X + 1,
  	findPiece(CurrBoard, X1-Y, 0),
  	NewX is X1.
validKingMove(CurrBoard, X-Y, NewX-NewY, Player, 7):-
    findPiece(CurrBoard, X-Y, Player),
    Y1 is Y - 1,
  	X1 is X - 1,
  	findPiece(CurrBoard, X1-Y1, 0),
  	NewX is X1,
    NewY is Y1.
validKingMove(CurrBoard, X-Y, NewX-NewY, Player, 9):-
   findPiece(CurrBoard, X-Y, Player),
    Y1 is Y - 1,
  	X1 is X + 1,
  	findPiece(CurrBoard, X1-Y1, 0),
  	NewX is X1,
    NewY is Y1.
validKingMove(CurrBoard, X-Y, NewX-NewY, Player, 1):-
  findPiece(CurrBoard, X-Y, Player),
    Y1 is Y + 1,
  	X1 is X - 1,
  	findPiece(CurrBoard, X1-Y1, 0),
  	NewX is X1,
    NewY is Y1.
validKingMove(CurrBoard, X-Y, NewX-NewY, Player, 3):-
   findPiece(CurrBoard, X-Y, Player),
    Y1 is Y + 1,
  	X1 is X + 1,
  	findPiece(CurrBoard, X1-Y1, 0),
  	NewX is X1,
    NewY is Y1.
