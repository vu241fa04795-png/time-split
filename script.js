// ==========================================================
// ⚡ TIME SPLIT - COMPLETE GAME
// START → DIFFICULTY → LEVEL → GAME
// ==========================================================


// ==========================================================
// SCREENS
// ==========================================================

const startScreen =
    document.getElementById("startScreen");

const difficultyScreen =
    document.getElementById("difficultyScreen");

const levelScreen =
    document.getElementById("levelScreen");

const gameScreen =
    document.getElementById("gameScreen");


// ==========================================================
// GAME ELEMENTS
// ==========================================================

const player =
    document.getElementById("player");

const shadow =
    document.getElementById("shadow-player");

const scoreText =
    document.getElementById("score");

const livesText =
    document.getElementById("lives");

const levelText =
    document.getElementById("level");

const message =
    document.getElementById("message");

const playerObstacles =
    document.getElementById("player-obstacles");

const shadowObstacles =
    document.getElementById("shadow-obstacles");

const playerDiamonds =
    document.getElementById("player-diamonds");

const shadowDiamonds =
    document.getElementById("shadow-diamonds");

const levelContainer =
    document.getElementById("levelContainer");

const difficultyTitle =
    document.getElementById("difficultyTitle");


// ==========================================================
// GAME VARIABLES
// ==========================================================

let playerPosition = 50;

let shadowPosition = 50;

let score = 0;

let lives = 3;

let currentLevel = 1;

let selectedDifficulty = "easy";

let gameRunning = false;

let animationFrame;


// ==========================================================
// DIFFICULTY
// ==========================================================

const difficultySettings = {

    easy: {
        name: "🟢 EASY",
        lives: 3,
        obstacles: 3,
        diamonds: 3,
        speed: 1.2
    },

    medium: {
        name: "🟡 MEDIUM",
        lives: 3,
        obstacles: 5,
        diamonds: 5,
        speed: 1.8
    },

    hard: {
        name: "🔴 HARD",
        lives: 2,
        obstacles: 7,
        diamonds: 7,
        speed: 2.5
    }

};


// ==========================================================
// SHOW SCREEN
// ==========================================================

function showScreen(screen) {

    startScreen.classList.add("hidden");

    difficultyScreen.classList.add("hidden");

    levelScreen.classList.add("hidden");

    gameScreen.classList.add("hidden");

    screen.classList.remove("hidden");

}


// ==========================================================
// START BUTTON
// ==========================================================

document
    .getElementById("startGameBtn")
    .addEventListener("click", function () {

        showScreen(difficultyScreen);

    });


// ==========================================================
// DIFFICULTY BUTTONS
// ==========================================================

document
    .querySelectorAll(".difficulty-card")
    .forEach(function (button) {

        button.addEventListener("click", function () {

            selectedDifficulty =
                this.dataset.difficulty;

            showLevelSelection();

        });

    });


// ==========================================================
// SHOW LEVELS
// ==========================================================

function showLevelSelection() {

    const settings =
        difficultySettings[selectedDifficulty];

    difficultyTitle.textContent =
        settings.name;

    levelContainer.innerHTML = "";


    for (let i = 1; i <= 10; i++) {

        const button =
            document.createElement("button");

        button.className =
            "level-button";

        button.innerHTML = `
            <span class="level-number">
                ${i}
            </span>

            <span class="level-label">
                LEVEL
            </span>
        `;

        button.addEventListener(
            "click",
            function () {

                startSelectedLevel(i);

            }
        );

        levelContainer.appendChild(button);

    }


    showScreen(levelScreen);

}


// ==========================================================
// START SELECTED LEVEL
// ==========================================================

function startSelectedLevel(levelNumber) {

    currentLevel =
        levelNumber;

    score = 0;

    const settings =
        difficultySettings[selectedDifficulty];

    lives =
        settings.lives;

    scoreText.textContent =
        score;

    livesText.textContent =
        lives;

    levelText.textContent =
        currentLevel;

    showScreen(gameScreen);

    startLevel();

}


// ==========================================================
// RANDOM X POSITION
// ==========================================================

function randomPosition() {

    const positions = [
        10,
        20,
        30,
        40,
        50,
        60,
        70,
        80,
        90
    ];

    return positions[
        Math.floor(
            Math.random() *
            positions.length
        )
    ];

}


// ==========================================================
// UPDATE PLAYERS
// ==========================================================

function updatePlayers() {

    player.style.left =
        playerPosition + "%";

    shadow.style.left =
        shadowPosition + "%";

}


// ==========================================================
// MOVE LEFT
// ==========================================================

