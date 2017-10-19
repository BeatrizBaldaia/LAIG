/**
 * MyGraphNode class, representing an intermediate node in the scene graph.
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
    this.materialID = null ;

    // The texture ID.
    this.textureID = null ;

    this.transformMatrix = mat4.create();
    mat4.identity(this.transformMatrix);
    this.graphTextures = this.graph.textures;
    this.graphTexturesStack = this.graph.scene.texturesStack;
    this.graphMaterialsStack = this.graph.scene.materialsStack;
}

/**
 * Adds the reference (ID) of another node to this node's children array.
 */
MyGraphNode.prototype.addChild = function(nodeID) {
    this.children.push(nodeID);
}

/**
 * Adds a leaf to this node's leaves array.
 */
MyGraphNode.prototype.addLeaf = function(leaf) {
    this.leaves.push(leaf);
}


/**
 * Displays the node
 */
MyGraphNode.prototype.display = function(parentID) {

    /**
     * Call for children display
     */
   
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

}
