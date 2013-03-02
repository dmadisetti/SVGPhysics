	var bound =	function(pad,theta){
		this.angle = theta;
		this.pad = pad;
	}

	var calculate = {
			'circle':{
				'circle': function(ob0,ob1){
					return ob0.r + ob1.r;
				},
				'rect': function(ob0,ob1){
					return calculate['rect']['circle'](ob1,ob0);
				},
				'polygon': function(ob0,ob1){
					return calculate['polygon']['circle'](ob1,ob0);
				}
			},
			'rect':{
				'circle': function(ob0,ob1){
					near = Close(ob0,ob1.x,ob1.y);
					return Math.sqrt(Math.pow((practice * Math.cos(near.angle - theta)),2) + Math.pow((near.pad + ob1.r),2));
				},
				'rect': function(ob0,ob1){
					near0 = Close(ob0,ob1.cx['rect'](),ob1.cy['rect']());
					near1 = Close(ob1,ob0.cx['rect'](),ob0.cy['rect']());
					return Math.sqrt(Math.pow((practice * Math.cos(near0.angle - theta)),2) + Math.pow((near0.pad + near1.pad),2));
				},
				'polygon': function(ob0,ob1){
					return calculate[ob1.kind][ob0.kind](ob1,ob0);
				}
			},
			'polygon':{
				'circle': function(ob0,ob1){
				},
				'rect': function(ob0,ob1){
				},
				'polygon': function(ob0,ob1){
				}
			}
		}

	function Close(ob0,cx1,cy1){		
		cy0 = ob0.cy[ob0.kind]();
		cx0 = ob0.cx[ob0.kind]();
		i = 0;
		var max = ob0.max;
		ob0.bounds.forEach(function(bound) {
    		angle = bound.angle
    		var x = max * Math.sin(angle);
    		var y = max * Math.cos(angle);
    		normal = Math.sqrt(Math.pow(cy0 + y - cy1,2) + Math.pow(cx0 + x - cx1,2))

			if (!i) best = normal + 1;
			// if another < practice 
			// resolve from center to corner of 2 best bounds
			if (normal < best){
				best = normal
				which = i;
			}
			i++;
		});

		//return bound with smallest hypotenuse
		return ob0.bounds[which];
	}

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
		this.rotation = 0;
		this.bounds = [];
		this.cy ={
			'circle': function(){
				return self.y;
			},
			'rect': function(){
				return self.y + self.dom.height.baseVal.value/2;			
			},
			'polygon': function(){
			}
		}
		this.cx ={
			'circle': function(){
				return self.x;
			},
			'rect': function(){
				return self.x + self.dom.width.baseVal.value/2;			
			},
			'polygon': function(){
			}
		}

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
				padw = self.dom.width.baseVal.value/2;
				padh = self.dom.height.baseVal.value/2;
				self.bounds[0] = new bound(padw,Math.PI/2); //right
				self.bounds[1] = new bound(padh,0); //top
				self.bounds[2] = new bound(padw,(3*Math.PI)/2); //left
				self.bounds[3] = new bound(padh,Math.PI); //bottom
				if(padw>padh)
					self.max=padw;
				else
					self.max=padh;
				self.type = $(self.dom).data("type");
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
					//New Bounds
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
	var scale = 1;
	var polygons = 0;
	var running = true;
	var g = -9.81 * scale;
	var fps = 1000/50;
	var Objects = []
	var friction = 0.01 * scale;
	var elasticity = 0.8;
	var number = 0;
	var tempnumber;
	var main;
	var theta;
	var practice;
	var deltax;
	var deltay;

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
				Objects[main].vy = -10 * scale; //up
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

function resolve(){
	if(Objects[tempnumber2].type != "static"){
		Objects[tempnumber2].vy -= deltay/fps;
		Objects[tempnumber2].vx -= deltax/fps;
	}else{
		Objects[tempnumber].x -= deltax;
		Objects[tempnumber].y -= deltay;
	}
}

function examine(ob0,ob1){
	deltay = (ob0.cy[ob0.kind]()-ob1.cy[ob1.kind]());
	deltax = (ob0.cx[ob0.kind]()-ob1.cx[ob1.kind]());
	theta = Math.atan(deltay/deltax);
	practice = Math.sqrt(Math.pow(deltay,2) + Math.pow(deltax,2));
	theory = calculate[ob0.kind][ob1.kind](ob0,ob1);
	//alert(theory+','+practice);

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
				resolve();
		
		}while(tempnumber2--)
		// So I heard these Whiles were faster

		/*
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
			$('#wrapper').load('index2.html #vectors', function(){
				start();
			});
			//Kill old loop
			running = false;		
	  	}*/

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