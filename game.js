/* global Phaser */

import { createAnimations } from "./animations.js"

const config = {
    type: Phaser.AUTO,
    width: 256,
    height: 244,
    backgroundColor: '#049cd8',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload, // Se usa para precargar los recursos del juego
        create, // Se ejecuta cuando comienza el juego
        update // Se ejecuta en cada frame
    }
}

new Phaser.Game(config)
// this -> game -> el juego que estamos haciendo

function preload () {
    this.load.image(
        'cloud1',
        'assets/scenery/overworld/cloud1.png'
    )

    this.load.image(
        'floorbricks',
        'assets/scenery/overworld/floorbricks.png'
    )

    this.load.spritesheet(
        'mario',
        'assets/entities/mario.png',
        { frameWidth: 18, frameHeight: 16 } // espacio que hay entre los marios
    )

    this.load.audio('gameover', 'assets/sound/music/gameover.mp3')
}

function create () {
    // image(x, y, id del asset)
    this.add.image(100, 50, 'cloud1').setOrigin(0, 0).setScale(0.15)

    this.floor = this.physics.add.staticGroup()

    this.floor
        .create(0, config.height - 16, 'floorbricks')
        .setOrigin(0, 0.5)
        .refreshBody()

    // this.add.tileSprite(0, config.height - 32, 70, 32, 'floorbricks').setOrigin(0, 0)

    this.floor
        .create(150, config.height - 16, 'floorbricks')
        .setOrigin(0, 0.5)
        .refreshBody()

    // this.add.tileSprite(100, config.height - 32, 70, 32, 'floorbricks').setOrigin(0, 0)

    // this.mario = this.add.sprite(50, 210, 'mario').setOrigin(0, 1)

    this.mario = this.physics.add
        .sprite(50, 100, 'mario')
        .setOrigin(0, 1)
        .setCollideWorldBounds(true) // El personaje no sale de la pantalla
        .setGravityY(300)
    // setGravityY(2000) -> tambien puedes cambiar la gravedad con esto

    this.physics.world.setBounds(0, 0, 2000, config.height)
    this.physics.add.collider(this.mario, this.floor)

    this.cameras.main.setBounds(0, 0, 2000, config.height)
    this.cameras.main.startFollow(this.mario)

    createAnimations(this)

    this.keys = this.input.keyboard.createCursorKeys()
}

function update () {
    if (this.mario.isDead) return

    if (this.keys.left.isDown) {
        this.mario.anims.play('mario-walk', true)
        this.mario.x -= 2
        this.mario.flipX = true
    } else if (this.keys.right.isDown) {
        this.mario.anims.play('mario-walk', true)
        this.mario.x += 2
        this.mario.flipX = false
    } else {
        this.mario.anims.play('mario-idle', true)
    }

    if (this.keys.up.isDown && this.mario.body.touching.down) {
        this.mario.setVelocityY(-300)
        this.mario.anims.play('mario-jump', true)  
    }

    if (this.mario.y >= config.height) {
        this.mario.isDead = true
        this.mario.anims.play('mario-dead')
        this.mario.setCollideWorldBounds(false)
        // this.sound.play('gameover')
        this.sound.add('gameover', { volume: 0.2 }).play()

        setTimeout(() => {
            this.mario.setVelocityY(-350)
        }, 100)

        setTimeout(() => {
            this.scene.restart()
        }, 2000)
    }
}