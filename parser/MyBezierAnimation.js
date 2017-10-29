/**
 * @brief MyBezierAnimation
 * @param graph graph of the Animation
 * @param xmlelem LSX
 * @constructor
 */
function MyBezierAnimation(graph, xmlelem) {
	MyAnimation.call(this, graph, xmlelem);

	/*P1, P2, P3, P4= {(0,0,0), (1,0,0), (1,1,0), (0,1,0)}
Velocidade = 10 unidades/segundo*/
	this.p1=p1;
	this.p2=p2;
	this.p3=p3;
	this.p4=p4;
	this.velocity=velocity;
};

MyBezierAnimation.prototype= Object.create(MyAnimation.prototype);
MyBezierAnimation.prototype.constructor = MyBezierAnimation;

MyBezierAnimation.prototype.getMatrix = function(currTime) {
	return null;
}