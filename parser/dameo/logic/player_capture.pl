/*
*Verifica se o PC e obrigado a capturar
*/
mandatoryCapturePC(Board, Player, Moves):-
	setof(Num-X-Y-Move,captureNumber(Board, X-Y, Num, Player, Move),_L),
	reverse(_L,[Num-X-Y-Move|Rest]),
	ite(Num = 0, fail,
	getPossivelCaptures([Num-X-Y-Move|Rest], Moves, Num)).

/*Prenche array de moves*/
getPossivelCaptures([], [], _Num).
getPossivelCaptures([Num-X-Y-Move|Rest], Moves, NumCap):-
	ite(Num = NumCap,
		(getPossivelCaptures(Rest, Mov, NumCap),
			Moves = [Move|Mov]),
		Moves = []).


/*
Predicado para contar o numero
de capturas possivel
*/
captureNumber(OldBoard, X-Y, 0, Player,[X-Y]):-
	\+possibleCapture(OldBoard, X-Y, NewBoard, NewX-NewY, Player).

captureNumber(OldBoard, X-Y, Num, Player,[X-Y|Next]):-
	possibleCapture(OldBoard, X-Y, NewBoard, NewX-NewY, Player),
	captureNumber(NewBoard, NewX-NewY, NNum, Player, Next),
	Num is NNum+1.

/*
*Predicado para verificar a captura de uma peca
*/
possibleCapture(OldBoard, X-Y, NewBoard, NewX-NewY, Player):-
ite(Player = 1,
	possibleCaptureKing(OldBoard, X-Y, NewBoard, NewX-NewY, 11, Direction),
	possibleCaptureKing(OldBoard, X-Y, NewBoard, NewX-NewY, 22, Direction)).
possibleCapture(OldBoard, X-Y, NewBoard, NewX-NewY, Player):-
	possibleCaptureMan(OldBoard, X-Y, NewBoard, NewX-NewY, Player).
/*Playeres Normais*/
possibleCaptureMan(OldBoard, X-Y, NewBoard, NewX-Y, Player):-%Capturar para a esquerda
	findPiece(OldBoard, X-Y, Player),
	X1 is X - 1,
	findPiece(OldBoard, X1-Y, _A),
	adversary(Player, _A),
	NewX is X - 2,
	findPiece(OldBoard, NewX-Y, 0),
	putPiece(OldBoard, _UpdatedBoard, X-Y, 0),
	putPiece(_UpdatedBoard, _UpdatedBoard2, X1-Y, 33),
	putPiece(_UpdatedBoard2, NewBoard, NewX-Y, Player).
possibleCaptureMan(OldBoard, X-Y, NewBoard, NewX-Y, Player):-%Capturar para a direita
	findPiece(OldBoard, X-Y, Player),
	X1 is X + 1,
	findPiece(OldBoard, X1-Y, _A),
	adversary(Player, _A),
	NewX is X + 2,
	findPiece(OldBoard, NewX-Y, 0),
	putPiece(OldBoard, _UpdatedBoard, X-Y, 0),
	putPiece(_UpdatedBoard, _UpdatedBoard2, X1-Y, 33),
	putPiece(_UpdatedBoard2, NewBoard, NewX-Y, Player).
possibleCaptureMan(OldBoard, X-Y, NewBoard, X-NewY, Player):-%Capturar para cima
	findPiece(OldBoard, X-Y, Player),
	Y1 is Y + 1,
	findPiece(OldBoard, X-Y1, _A),
	adversary(Player, _A),
	NewY is Y + 2,
	findPiece(OldBoard, X-NewY, 0),
	putPiece(OldBoard, _UpdatedBoard, X-Y, 0),
	putPiece(_UpdatedBoard, _UpdatedBoard2, X-Y1, 33),
	putPiece(_UpdatedBoard2, NewBoard, X-NewY, Player).
possibleCaptureMan(OldBoard, X-Y, NewBoard, X-NewY, Player):-%Capturar para baixo
	findPiece(OldBoard, X-Y, Player),
	Y1 is Y - 1,
	findPiece(OldBoard, X-Y1, _A),
	adversary(Player, _A),
	NewY is Y - 2,
	findPiece(OldBoard, X-NewY, 0),
	putPiece(OldBoard, _UpdatedBoard, X-Y, 0),
	putPiece(_UpdatedBoard, _UpdatedBoard2, X-Y1, 33),
	putPiece(_UpdatedBoard2, NewBoard, X-NewY, Player).

