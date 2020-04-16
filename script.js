

/*
FEN SAMPLES. use them on BOARD_FEN_STRING to change the board

8/pp5k/p6p/3P1p1/8/3PK1/2P4P/8 w - - 0 36

r7/pp5k/7p/3P2p1/8/PP5P/1R5K/8 w - - 0 36

r7/pp5k/7p/3P2p1/8/PP5P/1R5K/8 w - - 0 36

8/p7/8/8/8/8/7P/8 w - - 0 36

4k3/pppppppp/8/8/8/8/PPPPPPPP/4K3 w - - 0 1

rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1 *standard,not playable

*/
const scenarios = [
    '1kr5/p4p2/1p2p3/3P2pP/P3pK2/PP5P/4R3/8 w - - 0 36',//0
    '4k3/1p4p1/p6r/8/8/8/R3PP2/4K3 w - - 0 1',//1
    'r7/pp5k/7p/3P2p1/8/PP5P/1R5K/8 w - - 0 36',//2
    '4k3/pppppppp/8/8/8/8/PPPPPPPP/4K3 w - - 0 1',//3
    '1kr5/pppppppp/8/8/8/8/PPPPPPPP/1KR5 w - - 0 1'//4
]
const BOARD_FEN_STRING=scenarios[2]
const   WIN_SCORE = 10000
var victory_flag = false;
var positionCount = 0;
var recursionDepth = 3

var board,
    game = new Chess(BOARD_FEN_STRING);

/*The "AI" part starts here */

var uninformedRoot = function(game){

    var possibleMoves = game.ugly_moves();
    var bestMoveScore = -9999;
    var bestMoveFound = possibleMoves[0]
    for(var i = 0; i < possibleMoves.length; i++){//for every possible move
        game.ugly_move(possibleMoves[i]);
        var boardEval = -simpleEvaluateBoard(game.board());//do it, check the outcome 
        positionCount ++;
        if(boardEval >= bestMoveScore){
            bestMoveScore = boardEval
            bestMoveFound = possibleMoves[i]
            //compare it to the other outcomes and declare best if so
        }
        game.undo(); //and undo it
    }
    return bestMoveFound
}
var informedRoot = function(game){
    var highestValue = -WIN_SCORE
    var possibleMoves = game.ugly_moves();
    var bestMove = possibleMoves[0];
    console.log("length: "+possibleMoves.length)
    for(var i = 0;i < possibleMoves.length; i++){
        var nodeValue= -informedTree(possibleMoves[i],game,recursionDepth,0)
        if(nodeValue > highestValue){
            console.log(nodeValue)
            bestMove = possibleMoves[i]
            highestValue = nodeValue
        }
    }
    return bestMove
}
var informedTree = function(node,game,depth,value){
   //console.log("current depth: "+depth+"|current value: "+depth)
   positionCount++;
   game.ugly_move(node)
   var nodeValue = (value + evaluateBoard(game.board()))/1000
   if(depth === 0){
       game.undo()
       //console.log(nodeValue)
       return nodeValue
   }
   else{
        depth--;
        var possibleMoves = game.ugly_moves();
        for(var i = 0;i < possibleMoves.length; i++){
            
            nodeValue += informedTree(possibleMoves[i],game,depth,nodeValue);
        }
    
        game.undo();
   }
    
    return nodeValue
       
 
    
}

var evaluateBoard = function (board) {
   
    var totalEvaluation = 0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            
            totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i ,j);
        }
    }
    return totalEvaluation;
};
var simpleEvaluateBoard = function (board) {
   
    var totalEvaluation = 0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if(board[i][j] != null){
                var pieceColor = board[i][j].color
                if(pieceColor ==='w'){
                    totalEvaluation = totalEvaluation 
                    + getSimpleValue(board[i][j],pieceColor, i ,j)
                }else{
                    totalEvaluation = totalEvaluation 
                    - getSimpleValue(board[i][j],pieceColor, i ,j)
                }
            }else{
                return 0;
            }
        }
    }
    return totalEvaluation;
};
var getPieceValue = function (piece, x, y) {
    if (piece === null) {
        return 0;
    }
    var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x ,y);
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
};
var getAbsoluteValue = function (piece, isWhite, x ,y) {
    if (piece.type === 'p') {
        return 800 + ( isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x] );
    } else if (piece.type === 'r') {
        return 1000 + ( isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x] );
    } else if (piece.type === 'k') {
        return 50 + ( isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x] );
    } else{
        return WIN_SCORE;
    } 

}
var getSimpleValue = function (piece, isWhite, x ,y) {
    if (piece.type === 'p') {
        return 1000 ;
    } else if (piece.type === 'r') {
        return 500 ;
    } else if (piece.type === 'k') {
        return 50 ;
    } else{
        return WIN_SCORE;
    } 

}
var checkWin = function (board) {
    
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            pawnValue = getPieceValue(board[i][j], i ,j)
            if(pawnValue >= WIN_SCORE 
                ||pawnValue <=-WIN_SCORE ){
                    
                    return  true;
            }
        }
    }
    return false;
};
var reverseArray = function(array) {
    return array.slice().reverse();
};



