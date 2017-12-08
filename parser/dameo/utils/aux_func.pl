ite(If, Then, _Else):-
	If, !, Then.
ite(_If, _Then, Else):-
	Else.

removeCaptures(X-Y, NMoves, [], []).

removeCaptures(X-Y, Position, [OneMove | OtherMoves], UpdatedMoves) :-
	ite(nth1(Position, OneMove, X-Y),
		(removeCaptures(X-Y, Position, OtherMoves, UpdatedMovesAux), append([OneMove], UpdatedMovesAux, UpdatedMoves)),
		removeCaptures(X-Y, Position, OtherMoves, UpdatedMoves)).

abs(X,X) :- X >= 0, !.
abs(X,Y) :- Y is -X.

getBestCaptures([], Aux, Aux, NCaptures).
getBestCaptures([N-L | T], Best, Aux, NCaptures) :-
	N = NCaptures -> (
		append(Aux, L, Aux2), getBestCaptures(T, Best, Aux2, NCaptures)
	);
	Best = Aux.


getInteger(R):-
	repeat,
    	get_code(A),
		isInteger(A, R),!.
isInteger(49, 1).
isInteger(50, 2).
isInteger(51, 3).
isInteger(52, 4).
isInteger(53, 5).
isInteger(54, 6).
isInteger(55, 7).
isInteger(56, 8).
isInteger(57, 9).

getLetter(R):-
	repeat,
    	get_code(A),
		isLetter(A, R),!.
isLetter(97, 'A').
isLetter(98, 'B').
isLetter(99, 'C').
isLetter(100, 'D').
isLetter(101, 'E').
isLetter(102, 'F').
isLetter(103, 'G').
isLetter(104, 'H').
isLetter(65, 'A').
isLetter(66, 'B').
isLetter(67, 'C').
isLetter(68, 'D').
isLetter(69, 'E').
isLetter(70, 'F').
isLetter(71, 'G').
isLetter(72, 'H').
