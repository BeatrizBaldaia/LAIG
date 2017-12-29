chooseMovePCLevel1(Moves, Move):-
	random_member(Move, Moves).%Nivel 1

/*
*chooseMovePC(+Moves, -Move, +Level, +Board, +Player, +Simple)
*
*Escolher um dos movimentos possiveis
*/
chooseMovePC(Moves, Move, Level, Board, Player, Simple):-
  ite(Level = 1,
		chooseMovePCLevel1(Moves, Move),
		chooseMovePCLevel2(Moves, Move, Board, Player, Simple)).

chooseMovePCLevel2(Moves, Move, Board, Player, Simple):-
	parserMovePC(Moves,	Board, Player, Simple, Answer),
	sort(Answer, _L),
	reverse(_L,[NumMax-_Move|_Rest]),
	getBestMoves([NumMax-_Move|_Rest],_BestMoves,NumMax),
	random_member(Move, _BestMoves).

/*Prenche array de moves*/
getBestMoves([], [], _Num).
getBestMoves([Num-Move|Rest], Moves, NumMax):-
	ite(Num = NumMax,
		(getBestMoves(Rest, Mov, NumMax),
			Moves = [Move|Mov]),
		Moves = []).

parserMovePC([], Board, Player, Simple, []).
parserMovePC([Move|Rest], Board, Player, Simple, [Value-Move|ACC]):-
	changeBoard(Board, Move, Player, Simple, Value),
	parserMovePC(Rest, Board, Player, Simple, ACC).

/*
*Simula um movimento do PC e calcula o valor do mesmo
*/
changeBoard(Board, Move, Player, Simple, Value):-
	applyMovePC(Board, NewBoard, Move, Player, Simple),
	boardValue(NewBoard, Player, Value).

/*
*Predicado para obter o valor do Tabuleiro
*apos um movimento valido do PC
*/
boardValue(Board, Player, Value):-
	boardValue(Board, 1, Player, Value1, 0),
	ite(Player = 1, Ad = 2, Ad = 1),
	setof(Num,captureNumber(Board, X-Y, Num, Ad, Move),_L),
	reverse(_L,[Num|_Rest]),
	Value2 is Num*40,
	Value is Value1 - Value2.%Value1: valor obtido da disposicao das pecas no tabuleiro; Value2: numero de capturas que o adversario possa fazer com esta ultima jogada

boardValue(Board, 9, Player, Value, Value).

/*
*boardValue(+Board, +Y, +Player, -Value, +Acc)
*
*Calcular o valor do tabuleiro baseado na distribuicao
*das pecas no tabuleiro apos a jogada do Player.
*
*Igual a soma do valor calculado em cada linha do tabuleiro.
*/
boardValue(Board, Y, Player, Value, Acc):-
	nth1(Y, Board, Line),
	lineValue(Line, 1-Y, Player, ValueLine, 0),
	Y1 is Y+1,
	Acc1 is ValueLine + Acc,
	boardValue(Board, Y1, Player, Value, Acc1).

lineValue(Line, 9-Y, Player, Value, Value).
/*
*lineValue(+Line, +X-Y, +Player, -FinalValue, +Acc)
*
*Valor na linha Line
*/
lineValue(Line, X-Y, Player, FinalValue, Acc):-
	nth1(X, Line, Piece),
	valuePiece(Piece, Y, Num),
	ite(adversary(Player, Piece),
		Value is -Num,%e mau haver reis do jogador adversario
		Value is Num),
	X1 is X+1,
	Acc1 is Value + Acc,
	lineValue(Line, X1-Y, Player, FinalValue, Acc1).

/*
*Valores para cada posicao possivel no tabuleiro
*/
valuePiece(0, _Y, 0).
valuePiece(1, Y, Y).%quanto mais proximo estiver o jogador do extremo adversario, maior e o valor
valuePiece(2, Y, V):- V is 9-Y.%quanto mais proximo estiver o jogador do extremo adversario, maior e o valor
valuePiece(11, _Y, 30).
valuePiece(22, _Y, 30).
