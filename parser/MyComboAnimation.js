/**
 * @brief MyComboAnimation
 * @param graph graph of the Animation
 * @param xmlelem LSX
 * @constructor
 */
function MyComboAnimation(graph, animationsSet) {
	MyAnimation.call(this, graph);
	this.animationsSet = animationsSet;
	this.lastAnimation = animationsSet.length - 1;
	this.currAnimation = 0;
	this.isOver = 0;
	console.log("this.animationsSet length = "+ animationsSet.length);
};

MyComboAnimation.prototype= Object.create(MyAnimation.prototype);
MyComboAnimation.prototype.constructor = MyComboAnimation;

MyComboAnimation.prototype.clone = function() {
	return null;
}
MyComboAnimation.prototype.getMatrix = function(currTime) {
	if(this.isOver) {
		return null;
	}
	console.log("no getMatrix");
	var resultMatrix = this.animationsSet[this.currAnimation].getMatrix(currTime);
	if(resultMatrix == null) {//acabou uma animacao
		if(this.currAnimation == this.lastAnimation) {//acabaram todas as animacoes
			this.isOver = 1;
			return null;
		}
		this.currAnimation++;
		return this.animationsSet[this.currAnimation].getMatrix(currTime);
	} else {
		return resultMatrix;
	}
}