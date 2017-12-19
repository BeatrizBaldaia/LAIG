/**
 * @brief MyCrown
 * @param scene scene of the cylinder
 * @param heigth heigth of the cylinder
 * @param bottomRadius radius in the bottom
 * @param topRadius radius in the top
 * @param stacks number of vertical parts
 * @param slices number of circular parts
 * @param topCap (boolean) top covered
 * @param bottomCap (boolean) bottom covered
 * @constructor
 */
function MyCrown(scene) {
    CGFobject.call(this,scene);

    this.slices = 600;
    this.stacks = 200;

    this.bottomCrown = new MyCylinder(scene, 1, 0.3, 0.3, 200, 200, 0, 0);

    this.initBuffers();
};

MyCrown.prototype = Object.create(CGFobject.prototype);
MyCrown.prototype.constructor = MyCrown;
/**
 * @brief MyCrown init buffers
 */
MyCrown.prototype.initBuffers = function() {

    this.normals = [];
    this.indices = [];
    this.vertices = [];
    this.texCoords = [];

    let n = 4;
    let k = 4;
    var index = 0;
    var radius = 0.3;
    for(i = 0; i < this.stacks; i++) {
        var ang = 0;
        for (ang; ang < (2*Math.PI); ang+=(2*Math.PI/this.slices)) {

            if(Math.sin(ang*n) <= i/(this.stacks/k)) {
                continue;
            }
            let yValue;
            let nextAng = ang+((2*Math.PI)/this.slices);
            if(Math.sin(nextAng*n) > (i+1)/(this.stacks/k)) {
                yValue = (i+1)/(this.stacks/k);
            } else if(Math.sin(nextAng*n) > i/(this.stacks/k)) {
                yValue = Math.sin(nextAng*n);
            } else {
                continue;
            }
            let yValue2 = 0;
            if(Math.sin(ang*n) >= (i+1)/(this.stacks/k)) {
                yValue2 = (i+1)/(this.stacks/k);
            } else if(Math.sin(ang*n) > i/(this.stacks/k)) {
                yValue2 = Math.sin(ang*n);
            }

            this.vertices.push(radius * Math.cos(ang), i/(this.stacks/k), -radius * Math.sin(ang));
            this.vertices.push(radius * Math.cos(nextAng), i/(this.stacks/k), -radius * Math.sin(nextAng));//ponto da proxima stack
            this.vertices.push(radius * Math.cos(nextAng), yValue, -radius * Math.sin(nextAng));

            this.texCoords.push((ang)/(2*Math.PI), 1 - i/(this.stacks/k));
            this.texCoords.push((nextAng)/(2*Math.PI), 1 - i/(this.stacks/k));
            this.texCoords.push((nextAng)/(2*Math.PI), 1 - yValue);

            this.normals.push(Math.cos(ang), Math.sin(ang), 0);
            this.normals.push(Math.cos((ang)+2*Math.PI/this.slices), Math.sin((ang)+2*Math.PI/this.slices), 0);
            this.normals.push(Math.cos((ang)+2*Math.PI/this.slices), Math.sin((ang)+2*Math.PI/this.slices), 0);

            this.indices.push(index);
            this.indices.push(index+1);
            this.indices.push(index+2);

            if(yValue2 != 0) {
                this.vertices.push(radius * Math.cos(ang), yValue2, -radius * Math.sin(ang));
                this.texCoords.push((ang)/(2*Math.PI), 1 - yValue2);
                this.normals.push(Math.cos(ang), Math.sin(ang), 0);
                this.indices.push(index);
                this.indices.push(index+2);
                this.indices.push(index+3);
                index++;
            }
            index +=3;
        }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

/**
 * @brief Displays the crown
 */
MyCrown.prototype.display= function() {
    this.scene.pushMatrix();
    this.scene.translate(0,0.4,0);
    CGFobject.prototype.display.call(this);
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI/2,1,0,0);
    this.bottomCrown.display();
    this.scene.popMatrix();
};