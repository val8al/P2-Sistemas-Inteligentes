

/*
FEN SAMPLES. use them on BOARD_FEN_STRING to change the board

8/pp5k/p6p/3P1p1/8/3PK1/2P4P/8 w - - 0 36

r7/pp5k/7p/3P2p1/8/PP5P/1R5K/8 w - - 0 36

8/p7/8/8/8/8/7P/8 w - - 0 36

4k3/pppppppp/8/8/8/8/PPPPPPPP/4K3 w - - 0 1

rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1 *standard,not playable

*/
const BOARD_FEN_STRING='r7/pp5k/7p/3P2p1/8/PP5P/1R5K/8 w - - 0 36'
const   WIN_SCORE = 10000
var victory_flag = false;
var board,
    game = new Chess(BOARD_FEN_STRING);

/*The "AI" part starts here */

var informedRoot = function(game){

    var possibleMoves = game.ugly_moves();
    var bestMoveScore = -9999;
    var bestMoveFound = possibleMoves[0]
    for(var i = 0; i < possibleMoves.length; i++){//for every possible move
        game.ugly_move(possibleMoves[i]);
        var boardEval = -evaluateBoard(game.board());//do it, check the outcome 
        if(boardEval >= bestMoveScore){
            bestMoveScore = boardEval
            bestMoveFound = possibleMoves[i]
            //compare it to the other outcomes and declare best if so
        }
        game.undo(); //and undo it
    }
    return bestMoveFound
}
var uninformedRoot = function(game){
    var highestValue = 0
    var possibleMoves = game.ugly_moves();//movimientos posibles
    var bestMove = possibleMoves[0];
    console.log("length: "+possibleMoves.length)
    for(var i = 0;i < possibleMoves.length; i++){
        var nodeValue= -uninformedTree(possibleMoves[i],game,3,0)
        if(nodeValue > highestValue){
            console.log(nodeValue)
            bestMove = possibleMoves[i]
            highestValue = nodeValue
        }
    }
    return bestMove
}
var uninformedTree = function(node,game,depth,value){
   //console.log("current depth: "+depth+"|current value: "+depth)
   
   game.ugly_move(node)
   var nodeValue = (value + evaluateBoard(game.board()))/100
   if(depth === 0){
       game.undo()
       //console.log(nodeValue)
       return nodeValue
   }
   else{
        depth--;
        var possibleMoves = game.ugly_moves();
        for(var i = 0;i < possibleMoves.length; i++){
            
            nodeValue += uninformedTree(possibleMoves[i],game,depth,nodeValue);
        }
    
        game.undo();
   }
    
    return nodeValue
       
 
    
}
var generateTree = function(game, black, moves, previousEval ){

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
var getPieceValue = function (piece, x, y) {
    if (piece === null) {
        return 0;
    }
    var getAbsoluteValue = function (piece, isWhite, x ,y) {
        if (piece.type === 'p') {
            return 400 + ( isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x] );
        } else if (piece.type === 'r') {
            return 500 + ( isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x] );
        } else if (piece.type === 'k') {
            return 500 + ( isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x] );
        } else{
            return WIN_SCORE;
        } 
       // throw "Unknown piece type: " + piece.type;
    };

    var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x ,y);
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
};

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
        [15.0,  15.0,  15.0,  15.0,  15.0,  15.0,  15.0,  15.0],
        [5.0,  5.0,  10.0,  15.0,  10.0,  15.0,  10.0,  5.0],
        [1.0,  1.0,  5.0,  5.0,  5.0,  5.0,  1.0,  1.0],
        [0.5,  0.5,  1.0,  1.0,  1.0,  1.0,  0.5,  0.5],
        [-2.0,-2.0, -2.0, -2.0, -2.0, -2.0, -2.0,  -2.0],
        [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
    ];

var pawnEvalBlack = reverseArray(pawnEvalWhite);
var rookEvalWhite = [
    [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
];

var rookEvalBlack = reverseArray(rookEvalWhite);

var kingEvalWhite = [

    [ 3.0, 4.0, 4.0, 5.0, 5.0, 4.0, 4.0, 3.0],
    [ 3.0, 4.0, 4.0, 5.0, 5.0, 4.0, 4.0, 3.0],
    [ 3.0, 4.0, 4.0, 5.0, 5.0, 4.0, 4.0, 3.0],
    [ 3.0, 4.0, 4.0, 5.0, 5.0, 4.0, 4.0, 3.0],
    [ 1.0, 1.0,   2.0, 2.0, 2.0, 2.0, 1.0, 1.0],
    [  1.0, 1.0,   2.0, 2.0, 2.0, 2.0, 1.0, 1.0],
    [  0.0,  0.0,  0.0,  1.0,  1.0,  1.0,  0.0,  0.0 ],
    [ 0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0 ]
];

var kingEvalBlack = reverseArray(kingEvalWhite);






class Queue { 
    // Array is used to implement a Queue 
    constructor() { 
        this.items = []; 
    } 
    enqueue(element) {     
    // adding element to the queue 
    this.items.push(element); 
    } 
    dequeue() { 
        // removing element from the queue 
        // returns underflow when called  
        // on empty queue 
        if(this.isEmpty()) 
            return "Underflow"; 
        return this.items.shift(); 
    }     
    front() 
    { 
    // returns the Front element of  
    // the queue without removing it. 
    if(this.isEmpty()) 
        return "No elements in Queue"; 
    return this.items[0]; 
    } 
   
    isEmpty() 
    { 
        // return true if the queue is empty. 
        return this.items.length == 0; 
    } 
    size() 
    { 
    
    return this.items.length; 
    } 

    printQueue() 
    { 
    var str = ""; 
    for(var i = 0; i < this.items.length; i++) 
        str += this.items[i] +" "; 
    return str; 
    } 
} 


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


var positionCount;
var getBestMove = function (game) {
  
    if (game.game_over()||checkWin(game.board())) {
        alert('Game over');
    }

    positionCount = 0;
    var depth = parseInt($('#search-depth').find(':selected').text());

    var d = new Date().getTime();
    var bestMove = uninformedRoot(game);//call for making move to AI////////////////////////////////////////
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