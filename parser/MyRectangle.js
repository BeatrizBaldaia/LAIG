
function MyRectangle(scene,x_top,y_top,x_bottom,y_bottom) {
	CGFobject.call(this,scene);

	this.x_top=x_top;
	this.y_top=y_top;
	this.x_bottom=x_bottom;
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
            0, 2, 1, 
			3, 2, 0
        ];
	this.normals = [
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1
	];


	this.texCoords = [
		0,1,
		1,1,
		0,0,
		1,0
	];
	
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyRectangle.prototype.setAmplifFactor = function (afS, afT) {
	var size = this.texCoords.length;
	var i = 0;
	//TODO what
	while(i < size) {
		if(i % 2 == 0) {
			this.texCoords[i] = afS;
		} else {
            this.texCoords[i] = afT;
		}
		i++;
	}
	/*while(i < size) {
		if(i % 2 == 0) {
			this.texCoords[i] /= afS;
		} else {
            this.texCoords[i] /= afT;
		}
		i++;
	}*/
	
	this.updateTexCoordsGLBuffers();
};
