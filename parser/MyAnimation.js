/**
 * @brief MyAnimation
 * @param graph graph of the Animation
 * @param xmlelem LSX
 * @constructor
 */
function MyAnimation(graph) {
	this.graph = graph;
};

MyAnimation.prototype.getMatrix = function(currTime) {
	return new MyAnimation(this.graph);
}

MyAnimation.prototype.getMatrix = function(currTime) {
	alert("Shouldn't be here, error in animation!");
	return null;
}



