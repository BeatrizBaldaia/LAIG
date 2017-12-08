/*
Predicado para verificar quais os movimentos
validos de uma peça homem.
Em Move retorna a posição inicial e final da peça.
Os movimentos(vertical ou diagonal) sao sempre para
a frente/em sentido ao extremo adversário.
*/


%movimento vertical
validMan1Move(CurrBoard, X-Y, NewX-NewY, 2):-
	findPiece(CurrBoard, X-Y, 1),
	Y1 is Y + 1,
	findPiece(CurrBoard, X-Y1, 0),
	NewX is X, NewY is Y1.
%movimento linear vertical (salta por cima de pecas do mesmo tipo)
validMan1Move(CurrBoard, X-Y, NewX-NewY, 2):-
  findPiece(CurrBoard, X-Y, 1),
  Y1 is Y + 1,
  findPiece(CurrBoard, X-Y1, 1),
  validMan1Move(CurrBoard, X-Y1, NewX-NewY, 2).

%movimento diagonal esquerda
validMan1Move(CurrBoard, X-Y, NewX-NewY, 1):-
	findPiece(CurrBoard, X-Y, 1),
	X1 is X - 1,
	Y1 is Y + 1,
	findPiece(CurrBoard, X1-Y1, 0),
	NewX is X1, NewY is Y1.
%movimento linear diagonal esquerda (salta por cima de pecas do mesmo tipo)
validMan1Move(CurrBoard, X-Y, NewX-NewY, 1):-
  findPiece(CurrBoard, X-Y, 1),
  X1 is X - 1,
  Y1 is Y + 1,
	findPiece(CurrBoard, X1-Y1, 1),
  validMan1Move(CurrBoard, X1-Y1, NewX-NewY, 1).

%movimento diagonal direita
validMan1Move(CurrBoard, X-Y, NewX-NewY, 3):-
	findPiece(CurrBoard, X-Y, 1),
	X1 is X + 1,
	Y1 is Y + 1,
	findPiece(CurrBoard, X1-Y1, 0),
	NewX is X1, NewY is Y1.
%movimento linear diagonal direita (salta por cima de pecas do mesmo tipo)
validMan1Move(CurrBoard, X-Y, NewX-NewY, 3):-
	findPiece(CurrBoard, X-Y, 1),
    X1 is X + 1,
	Y1 is Y + 1,
	findPiece(CurrBoard, X1-Y1, 1),
	validMan1Move(CurrBoard, X1-Y1, NewX-NewY, 3).
/*
validMan1Move(CurrBoard, X-Y, NewX-NewY, Player, D):-
	fail.
*/

%movimento vertical
validMan2Move(CurrBoard, X-Y, NewX-NewY, 8):-
	findPiece(CurrBoard, X-Y, 2),
	Y1 is Y - 1,
	findPiece(CurrBoard, X-Y1, 0),
	NewX is X, NewY is Y1.
%movimento linear vertical (salta por cima de pecas do mesmo tipo)
validMan2Move(CurrBoard, X-Y, NewX-NewY, 8):-
  findPiece(CurrBoard, X-Y, 2),
  Y1 is Y - 1,
  findPiece(CurrBoard, X-Y1, 2),
  validMan2Move(CurrBoard, X-Y1, NewX-NewY, 8).

%movimento diagonal esquerda
validMan2Move(CurrBoard, X-Y, NewX-NewY, 7):-
	findPiece(CurrBoard, X-Y, 2),
	X1 is X - 1,
	Y1 is Y - 1,
	findPiece(CurrBoard, X1-Y1, 0),
	NewX is X1, NewY is Y1.
%movimento linear diagonal esquerda (salta por cima de pecas do mesmo tipo)
validMan2Move(CurrBoard, X-Y, NewX-NewY, 7):-
  findPiece(CurrBoard, X-Y, 2),
  X1 is X - 1,
  Y1 is Y - 1,
	findPiece(CurrBoard, X1-Y1, 2),
  validMan2Move(CurrBoard, X1-Y1, NewX-NewY, 7).

%movimento diagonal direita
validMan2Move(CurrBoard, X-Y, NewX-NewY, 9):-
	findPiece(CurrBoard, X-Y, 2),
	X1 is X + 1,
	Y1 is Y - 1,
	findPiece(CurrBoard, X1-Y1, 0),
	NewX is X1, NewY is Y1.
%movimento linear diagonal direita (salta por cima de pecas do mesmo tipo)
validMan2Move(CurrBoard, X-Y, NewX-NewY, 9):-
	findPiece(CurrBoard, X-Y, 2),
  X1 is X + 1,
	Y1 is Y - 1,
	findPiece(CurrBoard, X1-Y1, 2),
	validMan2Move(CurrBoard, X1-Y1, NewX-NewY, 9).
