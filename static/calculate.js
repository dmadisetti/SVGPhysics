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
			near0 = Close(ob0,ob1.x,ob1.y);
			return Math.sqrt(Math.pow((practice * Math.cos(near0.angle - theta)),2) + Math.pow((near0.pad + ob1.r),2));
		},
		'rect': function(ob0,ob1){
			near0 = Close(ob0,ob1.cx(),ob1.cy());
			near1 = Close(ob1,ob0.cx(),ob0.cy());
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
	cy0 = ob0.cy();
	cx0 = ob0.cx();
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