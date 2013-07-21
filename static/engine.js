	var scale = 1;
	var polygons = 0;
	var running = true;
	var g = -9.81 * scale;
	var fps = 1000/50;
	var Objects = []
	var friction = 0;
	var elasticity = 0.8;
	var number = 0;
	var tempnumber;
	var main;
	var theta;
	var practice;
	var deltax;	// x change in practice
	var deltay;	// y change in practice
	var which;
	var near0;
	var near1;
	var object,other;

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
	number = chiles.length - 1;
	for (var i = 0; i < number; i++) {
		Objects[i] = assignObject(chiles[i]);
		if (Objects[i].type == 'main') main = Objects[i];
	};
	running = true;
	animate();
}

function resolve(){
	if(other.type != "static"){
		other.vy -= deltay/fps;
		other.vx -= deltax/fps;
	}else{
		if (other.kind == 'rect')
			theta = Math.acos(Math.sin(near0.angle));
		
		if (Math.cos(theta) > 0 && Math.cos(theta) < Math.PI/2){
			object.x += d * Math.cos(theta) + 1;
		}else 
			object.x -= d * Math.cos(theta) - 1;
		if (Math.sin(theta) > 0 && Math.sin(theta) < Math.PI/2)
			object.y += d * Math.sin(theta) + 1;
		else
			object.y -= d * Math.sin(theta) - 1;
		vmag = Math.sqrt(Math.pow(object.vx,2) + Math.pow(object.vy,2));		
		if (Math.sin(theta) > 0 && Math.sin(theta) < Math.PI/2){
			object.vy = Math.sin(theta) * vmag * -1 * other.elasticity;
			object.vx += Math.cos(theta) * vmag * -1;
		}else if (Math.sin(theta) != 0 && Math.sin(theta) != Math.PI/2){ 
			object.vy = Math.sin(theta) * vmag * other.elasticity;
			object.vx += Math.cos(theta) * vmag;
		}
	}
}

function examine(ob0,ob1){
	deltay = (ob0.cy()-ob1.cy());
	deltax = (ob0.cx()-ob1.cx());
	theta = Math.atan(deltay/deltax);
	practice = Math.sqrt(Math.pow(deltay,2) + Math.pow(deltax,2));
	theory = calculate[ob0.type][ob1.type](ob0,ob1);
	d = practice - theory;
	return d;
}


function animate(){
	// Get start time
	var d = new Date();
	var then = d.getTime();

	tempnumber = number;	

	do{

		object = Objects[tempnumber];

		// Move every moveable object
		if(object.kind == 'static')
			continue;

		// Move from last calcuation. Step behind for collision calculations
		object.move();

		//Acceleration due to gravity
		object.vy -= g/fps;
		
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
		tempnumber2 = number;

		do{

			// Prevents comparing against self
			if (tempnumber == tempnumber2)
				continue;
			//'Examine' looks whether touching
			other = Objects[tempnumber2];
			if(examine(object,other) < 0)
				//If touching then Fix
				resolve(object,other);
		
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

/*		
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
			$('#wrapper').load('/ #vectors', function(){
				start();
			});
			//Kill old loop
			running = false;		
	  	}
*/

	}while(tempnumber--)

	// Get current Time
	var d = new Date();
	var now = d.getTime();

	//Adjust next call for time elapsed
	delay = fps - now + then;
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