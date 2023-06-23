var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// canvas 크기설정
canvas.width = 700;
canvas.height = 500;

// High Score, Score Element 선택
var highScoreElem = document.querySelector('#highScore');
var scoreElem = document.querySelector('#score');

// 상태 저장 변수
var state = 0;
// 프레임 단위가 아닌 초 단위로 맞춰줄 timer 변수
var timer = 0;

// 점프중인지 확인할 변수
var jumping = false;
// 점프중 시간 확인 할 변수
var jumpTimer = 0;
// 왼쪽으로 이동 시 사용할 변수
var movingLeft = false;
var moveLeftTimer = 0;
// 오른쪽으로 이동 시 사용할 변수
var movingRight = false;
var moveRightTimer = 0;
// 색상 저장 변수
var r = 255, g = 0 , b = 0;
// 점수 저장 변수
var score = 0;
// 여러 장애물을 저장할 배열 변수
var pipeArray = [];
// 애니메이션 함수 저장 변수
var animation;

// 이미지 객체 생성
var birdImage = new Image();
birdImage.src = './bird1.png';
var pipeImage1 = new Image();
pipeImage1.src = './pipeImage1.png';
var pipeImage2 = new Image();
pipeImage2.src = './pipeImage2.png';

// 객체 형태로 변수 생성
var bird = {
    x : 50,
    y : 250,
    // hit 박스의 크기
    width : 50,
    height : 50,
    draw() {
        // 이미지로 그리기 (hit 박스와 이미지간 간격 차이 줄이기 위해 -7)
        ctx.drawImage(birdImage, this.x - 7, this.y - 7);
    }
}

// 장애물은 많이 만들것이기 때문에 class로 정의
class Pipe {
    constructor() {
        this.x = 700;
        this.y = 250;
        this.width = 50;
    }
    draw() {
        // 이미지로 그리기
        ctx.drawImage(pipeImage1, this.x, this.y - 525);
        ctx.drawImage(pipeImage2, this.x, this.y + 75);
    }
} 

// 게임 초기(=대기) 상태에서 실행하는 것들
function doReady() {

    // 캔버스 지워주는 함수
    ctx.clearRect(0,0, canvas.width, canvas.height);

    // 1초에 60번 실행해주는 함수 = 프레임마다 실행 (횟수는 모니터 FPS마다 다름)
    animation = requestAnimationFrame(doReady);
    timer++;

    // 프레임마다 r, g, b 변수를 이용해 스타일을 바꾼다
    if (timer < 60) {
        if (g < 255) {
            g += 6;
        }        
    } else if (timer < 120) {
        if (r > 0) {
            r -= 6;
        } 
    } else if (timer < 180) {
        if (b < 255) {
            b += 6;
        } 
    } else if (timer < 240) {
        if (g > 0) {
            g -= 6;
        } 
    } else if (timer < 300) {
        if (r < 255) {
            r += 6;
        }  
    } else {
        if (b > 0) {
            b -= 6;
        } 
    }

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.font = "70px Arial";
    ctx.fillText('Press "Space"', 150, 100);
    

    // 1초(=60프레임)마다 실행되게 하는 조건
    if (timer % 60 === 0) {
        // 장애물 생성 후 배열에 저장
        var pipe = new Pipe();
        if (timer < 120) {
            pipe.y = 250;
        }
        else if (timer < 240) {
            pipe.y = 150;
        }
        else if (timer < 360) {
            pipe.y = 350;
        }
        else {
            pipe.y = 250;
        }
        pipeArray.push(pipe);
    } 

    // pipeArray에 적용할 반복문
    pipeArray.forEach((a, i, o)=> {
        // x좌표가 -50 미만이면 제거 (=필요없어진 것 제거)
        if (a.x < -50) {
            o.splice(i, 1); 
        }
        // 장애물 왼쪽으로 이동
        a.x -= 10;
        a.draw();
    })
    // 대기 중 bird x, y 좌표 컨트롤
    if ((timer > 0) && (timer < 120)) {
        if (bird.y > 225) {
            bird.y -= 4;
        }
        if (bird.x < 500) {
            bird.x += 4;
        }
    }
    if ((timer > 120) && (timer < 240)) {
        if (bird.y > 125) {
            bird.y -= 4;
        }
        if (bird.x > 300) {
            bird.x -= 4;
        }
    }
    if ((timer > 240) && (timer < 360)) {
        if (bird.y < 325) {
            bird.y += 6;
        }
        if (bird.x > 200) {
            bird.x -= 4;
        }
    }
    
    // 10 프레임마다 이미지를 바꾼다
    // 날고 있는 듯한 애니메이션 효과
    if ((timer % 20) < 10) {
        birdImage.src = './bird2.png';
    } else {
        birdImage.src = './bird1.png';
    }
    
    // bird를 canvas에 그린다
    bird.draw();

    // 초기 상태에서는 계속 반복되는 화면이므로
    // timer가 360이상 갈 일이 없다
    if (timer === 360) {
        timer = 0;
    }

    // state가 1로 넘어가면 중단한다
    if (state === 1) {
        // 애니메이션 중단함수
        cancelAnimationFrame(animation);
    }

}

