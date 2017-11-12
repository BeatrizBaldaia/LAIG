/**
 * @brief MyBezierAnimation
 * @param graph graph of the Animation
 * @param p1 point 1
 * @param p2 point 2
 * @param p3 point 3
 * @param p4 point 4
 * @param velocity velocity unit/second
 * @constructor
 */
function MyBezierAnimation(graph, p1, p2, p3, p4, velocity) {
	MyAnimation.call(this, graph);
	this.graph = graph;
	this.p1 = p1;
	this.p2 = p2;
	this.p3 = p3;
	this.p4 = p4;
	this.velocity = velocity * 0.001;

	this.isOver = 0;

	let distance = casteljau(this);

	this.time = distance/this.velocity;
};

MyBezierAnimation.prototype= Object.create(MyAnimation.prototype);
MyBezierAnimation.prototype.constructor = MyBezierAnimation;

MyBezierAnimation.prototype.clone = function() {
	return new MyBezierAnimation(this.graph, this.p1, this.p2, this.p3, this.p4, this.velocity/0.001);
}

MyBezierAnimation.prototype.getMatrix = function(currTime) {
	if(this.isOver) {
		return null;
	}
	if(this.initialTime == undefined){
		this.initialTime = currTime;
	}
	let deltaT = currTime - this.initialTime;
	let s = deltaT/this.time;
	if(s > 1) {
		this.isOver = 1;
		return null;
	}
	let deri = this.Q_(s);
	let alfa = Math.atan(deri[1]/deri[0]);

	let trans_vec = [0,0,0]
	trans_vec = vec3.add(trans_vec, this.p1, this.Q(s));
	let res = mat4.create();
    mat4.identity(res);
	res = mat4.rotate(res, res, alfa, [0,1,0]);
	res = mat4.translate(res, res, trans_vec);
	return res;
}

function casteljau(obj){
	let distance = 0;
	let p12 = [0, 0, 0];
	for (let i = 0; i < 3; i++) {
		p12[i] = ((obj.p2[i] - obj.p1[i]) / 2) + obj.p1[i];
	}
	let p23 = [0,0,0];
		for (let i = 0; i < 3; i++) {
		p23[i] = ((obj.p3[i] - obj.p2[i]) / 2) + obj.p2[i];
	}
	let p34 = [0,0,0];
	for (let i = 0; i < 3; i++) {
		p34[i] = ((obj.p4[i] - obj.p3[i]) / 2) + obj.p3[i];
	}
	let p123 = [0,0,0];
	for (let i = 0; i < 3; i++) {
		p123[i] = ((p23[i] - p12[i]) / 2) + p12[i];
	}
	let p234 = [0,0,0];
	for (let i = 0; i < 3; i++) {
		p234[i] = ((p34[i] - p23[i]) / 2) + p23[i];
	}

	distance = Math.hypot(p12[0]-obj.p1[0],p12[1]-obj.p1[1],p12[2]-obj.p1[2]) +
		Math.hypot(p123[0]-p12[0],p123[1]-p12[1],p123[2]-p12[2]) +
		Math.hypot(p234[0]-p123[0],p234[1]-p123[1],p234[2]-p123[2]) +
		Math.hypot(p34[0]-p234[0],p34[1]-p234[1],p34[2]-p234[2]) +
		Math.hypot(obj.p4[0]-p34[0],obj.p4[1]-p34[1],obj.p4[2]-p34[2]);
	return distance;
}
MyBezierAnimation.prototype.Q = function(s){
		let point = [0,0,0];
		for (let i = 0; i < 3; i++) {
			point[i] = Math.pow((1 - s), 3) * this.p1[i] +
				3 * s * Math.pow((1 - s), 2) * this.p2[i] +
				3 * Math.pow(s, 2) * (1 - s) * this.p3[i] +
				Math.pow(s, 3) * this.p4[i];
		}
		return point;
	}
MyBezierAnimation.prototype.Q_ = function(s){
		let res = [0,0,0];
		for (let i = 0; i < 3; i++) {
			res[i] = -3 * Math.pow((1 - s), 2) * this.p1[i] +
				(2 * Math.pow((1 - s), 2) - 6 * s * (1 - s)) * this.p2[i] +
				(6 * s * (1 - s) - 3 * Math.pow(s, 2)) * this.p3[i] +
				3 *  Math.pow(s, 2) * this.p4[i];
		}
		return res;
	}