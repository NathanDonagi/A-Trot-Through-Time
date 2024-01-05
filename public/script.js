Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function(){
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
})

class GameObject {
  constructor(label, x, y, width, height, imageLocation, imgs, startingAnimation, directional) {
    this.label=label
    this.x = x;
    this.y = y;
    this.xVelocity = 0
    this.yVelocity = 0
    this.width = width
    this.height = height
    this.touchingGround=true
    this.touchingIce=false
    this.touchingWater=false
    this.canJump=true
    this.currentFrame = 0
    this.currentAnimation = startingAnimation
    this.direction = "right"
    this.animationsFlipped = {}
    this.animations = {};
    if (directional) {
      for (let i = 0; i < imgs.length; i++) {
        this.animations[imgs[i][0]] = [this.getAnimationFrames(imageLocation + "/Facing Right", imgs[i][0], imgs[i][1],".png"), imgs[i][2]];
      }
      for (let i = 0; i < imgs.length; i++) {
        this.animationsFlipped[imgs[i][0]] = [this.getAnimationFrames(imageLocation + "/Facing Left", imgs[i][0], imgs[i][1],"Left.png"), imgs[i][2]];
       // console.log(this.animationsFlipped[imgs[i][0]])
      }
    } else {
      for (let i = 0; i < imgs.length; i++) {
        this.animations[imgs[i][0]] = [this.getAnimationFrames(imageLocation, imgs[i][0], imgs[i][1],".png"), imgs[i][2]];
        //console.log(this.getAnimationFrames(imageLocation,imgs[i][0],imgs[i][1]), imgs[i][2])
      }
    }  

    //console.log(this.animations, label, x, y, width, height, imageLocation, imgs, startingAnimation, directional)
  }


  getAnimationFrames(imageLocation, imageUrl, length,ending) {
    let imgs = [];
    for (let i = 1; i < length + 1; i++) {
      let temp = new Image()
      temp.src = (imageLocation + "/" + imageUrl + "/" + imageUrl + i + ending)
      imgs.push(temp)
    }
    return imgs
  }
  calcCollision(otherObject) {
    let otherCoords = [0, 0, otherObject.width, otherObject.height]
    let coords = [0, 0, this.width, this.height]
    coords[0] += this.x;
    coords[1] += this.y;
    coords[2] += this.x;
    coords[3] += this.y;
    otherCoords[0] += otherObject.x;
    otherCoords[1] += otherObject.y;
    otherCoords[2] += otherObject.x;
    otherCoords[3] += otherObject.y;
    if (coords[2] >= otherCoords[0] && coords[2] <= otherCoords[2]) {
      if (coords[3] >= otherCoords[1] && coords[3] <= otherCoords[3]) {
        return [coords[2]-otherCoords[0],coords[3]-otherCoords[1]];
      }
      if (coords[3] >= otherCoords[3] && coords[1] <= otherCoords[1]) {
        return [coords[2]-otherCoords[0],coords[3]-otherCoords[1]];
      }
      if (coords[1] >= otherCoords[1] && coords[1] <= otherCoords[3]) {
        return [coords[2]-otherCoords[0],coords[1]-otherCoords[3]];
      }
    }
    if (coords[0] >= otherCoords[0] && coords[0] <= otherCoords[2]) {
      if (coords[3] >= otherCoords[1] && coords[3] <= otherCoords[3]) {
        return [coords[0]-otherCoords[2],coords[3]-otherCoords[1]];
      }
      if (coords[3] >= otherCoords[3] && coords[1] <= otherCoords[1]) {
        return [coords[0]-otherCoords[2],coords[3]-otherCoords[1]];
      }
      if (coords[1] >= otherCoords[1] && coords[1] <= otherCoords[3]) {
        return [coords[0]-otherCoords[2],coords[1]-otherCoords[3]];
      }
    }
    if (coords[0] <= otherCoords[0] && coords[2] >= otherCoords[2]) {
      if (coords[3] >= otherCoords[1] && coords[3] <= otherCoords[3]) {
        return [coords[0]-otherCoords[2],coords[3]-otherCoords[1]];
      }
      if (coords[3] >= otherCoords[3] && coords[1] <= otherCoords[1]) {
        return [coords[0]-otherCoords[2],coords[3]-otherCoords[1]];
      }
      if (coords[1] >= otherCoords[1] && coords[1] <= otherCoords[3]) {
        return [coords[0]-otherCoords[2],coords[1]-otherCoords[3]];
      }
    }
    return [0, 0];
  }
  draw(ctx, timeStamp) {
    if((this.label=="player" || this.label=="villan") && horse && !this.currentAnimation.includes("Horse")){
      this.currentAnimation="Horse"+this.currentAnimation
    }

     if((this.label=="player" || this.label=="villan") && gravity!=1 && gravity!=0 && !this.currentAnimation.includes("Moon")){
      this.currentAnimation="Moon"+this.currentAnimation
    }

    
    if((this.label=="player") && stunned){
      this.currentAnimation="HorseStun"
    }

    // console.log(this.currentAnimation, this.animations)
    this.currentFrame = Math.floor(timeStamp / this.animations[this.currentAnimation][1]) % this.animations[this.currentAnimation][0].length
   // console.log(this.animations[this.currentAnimation][0][this.currentFrame])
    if (this.direction == "left") {
     // console.log(this.animationsFlipped[this.currentAnimation])
      if(this.label=="player" || this.label=="villan"){
         let tempImage=this.animationsFlipped[this.currentAnimation][0][this.currentFrame]
        // console.log(tempImage)
         ctx.drawImage(tempImage,0,8,tempImage.width,tempImage.height-8, this.x-cameraX-15, this.y-8-cameraY,tempImage.width,tempImage.height-8)
      }else{
        ctx.drawImage(this.animationsFlipped[this.currentAnimation][0][this.currentFrame], this.x-cameraX, this.y-cameraY)
      }
    } else {
      //console.log(this.animations)
       if(this.label=="player" || this.label=="villan"){
         let tempImage=this.animations[this.currentAnimation][0][this.currentFrame]
         ctx.drawImage(tempImage,0,8,tempImage.width,tempImage.height-8, this.x-cameraX-20, this.y-cameraY-8,tempImage.width,tempImage.height-8)
       }else{
        //console.log(this.animations)
        ctx.drawImage(this.animations[this.currentAnimation][0][this.currentFrame], this.x-cameraX, this.y-cameraY)
       }
    }
    // ctx.beginPath();
    // ctx.rect(this.x-cameraX, this.y-cameraY, this.width, this.height)
    // ctx.stroke();
  }
  switchAnimation(animation) {
    this.currentAnimation = animation
  }
  update(secondsPassed) {
    if(horse){
      this.height = 70
      if(stunned){
        this.height = 74
      }
      this.width = 60
      if(this.label=="villan"){
        this.height = 50
      }
    }else{
      this.height = 26
      this.width = 15
    }
    if(this.touchingGround){
        this.yVelocity=Math.max(this.yVelocity,0)
        this.canJump=true
    }
    
    if(! horse && this.yVelocity<300){
      this.yVelocity+=300*secondsPassed*gravity*2
    }
    if(horse && this.yVelocity<400){
      this.yVelocity+=900*secondsPassed
    }
    if(this.touchingWater){
      this.currentAnimation="Boat"
    } else if(this.touchingGround){
      if(this.xVelocity==0){
        this.currentAnimation="Idle"
      }else{
        this.currentAnimation="Run"
      }
    }else{
      if(gravity!=0){
        this.currentAnimation="Jump"
      }
    }
  }
  move(direction) {
    if(this.label=="player" && stunned){
      this.xVelocity = 0
      this.currentAnimation="HorseStun"
      return
    }
    if (direction == "right") {
      this.currentAnimation="Run"
      this.direction="right"
      if(horse){
         if(this.xVelocity<200){
           this.xVelocity=200
         }
         this.xVelocity+=100
         if(this.xVelocity>400){
           this.xVelocity=400
         }
      }else{
        if(this.xVelocity<200){
           this.xVelocity=200
         }
        if(this.touchingIce){
          if(this.xVelocity<400){
           this.xVelocity=400
         }
        }
      }
    }
    if (direction == "left") {
      this.currentAnimation="Run"
      this.direction="left"
      if(horse){
         if(this.xVelocity>-200){
           this.xVelocity=-200
         }
         this.xVelocity-=100
         if(this.xVelocity<-400){
           this.xVelocity=-400
         }
      }else{
       if(this.xVelocity>-200){
           this.xVelocity=-200
         }
      if(this.touchingIce){
          if(this.xVelocity>-400){
           this.xVelocity=-400
         }
        }
      }
    }
    if (direction == "up") {
      if(gravity!=0){
      if(this.canJump){
        this.currentAnimation="Jump"
        this.yVelocity=-240*Math.pow(gravity,.3)*1.5
        if(horse){
          this.yVelocity=-350
        }
        this.canJump=false
      }
      }else{
      this.currentAnimation="Run"
      this.yVelocity = -200
    }
    }
    if (direction == "down") {
      if(gravity!=0){
      this.currentAnimation="Jump"
      this.yVelocity= Math.max(this.yVelocity,300)
      }else{
      this.currentAnimation="Run"
      this.yVelocity = 200
    }
      
    }
  }
  friction(direction){
    if(this.label=="player" &&  stunned){
      this.xVelocity = 0
      this.yVelocity = 0
      this.currentAnimation="HorseStun"
      return
    }

    
    if (direction == "right") {
      this.currentAnimation="Idle"
      
      if(!this.touchingIce){
      this.xVelocity = 0
      }else{
        this.xVelocity*=.3
      }
    }
    if (direction == "left") {
      this.currentAnimation="Idle"
      
      if(!this.touchingIce){
      this.xVelocity = 0
      }else{
        this.xVelocity*=.3
      }
    }
    if(gravity==0){
      if (direction == "up") {
      this.currentAnimation="Idle"
      this.yVelocity = 0
    }
    if (direction == "down") {
      this.currentAnimation="Idle"
      this.yVelocity = 0
    }
    }
  }
}

