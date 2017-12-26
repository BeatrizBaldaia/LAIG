/**
 * MyLamp
 * @constructor
 */
function MyLamp(scene, slices, stacks) {//
    CGFobject.call(this,scene);

    this.slices = slices;
    this.stacks = stacks;
//
    this.initBuffers();
};

MyLamp.prototype = Object.create(CGFobject.prototype);
MyLamp.prototype.constructor = MyLamp;

MyLamp.prototype.initBuffers = function() {

    this.normals = [];
    this.indices = [];
    this.vertices = [];
    this.texCoords = [];
    var index = 0;

    var tTex = 1;
    for(i = 0; i < this.stacks; i++) {
        var sTex = 0;
        for (let ang=0; ang < (2*Math.PI); ang+=2*Math.PI/this.slices) {
            var currRadius = Math.sqrt(1-(i/this.slices)*(i/this.slices));
            var nextRadius = Math.sqrt(1-((i+1)/this.slices)*((i+1)/this.slices));
            this.vertices.push(currRadius*Math.cos(ang), currRadius*Math.sin(ang), i/this.stacks);
            this.vertices.push(nextRadius*Math.cos(ang+(2*Math.PI)/this.slices), nextRadius*Math.sin(ang+(2*Math.PI)/this.slices), (i+1)/this.stacks);
            this.vertices.push(nextRadius*Math.cos(ang), nextRadius*Math.sin(ang), (i+1)/this.stacks);
            this.vertices.push(currRadius*Math.cos(ang+(2*Math.PI)/this.slices), currRadius*Math.sin(ang+(2*Math.PI)/this.slices), i/this.stacks);
//
            this.texCoords.push(sTex, tTex);
            this.texCoords.push(sTex+1/ this.stacks, tTex-1/ this.stacks);
            this.texCoords.push(sTex, tTex-1/ this.stacks);
            this.texCoords.push(sTex+1/ this.stacks, tTex);

            sTex += 1/ this.stacks;
//
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

        tTex -= 1/ this.stacks;//
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

