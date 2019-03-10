var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

// load images

var ship = new Image();
var back = new Image();
var fg = new Image();
var planet = new Image();
var planet = new Image();

ship.src = "images/ship.png";
back.src = "images/back.png";
fg.src = "images/fg.png";
planet.src = "images/mercury.png";
planet.src = "images/mercury.png";


// some variables

var gap = 85;
var constant;

var bX = 10;
var bY = 150;

var gravity = 1.5;

var score = 0;

// audio files

var fly = new Audio();
var scor = new Audio();

fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";

// on key down

document.addEventListener("keydown",moveUp);

function moveUp(){
    bY -= 25;
    fly.play();
}

// pipe coordinates

var pipe = [];

pipe[0] = {
    x : cvs.width,
    y : 0
};

// draw images

function draw(){

    ctx.drawImage(back,0,0);


    for(var i = 0; i < pipe.length; i++){

        constant = planet.height+gap;
        ctx.drawImage(planet,pipe[i].x,pipe[i].y);
        ctx.drawImage(planet,pipe[i].x,pipe[i].y+constant);

        pipe[i].x--;

        if( pipe[i].x == 125 ){
            pipe.push({
                x : cvs.width,
                y : Math.floor(Math.random()*planet.height)-planet.height
            });
        }

        // detect collision

        if( bX + ship.width >= pipe[i].x && bX <= pipe[i].x + planet.width && (bY <= pipe[i].y + planet.height || bY+ship.height >= pipe[i].y+constant) || bY + ship.height >=  cvs.height - fg.height){
            location.reload(); // reload the page
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
