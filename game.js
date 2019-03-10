var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

var ship = new Image();
var back = new Image();
var fg = new Image();
var planetUp = new Image();
var planetDown = new Image();

ship.src = "images/ship.png";
back.src = "images/back.png";
planetUp.src = "images/mercury.png";
planetDown.src = "images/sun.png";

var gap = 150;
var constant;

var bX = 350;
var bY = 300;

var gravity = 1;

var score = 0;

var fly = new Audio();
var scor = new Audio();

fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";

document.addEventListener("keydown",moveUp);

function moveUp(){
    bY -= 40;
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

        constant = planetUp.height+gap;
        ctx.drawImage(planetUp,pipe[i].x,pipe[i].y);
        ctx.drawImage(planetDown,pipe[i].x,pipe[i].y+constant);

        pipe[i].x--;

        if( pipe[i].x == 125 ){
            pipe.push({
                x : cvs.width,
                y : Math.floor(Math.random()*planetUp.height)-planetUp.height
            });
        }

        // detect collision

        if( bX + ship.width >= pipe[i].x && bX <= pipe[i].x + planetUp.width && (bY <= pipe[i].y + planetUp.height || bY+ship.height >= pipe[i].y+constant) || bY + ship.height >=  cvs.height - fg.height){
            location.reload(); // reload the page
        }

        if(pipe[i].x == 5){
            score++;
            scor.play();
        }


    }

    ctx.drawImage(ship,bX,bY);

    bY += gravity;

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "20px Verdana";
    ctx.fillText("Score : "+score,10,cvs.height-20);

    requestAnimationFrame(draw);

}

draw();