class invisibleBlock {
  constructor(label, x, y, width, height) {
    this.label=label
    this.x = x;
    this.y = y;
    this.xVelocity = 0
    this.yVelocity = 0
    this.width = width
    this.height = height  
  }
  calcCollision(otherObject) {
    let otherCoords = [0, 0, otherObject.width, otherObject.height]
    let coords = [0, 0, this.width, this.height]
    coords[0] += this.x;
    coords[1] += this.y;
    coords[2] += this.x;
    coords[3] += this.y;
    otherCoords[0] += otherObject.x;
    otherCoords[1] += otherObject.y;
    otherCoords[2] += otherObject.x;
    otherCoords[3] += otherObject.y;
    if (coords[2] >= otherCoords[0] && coords[2] <= otherCoords[2]) {
      if (coords[3] >= otherCoords[1] && coords[3] <= otherCoords[3]) {
        return [coords[2]-otherCoords[0],coords[3]-otherCoords[1]];
      }
      if (coords[3] >= otherCoords[3] && coords[1] <= otherCoords[1]) {
        return [coords[2]-otherCoords[0],coords[3]-otherCoords[1]];
      }
      if (coords[1] >= otherCoords[1] && coords[1] <= otherCoords[3]) {
        return [coords[2]-otherCoords[0],coords[1]-otherCoords[3]];
      }
    }
    if (coords[0] >= otherCoords[0] && coords[0] <= otherCoords[2]) {
      if (coords[3] >= otherCoords[1] && coords[3] <= otherCoords[3]) {
        return [coords[0]-otherCoords[2],coords[3]-otherCoords[1]];
      }
      if (coords[3] >= otherCoords[3] && coords[1] <= otherCoords[1]) {
        return [coords[0]-otherCoords[2],coords[3]-otherCoords[1]];
      }
      if (coords[1] >= otherCoords[1] && coords[1] <= otherCoords[3]) {
        return [coords[0]-otherCoords[2],coords[1]-otherCoords[3]];
      }
    }
    if (coords[0] <= otherCoords[0] && coords[2] >= otherCoords[2]) {
      if (coords[3] >= otherCoords[1] && coords[3] <= otherCoords[3]) {
        return [coords[0]-otherCoords[2],coords[3]-otherCoords[1]];
      }
      if (coords[3] >= otherCoords[3] && coords[1] <= otherCoords[1]) {
        return [coords[0]-otherCoords[2],coords[3]-otherCoords[1]];
      }
      if (coords[1] >= otherCoords[1] && coords[1] <= otherCoords[3]) {
        return [coords[0]-otherCoords[2],coords[1]-otherCoords[3]];
      }
    }
    return [0, 0];
  }
  draw(ctx, timeStamp) {
    // ctx.beginPath();
    // ctx.rect(this.x-cameraX, this.y, this.width, this.height)
    // ctx.stroke();
  }
}

class Background{
  constructor(imgSource, frameRate, numFrames, s) {
    this.speed = s
    this.imgs = {};
    for (let i = 0; i < numFrames; i++) {
      let temp = new Image()
      temp.src = (imgSource+(i+1)+".png")
      this.imgs[i+1]=temp
    }
    this.currentFrame=0
    this.frameRate=frameRate
    this.numFrames=numFrames
  }
  
  draw(ctx, timeStamp, cX=cameraX, cY=cameraY) {
    //console.log("hi",this.imgs)
   // console.log(cX,cY)
    this.currentFrame = (Math.floor(timeStamp / this.frameRate) % this.numFrames)+1
    //console.log(this.currentFrame,this.imgs[this.currentFrame],-cameraX-200, -cameraY)
    ctx.drawImage(this.imgs[this.currentFrame],-cX*this.speed-200, -cY)
    }
}

class HorseBackground{
  //it should construct an array of backgrounds in its constructor
  constructor(){
    this.backgrounds = []
    this.backgrounds.push(new Background("./images/backgrounds/Horse/HorseBG",1,1,0.2))
    this.backgrounds.push(new Background("./images/backgrounds/Horse/HorseRocks",1,1,0.35))
    this.backgrounds.push(new Background("./images/backgrounds/Horse/HorseGrass",1,1,0.5))
    //^^ check if the sun goes from right to left, ask kt to change if not
  }
  //its draw method should call the draw method of each indivdual background
  draw(ctx, timeStamp, cX, cY) {
    for(let i =0; i<this.backgrounds.length; i++){
      this.backgrounds[i].draw(ctx,timeStamp, cX, cY)
    }
  }
}

class TrainBackground{
  //it should construct an array of backgrounds in its constructor
  constructor(){
    this.backgrounds = []
    this.backgrounds.push(new Background("./images/backgrounds/Train/Train_BG_-1",1,1,0.2))
    this.backgrounds.push(new Background("./images/backgrounds/Train/Train_BG_-2",1,1,0.3))
    this.backgrounds.push(new Background("./images/backgrounds/Train/Train_BG_-3",1,1,0.7))
  this.backgrounds.push(new Background("./images/backgrounds/Train/Train_BG_-4",1,1,1))
  this.backgrounds.push(new Background("./images/backgrounds/Train/Train_BG_-5",1,1,0.05))
  this.backgrounds.push(new Background("./images/backgrounds/Train/Train_BG_-6",1,1,0.1))
  }
  //its draw method should call the draw method of each indivdual background
  draw(ctx, timeStamp, cX, cY) {
    for(let i=0; i<this.backgrounds.length; i++){
      this.backgrounds[i].draw(ctx,timeStamp, cX, cY)
    }
  }
}

class CityBackground{
  //it should construct an array of backgrounds in its constructor
  constructor(){
    this.backgrounds = []
    this.backgrounds.push(new Background("./images/backgrounds/City/NYC-1",1,1,0.025))
    this.backgrounds.push(new Background("./images/backgrounds/City/NYC-2",1,1,0.05))
    this.backgrounds.push(new Background("./images/backgrounds/City/NYC-3",1,1,0.1))
    this.backgrounds.push(new Background("./images/backgrounds/City/NYC-4",1,1,0.2))
  }
  //its draw method should call the draw method of each indivdual background
  draw(ctx, timeStamp, cX, cY) {
    //console.log(this.backgrounds)
    for(let i=0; i<this.backgrounds.length; i++){
      this.backgrounds[i].draw(ctx,timeStamp, cX, cY)
    }
  }
}

