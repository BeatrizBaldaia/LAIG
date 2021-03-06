var DEGREE_TO_RAD = Math.PI / 180;
/**
 * @brief XMLscene class, representing the scene that is to be rendered.
 * @param interface the interface
 * @constructor
 */
function XMLscene(interface) {
  CGFscene.call(this);
  this.interface = interface;
  this.lightValues = {};
  this.colorFactor=30;
  this.timeFactor=30;
  this.game = new MyGame(this);

  this.update=function(currTime){
    let s = Math.sin(currTime/1000)/2 + .5;
    this.shader.setUniformsValues({uTimeFactor: s});
    for(let i = 0; i < this.nodesWithAnimation.length; i++) {
      this.graph.nodes[this.nodesWithAnimation[i]].updateMatrix(currTime);
    }
    if(this.graph.loadedOk) {
        this.game.updateGameTime(currTime);
    }

    /* CAMERA VIEW */
      this.updateCameraView(currTime);

  }

  this.setPickEnabled(true);

  /* CAMERA VIEW */
  this.initCameraVars();

}
XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;
/**
 * @brief Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
 * @param application the application
 */
XMLscene.prototype.init = function(application) {
  CGFscene.prototype.init.call(this, application);
  this.initCameras();
  this.enableTextures(true);
  this.gl.clearDepth(100.0);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.gl.enable(this.gl.CULL_FACE);
  this.gl.depthFunc(this.gl.LEQUAL);
  this.axis = new CGFaxis(this);
  this.texturesStack=[];
  this.materialsStack=[];
  this.nodesWithAnimation=[];
  this.selectedNode = 0;
  this.selectedGraph = 'tearoom';
  this.nodeList = {'No Node Selected': 0};
  this.shader = new CGFshader(this.gl, "shaders/flat.vert", "shaders/flat.frag");
  this.shader.setUniformsValues({uTimeFactor: 0});
  this.updateColorFactor();
  this.setUpdatePeriod(10);

}
XMLscene.prototype.updateColorFactor=function(v) {
  this.shader.setUniformsValues({colorScale: this.colorFactor});
}
XMLscene.prototype.updateTimeFactor=function(v) {
    this.game.maxTime = this.timeFactor;
}

/**
 * @brief Initializes the scene lights with the values read from the LSX file.
 */
XMLscene.prototype.initLights = function() {
  var i = 0;
  // Lights index.
  // Reads the lights from the scene graph.
  for (var key in this.graph.lights) {
    if (i >= 8)
    break;// Only eight lights allowed by WebGL.
    if (this.graph.lights.hasOwnProperty(key)) {
      var light = this.graph.lights[key];
      this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
      this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
      this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
      this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);
      this.lights[i].setVisible(true);
      if (light[0])
        this.lights[i].enable();
      else
        this.lights[i].disable();
      this.lights[i].update();
      i++;
    }
  }
}
/**
 * @brief Initializes the scene cameras.
 */
XMLscene.prototype.initCameras = function() {
  this.freeCamera = new CGFcamera(0.4,0.1,500,vec3.fromValues(5, 5, 30),vec3.fromValues(5, 4, 5));
  this.staticCamera = new CGFcamera(0.4,0.1,500,vec3.fromValues(5, 5, 30),vec3.fromValues(5, 4, 5));
  this.camera = this.staticCamera;
}
/** @brief Handler called when the graph is finally loaded.
 * As loading is asynchronous, this may be called already after the application has started the run loop
 */
XMLscene.prototype.onGraphLoaded = function(){
  this.freeCamera.near = this.graph.near;
  this.freeCamera.far = this.graph.far;
  this.staticCamera.near = this.graph.near;
  this.staticCamera.far = this.graph.far;
  this.axis = new CGFaxis(this,this.graph.referenceLength);
  this.setGlobalAmbientLight(this.graph.ambientIllumination[0], this.graph.ambientIllumination[1],
    this.graph.ambientIllumination[2], this.graph.ambientIllumination[3]);
  this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
  this.initLights();
  // Adds lights group.
  this.interface.addLightsGroup(this.graph.lights);
}
/**
 * @brief Displays the scene.
 */
