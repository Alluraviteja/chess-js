var noOfRowsAndColumns = 8;
var startRowNumber = 1;
var startColumnNumber = 1;
var chessPieceRook = "rook";
var chessPieceKnight = "knight";
var chessPieceBishop = "bishop";
var chessPieceQueen = "queen";
var chessPieceKing = "king";
var chessPiecePawn = "pawn";
var chessPieceWhite = "W";
var chessPieceBlack = "B";

var chessPieceColorLight = 'chessPieceColorLight';
var chessPieceColorDark = 'chessPieceColorDark';
var chessPieceColorGreen = 'chessPieceColorGreen';
var chessPieceColorRed = 'chessPieceColorRed';

const changeBackgroundElementList = [];
var toBeMovedChessPiece;
var isWhitePlayerTurn = true;

createChessBoard()

//Create chess board, colors, assign pieces
function createChessBoard() {

    var ul = document.createElement('ul');

    for (var r = startRowNumber; r <= noOfRowsAndColumns; r++) {

        var chessPieceColor;

        if (r == startRowNumber + 1 || r == startRowNumber) {
            chessPieceColor = chessPieceBlack;
        } else {
            chessPieceColor = chessPieceWhite;
        }

        var div = document.createElement('div');
        div.setAttribute('class', 'divv');
        div.setAttribute('id', 'row' + r);

        for (var c = startColumnNumber; c <= noOfRowsAndColumns; c++) {

            var li = document.createElement('li');

            li.setAttribute('class', 'box');
            li.setAttribute('id', 'cell|' + r + '|' + c);
            li.style.cursor = 'pointer'

            div.appendChild(li);

            changeBackgroundElementList.push(li);
            //Set color to cells in chess
            changePieceDefaultBackgroundColor(changeBackgroundElementList);

            //Set default pieces images in cells
            if (r == startRowNumber || r == startRowNumber + 7) {
                var chessPieceType = "";
                switch (c) {
                    case 1:
                    case 8:
                        chessPieceType = chessPieceRook;
                        break;
                    case 2:
                    case 7:
                        chessPieceType = chessPieceKnight;
                        break;
                    case 3:
                    case 6:
                        chessPieceType = chessPieceBishop;
                        break;
                    case 4:
                        chessPieceType = chessPieceQueen
                        break;
                    case 5:
                        chessPieceType = chessPieceKing;
                        break;
                }
                li.innerHTML = '' + chessPieceColor + '|' + chessPieceType + '<img class="allimg" src="images/' + chessPieceColor + '' + chessPieceType + '.png" alt="">'
            } else if (r == startRowNumber + 1 || r == startRowNumber + 6) {
                li.innerHTML = '' + chessPieceColor + '|pawn<img class="allimg" src="images/' + chessPieceColor + chessPiecePawn + '.png" alt="">'
            }

            //Test
            if (r == 4 && c == 4) {
                chessPieceType = chessPieceRook;
                chessPieceColor = chessPieceBlack;
                li.innerHTML = '' + chessPieceColor + '|' + chessPieceType + '<img class="allimg" src="images/' + chessPieceColor + '' + chessPieceType + '.png" alt="">'
            }

        }

        ul.appendChild(div);

    }

    document.getElementById('body').appendChild(ul);

}