class MoonBackground{
  //it should construct an array of backgrounds in its constructor
  constructor(){
    this.backgrounds = []
    this.backgrounds.push(new Background("./images/backgrounds/Moon/Moon_BG1",1,1,0))
    this.backgrounds.push(new Background("./images/backgrounds/Moon/Moon_BG2",1,1,0.005))
     this.backgrounds.push(new Background("./images/backgrounds/Moon/Earth",1,1,0.01))
    this.backgrounds.push(new Background("./images/backgrounds/Moon/Moon_BG3",1,1,0.1))
    this.backgrounds.push(new Background("./images/backgrounds/Moon/Moon_BG4",1,1,0.7))
    this.backgrounds.push(new Background("./images/backgrounds/Moon/Moon_BG5",1,1,1))
  }
  //its draw method should call the draw method of each indivdual background
  draw(ctx, timeStamp, cX, cY) {
    for(let i=0; i<this.backgrounds.length; i++){
      this.backgrounds[i].draw(ctx,timeStamp, cX, cY)
    }
  }
}

class BunkerBackground{
  //it should construct an array of backgrounds in its constructor
  constructor(){
    this.backgrounds = []
    this.backgrounds.push(new Background("./images/backgrounds/bunkerhill/RevolutionaryWar-1",1,1,0.1))
    this.backgrounds.push(new Background("./images/backgrounds/bunkerhill/RevolutionaryWar-2",1,1,0.2))
    this.backgrounds.push(new Background("./images/backgrounds/bunkerhill/RevolutionaryWar-4",1,1,0.5))
    this.backgrounds.push(new Background("./images/backgrounds/bunkerhill/RevolutionaryWar-5",1,1,1))
   
  }
  //its draw method should call the draw method of each indivdual background
  draw(ctx, timeStamp, cX, cY) {
    for(let i=0; i<this.backgrounds.length; i++){
      this.backgrounds[i].draw(ctx,timeStamp, cX, cY)
    }
  }
}

class DelawareBackground{
  //it should construct an array of backgrounds in its constructor
  constructor(){
    this.backgrounds = []
    this.backgrounds.push(new Background("./images/backgrounds/Delaware/Delaware1",1,1,0))
    this.backgrounds.push(new Background("./images/backgrounds/Delaware/Delaware2",1,1,0.1))
    this.backgrounds.push(new Background("./images/backgrounds/Delaware/Delaware3",1,1,0.5))

  }
  //its draw method should call the draw method of each indivdual background
  draw(ctx, timeStamp, cX, cY) {
    for(let i=0; i<this.backgrounds.length; i++){
      this.backgrounds[i].draw(ctx,timeStamp, cX, cY)
    }
  }
}

class HighwayBackground{
  //it should construct an array of backgrounds in its constructor
  constructor(){
    this.backgrounds = []
    this.backgrounds.push(new Background("./images/backgrounds/Highway/Highway",1,1,1))

  }
  //its draw method should call the draw method of each indivdual background
  draw(ctx, timeStamp, cX, cY) {
    for(let i=0; i<this.backgrounds.length; i++){
      this.backgrounds[i].draw(ctx,timeStamp, cX, cY)
    }
  }
}

class DebutanteBallBackground{
  //it should construct an array of backgrounds in its constructor
  constructor(){
    this.backgrounds = []
    this.backgrounds.push(new Background("./images/backgrounds/DebutanteBall/newBall_BG",200,5,0.5))


  }
  //its draw method should call the draw method of each indivdual background
  draw(ctx, timeStamp, cX, cY) {
    for(let i=0; i<this.backgrounds.length; i++){
      this.backgrounds[i].draw(ctx,timeStamp, cX, cY)
    }
  }
}

class Car {
  constructor(startX, startY, width, height, time, imgSrc) {
    this.x = startX;
    this.y = startY;
    this.img=new Image()
    this.img.src=imgSrc
    this.width=width
    this.height=height
    this.time=time
  }
  draw(ctx, timeStamp) {
    // if(!dead){
    ctx.drawImage(this.img, this.x-cameraX, this.y-cameraY)
    // ctx.beginPath();
    // ctx.rect(this.x-cameraX, this.y-cameraY, this.width, this.height)
    // ctx.stroke();
    // }
    //ctx.beginPath();
    //ctx.rect(this.x-cameraX, this.y, this.width, this.height)
    //ctx.stroke();
  }
  update(secondsPassed) {
    this.y+=this.time*secondsPassed
    if(this.y>300){
      this.y=-100
    }
  }
}

class Cannonball {
  constructor(startX, startY, width, height, time, imgSrc) {
    this.startX=startX;
    this.x = startX;
    this.y = startY;
    this.img=new Image()
    this.img.src=imgSrc
    this.width=width
    this.height=height
    this.time=time
  }
  draw(ctx, timeStamp) {
    ctx.drawImage(this.img, this.x-cameraX, this.y-cameraY)
  }
  update(secondsPassed) {
    this.x-=this.time*secondsPassed
    if(this.x<(this.startX-400)){
      this.x=this.startX
    }
  }
}

class Cutscene{
  //it should construct an array of backgrounds in its constructor
  constructor(){
    
    this.backgrounds = []
    this.startTimes = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
    this.backgrounds.push(new Background("./images/cutscenes/Bunker_Hill-/Bunker_Hill-",66,7,0))
    setTimeout(() => {this.backgrounds.push(new Background("./images/cutscenes/Second-/Second-",66,24,0))
    },7000)

    setTimeout(() => {this.backgrounds.push(new Background("./images/cutscenes/River-/River-",100,19,0))
    this.backgrounds.push(new Background("./images/cutscenes/Horse-/Horse-",180,10,0))
    this.backgrounds.push(new Background("./images/cutscenes/yeehaw",200,1,0))},10000)
    
    setTimeout(() => {this.backgrounds.push(new Background("./images/cutscenes/choochoo",200,1,0))
    this.backgrounds.push(new Background("./images/cutscenes/highway",200,1,0))
    this.backgrounds.push(new Background("./images/cutscenes/NEWYORKKK",200,1,0))},14000)

     setTimeout(() => {this.backgrounds.push(new Background("./images/cutscenes/dance",200,1,0))
    this.backgrounds.push(new Background("./images/cutscenes/Ball-/Ball-",150,4,0))
    this.backgrounds.push(new Background("./images/cutscenes/Space-/Space-",100,34,0))
    this.backgrounds.push(new Background("./images/cutscenes/astro",200,1,0))},16000)
  }
  //its draw method should call the draw method of each indivdual background
  draw(ctx, i, timeStamp) {
    if(timeStamp-this.startTimes[i]>10000){
      this.startTimes[i]=timeStamp
    }
    if(i!=9){
      this.backgrounds[i].currentFrame = Math.floor((timeStamp-this.startTimes[i]) / this.backgrounds[i].frameRate) + 1
      if(this.backgrounds[i].currentFrame>this.backgrounds[i].numFrames){
        this.backgrounds[i].currentFrame=this.backgrounds[i].numFrames
      }
    }else{
      this.backgrounds[i].currentFrame = (Math.floor(timeStamp / this.backgrounds[i].frameRate) % this.backgrounds[i].numFrames)+1
    }
    //console.log(this.currentFrame,this.imgs[this.currentFrame],-cameraX-200, -cameraY)
     ctx.drawImage(this.backgrounds[i].imgs[this.backgrounds[i].currentFrame],93,97,480,270)
  }
}

class Fakesong{
  //it should construct an array of backgrounds in its constructor
  constructor(){
  }
  //its draw method should call the draw method of each indivdual background
  setTime() {
  }
  pause() {
  }
  play() {
  }
}

