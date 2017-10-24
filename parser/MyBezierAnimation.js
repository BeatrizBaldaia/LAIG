/**
 * @brief MyBezierAnimation
 * @param graph graph of the Animation
 * @param xmlelem LSX
 * @constructor
 */
function MyBezierAnimation(graph, xmlelem) {
	MyAnimation.call(this, graph, xmlelem);

	
};

MyBezierAnimation.prototype= Object.create(MyAnimation.prototype);
MyBezierAnimation.prototype.constructor = MyBezierAnimation;