/**
 * @brief MyLinearAnimation
 * @param graph graph of the Animation
 * @constructor
 */
function MyLinearAnimation(graph, controlPoints, velocity) {
	MyAnimation.call(this, graph);
	this.graph = graph;
	this.lastTime = 0;
	this.controlPoints = controlPoints.slice();
	this.velocity = velocity;
    this.state = 1; //state = 1 : objeto partiu do ponto 1; state = 2 : objeto ja chegou ao ponto 2 => mudar direcao; ...
    this.maxState = controlPoints.length - 1;
    this.currAng = 0;
	this.calculateAng(this.controlPoints[this.state - 1], this.controlPoints[this.state]);
	this.dist;
	this.calculateDist(this.controlPoints[this.state - 1], this.controlPoints[this.state]);
    this.temp = this.dist/this.velocity * 1000;
    this.deltaTemp = 0;
    this.deltaDist = this.velocity * (this.deltaTemp/1000);

    this.isOver = 0;
};

MyLinearAnimation.prototype= Object.create(MyAnimation.prototype);
MyLinearAnimation.prototype.constructor = MyLinearAnimation;

MyLinearAnimation.prototype.clone = function() {
    return new MyLinearAnimation(this.graph, this.controlPoints, this.velocity);
}

MyLinearAnimation.prototype.calculateDist = function (point1, point2) {
    this.dist = Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2) + Math.pow(point1[2] - point2[2], 2));

}
MyLinearAnimation.prototype.calculateAng = function(point1, point2) {
    var vec = [(point2[0] - point1[0]), -(point2[2] - point1[2])];
	var vecDist = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));
	this.currAng = Math.acos(vec[0]/vecDist);
}

MyLinearAnimation.prototype.updateCurrAng = function(deltaTemp) {
    this.deltaTemp += deltaTemp;//interrupcao a cada 0.01 segundos
    this.deltaDist = this.velocity * (this.deltaTemp/1000);
    if((this.state <= this.maxState)) {
        if(this.deltaTemp >= this.temp) {//fim de uma linha reta
            this.state++;
            if(this.state > this.maxState) {
                this.isOver = 1;
            } else {
                this.calculateAng(this.controlPoints[this.state - 1], this.controlPoints[this.state]);
                this.calculateDist(this.controlPoints[this.state - 1], this.controlPoints[this.state]);
                this.temp = this.dist/this.velocity * 1000;
                this.deltaTemp = 0;
            }
        }
	}
}

MyLinearAnimation.prototype.getMatrix = function(currTime) {
    if(this.isOver) {
        return null;
    }
    var deltaTemp = 0;
    if(this.lastTime == 0) {
        this.lastTime = currTime;
    } else {
        deltaTemp = currTime - this.lastTime;
        this.lastTime = currTime;
    }
    this.updateCurrAng(deltaTemp);
    if(this.isOver) {
        return null;
    }

	var resultMatrix;
    resultMatrix=mat4.create();
    mat4.identity(resultMatrix);

	var vec = [(this.controlPoints[this.state][0] - this.controlPoints[this.state - 1][0]),
        		(this.controlPoints[this.state][1] - this.controlPoints[this.state - 1][1]),
        		(this.controlPoints[this.state][2] - this.controlPoints[this.state - 1][2])];
	var vecDist = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2) + Math.pow(vec[2], 2));
	var delta = vecDist/this.deltaDist;

	vec[0] /= delta;
    vec[1] /= delta;
    vec[2] /= delta;
    resultMatrix = mat4.translate(resultMatrix, resultMatrix, vec);
    resultMatrix = mat4.translate(resultMatrix, resultMatrix, this.controlPoints[this.state - 1]);
    resultMatrix = mat4.rotateY(resultMatrix, resultMatrix, this.currAng);

    return resultMatrix;
}