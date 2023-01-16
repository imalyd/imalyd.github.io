var currentLevel
function startUI(){
	let container = document.getElementById('container')
	container.innerHTML = '<h1 style="color:#FFF;font-size:60px">IMALYD\'s Chasing Game</h1><h2 style="color:#FFF;font-size:40px">IMALYD</h2>'
	levels.forEach(function(level){
		let button=document.createElement('button')
		button.style='margin:10px;width:600px;height:60px;border-radius:5px;border:none;background-color:#FFF;font-size:30px'
		button.innerHTML=level.title
		button.addEventListener('click',function(){currentLevel=level.fn;level.fn()})
		container.appendChild(button)
	})
}
startUI()