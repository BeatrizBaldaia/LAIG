var degToRad = Math.PI / 180.0;
function MyCircle(scene ,slices) {
	CGFobject.call(this,scene);
	this.slices=slices;
	this.initBuffers();
};

MyCircle.prototype = Object.create(CGFobject.prototype);
MyCircle.prototype.constructor=MyCircle;

MyCircle.prototype.initBuffers = function() {
		var divisions = 2*Math.PI/this.slices;

		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		this.vertices.push(0,0,0);
		this.normals.push(0,0,1);
		this.texCoords.push(.5,.5);
		for(var i = 0; i <= this.slices; i++){
			//vertices
			this.vertices.push(Math.cos(i*divisions), Math.sin(i*divisions),0);
			//normais
			this.normals.push(0,0,1);
			//TextCoords
			this.texCoords.push(0.5 + 0.5 * Math.cos(i*divisions),0.5 + 0.5 * Math.sin(i*divisions));

		}
		for(var i = 0; i < this.slices; i++){
			this.indices.push(0,i,i+1);
		}
		this.indices.push(0,this.slices,1);

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
}