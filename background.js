class Background {
    constructor(game){
        this.game = game;
        this.image = document.getElementById('bg');
        this.width = 2400;
        this.height = this.game.baseHeight;
        this.scaledWidth;
        this.scaledHeight;
        this.x;
    }
    //scroll the background automatically
    update(){
        this.x -= this.game.speed;
        if (this.x < -this.scaledWidth) {
            this.x = 0;
        } 
    }
    draw(){
        this.game.ctx.drawImage(this.image, this.x, 0, 
            this.scaledWidth, this.scaledHeight);
        //draw bg again when the last bg end
        this.game.ctx.drawImage(this.image, this.x + this.scaledWidth-1, 0, 
            this.scaledWidth, this.scaledHeight);
        //Handle devices with extra wide screen, make sure the bg fills the screen
        if (this.game.canvas.width >= this.scaledWidth) {
            this.game.ctx.drawImage(this.image, this.x + this.scaledWidth * 2-2, 0, 
                this.scaledWidth, this.scaledHeight);
        }
    }
    resize(){
        this.scaledWidth = this.width * this.game.ratio;
        this.scaledHeight = this.height * this.game.ratio;
        this.x = 0;
    }
}