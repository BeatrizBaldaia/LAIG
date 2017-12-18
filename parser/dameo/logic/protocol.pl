jogadaValida(Board-Player-Moves,Res):- jogadaValidaSimplesTeste(Board,Player,Moves), !, Res = 'OK'.
jogadaValida(Board-Player-Moves,Res):- jogadaValidaCapturaTeste(Board,Player,Moves,More),
 	!, ite(More = yes,
				Res = 'Capture',
				Res = 'NCapture').
jogadaValida(_,Res):- Res = 'Invalid Move'.

jogadaValidaSimplesTeste(CurrBoard, Player, Move):-
	findall(Num-Moves,getCapturesList(CurrBoard, X-Y, Player, Moves, Num), L),
	sort(L, LSorted),
	reverse(LSorted, LInverted),
	nth1(1, LInverted, NCaptures-BestMove),
	getBestCaptures(LInverted, Best, [], NCaptures),
	ite(NCaptures = 0,
		moveTeste(CurrBoard, Player, Move),
		fail
	).

jogadaValidaCapturaTeste(CurrBoard, Player, Move, More):-
	findall(Num-Moves,getCapturesList(CurrBoard, X-Y, Player, Moves, Num), L),
	sort(L, LSorted),
	reverse(LSorted, LInverted),
	nth1(1, LInverted, NCaptures-BestMove),
	getBestCaptures(LInverted, Best, [], NCaptures),
	ite(NCaptures = 0,
		fail,
		(ite(NCaptures = 1,
			(More = no, member(Move, Best)),
			(More = yes, turnToOneCapture(Best, NewBest), member(Move, NewBest))))
	).

moveTeste(CurrBoard, Player, [X-Y,NewX-NewY]):-
	ite(
		Player = 1,
		validMan1Move(CurrBoard, X-Y, NewX-NewY, D),
		validMan2Move(CurrBoard, X-Y, NewX-NewY, D)),
	updateBoardSimpleMove(CurrBoard, NewBoard, X-Y, NewX-NewY, Player).
moveTeste(CurrBoard, Player, [X-Y,NewX-NewY]):-
    ite(Player = 1, King = 11, King = 22),
    validKeepMoving(CurrBoard, X-Y, NewX-NewY, King, D).

turnToOneCapture([], []).
turnToOneCapture([[A,B|_]|Continue], [[A,B]|NewContinue]):-
	turnToOneCapture(Continue, NewContinue).

protocolgameOver(OldBoard, Player):-
     validMovesPC(OldBoard, Player, Moves, Simple),
     ite(Moves = [], true, fail).