function moveLeft() {

    if (!gameRunning) {
        return;
    }


    // YOU → LEFT

    playerPosition -= 10;


    // SHADOW → RIGHT

    shadowPosition += 10;


    if (playerPosition < 5) {

        playerPosition = 5;

    }


    if (shadowPosition > 95) {

        shadowPosition = 95;

    }


    updatePlayers();

}


// ==========================================================
// MOVE RIGHT
// ==========================================================

function moveRight() {

    if (!gameRunning) {
        return;
    }


    // YOU → RIGHT

    playerPosition += 10;


    // SHADOW → LEFT

    shadowPosition -= 10;


    if (playerPosition > 95) {

        playerPosition = 95;

    }


    if (shadowPosition < 5) {

        shadowPosition = 5;

    }


    updatePlayers();

}


// ==========================================================
// CREATE OBSTACLE
// ==========================================================

function createObstacle(
    container,
    position,
    startY,
    direction
) {

    const obstacle =
        document.createElement("div");

    obstacle.className =
        "obstacle";

    obstacle.textContent =
        "🪨";

    obstacle.style.left =
        position + "%";

    obstacle.style.top =
        startY + "px";

    obstacle.dataset.x =
        position;

    obstacle.dataset.y =
        startY;

    obstacle.dataset.direction =
        direction;

    container.appendChild(obstacle);

}


// ==========================================================
// CREATE DIAMOND
// ==========================================================

function createDiamond(
    container,
    position,
    startY,
    direction
) {

    const diamond =
        document.createElement("div");

    diamond.className =
        "diamond";

    diamond.textContent =
        "💎";

    diamond.style.left =
        position + "%";

    diamond.style.top =
        startY + "px";

    diamond.dataset.x =
        position;

    diamond.dataset.y =
        startY;

    diamond.dataset.direction =
        direction;

    container.appendChild(diamond);

}


// ==========================================================
// CREATE LEVEL
// ==========================================================

function createLevel() {

    playerObstacles.innerHTML = "";

    shadowObstacles.innerHTML = "";

    playerDiamonds.innerHTML = "";

    shadowDiamonds.innerHTML = "";


    const settings =
        difficultySettings[selectedDifficulty];


    // More objects at higher levels

    let obstacleCount =
        settings.obstacles +
        Math.floor(
            (currentLevel - 1) / 2
        );


    let diamondCount =
        settings.diamonds +
        Math.floor(
            (currentLevel - 1) / 3
        );


    if (obstacleCount > 12) {

        obstacleCount = 12;

    }


    if (diamondCount > 10) {

        diamondCount = 10;

    }


    // ======================================================
    // CREATE OBSTACLE + DIAMOND PAIRS
    // ======================================================

    for (
        let i = 0;
        i < obstacleCount;
        i++
    ) {

        const x =
            randomPosition();


        // Alternate between YOU
        // and SHADOW

        if (i % 2 === 0) {

            // YOU lane

            const obstacleY =
                -60 - (i * 120);

            const diamondY =
                obstacleY - 140;


            createObstacle(
                playerObstacles,
                x,
                obstacleY,
                "down"
            );


            // Diamond is BEHIND obstacle

            createDiamond(
                playerDiamonds,
                x,
                diamondY,
                "down"
            );

        } else {

            // SHADOW lane

            const obstacleY =
                220 + (i * 120);

            const diamondY =
                obstacleY + 140;


            createObstacle(
                shadowObstacles,
                x,
                obstacleY,
                "up"
            );


            // Diamond is BEHIND obstacle

            createDiamond(
                shadowDiamonds,
                x,
                diamondY,
                "up"
            );

        }

    }


    // Extra diamonds if required

    while (
        playerDiamonds.children.length +
        shadowDiamonds.children.length <
        diamondCount
    ) {

        const x =
            randomPosition();


        if (
            Math.random() < 0.5
        ) {

            createDiamond(
                playerDiamonds,
                x,
                -250,
                "down"
            );

        } else {

            createDiamond(
                shadowDiamonds,
                x,
                470,
                "up"
            );

        }

    }

}


// ==========================================================
// START LEVEL
// ==========================================================

function startLevel() {

    cancelAnimationFrame(
        animationFrame
    );


    playerPosition = 50;

    shadowPosition = 50;


    updatePlayers();


    player.style.opacity =
        "1";

    shadow.style.opacity =
        "1";


    createLevel();


    gameRunning = true;


    message.textContent =
        "⚡ LEVEL " +
        currentLevel +
        " - AVOID FIRST, COLLECT AFTER!";


    gameLoop();

}


// ==========================================================
// GAME LOOP
// ==========================================================

function gameLoop() {

    if (!gameRunning) {

        return;

    }


    moveObjects();

    checkCollisions();

    checkLevelComplete();


    animationFrame =
        requestAnimationFrame(
            gameLoop
        );

}


