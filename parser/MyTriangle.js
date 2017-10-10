
function MyTriangle(scene,p1,p2,p3) {
	CGFobject.call(this,scene);

	this.p1=p1;
	this.p2=p2;
	this.p3=p3;

	//console.log("IS NAN="+isNaN(this.p1[0]));

	this.initBuffers();
};



MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

MyTriangle.prototype.initBuffers = function () {
	this.vertices = [
            this.p1[0],this.p1[1],this.p1[2],
            this.p2[0],this.p2[1],this.p2[2],
            this.p3[0],this.p3[1],this.p3[2]
            ];

	this.indices = [
            0, 1, 2
        ];

     //TODO as normals estao mal
	this.normals = [
		0, 0, 1,
		0, 0, 1,
		0, 0, 1
	];

	this.texCoords = [
		0,1,//
		1,1,//
		0,0
	];
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyRectangle.prototype.setAmplifFactor = function (afS, afT) {
    var size = this.texCoords.length;
    var i = 0;
    while(i < 0) {
        if(i % 2 == 0) {
            this.texCoords[i] /= afS;
        } else {
            this.texCoords[i] /= afT;
        }
        i++;
    }
};
