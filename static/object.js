Object =  function(){}
Object.prototype.init = function(el){	
	this.dom = el;
	this.kind = el.tagName;
	for(attibute in el.dataset) this[attibute] = el.dataset[attibute];
	this._init();
}
Object.prototype.jump = true;
Object.prototype.x = 0;
Object.prototype.y = 0;
Object.prototype.type = '';
Object.prototype.vx = 0;
Object.prototype.vy = 0;
Object.prototype.frame = 0;
Object.prototype.dom = '';
Object.prototype.mass = 1;
Object.prototype.kind = '';
Object.prototype.elasticity = 0.5;
Object.prototype.rotation = 0;
Object.prototype.bounds = [];
Object._init = function(){error("Init must be overriden")};
Object.cy = function(){error("cy must be overriden")};
Object.cx = function(){error("cx must be overriden")};
Object.move = function(){error("Move must be overriden")};

var Circle = function(){}
Circle.prototype = Object.prototype;
Circle._init = function(el){
	this.y = this.dom.cy.baseVal.value;
	this.x = this.dom.cx.baseVal.value;
	this.r = this.dom.r.baseVal.value;
}
Circle.cy = function(){
	return self.y;
}
Circle.cx = function(){
	return self.x;
}
Circle.move = function(){
	self.dom.setAttribute('cx',self.x);
	self.dom.setAttribute('cy',self.y);
}

var Rect = function(){}
Rect.prototype = Object.prototype;
Rect._init = function(el){
	this.x = self.dom.x.baseVal.value;
	this.y = self.dom.y.baseVal.value;
	padw = self.dom.width.baseVal.value/2;
	padh = self.dom.height.baseVal.value/2;
	this.bounds[0] = new Bound(padw,Math.PI/2); //right
	this.bounds[1] = new Bound(padh,0); //top
	this.bounds[2] = new Bound(padw,(3*Math.PI)/2); //left
	this.bounds[3] = new Bound(padh,Math.PI); //bottom
			if(padw>padh)
		this.max=padw;
			else
		this.max=padh;
	this.type = this.dom.dataset.type;
}
Rect.cy = function(){
	return self.y + self.dom.height.baseVal.value/2;			
}
Rect.cx = function(){
	return self.x + self.dom.width.baseVal.value/2;			
}
Rect.move = function(){
	self.dom.setAttribute('x',self.x);
	self.dom.setAttribute('y',self.y);			
}

var assignObject = function(el){
	var ob;
	switch(el.tagName){
		case 'circle':
			ob = new Circle();
			break;
		case 'rect':
			ob = new Rect();
			break;
		default:
			error('SVG Platform Engine only supports circle,rect and polygon tags.');
	}
	ob.init(el);
	return ob;
}

var Bound =	function(pad,theta){
	this.angle = theta;
	this.pad = pad;
}
/*
var polygon = new Object();
polygon.init = function(){
	i = self.dom.points.numberOfItems;
	if (i <= 2) error('Require at least 3 points for Polygon');
	i--;
	ii = i;
	polygon = Objects.pop().dom;
	while((i + 1)/3 >= 1){
		p1 = polygon.points.getItem(i);
		p2 = polygon.points.getItem(--i);
		p3 = polygon.points.getItem(--i);
		triangle(p1,p2,p3);
	}
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
*/