/**
 * @brief MyLinearAnimation
 * @param graph graph of the Animation
 * @param xmlelem LSX
 * @constructor
 */
function MyLinearAnimation(graph, xmlelem) {
	MyAnimation.call(this, graph, xmlelem);

	
};

MyLinearAnimation.prototype= Object.create(MyAnimation.prototype);
MyLinearAnimation.prototype.constructor = MyLinearAnimation;

MyLinearAnimation.prototype.getMatrix = function(currTime) {
	return null;
}