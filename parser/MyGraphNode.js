/**
 * MyGraphNode class, representing an intermediate node in the scene graph.
 * @constructor
**/

function MyGraphNode(graph, nodeID) {
    this.graph = graph;

    this.nodeID = nodeID;
    
    // IDs of child nodes.
    this.children = [];

    // IDs of leaves nodes.
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
MyGraphNode.prototype.display = function() {
    console.log("displaying node");
    if(this.children.lenght != 0) {
        for (var i = 0; i < this.children.lenght; i++) {
            this.children[i].display();
        }
    } else {
        console.log("No more node children");
    }

    if(this.leaves.lenght != 0) {
        for (var i = 0; i < this.leaves.lenght; i++) {
            this.leaves[i].display();
        }
    } else {
        console.log("No more leaves");
    }

}
