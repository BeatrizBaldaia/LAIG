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

		var andares = this.stacks;
		var lados = this.slices;
		var divisions = 2*Math.PI/lados;

		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		for (var j = 0; j <= andares; j++){
			var diff = (Math.PI/2)/andares;
			for(var i = 0; i < lados; i++){

				var x = Math.cos(divisions*i)*Math.cos(Math.asin(j/andares));
				var y = Math.sin(divisions*i)*Math.cos(Math.asin(j/andares));

				//vertices
				this.vertices.push(this.radius*Math.cos(i*divisions)*Math.cos(j*diff), this.radius*Math.sin(i*divisions)*Math.cos(j*diff),this.radius*Math.sin(j*diff));
				//normais
				this.normals.push(Math.cos(i*divisions)*Math.cos(j*diff), Math.sin(i*divisions)*Math.cos(j*diff), 0);


				this.texCoords.push(0.5*x + 0.5, 0.5-0.5*y);
			}
		}
		
		//indices
		for(var j = 0; j < andares; j++){
			for(var i = 0; i < lados; i++)
			{
				this.indices.push(lados*j+i,lados*j+i+1,lados*(j+1)+i);
				if (i != (lados - 1)) {
					this.indices.push(lados*(j+1)+i+1,lados*(j+1)+i,lados*j+i+1);
				}
				else {
					this.indices.push(lados*j,lados*j+i+1,lados*j+i);
				}

			}

		}
		
		var numberOfVertices=this.vertices.length/3;
		
		//PARTE DE BAIXO
		for (var j = 0; j <= andares; j++){
			var diff = (Math.PI/2)/andares;
			for(var i = 0; i < lados; i++){

				var x = Math.cos(divisions*i)*Math.cos(Math.asin(j/andares));
 				var y = Math.sin(divisions*i)*Math.cos(Math.asin(j/andares));

				//vertices
				this.vertices.push(this.radius*Math.cos(i*divisions)*Math.cos(j*diff), this.radius*Math.sin(i*divisions)*Math.cos(j*diff), -this.radius*Math.sin(j*diff));
				//normais
				this.normals.push(Math.cos(i*divisions)*Math.cos(j*diff), Math.sin(i*divisions)*Math.cos(j*diff), 0);


				this.texCoords.push(0.5*x + 0.5, 0.5-0.5*y);
			}
		}
		
		//indices
		for(var j = 0; j < andares; j++){
			for(var i = 0; i < lados; i++)
			{
				this.indices.push(numberOfVertices+lados*j+i,numberOfVertices+lados*(j+1)+i,numberOfVertices+lados*j+i+1);
				if (i != (lados - 1)) {
					this.indices.push(numberOfVertices+lados*(j+1)+i+1,numberOfVertices+lados*j+i+1,numberOfVertices+lados*(j+1)+i);
				}
				else {
					this.indices.push(numberOfVertices+lados*j,numberOfVertices+lados*j+i,numberOfVertices+lados*j+i+1);
				}

			}

		}

		this.primitiveType = this.scene.gl.TRIANGLES;
 		this.initGLBuffers();
	
 	
 };
