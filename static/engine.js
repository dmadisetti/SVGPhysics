var scale = 1
, running = true
, g = -9.81 * scale
, fps = 1000/50
, Objects = []
, friction = 0
, elasticity = 0.8
, number
, main
, theta
, practice
, deltax	// x change in practice
, deltay	// y change in practice
, which
, near0
, near1
, object
, other;

var req = new XMLHttpRequest();
req.onload = function(data){
	var matches = data.currentTarget.responseText.match(/<svg.*\/svg>/g) || ['No Level Matched'];	
	document.querySelector('#wrapper').innerHTML = matches[0];
	start();
}


document.onkeydown = function(e) {
	if (!running) return;
	if(e.which == 38) 
	if (main.vy == 0){ 		//Prevent double jump
			main.vy = -10 * scale; //up
			main.y -= 1;
	}
	if(e.which == 37) main.vx = -5 * scale; //left
   	if(e.which == 39) main.vx = 5 * scale; //right
   	if(e.which == 40) main.vy = 5 * scale; //down
}



function start() {
	chiles = document.querySelector('#vectors').childNodes;
	number = chiles.length;
	for (var i = 0; i < number; i++) {
		Objects[i] = assignShape(chiles[i]);
		if (Objects[i].type == 'main') main = Objects[i];
	};
	number--;
	running = true;
	animate();
}

function animate(){
	// Get start time
	var d = new Date();
	var then = d.getTime();

	var tempnumber = number;	

	do{

		object = Objects[tempnumber];

		// Move every moveable object
		if(object.type == 'static')
			continue;

		// Move from last calcuation. Step behind for collision calculations
		console.log([object.x,object.y])
		object.move();
		return;

		//Acceleration due to gravity
		object.vy -= g/fps;

		// Hold on to old values for resolution
		object.px = object.x;
		object.py = object.y;
		// Move x and y for next iteration
		object.x += object.vx;
		object.y += object.vy;
		
		//Baseline. Quick fix until full collision
		/*if (Objects[tempnumber].y >= 200){
			if (Objects[tempnumber].vy >= -0.5 && Objects[tempnumber].vy <= 0.5){
				Objects[tempnumber].vy = 0;
				Objects[tempnumber].jump = false;
			}else{
				//Elasticity shoud be object prop on full collision
				Objects[tempnumber].vy *= -1 * elasticity;
			}
			// Stop it going to the Nether World
			Objects[tempnumber].y = 200;			
		}*/
		
		// For Nested while for Object Collsion
		var tempnumber2 = number;

		do{
			// Prevents comparing against self
			if (tempnumber == tempnumber2) continue;

			// Set Global
			other = Objects[tempnumber2];

			// If "Touching" fix 
			calculate[object.kind][other.kind](object,other);
		
		}while(tempnumber2--)
		// So I heard these Whiles were faster

		// If moving that slow then just Stop
		if (object.vx >= -0.1 * scale && object.vx <= 0.1 * scale)
			object.vx = 0;
		if (object.vy >= -0.4 * scale && object.vy <= 0.4 * scale){
			object.vy = 0;
			if (object.vx > 0)
				object.vx += friction * (object.mass * g);
			else if (object.vx < 0)
				object.vx -= friction * (object.mass * g);
		}
		
		//HTML5 Transition
		if (object.y >= 1500){
			object.y = 0;
			try{
				//Transtion to different page
				history.pushState({path:'/'}, 'Next Level', '/');
			}catch(e){
				alert(e);
			}
			//Load new Elements
			req.open("GET", "/", true);
			req.send();
			//Kill old loop
			running = false;		
	  	}


	}while(tempnumber--)

	// Get current Time
	var d = new Date();
	var now = d.getTime();

	//Adjust next call for time elapsed
	var delay = fps - now + then;
	if(delay < 0)
		delay = 0;

	//Call if still running
	if (running)
		window.setTimeout('animate()',delay);
}

function error(msg){
	throw { 
	    name:        'Physics Engine Error', 
	    level:       'Show Stopper', 
	    message:     msg, 
	    htmlMessage: 'Please read API.' 
	} 
}
start();