var pawnEvalWhite =
    [
        [100.0,  100.0,  100.0,  100.0,  100.0,  100.0,  100.0,  100.0],
        [50.0,  50.0,  50.0,  50.0,  50.0,  50.0,  50.0,  50.0],
        [35.0,  20.0,  20.0,  20.0,  20.0,  20.0,  20.0,  35.0],
        [10.0,  10.0,  10.0,  15.0,  10.0,  15.0,  10.0,  10.0],
        [1.0,  2.0,  5.0,  5.0,  5.0,  5.0,  2.0,  1.0],
        [1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1-0,  1.0],
        [-2.0,-2.0, -2.0, -2.0, -2.0, -2.0, -2.0,  -2.0],
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
    ];

var pawnEvalBlack = reverseArray(pawnEvalWhite);
var rookEvalWhite = [
    [  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0],
    [  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0],
    [  1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  1.0],
    [  1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  1.0],
    [  1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  1.0],
    [  1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  1.0],
    [  1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  1.0],
    [  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0]
];

var rookEvalBlack = reverseArray(rookEvalWhite);

var kingEvalWhite = [

    [ 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0],
    [ 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0],
    [ 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0],
    [ 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0],
    [ 1.0, 1.0,   2.0, 2.0, 2.0, 2.0, 1.0, 1.0],
    [  1.0, 1.0,   2.0, 2.0, 2.0, 2.0, 1.0, 1.0],
    [  0.0,  0.0,  0.0,  1.0,  1.0,  1.0,  0.0,  0.0 ],
    [ 0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0 ]
];

var kingEvalBlack = reverseArray(kingEvalWhite);


/* board visualization and games state handling.


the following was mostly written by Lauri Hartikka found
in freecodecamp.org/news/simple-chess-ai-step-by-step-1d55a9266977/*/

var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

var makeBestMove = function () {
    var bestMove = getBestMove(game);
    game.ugly_move(bestMove);
    board.position(game.fen());
    renderMoveHistory(game.history());
    if (game.game_over()||checkWin(game.board())) {
        alert('Game over');
    }
};



var getBestMove = function (game) {
  
    if (game.game_over()||checkWin(game.board())) {
        alert('Game over');
    }

    positionCount = 0;
    var depth = parseInt($('#search-depth').find(':selected').text());

    var d = new Date().getTime();
    var bestMove = informedRoot(game);//call for making move to AI////////////////////////////////////////
    var d2 = new Date().getTime();
    var moveTime = (d2 - d);
    var positionsPerS = ( positionCount * 1000 / moveTime);

    $('#position-count').text(positionCount);
    $('#time').text(moveTime/1000 + 's');
    $('#positions-per-s').text(positionsPerS);
    return bestMove;
};

var renderMoveHistory = function (moves) {
    var historyElement = $('#move-history').empty();
    historyElement.empty();
    for (var i = 0; i < moves.length; i = i + 2) {
        historyElement.append('<span>' + moves[i] + ' ' + ( moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
    }
    historyElement.scrollTop(historyElement[0].scrollHeight);

};

var onDrop = function (source, target) {

    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }

    renderMoveHistory(game.history());
    window.setTimeout(makeBestMove, 250);
};

var onSnapEnd = function () {
    board.position(game.fen());
};

var onMouseoverSquare = function(square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

var onMouseoutSquare = function(square, piece) {
    removeGreySquares();
};

var removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
    var squareEl = $('#board .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    //squareEl.css('background', background);
};

var cfg = {
    draggable: true,
    position:   BOARD_FEN_STRING,
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);