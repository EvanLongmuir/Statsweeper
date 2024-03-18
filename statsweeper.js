//Contains the Logic for the game

// STILL NEED TO MAKE SURE FIRST MINE IS NOT A BOMB

export const TILE_STATUSES = {
    HIDDEN: 'hidden',
    MINE: 'mine',
    NUMBER: 'number',
    MARKED: 'marked'
}

export function createBoard(boardSize, numberOfMines){
    const board = []
    const minePositions = getMinePositions(boardSize, numberOfMines)

    for (let x = 0; x < boardSize; x++){
        const row = []
        for(let y = 0; y < boardSize; y++){
            const element = document.createElement('div')
            element.dataset.status = TILE_STATUSES.HIDDEN

            const tile = {
                //variables
                element,
                x,
                y,
                mine: minePositions.some(p => positionsMatch(p, {x, y})), 
                neighbours: mineNeighbours(x, y, minePositions),
                //getters & setters
                get status(){
                    return this.element.dataset.status
                },
                set status(value) {
                    this.element.dataset.status = value
                }
            }

            row.push(tile)
        }
        board.push(row)
    }

    return board
}

export function markTile(tile){
    if(tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.MARKED){
        return
    }

    if (tile.status === TILE_STATUSES.MARKED){
        tile.status = TILE_STATUSES.HIDDEN
    }
    else {
        tile.status = TILE_STATUSES.MARKED
    }
}

export function revealTile(tile, board){
    if (tile.status !== TILE_STATUSES.HIDDEN){
        return
    }

    if (tile.mine) {
        tile.status = TILE_STATUSES.MINE
        return
    }

    tile.status = TILE_STATUSES.NUMBER
    if (tile.neighbours === 0){
        const neighbours = adjacentTiles(board, tile)
        neighbours.forEach(neighbourTile => {
            revealTile(neighbourTile, board)
        });
    }
    else{
        tile.element.textContent = tile.neighbours
    }
}

export function checkWin(board){
    return board.every(row => {
        return row.every(tile => {
            return tile.status === TILE_STATUSES.NUMBER || tile.mine
        })
    })
}

export function checkLoose(board){
    return board.some(row =>{
        return row.some(tile =>{
            return tile.status === TILE_STATUSES.MINE //if a revealed tile is a mine
        })
    })
}

function mineNeighbours(x, y, minePositions){
    if(minePositions.some(p => positionsMatch(p, {x, y}))){ //check if current tile is a mine
        return 0
    }
    let count = 0
    for (let i = -1; i < 2; i++){
        for(let j = -1; j < 2; j++){
            if(i !== 0 || j !== 0){
                let curX = x+i
                let curY = y+j
                if(minePositions.some(p => positionsMatch(p, {x: curX, y: curY}))){
                    count++
                }
            }
        }

    }
    return count
}

function adjacentTiles(board, {x, y}){
    const tiles = []

    for (let i = -1; i < 2; i++){
        for(let j = -1; j < 2; j++){
            if(i !== 0 || j !== 0){
                const tile = board[x + i]?.[y + j]
                if (tile) tiles.push(tile)
            }
        }

    }
    return tiles
}

function getMinePositions(boardSize, numberOfMines){
    const positions = []

    while (positions.length < numberOfMines) {
        const position = {
            x: randomNumber(boardSize),
            y: randomNumber(boardSize)
        }

        // this syntax loops through all elements of positions and if ANY return true for the positionMatch function than .some() returns true
        if (!positions.some(p => positionsMatch(p, position))){
            positions.push(position)
        }
    }

    return positions
}

function positionsMatch(a, b){
    return a.x === b.x && a.y === b.y
}

function randomNumber(maxValue){
    return Math.floor(Math.random() * maxValue)
}