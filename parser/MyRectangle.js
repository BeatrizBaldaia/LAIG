
function MyRectangle(scene,x_bottom,y_top,x_top,y_bottom) {
	CGFobject.call(this,scene);
	
	this.x_bottom=x_bottom;
	this.y_top=y_top;
	this.x_top=x_top;
	this.y_bottom=y_bottom;

	this.initBuffers();
};



MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor=MyRectangle;

MyRectangle.prototype.initBuffers = function () {
	this.vertices = [
            this.x_top, this.y_top, 0,
            this.x_bottom, this.y_top, 0,
            this.x_bottom, this.y_bottom, 0,
            this.x_top, this.y_bottom, 0
			];

	this.indices = [
            0, 1, 2, 
			2, 3, 0
        ];
	this.normals = [
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1
	];


	this.texCoords = [
		1,0,
		0,0,
		0,1,
		1,1
	];

	this.texCoordsCopy = this.texCoords.slice();
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyRectangle.prototype.setAmplifFactor = function (afS, afT) {

    var size = this.texCoords.length;
    var i = 0;
    while(i < size) {
        if(i % 2 == 0) {
            this.texCoords[i] = this.texCoordsCopy[i]/afS;
        } else {
            this.texCoords[i] = this.texCoordsCopy[i]/afT;
        }
        i++;
    }

	this.updateTexCoordsGLBuffers();
};
