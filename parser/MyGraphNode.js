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
    //console.log("addChild");
    this.children.push(nodeID);
}

/**
 * Adds a leaf to this node's leaves array.
 */
MyGraphNode.prototype.addLeaf = function(leaf) {
    //console.log("addLeaf");
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

    console.log("Displays node = "+this.nodeID);

    this.graph.scene.pushMatrix();
    this.graph.scene.multMatrix(this.transformMatrix);

    if(this.materialID != 'null'){
        console.log("Material = "+this.materialID);
        this.graph.scene.materialsStack.push(this.graph.materials[this.materialID]);
        this.graph.materials[this.materialID].apply();
    }

    if(this.textureID != 'null' && this.textureID != 'clear'){
        this.graph.scene.texturesStack.push(this.graph.getTextures()[this.textureID]);
        this.graph.textures[this.textureID][0].bind();
    }
    
    if(this.children.length != 0) {
        for (var i = 0; i < this.children.length; i++) {
            //console.log("GOING TO DISPLAY NODE");
            
            this.graph.getNodes()[this.children[i]].display(this.nodeID);
            //console.log("displaying node");
        }
    } else {
        //console.log("No more node children");
    }
    /**
     * Draw leaves
     */
    if(this.leaves.length != 0) {
        for (var i = 0; i < this.leaves.length; i++) {
            //console.log("DISPLAY LEAF!");
            this.leaves[i].display();
        }
    } else {
        //console.log("No more leaves");
    }
    if(this.materialID!='null'){
        console.log("END Material = "+this.materialID);
        this.graph.scene.materialsStack.pop();
        this.graph.scene.materialsStack[this.graph.scene.materialsStack.length - 1].apply();
    }
    if(this.textureID != 'null' && this.textureID != 'clear'){
        this.graph.textures[this.textureID][0].unbind();
        this.graph.scene.texturesStack.pop();
        if(this.graph.scene.texturesStack.length!=0)
            this.graph.scene.texturesStack[this.graph.scene.texturesStack.length - 1].bind();
    
    }
    this.graph.scene.popMatrix();

    console.log("Ends node = "+this.nodeID);
}
