document.addEventListener('DOMContentLoaded', () => {

    // initialize all DOM elements needed
    const bird = document.querySelector('.bird');
    const gameDisplay = document.querySelector('.game-container');
    const button = document.querySelector('.play button')
    const title = document.querySelector(".title img")
    const ground = document.querySelector('.ground-moving')
    const play = document.querySelector('.play')
    const score = document.querySelector('.score h1');
    const restartButton = document.querySelector('.try-again button');
    let sound = new Audio('sounds/point-scored.mp3');

    restartButton.style.display = 'none';
    score.style.display = 'none';

    //bird left and bottom position are in pixels
    let birdLeft = 220;
    let birdBottom = 300;
    let gravity = 1;
    let timer = setInterval(startGame, 20);
    clearInterval(timer);
    let isGameOver = false;
    let scoreCount = -1;

    
    function startGame() {
        birdBottom -= gravity;
        bird.style.bottom = birdBottom + 'px';
        bird.style.left = birdLeft + 'px';
        gravity = gravity + 0.1;
        score.style.display = 'block';
    }

    
    function jump() {
        if (birdBottom < 480) {
            birdBottom += 65;
            gravity = 1;
        };
        bird.style.bottom = birdBottom + 'px';
    }

    // checks to see if button pressed was the spacebar
    function control(e) {
        if (e.keyCode === 32) {
            jump();
        }
    }

    //logic behind the moving pipes
    function generateObstacle() {
        let obstacleLeft = 500;
        let randomHeight = Math.random() * 60;
        let obstacleBottom = randomHeight;
        const obstacle = document.createElement('div');
        const topObstacle = document.createElement('div');

        if (!isGameOver) {
            obstacle.classList.add('obstacle');
            topObstacle.classList.add('topObstacle');
        };

        gameDisplay.appendChild(obstacle);
        gameDisplay.appendChild(topObstacle);
        obstacle.style.left = obstacleLeft + 'px';
        obstacle.style.bottom = obstacleBottom + 'px';
        topObstacle.style.left = obstacleLeft + 'px';
        topObstacle.style.bottom = obstacleBottom + 500 + 'px';

        function moveObstacle() {
            obstacleLeft -= 2;
            obstacle.style.left = obstacleLeft + 'px';
            topObstacle.style.left = obstacleLeft + 'px';

            if (obstacleLeft === -60) {
                clearInterval(timerId);
                gameDisplay.removeChild(obstacle);
                gameDisplay.removeChild(topObstacle);
            }
            
            //checks for collision
            if ((obstacleLeft > 200 && obstacleLeft < 280 && birdLeft === 220 && ((birdBottom <= (152 + obstacleBottom)) || birdBottom >= (300 + obstacleBottom))) || birdBottom <= 0) {
                gameOver();
                gameDisplay.removeChild(obstacle);
                gameDisplay.removeChild(topObstacle);
                clearInterval(timerId);
            }
        }

        //starts the moving obstacles
        let timerId = setInterval(moveObstacle, 20);

        //iterates score and plays the sounds
        if (!isGameOver) {
            setTimeout(generateObstacle, 3000);
            scoreCount++;
            if (scoreCount > 0) {
                sound.play();
            }
            score.innerHTML = scoreCount;

        }
    }
    
    function gameOver() {
        restartButton.style.display = 'block';
        clearInterval(timer);
        isGameOver = true;
        ground.classList.add('ground');
        ground.classList.remove('ground-moving');
        bird.style.backgroundImage = 'none';
        
    }

    function restart() {
        restartButton.style.display = 'none';
        score.style.display = 'none';
        scoreCount = -1;
        birdBottom = 300;
        birdLeft = 220;
        gravity = 1;
        isGameOver = false;
        ground.classList.add('ground-moving');
        ground.classList.remove('ground');
        bird.style.bottom = birdBottom + 'px';
        bird.style.left = birdLeft + 'px';
        button.style.display = 'block';
        title.style.display = 'block';
    }


    //start game listener
    button.addEventListener('click', () => {
        title.style.display = 'none';
        bird.style.backgroundImage = 'url(images/flappy-bird.png)';
        button.style.display = 'none';
        timer = setInterval(startGame, 20);
        generateObstacle();
    });

    //restart game listener
    restartButton.addEventListener('click', () => {
        restart();
    });

    document.addEventListener('keyup', control);
});