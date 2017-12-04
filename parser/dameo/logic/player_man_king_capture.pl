:- dynamic maxSteps/1,
           capturesList/1.

canManCapture(CurrBoard, Player, X-Y, Direction, NewX-NewY, AdversaryMan, AdversaryKing) :-
  findPiece(CurrBoard, X-Y, Player),
  ite(Direction = left,
    (
      X1 is X - 1, findPiece(CurrBoard, X1-Y, Pl),
      member(Pl, [AdversaryMan, AdversaryKing]),
      X2 is X - 2, findPiece(CurrBoard, X2-Y, 0),
      NewX is X2, NewY is Y
    ),
    (
      ite(Direction = right,
        (
          X1 is X + 1, findPiece(CurrBoard, X1-Y, Pr),
          member(Pr, [AdversaryMan, AdversaryKing]),
          X2 is X + 2, findPiece(CurrBoard, X2-Y, 0),
          NewX is X2, NewY is Y
        ),
        (
          ite(Direction = back,
            (
             Y1 is Y + 1, findPiece(CurrBoard, X-Y1, Pb),
             member(Pb, [AdversaryMan, AdversaryKing]),
             Y2 is Y + 2, findPiece(CurrBoard, X-Y2, 0),
             NewX is X, NewY is Y2
            ),
            (
            ite(Direction = front,
              (
               Y1 is Y - 1, findPiece(CurrBoard, X-Y1, Pf),
               member(Pf, [AdversaryMan, AdversaryKing]),
               Y2 is Y - 2, findPiece(CurrBoard, X-Y2, 0),
               NewX is X, NewY is Y2
              ),
              fail
            ))
        ))
    ))
).

canKingCapture(CurrBoard, AuxBoard, Player, X-Y, Direction, NewX-NewY, AdversaryMan, AdversaryKing) :-
  ite(Player = 1, findPiece(CurrBoard, X-Y, 11), findPiece(CurrBoard, X-Y, 22)),
      ite(Direction = left,
      (%CAN CAPTURE LEFT???
      X1 is X - 1, findPiece(CurrBoard, X1-Y, P),
      ite(member(P, [AdversaryMan, AdversaryKing]),
      (
        X2 is X - 2, findPiece(CurrBoard, X2-Y, 0),
        NewX is X2, NewY is Y,
        AuxBoard =  CurrBoard
      ),
        ite(P = 0,%PODE MOVER EM RETA
          (
          updateBoardSimpleMove(CurrBoard, NewBoard, X-Y, X1-Y, Player),
          canKingCapture(NewBoard, AuxBoard, Player, X1-Y, Direction, NewX-NewY, AdversaryMan, AdversaryKing)
          ),
          fail
      ))
      ),%END CAN CAPTURE LEFT
      (
      ite(Direction = right,
      (%CAN CAPTURE RIGHT???
      X1 is X + 1, findPiece(CurrBoard, X1-Y, P2),
      ite(member(P2, [AdversaryMan, AdversaryKing]),
      (
        X2 is X + 2, findPiece(CurrBoard, X2-Y, 0),
        NewX is X2, NewY is Y,
        AuxBoard =  CurrBoard
      ),
        ite(P2 = 0,%PODE MOVER EM RETA
        (
          updateBoardSimpleMove(CurrBoard, NewBoard2, X-Y, X1-Y, Player),
          canKingCapture(NewBoard2, AuxBoard, Player, X1-Y, Direction, NewX-NewY, AdversaryMan, AdversaryKing)
          ),
          fail
        ))
      ),%END CAN CAPTURE RIGHT
      (
      ite(Direction = back,
      (%CAN CAPTURE BACK???
        Y1 is Y + 1, findPiece(CurrBoard, X-Y1, P3),
        ite(member(P3, [AdversaryMan, AdversaryKing]),
        (
          Y2 is Y + 2, findPiece(CurrBoard, X-Y2, 0),
          NewX is X, NewY is Y2,
          AuxBoard =  CurrBoard
        ),
        ite(P3 = 0,%PODE MOVER EM RETA
        (
          updateBoardSimpleMove(CurrBoard, NewBoard3, X-Y, X-Y1, Player),
          canKingCapture(NewBoard3, AuxBoard, Player, X-Y1, Direction, NewX-NewY, AdversaryMan, AdversaryKing)
        ),
          fail
        ))
      ),%END CAN CAPTURE BACK
      (
      ite(Direction = front,
        (%CAN CAPTURE FRONT???
          Y1 is Y - 1, findPiece(CurrBoard, X-Y1, P4),
          ite(member(P4, [AdversaryMan, AdversaryKing]),
          (
            Y2 is Y - 2, findPiece(CurrBoard, X-Y2, 0),
            NewX is X, NewY is Y2,
            AuxBoard =  CurrBoard
          ),
          ite(P4 = 0,%PODE MOVER EM RETA
          (
            updateBoardSimpleMove(CurrBoard, NewBoard4, X-Y, X-Y1, Player),
            canKingCapture(NewBoard4, AuxBoard, Player, X-Y1, Direction, NewX-NewY, AdversaryMan, AdversaryKing)
          ),
            fail
          ))
        ),%END CAN CAPTURE FRONT
          fail)
      )
      ))
      ))
    ).


getCapturesList(CurrBoard, X-Y, Player, Paths, NCaptures) :-
  member(X, [1, 2, 3, 4, 5, 6, 7, 8]),
  member(Y, [1, 2, 3, 4, 5, 6, 7, 8]),
  assert(maxSteps(0)),
  assert(capturesList([])),
  findManCapturesPaths(CurrBoard, X-Y, Player, [X-Y], 0),
  findKingCapturesPaths(CurrBoard, X-Y, Player, [X-Y], 0),
  retract(capturesList(Paths)), retract(maxSteps(NCaptures)).