document.querySelectorAll('.box').forEach(item => {

    item.addEventListener('click', function () {

        if (item.innerText && !item.classList.contains(chessPieceColorGreen)) {

            var selectedPieceValidMovesList = [];
            var selectedPieceInValidMovesList = [];
            changePieceDefaultBackgroundColor(document.querySelectorAll('.box'));

            var clickedPieceIndexes = item.id.split('|');
            var clickedPieceName = item.innerText.split('|');

            switch (clickedPieceName[1]) {
                case chessPiecePawn:
                    if (clickedPieceName[0] == chessPieceBlack) {

                        var validMove1 = document.getElementById(clickedPieceIndexes[0] + '|' + (parseInt(clickedPieceIndexes[1]) + 1) + '|' + clickedPieceIndexes[2]);
                        var validMove2 = document.getElementById(clickedPieceIndexes[0] + '|' + (parseInt(clickedPieceIndexes[1]) + 2) + '|' + clickedPieceIndexes[2]);
                        var validMove3 = document.getElementById(clickedPieceIndexes[0] + '|' + (parseInt(clickedPieceIndexes[1]) + 1) + '|' + (parseInt(clickedPieceIndexes[2]) + 1));
                        var validMove4 = document.getElementById(clickedPieceIndexes[0] + '|' + (parseInt(clickedPieceIndexes[1]) + 1) + '|' + (parseInt(clickedPieceIndexes[2]) - 1));

                        if (validMove1.innerHTML)
                            selectedPieceInValidMovesList.push(validMove1);
                        else
                            selectedPieceValidMovesList.push(validMove1);

                        if (clickedPieceIndexes[1] == 2 && validMove1.innerText)
                            selectedPieceInValidMovesList.push(validMove2);
                        if (clickedPieceIndexes[1] == 2 && !validMove1.innerText && validMove2.innerText.split('|')[0] == clickedPieceName[0])
                            selectedPieceInValidMovesList.push(validMove2);
                        else if (clickedPieceIndexes[1] == 2 && !validMove1.innerText && validMove2.innerText.split('|')[0] != clickedPieceName[0])
                            selectedPieceValidMovesList.push(validMove2);
                        else if (clickedPieceIndexes[1] == 2)
                            selectedPieceValidMovesList.push(validMove2);

                        if (validMove3 && validMove3.innerText.split('|')[0] == chessPieceWhite)
                            selectedPieceValidMovesList.push(validMove3);

                        if (validMove4 && validMove4.innerText.split('|')[0] == chessPieceWhite)
                            selectedPieceValidMovesList.push(validMove4);

                    } else {

                    }
                    break;
                case chessPieceRook:

                    //Same column negative row
                    var possibleMovePieceColor = false;
                    for (var i = parseInt(clickedPieceIndexes[1]) - 1; i >= startRowNumber; i--) {
                        var nextElement = document.getElementById(clickedPieceIndexes[0] + '|' + (i) + '|' + clickedPieceIndexes[2]);
                        if (possibleMovePieceColor) {
                            selectedPieceInValidMovesList.push(nextElement);
                        } else if (!nextElement.innerHTML.split('|')[0]) {
                            selectedPieceValidMovesList.push(nextElement);
                        } else if (nextElement.innerHTML.split('|')[0] == clickedPieceName[0]) {
                            selectedPieceInValidMovesList.push(nextElement);
                            possibleMovePieceColor = true;
                        } else if (nextElement.innerHTML.split('|')[0] != clickedPieceName[0]) {
                            selectedPieceValidMovesList.push(nextElement);
                            possibleMovePieceColor = true;
                        }
                    }

                    //Same column positve row
                    possibleMovePieceColor = false;
                    for (var i = parseInt(clickedPieceIndexes[1]) + 1; i <= noOfRowsAndColumns; i++) {
                        var nextElement = document.getElementById(clickedPieceIndexes[0] + '|' + (i) + '|' + clickedPieceIndexes[2]);
                        if (possibleMovePieceColor) {
                            selectedPieceInValidMovesList.push(nextElement);
                        } else if (!nextElement.innerHTML.split('|')[0]) {
                            selectedPieceValidMovesList.push(nextElement);
                        } else if (nextElement.innerHTML.split('|')[0] == clickedPieceName[0]) {
                            selectedPieceInValidMovesList.push(nextElement);
                            possibleMovePieceColor = true;
                        } else if (nextElement.innerHTML.split('|')[0] != clickedPieceName[0]) {
                            selectedPieceValidMovesList.push(nextElement);
                            possibleMovePieceColor = true;
                        }
                    }

                    //Same row negative column
                    possibleMovePieceColor = false;
                    for (var i = parseInt(clickedPieceIndexes[2]) - 1; i >= startColumnNumber; i--) {
                        var nextElement = document.getElementById(clickedPieceIndexes[0] + '|' + (clickedPieceIndexes[1]) + '|' + i);
                        if (possibleMovePieceColor) {
                            selectedPieceInValidMovesList.push(nextElement);
                        } else if (!nextElement.innerHTML.split('|')[0]) {
                            selectedPieceValidMovesList.push(nextElement);
                        } else if (nextElement.innerHTML.split('|')[0] == clickedPieceName[0]) {
                            selectedPieceInValidMovesList.push(nextElement);
                            possibleMovePieceColor = true;
                        } else if (nextElement.innerHTML.split('|')[0] != clickedPieceName[0]) {
                            selectedPieceValidMovesList.push(nextElement);
                            possibleMovePieceColor = true;
                        }
                    }

                    //Same column negative row
                    possibleMovePieceColor = false;
                    for (var i = parseInt(clickedPieceIndexes[2]) + 1; i <= noOfRowsAndColumns; i++) {
                        var nextElement = document.getElementById(clickedPieceIndexes[0] + '|' + (clickedPieceIndexes[1]) + '|' + i);
                        if (possibleMovePieceColor) {
                            selectedPieceInValidMovesList.push(nextElement);
                        } else if (!nextElement.innerHTML.split('|')[0]) {
                            selectedPieceValidMovesList.push(nextElement);
                        } else if (nextElement.innerHTML.split('|')[0] == clickedPieceName[0]) {
                            selectedPieceInValidMovesList.push(nextElement);
                            possibleMovePieceColor = true;
                        } else if (nextElement.innerHTML.split('|')[0] != clickedPieceName[0]) {
                            selectedPieceValidMovesList.push(nextElement);
                            possibleMovePieceColor = true;
                        }
                    }

                    break;
                case chessPieceKnight:
                    break;
                case chessPieceBishop:
                    break;
                case chessPieceQueen:
                    break;
                case chessPieceKing:
                    break;
            }

            chessPiecesMovesColorChange(selectedPieceValidMovesList, selectedPieceInValidMovesList);
            if (!(!Array.isArray(selectedPieceValidMovesList) || !selectedPieceValidMovesList.length)) toBeMovedChessPiece = item;

        } else if (!item.innerText && item.classList.contains(chessPieceColorGreen)) {

            item.innerHTML = toBeMovedChessPiece.innerHTML;
            toBeMovedChessPiece.innerHTML = '';
            changePieceDefaultBackgroundColor(document.querySelectorAll('.box'));

        } else if (item.innerText && item.innerText.split('|')[0] != toBeMovedChessPiece.innerText.split('|')[0]
            && item.classList.contains(chessPieceColorGreen)) {

            item.innerHTML = toBeMovedChessPiece.innerHTML;
            toBeMovedChessPiece.innerHTML = '';
            changePieceDefaultBackgroundColor(document.querySelectorAll('.box'));

        }

    })

})

function removeAllColorClassInElement(element) {
    element.classList.remove(chessPieceColorLight, chessPieceColorDark, chessPieceColorGreen, chessPieceColorRed);
}

function changePieceDefaultBackgroundColor(elList) {

    elList.forEach(function (el, index) {
        var elCellDetails = el.id.split('|');
        removeAllColorClassInElement(el);
        if ((parseInt(elCellDetails[1]) + parseInt(elCellDetails[2])) % 2 == 0)
            el.classList.add(chessPieceColorLight);
        else
            el.classList.add(chessPieceColorDark);
    });

}

function chessPiecesMovesColorChange(selectedPieceValidMovesList, selectedPieceInValidMovesList) {

    selectedPieceValidMovesList.forEach(function (el, index) {
        removeAllColorClassInElement(el);
        el.classList.add(chessPieceColorGreen);
    });

    selectedPieceInValidMovesList.forEach(function (el, index) {
        removeAllColorClassInElement(el);
        el.classList.add(chessPieceColorRed);
    });

}

function changePlayerTurn() {
    isWhitePlayerTurn = !isWhitePlayerTurn;

}

//B|rook<img class="allimg" src="images/Brook.png" alt="">