// ==========================================================
// MOVE OBJECTS
// ==========================================================

function moveObjects() {

    const settings =
        difficultySettings[selectedDifficulty];


    // Level makes game faster

    const speed =
        settings.speed +
        (currentLevel - 1) * 0.15;


    // ======================================================
    // YOU OBSTACLES
    // ======================================================

    moveContainerObjects(
        playerObstacles,
        speed,
        "down"
    );


    // ======================================================
    // YOU DIAMONDS
    // ======================================================

    moveContainerObjects(
        playerDiamonds,
        speed,
        "down"
    );


    // ======================================================
    // SHADOW OBSTACLES
    // ======================================================

    moveContainerObjects(
        shadowObstacles,
        speed,
        "up"
    );


    // ======================================================
    // SHADOW DIAMONDS
    // ======================================================

    moveContainerObjects(
        shadowDiamonds,
        speed,
        "up"
    );

}


// ==========================================================
// MOVE OBJECTS INSIDE CONTAINER
// ==========================================================

function moveContainerObjects(
    container,
    speed,
    direction
) {

    const objects =
        container.children;


    for (
        let i = objects.length - 1;
        i >= 0;
        i--
    ) {

        const object =
            objects[i];


        let y =
            parseFloat(
                object.dataset.y
            );


        // YOU lane → move DOWN

        if (direction === "down") {

            y += speed;

        }


        // SHADOW lane → move UP

        if (direction === "up") {

            y -= speed;

        }


        object.dataset.y =
            y;


        object.style.top =
            y + "px";


        // Remove objects after
        // they leave the screen

        if (
            direction === "down" &&
            y > 270
        ) {

            object.remove();

        }


        if (
            direction === "up" &&
            y < -70
        ) {

            object.remove();

        }

    }

}


// ==========================================================
// CHECK COLLISIONS
// ==========================================================

function checkCollisions() {

    if (!gameRunning) {

        return;

    }


    // YOU

    checkObstacleCollision(
        player,
        playerPosition,
        playerObstacles
    );


    checkDiamondCollision(
        player,
        playerPosition,
        playerDiamonds
    );


    // SHADOW

    checkObstacleCollision(
        shadow,
        shadowPosition,
        shadowObstacles
    );


    checkDiamondCollision(
        shadow,
        shadowPosition,
        shadowDiamonds
    );

}


// ==========================================================
// OBSTACLE COLLISION
// ==========================================================

function checkObstacleCollision(
    character,
    characterX,
    container
) {

    const objects =
        Array.from(
            container.children
        );


    for (
        const obstacle of objects
    ) {

        const obstacleX =
            parseFloat(
                obstacle.dataset.x
            );


        const obstacleY =
            parseFloat(
                obstacle.dataset.y
            );


        // Horizontal distance

        const xDifference =
            Math.abs(
                characterX -
                obstacleX
            );


        // Collision zone

        let verticalCollision =
            false;


        // YOU is near bottom

        if (
            container ===
            playerObstacles
        ) {

            if (
                obstacleY > 120 &&
                obstacleY < 180
            ) {

                verticalCollision =
                    true;

            }

        }


        // SHADOW is near top

        if (
            container ===
            shadowObstacles
        ) {

            if (
                obstacleY > 20 &&
                obstacleY < 90
            ) {

                verticalCollision =
                    true;

            }

        }


        if (
            xDifference < 7 &&
            verticalCollision
        ) {

            obstacle.remove();

            loseLife();

            return;

        }

    }

}


// ==========================================================
// DIAMOND COLLISION
// ==========================================================

function checkDiamondCollision(
    character,
    characterX,
    container
) {

    const diamonds =
        Array.from(
            container.children
        );


    for (
        const diamond of diamonds
    ) {

        const diamondX =
            parseFloat(
                diamond.dataset.x
            );


        const diamondY =
            parseFloat(
                diamond.dataset.y
            );


        const xDifference =
            Math.abs(
                characterX -
                diamondX
            );


        let verticalCollision =
            false;


        // YOU

        if (
            container ===
            playerDiamonds
        ) {

            if (
                diamondY > 120 &&
                diamondY < 180
            ) {

                verticalCollision =
                    true;

            }

        }


        // SHADOW

        if (
            container ===
            shadowDiamonds
        ) {

            if (
                diamondY > 20 &&
                diamondY < 90
            ) {

                verticalCollision =
                    true;

            }

        }


        if (
            xDifference < 7 &&
            verticalCollision
        ) {

            diamond.remove();


            score += 10;


            scoreText.textContent =
                score;


            message.textContent =
                "💎 +10 POINTS!";


            return;

        }

    }

}


// ==========================================================
// LOSE LIFE
// ==========================================================

