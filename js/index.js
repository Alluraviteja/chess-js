var noOfRowsAndColumns = 8;
var startRowNumber = 1;
var startColumnNumber = 1;
var chessPiecePawn = "pawn";
var chessPieceRook = "rook";
var chessPieceKnight = "knight";
var chessPieceBishop = "bishop";
var chessPieceQueen = "queen";
var chessPieceKing = "king";
var chessPieceWhite = "W";
var chessPieceBlack = "B";

var chessPieceColorLight = 'chessPieceColorLight';
var chessPieceColorDark = 'chessPieceColorDark';
var chessPieceColorGreen = 'chessPieceColorGreen';
var chessPieceColorRed = 'chessPieceColorRed';

const changeBackgroundElementList = [];
var toBeMovedChessPiece;
var currentPlayerTurn = chessPieceWhite;

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
            // if (r == 4 && c == 4) {
            //     chessPieceType = chessPieceKing;
            //     chessPieceColor = chessPieceBlack;
            //     li.innerHTML = '' + chessPieceColor + '|' + chessPieceType + '<img class="allimg" src="images/' + chessPieceColor + '' + chessPieceType + '.png" alt="">'
            // }

            // if (r == 5 && c == 1) {
            //     chessPieceType = chessPieceQueen;
            //     chessPieceColor = chessPieceWhite;
            //     li.innerHTML = '' + chessPieceColor + '|' + chessPieceType + '<img class="allimg" src="images/' + chessPieceColor + '' + chessPieceType + '.png" alt="">'
            // }

        }

        ul.appendChild(div);

    }

    document.getElementById('body').appendChild(ul);

}

document.querySelectorAll('.box').forEach(item => {

    item.addEventListener('click', function () {

        var clickedPieceName = item.innerText.split('|');
        var clicPieceColor = clickedPieceName[0];

        if (item.innerText && !item.classList.contains(chessPieceColorGreen)) {

            changePieceDefaultBackgroundColor(document.querySelectorAll('.box'));

            if (clicPieceColor == currentPlayerTurn) {

                var allValidMoves = [];
                var allInValidMoves = [];

                const { validMoves, invalidMoves } = getAllPossibleMovesByPiece(item);

                allValidMoves.push.apply(allValidMoves, validMoves);
                allInValidMoves.push.apply(allInValidMoves, invalidMoves);

                chessPiecesMovesColorChange(validMoves, invalidMoves);
                if (!(!Array.isArray(allValidMoves) || !allValidMoves.length))
                    toBeMovedChessPiece = item;

            }

        } else if ((!item.innerText && item.classList.contains(chessPieceColorGreen)) || (item.innerText && clicPieceColor != toBeMovedChessPiece.innerText.split('|')[0]
            && item.classList.contains(chessPieceColorGreen))) {

            item.innerHTML = toBeMovedChessPiece.innerHTML;
            toBeMovedChessPiece.innerHTML = '';

            const { allValidMoves, allInValidMoves } = getAllMovesByPiecesOfPlayer(currentPlayerTurn == chessPieceWhite ? chessPieceBlack : chessPieceWhite);
            var { isCheckmate } = isCheckmateCheck(currentPlayerTurn, allValidMoves);

            if (!isCheckmate) {

                changePlayerTurn();

                const { allValidMoves, allInValidMoves } = getAllMovesByPiecesOfPlayer(currentPlayerTurn == chessPieceWhite ? chessPieceBlack : chessPieceWhite);
                var { isCheckmate } = isCheckmateCheck(currentPlayerTurn, allValidMoves);
                if (isCheckmate) {
                    alert(currentPlayerTurn + " check mate");
                }

                changePieceDefaultBackgroundColor(document.querySelectorAll('.box'));

            } else {
                toBeMovedChessPiece.innerHTML = item.innerHTML;
                item.innerHTML = '';
                alert("Checkmate - cannot make the move");
            }

        }

    })

})

