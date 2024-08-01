class Player {
    constructor(game) {
        this.game = game; // Reference to the game instance
        this.x = 20; // Initial x position
        this.y; // Initial y position (to be set in resize method)
        this.spriteWidth = 200; // Width of the sprite image
        this.spriteHeight = 200; // Height of the sprite image
        this.width; // Scaled width of the player (to be set in resize method)
        this.height; // Scaled height of the player (to be set in resize method)
        this.speedY; // Vertical speed of the player
        this.collisionX; // x-coordinate for collision detection
        this.collisionY; // y-coordinate for collision detection
        this.collisionRadius = this.scaledWidth * 0.5; // Radius for collision detection
        this.collided; // Collision state
        this.energy = 30; // Initial energy level
        this.maxEnergy = this.energy * 2; // Maximum energy level
        this.minEnergy = 15; // Minimum energy level
        this.charging; // Charging state
        this.barSize; // Size of the energy bar
        this.image = document.getElementById("player"); // Player's image
        this.frameY; // y-coordinate for the sprite sheet frame
    }

    draw() {
        // Draw the player sprite on the canvas
        this.game.ctx.drawImage(this.image, 0, this.frameY * this.spriteHeight, 
            this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);

        // Draw the collision detection circle 
        // used to detect collision between player object and obstacles
        this.game.ctx.beginPath();
        this.game.ctx.arc(this.collisionX + this.collisionRadius * 1.1, this.collisionY, 
            this.collisionRadius, 0, Math.PI * 2);
        if (this.game.debugMode) {
            this.game.ctx.stroke(); // Draw the collision circle if debug mode is enabled
        }
    }

    // Update player's position and state
    update() {
        this.handleEnergy(); // Manage energy levels
        this.y += this.speedY; // Update vertical position
        this.collisionY = this.y + this.height * 0.5; // Update collision y-coordinate

        if (!this.isTouchingBottom() && !this.charging) {
            this.speedY += this.game.gravity; // Apply gravity if not charging and not at the bottom
        }

        // Handle bottom boundary collision
        if (this.isTouchingBottom()) {
            this.y = this.game.height - this.height; // Set position to the bottom
            this.wingsIdle(); // Set wings to idle position
        }
    }

    // Resize player's properties based on game size
    resize() {
        this.width = this.spriteWidth * this.game.ratio; // Set scaled width
        this.height = this.spriteHeight * this.game.ratio; // Set scaled height
        this.y = this.game.height * 0.5 - this.height * 0.5; // Center vertically
        this.speedY = -8 * this.game.ratio; // Set initial vertical speed
        this.flapSpeed = 5 * this.game.ratio; // Set flap speed
        this.collisionRadius = 40 * this.game.ratio; // Set collision radius
        this.collisionX = this.x + this.width * 0.5; // Set collision x-coordinate
        this.collided = false; // Reset collision state
        this.barSize = Math.ceil(5 * this.game.ratio); // Set energy bar size
        this.frameY = 0; // Set initial frame for sprite
        this.charging = false; // Reset charging state
    }

    // Check if player is touching the bottom of the canvas
    isTouchingBottom() {
        return this.y >= this.game.height - this.height;
    }

    // Check if player is touching the top of the canvas
    isTouchingTop() {
        return this.y <= 0;
    }

    // Handle player flap action
    flap() {
        this.stopCharge(); // Stop charging if currently charging
        if (!this.isTouchingTop()) {
            this.speedY = -this.flapSpeed; // Set vertical speed to flap speed
        }
        this.wingsDown(); // Set wings to down position
        this.game.sound.play(this.game.sound.flap); // Play flap sound
    }

    // Manage player's energy levels
    handleEnergy() {
        if (this.game.eventUpdate) {
            if (this.energy < this.maxEnergy) {
                this.energy += 0.8; // Gradually increase energy if below max
            }
            if (this.charging) {
                this.energy -= 5; // Decrease energy rapidly when charging
                if (this.energy <= 0) {
                    this.energy = 0; // Prevent energy from going negative
                    this.stopCharge(); // Stop charging if energy is depleted
                }
            }
        }
    }

    // Start charging action
    startCharge() {
        this.charging = true; // Set charging state
        this.game.speed = this.game.maxSpeed; // Set game speed to maximum
        this.wingsCharged(); // Set wings to charged position
        this.game.sound.play(this.game.sound.charge); // Play charge sound
    }

    // Stop charging action
    stopCharge() {
        this.charging = false; // Reset charging state
        this.game.speed = this.game.minSpeed; // Set game speed to minimum
    }

    // Set wings to idle position
    wingsIdle() {
        this.frameY = 0;
    }

    // Set wings to down position
    wingsDown() {
        if (!this.charging) {
            this.frameY = 1;
        }
    }

    // Set wings to up position
    wingsUp() {
        this.frameY = 2;
    }

    // Set wings to charged position
    wingsCharged() {
        this.frameY = 3;
    }
}