function loseLife() {

    if (!gameRunning) {

        return;

    }


    lives--;


    livesText.textContent =
        lives;


    message.textContent =
        "💥 OBSTACLE HIT!";


    // Screen shake

    const gameArea =
        document.querySelector(
            ".game-area"
        );


    gameArea.style.transform =
        "translateX(-8px)";


    setTimeout(
        function () {

            gameArea.style.transform =
                "translateX(8px)";

        },
        60
    );


    setTimeout(
        function () {

            gameArea.style.transform =
                "translateX(0)";

        },
        120
    );


    if (lives <= 0) {

        gameOver();

    }

}


// ==========================================================
// GAME OVER
// ==========================================================

function gameOver() {

    gameRunning = false;


    cancelAnimationFrame(
        animationFrame
    );


    player.style.opacity =
        "0.5";

    shadow.style.opacity =
        "0.5";


    message.textContent =
        "💀 GAME OVER! SCORE: " +
        score;

}


// ==========================================================
// CHECK LEVEL COMPLETE
// ==========================================================

function checkLevelComplete() {

    if (!gameRunning) {

        return;

    }


    const remainingDiamonds =
        playerDiamonds.children.length +
        shadowDiamonds.children.length;


    if (
        remainingDiamonds === 0
    ) {

        levelComplete();

    }

}


// ==========================================================
// LEVEL COMPLETE
// ==========================================================

function levelComplete() {

    gameRunning = false;


    cancelAnimationFrame(
        animationFrame
    );


    score += 50;


    scoreText.textContent =
        score;


    message.textContent =
        "🎉 LEVEL " +
        currentLevel +
        " COMPLETE! +50 BONUS";


    setTimeout(
        function () {

            if (
                currentLevel < 10
            ) {

                currentLevel++;


                levelText.textContent =
                    currentLevel;


                startLevel();

            } else {

                message.textContent =
                    "🏆 ALL 10 LEVELS COMPLETE!";

            }

        },
        1500
    );

}


// ==========================================================
// RESTART
// ==========================================================

function restartGame() {

    cancelAnimationFrame(
        animationFrame
    );


    const settings =
        difficultySettings[
            selectedDifficulty
        ];


    lives =
        settings.lives;


    playerPosition =
        50;

    shadowPosition =
        50;


    livesText.textContent =
        lives;


    scoreText.textContent =
        score;


    player.style.opacity =
        "1";

    shadow.style.opacity =
        "1";


    updatePlayers();


    gameRunning = true;


    createLevel();


    message.textContent =
        "🔄 LEVEL " +
        currentLevel +
        " RESTARTED!";


    gameLoop();

}


// ==========================================================
// LEFT BUTTON
// ==========================================================

document
    .getElementById("leftBtn")
    .addEventListener(
        "click",
        moveLeft
    );


// ==========================================================
// RIGHT BUTTON
// ==========================================================

document
    .getElementById("rightBtn")
    .addEventListener(
        "click",
        moveRight
    );


// ==========================================================
// RESTART BUTTON
// ==========================================================

document
    .getElementById("restartBtn")
    .addEventListener(
        "click",
        restartGame
    );


// ==========================================================
// KEYBOARD
// ==========================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "ArrowLeft"
        ) {

            event.preventDefault();

            moveLeft();

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            event.preventDefault();

            moveRight();

        }


        if (
            event.key.toLowerCase() ===
            "r"
        ) {

            restartGame();

        }

    }
);


// ==========================================================
// BACK TO START
// ==========================================================

document
    .getElementById("backToStart")
    .addEventListener(
        "click",
        function () {

            gameRunning = false;

            cancelAnimationFrame(
                animationFrame
            );

            showScreen(
                startScreen
            );

        }
    );


// ==========================================================
// BACK TO DIFFICULTY
// ==========================================================

document
    .getElementById("backToDifficulty")
    .addEventListener(
        "click",
        function () {

            gameRunning = false;

            cancelAnimationFrame(
                animationFrame
            );

            showScreen(
                difficultyScreen
            );

        }
    );


// ==========================================================
// GAME → LEVELS
// ==========================================================

document
    .getElementById("levelsButton")
    .addEventListener(
        "click",
        function () {

            gameRunning = false;

            cancelAnimationFrame(
                animationFrame
            );

            showLevelSelection();

        }
    );


// ==========================================================
// GAME → DIFFICULTY
// ==========================================================

document
    .getElementById(
        "gameDifficultyButton"
    )
    .addEventListener(
        "click",
        function () {

            gameRunning = false;

            cancelAnimationFrame(
                animationFrame
            );

            showScreen(
                difficultyScreen
            );

        }
    );


// ==========================================================
// INITIAL SCREEN
// ==========================================================

showScreen(startScreen);