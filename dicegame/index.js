function getElem(id) {
	return document.getElementById(id);
}
function newElem(tag) {
	return document.createElement(tag);
}
var tableBody = getElem("tableBody");
var msg = getElem("msg");
var roll = getElem("roll");
var reset = getElem("reset");
var dice1 = getElem("dice1").getContext("2d");
var dice2 = getElem("dice2").getContext("2d");

function drawCircle(x, y, r, c, ctx) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.fillStyle = c;
	ctx.fill();
}

function drawDice(num, ctx) {
	ctx.clearRect(0, 0, 100, 100);
	if (num == 1) {
		drawCircle(50, 50, 20, "red", ctx);
	}
	if (num == 2) {
		drawCircle(25, 25, 10, "blue", ctx);
		drawCircle(75, 75, 10, "blue", ctx);
	}
	if (num == 3) {
		drawCircle(25, 25, 10, "blue", ctx);
		drawCircle(50, 50, 10, "blue", ctx);
		drawCircle(75, 75, 10, "blue", ctx);
	}
	if (num == 4) {
		drawCircle(25, 25, 10, "red", ctx);
		drawCircle(25, 75, 10, "red", ctx);
		drawCircle(75, 25, 10, "red", ctx);
		drawCircle(75, 75, 10, "red", ctx);
	}
	if (num == 5) {
		drawCircle(25, 25, 10, "blue", ctx);
		drawCircle(25, 75, 10, "blue", ctx);
		drawCircle(50, 50, 10, "blue", ctx);
		drawCircle(75, 25, 10, "blue", ctx);
		drawCircle(75, 75, 10, "blue", ctx);
	}
	if (num == 6) {
		drawCircle(25, 25, 10, "gold", ctx);
		drawCircle(25, 50, 10, "gold", ctx);
		drawCircle(25, 75, 10, "gold", ctx);
		drawCircle(75, 25, 10, "gold", ctx);
		drawCircle(75, 50, 10, "gold", ctx);
		drawCircle(75, 75, 10, "gold", ctx);
	}
}

var round = 0;
var score1 = 0;
var score2 = 0;
function randDice() {
	return Math.floor(Math.random() * 6) + 1;
}
function addRound() {
	let func = function () {
		drawDice(randDice(), dice1);
		drawDice(randDice(), dice2);
	};
	let inter = setInterval(func, 100);
	setTimeout(function () {
		clearInterval(inter);
		let d1 = randDice();
		let d2 = randDice();

		drawDice(d1, dice1);
		drawDice(d2, dice2);

		++round;

		let mul = 1;
		if (round == 1)
			mul = 2;

		score1 += d1 * mul;
		score2 += d2 * mul;

		let row = newElem("tr");
		tableBody.appendChild(row);

		let r1 = newElem("td");
		r1.innerHTML = "" + round;
		row.appendChild(r1);

		let r2 = newElem("td");
		r2.innerHTML = "" + score1;
		row.appendChild(r2);

		let r3 = newElem("td");
		r3.innerHTML = "" + score2;
		row.appendChild(r3);

		if (score1 > score2)
			msg.innerHTML = "Player 1 wins!"
		else
			if (score1 < score2)
				msg.innerHTML = "Player 2 wins!"
			else
				msg.innerHTML = "Tie!"
	}, 1000);
}

function resetGame() {
	round = 0;
	score1 = 0;
	score2 = 0;

	drawDice(0, dice1);
	drawDice(0, dice2);

	tableBody.innerHTML = "";
	msg.innerHTML = "...";
}

roll.addEventListener("click", addRound);
reset.addEventListener("click", resetGame);