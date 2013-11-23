Shape =  function(){}
Shape.prototype.init = function(el){	
	this.dom = el;
	this.kind = el.tagName;
	for(attribute in el.dataset) this[attribute] = el.dataset[attribute];
	this._init(el);
}
Shape.prototype.jump = true;
Shape.prototype.x = 0;
Shape.prototype.y = 0;
Shape.prototype.type = '';
Shape.prototype.vx = 0;
Shape.prototype.vy = 0;
Shape.prototype.frame = 0;
Shape.prototype.dom = '';
Shape.prototype.mass = 1;
Shape.prototype.kind = '';
Shape.prototype.friction = 0.1;
Shape.prototype.elasticity = 0.5;
Shape.prototype.rotation = 0;
Shape.prototype.bounds = [];
Shape.prototype.points = [];
Shape.prototype._init = function(){error("Init must be overriden")};
Shape.prototype.cy = function(){error("cy must be overriden")};
Shape.prototype.cx = function(){error("cx must be overriden")};
Shape.prototype.move = function(){error("Move must be overriden")};

var Circle = function(){}
Circle.prototype = new Shape();
Circle.prototype._init = function(el){
	this.y = this.dom.cy.baseVal.value;
	this.py = this.y;
	this.x = this.dom.cx.baseVal.value;
	this.px = this.x;
	this.r = this.dom.r.baseVal.value;
}
Circle.prototype.cy = function(){
	return this.y;
}
Circle.prototype.cx = function(){
	return this.x;
}
Circle.prototype.pcy = function(){
	return this.py;
}
Circle.prototype.pcx = function(){
	return this.px;
}
Circle.prototype.move = function(){
	this.dom.setAttribute('cx',this.x);
	this.dom.setAttribute('cy',this.y);
}

var Rect = function(){}
Rect.prototype = new Shape();
Rect.prototype._init = function(el){
	this.x = this.dom.x.baseVal.value;
	this.px = this.x;
	this.y = this.dom.y.baseVal.value;
	this.py = this.y;
	padw = this.dom.width.baseVal.value/2;
	padh = this.dom.height.baseVal.value/2;
	this.bounds[0] = new Bound(padw,-Math.PI/2); //right
	this.bounds[1] = new Bound(padh,0); //top
	this.bounds[2] = new Bound(padw,(3*Math.PI)/2); //left
	this.bounds[3] = new Bound(padh,Math.PI); //bottom
	this.points[0] = new Point(0,0,this);
	this.points[1] = new Point(padw * 2,0,this);
	this.points[2] = new Point(0,padh * 2,this);
	this.points[3] = new Point(padw * 2,padh * 2,this);
	this.type = this.dom.dataset.type;
}
Rect.prototype.cy = function(){
	return this.y + this.dom.height.baseVal.value/2;			
}
Rect.prototype.cx = function(){
	return this.x + this.dom.width.baseVal.value/2;			
}
Rect.prototype.pcy = function(){
	return this.py + this.dom.height.baseVal.value/2;			
}
Rect.prototype.pcx = function(){
	return this.px + this.dom.width.baseVal.value/2;			
}
Rect.prototype.move = function(){
	this.dom.setAttribute('x',this.x);
	this.dom.setAttribute('y',this.y);			
}



var assignShape = function(el){
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
var polygon = new Shape();
polygon.init = function(){
	i = this.dom.points.numberOfItems;
	if (i <= 2) error('Require at least 3 points for Polygon');
	i--;
	ii = i;
	polygon = Shapes.pop().dom;
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

Point = function(x,y,self){
	this.x = x;
	this.y = y;
	this.py = y;
	this.px = x;
	this.self = self;
}
Point.prototype.cy = function(){
	return this.self.y + this.y;
}
Point.prototype.cx = function(){
	return this.self.x + this.x;	
}
Point.prototype.pcy = function(){
	return this.self.py + this.y;
}
Point.prototype.pcx = function(){
	return this.self.px + this.x;
}