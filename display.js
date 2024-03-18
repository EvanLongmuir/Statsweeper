//contains the code to display the game on the webpage

import {
    TILE_STATUSES, 
    createBoard, 
    markTile, 
    revealTile,
    checkWin,
    checkLoose
} from './statsweeper.js'

const BOARD_SIZE = 10
const NUMBER_OF_MINES = 10

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
const boardElement = document.querySelector('.board')
const minesLeftText = document.querySelector('[data-mine-count]')
const messageText = document.querySelector('.subtext')

console.log(board)
board.forEach(row => {
    row.forEach(tile =>{
        boardElement.append(tile.element)
        tile.element.addEventListener('click', () => { //left click listener
            revealTile(tile, board)
            checkGameEnd()
        })
        tile.element.addEventListener('contextmenu', e =>{ //right click listener
            e.preventDefault() //prevents the right click menu
            markTile(tile)
            listMinesLeft()
        })
    })
})
boardElement.style.setProperty('--size', BOARD_SIZE)
minesLeftText.textContent = NUMBER_OF_MINES

function listMinesLeft(){
    const markedTilesCount = board.reduce((count, row) => {
        return (count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length)
    }, 0)

    minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount
}

function checkGameEnd(){
    const win = checkWin(board)
    const lose = checkLoose(board)

    if (win || lose){
        boardElement.addEventListener('click', stopProp, {capture: true})
        boardElement.addEventListener('contextmenu', stopProp, {capture: true})
    }

    if (win){
        messageText.textContent = "You Win"
    }
    if (lose){
        messageText.textContent = "You Lose"
        board.forEach(row => {
            row.forEach(tile =>{
                if (tile.mine) revealTile(tile)
            })
        })
    }
}

function stopProp(e){
    e.stopImmediatePropagation()
}