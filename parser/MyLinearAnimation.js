/**
 * @brief MyLinearAnimation
 * @param graph graph of the Animation
 * @constructor
 */
function MyLinearAnimation(graph, controlPoints, velocity) {
	MyAnimation.call(this, graph);
	this.graph = graph;
	this.controlPoints = controlPoints.slice();
	this.velocity = velocity * 0.001;

    //
    this.timesPerLine = [];
    this.time = 0;
    this.calculateTimes();
};

MyLinearAnimation.prototype= Object.create(MyAnimation.prototype);
MyLinearAnimation.prototype.constructor = MyLinearAnimation;


MyLinearAnimation.prototype.calculateTimes = function() {
    for(let i = 0; i < this.controlPoints.length - 1; i++) {
        this.timesPerLine.push(this.calculateDist(this.controlPoints[i], this.controlPoints[i + 1])/this.velocity);
        this.time += this.timesPerLine[i];
    }
}

MyLinearAnimation.prototype.getAnimationTime = function() {
    return this.time;
}

MyLinearAnimation.prototype.verifyState = function(timeACC) {
    var state = 1;
    var aux = this.timesPerLine[0];
    for(let i = 1; i < this.timesPerLine.length; i++) {
        if(timeACC >= aux) {
            aux += this.timesPerLine[i];
        } else {
            return i;
        }
    }

    if(timeACC > aux) {//fim da animacao
        return 0;
    } else {
        return this.timesPerLine.length;//na ultima linha
    }
}

MyLinearAnimation.prototype.calculateDist = function (point1, point2) {
    var dist = Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2) + Math.pow(point1[2] - point2[2], 2));
    return dist;
}
MyLinearAnimation.prototype.calculateAng = function(point1, point2) {
    var vec = [(point2[0] - point1[0]), -(point2[2] - point1[2])];
	var vecDist = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));
	var currAng = Math.acos(vec[0]/vecDist);
    currAng += Math.PI/2;
    return currAng;
}

MyLinearAnimation.prototype.getDeltaTime = function(temp, state) {
    var delta = temp;
    for(let i = 0; i < (state - 1); i++) {
        delta -= this.timesPerLine[i];
    }
    return delta;
}

MyLinearAnimation.prototype.getMatrix = function(initialTime, currTime) {
    var temp = currTime - initialTime;
    var state = this.verifyState(temp);
    if(state == 0) {
        return null;
    }

    var ang = this.calculateAng(this.controlPoints[state - 1], this.controlPoints[state]);
    var deltaTime = this.getDeltaTime(temp, state);

	var resultMatrix;
    resultMatrix=mat4.create();
    mat4.identity(resultMatrix);

    var vec = [(this.controlPoints[state][0] - this.controlPoints[state - 1][0]),
        (this.controlPoints[state][1] - this.controlPoints[state - 1][1]),
        (this.controlPoints[state][2] - this.controlPoints[state - 1][2])];
	var vecDist = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2) + Math.pow(vec[2], 2));
	var deltaDist = this.velocity * (deltaTime)
	var delta = deltaDist/vecDist;

	vec[0] *= delta;
    vec[1] *= delta;
    vec[2] *= delta;
    resultMatrix = mat4.translate(resultMatrix, resultMatrix, vec);
    resultMatrix = mat4.translate(resultMatrix, resultMatrix, this.controlPoints[state - 1]);
    resultMatrix = mat4.rotateY(resultMatrix, resultMatrix, ang);

    return resultMatrix;
}