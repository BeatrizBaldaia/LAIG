
function MyRectangle(scene,x_top,y_top,x_bottom,y_bottom) {
	CGFobject.call(this,scene);
/*
	this.x_top=x_top;
	this.y_top=y_top;
	this.x_bottom=x_bottom;
	this.y_bottom=y_bottom;
*/
	this.x_bottom=x_top;
	this.y_top=y_top;
	this.x_top=x_bottom;
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
	
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyRectangle.prototype.setAmplifFactor = function (afS, afT) {


	/*this.texCoords[0]=(this.x_top-this.x_bottom)/afS;
	this.texCoords[5]=(this.y_top-this.y_bottom)/afT;
	this.texCoords[2]=0;
	this.texCoords[7]=(this.y_top-this.y_bottom)/afT;
	this.texCoords[4]=0;
	this.texCoords[1]=0;
	this.texCoords[6]=(this.x_top-this.x_bottom)/afS;
	this.texCoords[3]=0;*/

    var size = this.texCoords.length;
    var i = 0;
    while(i < size) {
        if(i % 2 == 0) {
            this.texCoords[i] = this.texCoords[i]/afS;
        } else {
            this.texCoords[i] = this.texCoords[i]/afT;
        }
        i++;
    }

	this.updateTexCoordsGLBuffers();
};
