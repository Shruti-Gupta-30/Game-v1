function createImage(imageSrc) {
	const image = new Image();
	image.src = `./img/${imageSrc}.png`;
	return image;
}
const PlatformImage = createImage('platform');
const PlatformSmallTall = createImage('platformSmallTall');

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

const gravity = 0.2;

class Player {
	constructor() {
		this.speed = 10;
		this.position = {
			x: 100,
			y: 100,
		};
		this.velocity = {
			x: 0,
			y: 0,
		};
		this.width = 30;
		this.height = 30;
	}
	draw() {
		c.fillStyle = 'red';
		c.fillRect(
			this.position.x,
			this.position.y,
			this.width,
			this.height
		);
	}
	update() {
		this.draw();
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
		if (
			this.position.y + this.height + this.velocity.y <=
			canvas.height
		)
			this.velocity.y += gravity;
	}
}

class Platform {
	constructor({ x, y, image }) {
		this.position = {
			x,
			y,
		};
		this.image = image;
		this.width = image.width;
		this.height = image.height;
	}
	draw() {
		c.drawImage(
			this.image,
			this.position.x,
			this.position.y
		);
	}
}
class genericObject {
	constructor({ x, y, image }) {
		this.position = {
			x,
			y,
		};
		this.image = image;
		this.width = image.width;
		this.height = image.height;
	}
	draw() {
		c.drawImage(
			this.image,
			this.position.x,
			this.position.y
		);
	}
}

let player = new Player();
let platforms = [];

let genericObjects = [];

const keys = {
	right: {
		pressed: false,
	},
	left: {
		pressed: false,
	},
};

let scrollOffset = 0;

function init() {
	player = new Player();
	platforms = [
		new Platform({
			x: -1,
			y: 470,
			image: PlatformImage,
		}),
		new Platform({
			x: PlatformImage.width - 3,
			y: 470,
			image: PlatformImage,
		}),
		new Platform({
			x: PlatformImage.width * 2 + 100,
			y: 470,
			image: PlatformImage,
		}),
		new Platform({
			x: PlatformImage.width * 3 + 300,
			y: 470,
			image: PlatformImage,
		}),
		new Platform({
			x: PlatformImage.width * 4 + 297,
			y: 470,
			image: PlatformImage,
		}),
		new Platform({
			x: PlatformImage.width * 5 + 450,
			y: 250,
			image: PlatformSmallTall,
		}),
		new Platform({
			x: PlatformImage.width * 6 + 300,
			y: 150,
			image: PlatformSmallTall,
		}),
		new Platform({
			x: PlatformImage.width * 8 - 40,
			y: 300,
			image: PlatformSmallTall,
		}),
		new Platform({
			x: PlatformImage.width * 7 + 250,
			y: 470,
			image: PlatformImage,
		}),
		new Platform({
			x: PlatformImage.width * 8 + 500,
			y: 50,
			image: PlatformSmallTall,
		}),
		new Platform({
			x: PlatformImage.width * 9 + 500,
			y: 470,
			image: PlatformImage,
		}),
	];

	genericObjects = [
		new genericObject({
			x: -1,
			y: -1,
			image: createImage('background'),
		}),
		new genericObject({
			x: -1,
			y: -1,
			image: createImage('hills'),
		}),
	];

	scrollOffset = 0;
}

init();
function animate() {
	requestAnimationFrame(animate);
	c.fillStyle = 'white';
	c.fillRect(0, 0, canvas.width, canvas.height);

	genericObjects.forEach((genericObject) => {
		genericObject.draw();
	});

	platforms.forEach((platform) => {
		platform.draw();
	});
	player.update();

	if (keys.right.pressed && player.position.x < 400) {
		player.velocity.x = player.speed;
	} else if (
		(keys.left.pressed && player.position.x > 100) ||
		(keys.left.pressed &&
			scrollOffset === 0 &&
			player.position.x > 0)
	) {
		player.velocity.x = -player.speed;
	} else if (
		keys.right.pressed &&
		scrollOffset > PlatformImage.width * 9 + 600
	) {
		player.velocity.x = 0;
	} else {
		player.velocity.x = 0;

		if (keys.right.pressed) {
			scrollOffset += player.speed;
			platforms.forEach((platform) => {
				platform.position.x -= player.speed;
			});
			genericObjects.forEach((genericObject) => {
				genericObject.position.x -= player.speed * 0.66;
			});
		} else if (keys.left.pressed && scrollOffset > 0) {
			scrollOffset -= player.speed;
			platforms.forEach((platform) => {
				platform.position.x += player.speed;
			});
			genericObjects.forEach((genericObject) => {
				genericObject.position.x += player.speed * 0.66;
			});
		}
	}

	//platform collision detection
	platforms.forEach((platform) => {
		if (
			player.position.y + player.height <=
				platform.position.y &&
			player.position.y +
				player.height +
				player.velocity.y >=
				platform.position.y &&
			player.position.x + player.width >=
				platform.position.x &&
			player.position.x <=
				platform.position.x + platform.width
		) {
			player.velocity.y = 0;
		}
	});

	//win condition
	if (scrollOffset > PlatformImage.width * 9) {
		console.log('win');
	}

	//loose condition
	if (player.position.y > canvas.height) {
		init();
	}
}

animate();

addEventListener('keydown', ({ keyCode }) => {
	switch (keyCode) {
		case 65:
			console.log('left');
			keys.left.pressed = true;

			break;
		case 83:
			console.log('down');
			break;
		case 68:
			console.log('right');
			keys.right.pressed = true;
			break;
		case 87:
			console.log('up');
			player.velocity.y -= 10;
			break;
	}
});

addEventListener('keyup', ({ keyCode }) => {
	switch (keyCode) {
		case 65:
			console.log('left');
			keys.left.pressed = false;
			break;
		case 83:
			console.log('down');
			break;
		case 68:
			console.log('right');

			keys.right.pressed = false;
			break;
		case 87:
			console.log('up');
			break;
	}
});
