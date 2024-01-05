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
        ctx.drawImage(this.animations[this.currentAnimation][0][this.currentFrame], this.x-cameraX, this.y-cameraY)
       }
    }
    ctx.beginPath();
    ctx.rect(this.x-cameraX, this.y-cameraY, this.width, this.height)
    ctx.stroke();
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
        this.xVelocity=200
    }
    if (direction == "left") {
      this.currentAnimation="Run"
      this.direction="left"
      this.xVelocity=-200
    }
    if (direction == "up") {
      this.currentAnimation="Run"
      this.yVelocity = -200
    }
    if (direction == "down") {
      this.currentAnimation="Run"
      this.yVelocity = 200
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
    this.backgrounds.push(new Background("./images/backgrounds/City/Cityscape-1",1,1,0.025))
    this.backgrounds.push(new Background("./images/backgrounds/City/Cityscape-2",1,1,0.05))
    this.backgrounds.push(new Background("./images/backgrounds/City/Cityscape-3",1,1,0.1))
    this.backgrounds.push(new Background("./images/backgrounds/City/Cityscape-4",1,1,0.2))
    this.backgrounds.push(new Background("./images/backgrounds/City/Cityscape-5",1,1,0.35))
    this.backgrounds.push(new Background("./images/backgrounds/City/Cityscape-6",1,1,0.5))
    this.backgrounds.push(new Background("./images/backgrounds/City/EmpireStateBuilding",1,1,1))
    
  }
  //its draw method should call the draw method of each indivdual background
  draw(ctx, timeStamp, cX, cY) {
    //console.log(this.backgrounds)
    for(let i=0; i<this.backgrounds.length; i++){
      this.backgrounds[i].draw(ctx,timeStamp, cX, cY)
    }
  }
}

class CityBackground2{
  //it should construct an array of backgrounds in its constructor
  constructor(){
    this.backgrounds = []
    this.backgrounds.push(new Background("./images/backgrounds/City/Cityscape-1",1,1,0.025))
    this.backgrounds.push(new Background("./images/backgrounds/City/Cityscape-2",1,1,0.05))
    this.backgrounds.push(new Background("./images/backgrounds/City/Cityscape-3",1,1,0.1))
    this.backgrounds.push(new Background("./images/backgrounds/City/Cityscape-4",1,1,0.2))
    this.backgrounds.push(new Background("./images/backgrounds/City/Cityscape-5",1,1,0.35))
    this.backgrounds.push(new Background("./images/backgrounds/City/Cityscape-6",1,1,0.5))
    this.backgrounds.push(new Background("./images/backgrounds/City/EmpireStateBuilding2",1,1,1))
    
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
    this.backgrounds.push(new Background("./images/backgrounds/Moon/moonlanding",1,1,1))
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
    this.backgrounds.push(new Background("./images/backgrounds/bunkerhill/bunkerhillstates",1,1,1))
   
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
    this.backgrounds.push(new Background("./images/backgrounds/Delaware/delawareriverstates",1,1,1))
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
    this.backgrounds.push(new Background("./images/backgrounds/DebutanteBall/ballroom",200,1,1))
    console.log(this.backgrounds[1])


  }
  //its draw method should call the draw method of each indivdual background
  draw(ctx, timeStamp, cX, cY) {
    for(let i=0; i<this.backgrounds.length; i++){
      this.backgrounds[i].draw(ctx,timeStamp, cX, cY)
    }
  }
}

