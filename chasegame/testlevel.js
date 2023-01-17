function testLevel() {
	startGame({
		id: 'testLevel',
		name: 'Test Level',
		mapHeight: 3,
		mapWidth: 3,
		map: [
			['.', '.', '.'],
			['.', '.', '.'],
			['.', '.', '.']
		],
		characters: {
			player: { x: 0, y: 0,moves:2 },
			chaser: [{ x: 2, y: 1 }],
			goal: [{ x: 2, y: 2 }]
		},
		timePeriod: 300,

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
		displayUnitBorderRadius: 0,
		displayUnitSize: 80,
		displayUnitBgSize: '150%',
		displayButtonSize: 200,

		onload: function () {
			//console.log('ONLOAD')
		},

		onend: function (ending) {
			//console.log('END', ending)
		}
	})
}
//addLevel(testLevel,'Test Level')