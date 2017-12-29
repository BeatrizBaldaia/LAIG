
/*
*Primeiro predicado validMovesPC invocado para
*verificar se o PC e obrigado a capturar
*/
validMovesPC(Board, Player, Moves, no):-
	mandatoryCapturePC(Board, Player, Moves).

validMovesPC(Board, Player, Moves, yes):-
	findall(Move,validMovePC(Board, Player, Move),Moves).

validMovePC(Board, Player, [X-Y,NewX-NewY]):-
	ite(Player = 1,
	validMan1Move(Board, X-Y, NewX-NewY, D),
	validMan2Move(Board, X-Y, NewX-NewY, D)).

/*
*Verificar os movimentos possiveis dos reis
*/
validMovePC(Board, Player, [X-Y,NewX-NewY]):-
	ite(Player = 1,
	validKingMove(Board, X-Y, NewX-NewY, 11, D),
	validKingMove(Board, X-Y, NewX-NewY, 22, D)).

/*
*validMovePC(+Board, +Player, +[X-Y, NewX-NewY])
*
*validMovePC e chamado outra vez para obter a direcao
*do movimento valido verificado anteriormente
*/
validMovePC(Board, Player, [X-Y,NewX-NewY]):-
	ite(Player = 1,
	validKeepMoving(Board, X-Y, NewX-NewY, 11, D),
	validKeepMoving(Board, X-Y, NewX-NewY, 22, D)).

/*
*validKeepMoving(+Board, +X-Y, +NewX-NewY, +Player, -D)
*												ou
*validKeepMoving(+Board, +X-Y, -NewX-NewY, +Player, +D)
*/
validKeepMoving(Board, X-Y, NewX-NewY, Player, D):-
	validKingMove(Board, X-Y, NewX-NewY, Player, D).%obtem-se a direcao do movimento valido

/*
*validKeepMoving(+Board, +X-Y, +NewX-NewY, +Player, +D)
*
*verifica-se se o rei consegue continuar a andar na direcao D
*/
validKeepMoving(Board, X-Y, NewX-NewY, Player, D):-
	validKingMove(Board, X-Y, X1-Y2, Player, D),
	updateBoardSimpleMove(Board, NewBoard, X-Y, X1-Y2, Player),
	validKeepMoving(NewBoard, X1-Y2, NewX-NewY, Player, D).%validKeepMoving(+Board, +X-Y, -NewX-NewY, +Player, +D)
