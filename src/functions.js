import * as PIXI from 'pixi.js';
import {container} from "./App"

let gravity = 1
let speed = 5
let isJumping = false
let isGoingRight = false
let isGoingLeft = false

export const jump = (sprite, floor) => {
    if(isJumping) return
    isJumping = true
    let upTimer = setInterval(() => {
        if(sprite.y <= 400){
            clearInterval(upTimer)
            let downTimer = setInterval(() =>{
                speed = speed + gravity 
                sprite.y += speed
                if(sprite.y >= floor - 10){
                    speed = 5
                    sprite.y = floor
                    clearInterval(downTimer)
                    isJumping = false
                }}, 20)
        }
        sprite.y -= speed
    }, 20)
}

let attackGravity = 1
let attackSpeed = 5
let isAttacking = false
export const attackOne = (sprite, floor) => {
    if(isJumping) return
    if(isAttacking) return
    isAttacking = true
    let upTimer = setInterval(() => {
        if(sprite.y <= 500){
            clearInterval(upTimer)
            let downTimer = setInterval(() =>{
                attackSpeed = attackSpeed + attackGravity 
                sprite.y += attackSpeed
                if(sprite.y >= floor - 10){
                    attackSpeed = 4
                    sprite.y = floor
                    clearInterval(downTimer)
                    isAttacking = false
                }}, 20)
        }
        sprite.y -= attackSpeed
    }, 20)
}

export const damage = (lifeBar, spriteName, Max, Min) => {
    if(lifeBar <= 0) return
    if(spriteName === "sprite"){
        let spriteLifeBarPosition = {x: window.innerWidth / 2 - 200 - 100, y: 20}
        var damageSize = Math.random() * (Max - Min) + Min 
        lifeBar.width -= damageSize
        lifeBar.position.set(spriteLifeBarPosition.x + 1 , spriteLifeBarPosition.y + 1);
        if(lifeBar.width <= 0){lifeBar.alpha = 0;}
    } else {
        let cyborgLifeBarPosition = {x: window.innerWidth / 2 + 50, y: 20}
        var damageSize = Math.random() * (Max - Min) + Min
        lifeBar.width -= damageSize
        lifeBar.position.set(cyborgLifeBarPosition.x + 1, cyborgLifeBarPosition.y + 1);
        if(lifeBar.width <= 0){lifeBar.alpha = 0;}
    }
}



