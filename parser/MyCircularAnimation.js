/**
 * @brief MyCircularAnimation
 * @param graph graph of the Animation
 * @param xmlelem LSX
 * @constructor
 */
function MyCircularAnimation(graph, xmlelem) {
	MyAnimation.call(this, graph, xmlelem);

	
};

MyCircularAnimation.prototype= Object.create(MyAnimation.prototype);
MyCircularAnimation.prototype.constructor = MyCircularAnimation;