/*
Predicado para verificar as capturas
de um rei
*/
possibleCaptureKing(OldBoard, X-Y, NewBoard, NewX-Y, Player, Direction):-%Capturar em X menos
	Direction = 1,
	findPiece(OldBoard, X-Y, Player),
	X1 is X - 1,
	findPiece(OldBoard, X1-Y, _A),
	adversary(Player, _A),
	NewX is X - 2,
	findPiece(OldBoard, NewX-Y, 0),
	putPiece(OldBoard, _UpdatedBoard, X-Y, 0),
	putPiece(_UpdatedBoard, _UpdatedBoard2, X1-Y, 33),
	putPiece(_UpdatedBoard2, NewBoard, NewX-Y, Player).
possibleCaptureKing(OldBoard, X-Y, NewBoard, NewX-Y, Player, Direction):-%Capturar em X mais
	Direction = 2,
	findPiece(OldBoard, X-Y, Player),
	X1 is X + 1,
	findPiece(OldBoard, X1-Y, _A),
	adversary(Player, _A),
	NewX is X + 2,
	findPiece(OldBoard, NewX-Y, 0),
	putPiece(OldBoard, _UpdatedBoard, X-Y, 0),
	putPiece(_UpdatedBoard, _UpdatedBoard2, X1-Y, 33),
	putPiece(_UpdatedBoard2, NewBoard, NewX-Y, Player).
possibleCaptureKing(OldBoard, X-Y, NewBoard, X-NewY, Player, Direction):-%Capturar em Y mais
	Direction = 4,
	findPiece(OldBoard, X-Y, Player),
	Y1 is Y + 1,
	findPiece(OldBoard, X-Y1, _A),
	adversary(Player, _A),
	NewY is Y + 2,
	findPiece(OldBoard, X-NewY, 0),
	putPiece(OldBoard, _UpdatedBoard, X-Y, 0),
	putPiece(_UpdatedBoard, _UpdatedBoard2, X-Y1, 33),
	putPiece(_UpdatedBoard2, NewBoard, X-NewY, Player).
possibleCaptureKing(OldBoard, X-Y, NewBoard, X-NewY, Player, Direction):-%Capturar em Y menos
	Direction = 3,
	findPiece(OldBoard, X-Y, Player),
	Y1 is Y - 1,
	findPiece(OldBoard, X-Y1, _A),
	adversary(Player, _A),
	NewY is Y - 2,
	findPiece(OldBoard, X-NewY, 0),
	putPiece(OldBoard, _UpdatedBoard, X-Y, 0),
	putPiece(_UpdatedBoard, _UpdatedBoard2, X-Y1, 33),
	putPiece(_UpdatedBoard2, NewBoard, X-NewY, Player).
possibleCaptureKing(OldBoard, X-Y, NewBoard, X-NewY, Player, Direction):-%Capturar em Y menos
	Direction = 3,
	findPiece(OldBoard, X-Y, Player),
	Y1 is Y-1,
	findPiece(OldBoard, X-Y1, 0),
	putPiece(OldBoard, _UpdatedBoard, X-Y, 0),
	putPiece(_UpdatedBoard, _N, X-Y1, Player),
	possibleCaptureKing(_N, X-Y1, NewBoard, X-NewY, Player, Direction).
possibleCaptureKing(OldBoard, X-Y, NewBoard, X-NewY, Player, Direction):-%Capturar em Y mais
	Direction = 4,
	findPiece(OldBoard, X-Y, Player),
	Y1 is Y + 1,
	findPiece(OldBoard, X-Y1, 0),
	putPiece(OldBoard, _UpdatedBoard, X-Y, 0),
	putPiece(_UpdatedBoard, _N, X-Y1, Player),
	possibleCaptureKing(_N, X-Y1, NewBoard, X-NewY, Player, Direction).
possibleCaptureKing(OldBoard, X-Y, NewBoard, NewX-Y, Player, Direction):-%Capturar em X menos
	Direction = 1,
	findPiece(OldBoard, X-Y, Player),
	X1 is X - 1,
	findPiece(OldBoard, X1-Y, 0),
	putPiece(OldBoard, _UpdatedBoard, X-Y, 0),
	putPiece(_UpdatedBoard, UpdatedBoard2, X1-Y, Player),
	possibleCaptureKing(UpdatedBoard2, X1-Y, NewBoard, NewX-Y, Player, Direction).
possibleCaptureKing(OldBoard, X-Y, NewBoard, NewX-Y, Player, Direction):-%Capturar em X mais
	Direction = 2,
	findPiece(OldBoard, X-Y, Player),
	X1 is X + 1,
	findPiece(OldBoard, X1-Y, 0),
	putPiece(OldBoard, _UpdatedBoard, X-Y, 0),
	putPiece(_UpdatedBoard, _N, X1-Y, Player),
	possibleCaptureKing(_N, X1-Y, NewBoard, NewX-Y, Player, Direction).