class Food{
  //it should construct an array of backgrounds in its constructor
  constructor(x,y,width,height,imagePath){
    this.x=x
    this.y=y
    this.width=width
    this.height=height
    this.img = new Image()
    this.img.src = imagePath
  }
  //its draw method should call the draw method of each indivdual background
  draw() {
     ctx.drawImage(this.img, this.x-cameraX, this.y-cameraY)
  }
}

var cameraX=-293
var cameraY=-97
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let secondsPassed = 0;
let oldTimeStamp = 0;
let blocks = []
let projectiles = []
let titleScreen=new Background("./images/backgrounds/Title Screen/title screen",200,1,1)
let currentBackground = titleScreen
ctx.clearRect(0, 0, canvas.width, canvas.height);
currentBackground.imgs[1].onload = function () {
   ctx.drawImage(titleScreen.imgs[1],0,0)
}

let cutscene = false
let bunkerBackground = new BunkerBackground()
let delawareBackground = new DelawareBackground()
let highwayBackground = new HighwayBackground()
let debutanteBallBackground = new DebutanteBallBackground()
let debutanteBallBalcony=new Background("./images/backgrounds/DebutanteBall/Ball_BG_on_top",200,1,1)

let horseBackground = new HorseBackground()
let trainBackground = new TrainBackground()
let moonBackground = new MoonBackground()
let cityBackground = new CityBackground()
let empireState = new Background("./images/backgrounds/City/Building",1,1,1)

let cutsceneBackground = new Cutscene();
let cs = 0

let arcade = new Image()
arcade.src = "./images/bg.png"

let arcadet = new Image()
arcadet.src = "./images/bgt.png"

let timerBox = new Image()
timerBox.src = "./images/timer box.png"

let allowingSkip = true
let rand = null
let revWar =  new Background("./images/backgrounds/Revolutionary War/RevolutionaryWar-",200,10,.5);
let wildWest = new Background("./images/backgrounds/Wild West/Wild_West_Compiled-",200,10,1)
let roaring20s = new Background("./images/backgrounds/Roaring 20s/Roaring_20s-",200,10,1)
let food = []
let player =  new GameObject("player", -190, 170, 15, 26, "./images/Turkey", [["Idle", 2, 250], ["Jump", 2, 100], ["Run", 6, 100], ["Boat", 2, 200]], "Idle", true)

let villan = new GameObject("villan", -190, 170, 15, 26, "./images/auto", [["HorseRun", 8, 85], ["HorseIdle", 2, 250], ["HorseStun", 4, 250], ["HorseJump", 5, 150]], "HorseIdle", false)
let maxX=null
let maxY=null
let level=-1
let musicNotStarted=true
let timePassed =0
let title_screen=new Background("./images/backgrounds/Title Screen/title screen",200,1,1)
let dead = new Background("./images/backgrounds/dead/dead",200,1,1)

let countdown = new Background("./images/backgrounds/countdown/countdown",999,4,1)
let instructions = new Background("./images/backgrounds/instructions/instructions-0",999,3,1)

let blocksSetUp = false
let win = new Background("  ./images/backgrounds/Win Screen/es",5000,2,1)
let thanks = new Background("./images/backgrounds/thanks/thanks4playing",5000,1,1)
let horse = false
let stunned = false
let autoScroll = false
let last = true
let vlast = true
let foreground = []
let gravity = 1
let howLongLevelHasBeenGoing = 0
let scrollsUp = false

let gw = null

let anthemSong  = new Audio();
let anthemSource  = document.createElement("source");
anthemSource.type = "audio/mpeg";
anthemSource.src  = "./audio/anthem.mp3";
anthemSong.appendChild(anthemSource);
anthemSong.volume = 0.15;
anthemSong.addEventListener("ended", function(){
  anthemSong.currentTime = 0;
    anthemSong.play()
});

let citySong = new Fakesong()
let creditsSong = new Fakesong()
let debutanteIntroSong = new Fakesong()
let debutanteSong = new Fakesong()
let moonSong = new Fakesong()
let trainSong = new Fakesong()
let westSong = new Fakesong()
let woodstockSong = new Fakesong()

function setUpMusic(){  
  
citySong  = new Audio();
let citySource  = document.createElement("source");
citySource.type = "audio/mpeg";
citySource.src  = "./audio/city.mp3";
citySong.appendChild(citySource);
citySong.addEventListener("ended", function(){
  citySong.currentTime = 0;
    citySong.play()
});
  
creditsSong  = new Audio();
let creditsSource  = document.createElement("source");
creditsSource.type = "audio/mpeg";
creditsSource.src  = "./audio/credits.mp3";
creditsSong.appendChild(creditsSource);
creditsSong.volume=0.4
creditsSong.addEventListener("ended", function(){
  creditsSong.currentTime = 1000;
  creditsSong.play()
});
  
  
debutanteIntroSong  = new Audio();
let debutanteIntroSource  = document.createElement("source");
debutanteIntroSource.type = "audio/mpeg";
debutanteIntroSource.src  = "./audio/debutante-intro.mp3";
debutanteIntroSong.appendChild(debutanteIntroSource);
debutanteIntroSong.addEventListener("ended", function(){
  debutanteSong.currentTime = 0;
  debutanteIntroSong.currentTime = 0;
  debutanteSong.play()
});


debutanteSong  = new Audio();
let debutanteSource  = document.createElement("source");
debutanteSource.type = "audio/mpeg";
debutanteSource.src  = "./audio/debutante.mp3";
debutanteSong.appendChild(debutanteSource);
debutanteSong.volume = 1;
debutanteSong.addEventListener("ended", function(){
  debutanteSong.currentTime = 0;
  debutanteSong.play()
});

function amplifyMedia(mediaElem, multiplier) {
  var context = new (window.AudioContext || window.webkitAudioContext),
      result = {
        context: context,
        source: context.createMediaElementSource(mediaElem),
        gain: context.createGain(),
        media: mediaElem,
        amplify: function(multiplier) { result.gain.gain.value = multiplier; },
        getAmpLevel: function() { return result.gain.gain.value; }
      };
  result.source.connect(result.gain);
  result.gain.connect(context.destination);
  result.amplify(multiplier);
  return result;
}
var amp = amplifyMedia(debutanteSong, 1);
amp.amplify(4);

var amp2 = amplifyMedia(debutanteIntroSong, 1);
amp2.amplify(4);

moonSong  = new Audio();
let moonSource  = document.createElement("source");
moonSource.type = "audio/mpeg";
moonSource.src  = "./audio/moon.mp3";
moonSong.appendChild(moonSource);
moonSong.volume = 0.6;
moonSong.addEventListener("ended", function(){
  moonSong.currentTime = 0;
  moonSong.play()
});

trainSong  = new Audio();
let trainSource  = document.createElement("source");
trainSource.type = "audio/mpeg";
trainSource.src  = "./audio/train.mp3";
trainSong.appendChild(trainSource);
trainSong.volume = 0.7;
trainSong.addEventListener("ended", function(){
  trainSong.currentTime = 0;
  trainSong.play()
});

westSong  = new Audio();
let westSource  = document.createElement("source");
westSource.type = "audio/mpeg";
westSource.src  = "./audio/west.mp3";
westSong.appendChild(westSource);
westSong.addEventListener("ended", function(){
  westSong.currentTime = 0;
  westSong.play()
});

woodstockSong  = new Audio();
let woodstockSource  = document.createElement("source");
woodstockSource.type = "audio/mpeg";
woodstockSource.src  = "./audio/woodstock.mp3";
woodstockSong.appendChild(woodstockSource);
woodstockSong.addEventListener("ended", function(){
  woodstockSong.currentTime = 0;
  woodstockSong.play()
});

}

let themeSong  = new Audio();
let themeSource  = document.createElement("source");
themeSource.type = "audio/mpeg";
themeSource.src  = "./audio/theme.mp3";
themeSong.appendChild(themeSource);
themeSong.volume = 0.1;
themeSong.addEventListener("ended", function(){
  themeSong.currentTime = 0;
  themeSong.play()
});

