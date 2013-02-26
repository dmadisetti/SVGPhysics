	
	var	Object = function(){
		var self = this;
		this.jump = true;
		this.x = 0;
		this.y = 0;
		this.type = '';
		this.vx = 0;
		this.vy = 0;
		this.frame = 0;
		this.dom = '';
		this.mass = 1;
		this.kind;
		this.move = {
			'circle': function(){
				self.dom.setAttribute('cx',self.x);
				self.dom.setAttribute('cy',self.y);
			},
			'rect': function(){
				self.dom.setAttribute('x',self.x);
				self.dom.setAttribute('y',self.y);			
			},
			'polygon': function(){
			}
		}
		this.get = {
			'circle': function(theta){
				return self.r;
			},
			'rect': function(theta){
				//It'll never touch!!
				return -100000000000000000;
			},
			'polygon': function(theta){
			}
		}
		this.types = {
			'circle': function(){
				self.kind = 'circle';
				self.y = self.dom.cy.baseVal.value;
				self.x = self.dom.cx.baseVal.value;
				self.r = self.dom.r.baseVal.value;
			},
			'rect': function(){
				self.kind = 'rect';
				self.x = self.dom.x.baseVal.value;
				self.y = self.dom.y.baseVal.value;
				self.cx = self.dom.x.baseVal.value + (self.dom.width.baseVal.value/2);
				self.cy = self.dom.y.baseVal.value + (self.dom.height.baseVal.value/2);
			},
			'polygon': function(){
				i = self.dom.points.numberOfItems;
				if (i <= 2)
					error('Require at least 3 points for Polygon');
				i--;
				ii = i;
				polygon = Objects.pop().dom;
				while((i + 1)/3 >= 1){
					p1 = polygon.points.getItem(i);
					p2 = polygon.points.getItem(--i);
					p3 = polygon.points.getItem(--i);
					triangle(p1,p2,p3);
				}
				alert('starting close');
				if (i) triangle(p3,polygon.points.getItem(0),polygon.points.getItem(ii));
				else if (ii - 2) triangle(p2,p3,polygon.points.getItem(ii));

				function triangle(p1,p2,p3){
					//Test Enviroment
	        		document.getElementById('vectors').appendChild(SVG('polygon', {points: +p1.x+','+p1.y+' '+p2.x+','+p2.y+' '+p3.x+','+p3.y, stroke: 'black', 'stroke-width': 2, fill: 'red'}));
				}
				function SVG(tag, attrs) {
	            	var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
	            	for (var k in attrs)
	                	el.setAttribute(k, attrs[k]);
	            	return el;
        		}
				polygons += 1;
				--number;
			}
		}
	}
	var polygons = 0;
	var running = true;
	var g = -9.81;
	var fps = 1000/50;
	var Objects = []
	var friction = 0.01;
	var elasticity = 0.8;
	var number = 0;
	var tempnumber;
	var main;

	function error(msg){
		throw { 
		    name:        'Physics Engine Error', 
		    level:       'Show Stopper', 
		    message:     msg, 
		    htmlMessage: 'Please read API.' 
		} 
	}

	document.onkeydown =function(e) {
		if(e.which == 38) {
			if (!Objects[main].jump){ 		//Prevent double jump
				Objects[main].jump = true;
				Objects[main].vy = -10; //up
			}
		}
		if(e.which == 37) {
			Objects[main].vx = -5; //left
	   	}
	   	if(e.which == 39) {
			Objects[main].vx = 5; //right
		}
	   	if(e.which == 40) {
			Objects[main].vy = 5; //down
		}
	}

$(document).ready(function() {
	start();
});

function start() {
	number = 0;
	$.each($('#vectors').children(),function(){
		if (this.id == 'Main')
			main = number;
		Objects[number] = new Object();
		Objects[number].dom = this;
		//try{
			Objects[number++].types[this.tagName]();
		//}catch{
		//	error('SVG Platform Engine only supports circle,ellipse,rect and polygon tags.');
		//}
	});
	number--;
	running = true;
	animate();
}

function resolve(ob0,ob1){
	alert('theory:'+theory+' practice:'+practice);
}

function examine(ob0,ob1){
	var theta = Math.atan((ob0.y-ob1.y)/(ob0.x-ob1.x));
	theory = ob0.get[ob0.kind](theta) + ob1.get[ob1.kind](theta);
	practice = Math.sqrt(Math.pow((ob0.y-ob1.y),2) + Math.pow((ob0.x-ob1.x),2));
	return practice < theory;
}


function animate(){
	// Get start time
	var d = new Date();
	var then = d.getTime();

	tempnumber = number;	
	do{
		// Move every moveable object

		//Push to temp var for optimazation
		var ob = Objects[tempnumber];

		Objects[tempnumber].move[ob.kind]();

		//In contact with something. Quick fix until full collision
		if(ob.jump)
			Objects[tempnumber].vy -= g/fps;
		else if (ob.vx > 0)
			Objects[tempnumber].vx += friction * (ob.mass * g);
		else if (ob.vx < 0)
			Objects[tempnumber].vx -= friction * (ob.mass * g);

		// If moving that slow then just Stop
		if (Objects[tempnumber].vx >= -0.25 && Objects[tempnumber].vx <= 0.25)
				Objects[tempnumber].vx = 0;

		// Move x and y for next iteration
		Objects[tempnumber].x += Objects[tempnumber].vx;
		Objects[tempnumber].y += Objects[tempnumber].vy;
		
		//Baseline. Quick fix until full collision
		if (Objects[tempnumber].y >= 200){
			if (Objects[tempnumber].vy >= -0.5 && Objects[tempnumber].vy <= 0.5){
				Objects[tempnumber].vy = 0;
				Objects[tempnumber].jump = false;
			}else{
				//Elasticity shoud be object prop on full collision
				Objects[tempnumber].vy *= -1 * elasticity;
			}
			// Stop it going to the Nether World
			Objects[tempnumber].y = 200;			
		}
		
		// For Nested while for Object Collsion
		tempnumber2 = number;

		do{
			// Prevents comparing against self
			if (tempnumber == tempnumber2)
				continue;
			//'Examine' looks whether touching
			if(examine(Objects[tempnumber],Objects[tempnumber2]))
				//If touching then Fix
				resolve(Objects[tempnumber],Objects[tempnumber2]);
		
		}while(tempnumber2--)
		// So I heard these Whiles were faster

		//HTML5 Transition
		if (Objects[tempnumber].x >= 500){
			Objects[tempnumber].x = 0;
			try{
				//Transtion to different page
				history.pushState({path:'/index2.html'}, 'Next Level', 'index2.html');
			}catch(e){
				alert(e);
			}
			//Load new Elements
			$('#wrapper').load('Level.html #vectors', function(){
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