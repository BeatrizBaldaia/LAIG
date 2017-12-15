/**
 * @brief MyGraphNode class, representing an intermediate node in the scene graph.
 * @param graph gra of the node
 * @param nodeID node ID of the node
 * @constructor
**/
function MyGraphNode(graph, nodeID) {
    this.graph = graph;
    this.nodeID = nodeID;
    // IDs of child nodes.
    this.children = [];
    // Leaves nodes objects.
    this.leaves = [];
    // The material ID.
    this.materialID = null;
    // The texture ID.
    this.textureID = null;
    this.selected = false;
    this.animation = [];
    this.transformMatrix = mat4.create();
    mat4.identity(this.transformMatrix);
    this.originalMatrix = mat4.create();
    mat4.identity(this.originalMatrix);
    this.graphTextures = this.graph.textures;
    this.graphTexturesStack = this.graph.scene.texturesStack;
    this.graphMaterialsStack = this.graph.scene.materialsStack;
    this.animationN = 0;
    this.initialAnimTime = 0;
    this.position = {x: 0, y:0};
    this.king = false;
    // this.currPosition = [this.transformMatrix[12], this.transformMatrix[13], this.transformMatrix[14]];
    // mat4.getTranslation(this.currPosition, this.transformMatrix);

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
  //TODO NEW_______________
  if(this.selected) {
    this.graph.scene.registerForPick(this.graph.scene.game.selectNodesList[this.nodeID], this);
  }    //__________________________
    /**
     * Call for children display
     */
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
    if(this.king){
      this.graphTextures['coroa'][0].bind();
    }

    if(this.children.length != 0) {//ver os filhos deste no
        for (var i = 0; i < this.children.length; i++) {
            if(this.textureID == 'clear' && (this.graphTexturesStack.length!=0)) {//fazer sempre o unbind antes de fazer o display de um filho porque estes podem ter aplicado uma textura
                this.graphTextures[this.graphTexturesStack[this.graphTexturesStack.length - 1]][0].unbind();
            }
            this.graph.getNodes()[this.children[i]].display(this.nodeID);
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
            var afS = 0, afT = 0;
            if(this.graphTexturesStack.length != 0){
                    afS = this.graphTextures[this.graphTexturesStack[this.graphTexturesStack.length - 1]][1];
                    afT = this.graphTextures[this.graphTexturesStack[this.graphTexturesStack.length - 1]][2];
            }
            this.leaves[i].setAmplifFactor(afS, afT);
            this.leaves[i].display();
        }
    }
    if(this.king){
      this.graphTextures['coroa'][0].unbind();
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
        this.graph.scene.setActiveShader(this.graph.scene.defaultShader);//TODO
}
/**
 * @brief Updates the animation matrix
 * @param currTime
 */
MyGraphNode.prototype.updateMatrix = function(currTime) {
    this.initialAnimTime = this.initialAnimTime == 0 ? currTime : this.initialAnimTime;

    if(this.animationN < this.animation.length) {//enquanto ha animacoes para reproduzir
        let newMatrix = this.graph.animations[this.animation[this.animationN]].getMatrix(this.initialAnimTime, currTime);

        if(newMatrix != null) {
            mat4.multiply(this.transformMatrix,
                this.originalMatrix,
                newMatrix);
        } else {//proxima animacao
            console.log("NOVA ANIMACAO: "+this.animation[this.animationN]);
            this.animationN++;
            this.initialAnimTime = 0;
        }
    }

}

MyGraphNode.prototype.getPosition = function() {
    // mat4.getTranslation(this.currPosition, this.transformMatrix);
    // this.currPosition = [this.transformMatrix[12], this.transformMatrix[13], this.transformMatrix[14]];
    // console.log(this.currPosition);
    return this.currPosition;
}
