
//TODO Tampas
var degToRad = Math.PI / 180.0;
/**
 * MyCylinder
 * @constructor
 */
 function MyCylinder(scene, heigth, bottomRadius,topRadius, section, part, tampa1, tampa2) {
 	CGFobject.call(this,scene);

	this.scene=scene;
	this.heigth=heigth;
	this.topRadius=topRadius;
	this.slices = part;
	this.stacks = section;
	this.bottomRadius=bottomRadius;
	this.tampa1 = tampa1;
	this.tampa2 = tampa2;
	this.tampa = new MyCircle(scene,this.slices);
 	this.initBuffers();

 };

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

 MyCylinder.prototype.initBuffers = function() {

		var stacksAux = this.stacks;
		var slicesAux = this.slices;
		var divisions = (2*Math.PI)/slicesAux;//angulo de cada slice
		
		var radius =1;
		var stacksHeigth=this.heigth/stacksAux;
		var curHeigth =0;


		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		for (var j = 0; j <= stacksAux; j++){

			radius =this.bottomRadius
				+(this.topRadius-this.bottomRadius)*(curHeigth )/this.heigth;
			curHeigth =curHeigth +stacksHeigth;
			for(var i = 0; i < slicesAux; i++){

				//vertices
				this.vertices.push(radius *Math.cos(i*divisions));
				this.vertices.push(radius *Math.sin(i*divisions));
				this.vertices.push(this.heigth*j/stacksAux);//this.heigth*j/stacksAux = altura atual
				//normais
				this.normals.push(Math.cos(i*divisions));
				this.normals.push(Math.sin(i*divisions));
				this.normals.push(0);

				this.texCoords.push(i / slicesAux, 1 - j / stacksAux);

				if (j < stacksAux)
                {
					 if (i == (slicesAux - 1))
					 {

						 this.indices.push(0 + i + slicesAux * j);
						 this.indices.push(1 + i + slicesAux * (j - 1));
						 this.indices.push(1 + i + slicesAux * (j));

						 this.indices.push(1 + i + slicesAux * (j));
						 this.indices.push(0 + i + slicesAux * (j + 1));
						 this.indices.push(0 + i + slicesAux * j);
					 } 
					 else 
					 {
						 this.indices.push(0 + i + slicesAux * j);
						 this.indices.push(1 + i + slicesAux * j);
						 this.indices.push(1 + i + slicesAux * (j + 1));

						 this.indices.push(1 + i + slicesAux * (j + 1));
						 this.indices.push(0 + i + slicesAux * (j + 1));
						 this.indices.push(0 + i + slicesAux * j);
					 }
			    }
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
 		this.initGLBuffers();
 };
MyCylinder.prototype.display= function() {
		CGFobject.prototype.display.call(this);
		if(this.tampa1==1){
			this.scene.pushMatrix();
			 	this.scene.scale(this.topRadius,this.topRadius,1);
			 	this.scene.translate(0,0,this.heigth);
				this.tampa.display();
			this.scene.popMatrix();
		}
		if(this.tampa2==1){
			this.scene.pushMatrix();
				this.scene.scale(this.bottomRadius,this.bottomRadius,1);
			 	this.scene.rotate(Math.PI,1,0,0);
				this.tampa.display();
			this.scene.popMatrix();
		}
};