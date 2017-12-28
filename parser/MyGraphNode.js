/**
 * @brief MyGraphNode class, representing an intermediate node in the scene graph.
 * @param graph gra of the node
 * @param nodeID node ID of the node
 * @constructor
**/
function MyGraphNode(graph, nodeID) {
    this.graph = graph;
    this.nodeID = nodeID;

    this.initParserVariables();
    this.initAnimationVariables();
    this.initGameVariables();
    this.initButonVariables();
}

/**
 * @brief Inicia os atributos relacionados com o parser do XML
 */
MyGraphNode.prototype.initParserVariables = function() {
    // IDs of child nodes.
    this.children = [];
    // Leaves nodes objects.
    this.leaves = [];
    // The material ID.
    this.materialID = 'null';
    // The texture ID.
    this.textureID = 'null';
    this.selected = false;
    this.visible = true;
    this.graphTextures = this.graph.textures;
    this.graphTexturesStack = this.graph.scene.texturesStack;
    this.graphMaterialsStack = this.graph.scene.materialsStack;
}

/**
 * @brief Inicia os atributos relacionados com as animacoes do no
 */
MyGraphNode.prototype.initAnimationVariables = function() {
    this.animation = [];
    this.transformMatrix = mat4.create();
    mat4.identity(this.transformMatrix);
    this.originalMatrix = mat4.create();
    mat4.identity(this.originalMatrix);
    this.animationN = 0;
    this.initialAnimTime = 0;
    this.invert = 0;
}

/**
 * @brief Inicia os atributos relacionados com as informacoes do jogo Dameo
 */
MyGraphNode.prototype.initGameVariables = function() {
    this.position = {x: 0, y:0};
    this.initialPosition = {x: 0, y:0};
    this.king = false;
}

/**
 * @brief Inicia os atributos de caso o no ser um butao/alavanca da interface
 */
MyGraphNode.prototype.initButonVariables = function() {
    this.isButon = 0;
    this.pressed = 0;
}

/**
 * @brief Adds the reference (ID) of another node to this node's children array.
 * @param nodeID reference to add
 */
MyGraphNode.prototype.addChild = function(nodeID) {
    this.children.push(nodeID);
}
/**
 * @brief Adds a leaf to this node's leaves array.
 * @param leaf leaf to add
 */
MyGraphNode.prototype.addLeaf = function(leaf) {
    this.leaves.push(leaf);
}
/**
 * @brief Displays the node
 */
MyGraphNode.prototype.display = function(parentID) {
  if (((this.graph.scene.pickMode == false) && this.visible)||(this.graph.scene.pickMode == true)) {
    if(this.selected) {
      this.graph.scene.registerForPick(this.graph.scene.game.selectNodesList[this.nodeID], this);
    }
    if(this.graph.scene.selectedNode == this.nodeID)
        this.graph.scene.setActiveShader(this.graph.scene.shader);
    this.graph.scene.pushMatrix();
    this.graph.scene.multMatrix(this.transformMatrix);

    if(this.materialID != 'null'){
        this.graphMaterialsStack.push(this.graph.materials[this.materialID]);//material que vai ser usado e guardado na stack
        this.graph.materials[this.materialID].apply();
        if(this.graphTexturesStack.length!=0){//se ja houver uma textura posto na stack por um no pai, aplicamos esse textura
            this.graphTextures[this.graphTexturesStack[this.graphTexturesStack.length - 1]][0].bind();
        }
    }

    if(this.textureID != 'null' && this.textureID != 'clear'){//se o no atual tem a sua propria textura
        this.graphTexturesStack.push(this.textureID);//guarda a textura des no na stack para ele e os seus filhos a poderem usar
        this.graphTextures[this.textureID][0].bind();//aplica a sua textura
    } else if(this.textureID == 'clear' && (this.graphTexturesStack.length!=0)) {//nao vai querer aplicar qualquer tipo de textura
        this.graphTextures[this.graphTexturesStack[this.graphTexturesStack.length - 1]][0].unbind();//desaplica a textura atual, mas nao a remove da stack
    }//se textureID = null, no nao faz nada

    if(this.children.length != 0) {//ver os filhos deste no
        for (var i = 0; i < this.children.length; i++) {
            if(this.textureID == 'clear' && (this.graphTexturesStack.length!=0)) {//fazer sempre o unbind antes de fazer o display de um filho porque estes podem ter aplicado uma textura
                this.graphTextures[this.graphTexturesStack[this.graphTexturesStack.length - 1]][0].unbind();
            }
            if(this.nodeID.substring(0, 9) == "gamepiece") {
                if(this.king) {
                    this.graph.getNodes()[this.children[1]].display(this.nodeID);
                }
                this.graph.getNodes()[this.children[0]].display(this.nodeID);
                break;
            } else if ((this.nodeID == 'piece_man')||(this.nodeID == 'piece_king')||(this.nodeID == 'buton_level')||(this.nodeID == 'buton_film')||(this.nodeID == 'buton_1Vs1')||(this.nodeID == 'buton_1VsPC')||(this.nodeID == 'buton_PCVsPC')||(this.nodeID == 'buton_undo')) {
              let aux = (this.graph.idRoot == 'tearoom')?'tea_':'gar_';
              this.graph.getNodes()[aux+this.nodeID].display(this.nodeID);
            } else {
              this.graph.getNodes()[this.children[i]].display(this.nodeID);
            }
        }
    }
    if(this.textureID == 'clear' && (this.graphTexturesStack.length!=0)) {
        this.graphTextures[this.graphTexturesStack[this.graphTexturesStack.length - 1]][0].unbind();
    }
    /**
     * Draw leaves
     */

    if(this.leaves.length != 0) {
        for (var i = 0; i < this.leaves.length; i++) {
            // if(this.nodeID.substring(0, 4) != "tile") {
                var afS = 0, afT = 0;
                if(this.graphTexturesStack.length != 0){
                    afS = this.graphTextures[this.graphTexturesStack[this.graphTexturesStack.length - 1]][1];
                    afT = this.graphTextures[this.graphTexturesStack[this.graphTexturesStack.length - 1]][2];
                }
                this.leaves[i].setAmplifFactor(afS, afT);
                this.leaves[i].display();
            }
        // }
    }

    if(this.materialID != 'null'){//depois de um no acabar o seu display e o dos seus filhos, retira o seu material da stack
        this.graphMaterialsStack.pop();
        this.graphMaterialsStack[this.graph.scene.materialsStack.length - 1].apply();
    }
    if(this.textureID != 'null' && this.textureID != 'clear'){//depois de um no acabar o seu display e o dos seus filhos, retira a sua textura da stack
        this.graphTextures[this.textureID][0].unbind();
        this.graphTexturesStack.pop();
        if(this.graphTexturesStack.length!=0){
            this.graphTextures[this.graphTexturesStack[this.graphTexturesStack.length - 1]][0].bind();
        }
    } else if(this.textureID == 'clear'&& (this.graphTexturesStack.length!=0)) {
        this.graphTextures[this.graphTexturesStack[this.graphTexturesStack.length - 1]][0].bind();//volta a aplicar a textura que tinha desaplicado para os seus nos irmaos a usarem
    }
    this.graph.scene.popMatrix();
    if(this.graph.scene.selectedNode == this.nodeID)
        this.graph.scene.setActiveShader(this.graph.scene.defaultShader);
    if(this.selected){
      this.graph.scene.clearPickRegistration();
    }
  }
}
/**
 * @brief Updates the animation matrix
 * @param currTime
 */
