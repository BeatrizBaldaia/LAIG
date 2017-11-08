/**
 * @brief MyLinearAnimation
 * @param graph graph of the Animation
 * @constructor
 */
function MyLinearAnimation(graph, controlPoints, velocity) {
	MyAnimation.call(this, graph);
	this.lastTime = 0;
	this.controlPoints = controlPoints.slice();
	this.velocity = velocity;
    this.state = 1; //state = 1 : objeto partiu do ponto 1; state = 2 : objeto ja chegou ao ponto 2 => mudar direcao; ...
    this.maxState = controlPoints.length - 1;
    this.currAng = 0;
	this.calculateAng(this.controlPoints[this.state - 1], this.controlPoints[this.state]);
	this.dist;
	this.calculateDist(this.controlPoints[this.state - 1], this.controlPoints[this.state]);
	this.temp = this.dist/this.velocity;
    this.deltaTemp = 0;
    this.deltaDist = this.velocity * this.deltaTemp;
};

MyLinearAnimation.prototype= Object.create(MyAnimation.prototype);
MyLinearAnimation.prototype.constructor = MyLinearAnimation;

MyLinearAnimation.prototype.calculateDist = function (point1, point2) {
    this.dist = Math.sqrt(Math.pow(point1[0] - point2[0]) + Math.pow(point1[1] - point2[1]) + Math.pow(point1[2] - point2[2]));
}
MyLinearAnimation.prototype.calculateAng = function(point1, point2) {
	var vec = [(point2[0] - point1[0]), -(point2[2] - point1[2])];
	var vecDist = Math.sqrt(Math.pow(vec[0]) + Math.pow(vec[1]));
	this.currAng = Math.acos(vec[0]/vecDist);
}

MyLinearAnimation.prototype.updateCurrAng = function(deltaTemp) {
	this.deltaTemp += deltaTemp;//interrupcao a cada 0.01 segundos
    this.deltaDist = this.velocity * this.deltaTemp;
	if(this.state <= this.maxState) {
        if(this.deltaTemp >= this.temp) {//fim de uma linha reta
            this.state++;
            this.calculateAng(this.controlPoints[this.state - 1], this.controlPoints[this.state]);
            this.calculateDist(this.controlPoints[this.state - 1], this.controlPoints[this.state]);
            this.temp = this.dist/this.velocity;
            this.deltaTemp = 0;
        }
	} else {
		console.log("Linear animation is over");
		this.state = 0;
	}
}

MyLinearAnimation.prototype.getMatrix = function(currTime) {
    var deltaTemp = 0;
    if(this.lastTime == 0) {
        this.lastTime = currTime;
    } else {
        deltaTemp = currTime - this.lastTime;
        this.lastTime = currTime;
    }
	this.updateCurrAng(deltaTemp);
	if(this.state == 0) {
	    return null;
    }
    var rotMatrixAux;
	var rotMatrix;
    var transMatrixAux;
	var transMatrix;
	var resultMatrix;

    rotMatrixAux = mat4.create();
    mat4.identity(rotMatrixAux);
    rotMatrix = mat4.create();
    mat4.identity(rotMatrix);
    transMatrix=mat4.create();
    mat4.identity(transMatrix);
    transMatrixAux=mat4.create();
    mat4.identity(transMatrixAux);
    resultMatrix=mat4.create();
    mat4.identity(resultMatrix);

	var vec = [(this.controlPoints[this.state][0] - this.controlPoints[this.state - 1][0]),
        		(this.controlPoints[this.state][1] - this.controlPoints[this.state - 1][1]),
        		(this.controlPoints[this.state][2] - this.controlPoints[this.state - 1][2])];
	var vecDist = Math.sqrt(Math.pow(vec[0]) + Math.pow(vec[1]) + Math.pow(vec[2]));
	var delta = vecDist/this.deltaDist;
	vec[0] /= delta;
    vec[1] /= delta;
    vec[2] /= delta;

	mat4.rotateY(rotMatrixAux, this.currAng, rotMatrix);
    mat4.translate(transMatrixAux, vec, transMatrix);

    mat4.multiply(transMatrix, rotMatrix, resultMatrix);
	return resultMatrix;
}