:- dynamic gameState/2.
/*
*Modo de jogo 1 Vs 1 (loop de jogo)
*/
game1Vs1(InitialBoard):-
  assert(gameState(InitialBoard, 1)),
	repeat,
		retract(gameState(Board, Player)),
		once(playGame(Player, Board, NewPlayer, NewBoard1)),
		once(promotedToKing(NewBoard1, NewBoard)),
		assert(gameState(NewBoard, NewPlayer)),
		gameOver(NewBoard, NewPlayer),
    write('\33\[2J'),
    retract(gameState(_, _)),
    chooseGameMode.

/*
*Para o modo de jogo 1 Vs 1.
*Desenha rotulo/titulo do jogador, executa a jogada e atualiza
*o jogador a jogar
*/
playGame(Player, CurrBoard, NewPlayer, NewBoard):-
  write('\33\[2J'),
  ite(Player = 1, displayPlayer1Turn, displayPlayer2Turn),
  mandatoryCapture(CurrBoard, NewBoard, Player),
  ite(Player = 1, NewPlayer is 2, NewPlayer is 1).

/*
*Verifica de o jogador e obrigado a capturar.
*Se sim, jogador faz movimento de captura,
*senao, faz movimento normal
*/
mandatoryCapture(CurrBoard, NewBoard, Player):-
	findall(Num-Moves,getCapturesList(CurrBoard, X-Y, Player, Moves, Num), L),
  sort(L, LSorted),
	reverse(LSorted, LInverted),
  nth1(1, LInverted, NCaptures-BestMove),
  getBestCaptures(LInverted, Best, [], NCaptures),
  ite(NCaptures = 0,
		selectPiece(CurrBoard, NewBoard, Player),
		(nl, nl, write('WARNING: You\'re forced to capture'), nl, nl,
    selectCapturePiece(CurrBoard, Player, Best, NCaptures, NewBoard))
		).

/*
*Modo de jogo PC Vs PC (loop de jogo)
*/
gamePCvsPC(InitialBoard):-
	retractall(gameState(_A,_B)),
  assert(gameState(InitialBoard, 1)),
	repeat,
		retract(gameState(Board, Player)),
		once(playGamePC(Player, Board, NewPlayer, NewBoard1)),
		once(promotedToKing(NewBoard1, NewBoard)),
		assert(gameState(NewBoard, NewPlayer)),
    sleep(3),
		gameOver(NewBoard, NewPlayer),
    write('\33\[2J'),
    retract(gameState(_, _)),
    chooseGameMode.

/*
*Para o modo de jogo PC Vs PC
*Desenha rotulo/titulo do jogador, executa a jogada e atualiza
*o jogador a jogar
*/
playGamePC(Player, Board, NewPlayer, NewBoard):-
  write('\33\[2J'),
  ite(Player = 1,(displayPlayer1Turn, NewPlayer = 2),(displayPlayer2Turn, NewPlayer = 1)),
  showBoard(Board),
  validMovesPC(Board, Player, Moves, Simple),%e retornado o valor de Simple (no = PC vai capturar; yes = PC so vai mover-se)
  level(Level),
  chooseMovePC(Moves, Move, Level, Board, Player, Simple),
  applyMovePC(Board, NewBoard, Move, Player, Simple).

/*
*Modo de jogo 1 Vs PC (loop de jogo)
*/
game1vsPC(InitialBoard):-
  retractall(gameState(_A,_B)),
  assert(gameState(InitialBoard, 1)),
	repeat,
		retract(gameState(Board, Player)),
		once(playGamePCorPlayer(Player, Board, NewPlayer, NewBoard1)),
		once(promotedToKing(NewBoard1, NewBoard)),
		assert(gameState(NewBoard, NewPlayer)),
		gameOver(NewBoard, NewPlayer),
    write('\33\[2J'),
    retract(gameState(_, _)),
    chooseGameMode.

/*
*Desenha rotulo/titulo do jogador, executa a jogada e atualiza
*o jogador a jogar
*/
playGamePCorPlayer(Player, Board, NewPlayer, NewBoard):-
	ite(Player = 1,
		playGame(Player, Board, NewPlayer, NewBoard),
		playGamePC(Player, Board, NewPlayer, NewBoard)).
