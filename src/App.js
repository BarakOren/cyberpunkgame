import React, { useRef, useEffect } from "react";
import './App.css';
import * as PIXI from 'pixi.js';
import {jump, attackOne, damage} from "./functions"
import backgroundimg from "./assets/originals/cyberpunk-street3.png"
import standingpng from "./assets/originals/test.png"
import rightButton from "./assets/buttons/ARROWRIGHT.png"
import enterButton from "./assets/buttons/ENTER.png"
import textWindowPng from "./assets/text-window.png"


const Application = PIXI.Application;

let w = window.innerWidth
let h = window.innerHeight

export const app = new Application({
  width: w,
  height: h,
  backgroundColor: 0x5BBA6F,
});

// export let container = new PIXI.Container();
//     container.sortableChildren = true;
    // container.addChild( );

export const background = PIXI.Sprite.from(backgroundimg)
background.height = h
background.width = w * 6
background.position.set(0, 0)


const setup = (loader, resources) => {

  //_____characters____
  // main Character
  var frame = new PIXI.Rectangle(0, 0, 140.5 , 100)
  var texture = new PIXI.Texture(resources.png.texture, frame);
  var sprite = new PIXI.Sprite(texture)


  //Biker
  var bikerFrame = new PIXI.Rectangle(0, 315, 140.5 , 100)
  var bikerTexture = new PIXI.Texture(resources.png.texture, bikerFrame)
  var biker = new PIXI.Sprite(bikerTexture)

  //cyborg
  var cyborgFrame = new PIXI.Rectangle(0, 642, 144 , 100)
  var cyborgTexture = new PIXI.Texture(resources.png.texture, cyborgFrame)
  var cyborg = new PIXI.Sprite(cyborgTexture)


  var floor = app.stage.height - sprite.height - 50
  sprite.x = 10
  sprite.y = floor
  biker.x = window.innerWidth / 1.2
  biker.y = floor
  biker.scale.x = -1
  cyborg.x = window.innerWidth / 1.5
  cyborg.y = floor
  cyborg.scale.x = -1




  //buttons
  var rightArrow = PIXI.Sprite.from(rightButton)
  rightArrow.x = 100
  rightArrow.y = floor - 70
  rightArrow.scale.set(4)

  var enter = PIXI.Sprite.from(enterButton)
  enter.x = biker.x - 50
  enter.y = floor - 70
  enter.scale.set(2)
  enter.alpha = 0

  var textWindow = PIXI.Sprite.from(textWindowPng)
  textWindow.x = w / 2
  textWindow.y = h / 2
  textWindow.anchor.set(0.5)
  textWindow.scale.set(0.7, 1)
  textWindow.alpha = 0


  var arrowInterval = setInterval(() => {
      if(rightArrow.x === 200){rightArrow.x = 0}
      rightArrow.x += 50
      if(sprite.x > 10){
        rightArrow.alpha = 0
        clearInterval(arrowInterval)
      }
  }, 200)

  const Graphics = PIXI.Graphics;

  let barSize = {width: 200, height: 13}
  let spriteLifeBarPosition = {x: window.innerWidth / 2 - barSize.width - 100, y: 20}
  let cyborgLifeBarPosition = {x: window.innerWidth / 2 + 50, y: 20}

  const spriteBackgroundLifeBar = new Graphics();
  spriteBackgroundLifeBar.beginFill(0, 0.1)
  .lineStyle(2, 0x00000)
  .drawRoundedRect(spriteLifeBarPosition.x , spriteLifeBarPosition.y, barSize.width, barSize.height)
  .endFill()

  const spriteLifeBar = new Graphics();
  spriteLifeBar.beginFill(0xff0000)
  .drawRoundedRect(0, 0, barSize.width - 2, barSize.height - 2)
  .endFill()

  const cyborgBackgroundLifeBar = new Graphics();
  cyborgBackgroundLifeBar.beginFill(0, 0.1)
  .lineStyle(2, 0x00000)
  .drawRoundedRect(cyborgLifeBarPosition.x , cyborgLifeBarPosition.y, barSize.width, barSize.height)
  .endFill()

  const cyborgLifeBar = new PIXI.Graphics();
  cyborgLifeBar.beginFill(0xff0000)
  .drawRoundedRect(0, 0, barSize.width - 2, barSize.height - 2)
  .endFill()
  spriteLifeBar.position.set(spriteLifeBarPosition.x + 1, spriteLifeBarPosition.y + 1);
  cyborgLifeBar.position.set(cyborgLifeBarPosition.x + 1, cyborgLifeBarPosition.y + 1);


  app.stage.addChild(sprite, biker, cyborg, 
    rightArrow, enter, textWindow, 
    spriteBackgroundLifeBar, spriteLifeBar, cyborgBackgroundLifeBar, cyborgLifeBar
    )
  
  let standing = true
  let goingRight = false
  let goingLeft = false
  let isJumping = false
  let isAttack1 = false
  let isJumpAttack = false
  var frameSize = 140.5
  let isCyborgAttack = false
  
  var idle = setInterval(() => {
    // var frameSize = 140.5
    if(standing){
      frameSize = 140.5
      frame.y = 0
      if(frame.x >= frameSize * 4){ frame.x = 0}
    }
    if (goingRight){
      frameSize = 147.5
      frame.y = 101
      if(frame.x >= frameSize * 6){ frame.x = 0}
    }
    if (goingLeft){
      frameSize = 147.5
      frame.y = 101
      if(frame.x >= frameSize * 6){ frame.x = 0}
    } 
    if(isJumping){
      frameSize = 140.5
      frame.y = 200
      if(frame.x >= frameSize * 4){frame.x = 0}
    }
    if(isAttack1){
      frameSize = 140
      frame.y = 536
      if(frame.x >= frameSize * 4 ){
        isAttack1 = false
        if(sprite.x > cyborg.x - 200 && sprite.x < cyborg.x + 10){
          damage(cyborgLifeBar, "cyborg", 40, 30)
    }}}
    if(isJumpAttack){
      frameSize = 140.5
      frame.y = 417
      if(frame.x >= frameSize * 3 ){
        isJumpAttack = false
        if(sprite.x > cyborg.x - 200 && sprite.x < cyborg.x + 10){
          damage(cyborgLifeBar, "cyborg", 70, 60)
        }
      }
    } 
    sprite.texture.frame = frame
    frame.x += frameSize
  }, isJumping ? 350 : 200)

  var backgroundpos = 0
  var screen = 1
  
  var movement = setInterval(() => {
    if(goingRight){
        sprite.x += 10
    } else if (goingLeft){
        sprite.x -= 10
    } else if (sprite.x >= w) {
        if(screen === 6){alert("you have reached the end. go back!")}
        screen++
        sprite.x = 0
        backgroundpos = backgroundpos - w 
        background.x = backgroundpos
    } else if (sprite.x < 0){
        if(screen === 1){return}
        screen--
        sprite.x = w - 10
        backgroundpos = backgroundpos + w
        background.x = backgroundpos
    } 
    else {
      standing = true
    }
  }, 20)

  var cyborgStanding = false
  var cyborgFrameSize = 144
  var isCyborgDead = false
  var isCyborgRunning = true
  var cyborgIdle = setInterval(() => {
      if(cyborgLifeBar.width <= 0){
        isCyborgAttack = false
        cyborgStanding = false
        isCyborgDead = true
        cyborgFrameSize = 144
        cyborgFrame.y = 849
        if(cyborgFrame.x >= frameSize * 6){cyborgFrame.x = frameSize * 6; clearInterval(cyborgIdle)}
      }
      if(cyborgStanding){
        cyborgFrameSize = 144
        cyborgFrame.y = 642
        if(cyborgFrame.x >= frameSize * 4){ cyborgFrame.x = 0}
      }
      if(isCyborgRunning){
        var spritePos = sprite.x
        var borg = cyborg.x 
        cyborg.x -= 

        cyborgFrameSize = 144
        cyborgFrame.y = 954
        if(cyborgFrame.x >= frameSize * 4){ cyborgFrame.x = 0}
      }
      if(isCyborgAttack){
        cyborgFrameSize = 134
        cyborgFrame.y = 748
        if(cyborgFrame.x >= cyborgFrameSize * 4){
          isCyborgAttack = false;
          if(sprite.x > cyborg.x - 200 && sprite.x < cyborg.x + 10){
              damage(spriteLifeBar, "sprite", 20, 10)
          }
        }
      }
        cyborg.texture.frame = cyborgFrame
        cyborgFrame.x += cyborgFrameSize
 }, isCyborgDead ? 1000 : 200)



 
 var allowText = false




    let relations = setInterval(() => {
    if(screen === 1){ // if screen 1
      if(sprite.x > biker.x - 200 && sprite.x < biker.x + 10){
        if(allowText === true){return}
        allowText = true
        enter.alpha = 1
      } else {
        allowText = false
        enter.alpha = 0
      }
      if(screen === 1){ // if screen 2
        //dont forget to chage 1 to 2
        if(sprite.x > cyborg.x - 200 && sprite.x < cyborg.x + 10){
              if (!isCyborgAttack) {
                setTimeout(() => {
                  isCyborgAttack = true
                }, Math.random() * (1000 - 300) + 300)

              }
            } 
          }
  }
  }, 300)





  
  
  // var checkAttack = setInterval(() => {
  //   if(isCyborgAttack){
  //     var damage = Math.random() * (30 - 10) + 10

  //   }
  // }, 1000)

  var bikerInterval = setInterval(() => {
    if(screen === 1){
      biker.alpha = 1
    } else if (screen > 1){
      biker.alpha = 0
    }
  }, 100)


// KEYYYYYY DOWNNNNNNNNNNNNN
document.addEventListener('keydown', function(e){
    if(e.key === "ArrowRight"){
      goingRight = true
      sprite.scale.x = 1
    } else if(e.key === "ArrowLeft"){
      goingLeft = true
      sprite.scale.x = -1
    } else if(e.key === "ArrowUp"){
      if(!isJumpAttack){
      isJumping = true
      jump(sprite, floor)
      setTimeout(() => {
        isJumping = false
      }, 1000)
    }
    } else if (e.key === "z") {
      if(!isJumping || !isJumpAttack){
         isAttack1 = true
      } 
    }else if (e.key === "x"){
      if(!isJumping){  
        isJumpAttack = true
        attackOne(sprite, floor)}
    } else if (e.key === "Enter"){
      if(allowText){
      enter.alpha = 0
      textWindow.alpha = 1
      }
    } else if (e.key === "Escape"){
      enter.alpha = 1
      textWindow.alpha = 0
    }
})
// KEYYYYYYYYYY UPPPPPPPPPPP
document.addEventListener('keyup', function(e){
  if(e.key === "ArrowRight"){
    goingRight = false
  }
  else if(e.key === "ArrowLeft"){
    goingLeft = false
  }   
}

)}




const loader = PIXI.Loader.shared;
app.loader
.add('png', standingpng)
.add('pixelfont', 'assets/Minecraft.ttf')
.load(setup)


app.stage.addChild(background)
// document.body.appendChild(app.view);




// function lace(){
//   backgroundpos = backgroundpos - w
//   background.position.set(backgroundpos, 0)
// }

function App() {

  const ref = useRef(null);

  useEffect(() => {
    ref.current.appendChild(app.view);
    app.start();

    return () => {
      app.stop();
    };
  }, []);


  return (
    <div ref={ref} className="App">
    </div>
  );
}

export default App;
