/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
**/

function MyGraphLeaf(graph, xmlelem) {
    this.leafObj;
    this.type = graph.reader.getItem(xmlelem, 'type', ['rectangle', 'cylinder', 'sphere', 'triangle']);
    var args = graph.reader.getString(xmlelem, 'args');
    var stringArray = args.split(" ");//array com os valores dos argumentos (args)
    if (this.type == 'patch'){
       this.leafObj = null;
        graph.onXMLMinorError("Patch");
   } else {
        for(var i=0;i<stringArray.length;i++){
            stringArray[i]=parseFloat(stringArray[i]);
        }

        if (this.type == 'rectangle'){
           //args="ff ff ff ff" 2D coordinates for left-top and right-bottom vertices
           this.leafObj = new MyRectangle(graph.scene, stringArray[0], stringArray[1], stringArray[2], stringArray[3]);
       } else 
        if (this.type == 'cylinder') {
           //args="ff ff ff ii ii ii ii" height, bottom radius, top radius, sections along height, parts per section tampa1, tamp2
            this.leafObj = new MyCylinder(graph.scene,stringArray[0], stringArray[1], stringArray[2], stringArray[3], stringArray[4], stringArray[5],stringArray[6]);
        } else if (this.type == 'sphere') {
           //args="ff ii ii" radius, parts along radius, parts per section
            this.leafObj = new MySphere(graph.scene,stringArray[0], stringArray[1], stringArray[2]);
        } else
        if (this.type == 'triangle') {
           //args="ff ff ff ff ff ff ff ff ff" coordinates of each vertex
            var p1 = [stringArray[0], stringArray[1], stringArray[2]];
            var p2 = [stringArray[3], stringArray[4], stringArray[5]];
            var p3 = [stringArray[6], stringArray[7], stringArray[8]];
            this.leafObj = new MyTriangle(graph.scene, p1, p2, p3);
       } else {
            graph.onXMLMinorError("Unkown leaf");
        }
    }
}

MyGraphLeaf.prototype.setAmplifFactor = function(afS, afT) {
    if(this.leafObj!=null && this.type == 'rectangle'){
        this.leafObj.setAmplifFactor(afS, afT);
    }

}

MyGraphLeaf.prototype.display = function() {
    if(this.leafObj!=null){
        this.leafObj.display();
    }
}
