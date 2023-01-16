function level1() {
	startGame({
		id: 'level1',
		name: 'Level #1',
		mapHeight: 9,
		mapWidth: 9,
		map: [
			['.', '.', '.', '.', '.', '.', '.', '.', '.'],
			['#', '#', '#', '#', '#', '#', '#', '#', '.'],
			['.', '.', '.', '.', '.', '.', '.', '#', '.'],
			['.', '#', '#', '#', '#', '#', '.', '#', '.'],
			['.', '#', '.', '.', '.', '#', '.', '#', '.'],
			['.', '#', '.', '#', '.', '#', '.', '#', '.'],
			['.', '#', '.', '.', '.', '.', '.', '#', '.'],
			['.', '#', '#', '#', '#', '#', '#', '#', '.'],
			['.', '.', '.', '.', '.', '.', '.', '.', '.']
		],
		characters: {
			player: { x: 0, y: 2,moves:2 },
			chaser: [{ x: 0, y: 0 }],
			goal: [{ x: 0, y: 0 }]
		},
		timePeriod: 200,

		displayHeight: 9,
		displayWidth: 9,
		displayPlayerX: 4,
		displayPlayerY: 4,
		displayImage: {
			none: 'none',
			obstacle: 'url("obstacle.png")',
			player: 'url("iota.png")',
			chaser: 'url("omega.png")',
			goal: 'url("omicron.png")'
		},
		displayUnitBorderRadius: 5,
		displayUnitSize: 80,
		displayUnitBgSize: '150%',
		displayButtonSize: 100
	})
}
addLevel(level1,'Level #1')