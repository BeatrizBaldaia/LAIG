function MyBolt(scene ,slices, radius) {
    CGFobject.call(this,scene);
    this.slices=slices;
    this.radius = radius;

    this.base = new MyHexNut(scene ,slices, radius);
    this.cylinder = new MyCylinder(scene, 1, radius/2, radius/2, 200, slices, 0, 1);
    this.cone = new MyCylinder(scene, 1, 1, 0.1, slices, slices, 0, 1);
};

MyBolt.prototype.display= function() {
    this.base.display();

    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI/2,1,0,0);
    this.scene.scale(1,1,this.radius*7);
    this.cylinder.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI/2,1,0,0);

    this.scene.scale(1,1,this.radius);
    this.scene.translate(0,0,2.5);
    this.cone.display();
    this.scene.popMatrix();
}