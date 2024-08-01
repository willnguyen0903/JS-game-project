<?php
    session_start();
    include('database.php');
    
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_SPECIAL_CHARS);
        $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_SPECIAL_CHARS);
        $score = 0;
        $message = '';

        if (empty($username)) {
            $message = 'empty username!';
        } 
        elseif(empty($password)){
            $message = 'empty password!';
        }
        else {
            // Check if the username exists and retrieve the hashed password
            $sql = "SELECT * FROM player WHERE username = '$username'";
            $result = mysqli_query($conn, $sql);

            if(mysqli_num_rows($result) > 0) {
                $row = mysqli_fetch_assoc($result);
                $hashed_password = $row['password'];
                //verify password
                if(password_verify($password, $hashed_password)){
                    $message = 'logged in successfully';
                    $_SESSION['username'] = $username;
                    header("location: index.php");
                } else {
                    $message = "invalid password";
                }
            } 
            else{
                $message = "invalid username";
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
    <title>login page</title>
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
        <input type="submit" name='login' value='login'><br>
    </form>
    <form action="register.php" method="get" class = 'login-register-redirector'>
        <input type="submit" value="Go to Register">
    </form>
</body>
</html>