function changePlayerTurn() {

    if (currentPlayerTurn == chessPieceWhite) {
        currentPlayerTurn = chessPieceBlack;
        document.getElementById('playerTurn').innerText = "Black's Turn"
    } else {
        currentPlayerTurn = chessPieceWhite;
        document.getElementById('playerTurn').innerText = "White's Turn"
    }

}

function getElById(cellId) {
    return document.getElementById(cellId);
}

function removeAllColorClassInElement(element) {
    if (element)
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
        if (el) {
            removeAllColorClassInElement(el);
            el.classList.add(chessPieceColorGreen);
        }
    });

    selectedPieceInValidMovesList.forEach(function (el, index) {
        if (el) {
            removeAllColorClassInElement(el);
            el.classList.add(chessPieceColorRed);
        }
    });

}

function getAllMovesByPiecesOfPlayer(currentPlayerTurn) {

    var allLiElements = document.querySelectorAll('li');
    var allValidMoves = [];
    var allInValidMoves = [];

    allLiElements.forEach((item, index) => {

        if (item.innerText && item.innerText.startsWith(currentPlayerTurn)) {
            const { validMoves, invalidMoves } = getAllPossibleMovesByPiece(item);

            allValidMoves.push.apply(allValidMoves, validMoves);
            allInValidMoves.push.apply(allInValidMoves, invalidMoves);

        }

    });

    return { allValidMoves, allInValidMoves };

}

function isCheckmateCheck(playerColorTobeChecked, allValidMoves) {

    var isCheckmate = false;
    allValidMoves.forEach((item, index) => {

        if (item.innerText && item.innerText == playerColorTobeChecked + "|" + chessPieceKing) {
            isCheckmate = true;
        }

    });

    return { isCheckmate };

}

function getAllPossibleMovesByPiece(item) {

    var clickedPieceIndexes = item.id.split('|');
    var clickedPieceName = item.innerText.split('|');

    var cellIdName = clickedPieceIndexes[0];
    var rowIndex = parseInt(clickedPieceIndexes[1]);
    var columnIndex = parseInt(clickedPieceIndexes[2]);

    var clicPieceColor = clickedPieceName[0];
    var clicPieceName = clickedPieceName[1];

    var validMoves = [];
    var invalidMoves = [];

    if (clickedPieceName[1] == chessPiecePawn) {

        var { pawnMoves } = getCellsForPawnMoves(cellIdName, rowIndex, columnIndex, clicPieceColor);
        var { pawnValidMoves, pawnInValidMoves } = validatePawnMoves(clicPieceColor, clicPieceName, pawnMoves);

        validMoves.push.apply(validMoves, pawnValidMoves);
        invalidMoves.push.apply(invalidMoves, pawnInValidMoves);

    } else if (clickedPieceName[1] == chessPieceRook) {

        var { leftMoves, rightMoves, topMoves, bottomMoves } = getCellsForStraightMoves(cellIdName, rowIndex, columnIndex);
        var { rookValidMoves, rookInValidMoves } = validateStraightMoves(clicPieceColor, clicPieceName, leftMoves, rightMoves, topMoves, bottomMoves);

        validMoves.push.apply(validMoves, rookValidMoves);
        invalidMoves.push.apply(invalidMoves, rookInValidMoves);

    } else if (clickedPieceName[1] == chessPieceKnight) {

        var { knightMoves } = getCellsForKnightMoves(cellIdName, rowIndex, columnIndex);
        var { knightValidMoves, knightInValidMoves } = validateKnightMoves(clicPieceColor, clicPieceName, knightMoves);

        validMoves.push.apply(validMoves, knightValidMoves);
        invalidMoves.push.apply(invalidMoves, knightInValidMoves);

    } else if (clickedPieceName[1] == chessPieceBishop) {

        var { leftTopMoves, rightTopMoves, leftBottomMoves, rightBottomMoves } = getCellsForDiagonalMoves(cellIdName, rowIndex, columnIndex);
        var { selectedPieceValidMovesList, selectedPieceInValidMovesList } = validateDiagonalMoves(clicPieceColor, clicPieceName, leftTopMoves, rightTopMoves, leftBottomMoves, rightBottomMoves);

        validMoves.push.apply(validMoves, selectedPieceValidMovesList);
        invalidMoves.push.apply(invalidMoves, selectedPieceInValidMovesList);

    } else if (clickedPieceName[1] == chessPieceQueen) {

        var { leftTopMoves, rightTopMoves, leftBottomMoves, rightBottomMoves } = getCellsForDiagonalMoves(cellIdName, rowIndex, columnIndex);
        var { selectedPieceValidMovesList, selectedPieceInValidMovesList } = validateDiagonalMoves(clicPieceColor, clicPieceName, leftTopMoves, rightTopMoves, leftBottomMoves, rightBottomMoves);

        validMoves.push.apply(validMoves, selectedPieceValidMovesList);
        invalidMoves.push.apply(invalidMoves, selectedPieceInValidMovesList);

        var { leftMoves, rightMoves, topMoves, bottomMoves } = getCellsForStraightMoves(cellIdName, rowIndex, columnIndex);
        var { rookValidMoves, rookInValidMoves } = validateStraightMoves(clicPieceColor, clicPieceName, leftMoves, rightMoves, topMoves, bottomMoves);

        validMoves.push.apply(validMoves, rookValidMoves);
        invalidMoves.push.apply(invalidMoves, rookInValidMoves);

    } else if (clickedPieceName[1] == chessPieceKing) {

        var { singleMoves } = getCellsForSingleMoves(cellIdName, rowIndex, columnIndex);
        var { selectedPieceValidMovesList, selectedPieceInValidMovesList } = validateSingleMoves(clicPieceColor, clicPieceName, singleMoves);

        validMoves.push.apply(validMoves, selectedPieceValidMovesList);
        invalidMoves.push.apply(invalidMoves, selectedPieceInValidMovesList);

    }

    return { validMoves, invalidMoves };

}

