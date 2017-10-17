
/**
 * MySphere
 * @constructor
 */
function MySphere(scene, radius, slices, stacks) {
    CGFobject.call(this, scene);

    this.slices = slices;
    this.stacks = stacks;
    this.radius = radius;

    this.initBuffers();
};

MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.constructor = MySphere;

MySphere.prototype.initBuffers = function() {

    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.texCoords = [];

    var lonAng = (2 * Math.PI) / this.slices; // 0-360 deg -- longitude
    var latAng = (Math.PI) / this.stacks; // 0-180 deg -- latitude
    var numVertex = 0;


    for (var i = 0; i <= this.slices; i++) {
        for (var j = 0; j <= this.stacks; j++) {

            var x = Math.cos(lonAng * i) * Math.sin(latAng * j);
            var y = Math.sin(lonAng * i) * Math.sin(latAng * j);
            var z = Math.cos(latAng * j);

            this.vertices.push(this.radius * x, this.radius * y, this.radius * z);
            numVertex++;

            this.normals.push(x, y, z);

            if (i > 0 && j > 0) {
                this.indices.push(numVertex - this.stacks - 1, numVertex - 1, numVertex - this.stacks - 2);
                this.indices.push(numVertex - 1, numVertex - 2, numVertex - this.stacks - 2);
            }

            this.texCoords.push(0.5 * x + 0.5, 0.5 - 0.5 * y);
        }

    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};