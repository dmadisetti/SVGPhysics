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
	this.elasticity = 0.5;
	this.rotation = 0;
	this.bounds = [];
	this.types = {
		'circle': function(){
			self.kind = 'circle';
			self.y = self.dom.cy.baseVal.value;
			self.x = self.dom.cx.baseVal.value;
			self.r = self.dom.r.baseVal.value;
			self.cx = self.cx['circle'];
			self.cy = self.cy['circle'];
			self.move = self.move['circle'];
			self.type = $(self.dom).data("type");
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
			self.cx = self.cx['rect'];
			self.cy = self.cy['rect'];
			self.move = self.move['rect'];
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
			self.cx = self.cx['polygon'];
			self.cy = self.cy['polygon'];
			self.move = self.move['polygon'];
		}
	}
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
}

var bound =	function(pad,theta){
	this.angle = theta;
	this.pad = pad;
}