function pauseMusic(){
  
    if(anthemSong!=null){
      pauseVid(anthemSong)
    }
    if(citySong!=null){
       pauseVid(citySong)
    }
    if(creditsSong!=null){
       pauseVid(creditsSong)
    }
    if(debutanteIntroSong!=null){
       pauseVid(debutanteIntroSong)
    }
    if(debutanteSong!=null){
       pauseVid(debutanteSong)
    }
    if(moonSong!=null){
       pauseVid(moonSong)
    }
    if(themeSong!=null){
       pauseVid(themeSong)
    }
    if(trainSong!=null){
       pauseVid(trainSong)
    }
    if(westSong!=null){
       pauseVid(westSong)
    }
    if(woodstockSong!=null){
       pauseVid(woodstockSong)
    }
}

              
let keys = [['right', 698],
['up', 969],
['up', 2086],
['up', 2587],
['up', 2673],
['up', 3442],
['up', 4133],
['up', 4634],
['up', 4717],
['up', 4800],
['up', 5267],
['up', 5765],
['up', 5850],
['up', 5932],
['up', 8037],
['up', 8538],
['up', 8624],
['up', 9530],
['up', 10517],
['up', 11017],
['up', 11101],
['up', 11585],
['up', 12321],
['up', 13708],
['up', 15313],
['right', 15953],
['up', 16058],
['up', 16560],
['up', 17141],
['up', 17642],
['up', 18576],
['up', 20326],
['up', 21103],
['up', 22016],
['up', 22517],
['up', 22600],
['up', 23261],
['up', 23760]]
let keyups = [['up', 1281],
['up', 2745],
['up', 3829],
['up', 4838],
['up', 5981],
['up', 8662],
['up', 9985],
['up', 11109],
['up', 12049],
['up', 12811],
['up', 13992],
['up', 15468],
['right', 15708],
['up', 16624],
['up', 17664],
['up', 19085],
['up', 20492],
['up', 21535],
['up', 22652],
['up', 23765],
['right', 27348]]

function createPlayer(){
  return new GameObject("player", -190, 170, 15, 26, "./images/Turkey", [["Idle", 2, 250], ["Jump", 2, 100], ["Run", 6, 100], ["Boat", 2, 200], ["HorseRun", 8, 85], ["HorseIdle", 2, 250], ["HorseStun", 4, 250], ["HorseJump", 5, 150], ["MoonIdle", 2, 250], ["MoonJump", 2, 100], ["MoonRun", 6, 100]], "Idle", true)
}


async function playVid(video) {      
    if (video.paused && !video.playing) {
        return video.play();
    }
} 

// Pause video function
function pauseVid(video) {     
    if (!video.paused && video.playing) {
        video.pause();
    }
}


var lookup = {
  "grass": ["block","grass", 1],
  "river": ["water","river", 1],
  "cannon": ["cannon","cannon",8],
  "wood floor": ["block","wood floor",1],
  "concrete": ["block","concrete",1],
  "moon rock": ["block","moon",1]
};

function loadBlocks(data){
  output = []
  b=data.split(/\r?\n/);
  for(var i=0; i<b.length; i++){
    b[i]=b[i].split(", ")
  }
  for(var i=0; i<b.length; i++){
    var bl = b[i]
   // console.log(bl)
    output.push(new GameObject(lookup[bl[0]][0], parseInt(bl[1])-200, parseInt(bl[2]), 25, 25, "./images/blocks", [[lookup[bl[0]][1], 1, 250]], lookup[bl[0]][1], false))
  }
  return output
}

let bunkerBlocks = loadBlocks(bunkerHillText)

let delawareBlocks = []
let horseBlocks=[]
let trainBlocks = []
let cityBlocks = []
let empireBlocks = []
let ballroomBlocks = []
let moonBlocks = []
let cars=[]

