
function MyTriangle(scene,p1,p2,p3) {
	CGFobject.call(this,scene);

	this.scene=scene;
	this.p1=p1;
	this.p2=p2;
	this.p3=p3;

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

	/*
	ver slide "Calculo de coordenadas de mapeamento de texturas em triângulos"
	 */
    var a = Math.sqrt((this.p3[0] - this.p2[0]) * (this.p3[0] - this.p2[0]) +
        (this.p3[1] - this.p2[1]) * (this.p3[1] - this.p2[1]) +
        (this.p3[2] - this.p2[2]) * (this.p3[2] - this.p2[2]));

    var b = Math.sqrt((this.p1[0] - this.p3[0]) * (this.p1[0] - this.p3[0]) +
        (this.p1[1] - this.p3[1]) * (this.p1[1] - this.p3[1]) +
        (this.p1[2] - this.p3[2]) * (this.p1[2] - this.p3[2]));

    var c = Math.sqrt((this.p2[0] - this.p1[0]) * (this.p2[0] - this.p1[0]) +
        (this.p2[1] - this.p1[1]) * (this.p2[1] - this.p1[1]) +
        (this.p2[2] - this.p1[2]) * (this.p2[2] - this.p1[2]));

    var cosBeta = (Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(c, 2)) / (2 * a * c);

    var beta = Math.acos(cosBeta);

    this.texCoords = [
        0, 1,                                        //  ---------> s
        c, 1,                                       //   |
        c - a * cosBeta, 1 - (a * Math.sin(beta))   //   |
    ];                                             //   \/
	                                               //    t
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyTriangle.prototype.setAmplifFactor = function (afS, afT) {
	//TODO
	this.texCoords[0]=0;
	this.texCoords[1]=0;
	this.texCoords[2]=(Math.hypot(this.p1[0]-this.p2[0],this.p1[1]-this.p2[1],this.p1[2]-this.p2[2]))/afS;
	this.texCoords[3]=0;
	this.texCoords[4]=(this.x_top-this.x_bottom)/afS;
	this.texCoords[5]=(this.y_top-this.y_bottom)/afT;
	this.updateTexCoordsGLBuffers();
};