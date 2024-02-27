/**
 * 2024.02.26
 * 크롬 공룡 게임과 비슷한 게임을 만들어보기
 * 애니메이션화가 필수
 */
console.log(`js coding ~~ Let's make a dino-game ~~`);

let canvas1 = document.getElementById("canvas1");
let ctx = canvas1.getContext("2d");

canvas1.width = window.innerWidth - 100;
canvas1.height = window.innerHeight - 100;  // 캔버스를 이용해서 그림을 그리기 위한 최소한의 코드

let img_dino = new Image();
img_dino.src = "dino.png";

// 다이노 위치 정의
let dino = {
    x: 10,
    y: 200,
    width: 50,
    height: 50,
    draw() {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y,  this.width, this.height);
        ctx.drawImage(img_dino, this.x, this.y);
    }
};
let jumping = false;
let jump_timer = 0;
let animation;

let img_cactus = new Image();
img_cactus.src = "cactus.png";

class Cactus {
    constructor() {
        this.x = 500;
        this.y = 200;
        this.width = 50;
        this.height = 50;
    }
    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y,  this.width, this.height);
        ctx.drawImage(img_cactus, this.x, this.y);
    }
}

// 충돌 확인
function collisionCheck(dino, cactus) {
    const dx = cactus.x - (dino.x + dino.width);
    const dy = cactus.y - (dino.y + dino.height);

    if(dx < 0 && dy < 0) {
        // 둘 다 0보다 작으면 충돌로 가정
        // 게임 오버
        ctx.clearRect(0, 0, canvas1.width, canvas1.height);
        cancelAnimationFrame(animation);
    }
}

/**
 * 1초에 XX번 코드 실행하기 - 이 코드는 모니터 FPS에 따라 다르다
 * 장애물은 2~3초에 한번씩 등장하면 될 것임
 */
let timer = 0;
let cactus_arr = [];    // 장애물 array
function executeByFrame() {
    animation = requestAnimationFrame(executeByFrame);
    timer++;

    ctx.clearRect(0, 0, canvas1.width, canvas1.height);     // 캔버스에 있는 그림 지우기

    if(jumping) {
        dino.y -= 2;
        jump_timer++;
    } else {
        if(dino.y < 200) {
            dino.y += 2;
        }
    }
    
    if(jump_timer > 50) {
        jumping = false;
    }

    if(dino.y === 200) {
        jump_timer = 0;
    }

    if(timer % 200 === 0) {
        let cactus1 = new Cactus();
        cactus_arr.push(cactus1);
        cactus1.draw();
        timer = 0;
    }
    
    cactus_arr.forEach((item, index, o) => {
        item.x -= 1.2;
        if(item.x < -50) {
            // 제거
            o.splice(index, 1);
        }

        collisionCheck(dino, item);

        item.draw();
    });

    dino.draw();
}

executeByFrame();

// 다이노 점프하기
document.addEventListener('keydown', function(e) {
    if(e.code === 'Space') {
        jumping = true;
    }
});
