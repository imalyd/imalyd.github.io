function startGame(level, theme) {
	let container = document.getElementById('container')
	container.innerHTML = ''

	// Create a map.

	let mapHeight = level.mapHeight
	let mapWidth = level.mapWidth
	let map = level.map
	let characters = level.characters

	for (let x = 0; x < mapHeight; ++x) {
		for (let y = 0; y < mapWidth; ++y) {
			if (map[x][y] === '.') {
				map[x][y] = {
					name: 'none',
					enter: [true, true, true, true],
					exit: [true, true, true, true]
				}
			}
			if (map[x][y] === '#') {
				map[x][y] = {
					name: 'obstacle',
					enter: [false, false, false, false],
					exit: [false, false, false, false]
				}
			}
		}
	}

	// Get the content of map.

	let diffX = [-1, 0, 1, 0]
	let diffY = [0, 1, 0, -1]
	let DIR_NONE = -1
	let DIR_UP = 0
	let DIR_RIGHT = 1
	let DIR_DOWN = 2
	let DIR_LEFT = 3

	function getOppositeDirection(dir) {
		return dir ^ 2
	}

	function getMap(x, y) {
		if (0 <= x && x < mapHeight && 0 <= y && y < mapWidth)
			return map[x][y]
		else return {
			name: 'obstacle',
			enter: [false, false, false, false],
			exit: [false, false, false, false]
		}
	}

	function canMove(point, dir) {
		return getMap(point.x, point.y).exit[dir] && getMap(point.x + diffX[dir], point.y + diffY[dir]).enter[getOppositeDirection(dir)]
	}

	function afterMove(point, dir) {
		if (dir != DIR_NONE)
			return { x: point.x + diffX[dir], y: point.y + diffY[dir] }
		else
			return { x: point.x, y: point.y }
	}

	function doMove(point, dir) {
		if (dir != DIR_NONE) {
			point.x += diffX[dir]
			point.y += diffY[dir]
		}
		updateGame()
	}

	function collision(point1, point2) {
		return point1.x == point2.x && point1.y == point2.y
	}

	// Player moves.

	let _innerMove = 1
	if (characters.player.moves)
		_innerMove = characters.player.moves

	let _innerMoveTotal = 0
	function generateMoves() {
		_innerMoveTotal += _innerMove
		let ret = Math.floor(_innerMoveTotal)
		_innerMoveTotal -= ret
		return ret
	}

	let playerMoveCount = generateMoves()

	function playerMove(dir) {
		if (playerMoveCount >= 1 && canMove(characters.player, dir)) {
			--playerMoveCount;
			doMove(characters.player, dir)
		}
	}

	function keydownEvent(e) {
		let c = e.code;
		if (c == 'ArrowUp' || c == 'KeyW')
			playerMove(DIR_UP)
		if (c == 'ArrowRight' || c == 'KeyD')
			playerMove(DIR_RIGHT)
		if (c == 'ArrowDown' || c == 'KeyS')
			playerMove(DIR_DOWN)
		if (c == 'ArrowLeft' || c == 'KeyA')
			playerMove(DIR_LEFT)
	}

	document.addEventListener('keydown', keydownEvent)

	function removeKbdEvent() {
		document.removeEventListener('keydown', keydownEvent)
	}

	// Chaser & Goal moves.

	function findDistance() {
		let distance = []

		for (let x = 0; x < mapHeight; ++x) {
			let distanceRow = []

			for (let y = 0; y < mapWidth; ++y)
				distanceRow.push(Infinity)

			distance.push(distanceRow)
		}

		distance[characters.player.x][characters.player.y] = 0

		let queue = [{ x: characters.player.x, y: characters.player.y, dis: 0 }]

		for (let queueHead = 0; queueHead < queue.length; ++queueHead) {
			let currentPoint = queue[queueHead]
			let updateDistance = currentPoint.dis + 1
			for (let dir = 0; dir < 4; ++dir)if (canMove(currentPoint, dir)) {
				let newX = currentPoint.x + diffX[dir]
				let newY = currentPoint.y + diffY[dir]
				if (updateDistance < distance[newX][newY]) {
					distance[newX][newY] = updateDistance
					queue.push({
						x: newX,
						y: newY,
						dis: updateDistance
					})
				}
			}
		}

		return distance
	}

	function findOptimalMove(chaser) {
		let distance = findDistance()
		let optimalMove = -1
		let optimalMoveDistance = distance[chaser.x][chaser.y]

		for (let dir = 0; dir < 4; ++dir)if (canMove(chaser, dir)) {
			let newX = chaser.x + diffX[dir]
			let newY = chaser.y + diffY[dir]
			if (distance[newX][newY] < optimalMoveDistance) {
				optimalMove = dir
				optimalMoveDistance = distance[newX][newY]
			}
		}

		return optimalMove
	}

	function defaultChaserMove(chaser) {
		return findOptimalMove(chaser)
	}

	function defaultGoalMove(goal) {
		return -1
	}

	function intervalEvent() {
		playerMoveCount = generateMoves()

		characters.chaser.forEach(function (chaser) {
			let dir = DIR_NONE
			if (chaser.move)
				dir = chaser.move()
			else
				dir = defaultChaserMove(chaser)
			if (canMove(chaser, dir)) {
				doMove(chaser, dir)
			}
		})

		characters.goal.forEach(function (goal) {
			let dir = DIR_NONE
			if (goal.move)
				dir = goal.move()
			else
				dir = defaultGoalMove(goal)
			if (canMove(goal, dir)) {
				doMove(goal, dir)
			}
		})
	}

	let intervalEventID = setInterval(intervalEvent, level.timePeriod)

	function removeIntervalEvent() {
		clearInterval(intervalEventID)
	}

	// Create a table.

	let displayUnitSize = 84
	let displayUnitBgSize = '150%'
	let displayButtonSize = 200

	let displayHeight = level.displayHeight
	let displayWidth = level.displayWidth
	let displayPlayerX = level.displayPlayerX
	let displayPlayerY = level.displayPlayerY

	let table = document.createElement('table')
	let tableCells = []

	for (let x = 0; x < displayHeight; ++x) {
		let tableRow = document.createElement('tr')
		let tableRowCells = []

		for (let y = 0; y < displayWidth; ++y) {
			let tableCell = document.createElement('td')
			tableCell.style = `width:${displayUnitSize}px;height:${displayUnitSize}px;background-position:center;background-size:${displayUnitBgSize};background-repeat:no-repeat;margin:0;border:none`
			tableRow.appendChild(tableCell)
			tableRowCells.push(tableCell)
		}

		table.appendChild(tableRow)
		tableCells.push(tableRowCells)
	}

	let div = document.createElement('div')
	div.style = `width:${displayButtonSize * 3}px;min-height:${displayButtonSize * 3}px;position:relative;display:flex;flex-direction:column;align-items:center`

	function createKbdButton(x, y, content, dir) {
		let button = document.createElement('div')
		button.className = 'button'
		button.style = `margin:0;position:absolute;top:${x + displayButtonSize * 0.1}px;left:${y + displayButtonSize * 0.1}px;width:${displayButtonSize * 0.8}px;height:${displayButtonSize * 0.8}px;font-size:${displayButtonSize * 0.5}px`
		button.innerHTML = content
		button.addEventListener('click', function () { playerMove(dir) })
		div.appendChild(button)
	}
	createKbdButton(0, displayButtonSize, '↑', 0);
	createKbdButton(displayButtonSize, 0, '←', 3);
	createKbdButton(displayButtonSize * 2, displayButtonSize, '↓', 2);
	createKbdButton(displayButtonSize, displayButtonSize * 2, '→', 1);

	let mainContent = document.createElement('div')
	mainContent.style = 'display:flex;flex-wrap:wrap;align-content:center;justify-content:center;align-items:center;width:100%;height:100%'

	mainContent.appendChild(table)
	mainContent.appendChild(div)

	container.appendChild(mainContent)

	// Set the content of a cell.

	let displayImage = {
		none: 'none',
		obstacle: 'url("obstacle.png")',
		player: 'url("iota.png")',
		chaser: 'url("omega.png")',
		goal: 'url("omicron.png")'
	}
	if (theme && theme.displayImage)
		displayImage = theme.displayImage

	function setContent(x, y, img) {
		let cell = tableCells[x][y]
		cell.style.backgroundImage = displayImage[img]
	}

	// Draw the level.

	function drawLevel() {
		let name = []
		let offsetX = characters.player.x - displayPlayerX
		let offsetY = characters.player.y - displayPlayerY

		for (let x = 0; x < displayHeight; ++x) {
			let nameRow = []

			for (let y = 0; y < displayWidth; ++y)
				nameRow.push(getMap(x + offsetX, y + offsetY).name)

			name.push(nameRow)
		}

		function update(point, n) {
			let x = point.x - offsetX
			let y = point.y - offsetY
			if (0 <= x && x < displayHeight && 0 <= y && y < displayWidth)
				name[x][y] = n
		}

		update(characters.player, 'player')
		characters.goal.forEach(function (goal) {
			update(goal, 'goal')
		});
		characters.chaser.forEach(function (chaser) {
			update(chaser, 'chaser')
		});
		for (let x = 0; x < displayHeight; ++x)
			for (let y = 0; y < displayWidth; ++y)
				setContent(x, y, name[x][y])
	}

	// Every game has an end ...

	let gameEnded = false;
	function gameOver(ending) {
		if (gameEnded) return;
		gameEnded = true;

		removeKbdEvent();
		removeIntervalEvent();
		div.innerHTML = ''

		let prompt = ''
		if (ending == 'win')
			prompt = 'YOU WIN!'
		if (ending == 'lose')
			prompt = 'YOU LOSE...'

		let title = document.createElement('p');
		title.style = 'font-size:40px'
		title.innerHTML = level.name
		div.appendChild(title)

		let text = document.createElement('p');
		text.style = 'font-size:60px'
		text.innerHTML = prompt
		div.appendChild(text)

		let hasNext=(nextID !== null && ending == 'win')

		function clickR() {
			removeKbdEventRestart()
			play()
		}
		function clickN() {
			removeKbdEventRestart()
			id = nextID
			play()
		}

		function keydownEventRestart(e) {
			let c = e.code;
			if (c == 'KeyR')
				clickR()
			if (hasNext&&c == 'KeyN')
				clickN()
		}

		document.addEventListener('keydown', keydownEventRestart)

		function removeKbdEventRestart() {
			document.removeEventListener('keydown', keydownEventRestart)
		}

		function createButton(title, click) {
			let button = document.createElement('div')
			button.className = 'button'
			button.style = 'width:90%'
			button.innerHTML = title
			button.addEventListener('click', click)
			div.appendChild(button)
		}
		createButton('<u>R</u>etry', clickR)
		if (hasNext)
			createButton('<u>N</u>ext Level', clickN)
		createButton('Menu', startUI)

		if (level.onend)
			level.onend(ending)
	}

	// Update the game.

	function updateGame() {
		//Redraw the level.
		drawLevel()

		// Check if the player loses.
		characters.chaser.forEach(function (chaser) {
			if (collision(characters.player, chaser)) {
				gameOver('lose')
			}
		});

		// Check if the player wins.
		characters.goal.forEach(function (goal) {
			if (collision(characters.player, goal)) {
				gameOver('win')
			}
		});
	}

	// Call the onload function of the level.

	drawLevel()
	if (level.onload)
		level.onload()
}