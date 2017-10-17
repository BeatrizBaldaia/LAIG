/**
 * MyCylinder
 * @constructor
 */
function MyCylinder(scene, heigth, bottomRadius, topRadius, stacks, slices, topCap, bottomCap) {
    CGFobject.call(this,scene);

    this.heigth = heigth;
    this.bottomRadius = bottomRadius;
    this.topRadius = topRadius;
    this.topCap = topCap;
    this.bottomCap = bottomCap;
    this.slices = slices;
    this.stacks = stacks;
    this.deltaT = 1 / stacks;
    this.deltaS = 1 / slices;

    this.cap = new MyCircle(scene,this.slices);

    this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {

    this.normals = [];
    this.indices = [];
    this.vertices = [];
    this.texCoords = [];

    var index = 0;
    var radiusInc = (this.topRadius - this.bottomRadius)/this.stacks;//incremento a dar ao raio
    var radius = this.bottomRadius;
    var tTex = 1; //valor maximo no eixo t //TODO
    for(i = 0; i < this.stacks; i++) {
        var ang = 0;
        var sTex = 0;//valor minimo no eixo s
        for (ang; ang < (2*Math.PI); ang+=2*Math.PI/this.slices) {
            this.vertices.push(radius * Math.cos(ang), radius * Math.sin(ang), this.heigth * i/this.stacks);
            this.vertices.push((radius + radiusInc) * Math.cos(ang+(2*Math.PI)/this.slices), (radius + radiusInc) * Math.sin(ang+(2*Math.PI)/this.slices), this.heigth * (i+1)/this.stacks);//ponto da proxima stack
            this.vertices.push((radius + radiusInc) * Math.cos(ang), (radius + radiusInc) * Math.sin(ang), this.heigth * (i+1)/this.stacks);//ponto da proxim stack
            this.vertices.push(radius * Math.cos(ang+(2*Math.PI)/this.slices), radius * Math.sin(ang+(2*Math.PI)/this.slices), this.heigth * i/this.stacks);

            this.texCoords.push(sTex, tTex);
            this.texCoords.push(sTex+this.deltaS, tTex-this.deltaT);//TODO
            this.texCoords.push(sTex, tTex-this.deltaT);
            this.texCoords.push(sTex+this.deltaS, tTex);

            sTex += this.deltaS;

            this.normals.push(Math.cos(ang), Math.sin(ang), 0);
            this.normals.push(Math.cos(ang+2*Math.PI/this.slices), Math.sin(ang+2*Math.PI/this.slices), 0);
            this.normals.push(Math.cos(ang), Math.sin(ang), 0);
            this.normals.push(Math.cos(ang+2*Math.PI/this.slices), Math.sin(ang+2*Math.PI/this.slices), 0);

            this.indices.push(index);
            this.indices.push(index+1);
            this.indices.push(index+2);
            this.indices.push(index);
            this.indices.push(index+3);
            this.indices.push(index+1);
            index +=4;
        }
        radius += radiusInc;
        tTex -= this.deltaT;
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

MyCylinder.prototype.display= function() {
    CGFobject.prototype.display.call(this);
    if(this.topCap == 1){
        this.scene.pushMatrix();
        this.scene.scale(this.topRadius,this.topRadius,1);
        this.scene.translate(0,0,this.heigth);
        this.cap.display();
        this.scene.popMatrix();
    }
    if(this.bottomCap==1){
        this.scene.pushMatrix();
        this.scene.scale(this.bottomRadius,this.bottomRadius,1);
        this.scene.rotate(Math.PI,1,0,0);
        this.cap.display();
        this.scene.popMatrix();
    }
};