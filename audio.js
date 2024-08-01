class AudioControl {
    constructor() {
        this.charge = document.getElementById('charge');
        this.flap = document.getElementById('flap');
        this.win = document.getElementById('win');
        this.lose = document.getElementById('lose');
        this.point = document.getElementById('point');
    }
    play(sound){
        sound.currentTime = 0;
        sound.play();
    }
}