const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const scoreText = document.getElementById("score");
const reset = document.getElementById("button");
const space = document.getElementById("space");
const invText = document.getElementById("invaders");


const playerShootSpeed = -20;

//Sound
const music = new Audio("sounds/single-moment.mp3");
music.loop = true;
music.volume = "0.3";

const playerShot = new Audio("sounds/playerShot.mp3");
playerShot.playbackRate = 5;


const plDeath = new Audio("sounds/playerDead.mp3");
const invDeath = new Audio("sounds/invDead.mp3");
const invShot = new Audio("sounds/invShot.mp3");
invDeath.playbackRate = 5;
invShot.volume = "0.2";
const gameover = new Audio("sounds/game-over.mp3");





canvas.width = 1024;
canvas.height = 700;

class Player {
    constructor() {
        this.velocity = {
            x:0,
            y:0
        }

        this.rotation = 0;
        this.opacity = 1;

        const image = new Image();
        image.src = "./images/player.png";
        const scale = 0.3;
        image.onload = () => {
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x:canvas.width/2 - this.width/2,
                y:canvas.height - this.height - 20
            }
        }
    }

    draw() {
        // Save and restore to tilt and hide ship
        c.save();
        c.globalAlpha = this.opacity;
        c.translate(
            player.position.x + player.width/2, 
            this.position.y + player.height/2
            )

        c.rotate(this.rotation)
        
        c.translate(
            -player.position.x - player.width/2, 
            -this.position.y - player.height/2
        );
        
        if (this.image) 
            c.drawImage(
                this.image, 
                this.position.x, 
                this.position.y, 
                this.width, 
                this.height
            );

        c.restore();
    }

    update() {
        if (this.image) {
            this.draw();
            this.position.x += this.velocity.x;
        }

    }
}

class Projectile {
    constructor({position, velocity}){
        this.position = position;
        this.velocity = velocity;

        this.radius=3;

    }
    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2);
        c.fillStyle = "red";
        c.fill();
        c.closePath();
    }

    update() {
        this.draw();
        this.position.x+= this.velocity.x
        this.position.y+= this.velocity.y
    }
};

class Particle {
    constructor({position, velocity, radius, color, fades}){
        this.position = position;
        this.velocity = velocity;

        this.radius = radius;
        this.color = color;
        this.opacity = 1;
        this.fades = fades || false;

    }
    draw() {
        c.save()
        c.globalAlpha = this.opacity;
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();

        c.restore()
    }

    update() {
        this.draw();
        this.position.x+= this.velocity.x
        this.position.y+= this.velocity.y

        if (this.fades) this.opacity -= 0.02;

    }
};

class InvaderProjectile {
    constructor({position, velocity}){
        this.position = position;
        this.velocity = velocity;

        this.width=10;
        this.height=20;
    }
    draw() {
        c.fillStyle = "orange";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.position.x+= this.velocity.x
        this.position.y+= this.velocity.y
    }
};

class Invader {
    constructor ({position}) {
        this.velocity = {
            x:0,
            y:0
        }

        const image = new Image();
        image.src = "./images/enemy.png";
        const scale = 0.4;
        image.onload = () => {
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: position.x,
                y: position.y
            }
        }
    }

    draw() {
        // c.fillStyle = "red";
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);

        if (this.image) 
            c.drawImage(
                this.image, 
                this.position.x, 
                this.position.y, 
                this.width, 
                this.height
            );
    }

    update({velocity}) {
        if (this.image) {
            this.draw();
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        }
    }

    shoot(invaderProjectiles){
        invaderProjectiles.push(new InvaderProjectile({position:{
                x: this.position.x + this.width/2,
                y: this.position.y + this.height
            },
            velocity:{
                x:0,
                y:5
            }
        }))
        invShot.play();
    }
};

class Grid {
    constructor() {
        this.position = {
            x:0,
            y:0
        }

        this.velocity = {
            x:3,
            y:0
        }

        this.invaders = []

        const columns = Math.floor(Math.random() * 10) +5;
        const rows = Math.floor(Math.random() * 5) +2;

        this.width = columns * 50;
        for (let x=0; x<columns; x++){
                for (let y=0; y<rows; y++){
                this.invaders.push(new Invader({position: {
                    x: x*50,
                    y: y*50
                }}))
            }
        }
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y = 0;

        this.velocity.y = 0;

        if ((this.position.x + this.width > canvas.width) || (this.position.x < 0)) {
            this.velocity.x = -this.velocity.x;
            this.velocity.y += 50;
        }
    }
};

const player = new Player();
const projectiles = [];
const invaderProjectiles = [];
const grids = [];
const particles = [];

const keys = {
    a:      {pressed:false},   
    d:      {pressed:false},
    space:  {pressed:false},
    s:      {pressed:false}
}
const speed = 10;

let game = { over:false, active: false };
let frames = 0;
let randomInterval = Math.ceil(Math.random() * 500) + 500;
let score=0;

for(let p=0; p<100;p++){
    particles.push(new Particle({
        position:{
            x: Math.random() *  canvas.width,
            y: Math.random() *  canvas.height,
        },
        velocity: {
            x:0,
            y:1
        },
        radius: Math.random()*3,
        color:"white",
    }))
};

