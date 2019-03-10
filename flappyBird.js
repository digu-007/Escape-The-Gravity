alert(window.innerWidth);

var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

var ship = new Image();
var back = new Image();
var fg = new Image();
var uranus = new Image();
var venus = new Image();

ship.src = "images/ship.png";
back.src = "images/back.png";
fg.src = "images/fg.png";
uranus.src = "images/uranus.png";
venus.src = "images/venus.png";

var gap = 85;
var constant;

var bX = 10;
var bY = 150;

var gravity = 1.5;

var score = 0;

var fly = new Audio();
var scor = new Audio();

fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";

document.addEventListener("keydown",moveUp);

function moveUp(){
    bY -= 25;
    fly.play();
}

var pipe = [];

pipe[0] = {
    x : cvs.width,
    y : 0
};

function draw(){

    ctx.drawImage(back,0,0);


    for(var i = 0; i < pipe.length; i++){

        constant = uranus.height+gap;
        ctx.drawImage(uranus,pipe[i].x,pipe[i].y);
        ctx.drawImage(venus,pipe[i].x,pipe[i].y+constant);

        pipe[i].x--;

        if( pipe[i].x == 125 ){
            pipe.push({
                x : cvs.width,
                y : Math.floor(Math.random()*uranus.height)-uranus.height
            });
        }

        if( bX + ship.width >= pipe[i].x && bX <= pipe[i].x + uranus.width && (bY <= pipe[i].y + uranus.height || bY+ship.height >= pipe[i].y+constant) || bY + ship.height >=  cvs.height - fg.height){
            location.reload();
        }

        if(pipe[i].x == 5){
            score++;
            scor.play();
        }


    }

    ctx.drawImage(fg,0,cvs.height - fg.height);

    ctx.drawImage(ship,bX,bY);

    bY += gravity;

    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : "+score,10,cvs.height-20);

    requestAnimationFrame(draw);

}

draw();