class Projectile {
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

class Cutscene{
  //it should construct an array of backgrounds in its constructor
  constructor(){
    this.backgrounds = []
    this.backgrounds.push(new Background("./images/cutscenes/yeehaw",200,1,0))
    this.backgrounds.push(new Background("./images/cutscenes/choochoo",200,1,0))
    this.backgrounds.push(new Background("./images/cutscenes/highway",200,1,0))
    this.backgrounds.push(new Background("./images/cutscenes/NEWYORKKK",200,1,0))
     this.backgrounds.push(new Background("./images/cutscenes/dance",200,1,0))
    this.backgrounds.push(new Background("./images/cutscenes/astro",200,1,0))
  }
  //its draw method should call the draw method of each indivdual background
  draw(ctx, i) {
  console.log( this.backgrounds,i,this.backgrounds[i].imgs[1])
 ctx.drawImage(this.backgrounds[i].imgs[1],93,97,480,270)
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
let empireState = new CityBackground2()
let cutsceneBackground = new Cutscene();
let cs = 0

let arcade = new Image()
arcade.src = "./images/bg.png"

let arcadet = new Image()
arcadet.src = "./images/bgt.png"

let rand = null
let revWar =  new Background("./images/backgrounds/Revolutionary War/RevolutionaryWar-",200,10,.5);
let wildWest = new Background("./images/backgrounds/Wild West/Wild_West_Compiled-",200,10,1)
let roaring20s = new Background("./images/backgrounds/Roaring 20s/Roaring_20s-",200,10,1)
let food = []
let player = null
let villan = null
let maxX=null
let maxY=null
let level=-1
let musicNotStarted=true
let timePassed =0
let title_screen=new Background("./images/backgrounds/Title Screen/title screen",200,1,1)
let dead = new Background("./images/backgrounds/dead/dead",200,1,1)

let countdown = new Background("./images/backgrounds/countdown/countdown",999,4,1)
let instructions = new Background("./images/backgrounds/instructions/instructions-0",999,3,1)


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
// bunkerBackground
// delawareBackground
// highwayBackground
// debutanteBallBackground

function createPlayer(){
  return new GameObject("player", -190, 170, 15, 26, "./images/Turkey", [["Idle", 2, 250], ["Jump", 2, 100], ["Run", 6, 100], ["Boat", 2, 200], ["HorseRun", 8, 85], ["HorseIdle", 2, 250], ["HorseStun", 4, 250], ["HorseJump", 5, 150], ["MoonIdle", 2, 250], ["MoonJump", 2, 100], ["MoonRun", 6, 100]], "Idle", true)
}

function setUplevel1(){
  projectiles=[]
  scrollsUp=false
  gravity=1
  autoScroll=false
  foreground = []
  horse=false
  food=[]
  timePassed=0
  maxX=2650
  minX=-200
  player = createPlayer()
  currentBackground = bunkerBackground
  blocks = []
  projectiles=[]
}

function setUplevel2(){
  projectiles=[]
  gw = new GameObject("gw", -200, 200, 25, 25, "./images/", [["gw-", 3, 250]], "gw-", false)
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
  blocks = []
}

function setUpHorseLevel(){
  projectiles=[]
  scrollsUp=false
  gravity = 1
  autoScroll=false
  horse=true
  food=[]
  maxX=6100
  minX=-200
  player = createPlayer()
}

function setUplevel3(){
  projectiles=[]
  setUpHorseLevel()
}

function setUpTrainLevel(){
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
  blocks = []
  
}

function setUplevel4(){
  projectiles=[]
  setUpTrainLevel()
}

function setUpMoonLevel(){
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
  blocks = []
}

function setUpCityLevel(){
  projectiles = []
  scrollsUp=false
  gravity=1
  autoScroll=false
  foreground = []
  horse=false
  food=[]
  maxX=3200
  minX=-200
  player = createPlayer()
  currentBackground = cityBackground
  blocks = []

}

function setUpEmpireLevel(){
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
  blocks = []
  
}

function setUplevel5(){
  scrollsUp=false
  gravity=0
  autoScroll=false
  foreground = []
  horse=false
  food=[]
  maxX=3200
  minX=-200
  player = createPlayer()
  currentBackground = highwayBackground
  blocks = []
  projectiles = []
  for(let i =0; i<64; i++){
      projectiles.push(new Projectile(25+Math.floor(47.84*i), -Math.random()*400, 35, 57, 50+Math.floor(Math.random()*100), "./images/projectiles/Car-" + (Math.floor(Math.random()*4)+1).toString() + ".png"))
  }
 
}

function setUplevel6(){
  setUpCityLevel()
}

function setUplevel7(){
  setUpEmpireLevel()
}

function setUplevel8(){
  scrollsUp=false
  gravity=1
  autoScroll=false
  foreground = []
  horse=false
  food=[]
  maxX=3200
  minX=-200
  player = createPlayer()
  currentBackground = debutanteBallBackground
  console.log(currentBackground)
  blocks = []
  
}


function setUplevel9(){
  setUpMoonLevel()
}


function nextScene(){
  //console.log(level, "----------")
  if(level==-5){
    currentBackground = win
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(arcade,0,0); 

     setTimeout(() => {ctx.clearRect(0, 0, canvas.width, canvas.height);  ctx.drawImage(arcadet,0,0); ctx.drawImage(currentBackground.imgs[1],93,97,480,270)}, 50)

    setTimeout(() => {ctx.clearRect(0, 0, canvas.width, canvas.height);  ctx.drawImage(arcadet,0,0); ctx.drawImage(currentBackground.imgs[1],93,97,480,270)}, 1000)
    

    setTimeout(() => {ctx.clearRect(0, 0, canvas.width, canvas.height);ctx.drawImage(arcadet,0,0);ctx.drawImage(currentBackground.imgs[2],93, 97,480,270)}, 2000)


    setTimeout(() => {level=-1;nextScene();}, 4000)

  }
  if(level==-2){
    snd2.pause()
    snd2.currentTime = 0;

    snd3.pause()
    snd3.currentTime = 0;
    snd4.pause()
    snd4.currentTime = 0;

    snd5.pause()
    snd5.currentTime = 0;

    snd6.pause()
    snd6.currentTime = 0;
  
    snd1.play();
    currentBackground = dead
    //console.log(currentBackground)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(currentBackground.imgs[1],93,97,480,270)
    window.setTimeout(nextScene,5000)
  }
  
  if(level==-1){
    snd2.pause()
    snd2.currentTime = 0;

    snd3.pause()
    snd3.currentTime = 0;

    snd5.pause()
    snd5.currentTime = 0;

    snd6.pause()
    snd6.currentTime = 0;

    snd1.play();
    //console.log("bonjoure")
    currentBackground = title_screen
    //console.log(currentBackground)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(title_screen.imgs[1],0,0)
  }
  if(level==-8){


    currentBackground = instructions
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(arcadet,0,0)
    ctx.drawImage(currentBackground.imgs[1], 93, 97,480,270)
  
    
    setTimeout(() => {level=0;
    nextScene()}, 1000)
    //console.log("hello there")
  }
  if(level==0){
    snd2.pause()
    snd2.currentTime = 0;

    snd3.pause()
    snd3.currentTime = 0;
    snd4.pause()
    snd4.currentTime = 0;

    snd5.pause()
    snd5.currentTime = 0;

    snd6.pause()
    snd6.currentTime = 0;

    snd1.play()

    document.addEventListener('keydown', function (event) {
      // for(let i=0; i<1000; i++){
      //   console.log("REMEMBER TO TAKE THIS OUT OF THE FINAL GAME FOR THE LOVE OF GOD")
      // // }
      if (event.key == "l") {
        console.log(level)
        nextScene()
      }

      if (event.key == "p") {
        blocks.pop()
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
    setUplevel2()
    
  }
  if(level==2){
    cs=0
    cutscene = true
    setTimeout(() => { cutscene = false;}, 2000)
    snd1.pause()
    snd1.currentTime=0;

    snd2.pause()
    snd2.currentTime = 0;

    snd3.pause()
    snd3.currentTime = 0;
    
    snd4.pause()
    snd4.currentTime = 0;

    snd5.pause()
    snd5.currentTime = 0;

    snd6.pause()
    snd6.currentTime = 0;
  

    snd2.play()
    setUplevel3()
  }
  if(level==3){
     cs=1
    cutscene = true
    setTimeout(() => { cutscene = false;}, 2000)
    setUplevel4()
  }
  if(level==4){
    cs=2
     snd1.pause()
    snd1.currentTime=0;

    snd2.pause()
    snd2.currentTime = 0;

    snd3.pause()
    snd3.currentTime = 0;

    snd4.pause()
    snd4.currentTime = 0;

    snd5.pause()
    snd5.currentTime = 0;

    snd6.pause()
    snd6.currentTime = 0;
    
    snd5.play()
    cutscene = true
    setTimeout(() => { cutscene = false;}, 2000)
    setUplevel5()
  }
  if(level==5){
    setUplevel6()
    cs=3
    cutscene = true
    setTimeout(() => { cutscene = false;}, 2000)
  }
  if(level==6){
    setUplevel7()
  }
  if(level==7){
    snd1.pause()
    snd1.currentTime=0;

    snd2.pause()
    snd2.currentTime = 0;

    snd3.pause()
    snd3.currentTime = 0;

    snd4.pause()
    snd4.currentTime = 0;

    snd5.pause()
    snd5.currentTime = 0;

    snd6.pause()
    snd6.currentTime = 0;
    
    snd3.play()
    cs=4
    cutscene = true
    setTimeout(() => { cutscene = false;}, 2000)
    setUplevel8()
  }
  if(level==8){
    snd1.pause()
    snd1.currentTime=0;

    snd2.pause()
    snd2.currentTime = 0;

    snd3.pause()
    snd3.currentTime = 0;

    snd4.pause()
    snd4.currentTime = 0;

    snd5.pause()
    snd5.currentTime = 0;

    snd6.pause()
    snd6.currentTime = 0;
    
    snd6.play()
     cs=5
     cutscene = true
     setTimeout(() => { cutscene = false;}, 2000)
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
  
  player.x += player.xVelocity * secondsPassed

  player.touchingIce=false
  player.y += player.yVelocity * secondsPassed

  player.x=Math.max(minX+15,player.x)
  player.x=Math.min(maxX,player.x)

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
  // console.log(cutscene)
  if(cutscene){
    cutsceneBackground.draw(ctx,cs)
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

  player.draw(ctx, timeStamp)

  if(level==8){
    debutanteBallBalcony.draw(ctx, timeStamp)
  }

  ctx.drawImage(arcadet,0,0)
  
  ctx.font = "22px";
  ctx.fillText("Time Left: " +  Math.round(Math.max(100-timePassed,0)), 510, 110); 

  }
}

function loop(timeStamp) {
  //console.log(cameraX)
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  timePassed+=secondsPassed/300
  if(level<1){
    timePassed=0
  }
  oldTimeStamp = timeStamp;
  if(!document.hidden){
    update(secondsPassed)
  }
  draw(timeStamp)
  lastRender = timeStamp
  if(level>0){
    window.requestAnimationFrame(loop)
  }else if(level!=-5){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentBackground.draw(ctx,0,cameraX,cameraY)
}
  if(timePassed>99){
    restartGame()
  }
}

//left up right down
function getCursorPosition(event) {
    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX-rect.left)/2.15+cameraX
    const y = (event.clientY-rect.top)/1.7+cameraY
    window.alert(x + "," + y)
   blocks.push(new GameObject("block", x, y, 25, 25, "./images/blocks", [["wood floor", 1, 250]], "wood floor", false))
    //console.log("x: " + x + " y: " + y +" ")
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
    snd1.play();
  }
  musicNotStarted=false
}


  document.addEventListener("click", startGame);
  document.addEventListener("click", startMusic);
  
  var snd1  = new Audio();
  var src1  = document.createElement("source");
  src1.type = "audio/mpeg";
  src1.src  = "./audio/level1music.mp3";
  snd1.appendChild(src1);
  snd1.volume = 0.15;
  snd1.addEventListener("ended", function(){
        snd1.currentTime = 0;
        snd1.play()
      });
  
  
  var snd2  = new Audio();
  var src2  = document.createElement("source");
  src2.type = "audio/mpeg";
  src2.src  = "./audio/level2music.mp3";
  snd2.appendChild(src2);
  snd2.volume = 0.5;
  snd2.addEventListener("ended", function(){
        snd2.currentTime = 0;
        snd2.play()
      });
  
  var snd3  = new Audio();
  var src3  = document.createElement("source");
  src3.type = "audio/mpeg";
  src3.src  = "./audio/level3music.mp3";
  snd3.appendChild(src3);
  snd3.addEventListener("ended", function(){
        snd3.currentTime = 0;
        snd3.play()
      });
  
  
  var snd4  = new Audio();
  var src4  = document.createElement("source");
  src4.type = "audio/mpeg";
  src4.src  = "./audio/level3music-intro.mp3";
  snd4.appendChild(src4);
  snd4.addEventListener("ended", function(){
        snd3.play()
    });


  var snd5  = new Audio();
  var src5  = document.createElement("source");
  src5.type = "audio/mpeg";
  src5.src  = "./audio/more_swingy_with_break.mp3";
  snd5.appendChild(src5);
  snd5.volume = 0.2;
  snd5.addEventListener("ended", function(){
        snd5.currentTime = 0;
        snd5.play()
      });


  var snd6  = new Audio();
  var src6  = document.createElement("source");
  src6.type = "audio/mpeg";
  src6.src  = "./audio/The_Moon_Finished_Draft.mp3";
  snd6.appendChild(src6);
  snd6.volume = 0.2;
  snd6.addEventListener("ended", function(){
        snd6.currentTime = 0;
        snd6.play()
      });