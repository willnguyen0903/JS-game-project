<?php
    session_start();
    include('database.php');

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_SPECIAL_CHARS);
        $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_SPECIAL_CHARS);
        $message = '';

        if (empty($username)) {
            $message = 'empty username!';
        } 
        elseif(empty($password)){
            $message = 'empty password!';
        }
        else {
            $check_sql = "SELECT * FROM player WHERE username = '$username'";
            $result = mysqli_query($conn, $check_sql);
            if (mysqli_num_rows($result) > 0){
                $message = "username taken";
            } 
            else{
                $hash = password_hash($password, PASSWORD_DEFAULT);
                $sql = "INSERT INTO player (username, password) 
                            VALUES ('$username', '$hash')";

                if (mysqli_query($conn, $sql)) {
                    $message = "you are registered";
                    header("location: login.php");
                } else {
                    $message = "error registering user!";
                }
            }
            
        }
    }
    mysqli_close($conn);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>registration page</title>
    <link rel='stylesheet' href='login-style.css'>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Anton+SC&family=Press+Start+2P&display=swap" rel="stylesheet">
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            var message = "<?php echo $message; ?>";
            if (message) {
                alert(message);
            }
        });
    </script>
</head>
<body>
    <h1 class="title">STEAMPUNK PILOT</h1>
    <div class="background"></div>
    <form action="<?php htmlspecialchars($_SERVER['PHP_SELF']) ?>" method='post'>
        username:<br>
        <input type="text" name='username'><br>
        password:<br>
        <input type="password" name='password'><br>
        <input type="submit" name='login' value='register'><br>
    </form>
    <form action="login.php" method="get" class = 'login-register-redirector'>
        <input type="submit" value="Go to Login" >
    </form>
</body>
</html>

