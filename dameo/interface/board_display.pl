/*Predicado Para Mostrar o Tabuleiro*/
showBoard(X):- showRow(X, 1).
showRow(X, Y):- X = [],
	write('-------------------------------------'), nl,
	write('    |_A_|_B_|_C_|_D_|_E_|_F_|_G_|_H_|'), nl, nl, nl.
showRow(X, Y):- X = [H|R],
	Yn is (Y + 1),
	write('-------------------------------------'), nl,
	write('| '),
	write(Y),
	showRowValues(H), nl,
	showRow(R, Yn).
showRowValues(X):- X = [] , write(' |').
showRowValues(X):- X = [H|R],
	write(' | '),
	showPiece(H),
	showRowValues(R).
showPiece(X):- X = 1,
	put_code(219).
showPiece(X):- X = 2,
	write('O').
showPiece(X):- X = 0,
	write(' ').
showPiece(X):- X = 3,
	write('X').
showPiece(X):- X = 11,
	put_code(178).
showPiece(X):- X = 22,
	put_code(184).
