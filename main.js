class Game {
    constructor(canvas, context) {
        // Basic properties
        this.canvas = canvas; // Reference to the canvas element
        this.ctx = context; // Canvas rendering context
        this.width = this.canvas.width; // Width of the canvas
        this.height = this.canvas.height; // Height of the canvas
        this.baseHeight = 720; // Base height for scaling
        this.ratio = this.height / this.baseHeight; // Ratio for scaling

        // Game elements
        this.player = new Player(this); // Player object
        this.sound = new AudioControl(); // Audio control object
        this.gravity; // Gravity value
        this.background = new Background(this); // Background object
        this.obstacles = []; // Array to hold obstacle objects

        // Game settings
        this.speed; // Current game speed
        this.minSpeed; // Minimum game speed
        this.maxSpeed; // Maximum game speed
        this.numberOfObstacles = 100; // Number of obstacles in the game
        
        // Game state variables
        this.score; // Player's score
        this.gameOver; // Game over state
        this.timer; // Game timer
        this.message; // Message to display
        this.eventTimer = 0; // Timer for periodic events
        this.eventInterval = 150; // Interval for periodic events
        this.eventUpdate = false; // Whether to update periodic events
        this.touchStartX; // X-coordinate for touch start
        this.swipeDistance = 50; // Distance for swipe gesture
        this.debugMode = false; // Debug mode flag
        this.paused = false; // Paused state

        // HTML elements
        const submitScoreBtn = document.getElementById('submitScoreBtn'); // Submit score button
        const scoreInput = document.getElementById('scoreInput'); // Score input field
         // Initialize canvas size and set up event listeners
        this.resize(window.innerWidth, window.innerHeight); // Initialize canvas size

        window.addEventListener('resize', e => {
            this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight); // Resize canvas on window resize
        });

        // Mouse control
        this.canvas.addEventListener('mousedown', e => {
            if (!this.paused) {
                this.player.flap(); // Make player flap on mouse down
            }
        });
        this.canvas.addEventListener('mouseup', e => {
            if (!this.paused) {
                this.player.wingsUp(); // Stop flap on mouse up
            }
        });

        // Keyboard control
        window.addEventListener('keydown', e => {
            if (e.key.toLowerCase() === ' ') {
                if (!this.paused) {
                    this.player.flap(); // Make player flap on spacebar press
                }
            }
            if (this.player.energy > 20) {
                if (e.key.toLowerCase() === 'c') {
                    if (!this.paused) {
                        this.player.startCharge(); // Start charge on 'C' press
                    }
                }
            }
            if (e.key === 'Escape') { // Handle the 'Esc' key for pausing
                this.togglePause(); // Toggle pause on 'Escape' key press
            }
        });

        window.addEventListener('keyup', e => {
            if (!this.paused) {
                this.player.wingsUp(); // Stop flap on key release
            }
        });

        // Touch controls
        this.canvas.addEventListener('touchstart', e => {
            if (!this.paused) {
                this.player.flap(); // Make player flap on touch start
                this.touchStartX = e.changedTouches[0].pageX; // Record touch start X-coordinate
            }
        });
        this.canvas.addEventListener('touchmove', e => {
            if (!this.paused && e.changedTouches[0].pageX - this.touchStartX > this.swipeDistance) {
                this.player.startCharge(); // Start charge on swipe
            }
        });
        addEventListener("touchend", (event) => {
            if (!this.paused) {
                this.player.wingsUp(); // Stop flap on touch end
            }
        });

        // Add event listeners for the buttons 
        document.getElementById('retryButton').addEventListener('click', () => {
            this.restart(); // Restart game on retry button click
        });
        document.getElementById('retryButton2').addEventListener('click', () => {
            this.restart(); // Restart game on retry button click
        });
        document.getElementById('leaderboardButton').addEventListener('click', () => {
            this.showLeaderboard(); // Show leaderboard on button click
        });
        document.getElementById('leaderboardButton2').addEventListener('click', () => {
            this.showLeaderboard(); // Show leaderboard on button click
        });
        document.getElementById('playButton').addEventListener('click', () => {
            this.togglePause(); // Toggle pause on play button click
        });

    }

    resize(width, height) {
        this.canvas.width = width; // Set canvas width
        this.canvas.height = height; // Set canvas height
        this.ctx.font = '20px Anton SC'; // Set font
        this.ctx.textAlign = 'right'; // Set text alignment to right
        this.ctx.lineWidth = 3; // Set line width
        this.ctx.strokeStyle = 'white'; // Set stroke style to white
        this.width = this.canvas.width; // Update width
        this.height = this.canvas.height; // Update height
        this.ratio = this.height / this.baseHeight; // Update ratio
        this.gravity = 0.15 * this.ratio; // Set gravity
        this.speed = 2 * this.ratio; // Set speed
        this.minSpeed = this.speed; // Set minimum speed
        this.maxSpeed = this.speed * 5; // Set maximum speed
        this.player.resize(); // Resize player
        this.background.resize(); // Resize background
        this.createObstacles(); // Create obstacles
        this.obstacles.forEach(obs => {
            obs.resize(); // Resize obstacles
        });
        this.score = 0; // Reset score
        this.timer = 0; // Reset timer
        this.gameOver = false; // Reset game over state
        document.getElementById('optionBox').style.display = 'none'; // Hide option box
        document.getElementById('pauseBox').style.display = 'none'; // Hide pause box
    }

    render(deltaTime) {
        this.background.update(); // Update background
        this.background.draw(); // Draw background
        if (!this.gameOver && !this.paused) { // Do not update timer when paused
            this.timer += deltaTime; // Update timer
        }
        this.handlePeriodicEvents(deltaTime); // Handle periodic events
        this.drawText(); // Draw text on canvas
        this.player.update(); // Update player
        this.player.draw(); // Draw player
        this.obstacles.forEach(obs => {
            obs.update(); // Update obstacles
            obs.draw(); // Draw obstacles
        });
    }

    createObstacles() {
        this.obstacles = []; // Reset obstacles array
        const firstX = this.baseHeight * this.ratio; // Initial X-coordinate for obstacles
        const obstacleSpacing = 600 * this.ratio; // Spacing between obstacles
        for (let i = 0; i < this.numberOfObstacles; i++) {
            const lastX = firstX + i * obstacleSpacing;
            this.obstacles.push(new Obstacle(this, lastX)); // Create and add obstacles
        }
    }

    checkCollision(a, b) {
        const dx = a.collisionX - b.collisionX; // Difference in X-coordinates
        const dy = a.collisionY - b.collisionY; // Difference in Y-coordinates
        const distance = Math.hypot(dx, dy); // Calculate distance between centers
        const sumOfRadii = a.collisionRadius + b.collisionRadius; // Sum of radii
        return distance <= sumOfRadii; // Check if objects are colliding
    }

    formatTimer() {
        return (this.timer * 0.001).toFixed(1); // Format timer to seconds with one decimal place
    }

    handlePeriodicEvents(deltaTime) {
        if (this.eventTimer < this.eventInterval) {
            this.eventTimer += deltaTime; // Update event timer
            this.eventUpdate = false; // No event update
        } else {
            this.eventTimer = this.eventTimer % this.eventInterval; // Reset event timer
            this.eventUpdate = true; // Update events
        }
    }

    triggerGameOver() {
        const optionBox = document.getElementById('optionBox'); // Get option box element
        const gameOverMessage = document.getElementById('gameOverMessage'); // Get game over message element
        const gameOverMessage2 = document.getElementById('gameOverMessage2'); // Get second game over message element
        gameOverMessage.innerText = `Score: ${this.score}`; // Set game over message with score
        gameOverMessage2.innerText = `Time: ${this.formatTimer()} seconds`; // Set game over message with time
        optionBox.style.display = 'block'; // Show option box

        scoreInput.value = this.score; // Set score input value
    }

    drawText() {
        this.ctx.save(); // Save current context state
        this.ctx.fillText('Score: ' + this.score, this.width - 10, 30); // Draw score text
        this.ctx.textAlign = 'left'; // Align text to left
        this.ctx.fillText('Timer: ' + this.formatTimer(), 10, 30); // Draw timer text
        if (this.player.energy <= 20) {
            this.ctx.fillStyle = 'red'; // Set fill style to red if energy is low
        } else if (this.player.energy > 20 && this.player.energy < this.player.maxEnergy) {
            this.ctx.fillStyle = 'yellow'; // Set fill style to yellow if energy is moderate
        } else if (this.player.energy >= this.player.maxEnergy) {
            this.ctx.fillStyle = 'orange'; // Set fill style to orange if energy is high
        }
        for (let i = 0; i < this.player.energy; i++) {
            this.ctx.fillRect(10, this.height - 10 - this.player.barSize * i,
                this.player.barSize * 5, this.player.barSize); // Draw energy bars
        }
        this.ctx.restore(); // Restore context state
    }

    restart() {
        this.player.energy = 30;
        this.paused = false; // Reset paused state
        this.resize(window.innerWidth, window.innerHeight); // Resize canvas
        document.getElementById('optionBox').style.display = 'none'; // Hide option box
        this.lastTime = performance.now(); // Set last time to current time
        this.animate(this.lastTime); // Start animation
    }

    showLeaderboard() {
        window.location.href = "leaderboard.php"; // Redirect to leaderboard
    }

    togglePause() {
        this.paused = !this.paused; // Toggle paused state
        const pauseBox = document.getElementById('pauseBox'); // Get pause box element
        if (this.paused) {
            pauseBox.style.display = 'flex'; // Show pause box
        } else {
            pauseBox.style.display = 'none'; // Hide pause box
            this.lastTime = performance.now(); // Set last time to current time
            this.animate(this.lastTime); // Resume animation
        }
    }

    animate(timeStamp) {
        const deltaTime = timeStamp - this.lastTime; // Calculate time difference
        this.lastTime = timeStamp; // Update last time
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear canvas
        this.render(deltaTime); // Render game objects
        if (!this.gameOver && !this.paused) { // Only request animation frame if not paused or game over
            requestAnimationFrame(this.animate.bind(this)); // Request next animation frame
        }
    }
}

window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1'); // Get canvas element
    const ctx = canvas.getContext('2d'); // Get canvas rendering context
    canvas.width = 720; // Set canvas width
    canvas.height = 720; // Set canvas height

    const game = new Game(canvas, ctx); // Create new game instance
    game.lastTime = performance.now(); // Set last time to current time
    requestAnimationFrame(game.animate.bind(game)); // Start animation loop
});