MyGraphNode.prototype.updateMatrix = function(currTime) {
    this.initialAnimTime = this.initialAnimTime == 0 ? currTime : this.initialAnimTime;
    if(this.isButon) {
        this.getButonAnimationMatrix(currTime);
    } else {
        this.getNormalAnimationMatrix(currTime);
    }
}

/**
 * @brief Update da matrix animacao no caso de o no ser um butao
 * @param currTime
 */
MyGraphNode.prototype.getButonAnimationMatrix = function(currTime) {

    if(this.initialAnimTime != -1) {
        let newMatrix = this.graph.animations[this.animation[this.pressed]].getMatrix(this.initialAnimTime, currTime);
        if(newMatrix != null) {
            mat4.multiply(this.transformMatrix,
                this.originalMatrix,
                newMatrix);
        } else {//fim da animacao
            if(this.invert && this.pressed) {
                this.pressed = 0;
                this.initialAnimTime = 0;
            } else {
                this.invert = 0;
                this.initialAnimTime = -1;
            }
            mat4.copy(this.originalMatrix, this.transformMatrix);

        }
    }
}

/**
 * @brief Update da matrix animacao no caso de o no nao ser um butao
 * @param currTime
 */
MyGraphNode.prototype.getNormalAnimationMatrix = function(currTime) {
    if(this.animationN < this.animation.length) {//enquanto ha animacoes para reproduzir
        let newMatrix = this.graph.animations[this.animation[this.animationN]].getMatrix(this.initialAnimTime, currTime);

        if(newMatrix != null) {
            mat4.multiply(this.transformMatrix,
                this.originalMatrix,
                newMatrix);
        } else {//proxima animacao
            //console.log("NOVA ANIMACAO: "+this.animation[this.animationN]);
            this.animationN++;
            this.initialAnimTime = 0;
        }
    }
}

MyGraphNode.prototype.getPosition = function() {
    return this.currPosition;
}

MyGraphNode.prototype.resetPositions = function() {
  if(this.nodeID.substring(0, 9) == "gamepiece") {
    if(this.graph.animations.indexOf('reset' + this.nodeID) == -1){
      this.createResetAnimation();
    }
    this.graph.scene.game.verifyNodeAnimation(this);
    this.animation.push('reset' + this.nodeID);
    this.position.x = this.initialPosition.x;
    this.position.y = this.initialPosition.y;
    this.king = false;
  }
  if(this.children.length != 0) {//ver os filhos deste no
    for (let i = 0; i < this.children.length; i++) {
      this.graph.getNodes()[this.children[i]].resetPositions();
    }
  }
}

MyGraphNode.prototype.createResetAnimation = function () {
  let p1 = [this.position.x, 0, this.position.y];
  let p2 = [this.position.x, ANIMATION_HEIGHT, this.position.y];
  let p3 = [this.initialPosition.x, ANIMATION_HEIGHT, this.initialPosition.y];
  let p4 = [this.initialPosition.x, 0, this.initialPosition.y];
  let aux_animation = new MyBezierAnimation(this.graph, p1, p2, p3, p4, ANIMATION_VELOCITY);
  this.graph.animations['reset'+this.nodeID] = aux_animation;
  return aux_animation;
};
