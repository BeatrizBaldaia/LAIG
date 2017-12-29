/**
 * @brief MyComboAnimation
 * @param graph graph of the Animation
 * @param xmlelem LSX
 * @constructor
 */
function MyComboAnimation(graph, animationsSet) {
	MyAnimation.call(this, graph);
	this.graph = graph;
	this.animationsSet = animationsSet;
	this.timePerAnimation = [];
	this.calculateTimePerAnimation();
};

MyComboAnimation.prototype= Object.create(MyAnimation.prototype);
MyComboAnimation.prototype.constructor = MyComboAnimation;

MyComboAnimation.prototype.calculateTimePerAnimation = function() {
	for(let i = 0; i < this.animationsSet.length; i++) {
        this.timePerAnimation.push(this.graph.animations[this.animationsSet[i]].getAnimationTime());
	}
}

MyComboAnimation.prototype.verifyState = function(deltaTime) {
    var aux = this.timePerAnimation[0];
    for(let i = 1; i <= this.timePerAnimation.length; i++) {
        if(deltaTime >= aux) {
            aux += this.timePerAnimation[i];
        } else {
            return i;
        }
    }
    if(deltaTime > aux) {//fim de todas as animacoes
        return 0;
    } else {
    	return this.timePerAnimation.length;//na ultima animacao
	}
}
MyComboAnimation.prototype.getMatrix = function(initialTime, currTime) {
	var deltaTime = currTime - initialTime;
	var state = this.verifyState(deltaTime);
	if(state == 0) {
		return null;
	} else {
		let newInitialTime = initialTime;
		for(let i = 1; i < state; i++) {
			newInitialTime += this.timePerAnimation[i - 1];
		}
        var resultMatrix = this.graph.animations[this.animationsSet[state - 1]].getMatrix(newInitialTime, currTime);
        return resultMatrix;
	}
}
MyComboAnimation.prototype.getLastMatrix = function() {
	var resultMatrix = this.graph.animations[this.animationsSet[this.animationsSet.length-1]].getLastMatrix();
  return resultMatrix;
}
