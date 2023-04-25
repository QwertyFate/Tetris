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





setInterval(newgamestate,300);
function newgamestate(){
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
    return null;
}

function collision(x,y){
    let piece = pieceobj.shapepiece;
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
        rotate();
    }
})