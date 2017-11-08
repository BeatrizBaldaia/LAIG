/**
 * @brief MyCircularAnimation
 * @param graph graph of the Animation
 * @param xmlelem LSX
 * @constructor
 */
function MyCircularAnimation(graph, linearVelocity, x,y,z, radius, angleInicial, angleRotate) {
	MyAnimation.call(this, graph);
	
	this.center = [x,y,z];
	this.radius = radius;
	this.angleInicial = angleInicial;
	this.angleRotate = angleRotate;
	this.linearVelocity = linearVelocity*1000;
	this.angularVelocity = this.linearVelocity/this.radius;

};

MyCircularAnimation.prototype= Object.create(MyAnimation.prototype);
MyCircularAnimation.prototype.constructor = MyCircularAnimation;

MyCircularAnimation.prototype.getMatrix = function(currTime) {
	var aux = mat4.create();
    mat4.identity(aux);
//http://glmatrix.net/docs/module-mat4.html
    //mat4.translate(aux,[]);
	//TODO put center in 0 0 0
	//TODO rotate
	//TODO put center in place
	return aux;
}