findManCapturesPaths(CurrBoard, X-Y, Player, Path, N) :-
  ite(ite(Player = 1, canManCapture(CurrBoard, Player, X-Y, left, NewX-NewY, 2, 22), canManCapture(CurrBoard, Player, X-Y, left, NewX-NewY, 1, 11)),
    (N1 is N + 1,
    updateBoardCaptureMove(CurrBoard, NewBoard, X-Y, NewX-NewY, Player, 3),
    append(Path, [NewX-NewY], NextStep),
    findManCapturesPaths(NewBoard, NewX-NewY, Player, NextStep, N1)),
    true),
  ite(ite(Player = 1, canManCapture(CurrBoard, Player, X-Y, right, NewX2-NewY2, 2, 22), canManCapture(CurrBoard, Player, X-Y, right, NewX2-NewY2, 1, 11)),
    (N2 is N + 1,
    updateBoardCaptureMove(CurrBoard, NewBoard2, X-Y, NewX2-NewY2, Player, 3),
    append(Path, [NewX2-NewY2], NextStep2),
    findManCapturesPaths(NewBoard2, NewX2-NewY2, Player, NextStep2, N2)),
    true),
  ite(ite(Player = 1, canManCapture(CurrBoard, Player, X-Y, back, NewX3-NewY3, 2, 22), canManCapture(CurrBoard, Player, X-Y, back, NewX3-NewY3, 1, 11)),
    (N3 is N + 1,
    updateBoardCaptureMove(CurrBoard, NewBoard3, X-Y, NewX3-NewY3, Player, 3),
    append(Path, [NewX3-NewY3], NextStep3),
    findManCapturesPaths(NewBoard3, NewX3-NewY3, Player, NextStep3, N3)),
    true),
  ite(ite(Player = 1, canManCapture(CurrBoard, Player, X-Y, front, NewX4-NewY4, 2, 22), canManCapture(CurrBoard, Player, X-Y, front, NewX4-NewY4, 1, 11)),
    (N4 is N + 1,
    updateBoardCaptureMove(CurrBoard, NewBoard4, X-Y, NewX4-NewY4, Player, 3),
    append(Path, [NewX4-NewY4], NextStep4),
    findManCapturesPaths(NewBoard4, NewX4-NewY4, Player, NextStep4, N4)),
    true),


  ite((maxSteps(Max), N = Max), (retract(capturesList(L)), append(L, [Path], PathToSave), assert(capturesList(PathToSave))), true),
  ite((maxSteps(Max), N > Max), (retract(capturesList(_)), assert(capturesList([Path])), retract(maxSteps(_)), assert(maxSteps(N))), true).

  findKingCapturesPaths(CurrBoard, X-Y, Player, Path, N) :-
    ite(Player = 1, King is 11, King is 22),
    ite(ite(Player = 1, canKingCapture(CurrBoard, AuxBoard, Player, X-Y, left, NewX-NewY, 2, 22), canKingCapture(CurrBoard, AuxBoard, Player, X-Y, left, NewX-NewY, 1, 11)),
      (N1 is N + 1,
      Xaux is NewX + 2,
      updateBoardCaptureMove(AuxBoard, NewBoard, Xaux-Y, NewX-NewY, King, 3),
      append(Path, [NewX-NewY], NextStep),
      findKingCapturesPaths(NewBoard, NewX-NewY, Player, NextStep, N1)),
      true),
    ite(ite(Player = 1, canKingCapture(CurrBoard, AuxBoard2, Player, X-Y, right, NewX2-NewY2, 2, 22), canKingCapture(CurrBoard, AuxBoard2, Player, X-Y, right, NewX2-NewY2, 1, 11)),
      (N2 is N + 1,
      Xaux is NewX2 - 2,
      updateBoardCaptureMove(AuxBoard2, NewBoard2, Xaux-Y, NewX2-NewY2, King, 3),
      append(Path, [NewX2-NewY2], NextStep2),
      findKingCapturesPaths(NewBoard2, NewX2-NewY2, Player, NextStep2, N2)),
      true),
    ite(ite(Player = 1, canKingCapture(CurrBoard, AuxBoard3, Player, X-Y, back, NewX3-NewY3, 2, 22), canKingCapture(CurrBoard, AuxBoard3, Player, X-Y, back, NewX3-NewY3, 1, 11)),
      (N3 is N + 1,
      Yaux is NewY3 - 2,
      updateBoardCaptureMove(AuxBoard3, NewBoard3, X-Yaux, NewX3-NewY3, King, 3),
      append(Path, [NewX3-NewY3], NextStep3),
      findKingCapturesPaths(NewBoard3, NewX3-NewY3, Player, NextStep3, N3)),
      true),
    ite(ite(Player = 1, canKingCapture(CurrBoard, AuxBoard4, Player, X-Y, front, NewX4-NewY4, 2, 22), canKingCapture(CurrBoard, AuxBoard4, Player, X-Y, front, NewX4-NewY4, 1, 11)),
      (N4 is N + 1,
      Yaux is NewY4 + 2,
      updateBoardCaptureMove(AuxBoard4, NewBoard4, X-Yaux, NewX4-NewY4, King, 3),
      append(Path, [NewX4-NewY4], NextStep4),
      findKingCapturesPaths(NewBoard4, NewX4-NewY4, Player, NextStep4, N4)),
      true),
    ite((maxSteps(Max), N = Max), (retract(capturesList(L)), append(L, [Path], PathToSave), assert(capturesList(PathToSave))), true),
    ite((maxSteps(Max), N > Max), (retract(capturesList(_)),  assert(capturesList([Path])), retract(maxSteps(_)), assert(maxSteps(N))), true).
