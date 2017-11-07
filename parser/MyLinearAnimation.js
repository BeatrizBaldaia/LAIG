/**
 * @brief MyLinearAnimation
 * @param graph graph of the Animation
 * @param xmlelem LSX
 * @constructor
 */
function MyLinearAnimation(graph, xmlelem, controlPoints, velocity) {
	MyAnimation.call(this, graph, xmlelem);
	this.controlPoints = controlPoints.slice();
	this.velocity = velocity;
    this.state = 1; //state = 1 : objeto partiu do ponto 1; state = 2 : objeto ja chegou ao ponto 2 => mudar direcao; ...
    this.maxState = controlPoints.length - 1;
    this.currAng = 0;
	this.calculateAng(this.controlPoints[state - 1], this.controlPoints[state]);
	this.dist;
	this.calculateDist(this.controlPoints[state - 1], this.controlPoints[state]);
	this.temp = this.dist/this.velocity;
    this.deltaTemp = 0;
    this.deltaDist = this.velocity * 0.01;
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

MyLinearAnimation.prototype.updateCurrAng = function(currTime) {
	this.deltaTemp += 0.01;//interrupcao a cada 0.01 segundos
	if(this.state <= this.maxState) {
        if(this.deltaTemp >= this.temp) {//fim de uma linha reta
            state++;
            this.calculateAng(this.controlPoints[state - 1], this.controlPoints[state]);
            this.calculateDist(this.controlPoints[state - 1], this.controlPoints[state]);
            this.temp = this.dist/this.velocity;
            this.deltaTemp = 0;
        }
	} else {
		console.log("Linear animation is over");
	}
}

MyLinearAnimation.prototype.getMatrix = function(currTime) {
	this.updateCurrAng(currTime);
    var rotMatrixAux;
	var rotMatrix;
    var transMatrixAux;
	var transMatrix;
	var resultMatrix;

    mat4.create(rotMatrixAux);
    mat4.identity(rotMatrixAux);
    mat4.create(rotMatrix);
    mat4.identity(rotMatrix);
    mat4.create(transMatrix);
    mat4.identity(transMatrix);
    mat4.create(transMatrixAux);
    mat4.identity(transMatrixAux);
    mat4.create(resultMatrix);
    mat4.identity(resultMatrix);

	var vec = [(this.controlPoints[state][0] - this.controlPoints[state - 1][0]),
        		(this.controlPoints[state][1] - this.controlPoints[state - 1][1]),
        		(this.controlPoints[state][2] - this.controlPoints[state - 1][2])];
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