function getCellsForDiagonalMoves(cellIdName, rowIndex, columnIndex) {

    var leftTopMoves = [];
    var rightTopMoves = [];
    var leftBottomMoves = [];
    var rightBottomMoves = [];

    for (var i = 1; i <= 8; i++) {
        leftTopMoves.push(getElById(cellIdName + '|' + (rowIndex - i) + '|' + (columnIndex - i)));
        rightTopMoves.push(getElById(cellIdName + '|' + (rowIndex - i) + '|' + (columnIndex + i)));
        leftBottomMoves.push(getElById(cellIdName + '|' + (rowIndex + i) + '|' + (columnIndex - i)));
        rightBottomMoves.push(getElById(cellIdName + '|' + (rowIndex + i) + '|' + (columnIndex + i)));
    }

    return { leftTopMoves, rightTopMoves, leftBottomMoves, rightBottomMoves };

}

function validateDiagonalMoves(clicPieceColor, clicPieceName, movesArr1, movesArr2, movesArr3, movesArr4) {

    var selectedPieceValidMovesList = [];
    var selectedPieceInValidMovesList = [];

    for (var i = 1; i <= 4; i++) {

        var movesArr = eval('movesArr' + i);

        var nextMoveIsValid = true;
        movesArr.forEach((move, i) => {
            if (move) {
                if (!nextMoveIsValid)
                    selectedPieceInValidMovesList.push(move);
                else if (!move.innerText)
                    selectedPieceValidMovesList.push(move);
                else if (move.innerText && move.innerText.split('|')[0] == clicPieceColor) {
                    selectedPieceInValidMovesList.push(move);
                    nextMoveIsValid = false;
                } else if (move.innerText && move.innerText.split('|')[0] != clicPieceColor && movesArr[i - 1] && movesArr[i - 1].innerText
                    && movesArr[i - 1].innerText.split('|')[0] != clicPieceColor) {
                    selectedPieceInValidMovesList.push(move);
                    nextMoveIsValid = false;
                } else {
                    selectedPieceValidMovesList.push(move);
                }
            }
        });

    }

    return { selectedPieceValidMovesList, selectedPieceInValidMovesList };

}

