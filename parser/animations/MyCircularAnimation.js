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
	this.time = this.angleRotate/this.angularVelocity;

};

MyCircularAnimation.prototype= Object.create(MyAnimation.prototype);
MyCircularAnimation.prototype.constructor = MyCircularAnimation;

MyCircularAnimation.prototype.getAnimationTime = function() {
    return this.time;
}

MyCircularAnimation.prototype.getMatrix = function(initialTime, currTime) {
    var temp = currTime - initialTime;

	let alfa = this.angleInicial + temp * this.angularVelocity;
	if(alfa > (this.angleInicial+this.angleRotate)) {
		return null;
	}

	let aux = mat4.create();
    mat4.identity(aux);

    aux = mat4.translate(aux, aux, this.center);
    aux = mat4.rotate(aux, aux, alfa, [0,1,0]);
    aux = mat4.translate(aux, aux, [this.radius,0,0]);
  	aux = mat4.rotate(aux, aux, Math.PI, [0,1,0]);

	return aux;

}
MyCircularAnimation.prototype.getLastMatrix = function() {
	let alfa = (this.angleInicial+this.angleRotate)
	let aux = mat4.create();
    mat4.identity(aux);

    aux = mat4.translate(aux, aux, this.center);
    aux = mat4.rotate(aux, aux, alfa, [0,1,0]);
    aux = mat4.translate(aux, aux, [this.radius,0,0]);
  	aux = mat4.rotate(aux, aux, Math.PI, [0,1,0]);

	return aux;

}
