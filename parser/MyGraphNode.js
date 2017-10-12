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
//TODO texture clear??
    /**
     * Call for children display
     */
    //TODO: Apply texture from this.graph.getTextures()[this.textureID]


    this.graph.scene.pushMatrix();
    this.graph.scene.multMatrix(this.transformMatrix);

    if(this.materialID != 'null'){
        this.graph.scene.materialsStack.push(this.graph.materials[this.materialID]);
        this.graph.materials[this.materialID].apply();
    }

    if(this.textureID != 'null' && this.textureID != 'clear'){
        this.graph.scene.texturesStack.push(this.textureID);
        this.graph.textures[this.textureID][0].bind();
    } else if(this.textureID == 'clear' && (this.graph.scene.texturesStack.length!=0)) {
        this.graph.textures[this.graph.scene.texturesStack[this.graph.scene.texturesStack.length - 1]][0].unbind();
    }

    if(this.children.length != 0) {
        for (var i = 0; i < this.children.length; i++) {
            this.graph.getNodes()[this.children[i]].display(this.nodeID);
        }
    } 

    /**
     * Draw leaves
     */
    if(this.leaves.length != 0) {
        for (var i = 0; i < this.leaves.length; i++) {
            var afS = 0, afT = 0;
            //TODO alterei ver se esta bem
            if(this.graph.scene.texturesStack.length != 0){
                    afS = this.graph.textures[this.graph.scene.texturesStack[this.graph.scene.texturesStack.length - 1]][1];
                    afT = this.graph.textures[this.graph.scene.texturesStack[this.graph.scene.texturesStack.length - 1]][2];
            }
            /*if(this.textureID != 'null' && this.textureID != 'clear') {
                afS = this.graph.textures[this.textureID][1];
                afT = this.graph.textures[this.textureID][2];
            } else {
                if(this.graph.scene.texturesStack.length!=0){
                    afS = this.graph.scene.texturesStack[this.graph.scene.texturesStack.length - 1][1];
                    afT = this.graph.scene.texturesStack[this.graph.scene.texturesStack.length - 1][2];
                }
            }*/
            this.leaves[i].setAmplifFactor(afS, afT);
            this.leaves[i].display();
        }
    }
    
    if(this.materialID!='null'){
        this.graph.scene.materialsStack.pop();
        this.graph.scene.materialsStack[this.graph.scene.materialsStack.length - 1].apply();
    }
    if(this.textureID != 'null' && this.textureID != 'clear'){
        this.graph.textures[this.textureID][0].unbind();
        this.graph.scene.texturesStack.pop();
        if(this.graph.scene.texturesStack.length!=0){
            this.graph.textures[this.graph.scene.texturesStack[this.graph.scene.texturesStack.length - 1]][0].bind();
        }
    } else if(this.textureID == 'clear'&& (this.graph.scene.texturesStack.length!=0)) {
        this.graph.textures[this.graph.scene.texturesStack[this.graph.scene.texturesStack.length - 1]][0].bind();
    }
    this.graph.scene.popMatrix();

}
