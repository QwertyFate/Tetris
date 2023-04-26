const Shapes = [
    [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]
    ],
    [
        [0,1,0],  
        [0,1,0],  
        [1,1,0]   
    ],
    [
        [0,1,0],
        [0,1,0],
        [0,1,1]
    ],
    [
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ],
    [
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],
    [
        [1,1,1],
        [0,1,0],
        [0,0,0]
    ],
    [
        [1,1],
        [1,1],
    ]
]

const Colors = [
    "#fff",
    "#9b5fe0",
    "#16a4d8",
    "#60dbe8",
    "#8bd346",
    "#efdf48",
    "#f9a52c",
    "#d64e12"
]

const Rows = 20;
const Cols = 10;


let canvas = document.querySelector("#tetris-canvas");
let ctx = canvas.getContext("2d");
ctx.scale(30,30);
let pieceobj = null;
let grid = generategrid();
let gamestate = false;
let scoreboard = document.querySelector("h2");
let score = 0;
let gamespeed = 500;
let gamecurrentspeed = setInterval(null,gamespeed);
let themesound = new Audio("tetristheme.mp3");
themesound.volume=0.1;
themesound.loop=true;
let gameoversound = new Audio("Gameover.mp3");
gameoversound.volume=0.1;
let rotatesound = new Audio("rotatesound.mp3");
rotatesound.volume=0.1;

function getpiece() {
    let ran = Math.floor(Math.random() * 7);    
    let shapepiece = Shapes[ran];
    let colorindex = Colors[ran+1];
    let colornumber = ran +1;
    let x = 4;
    let y = 0;
    return {shapepiece,colorindex,colornumber,x,y};
}


function renderpiece(){
    let piece = pieceobj.shapepiece;
    for (let i = 0; i<piece.length; i++){
        for(let j=0; j<piece[i].length; j++){
            if (piece[i][j] == 1){
                ctx.fillStyle = pieceobj.colorindex;
                ctx.fillRect(pieceobj.x+j,pieceobj.y+i,1,1);
            }
    }}
        
}


function startgame(){
        
        if (score >= 800 && score <= 1500){
            gamespeed = 400;
            clearInterval(gamecurrentspeed);
            gamecurrentspeed = setInterval(newgamestate,gamespeed);
        }
        else if(score >= 2001 && score <= 2500){
            gamespeed = 300;
            clearInterval(gamecurrentspeed);
            gamecurrentspeed = setInterval(newgamestate,gamespeed);
        }
        else if(score >= 3000 && score <= 3499){
            gamespeed = 200;
            clearInterval(gamecurrentspeed);
            gamecurrentspeed = setInterval(newgamestate,gamespeed);
        }
        else if(score >= 3500){
            gamespeed = 100;
            clearInterval(gamecurrentspeed);
            gamecurrentspeed = setInterval(newgamestate,gamespeed);
        }
        else{
            clearInterval(gamecurrentspeed);
            gamecurrentspeed = setInterval(newgamestate,gamespeed);
        }
}




function newgamestate(){
    checkgrid();
    if (pieceobj == null){
        pieceobj = getpiece();
        renderpiece();
    }
    movedown();
}

function generategrid(){
    let grid = [];
    for (let i=0;i<Rows;i++){
        grid.push([]);
        for (let j=0;j<Cols;j++){
            grid[i].push(0);
        }
}
return grid;
}


function checkgrid(){
    let count = 0;
    for (let i=0;i<grid.length;i++){
        let allFilled = true;
        for (let j=0; j<grid[0].length;j++){
            if (grid[i][j] == 0) {
                allFilled = false;
            }
        }
            if (allFilled){
                grid.splice(i,1);
                grid.unshift([0,0,0,0,0,0,0,0,0,0]);
                count++;
                startgame();
                
            }
        }
    if (count == 1){
        score += 100;
        
    }
    else if (count == 2){
        score += 300;
    } 
    else if (count == 3){
        score += 500;
    }
    else if (count > 3){
        score += 1000;
    }
    scoreboard.innerHTML = "Score: " + score;
    // if (score > 1000 && score < 2000){
    //     gamespeed = 300;
    // }
    // else if (score > 2000 && score < 3000){
    //     gamespeed = 200;
    // }
    // else if (score > 300 ){
    //     gamespeed = 100;
    // }
    
}


function rendergrid(){
    for (let i = 0; i < grid.length; i++){
        for (let j = 0; j < grid[i].length; j++){
            ctx.fillStyle = Colors[grid[i][j]];
            ctx.fillRect(j,i,1,1);
        }
    }
    renderpiece();
}

function movedown(){ 
    if(!collision(pieceobj.x,pieceobj.y+1))
    pieceobj.y += 1;
    else{
        let piece = pieceobj.shapepiece
        for(let i =0; i<piece.length;i++){
            for(let j = 0; j<piece[i].length;j++){
                if(piece[i][j] == 1){
                    let p = pieceobj.x+j;
                    let q = pieceobj.y+i;
                    grid[q][p] = pieceobj.colornumber;
                }
            }
    }
    if(pieceobj.y ==0){
        scoreboard.innerHTML = "Game Over <br> Final Score: " + score;
        grid = generategrid();
        score = 0;
        gamespeed = 500;
        themesound.pause();
        themesound.currentTime=0;
        gameoversound.play();
        clearInterval(gamecurrentspeed);
        gamecurrentspeed = setInterval(null,gamespeed);
        
        
       

    }
    pieceobj = null;
}
    rendergrid();
}

function moveleft(){
    if(!collision(pieceobj.x-1,pieceobj.y)) 
    pieceobj.x -= 1;
    rendergrid();
}

function moveright(){
    if(!collision(pieceobj.x+1,pieceobj.y)) 
    pieceobj.x += 1;
    rendergrid();
}

function rotate(){
    let rotatedPiece = [];
    let piece = pieceobj.shapepiece;
    for(let i=0;i<piece.length;i++){
        rotatedPiece.push([]);
        for(let j=0;j<piece[i].length;j++){
            rotatedPiece[i].push(0);
        }
    }
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            rotatedPiece[i][j] = piece[j][i]
        }
    }

    for(let i=0;i<rotatedPiece.length;i++){
        rotatedPiece[i] = rotatedPiece[i].reverse();
    }
    if(!collision(pieceobj.x,pieceobj.y,rotatedPiece))
        pieceobj.shapepiece = rotatedPiece
    rendergrid();
}

function collision(x,y, rotatedPiece){
    let piece = rotatedPiece || pieceobj.shapepiece;
    for(let i =0; i<piece.length;i++){
        for(let j = 0; j<piece[i].length;j++){
            if(piece[i][j] == 1){
                let p = x + j;
                let q = y + i;
                if(p>=0 && p<Cols && q >= 0 && q<Rows){
                    if(grid[q][p] > 0){
                        return true;
                    }
                }else {
                    return true;
                }
            }
        }
    }
    return false;
}

document.addEventListener("keydown", function(e){
    let key = e.code;
    if (key == "ArrowDown"){
        movedown();
    }
    else if (key == "ArrowLeft"){
        moveleft();
    }
    else if (key == "ArrowRight"){
        moveright();
    }
    else if (key == "ArrowUp"){
        rotatesound.pause();
        rotatesound.currentTime=0;
        rotatesound.play();
        console.log(e);
        rotate();
    }
    else if (key == "Space"){
        scoreboard.innerHTML = "Score: " + score;
        gameoversound.pause();
        gameoversound.currentTime=0; 
        themesound.play();
        startgame();
        console.log(gamestate);
    }else console.log(e, gamestate);
})

themesound.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
    themesound.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
}, false);