XMLscene.prototype.display = function() {
  // ---- BEGIN Background, camera and axis setup
  // Clear image and depth buffer everytime we update the scene
  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  // Initialize Model-View matrix as identity (no transformation
  this.updateProjectionMatrix();
  // Apply transformations corresponding to the camera position relative to the origin
  this.loadIdentity();
  this.applyViewMatrix();



  this.pushMatrix();
  if (this.graph.loadedOk) {
    // Applies initial transformations.
    this.multMatrix(this.graph.initialTransforms);
    // Draw axis
    this.axis.display();

    var i = 0;
    for (var key in this.lightValues) {
        if(key.substring(0, 3) != this.graph.idRoot.substring(0, 3)) {
            if (this.lightValues.hasOwnProperty(key)) {
                this.lights[i].setVisible(false);
                this.lights[i].disable();
            }
        } else {
            if (this.lightValues.hasOwnProperty(key)) {
                if (this.lightValues[key]) {
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                } else {
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }
            }
        }
        this.lights[i].update();
        i++;

    }

    this.logPicking();
    this.clearPickRegistration();

    this.graph.displayScene();
  } else {
    // Draw axis
    this.axis.display();
  }
  this.popMatrix();
  // ---- END Background, camera and axis setup
}
XMLscene.prototype.logPicking = function () {
  if (this.pickMode == false) {
    if (this.pickResults != null && this.pickResults.length > 0) {
      for (var i=0; i< this.pickResults.length; i++) {
        var obj = this.pickResults[i][0];
        if (obj) {
    			var customId = this.pickResults[i][1];
    			console.log("Picked object: " + obj.nodeID + ", with pick id " + customId);
          this.game.logPicking(obj);
        }
      }
      this.pickResults.splice(0,this.pickResults.length);
    }
  }
}

XMLscene.prototype.initCameraVars = function() {
    this.currCameraType = 1; //0 = freeCamera ; 1 = staticCamera
    this.previousTime = 0;//tempo do ultimo update
    this.timeACC = 0;//tempo que se passou entre o momento atual e o ultimo update

    this.changinCamera = 0;//flag para saber se ainda estamos a mudar de camara
    this.cameraView = 0;//parametro obtido pela interface

    this.cameraTransitionVel = 0;
    this.targetTransitionVel = 0;

    var camera1 = {position: vec4.fromValues(5, 5, 30, 0), target: vec3.fromValues(5, 4, 5), type: 1};
    var camera2 = {position: vec4.fromValues(5, 15, 5, 0), target: vec3.fromValues(5, 4, 5), type: 1};
    var camera3 = {position: vec4.fromValues(5, 7, 18, 0), target: vec3.fromValues(5, 4, 5), type: 1};
    var camera4 = {position: vec4.fromValues(25, 10, 5, 0), target: vec3.fromValues(5, 4, 5), type: 1};
    var camera6 = {position: vec4.fromValues(5, 5, 30, 0), target: vec3.fromValues(5, 4, 5), type: 0};
    this.camerasSet = [ camera1, camera2, camera3, camera4, camera6];

}

/**
 * @brief Updates the camera transition velocity
 */
XMLscene.prototype.updateCameraVelocity=function(v) {
    this.changinCamera = 1;
    this.previousTime = 0;
    this.timeACC = 0;
    this.currCameraType = this.camerasSet[this.cameraView]["type"];
    if(this.currCameraType == 1) {
        this.camera = this.staticCamera;
        this.interface.setActiveCamera(null);
    } else {
        this.camera = this.freeCamera;
        this.interface.setActiveCamera(this.camera);
    }

    this.cameraTransitionVel = (distanceBetweenPoints(this.camera["position"], this.camerasSet[this.cameraView]["position"])) / 2000;
    this.targetTransitionVel = (distanceBetweenPoints(this.camera["target"], this.camerasSet[this.cameraView]["target"])) / 2000;

}

/**
 * @brief Updates the camera position focus on a target
 */
XMLscene.prototype.updateCameraView=function(currTime) {

    if(this.changinCamera) {
        let deltaPos = getDirectionVec(this.camera["position"], this.camerasSet[this.cameraView]["position"]);
        let deltaTarget = getDirectionVec(this.camera["target"], this.camerasSet[this.cameraView]["target"]);
        let distPos = distanceBetweenPoints(this.camera["position"], this.camerasSet[this.cameraView]["position"]);
        let distTarget = distanceBetweenPoints(this.camera["position"], this.camerasSet[this.cameraView]["position"]);

        if(distTarget == 0 && distPos == 0) {
            this.changinCamera = 0;
            return 1;
        }
        if(this.timeACC >= 2000) { //camara ja na posicao final
            this.changinCamera = 0;
            this.previousTime = 0;
            this.timeACC = 0;
        } else {//ainda e preciso mover a camara

            let deltaTime = 0;
            if(this.previousTime != 0) {
                deltaTime = currTime - this.previousTime;
            }
            this.timeACC += deltaTime;
            this.previousTime = currTime;
            if(distPos != 0) {
                let distanceToGo = deltaTime * this.cameraTransitionVel; //velocidade = 2 segundos por animacao
                let vectorToGo = calculateDeltaTranslation(this.camera["position"], deltaPos, distanceToGo, distPos);
                this.camera.setPosition(vectorToGo);
            }
            if(distTarget != 0) {
                let distanceToGoTarget = deltaTime * this.targetTransitionVel;
                let vectorToGoTarget = calculateDeltaTranslation(this.camera["target"], deltaTarget, distanceToGoTarget, distTarget);

                this.camera.setTarget(vectorToGoTarget);
            }


            this.loadIdentity();
            this.applyViewMatrix();
        }
        return 1;
    }
    return 0;
}