// 게임 진행 상태에서 실행하는 것들
function doPlaying() {
    // 캔버스 지워주는 함수
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1초에 60번 실행해주는 함수 = 프레임마다 실행 (횟수는 모니터 FPS마다 다름)
    animation = requestAnimationFrame(doPlaying);
    timer++;
    
    // 준비, 시작, Score 글자 출력
    if (timer < 80) {
        ctx.fillText("준비", 250, 150);
        ctx.fillStyle = "white";
        ctx.font = "100px Arial";
    }
    else if (timer < 140) {
        ctx.fillText("시작", 250, 150);
        ctx.fillStyle = "white";
        ctx.font = "100px Arial";
    }
    else {
        ctx.fillText(`${score}`, 300, 150);
        ctx.fillStyle = "white";
        ctx.font = "100px Arial";
    }

    // 1.5초(=90프레임)마다 실행되게 하는 조건
    if (timer % 90 === 0) {
        // 장애물 생성 후 배열에 저장
        var pipe = new Pipe();
        // y 좌표를 랜덤으로 설정한다
        pipe.y = Math.floor(Math.random() * 300) + 100; 
        pipeArray.push(pipe);
    } 

    // pipeArray에 적용할 반복문
    pipeArray.forEach((a, i, o)=> {

        // x좌표가 -50미만이면 제거 (=필요없어진 것 제거)
        if (a.x < -50) {
            o.splice(i, 1); 
            score++;
            scoreElem.textContent = score;
        }
        // 충돌하는지 체크
        isCollision(bird, a);

        // 장애물 왼쪽으로 이동
        a.x -= 5;
        a.draw();
    })

    // 점프중이면 올라감
    if (jumping == true) {
        // 캔버스에서 벗어나지 않기
        if (bird.y > 5) {
            bird.y -= 5;
        }        
        jumpTimer++;
    }
    // 점프중이 아니면 계속 내려감
    if ((timer > 120) && (jumping == false)) {
        // 캔버스에서 벗어나지 않기
        if (bird.y < 445) {
            bird.y += 5;
        }
    }
    // 점프timer가 15 넘으면 점프중 끄고, 점프timer 초기화
    if (jumpTimer > 15) {
        jumping = false;
        jumpTimer = 0;
    }

    // 왼쪽으로 움직이기 (moveTimer를 이용해 어느정도까지 움직이고 멈춤)
    if (movingLeft == true) {
        // 캔버스에서 벗어나지 않기
        if (bird.x > 4) {
            bird.x -= 4;
        }
        moveLeftTimer++;
    }
    if (moveLeftTimer > 15) {
        movingLeft = false;
        moveLeftTimer = 0;
    }

    // 오른쪽으로 움직이기 (moveTimer를 이용해 어느정도까지 움직이고 멈춤)
    if (movingRight == true) {
        // 캔버스에서 벗어나지 않기
        if (bird.x < 650) {
            bird.x += 4;
        }
        moveRightTimer++;
    }
    if (moveRightTimer > 15) {
        movingRight = false;
        moveRightTimer = 0;
    }
    
    // 10 프레임마다 이미지를 바꾼다
    // 날고 있는 듯한 애니메이션 효과
    if ((timer % 20) < 10) {
        birdImage.src = './bird2.png';
    } else {
        birdImage.src = './bird1.png';
    }

    bird.draw();
}

// 충돌 확인하는 함수
function isCollision(bird, pipe) {
    var xGap = bird.x - pipe.x;
    var yGap = pipe.y - bird.y;
    
    // 장애물과 유닛의 x, y 값 차이를 이용해 충돌여부 확인
    if ((xGap > -50 && xGap < 35) && (yGap < -25 || yGap > 75)) {

        // 애니메이션 중단함수
        cancelAnimationFrame(animation);

        // 게임 오버 문구
        ctx.fillStyle = "rgb(240, 18, 121)";
        ctx.font = "60px Arial";
        ctx.fillText('Game Over', 200, 250);     
        ctx.fillStyle = "black";
        ctx.font = "50px Arial";
        ctx.fillText('Restart?', 250, 350);     

        // 최고 점수 갱신
        var highScore = Number(highScoreElem.textContent);
        if(score > highScore) {
            localStorage.setItem('highScore', score);
            highScoreElem.textContent = score;
        }

        // 충돌했기 때문에 게임 오버 상태인 2로 간다
        state = 2;
    }
}

// 제일 처음 실행 시 상태는 게임 초기(=대기) 상태
doReady();

// 키 입력 이벤트 리스너
document.addEventListener('keydown', function(e) {
    // 게임 초기(=대기) 상태
    if (state === 0) {
        // 스페이스 바 입력 시 다음 상태로 넘어감
        if (e.code === 'Space') {
            state = 1;
            // 변수 초기화
            timer = 0;
            jumpTimer = 0;
            bird.x = 50;
            bird.y = 250;
            pipeArray = [];

            doPlaying();
        }
    }
    // 게임 진행 상태
    if ((state === 1) && (timer > 120)) {
        // 스페이스 바 입력 시 점프
        if (e.code === 'Space') {
            jumping = true;
            jumpTimer = 0;
        }
        // 왼쪽 방향키 입력 시 왼쪽으로 이동
        if (e.code === 'ArrowLeft') {
            movingLeft = true;
            moveLeftTimer = 0;
        }
        // 오른쪽 방향키 입력 시 오른쪽으로 이동
        if (e.code === 'ArrowRight') {
            movingRight = true;
            moveRightTimer = 0;
        }        
    }
    // 게임 오버 상태
    if (state === 2) {
        // 스페이스 바 입력 시 초기 상태로 돌아간다
        if (e.code === 'KeyR') {
            // 변수 초기화
            state = 0;
            timer = 0;
            jumpTimer = 0;
            movingLeft = false;
            moveLeftTimer = 0;
            movingRight = false;
            moveRightTimer = 0;
            score = 0;
            pipeArray = [];
            bird.x = 50;
            bird.y = 250;

            scoreElem.textContent = 0;

            doReady();
        }
    }
})