function getCellsForStraightMoves(cellIdName, rowIndex, columnIndex) {

    var leftMoves = [];
    var rightMoves = [];
    var topMoves = [];
    var bottomMoves = [];

    for (var i = rowIndex - 1; i >= startRowNumber; i--) {
        topMoves.push(getElById(cellIdName + '|' + i + '|' + columnIndex));
    }

    for (var i = rowIndex + 1; i <= noOfRowsAndColumns; i++) {
        bottomMoves.push(getElById(cellIdName + '|' + i + '|' + columnIndex));
    }

    for (var i = columnIndex - 1; i >= startColumnNumber; i--) {
        leftMoves.push(getElById(cellIdName + '|' + rowIndex + '|' + i));
    }

    for (var i = columnIndex + 1; i <= noOfRowsAndColumns; i++) {
        rightMoves.push(getElById(cellIdName + '|' + rowIndex + '|' + i));
    }

    return { leftMoves, rightMoves, topMoves, bottomMoves };

}

function validateStraightMoves(clicPieceColor, clicieceName, movesArr1, movesArr2, movesArr3, movesArr4) {

    var rookValidMoves = [];
    var rookInValidMoves = [];

    for (var i = 1; i <= 4; i++) {

        var movesArr = eval('movesArr' + i);

        var nextMoveIsValid = true;
        movesArr.forEach((move, i) => {
            if (move) {
                if (!nextMoveIsValid)
                    rookInValidMoves.push(move);
                else if (!move.innerText)
                    rookValidMoves.push(move);
                else if (move.innerText && move.innerText.split('|')[0] == clicPieceColor) {
                    rookInValidMoves.push(move);
                    nextMoveIsValid = false;
                } else if (move.innerText && move.innerText.split('|')[0] != clicPieceColor && movesArr[i - 1] && movesArr[i - 1].innerText
                    && movesArr[i - 1].innerText.split('|')[0] != clicPieceColor) {
                    rookInValidMoves.push(move);
                    nextMoveIsValid = false;
                } else {
                    rookValidMoves.push(move);
                }
            }
        });

    }

    return { rookValidMoves, rookInValidMoves };

}

function getCellsForKnightMoves(cellIdName, rowIndex, columnIndex) {

    var knightMoves = [];

    knightMoves.push(getElById(cellIdName + '|' + (rowIndex - 1) + '|' + (columnIndex - 2)));
    knightMoves.push(getElById(cellIdName + '|' + (rowIndex - 1) + '|' + (columnIndex + 2)));
    knightMoves.push(getElById(cellIdName + '|' + (rowIndex + 1) + '|' + (columnIndex - 2)));
    knightMoves.push(getElById(cellIdName + '|' + (rowIndex + 1) + '|' + (columnIndex + 2)));
    knightMoves.push(getElById(cellIdName + '|' + (rowIndex - 2) + '|' + (columnIndex + 1)));
    knightMoves.push(getElById(cellIdName + '|' + (rowIndex - 2) + '|' + (columnIndex - 1)));
    knightMoves.push(getElById(cellIdName + '|' + (rowIndex + 2) + '|' + (columnIndex + 1)));
    knightMoves.push(getElById(cellIdName + '|' + (rowIndex + 2) + '|' + (columnIndex - 1)));

    return { knightMoves };

}

function validateKnightMoves(clicPieceColor, clicPieceName, movesArr) {

    var knightValidMoves = [];
    var knightInValidMoves = [];

    for (var i = 0; i < movesArr.length; i++) {
        var move = movesArr[i];
        if (move) {
            if (!move.innerText)
                knightValidMoves.push(move);
            else if (move.innerText && move.innerText.split('|')[0] == clicPieceColor)
                knightInValidMoves.push(move);
            else
                knightValidMoves.push(move);
        }
    }

    return { knightValidMoves, knightInValidMoves };

}