function hideShowTitles(change) {
    [reset, space, invText].forEach( i => i.style.display = change);
};

function resetGame() {
    function clearEverything(obj) {
        for (let p = 0; obj.length; p++){
            obj.splice(obj.length-1, 1);
        }
    }

music.play()

    score=0;
console.log("RESET")
    clearEverything(projectiles);
    clearEverything(invaderProjectiles);
    clearEverything(grids);


    player.opacity = 1;
    frames=0;

    game.over = false;
    game.active = true;
    hideShowTitles("none");
    button.innerText = "Reset";
}

function createParticles({obj, color, amount}) {
    for(let p=0; p<amount;p++){
        particles.push(new Particle({
            position:{
                x: obj.position.x + obj.width/2,
                y: obj.position.y + obj.height/2,
            },
            velocity: {
                x:(Math.random() -0.5) * 2,
                y:(Math.random() -0.5) * 2
            },
            radius: Math.random()*3,
            color:color,
            fades:true
        }))
    };
};

function killPlayer(killOb, arr, idx) {
    if (killOb.position.y + killOb.height >= player.position.y &&
        killOb.position.x + killOb.width >= player.position.x &&
        killOb.position.x <= player.position.x + player.width) {
            createParticles({obj:player, color:"green", amount:20});
            setTimeout(() => {
                arr.splice(idx, 1);
                player.opacity = 0;
                game.over = true;
                plDeath.play();
            }, 0);
            setTimeout(() => {
                game.active = false;
                gameover.play();
                hideShowTitles("flex");
            }, 2000);
    };
};

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    
    particles.forEach((xp, xidx) => {
        if (xp.position.y - xp.radius > canvas.height) {
            xp.position.x = Math.random() * canvas.width;
            xp.position.y = 0;
        }
        
        if (xp.opacity <= 0) setTimeout(() => particles.splice(xidx, 1), 0)
        else xp.update();
    });

    if (!game.active) return
    
    invaderProjectiles.forEach((p, pidx) => {
        if (p.position.y + p.height > canvas.height) setTimeout(() => invaderProjectiles.splice(pidx, 1), 0)
        else p.update();

        killPlayer(p, invaderProjectiles, pidx);
    })

    projectiles.forEach((p, i) => {
        if (p.position.y + p.radius < 0) setTimeout(() => projectiles.splice(i, 1), 0);
        else p.update();
    });

    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity. x = -speed;
        player.rotation = -0.15;
    }
    else if (keys.d.pressed && player.position.x + player.width <= canvas.width ) {
        player.velocity.x = speed;
        player.rotation = 0.15;
    }
    else {
        player.velocity.x = 0;
        player.rotation = 0;
    }

    grids.forEach((grid, gidx) => {
        grid.update();

    if (frames%100 === 0 && grid.invaders.length > 0) {
        grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
            invaderProjectiles
            );
    }

        grid.invaders.forEach((i, idx) => {
            i.update({velocity: grid.velocity})

            killPlayer(i, grid.invaders, idx)


            projectiles.forEach((p, jdx) => {
                if (p.position.y - p.radius <= i.position.y + i.height &&
                    p.position.x + p.radius >= i.position.x  &&
                    p.position.x - p.radius <= i.position.x + i.width &&
                    p.position.y + p.radius >= i.position.y) {


                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(i2 => i2 === i);
                        const projectileFound = projectiles.find(p2 => p2 === p);

                        if (invaderFound && projectileFound) {

                            createParticles({obj:i, color:"orange", amount:10});
                            score++;

                            grid.invaders.splice(idx, 1);
                            invDeath.play();
                            projectiles.splice(jdx, 1);

                            if (grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0];
                                const lastInvader = grid.invaders[grid.invaders.length-1];

                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;
                                grid.position.x = firstInvader.position.x;
                            } else grids.splice(gidx, 1);
                        }
                    }, 0)
                }
            })
        });
    });

    if (frames%randomInterval ===0) {
        grids.push(new Grid())
        randomInterval = Math.ceil(Math.random() * 500) + 500;
        frames = 0;
    }

    frames++;
    scoreText.innerText = score;
};

animate();

addEventListener("keydown", function ({key}) {
    if (game.over) return
    switch(key) {
        case "a":   
        case "ArrowLeft":  
        // console.log("left"); 
                    keys.a.pressed = true;
                    break;
        case "d": 
        case "ArrowRight": 
        // console.log("right"); 
                    keys.d.pressed = true;
                    break;
        case "ArrowDown":
        case "s": 
        console.log("pshoot"); 
                    projectiles.push(new Projectile({position:{x:player.position.x + player.width/2, y:player.position.y}, velocity:{x:0, y:playerShootSpeed}}))
                    playerShot.play();
        break;
    }
});

addEventListener("keyup", function ({key}) {
    switch(key) {
        case "ArrowLeft":  
        case "a":   keys.a.pressed = false;
                    break;
        case "ArrowRight": 
        case "d": 
                    keys.d.pressed = false;
                    break;
    }
});