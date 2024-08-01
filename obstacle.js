class Obstacle {
    constructor(game, x) {
        this.game = game; // Reference to the game instance
        this.spriteWidth = 120; // Width of the sprite image
        this.spriteheight = 120; // Height of the sprite image
        this.scaledWidth = this.spriteWidth * this.game.ratio; // Scaled width of the obstacle
        this.scaledHeight = this.spriteheight * this.game.ratio; // Scaled height of the obstacle
        this.x = x; // Initial x position of the obstacle
        this.y = Math.random() * (this.game.height - this.scaledHeight); // Random initial y position
        this.speedY = Math.random() < 0.5 ? -1 * this.game.ratio : 1 * this.game.ratio; // Random vertical speed
        this.markedForDeletion = false; // Flag to mark the obstacle for deletion
        this.collisionX; // x-coordinate for collision detection
        this.collisionY; // y-coordinate for collision detection
        this.collisionRadius; // Radius for collision detection
        this.image = document.getElementById('obstacles'); // Obstacle's image
        this.frameX = Math.floor(Math.random() * 4); // Random frame from the sprite sheet
    }

    update() {
        this.x -= this.game.speed; // Move the obstacle left
        this.y += this.speedY; // Move the obstacle vertically
        this.collisionX = this.x + this.scaledWidth * 0.5; // Update collision x-coordinate
        this.collisionY = this.y + this.scaledHeight * 0.5; // Update collision y-coordinate

        // Reverse vertical direction if hitting the top or bottom
        if (this.y <= 0 || this.y >= this.game.height - this.scaledHeight) {
            this.speedY *= -1;
        }

        // Check if the obstacle is off screen
        if (this.isOffScreen()) {
            this.markedForDeletion = true; // Mark the obstacle for deletion
            // Remove marked obstacles from the game
            this.game.obstacles = this.game.obstacles.filter(obstacle => 
                !obstacle.markedForDeletion);
            this.game.sound.play(this.game.sound.point); // Play point sound
            this.game.score++; // Increment game score
        }

        // Check collision with the player
        if (this.game.checkCollision(this, this.game.player)) {
            this.game.gameOver = true; // Set game over state
            this.game.triggerGameOver(); // Trigger game over sequence
            this.game.player.collided = true; // Set player collision state
            this.game.sound.play(this.game.sound.lose); // Play lose sound
        }    
    }

    draw() {
        // Draw the obstacle sprite on the canvas
        this.game.ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, 
            this.spriteWidth, this.spriteheight, this.x, this.y, this.scaledWidth, this.scaledHeight);

        // Draw the collision detection circle
        this.game.ctx.beginPath();
        this.game.ctx.arc(this.collisionX, this.collisionY, 
            this.collisionRadius, 0, Math.PI * 2);
        if (this.game.debugMode) {
            this.game.ctx.stroke(); // Draw the collision circle if debug mode is enabled
        }
    }

    // Resize obstacle properties based on game size
    resize() {
        this.scaledHeight = this.spriteheight * this.game.ratio; // Set scaled height
        this.scaledWidth = this.spriteWidth * this.game.ratio; // Set scaled width
        this.collisionRadius = this.scaledWidth * 0.4; // Set collision radius
    }

    // Check if the obstacle is off screen
    isOffScreen() {
        return this.x < 0;
    }
}
