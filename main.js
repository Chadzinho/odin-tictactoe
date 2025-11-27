const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const setMark = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const reset = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, setMark, reset };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (() => {
    const WINNING_COMBINATIONS = [
        [0, 1, 2], //top row
        [3, 4, 5], //middle row
        [6, 7, 8], //bottom row
        [0, 3, 6], //left column
        [1, 4, 7], //middle column
        [2, 5, 8], //right column
        [0, 4, 8], //topleft-btmright diagonal
        [2, 4, 6], //topright-btmleft diagonal
    ];

    let players = [];
    let currentPlayerIndex = 0;
    let gameOver = false;
    let winner = null;

    const checkWin = (board) => {
        return WINNING_COMBINATIONS.some((combination) => {
            const [a, b, c] = combination;
            return (
                board[a] !== "" &&
                board[a] === board[b] &&
                board[a] === board[c]
            );
        });
    };

    const checkTie = (board) => {
        return board.every((cell) => cell !== "");
    };

    const startGame = (player1Name, player2Name) => {
        players = [Player(player1Name, "X"), Player(player2Name, "O")];
        currentPlayerIndex = 0;
        gameOver = false;
        winner = null;
        Gameboard.reset();
        console.log(`Game started! ${players[0].name} goes first.`);
    };

    const getCurrentPlayer = () => players[currentPlayerIndex];

    const switchTurn = () => {
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    };

    const playTurn = (index) => {
        if (gameOver) {
            console.log("Game is over! Start a new game.");
            return;
        }

        const currentPlayer = getCurrentPlayer();

        if (Gameboard.setMark(index, currentPlayer.marker)) {
            console.log(
                `${currentPlayer.name} placed ${currentPlayer.marker} at position ${index}`
            );
            console.log(Gameboard.getBoard());

            if (checkWin(Gameboard.getBoard())) {
                gameOver = true;
                winner = currentPlayer;
                console.log(`Congratulations! ${currentPlayer.name} wins!`);
                return;
            }

            if (checkTie(Gameboard.getBoard())) {
                gameOver = true;
                console.log("It's a tie.");
                return;
            }

            switchTurn();
            console.log(`Next turn: ${getCurrentPlayer().name}`);
        } else {
            console.log("That spot is already taken!");
        }
    };

    const getGameState = () => {
        return {
            isOver: gameOver,
            currentPlayer: getCurrentPlayer(),
            winner: winner,
        };
    };

    return { startGame, playTurn, getCurrentPlayer, getGameState };
})();

const DisplayController = (() => {
    const gameboardDiv = document.getElementById("gameboard");
    const statusDiv = document.getElementById("game-status");
    const startBtn = document.getElementById("start-btn");
    const restartBtn = document.getElementById("restart-btn");
    const player1Input = document.getElementById("player1-name");
    const player2Input = document.getElementById("player2-name");

    const renderBoard = () => {
        gameboardDiv.innerHTML = "";
        const board = Gameboard.getBoard();

        board.forEach((cell, index) => {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");
            cellDiv.textContent = cell;
            cellDiv.dataset.index = index;

            if (cell !== "") {
                cellDiv.classList.add("taken");
            }

            cellDiv.addEventListener("click", handleCellClick);
            gameboardDiv.appendChild(cellDiv);
        });
    };

    const handleCellClick = (e) => {
        const index = parseInt(e.target.dataset.index);
        GameController.playTurn(index);
        updateDisplay();
    };

    const updateDisplay = () => {
        renderBoard();
        updateStatus();
    };

    const updateStatus = () => {
        const gameState = GameController.getGameState();

        if (gameState.isOver) {
            if (gameState.winner) {
                statusDiv.textContent = `Congratulations! ${gameState.winner.name} wins!`;
            } else {
                statusDiv.textContent = "It's a tie.";
            }
        } else {
            statusDiv.textContent = `It's ${gameState.currentPlayer.name}'s turn (${gameState.currentPlayer.marker})`;
        }
    };

    const startGame = () => {
        const player1Name = player1Input.value.trim() || "Player 1";
        const player2Name = player2Input.value.trim() || "Player 2";

        GameController.startGame(player1Name, player2Name);
        updateDisplay();
        restartBtn.style.display = "block";
    };

    startBtn.addEventListener("click", startGame);
    restartBtn.addEventListener("click", startGame);

    return { updateDisplay };
})();

// Tests
