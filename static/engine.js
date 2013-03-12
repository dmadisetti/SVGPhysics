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
	var d;
	var which;

document.onkeydown =function(e) {
	if (!running)
		return;
	if(e.which == 38) {
		if (Objects[main].vy == 0){ 		//Prevent double jump
			//Objects[main].jump = true;
			Objects[main].vy = -10 * scale; //up
			Objects[main].y -= 1;
		}
	}
	if(e.which == 37) {
		Objects[main].vx = -5 * scale; //left
   	}
   	if(e.which == 39) {
		Objects[main].vx = 5 * scale; //right
	}
   	if(e.which == 40) {
		Objects[main].vy = 5 * scale; //down
	}
}

$(document).ready(function() {
	start();
});

function start() {
	number = 0;
	$.each($('#vectors').children(),function(){
		if ($(this).attr("data-type") == 'main')
			main = number;
		Objects[number] = new Object();
		Objects[number].dom = this;
		try{
			Objects[number++].types[this.tagName]();
		}catch(er){
			error('SVG Platform Engine only supports circle,rect and polygon tags.');
		}
	});
	number--;
	running = true;
	animate();
}

function resolve(){
	if(Objects[tempnumber2].type != "static"){
		Objects[tempnumber2].vy -= deltay/fps;
		Objects[tempnumber2].vx -= deltax/fps;
	}else{
		if (Math.cos(theta) > 0 && Math.cos(theta) < Math.PI/2){
			Objects[tempnumber].x += d * Math.cos(theta) + 1;
		}else if(Math.cos(theta) < 0.1 && Math.cos(theta) > -0.1 )
			Objects[tempnumber].x -= d * Math.cos(theta) - 1;
		if (Math.sin(theta) > 0 && Math.sin(theta) < Math.PI/2)
			Objects[tempnumber].y += d * Math.sin(theta) + 1;
		else if(Math.sin(theta) < 0)
			Objects[tempnumber].y -= d * Math.sin(theta) - 1;
		if (Objects[tempnumber2].kind == 'rect')
			return;
		vmag = Math.sqrt(Math.pow(Objects[tempnumber].vx,2) + Math.pow(Objects[tempnumber].vy,2));		
		if (Math.sin(theta) > 0 && Math.sin(theta) < Math.PI/2){
			Objects[tempnumber].vy = Math.sin(theta) * vmag * -1 * Objects[tempnumber2].elasticity;
			Objects[tempnumber].vx += Math.cos(theta) * vmag * -1;
		}else if (Math.sin(theta) != 0 && Math.sin(theta) != Math.PI/2){ 
			Objects[tempnumber].vy = Math.sin(theta) * vmag * Objects[tempnumber2].elasticity;
			Objects[tempnumber].vx += Math.cos(theta) * vmag;
		}
	}
}

function examine(ob0,ob1){
	deltay = (ob0.cy()-ob1.cy());
	deltax = (ob0.cx()-ob1.cx());
	theta = Math.atan(deltay/deltax);
	practice = Math.sqrt(Math.pow(deltay,2) + Math.pow(deltax,2));
	theory = calculate[ob0.kind][ob1.kind](ob0,ob1);
	d = practice - theory;
	return d;
}


function animate(){
	// Get start time
	var d = new Date();
	var then = d.getTime();



	tempnumber = number;	
	do{
		// Move every moveable object
	if(Objects[tempnumber].type == 'static')
		continue;

		console.log(Objects[tempnumber].x);
		console.log(Objects[tempnumber].y);


		//Push to temp var for optimazation
		var ob = Objects[tempnumber];

		// Move from last calcuation. Step behind for collision calculations
		ob.move();

		//Acceleration due to gravity
		Objects[tempnumber].vy -= g/fps;
		
		// Move x and y for next iteration
		Objects[tempnumber].x += Objects[tempnumber].vx;
		Objects[tempnumber].y += Objects[tempnumber].vy;
		
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
			if(examine(Objects[tempnumber],Objects[tempnumber2]) < 0)
				//If touching then Fix
				resolve();
		
		}while(tempnumber2--)
		// So I heard these Whiles were faster

		// If moving that slow then just Stop
		if (Objects[tempnumber].vx >= -0.1 * scale && Objects[tempnumber].vx <= 0.1 * scale)
			Objects[tempnumber].vx = 0;
		if (Objects[tempnumber].vy >= -0.4 * scale && Objects[tempnumber].vy <= 0.4 * scale){
				Objects[tempnumber].vy = 0;
				if (ob.vx > 0)
					Objects[tempnumber].vx += friction * (ob.mass * g);
				else if (ob.vx < 0)
					Objects[tempnumber].vx -= friction * (ob.mass * g);
		}

		
		//HTML5 Transition
		if (Objects[tempnumber].y >= 1500){
			Objects[tempnumber].y = 0;
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
