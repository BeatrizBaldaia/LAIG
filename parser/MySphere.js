var degToRad = Math.PI / 180.0;
/**
 * MySphere
 * @constructor
 */
 function MySphere(scene, radius, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.radius = radius;
	this.slices = slices;
	this.stacks = stacks;
 	
 	this.initBuffers();
 };

 MySphere.prototype = Object.create(CGFobject.prototype);
 MySphere.prototype.constructor = MySphere;

 MySphere.prototype.initBuffers = function() {

		var divisions = 2*Math.PI/this.slices;

		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		for (var j = 0; j <= this.stacks; j++){
			var diff = (Math.PI/2)/this.stacks;
			for(var i = 0; i < this.slices; i++){

				var x = Math.cos(divisions*i)*Math.cos(Math.asin(j/this.stacks));
				var y = Math.sin(divisions*i)*Math.cos(Math.asin(j/this.stacks));

				//vertices
				this.vertices.push(this.radius*Math.cos(i*divisions)*Math.cos(j*diff), this.radius*Math.sin(i*divisions)*Math.cos(j*diff),this.radius*Math.sin(j*diff));
				//normais
				this.normals.push(Math.cos(i*divisions)*Math.cos(j*diff), Math.sin(i*divisions)*Math.cos(j*diff), 0);


				this.texCoords.push(0.5*x + 0.5, 0.5-0.5*y);
			}
		}
		
		//indices
		for(var j = 0; j < this.stacks; j++){
			for(var i = 0; i < this.slices; i++)
			{
				this.indices.push(this.slices*j+i,this.slices*j+i+1,this.slices*(j+1)+i);
				if (i != (this.slices - 1)) {
					this.indices.push(this.slices*(j+1)+i+1,this.slices*(j+1)+i,this.slices*j+i+1);
				}
				else {
					this.indices.push(this.slices*j,this.slices*j+i+1,this.slices*j+i);
				}

			}

		}
		
		var numberOfVertices=this.vertices.length/3;
		
		//PARTE DE BAIXO
		for (var j = 0; j <= this.stacks; j++){
			var diff = (Math.PI/2)/this.stacks;
			for(var i = 0; i < this.slices; i++){

				var x = Math.cos(divisions*i)*Math.cos(Math.asin(j/this.stacks));
 				var y = Math.sin(divisions*i)*Math.cos(Math.asin(j/this.stacks));

				//vertices
				this.vertices.push(this.radius*Math.cos(i*divisions)*Math.cos(j*diff), this.radius*Math.sin(i*divisions)*Math.cos(j*diff), -this.radius*Math.sin(j*diff));
				//normais
				this.normals.push(Math.cos(i*divisions)*Math.cos(j*diff), Math.sin(i*divisions)*Math.cos(j*diff), 0);


				this.texCoords.push(0.5*x + 0.5, 0.5-0.5*y);
			}
		}
		
		//indices
		for(var j = 0; j < this.stacks; j++){
			for(var i = 0; i < this.slices; i++)
			{
				this.indices.push(numberOfVertices+this.slices*j+i,numberOfVertices+this.slices*(j+1)+i,numberOfVertices+this.slices*j+i+1);
				if (i != (this.slices - 1)) {
					this.indices.push(numberOfVertices+this.slices*(j+1)+i+1,numberOfVertices+this.slices*j+i+1,numberOfVertices+this.slices*(j+1)+i);
				}
				else {
					this.indices.push(numberOfVertices+this.slices*j,numberOfVertices+this.slices*j+i,numberOfVertices+this.slices*j+i+1);
				}

			}

		}

		this.primitiveType = this.scene.gl.TRIANGLES;
 		this.initGLBuffers();
	
 	
 };
