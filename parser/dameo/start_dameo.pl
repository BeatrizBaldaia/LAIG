:-use_module(library(lists)).
:-use_module(library(system)).
:-use_module(library(random)).


:-include('interface/board_display.pl').
:-include('interface/labels_display.pl').
:-include('interface/main_menu_display.pl').
:-include('interface/main_menu_choose.pl').

:-include('logic/ask_for_input.pl').
:-include('logic/choose_moves_PC.pl').
:-include('logic/loop_game.pl').
:-include('logic/player_capture.pl').
:-include('logic/player_king_move.pl').
:-include('logic/player_man_move.pl').
:-include('logic/player_PC_move.pl').
:-include('logic/promotion.pl').
:-include('logic/player_man_king_capture.pl').

:-include('utils/init.pl').
:-include('utils/map_positions.pl').
:-include('utils/aux_func.pl').

dameo :- assert(level(1)),chooseGameMode.

laigInterface(Board-Player-Moves,Res):- laigTeste(Board,Player,Moves), Res = 'FFFFFFFFFFF'.