function MyTranslationZ(graph, dist) {
    MyAnimation.call(this, graph);

    this.graph = graph;
    this.dist = dist;

    this.time = 1.5;

};

MyTranslationZ.prototype= Object.create(MyAnimation.prototype);
MyTranslationZ.prototype.constructor = MyTranslationZ;

MyTranslationZ.prototype.getAnimationTime = function() {
    return this.time;
}

MyTranslationZ.prototype.getMatrix = function(initialTime, currTime) {
    var temp = currTime - initialTime;

    let deltaDist = (this.dist * temp)/(1.5/0.001);
    if(temp >= (1.5/0.001)) {
        console.log("acabou animacao");
        return null;
    }

    let aux = mat4.create();
    mat4.identity(aux);

    aux = mat4.translate(aux, aux, [0,0,deltaDist]);

    return aux;

}