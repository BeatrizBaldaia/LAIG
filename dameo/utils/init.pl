%adversary(Jogador,Adversario).
adversary(1,2).
adversary(1,22).
adversary(11,2).
adversary(11,22).
adversary(2,1).
adversary(2,11).
adversary(22,1).
adversary(22,11).
isKing(22).
isKing(11).



create_board(Board):-
  Board = [
  [1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,0],
  [0,0,1,1,1,1,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,2,2,2,2,0,0],
  [0,2,2,2,2,2,2,0],
  [2,2,2,2,2,2,2,2]
  ].


/*Tabuleiro para testes*/
/*  create_board(Board):-
    Board = [
    [0,0,0,0,0,0,22,0],
    [0,0,0,2,0,0,0,0],
    [22,0,0,2,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,22,0,2,0,0,0],
    [0,0,0,2,0,0,0,0],
    [0,0,0,11,0,0,0,0]
    ].*/
