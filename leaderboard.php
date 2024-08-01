<?php
include("database.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Leaderboard</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <style>
    .title-section {
        background-color: #B87333;
        color: white;
        padding: 20px 0;
        text-align: center;
    }
    .gamepage-redirect {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }
    .gamepage-redirect input[type="submit"] {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        background-color: #B87333;
        color: white;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
    }
    .gamepage-redirect input[type="submit"]:hover {
        background-color: #db8e46;
    }
  </style>
</head>
<body>

<div class="container-fluid title-section">
    <h1>Leaderboard</h1>
</div>

<div class="container mt-5">
    <div class="row">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Username</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
            <?php
                $sql = "SELECT * FROM player ORDER BY score DESC";
                $run = mysqli_query($conn, $sql);
                $rank = 0;
                while($row = mysqli_fetch_array($run)){
                    $rank += 1;
            ?>
                <tr>
                    <td><?php echo $rank?></td>
                    <td><?php echo $row['username']?></td>
                    <td><?php echo $row['score']?></td>
                </tr>
            <?php } //while ends here ?>
            </tbody>
        </table>
    </div>
</div>

<div class="gamepage-redirect">
    <form action="index.php" method="get">
        <input type="submit" value="Back to Game">
    </form>
</div>

</body>
</html>
