//TODO NAO ESTA COMO NA ESPECIFICACAO
//TODO Tampas
var degToRad = Math.PI / 180.0;
/**
 * MyCylinder
 * @constructor
 */
 function MyCylinder(scene, heigth, bottomRadius,topRadius, section, part) {
 	CGFobject.call(this,scene);

	this.heigth=heigth;
	this.topRadius=topRadius;
	this.slices = part;
	this.stacks = section;
	this.bottomRadius=bottomRadius;
 	this.initBuffers();

 };

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

 MyCylinder.prototype.initBuffers = function() {

		var andares = this.stacks;
		var lados = this.slices;
		var divisions = (2*Math.PI)/lados;
		
		var raio=1;
		var alturaStack=this.heigth/andares;
		var altura=0;
		//var incRaio=(bottomRadius-topRadius)

		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];


		for (var j = 0; j <= andares; j++){

			raio=this.bottomRadius
				+(this.topRadius-this.bottomRadius)*(altura)/this.heigth;
			altura=altura+alturaStack;
			for(var i = 0; i < lados; i++){

				//vertices
				this.vertices.push(raio*Math.cos(i*divisions));
				this.vertices.push(raio*Math.sin(i*divisions));
				this.vertices.push(this.heigth*j/andares);
				//normais
				this.normals.push(Math.cos(i*divisions));
				this.normals.push(Math.sin(i*divisions));
				this.normals.push(0);

				this.texCoords.push(i / lados, 1 - j / andares);

				if (j < andares) 
             {
                 if (i == lados - 1) 
                 {
                     this.indices.push(0 + i + lados * j);
                     this.indices.push(1 + i + lados * (j - 1));
                     this.indices.push(1 + i + lados * (j));
                     
                     this.indices.push(1 + i + lados * (j));
                     this.indices.push(0 + i + lados * (j + 1));
                     this.indices.push(0 + i + lados * j);
                 } 
                 else 
                 {
                     this.indices.push(0 + i + lados * j);
                     this.indices.push(1 + i + lados * j);
                     this.indices.push(1 + i + lados * (j + 1));
                     
                     this.indices.push(1 + i + lados * (j + 1));
                     this.indices.push(0 + i + lados * (j + 1));
                     this.indices.push(0 + i + lados * j);
                 }
			}
		}
		}
		

		this.primitiveType = this.scene.gl.TRIANGLES;
 		this.initGLBuffers();
 };
