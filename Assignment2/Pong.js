/*
	Assignment 2 Pong Game uses the tutorial of https://codepen.io/gdube/pen/JybxxZ and https://www.youtube.com/watch?v=gm1QtePAYTM&ab_channel=TraversyMedia to use as templates and start for my project. 
	Credit from the tutorial designs will be acknowledged as a form of a template when reviewing this assignment.
*/

// Global Variables for the movements of all objects
var DIRECTION = {
	IDLE: 0,
	UP: 1,
	DOWN: 2,
	LEFT: 3,
	RIGHT: 4
};
var rounds = [20];//Total rounds required in this assignment set to 20
var colors//variable to set the color

// The ball object (The cube that bounces back and forth)
var Ball = {
	new: function (incrementedSpeed) {
		return {
			width: 30,
			height: 30,
			x: (this.canvas.width / 2) - 9,//Starts the ball in the center of the canvas on the x axis
			y: (this.canvas.height / 2) - 9,//Starts the ball in the center of the canvas on the y axis
			moveX: DIRECTION.IDLE,
			moveY: DIRECTION.IDLE,
			speed: incrementedSpeed || 4
		};
	}
};
// The Player and AI are the rectangles on the board of the canvas
var Paddle = {
	new: function (side) {
		return {
			width: 20,
			height: 140,
			x: side === 'left' ? 70 : this.canvas.width - 70,//Moves the paddles away from the edge of the canvas on the x axis
			y: (this.canvas.height / 2) - 35,//Starts both paddles in the middle of the y axis on the canvas
			score: 0,
			move: DIRECTION.IDLE,
			speed: 8
		};
	}
};
//Setting the variables of the Canvas and objects placed inside the canvas
var Game = {
	//Initializing the function of the canvas
	initialize: function () {
		this.canvas = document.querySelector('canvas');//Selects the canvas element in the html file
		this.context = this.canvas.getContext('2d');

		this.canvas.width = 3000;//Measurements of the canvas on the website
		this.canvas.height = 1000;//Measurements of the canvas on the website

		this.canvas.style.width = (this.canvas.width / 2) + 'px';
		this.canvas.style.height = (this.canvas.height / 2) + 'px';

		this.player = Paddle.new.call(this, 'left');
		this.paddle = Paddle.new.call(this, 'right');
		this.ball = Ball.new.call(this);

		this.paddle.speed = 4;
		this.running = this.over = false;
		this.turn = this.paddle;
		this.timer = this.round = 0;
		this.color = '#ac7339';

		Pong.menu();
		Pong.listen();
	},
	//End Game Menu Function will display the text of the whether there is the winner between the AI and the Player and there are text parameters to set the text color, size, and placement on the canvas
	endGameMenu: function (text) {
		// Change the canvas font size and color where the winner is displayed
		Pong.context.font = '50px Arial';
		Pong.context.fillStyle = this.color;
		// Draw the rectangle behind the to blend in with the Canvas
		Pong.context.fillRect(
			Pong.canvas.width / 2 - 350,
			Pong.canvas.height / 2 - 48,
			700,
			100
		);
		// Change the canvas color;
		Pong.context.fillStyle = '#ffffff';
		// Draw the end game menu text ('Ai is the Winner' and 'Player is the Winner')
		Pong.context.fillText(text, Pong.canvas.width / 2, Pong.canvas.height / 2 + 15);
		setTimeout(function () {
			Pong = Object.assign({}, Game);
			Pong.initialize();
		}, 3000);
	},
	//Player Score Function to Display when they get a point
	playerscore: function () {
		// Draw all the Pong objects in their current state
		Pong.draw();

		// Change the rectangle's font size and color to blend in with the canvas
		this.context.font = '120px Arial';
		this.context.fillStyle = this.color;

		// Draw the rectangle behind the 'Player has Scored' text.
		this.context.fillRect(
			this.canvas.width / 2 - 350,
			this.canvas.height / 2 - 48,
			700,
			100
		);

		// Change the canvas color;
		this.context.fillStyle = '#ffffff';

		// Displays the 'Player has Scored' text on the Screen
		this.context.fillText('Player has scored',
			this.canvas.width / 2,
			this.canvas.height / 2 + 15
		);
	},
	//AI Score Function to Display when they get a point
	aiscore: function () {
		// Draw all the Pong objects in their current state
		Pong.draw();

		// Change the canvas font size and color
		this.context.font = '120px Arial';
		this.context.fillStyle = this.color;

		// Draw the rectangle behind the 'Press any key to begin' text.
		this.context.fillRect(
			this.canvas.width / 2 - 350,
			this.canvas.height / 2 - 48,
			700,
			100
		);

		// Change the canvas color;
		this.context.fillStyle = '#ffffff';

		// Displays the 'Press Any Button to Play Game' on the Screen
		this.context.fillText('Ai has scored',
			this.canvas.width / 2,
			this.canvas.height / 2 + 15
		);
	},
	//Menu function has the Starting screen of the Canvas game with having the 'Press Any Button to Play Game' box mesh in with the canvas color
	menu: function () {

		// Draw all the Pong objects in their current state to set them into position at the starting screen
		Pong.draw();

		// Change the canvas font size and color
		this.context.font = '120px Arial';
		this.context.fillStyle = this.color;

		// Draw the rectangle behind the 'Press Any Button to Play Game' text.
		this.context.fillRect(
			this.canvas.width / 2 - 350,
			this.canvas.height / 2 - 48,
			700,
			100
		);

		// Change the canvas color;
		this.context.fillStyle = '#ffffff';

		// Displays the 'Press Any Button to Play Game' on the Screen
		this.context.fillText('Press Any Button to Play Game',
			this.canvas.width / 2,
			this.canvas.height / 2 + 15
		);
	},

	// Update all objects when event occurs due to collision, movement and other updates.
	update: function () {
		if (!this.over) {

			// If the ball collides with the bound limits - correct the x and y coords.
			if (this.ball.x <= 0) Pong._resetTurn.call(this, this.paddle, this.player);
			if (this.ball.x >= this.canvas.width - this.ball.width) Pong._resetTurn.call(this, this.player, this.paddle);
			if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
			if (this.ball.y >= this.canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;

			// Move player if they player.move value was updated by a keyboard event
			if (this.player.move === DIRECTION.UP) this.player.y -= this.player.speed;
			else if (this.player.move === DIRECTION.DOWN) this.player.y += this.player.speed;

			// On start of each turn, move the ball to the side of the player or ai that lost the point and randomize direction of the ball when released
			if (Pong._turnDelayIsOver.call(this) && this.turn) {
				this.ball.moveX = this.turn === this.player ? DIRECTION.LEFT : DIRECTION.RIGHT;
				this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
				this.ball.y = Math.floor(Math.random() * this.canvas.height - 200) + 200;
				this.turn = null;
			}

			// Updating the x and y coordinates when player has touched the boundaries using the paddle
			if (this.player.y <= 0) this.player.y = 0;
			else if (this.player.y >= (this.canvas.height - this.player.height)) this.player.y = (this.canvas.height - this.player.height);

			// Move ball in intended direction based on moveY and moveX values
			if (this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
			else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);
			if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
			else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;

			// AI UP and DOWN movement
			if (this.paddle.y > this.ball.y - (this.paddle.height / 2)) {
				if (this.ball.moveX === DIRECTION.RIGHT) this.paddle.y -= this.paddle.speed / 1.5;
				else this.paddle.y -= this.paddle.speed / 4;//Speed After Hit
			}
			if (this.paddle.y < this.ball.y - (this.paddle.height / 2)) {
				if (this.ball.moveX === DIRECTION.RIGHT) this.paddle.y += this.paddle.speed / 1.5;
				else this.paddle.y += this.paddle.speed / 4;//Speed After Hit
			}

			// AI Paddle Collisions with Ball
			if (this.paddle.y >= this.canvas.height - this.paddle.height) this.paddle.y = this.canvas.height - this.paddle.height;
			else if (this.paddle.y <= 0) this.paddle.y = 0;

			// Player Side Ball collisions
			if (this.ball.x - this.ball.width <= this.player.x && this.ball.x >= this.player.x - this.player.width) {
				if (this.ball.y <= this.player.y + this.player.height && this.ball.y + this.ball.height >= this.player.y) {
					this.ball.x = (this.player.x + this.ball.width);
					this.ball.moveX = DIRECTION.RIGHT;


				}
			}

			// Paddle Side Ball collision
			if (this.ball.x - this.ball.width <= this.paddle.x && this.ball.x >= this.paddle.x - this.paddle.width) {
				if (this.ball.y <= this.paddle.y + this.paddle.height && this.ball.y + this.ball.height >= this.paddle.y) {
					this.ball.x = (this.paddle.x - this.ball.width);
					this.ball.moveX = DIRECTION.LEFT;


				}
			}
		}

		// Handle the end of round transition
		// Display that the Player is the winner when Player has reahced the final points
		if (this.player.score === rounds[this.round]) {
			Pong.playerscore();

			// Check to see if a player has reached 20 points to display a victory screen.
			if (!rounds[this.round + 1]) {
				this.over = true;
				setTimeout(function () { Pong.endGameMenu('The Player is the Winner'); }, 1000);
			} else {

				// If there is another round, reset all the values and increment the round number.
				this.color = this._generateRoundColor();
				this.player.score = this.paddle.score = 0;
				this.player.speed += 0.5;
				this.paddle.speed += 1;
				this.ball.speed += 1;
				this.round += 1;
			}
		}

		// Display that the AI is the winner when AI has reached the final 20 points
		else if (this.paddle.score === rounds[this.round]) {
			Pong.aiscore();
			this.over = true;
			setTimeout(function () { Pong.endGameMenu('The AI is the Winner, you have Lost'); }, 1000);
		}
	},

	// Draw the objects to the canvas element such as paddles, score, and displays of text.
	draw: function () {

		// Clear the Canvas
		this.context.clearRect(
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);
		// Set the fill style to tan
		this.context.fillStyle = this.color;

		// Draw the background using the variables of the canvas width and height
		this.context.fillRect(
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);

		// Set the fill style to dark blue for the paddles and ball
		this.context.fillStyle = '#006680';

		// Draw the Player's paddle
		this.context.fillRect(
			this.player.x,
			this.player.y,
			this.player.width,
			this.player.height
		);

		// Draw the AI's paddle
		this.context.fillRect(
			this.paddle.x,
			this.paddle.y,
			this.paddle.width,
			this.paddle.height
		);

		// Draw the Cube Ball
		if (Pong._turnDelayIsOver.call(this)) {
			this.context.fillRect(
				this.ball.x,
				this.ball.y,
				this.ball.width,
				this.ball.height
			);
		}

		// Set the default canvas font and align it to the center
		this.context.font = '120px Arial';
		this.context.textAlign = 'center';

		// Draw the Player's score counter (left side)
		this.context.fillText(
			this.player.score.toString(),
			(this.canvas.width / 2) - 1430,
			100
		);

		// Draw the AI's score counter (right side)
		this.context.fillText(
			this.paddle.score.toString(),
			(this.canvas.width / 2) + 1430,
			960
		);
	},

	//Loop function is needed to continue the game when the ball goes out of bounds and stops the animations.
	loop: function () {
		Pong.update();
		Pong.draw();

		// If the game is not over, draw the next frame.
		if (!Pong.over) requestAnimationFrame(Pong.loop);
	},

	//Listen function allows the user to interact the canvas with their keyboard live.
	listen: function () {
		document.addEventListener('keydown', function (key) {

			// Handle the 'Press any key to begin' to begin the Game.
			if (Pong.running === false) {
				Pong.running = true;
				window.requestAnimationFrame(Pong.loop);
			}

			// Handle up arrow with Keycode 38 registered to the direction UP
			if (key.keyCode === 38) Pong.player.move = DIRECTION.UP;

			// Handle down arrow with Keycode 40 registered to the direction DOWN
			if (key.keyCode === 40) Pong.player.move = DIRECTION.DOWN;
		});

		// Stop the player from moving when the arrow keys are not being pressed.
		document.addEventListener('keyup', function (key) { Pong.player.move = DIRECTION.IDLE; });
	},

	// Reset the ball location, the player turns and set a delay before the next round begins to allows the player to get ready for the next round.
	_resetTurn: function (victor, loser) {
		this.ball = Ball.new.call(this, this.ball.speed);
		this.turn = loser;
		this.timer = (new Date()).getTime();

		victor.score++;
	},

	// Wait for a delay to have passed after each turn.
	_turnDelayIsOver: function () {
		return ((new Date()).getTime() - this.timer >= 1000);
	},
};
//Initialize the objects inside the Pong class
var Pong = Object.assign({}, Game);
Pong.initialize();