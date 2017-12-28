function MyRotationY(graph, ang) {
    MyAnimation.call(this, graph);

    this.graph = graph;
    this.ang = ang*Math.PI/180;

    this.time = 1.5;

};

MyRotationY.prototype= Object.create(MyAnimation.prototype);
MyRotationY.prototype.constructor = MyRotationY;

MyRotationY.prototype.getAnimationTime = function() {
    return this.time;
}

MyRotationY.prototype.getMatrix = function(initialTime, currTime) {
    var temp = currTime - initialTime;

    let alfa = (this.ang * temp)/(1.5/0.001);
    if(Math.abs(alfa) >= Math.abs(this.ang)) {
        console.log("acabou animacao");
        return null;
    }

    let aux = mat4.create();
    mat4.identity(aux);

    aux = mat4.rotate(aux, aux, alfa, [0,1,0]);

    return aux;

}