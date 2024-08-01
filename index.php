<?php
session_start();
include('database.php');

// Handle the log out button submission
if (isset($_POST['logOutButton'])) {
    session_destroy();
    header('Location: login.php');
    exit();
}

if (isset($_POST['submitScoreBtn'])) {
    $username = $_SESSION['username'];
    $score = $_POST['score'];
    
    $sql = "UPDATE player SET score = '$score' 
                WHERE username = '$username'";

    if (mysqli_query($conn, $sql)){
        echo "submitted";
    }
    else{
        echo "error submitting score!";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flappy Burd</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Anton+SC&family=Press+Start+2P&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <script>
        let username = '<?php echo $_SESSION['username']; ?>';
    </script>
</head>
<body>
    <canvas id="canvas1"></canvas>

    <div class="assets">
        <img id="bg" src="assets/images/background_single.png">
        <img id="player" src="assets/images/player_fish.png">
        <img id="obstacles" src="assets/images/smallGears.png">
        <audio id="charge" src="assets/sounds/charge.mp3"></audio>
        <audio id="flap" src="assets/sounds/flap2.mp3"></audio>
        <audio id="win" src="assets/sounds/win.mp3"></audio>
        <audio id="lose" src="assets/sounds/lose.mp3"></audio>
        <audio id="point" src="assets/sounds/point.mp3"></audio>
    </div>

    <div id="optionBox">
        <h2>Game Over</h2>
        <p id="gameOverMessage"></p>
        <p id="gameOverMessage2"></p>
        <button id="retryButton">Retry</button>
        <button id="leaderboardButton">Show Leaderboard</button>
        <form method="post">
            <input type="hidden" id="scoreInput" name="score" value="">
            <button id="submitScoreBtn" name="submitScoreBtn" type="submit">submit score</button>
        </form>
    </div>
   
    <div id="pauseBox">
        <h2>PAUSED</h2>
        <p id="gameOverMessage"></p>
        <button id="playButton">Play</button>
        <button id="retryButton2">Retry</button>
        <button id="leaderboardButton2">Show Leaderboard</button>
        <form method="post">
            <button type="submit" name="logOutButton">Log out</button>
        </form>
    </div>


    <script src="player.js"></script>
    <script src="main.js"></script>
    <script src="background.js"></script>
    <script src="obstacle.js"></script>
    <script src="audio.js"></script>
</body>
</html>
