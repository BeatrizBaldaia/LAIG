// returns obj index on array a, or -1 if a does not contain obj
function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return i;
        }
    }

    return -1;
}

/**
 * @brief MyInterface class, creating a GUI interface.
 * @constructor
 */
function MyInterface() {
    //call CGFinterface constructor
    CGFinterface.call(this);
}
;

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * @brief Initializes the interface.
 * @param {CGFapplication} application
 * @return true
 */
MyInterface.prototype.init = function(application) {
    // call CGFinterface init
    CGFinterface.prototype.init.call(this, application);

    // init GUI. For more information on the methods, check:
    //  http://workshop.chromeexperiments.com/examples/gui

    this.gui = new dat.GUI();

    this.gui.add(this.scene, 'selectedNode', this.scene.nodeList).name('Select a node');

    this.gui.add(this.scene, 'colorFactor', 1, 60).onChange(function(v)
    {
        obj.scene.updateColorFactor(v);
    });

    // add a group of controls (and open/expand by defult)
    this.gui.add(this.scene, 'cameraView', {
  			'Fixed Camera Centering': 0,
  			'Top View': 1,
  			'First-Person': 2,
  			'Side View': 3,
            'Free Camera': 4
  	}).onChange(function(v)
    {
        obj.scene.updateCameraVelocity(v);
    }).name('Game View');
let a = this.scene;
    this.gui.add(this.scene, 'selectedGraph', [ 'tearoom', 'garage'] ).onChange(function () {
      a.graph.idRoot = a.selectedGraph;
    });
    this.gui.add(this.scene, 'selectedNode', this.scene.nodeList).name('Select a node');

    return true;
};

/**
 * @brief Adds a folder containing the IDs of the lights passed as parameter.
 * @param lights vector of lights
 */
MyInterface.prototype.addLightsGroup = function(lights) {

    var group = this.gui.addFolder("Lights");
    group.open();

    // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
    // e.g. this.option1=true; this.option2=false;

    obj=this;

    for (var key in lights) {
        if (lights.hasOwnProperty(key)) {
            this.scene.lightValues[key] = lights[key][0];
            group.add(this.scene.lightValues, key);
        }
    }


}
