/**
 * 2024.02.26
 * 크롬 공룡 게임과 비슷한 게임을 만들어보기
 * 애니메이션화가 필수
 */

let canvas1 = document.getElementById("canvas1");
let ctx = canvas1.getContext("2d");

canvas1.width = window.innerWidth - 100;
canvas1.height = window.innerHeight - 100;  // 캔버스를 이용해서 그림을 그리기 위한 최소한의 코드

class Character {
    constructor(x,y,w,h,color,img_obj) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = color;
        this.img = img_obj;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.img, this.x, this.y);
    }
}

//===========================상수=============================
const img_dino = new Image();
img_dino.src = "dino.png";

const img_cactus = new Image();
img_cactus.src = "cactus.png";
//============================================================

//===========================변수=============================
let animation;                      // 게임 실행용 변수 - 게임 진행과 게임 오버를 하게 해준다.
let dino_jumping = false;           // 공룡이 점프할 때
let jump_key_interrupt = false;     // 스페이스 키가 여러 번 눌리지 않도록
let jump_timer = 0;                 // 점프 시간 계산
let timer = 0;
let cactus_arr = [];    // 장애물 array
//============================================================



// 다이노 정의
let dino = new Character(10, 200, 50, 50, "green", img_dino);


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
function executeByFrame() {
    animation = requestAnimationFrame(executeByFrame);
    timer++;

    ctx.clearRect(0, 0, canvas1.width, canvas1.height);     // 캔버스에 있는 그림 지우기

    if(dino_jumping) {
        dino.y -= 4;
        jump_timer++;
    } else {
        if(dino.y < 200) {
            dino.y += 4;
        }
    }
    
    if(jump_timer > 40) {
        dino_jumping = false;
    }

    if(dino.y === 200) {
        jump_timer = 0;
        jump_key_interrupt = false;
    }

    if(timer % 180 === 0) {
        const cactus1 = new Character(600, 200, 50, 50, "red", img_cactus);
        cactus_arr.push(cactus1);
        cactus1.draw();
        timer = 0;
    }
    
    cactus_arr.forEach((item, index, o) => {
        item.x -= 3;
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
document.addEventListener("keydown", function(e) {
    if(e.code === 'Space' && !jump_key_interrupt) {
        dino_jumping = true;
        jump_key_interrupt = true;
    }
});
