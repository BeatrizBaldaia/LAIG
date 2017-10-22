/**
 * @brief MyTriangle
 * @param scene scene of the triangle
 * @param p1 coordinates of point 1 
 * @param p2 coordinates of point 2
 * @param p3 coordinates of point 3
 * @constructor
 */
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
/**
 * @brief MyTriangle init buffers
 */
MyTriangle.prototype.initBuffers = function () {
	this.vertices = [
            this.p1[0],this.p1[1],this.p1[2],
            this.p2[0],this.p2[1],this.p2[2],
            this.p3[0],this.p3[1],this.p3[2]
            ];

	this.indices = [
            0, 1, 2
        ];

	this.normals = [
		0, 0, 1,
		0, 0, 1,
		0, 0, 1
	];

	/*
	ver slide "Calculo de coordenadas de mapeamento de texturas em triângulos"
	 */
    this.a = Math.hypot((this.p3[0] - this.p2[0]),(this.p3[1] - this.p2[1]),(this.p3[2] - this.p2[2]));
    this.b = Math.hypot((this.p1[0] - this.p3[0]),(this.p1[1] - this.p3[1]),(this.p1[2] - this.p3[2]));
    this.c = Math.hypot((this.p2[0] - this.p1[0]),(this.p2[1] - this.p1[1]),(this.p2[2] - this.p1[2]));

    this.cosBeta = (Math.pow(this.a, 2) - Math.pow(this.b, 2) + Math.pow(this.c, 2)) / (2 * this.a * this.c);

    this.beta = Math.acos(this.cosBeta);

    this.texCoords = [
    	this.c - this.a * this.cosBeta, 1 - (this.a * Math.sin(this.beta)),
        0, 1,
        this.c, 1
    ];

	this.primitiveType=this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
/**
 * @brief Sets the amplification factors on triangles
 * @param afS amplification factor in the S coordenate
 * @param afT amplification factor in the T coordenate
 */
MyTriangle.prototype.setAmplifFactor = function (afS, afT) {

	this.texCoords[0]=(this.c - this.a * this.cosBeta)/afS;
	this.texCoords[1]=afT - (this.a * Math.sin(this.beta))/afT;
	this.texCoords[2]=0;
	this.texCoords[3]=afT;
	this.texCoords[4]=this.c/afS;
	this.texCoords[5]=afT;

    this.updateTexCoordsGLBuffers();
};