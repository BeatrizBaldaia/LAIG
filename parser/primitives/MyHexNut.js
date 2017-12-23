/* @param scene scene of the circle
* @param slices number of parts of the circle
* @constructor
*/
function MyHexNut(scene ,slices, radius) {
    CGFobject.call(this,scene);
    this.slices=slices;
    this.radius = radius;
    this.initPoints = [[radius, 0, 0], [radius*Math.sqrt(2)/2, 0, -radius*Math.sqrt(2)/2], [-radius*Math.sqrt(2)/2, 0, -radius*Math.sqrt(2)/2],
                        [-radius, 0, 0], [-radius*Math.sqrt(2)/2, 0, radius*Math.sqrt(2)/2], [radius*Math.sqrt(2)/2, 0, radius*Math.sqrt(2)/2]];
    this.vecs = [getDirectionVec(this.initPoints[0], this.initPoints[1]), getDirectionVec(this.initPoints[1], this.initPoints[2]),
                getDirectionVec(this.initPoints[2], this.initPoints[3]), getDirectionVec(this.initPoints[3], this.initPoints[4]),
                getDirectionVec(this.initPoints[4], this.initPoints[5]), getDirectionVec(this.initPoints[5], this.initPoints[0])];
    this.deltaAng = 0;
    this.angs = [Math.PI/4, Math.PI/2, Math.PI/4, Math.PI/4, Math.PI/2, Math.PI/4];
    this.angIndex = 0;

    //FACES
    let d1 = distanceBetweenPoints(this.initPoints[0], this.initPoints[1]);
    let d2 = distanceBetweenPoints(this.initPoints[1], this.initPoints[2]);
    this.rect1 = new MyRectangle(scene, -d1/2, 1, d1/2, 0);
    this.rect2 = new MyRectangle(scene, -d2/2, 1, d2/2, 0);
    this.inside = new MyInsideCylinder(scene, 1, this.radius/2, this.radius/2, 200, 200, 0, 0);
    this.initBuffers();
};

MyHexNut.prototype = Object.create(CGFobject.prototype);
MyHexNut.prototype.constructor=MyHexNut;
/**
 * @brief MyHexNut init buffers
 */
MyHexNut.prototype.initBuffers = function() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    let index = 0;
    for(var i = 0; i < 2*Math.PI; i += 2*Math.PI/this.slices){
        if(this.deltaAng >= this.angs[this.angIndex] && this.angIndex < this.angs.length - 1) {
            this.angIndex++;
            this.deltaAng = 0;
        }
        //vertices
        this.vertices.push(this.radius/2*Math.cos(i), 0, -this.radius/2*Math.sin(i));

        let point1 = pointPlusVec(this.initPoints[this.angIndex], this.vecs[this.angIndex], this.deltaAng/this.angs[this.angIndex]);
        this.vertices.push(point1[0], point1[1], point1[2]);

        this.deltaAng += 2*Math.PI/this.slices;
        let point2 = pointPlusVec(this.initPoints[this.angIndex], this.vecs[this.angIndex], this.deltaAng/this.angs[this.angIndex]);
        this.vertices.push(point2[0], point2[1], point2[2]);
        this.vertices.push(this.radius/2*Math.cos(i+(2*Math.PI/this.slices)), 0, -this.radius/2*Math.sin(i+(2*Math.PI/this.slices)));
        //normais
        this.normals.push(0,0,1);
        this.normals.push(0,0,1);
        this.normals.push(0,0,1);
        this.normals.push(0,0,1);
        //TextCoords
        this.texCoords.push(0.5 + 0.25 * Math.cos(i),0.5 + -0.25 * Math.sin(i));
        this.texCoords.push(0.5 + (0.5/this.radius)*this.vertices[(index+1)*3],0.5 + (0.5/this.radius)*this.vertices[(index+1)*3+2]);
        this.texCoords.push(0.5 + (0.5/this.radius)*this.vertices[(index+2)*3],0.5 + (0.5/this.radius)*this.vertices[(index+2)*3+2]);
        this.texCoords.push(0.5 + 0.25 * Math.cos(i+(2*Math.PI/this.slices)),0.5 + -0.25 * Math.sin(i+(2*Math.PI/this.slices)));
        //indices
        this.indices.push(index, index+1, index+2);
        this.indices.push(index, index+2, index+3);
        index += 4;
    }

    this.primitiveType=this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}

MyHexNut.prototype.display= function() {
    let dist1 = distanceBetweenPoints([0, 0, 0], pointPlusVec(this.initPoints[0], this.vecs[0], 1/2));
    let ang1 = calculateRotY(this.vecs[0]);
    let dist2 = this.radius*Math.sin(Math.PI/4);
    this.scene.pushMatrix();
    this.scene.translate(0,1,0);
    CGFobject.prototype.display.call(this);
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI,1,0,0);
    CGFobject.prototype.display.call(this);
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(ang1,0,1,0);
    this.scene.translate(0,0,dist1);
    this.rect1.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI,0,1,0);
    this.scene.translate(0,0,dist2);
    this.rect2.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(2*Math.PI-ang1,0,1,0);
    this.scene.translate(0,0,dist1);
    this.rect1.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(ang1+Math.PI,0,1,0);
    this.scene.translate(0,0,dist1);
    this.rect1.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0,0,dist2);
    this.rect2.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI-ang1,0,1,0);
    this.scene.translate(0,0,dist1);
    this.rect1.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI/2,1,0,0);
    this.scene.scale(1,1,2.5);
    this.inside.display();
    this.scene.popMatrix();

}