function setUpBlocks(){
  for(let i =0; i<200; i++){
     delawareBlocks.push(new GameObject("water", -200+i*25, 260, 25, 25, "./images/blocks", [["river", 1, 250]], "river", false))
  }

  
  for(let i =0; i<3; i++){
     delawareBlocks.push(new GameObject("ice", -200+i*25, 250, 25, 25, "./images/blocks", [["ice", 1, 250]], "ice", false))
  }
 for(let i =0; i<5; i++){
     delawareBlocks.push(new GameObject("ice", -200+10*25+i*25, 250-50, 25, 25, "./images/blocks", [["ice", 1, 250]], "ice", false))
  }
  
  for(let i =0; i<3; i++){
     delawareBlocks.push(new GameObject("ice", -200+20*25+i*25, 250-100, 25, 25, "./images/blocks", [["ice", 1, 250]], "ice", false))
  }

  for(let i =0; i<1; i++){
     delawareBlocks.push(new GameObject("ice", -200+38*25+i*25, 250-100, 25, 25, "./images/blocks", [["ice", 1, 250]], "ice", false))
  }

  for(let i =0; i<3; i++){
     delawareBlocks.push(new GameObject("ice", -200+52*25+i*25, 250-150, 25, 25, "./images/blocks", [["ice", 1, 250]], "ice", false))
  }

  for(let i =0; i<2; i++){
     delawareBlocks.push(new GameObject("ice", -200+65*25+i*25, 250-75, 25, 25, "./images/blocks", [["ice", 1, 250]], "ice", false))
  }

  for(let i =0; i<4; i++){
     delawareBlocks.push(new GameObject("ice", -200+71*25+i*25, 250-125, 25, 25, "./images/blocks", [["ice", 1, 250]], "ice", false))
  }

  for(let i =0; i<1; i++){
     delawareBlocks.push(new GameObject("ice", -200+90*25+i*25, 250-150, 25, 25, "./images/blocks", [["ice", 1, 250]], "ice", false))
  }

  for(let i =0; i<5; i++){
     delawareBlocks.push(new GameObject("ice", -200+95*25+i*25, 250-200, 25, 25, "./images/blocks", [["ice", 1, 250]], "ice", false))
  }

  for(let i =0; i<5; i++){
     delawareBlocks.push(new GameObject("ice", -200+110*25+i*25, 250-125, 25, 25, "./images/blocks", [["ice", 1, 250]], "ice", false))
  }
  //Functions used for building
function stack(x,y,height){
  for(let i=1; i<=height; i++){
    horseBlocks.push(new GameObject("block", -200+25*x, 249-(y+(25*i)), 25, 25, "./images/blocks", [["canyon", 1, 250]], "canyon", false))
  }
}
function row(x, y, length){
  for(let i=1; i<=length; i++){
    horseBlocks.push(new GameObject("block", -200+(25*x)+(25*i), 249-y, 25, 25, "./images/blocks", [["canyon", 1, 250]], "canyon", false))
  }
}
  for(let i=0; i<380; i++){
    horseBlocks.push(new GameObject("block", -200+(25*i), 249, 25, 25, "./images/blocks", [["canyon", 1, 250]], "canyon", false))
  }
   horseBlocks.push(new GameObject("block", -200+25*10, 249-25, 25, 25, "./images/blocks", [["canyon", 1, 250]], "canyon", false))
  stack(20,0,2);
  row(31,50,3);
  stack(38,0,4);
  row(42,50,3);
  stack(50,0,4);
  row(53,75,3);
  stack(76,0,2);
  stack(77,0,2);
  stack(89,0,1);
  stack(90,0,1);
  stack(100,0,2);

  //2nd part
  row(109,50,27);
  stack(118,50,2);
  stack(119,50,2);
  stack(129,50,1);

  //3rd part 
  row(144,25,36);
  row(152,50,26);
  stack(150,25,2);
  stack(160,50,2);
  stack(161,50,2);
  stack(174,50,2);

  //4th part
  row(189,25,42);
  row(198,50,32);
  row(198,75,31);
  stack(207,75,1);
  stack(208,75,1);
  stack(219,75,2);
  stack(220,75,2);


 for(let i =0; i<500; i++){
     trainBlocks.push(new GameObject("chain", -200+i*12, 260, 12, 12, "./images/blocks", [["connector", 1, 250]], "connector", false))
  }
  
  stacker(-200,210,10)
  
  stacker(50,200,20)

  stacker(500,200,10)

  stacker(700,200,3)

  stacker(1000,200,12)

  stacker(1400,200,5)

  stacker(1750,200,5)
  
  stacker(2100,200,5)

  stacker(2400,200,20)

  stacker(2800,200,14)

  stacker(3200,200,6)

  trainBlocks.push(new GameObject("car", 3300 , 160, 12, 20, "./images/blocks", [["Front_Train_Car-", 8, 250]], "Front_Train_Car-", false))

  trainBlocks.push(new invisibleBlock("block", 3325 , 200, 45, 60))
  trainBlocks.push(new invisibleBlock("block", 3310 , 215, 75, 80))
  trainBlocks.push(new invisibleBlock("block", 3375 , 255, 100, 30))

function stacker(x,y,length){
  trainBlocks.push(new GameObject("block", x, y, 12, 70, "./images/blocks", [["train car left", 1, 250]], "train car left", false))
  for(let i =1; i<length; i++){
     trainBlocks.push(new GameObject("block", x+12*i, y, 12, 70, "./images/blocks", [["train car mid", 1, 250]], "train car mid", false))
  }
  trainBlocks.push(new GameObject("block", x+12*length,y, 12, 70, "./images/blocks", [["train car right", 1, 250]], "train car right", false))
}

cityBlocks=loadBlocks(cityText)
empireBlocks=loadBlocks(empireText)
  
for(object in empireBlocks){
  empireBlocks[object].y-=1725
}
ballroomBlocks = loadBlocks(ballroomText)
for(let i =0; i<300; i++){
     ballroomBlocks.push(new GameObject("block", -200+i*25, -30, 25, 25, "./images/blocks", [["wood floor", 1, 250]], "wood floor", false))
  }

  moonBlocks.push(new GameObject("block", -200, 250, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
  moonBlocks.push(new GameObject("block", -200+25, 250, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
  moonBlocks.push(new GameObject("block", -200+50, 250, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
  moonBlocks.push(new GameObject("block", -200+75, 250, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))

  
   moonBlocks.push(new GameObject("block", -200+25*14, 250-6*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
  
  moonBlocks.push(new GameObject("block", -200+25*30, 250-6*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
  moonBlocks.push(new GameObject("block", -200+25*31, 250-6*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
  moonBlocks.push(new GameObject("block", -200+25*32, 250-6*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
   moonBlocks.push(new GameObject("block", -200+25*33, 250-6*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
  moonBlocks.push(new GameObject("block", -200+25*34, 250-6*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
  moonBlocks.push(new GameObject("block", -200+25*35, 250-6*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))

  moonBlocks.push(new GameObject("block", -200+25*63, 250-3*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
  moonBlocks.push(new GameObject("block", -200+25*64, 250-3*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
  moonBlocks.push(new GameObject("block", -200+25*65, 250-3*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
  moonBlocks.push(new GameObject("block", -200+25*66, 250-3*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
  moonBlocks.push(new GameObject("block", -200+25*67, 250-3*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
  
  moonBlocks.push(new GameObject("block", -200+25*68, 250-3*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
  moonBlocks.push(new GameObject("block", -200+25*69, 250-3*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
  
  moonBlocks.push(new GameObject("block", -200+25*75, 250-5*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
  moonBlocks.push(new GameObject("block", -200+25*76, 250-5*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
  moonBlocks.push(new GameObject("block", -200+25*77, 250-5*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))

  moonBlocks.push(new GameObject("block", -200+25*82, 250-6*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
   moonBlocks.push(new GameObject("block", -200+25*83, 250-6*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
   moonBlocks.push(new GameObject("block", -200+25*84, 250-6*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
   moonBlocks.push(new GameObject("block", -200+25*85, 250-6*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
   moonBlocks.push(new GameObject("block", -200+25*86, 250-6*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))

moonBlocks.push(new GameObject("block", -200+25*116, 250-1*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
  moonBlocks.push(new GameObject("block", -200+25*117, 250-1*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
moonBlocks.push(new GameObject("block", -200+25*118, 250-1*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
  moonBlocks.push(new GameObject("block", -200+25*119, 250-1*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))
  moonBlocks.push(new GameObject("block", -200+25*120, 250-1*25, 25, 25, "./images/blocks", [["moon", 1, 250]], "moon", false))

}

function setUplevel1(){
  setTimeout(() => {pauseMusic()
  playVid(anthemSong)},100)
  pauseMusic()
  anthemSong.currentTime = 0;
  playVid(anthemSong)
  projectiles=[]
  let coords = [[784, 118],
[1177, 213],
[1481, 64],
[3327, 211],
[3411, 211],
[2784, 121],
[2671, 229]]
  for(object in coords){
    var x = coords[object][0]
    var y = coords[object][1]
    projectiles.push(new Cannonball(x-200, y, 25, 25, 200, "./images/projectiles/ball.png"))
  }
  
  scrollsUp=false
  gravity=1
  autoScroll=false
  foreground = []
  horse=false
  food=[]
  food.push(new Food(260,110,25,25,"./images/food/apple.png"))
  timePassed=0
  maxX=2650
  minX=-200
  player = createPlayer()
  currentBackground = bunkerBackground
  blocks = bunkerBlocks 
  allowingSkip=false
  setTimeout(() => {allowingSkip=true},1000)

  setTimeout(() => {if(!blocksSetUp){
    setUpBlocks()
    setUpMusic()
    blocksSetUp=true
    gw = new GameObject("gw", -200, 200, 25, 25, "./images/", [["gw-", 3, 250]], "gw-", false)
    setTimeout(() => {allowingSkip=true},5000)
  }}, 2000)
}

function setUplevel2(){
  playVid(anthemSong)
  projectiles=[]
  gw = new GameObject("gw", -200, 200, 25, 25, "./images/", [["gw-", 3, 250]], "gw-", false)
    setTimeout(() => {allowingSkip=true},5000)
  gw.x=-500
  scrollsUp=false
  gravity=1
  autoScroll=false
  foreground = []
  horse=false
  food=[]
  maxX=3200
  minX=-200
  player = createPlayer()
  currentBackground = delawareBackground
  blocks = delawareBlocks
}

function setUplevel3(){
  westSong.currentTime = 0;
  playVid(westSong)
  projectiles=[]
  scrollsUp=false
  gravity = 1
  autoScroll=false
  horse=true
  food=[]
  maxX=6100
  minX=-200
  player = createPlayer()
  setTimeout(() => {villan= new GameObject("villan", -190, 170, 15, 26, "./images/auto", [["HorseRun", 8, 85], ["HorseIdle", 2, 250], ["HorseStun", 4, 250], ["HorseJump", 5, 150]], "HorseIdle", false)}, 500)
  currentBackground = horseBackground
  blocks=horseBlocks

  villan.x=-190
  villan.y=170
  villan.xVelocity=0
  villan.yVelocity=90
  
  for(let i=0; i<keys.length; i++){
    setTimeout(() => {villan.move(keys[i][0])}, keys[i][1]+4000)
  }
  for(let i=0; i<keyups.length; i++){
    setTimeout(() => {villan.friction(keyups[i][0])}, keyups[i][1]+4000)
  }
}

function setUplevel4(){
  trainSong.currentTime = 0;
  playVid(trainSong)
  projectiles=[]
  scrollsUp=false
  howLongLevelHasBeenGoing=0
  autoScroll=true
  foreground = []
  horse=false
  food=[]
  maxX=3500
  minX=-200
  player = createPlayer()
  currentBackground = trainBackground
  blocks = trainBlocks
  cars=[]
  for(let i =0; i<26; i++){
      cars.push(new Car(25+Math.floor(47.84*i), -Math.random()*400, 35, 57, 50+Math.floor(Math.random()*100), "./images/projectiles/Car-" + (Math.floor(Math.random()*4)+1).toString() + ".png"))
  }
  
}

function setUplevel5(){
  woodstockSong.currentTime = 0;
  playVid(woodstockSong)
  scrollsUp=false
  gravity=0
  autoScroll=false
  foreground = []
  horse=false
  food=[]
  maxX=1400
  minX=-200
  player = createPlayer()
  currentBackground = highwayBackground
  blocks = []
  projectiles = cars
}

function setUplevel6(){
  citySong.currentTime = 0;
  playVid(citySong)
  projectiles = []
  scrollsUp=false
  gravity=1
  autoScroll=false
  foreground = []
  horse=false
  food=[]
  food.push(new Food(1040, 110, 25, 25,"./images/food/pizza.png"))
  maxX=3200
  minX=-200
  player = createPlayer()
  currentBackground = cityBackground
  blocks = cityBlocks
}

function setUplevel7(){
  playVid(citySong)
  projectiles=[]
  scrollsUp=true
  gravity=1
  autoScroll=false
  foreground = []
  horse=false
  food=[]
  maxX=270
  minX=-200
  player = createPlayer()
  currentBackground = empireState
  blocks = empireBlocks
}

function setUplevel8(){
  debutanteIntroSong.currentTime = 0;
  debutanteSong.currentTime = 0;
  playVid(debutanteIntroSong)
  scrollsUp=false
  gravity=1
  autoScroll=false
  foreground = []
  horse=false
  food=[]
  food.push(new Food(1581, 100, 25, 25,"./images/food/slider.png"))
  maxX=3200
  minX=-200
  player = createPlayer()
  currentBackground = debutanteBallBackground
 // console.log(currentBackground)
  blocks = ballroomBlocks

  
  
}

function setUplevel9(){
  moonSong.currentTime = 0;
  playVid(moonSong)
  projectiles=[]
  scrollsUp=false
  gravity=0.3
  autoScroll=false
  foreground = []
  horse=false
  food=[]
  maxX=3200
  minX=-200
  player = createPlayer()
  currentBackground = moonBackground
  blocks = moonBlocks
}

function nextScene(){
 pauseMusic()
  if(level==-5){
    themeSong.currentTime = 0;
    playVid(themeSong)
    currentBackground = win
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(arcade,0,0); 

     setTimeout(() => {ctx.clearRect(0, 0, canvas.width, canvas.height);  ctx.drawImage(arcadet,0,0); ctx.drawImage(currentBackground.imgs[1],93,97,480,270)}, 50)

    setTimeout(() => {ctx.clearRect(0, 0, canvas.width, canvas.height);  ctx.drawImage(arcadet,0,0); ctx.drawImage(currentBackground.imgs[1],93,97,480,270)}, 1000)
    
    setTimeout(() => {ctx.clearRect(0, 0, canvas.width, canvas.height);ctx.drawImage(arcadet,0,0);ctx.drawImage(currentBackground.imgs[2],93, 97,480,270)}, 2000)

    setTimeout(() => {level=-1;nextScene();}, 4000)

  }
  if(level==-2){
    themeSong.currentTime = 0;
    playVid(themeSong)
    currentBackground = dead
    //console.log(currentBackground)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(currentBackground.imgs[1],93,97,480,270)
    window.setTimeout(nextScene,5000)
  } 
  if(level==-1){
    //console.log("bonjoure")
    currentBackground = title_screen
    //console.log(currentBackground)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(title_screen.imgs[1],0,0)
  }
  if(level==-8){
    creditsSong.currentTime = 1000;
    playVid(creditsSong)
    currentBackground = instructions
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(arcadet,0,0)
    ctx.drawImage(currentBackground.imgs[1], 93, 97,480,270)

    setTimeout(() => {ctx.drawImage(arcadet,0,0);ctx.drawImage(currentBackground.imgs[1], 93, 97,480,270)}, 2000)

    setTimeout(() => {ctx.drawImage(arcadet,0,0);ctx.drawImage(currentBackground.imgs[2], 93, 97, 480,270)}, 4000)
    
    setTimeout(() => {ctx.drawImage(arcadet,0,0);ctx.drawImage(currentBackground.imgs[3], 93, 97,480,270)}, 6000)
    

    setTimeout(() => {currentBackground = countdown; ctx.clearRect(0, 0, canvas.width, canvas.height);ctx.drawImage(arcade,0,0);ctx.drawImage(currentBackground.imgs[1],canvas.width/2-currentBackground.imgs[1].width/2, canvas.height/2-currentBackground.imgs[1].height/2)}, 8000)

    
    setTimeout(() => {currentBackground = countdown; ctx.clearRect(0, 0, canvas.width, canvas.height);ctx.drawImage(arcade,0,0);ctx.drawImage(currentBackground.imgs[2],canvas.width/2-currentBackground.imgs[2].width/2, canvas.height/2-currentBackground.imgs[2].height/2)}, 9000)

    setTimeout(() => {ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(arcade,0,0);ctx.drawImage(currentBackground.imgs[3],canvas.width/2-currentBackground.imgs[2].width/2, canvas.height/2-currentBackground.imgs[2].height/2)}, 10000)

    setTimeout(() => {ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(arcade,0,0);ctx.drawImage(currentBackground.imgs[4],canvas.width/2-currentBackground.imgs[2].width/2, canvas.height/2-currentBackground.imgs[2].height/2)}, 11000)

    
    setTimeout(() => {level=0;
    nextScene()}, 12000)
    //console.log("hello there")
  }
  if(level==0){
    themeSong.currentTime=0;
    playVid(themeSong)
    document.addEventListener('keydown', function (event) {
      // for(let i=0; i<1000; i++){
      //   console.log("REMEMBER TO TAKE THIS OUT OF THE FINAL GAME FOR THE LOVE OF GOD")
      // // }
      if (level>0 && allowingSkip && event.key == "l") {
        allowingSkip=false
        setTimeout(() => {allowingSkip=true}, 1000)
        console.log(level)
        nextScene()
      }
      
      if (event.key == "a" || event.keyCode == 37) {
        player.move("left")
      }
      if (event.key == "w" || event.keyCode == 38 || event.keyCode == 32) {
        player.move("up")
      }
      if (event.key == "d" || event.keyCode == 39) {
        player.move("right")
      }
      if (event.key == "s" || event.keyCode == 40) {
        player.move("down")
      }
    });

    document.addEventListener('keyup', function (event) {
      if (event.key == "a" || event.keyCode == 37) {
        player.friction("left")
      }
      if (event.key == "d" || event.keyCode == 39) {
        player.friction("right")
      }

       if (event.key == "s" || event.keyCode == 38  || event.keyCode == 32) {
        player.friction("up")
      }
      if (event.key == "w" || event.keyCode == 40) {
        player.friction("down")
      }
    });

    window.addEventListener("keydown", function(e) {
        if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);

    document.addEventListener("click", getCursorPosition);
    setUplevel1()
    timePassed=0
    window.requestAnimationFrame(loop)
    setTimeout(() => {timePassed=0;}, 100)
    
    // level=1 
    // nextScene()
  }
  if(level==1){
    cs=0
    cutscene = true
    setTimeout(() => { cs=1;}, 66*7)
    setTimeout(() => { cutscene = false;}, 66*24+150*7)
    setUplevel2()
  }
  if(level==2){
    cs=2
    cutscene = true
    setTimeout(() => { cs=3;}, 1900)
    setTimeout(() => { cutscene = false;}, 1800+1900)
    setUplevel3()
  }
  if(level==3){
    cs=4
    cutscene = true
    setTimeout(() => { cutscene = false;}, 2000)
    setUplevel4()
  }
  if(level==4){
    cs=5
    cutscene = true
    setTimeout(() => { cs=6;}, 2000)
    setTimeout(() => { cutscene = false;}, 5000)
    setUplevel5()
  }
  if(level==5){
    setUplevel6()
    cs=7
    cutscene = true
    setTimeout(() => { cutscene = false;}, 2000)
  }
  if(level==6){
    setUplevel7()
  }
  if(level==7){
    cs=8
    cutscene = true
    setTimeout(() => { cs=9;}, 2000)
    setTimeout(() => { cutscene = false;}, 5000)
    setUplevel8()
  }
  if(level==8){
    cs=10
    cutscene = true
    setTimeout(() => { cutscene = false;}, 2800)
    setUplevel9()
  }
  if(level==9){
    level=-5
    nextScene()
   
  }
  level++
}

function restartGame(){
  if(level>0){
    level=-2
    window.setTimeout(nextScene,100)
    timePassed=0
  }
}
//nextScene()

function update(secondsPassed) {
  last=player.touchingGround
  player.touchingGround=false
  player.touchingWater=false
  
  if(player.currentAnimation!="Boat"){
    if(horse){
      player.x += player.xVelocity * secondsPassed*.9
    }else{
        player.x += player.xVelocity * secondsPassed
    }
  }else{
    player.x += player.xVelocity * secondsPassed*.5
  }

  player.touchingIce=false
  
  for(object in blocks){
    if(horse && player.calcCollision(blocks[object])[0]!=0 && (blocks[object].label=="block" || blocks[object].label=="water" || blocks[object].label=="ice") && Math.abs(player.xVelocity)>275){
      stunned=true
      player.y-=20
      player.xVelocity=0
      player.x-=player.calcCollision(blocks[object])[0]+20*Math.sign(player.calcCollision(blocks[object])[0])
      setTimeout(() => {
      stunned=false
    },2000)
    }
    
    if((blocks[object].label=="block" || blocks[object].label=="water" || blocks[object].label=="ice")){
       player.x-=player.calcCollision(blocks[object])[0]+1*Math.sign(player.calcCollision(blocks[object])[0])
    }
  }

  player.y += player.yVelocity * secondsPassed
  for(object in blocks){
    if(player.calcCollision(blocks[object])[1]>0){
      if((blocks[object].label=="block" || blocks[object].label=="water" || blocks[object].label=="ice")){
        player.touchingGround=true
      }
      if(blocks[object].label=="water"){
        player.touchingWater=true
      }
      if(blocks[object].label=="ice"){
        player.touchingIce=true
      }
    }else if(player.calcCollision(blocks[object])[1]<0){
      if((blocks[object].label=="block" || blocks[object].label=="water" || blocks[object].label=="ice")){
      player.yVelociy=0
      }
    }
    if((blocks[object].label=="block" || blocks[object].label=="water" || blocks[object].label=="ice")){
    player.y-=player.calcCollision(blocks[object])[1]+1*Math.sign(player.calcCollision(blocks[object])[1])
    }
  }

  if(!player.touchingGround && last){
    player.yVelocity=Math.min(30,player.yVelocity)
  //   setTimeout(() => {player.yVelocity=Math.min(0,player.yVelocity)}, 100)
  }

 // console.log(projectiles)
  for(object in projectiles){
    if(player.calcCollision(projectiles[object])[1]!=0){
      player = createPlayer()
      cameraX=-293
    }
    projectiles[object].update(secondsPassed)
  }
  
  for(let i=food.length-1; i>=0; i--){
    if(player.calcCollision(food[i])[1]!=0){
      timePassed-=10
      food.splice(i,1)
    }
  }

  
  //console.log(cameraX)
  player.update(secondsPassed)

  player.x=Math.max(minX+15,player.x)
  player.x=Math.min(maxX,player.x)

  if(horse){
    vlast=villan.touchingGround
    villan.touchingGround=false
    villan.touchingWater=false
    villan.x += villan.xVelocity * secondsPassed*.8
  
  for(object in blocks){
    villan.x-=villan.calcCollision(blocks[object])[0]+1*Math.sign(villan.calcCollision(blocks[object])[0])
  }

  villan.y += villan.yVelocity * secondsPassed
  for(object in blocks){
    if(villan.calcCollision(blocks[object])[1]>0){
      villan.touchingGround=true
    }else if(villan.calcCollision(blocks[object])[1]<0){
      villan.yVelociy=0
    }
    villan.y-=villan.calcCollision(blocks[object])[1]+1*Math.sign(villan.calcCollision(blocks[object])[1])
  }

  if(!villan.touchingGround && vlast){
    villan.yVelocity=Math.min(30,villan.yVelocity)
  }
  villan.update(secondsPassed)

  villan.x=Math.max(minX+15,villan.x)
  villan.x=Math.min(maxX,villan.x)
  }

  howLongLevelHasBeenGoing+=secondsPassed

  cameraX=player.x-293
  cameraY=-97
  
  if(scrollsUp){
    cameraY=player.y-197
    cameraY=Math.max(-1500,cameraY)
    cameraY=Math.min(-97,cameraY)
  }
 
  // if(autoScroll){
  //    cameraX=Math.max(player.x-200,howLongLevelHasBeenGoing*40-200)
  // }
  

  cameraX=Math.max(minX-93,cameraX)
  cameraX=Math.min(maxX-470-93,cameraX)

  if(player.y>270){
    player = createPlayer()
    cameraX=-293
  }
  if(!scrollsUp && player.x>maxX-40){
    nextScene()
  }
  if(scrollsUp && player.y <-1400){
    cameraY=-97
    nextScene()
  }

  if(level==2){
    gw.x+=150*secondsPassed
  }
  
}

function draw(timeStamp) {
  //console.log(blocks)
  // console.log(cutscene)
  if(cutscene){
    cutsceneBackground.draw(ctx,cs,timeStamp)
  }else {
    
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if(!autoScroll){
    if(scrollsUp){
      currentBackground.draw(ctx,timeStamp,cameraX,cameraY+1400);
    }else{
      currentBackground.draw(ctx,timeStamp,cameraX,cameraY);
    }
  }else{
      currentBackground.draw(ctx,timeStamp,cameraX/2+howLongLevelHasBeenGoing*40,cameraY);    
  }
  
  if(level==2){
    gw.draw(ctx,timeStamp)
  }
  
  for(object in blocks){
    blocks[object].draw(ctx,timeStamp)
  }
  for(object in food){
    food[object].draw(ctx,timeStamp)
  }
  for(object in projectiles){
    projectiles[object].draw(ctx,timeStamp)
  }

  //console.log(projectiles)

  if(horse){
    //console.log(villan)
    villan.draw(ctx, timeStamp)
  }

  player.draw(ctx, timeStamp)

  if(level==8){
    debutanteBallBalcony.draw(ctx, timeStamp)
  }

  ctx.drawImage(arcadet,0,0)
  
  ctx.font = "22px";
  ctx.drawImage(timerBox,546,100,25,15)
  ctx.fillText(Math.round(Math.max(300-timePassed,0)), 550, 110); 

  }
}

function loop(timeStamp) {
  //console.log(cameraX)
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  if(level<1){
    timePassed=0
  }
  oldTimeStamp = timeStamp;
  if(!document.hidden){
    timePassed+=secondsPassed
    update(secondsPassed)
  }
  draw(timeStamp)
  lastRender = timeStamp
  if(level>0){
    if(timePassed>299){
    restartGame()
    }
    window.requestAnimationFrame(loop)
  }else if(level!=-5){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentBackground.draw(ctx,0,cameraX,cameraY)
}
}

//left up right down
function getCursorPosition(event) {
    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX-rect.left)/2+cameraX
    const y = (event.clientY-rect.top)/2
    //window.alert("x: " + x + " y: " + y +" ")
}

function startGame(event) {
    if(level==0 || level==-1){
      let factor = 0
      const rect = canvas.getBoundingClientRect()
      if(window.innerWidth<1000){
        factor=1
      }else if (window.innerWidth<1500){
        factor=2
      }else{
        factor=3
      }
      const x = (event.clientX-rect.left)/factor-200
      const y = (event.clientY-rect.top)/factor
      //console.log("x: " + x + " y: " + y +" ")

      //x>=92&&y>=223&&x<=277&&y<=289
      if(true){
        timePassed=0
        setTimeout(() => {timePassed=0;}, 200)
        setTimeout(() => {timePassed=0;}, 1000)
        level=-8
        nextScene()
      }
    }
}
function startMusic(event) {
  if(musicNotStarted){
     playVid(themeSong);
  }
  musicNotStarted=false
}


document.addEventListener("click", startGame);
document.addEventListener("click", startMusic);
  