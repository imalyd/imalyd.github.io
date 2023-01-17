var id
var nextID
function play(){
	if (levels[id + 1])
	nextID = id+1
	else
	nextID=null
	levels[id].fn()
}
function startUI() {
	let container = document.getElementById('container')
	container.innerHTML = '<p style="font-size:60px">IMALYD\'s Chasing Game</p><p style="font-size:40px">IMALYD</p>'
	levels.forEach(function (level, n) {
		let button = document.createElement('div')
		button.className = 'button'
		button.style = 'width:600px'
		button.innerHTML = level.title
		button.addEventListener('click', function () { id=n;play() })
		container.appendChild(button)
	})
}
startUI()