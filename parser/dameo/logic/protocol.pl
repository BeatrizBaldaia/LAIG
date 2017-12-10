jogadaValidaTeste(CurrBoard, Player, Move):-
	findall(Num-Moves,getCapturesList(CurrBoard, X-Y, Player, Moves, Num), L),
	sort(L, LSorted),
	reverse(LSorted, LInverted),
	nth1(1, LInverted, NCaptures-BestMove),
	getBestCaptures(LInverted, Best, [], NCaptures),
	ite(NCaptures = 0,
		simpleMoveTeste(CurrBoard, Player, Move),
		write(erroDeviaCapturar)%selectCapturePiece(CurrBoard, Player, Best, NCaptures, NewBoard)
	).
simpleMoveTeste(CurrBoard, Player, [X-Y,NewX-NewY]):-
	ite(
		Player = 1,
		validMan1Move(CurrBoard, X-Y, NewX-NewY, D),
		validMan2Move(CurrBoard, X-Y, NewX-NewY, D)),
	updateBoardSimpleMove(CurrBoard, NewBoard, X-Y, NewX-NewY, Player).

%ALTERAR, mal
captureTeste(CurrBoard, Player, Moves, MaxCaptureNum, [X-Y,NewX-NewY]) :-
  ite(Player = 1, King is 11, King is 22),
  findPiece(CurrBoard, X-Y, P),
  member(P, [Player, King]),
  removeCaptures(X-Y, 1, Moves, UpdatedMoves),
  \+length(UpdatedMoves, 0), !,
  moveCapturePiece(CurrBoard, X-Y, P, UpdatedMoves, MaxCaptureNum, 2, NewBoard).
