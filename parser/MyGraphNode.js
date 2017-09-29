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
    console.log("addChild");
    this.children.push(nodeID);
}

/**
 * Adds a leaf to this node's leaves array.
 */
MyGraphNode.prototype.addLeaf = function(leaf) {
    console.log("addLeaf");
    this.leaves.push(leaf);
}


/**
 * Displays the node
 */
MyGraphNode.prototype.display = function(parentID) {

    console.log("ENTROU?");

    if(this.leaves.lenght != 0) {
        for (var i = 0; i < this.leaves.lenght; i++) {
            console.log("DISPLAY LEAF!");
            this.leaves[i].display();
        }
    } else {
        console.log("No more leaves");
    }

    //TODO: Apply texture from this.graph.getTextures()[this.textureID]
    //ja nao me lembro como era a funcao apply
    if(this.children.lenght != 0) {
        for (var i = 0; i < this.children.lenght; i++) {
            console.log("GOING TO DISPLAY NODE");
            //TEXTURA????
            this.testMaterial = null;
            if(materialID != null) {
                this.testMaterial = this.graph.materials[materialID];
                if (textureID != "null") {
                    this.testMaterial.setTexture(this.graph.getTextures()[this.textureID]);
                    this.testMaterial.apply();
                } else if (textureID == "clear") {
                    this.testMaterial.setTexture(null);
                }
            } else if (textureID == "clear") {
                this.testMaterial = this.graph.materials[parentID];
                this.testMaterial.setTexture(null);
            }

            if(this.testMaterial != null) {
                this.testMaterial.apply();
            }
            ////
            this.graph.getNodes()[children[i]].display();
            console.log("displaying node");
        }
    } else {
        console.log("No more node children");
    }



}
