/**
 * @brief MyComboAnimation
 * @param graph graph of the Animation
 * @param xmlelem LSX
 * @constructor
 */
function MyComboAnimation(graph, xmlelem) {
	MyAnimation.call(this, graph, xmlelem);

	
};

MyComboAnimation.prototype= Object.create(MyAnimation.prototype);
MyComboAnimation.prototype.constructor = MyComboAnimation;

MyComboAnimation.prototype.getMatrix = function(currTime) {
	return null;
}