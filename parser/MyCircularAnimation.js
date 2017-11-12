/**
 * @brief MyCircularAnimation
 * @param graph graph of the Animation
 * @param xmlelem LSX
 * @constructor
 */
function MyCircularAnimation(graph, linearVelocity, x,y,z, radius, angleInicial, angleRotate) {
	MyAnimation.call(this, graph);

	this.graph = graph;
	this.center = [x,y,z];
	this.radius = radius;
	this.angleInicial = angleInicial * DEGREE_TO_RAD;
	this.angleRotate = angleRotate * DEGREE_TO_RAD;
	this.linearVelocity = linearVelocity*0.001;
	this.angularVelocity = this.linearVelocity/this.radius;

	this.isOver = 0;

};

MyCircularAnimation.prototype= Object.create(MyAnimation.prototype);
MyCircularAnimation.prototype.constructor = MyCircularAnimation;

MyCircularAnimation.prototype.clone = function() {
	return new MyCircularAnimation(this.graph, this.linearVelocity/0.001, this.center[0], this.center[1], this.center[2], this.radius, this.angleInicial/DEGREE_TO_RAD, this.angleRotate/DEGREE_TO_RAD);
}

MyCircularAnimation.prototype.getMatrix = function(currTime) {
	if(this.isOver) {
		return null;
	}
	if(this.initialTime == undefined){
		this.initialTime = currTime;
	}
	let deltaT = currTime - this.initialTime;
	let alfa = this.angleInicial + deltaT * this.angularVelocity;
	if(alfa > (this.angleInicial+this.angleRotate)) {
		this.isOver = 1;
		return null
	}

	let aux = mat4.create();
    mat4.identity(aux);
 /*
    aux = mat4.translate(aux, aux, this.center);
    aux = mat4.rotate(aux, aux, alfa, [0,1,0]);
    aux = mat4.translate(aux, aux, [this.radius,0,0]);
    aux = mat4.rotate(aux, aux, Math.PI/2, [0,1,0]);
*/


    aux = mat4.translate(aux, aux, this.center);
    aux = mat4.rotateY(aux, aux, alfa);
    aux = mat4.translate(aux, aux, [this.radius,0,0]);

	return aux;

}