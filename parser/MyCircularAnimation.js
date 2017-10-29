/**
 * @brief MyCircularAnimation
 * @param graph graph of the Animation
 * @param xmlelem LSX
 * @constructor
 */
function MyCircularAnimation(graph, xmlelem) {
	MyAnimation.call(this, graph, xmlelem);
	/*Exemplo:
Centro = (10, 10, 10)
Raio = 5
Ângulo Inicial = 40º
Ângulo de rotação = 20º
Velocidade = 10 unidades/segundo*/
	this.center[3]=[x,y,z];
	this.radius = radius;
	this.angleInicial = angleInicial;
	this.angleRotate = angleRotate;
	this.linearVelocity = linearVelocity;
	this.angularVelocity = this.linearVelocity/this.radius;//TODO float

};

MyCircularAnimation.prototype= Object.create(MyAnimation.prototype);
MyCircularAnimation.prototype.constructor = MyCircularAnimation;

MyCircularAnimation.prototype.getMatrix = function(currTime) {
	var aux = mat4.create();
    mat4.identity(aux);
//http://glmatrix.net/docs/module-mat4.html
    mat4.translate(aux,[]);
	//TODO put center in 0 0 0
	//TODO rotate
	//TODO put center in place
	return null;
}