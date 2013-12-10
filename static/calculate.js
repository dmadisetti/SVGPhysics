var calculate = {
	'circle':{
		'circle': function(ob,ob1){
			dx = ob1.cx()-ob.cx();
			dy = ob1.cy()-ob.cy();
			offset = ob.r + ob1.r - Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
			if(offset>0) resolve(ob,ob1,{'bound':{'angle':Math.atan(dx/dy)},'offset':-offset});
		},
		'rect': function(ob,ob1){
			close(ob1,ob).forEach(function(side) {
				resolve(ob,ob1,side);
			});
		},
		'polygon': function(ob,ob1){
			return calculate['polygon']['circle'](ob1,ob);
		}
	},
	'rect':{
		'circle': function(ob,ob1){
			close(ob,ob1).forEach(function(side) {
				resolve(ob,ob1,side);
			});
		},
		'rect': function(ob,ob1){
			ob.points.forEach(function(point) {
				close(ob1,point).forEach(function(side) {
					resolve(ob,ob1,side);
				});
			});
		},
		'polygon': function(ob,ob1){
			// return calculate['polygon']['rect'](ob1,ob);
		}
	},
	'polygon':{
		'circle': function(ob,ob1){
		},
		'rect': function(ob,ob1){
			ob.triangles.forEach(function(triangle) {
				triangle.points.forEach(function(point) {
					close(ob1,point).forEach(function(side) {
						resolve(ob,ob1,side);
					});
				});
			});
		},
		'polygon': function(ob,ob1){
			ob.triangles.forEach(function(triangle) {
				triangle.points.forEach(function(point) {
					ob1.triangles.forEach(function(triangle1) {
						triangle1.points.forEach(function(point1) {
							close(ob1,point).forEach(function(side) {
								resolve(ob,ob1,side);
							});
						});
					});
				});
			});
		}
	}
}

function close(ob,ob1){
	var yPrimes = []
	, ruleBreakers = []
	, end = false
	, i = 0
	// Set origin to center
	, x = ob.cx()-ob1.cx()
	, y = ob.cy()-ob1.cy();
	ob.bounds.forEach(function(bound) {
		// Rotate and pad
		yPrime = x*Math.sin(bound.angle) + y*Math.cos(bound.angle);
		yPrime -= bound.pad;
		// if circle we're checking
		// against edge and not vertice
		if(ob1.kind == 'circle') yPrime -= ob1.r;
		// since closed circut 
		// all bounds must be violated
		if (yPrime > 0) end = true;
		// Hold on to these values
		yPrimes[i] = yPrime;
		i++;
	});
	if(end) return [];
	i = 0;
	x = ob.pcx()-ob1.pcx();
	y = ob.pcy()-ob1.pcy();
	// Let's do it for the old guys
	ob.bounds.forEach(function(bound) {
		// Rotate and pad
		
		yPrime = x*Math.sin(bound.angle) + y*Math.cos(bound.angle);
		yPrime -= bound.pad;
		// if circle we're checking
		// against edge and not vertice
		if(ob1.type == 'circle') yPrime -= ob1.r;
		// Where was the violation change?
		if (yPrime >= 0) ruleBreakers[ruleBreakers.length] = {'bound':bound,'offset':yPrimes[i]};
		i++;
	});
	//return bound with smallest hypotenuse
	return ruleBreakers;
}

function resolve(ob,ob1,side){
	var theta = side.bound.angle
	, y = Math.cos(theta) * -side.offset
	, x = Math.sin(theta) * -side.offset
	, vx = x/fps
	, vy = y/fps
	, split = (ob.type == "static" || ob1.type == "static")
	? 1
	: ob1.mass/(ob.mass+ob1.mass);

	// Store offender so we can solve all at once
	ob.offenders[ob.offenders.length] = side;

	mu = ((y < 1 && y > -1) && split == 1) * g
	if(ob.type != "static"){
		// Resolve inequalities all together to prevent weirdness
		//ob.x -= x * split;
		//ob.y -= y * split;
		ob.vx -= vx * split;
		ob.vy -= vy * split;
		// Only applies if 2 movables
		split = 1 - split;

		/*
		// Apply teh friction
		friction = mu * ob.mass * ob1.friction;
		if (ob.vx > 3) ob.vx += friction;
		else if (ob.vx < -3)	ob.vx -= friction;
		*/
	}
	if(ob1.type != "static"){
		// Moving other objects just causes weirdness
		//ob1.x += x * split;
		//ob1.y += y * split;
		ob1.vx += vx * split;
		ob1.vy += vy * split;

		/*
		// Apply teh friction
		friction = mu * ob1.mass * ob.friction;
		if (ob1.vx > 3) ob1.vx += friction;
		else if (ob1.vx < -3)	ob1.vx -= friction;
		*/
	}
}

solve = function(){
	offending = object.offenders.length;
	switch(offending){
		case 1:
			var m0 = Math.tan(offending[0].bound.angle)
			, m1 = -1/Math.tan(offending[0].bound.angle)
			, x0 = 0
			, x1 = Math.sin(offending[0].bound.angle) * -offending[0].offset
			, y0 = 0
			, y1 = Math.cos(offending[1].bound.angle) * -offending[1].offset;
			break;
		default:
			var m0 = -1/Math.tan(offending[0].bound.angle)
			, m1 = -1/Math.tan(offending[1].bound.angle)
			, x0 = Math.sin(offending[0].bound.angle) * -offending[0].offset
			, x1 = Math.sin(offending[1].bound.angle) * -offending[1].offset
			, y0 = Math.cos(offending[0].bound.angle) * -offending[0].offset
			, y1 = Math.cos(offending[1].bound.angle) * -offending[1].offset;
			break;
	}
	var x = ((m1*x1+y1)-(m0*x0+y0))/(m0 - m1)
	, y = m0*x + m0*x0 + y0;
	object.x += x;
	object.y += y;
}