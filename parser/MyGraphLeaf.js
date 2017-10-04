/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
**/

function MyGraphLeaf(graph, xmlelem) {
    this.leafObj;
    var type = graph.reader.getItem(xmlelem, 'type', ['rectangle', 'cylinder', 'sphere', 'triangle']);
    var args = graph.reader.getString(xmlelem, 'args');
    var stringArray = args.split(" ");//array com os valores dos argumentos (args)
    for(var i=0;i<stringArray.length;i++){
        stringArray[i]=parseFloat(stringArray[i]);
    }

    if (type == 'rectangle'){
       //args="ff ff ff ff" 2D coordinates for left-top and right-bottom vertices
       this.leafObj = new MyRectangle(graph.scene, stringArray[0], stringArray[1], stringArray[2], stringArray[3]);
   } else 
    if (type == 'cylinder') {
       //args="ff ff ff ii ii" height, bottom radius, top radius, sections along height, parts per section
        this.leafObj = new MyCylinder(graph.scene,stringArray[0], stringArray[1], stringArray[2], stringArray[3], stringArray[4]);
    } else if (type == 'sphere') {
       //args="ff ii ii" radius, parts along radius, parts per section
        this.leafObj = new MySphere(graph.scene,stringArray[0], stringArray[1], stringArray[2]);
    } else
    if (type == 'triangle') {
       //args="ff ff ff ff ff ff ff ff ff" coordinates of each vertex
        var p1 = [stringArray[0], stringArray[1], stringArray[2]];
        var p2 = [stringArray[3], stringArray[4], stringArray[5]];
        var p3 = [stringArray[6], stringArray[7], stringArray[8]];
        this.leafObj = new MyTriangle(graph.scene, p1, p2, p3);
   } else {
        graph.onXMLMinorError("Unkown leaf");
    }
}

MyGraphLeaf.prototype.display = function() {
    //console.log("Leaf being display");
    if(this.leafObj!=null){
        console.log("Leaf being display");
        this.leafObj.display();
    }
}
