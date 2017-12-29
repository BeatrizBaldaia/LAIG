
/*
Predicado para verificar se a peça
vai ser promovida a rei
*/
promotedToKing(OldBoard, NewBoard):-
	promotedToKing1(OldBoard, _UpdatedBoard),
	promotedToKing2(_UpdatedBoard, NewBoard).

promotedToKing1(OldBoard, NewBoard):-
	ite(findPiece(OldBoard, X-8, 1),
		(putPiece(OldBoard, _UpdatedBoard, X-8, 11),
		promotedToKing1(_UpdatedBoard, NewBoard)),
	(NewBoard = OldBoard)).

promotedToKing2(OldBoard, NewBoard):-
	ite(findPiece(OldBoard, X-1, 2),
		(putPiece(OldBoard, _UpdatedBoard, X-1, 22),
		promotedToKing2(_UpdatedBoard, NewBoard)),
	(NewBoard = OldBoard)).

/*
Verificacao de fim de jogo
*/

gameOver(OldBoard, Player):-
   validMovesPC(OldBoard, Player, Moves, Simple),
   ite(Moves = [], true, fail),
	 ite(Player = 1, displayWinner2, displayWinner1),
	 sleep(5).
