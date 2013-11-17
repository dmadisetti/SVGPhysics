var calculate = {
	'circle':{
		'circle': function(ob,ob1){
			dx = ob1.cx()-ob.cx();
			dy = ob1.cy()-ob.cy();
			offset = 2*ob.r + ob1.r - Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
			if(offset>0) resolve(ob,ob1,{'bound':{'angle':Math.atan(dy/dx)},'offset':-offset});
		},
		'rect': function(ob,ob1){
			return calculate['rect']['circle'](ob1,ob);
		},
		'polygon': function(ob,ob1){
			return calculate['polygon']['circle'](ob1,ob);
		}
	},
	'rect':{
		'circle': function(ob,ob1){
			close(ob,ob1).forEach(function(side) {
				console.log('weird');
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
	, end = false;
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
		if(ob1.type == 'circle') yPrime -= ob1.r;
		// since closed circut 
		// all bounds must be violated
		if (yPrime > 0) end = true;
		// Hold on to these values
		yPrimes[i] = yPrime;
		i++;
	});
	if(end) return;
	i = 0;
	x = ob.cx(true)-ob1.cx(true);
	y = ob.cy(true)-ob1.cy(true);
	// Let's do it for the old guys
	ob.bounds.forEach(function(bound) {
		// Rotate and pad
		yPrime = x*Math.sin(bound.angle) + y*Math.cos(bound.angle);
		yPrime -= bound.pad;
		// if circle we're checking
		// against edge and not vertice
		if(ob1.type == 'circle') yPrime -= ob1.r;
		// Where was the violation change?
		if (yPrime) ruleBreakers[ruleBreakers.length] = {'bound':bound,'offset':yPrimes[i]};
		i++;
	});
	console.log(ruleBreakers);
	debugger;
	//return bound with smallest hypotenuse
	return ruleBreakers;
}

function resolve(ob,ob1,side){
	var theta = side.bound.angle + Math.PI
	, x = Math.cos(theta) * -side.offset
	, y = Math.sin(theta) * -side.offset
	, vx = x/fps
	, vy = y/fps
	, split = (ob.type == "static" || ob.type == "static")
	? 1
	: ob1.mass/(ob.mass+ob1.mass);
	if(ob.type != "static"){
		ob.x -= x * split;
		ob.y -= y * split;
		ob.vx -= vx * split;
		ob.vy -= vy * split;
		// Only applies if 2 movables
		split = 1 - split;
	}
	if(ob1.type != "static"){
		ob1.x -= x * split;
		ob1.y -= y * split;
		ob1.vx -= vx * split;
		ob1.vy -= vy * split;
	}
}