function getCellsForSingleMoves(cellIdName, rowIndex, columnIndex) {

    var singleMoves = [];

    singleMoves.push(getElById(cellIdName + '|' + (rowIndex - 1) + '|' + (columnIndex - 1)));
    singleMoves.push(getElById(cellIdName + '|' + (rowIndex - 1) + '|' + (columnIndex)));
    singleMoves.push(getElById(cellIdName + '|' + (rowIndex - 1) + '|' + (columnIndex + 1)));
    singleMoves.push(getElById(cellIdName + '|' + (rowIndex) + '|' + (columnIndex - 1)));
    singleMoves.push(getElById(cellIdName + '|' + (rowIndex) + '|' + (columnIndex + 1)));
    singleMoves.push(getElById(cellIdName + '|' + (rowIndex + 1) + '|' + (columnIndex - 1)));
    singleMoves.push(getElById(cellIdName + '|' + (rowIndex + 1) + '|' + (columnIndex)));
    singleMoves.push(getElById(cellIdName + '|' + (rowIndex + 1) + '|' + (columnIndex + 1)));

    return { singleMoves };

}

function validateSingleMoves(clicPieceColor, clicieceName, movesArr) {

    var selectedPieceValidMovesList = [];
    var selectedPieceInValidMovesList = [];

    for (var i = 0; i < movesArr.length; i++) {
        var move = movesArr[i];
        if (move) {
            if (!move.innerText)
                selectedPieceValidMovesList.push(move);
            else if (move.innerText && move.innerText.split('|')[0] == clicPieceColor)
                selectedPieceInValidMovesList.push(move);
            else
                selectedPieceValidMovesList.push(move);
        }
    }

    return { selectedPieceValidMovesList, selectedPieceInValidMovesList };

}

function getCellsForPawnMoves(cellIdName, rowIndex, columnIndex, pieceColor) {

    var pawnMoves = [];

    if (pieceColor == chessPieceBlack) {

        pawnMoves.push(getElById(cellIdName + '|' + (rowIndex + 1) + '|' + columnIndex));
        pawnMoves.push(getElById(cellIdName + '|' + (rowIndex + 1) + '|' + (columnIndex + 1)));
        pawnMoves.push(getElById(cellIdName + '|' + (rowIndex + 1) + '|' + (columnIndex - 1)));
        if (rowIndex == 2) {
            pawnMoves.push(getElById(cellIdName + '|' + (rowIndex + 2) + '|' + columnIndex));
        }

    } else if (pieceColor == chessPieceWhite) {

        pawnMoves.push(getElById(cellIdName + '|' + (rowIndex - 1) + '|' + columnIndex));
        pawnMoves.push(getElById(cellIdName + '|' + (rowIndex - 1) + '|' + (columnIndex + 1)));
        pawnMoves.push(getElById(cellIdName + '|' + (rowIndex - 1) + '|' + (columnIndex - 1)));
        if (rowIndex == 7) {
            pawnMoves.push(getElById(cellIdName + '|' + (rowIndex - 2) + '|' + columnIndex));
        }

    }

    return { pawnMoves };

}

function validatePawnMoves(clicPieceColor, clicieceName, movesArr) {

    var pawnValidMoves = [];
    var pawnInValidMoves = [];

    for (var i = 0; i < movesArr.length; i++) {
        var move = movesArr[i];
        if (i == 0 && move.innerText) {
            pawnInValidMoves.push(move);
        } else if (i == 0 && !move.innerText) {
            pawnValidMoves.push(move);
        } else if ((i == 1 || i == 2) && move && move.innerText && move.innerText != "" && move.innerText.split("|")[0] != clicPieceColor) {
            pawnValidMoves.push(move);
        } else if ((i == 1 || i == 2) && move && move.innerText && move.innerText != "" && move.innerText.split("|")[0] == clicPieceColor) {
            pawnInValidMoves.push(move);
        } else if ((i == 1 || i == 2) && !move) {
            pawnInValidMoves.push(move);
        } else if ((i == 3) && movesArr[0] && !movesArr[0].innerText && move && !move.innerText) {
            pawnValidMoves.push(move);
        }

    }

    return { pawnValidMoves, pawnInValidMoves };

}
