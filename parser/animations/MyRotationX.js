function MyRotationX(graph, ang) {
    MyAnimation.call(this, graph);

    this.graph = graph;
    this.ang = ang*Math.PI/180;

    this.time = 1.5;

};

MyRotationX.prototype= Object.create(MyAnimation.prototype);
MyRotationX.prototype.constructor = MyRotationX;

MyRotationX.prototype.getAnimationTime = function() {
    return this.time;
}

MyRotationX.prototype.getMatrix = function(initialTime, currTime) {
    var temp = currTime - initialTime;

    let alfa = (this.ang * temp)/(1.5/0.001);
    // if(temp >= (1.5/0.001)) {
    if(Math.abs(alfa) >= Math.abs(this.ang)) {
        console.log("acabou animacao");
        return null;
    }

    let aux = mat4.create();
    mat4.identity(aux);

    aux = mat4.rotate(aux, aux, alfa, [1,0,0]);

    return aux;

}