/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
**/

function MyGraphLeaf(graph, xmlelem) {
    this.leafObj = null;
    this.type = graph.reader.getItem(xmlelem, 'type', ['rectangle', 'cylinder', 'sphere', 'triangle','patch']); //TODO added patch
    var args = graph.reader.getString(xmlelem, 'args');
    var stringArray = args.split(" ");//array com os valores dos argumentos (args)
    for(var i=0;i<stringArray.length;i++){
            stringArray[i]=parseFloat(stringArray[i]);
    }
    switch (this.type){
        case 'patch':{
            this.leafObj = new MyPatch(graph, xmlelem);
            graph.onXMLMinorError("Patch");
            break;
        }
        case 'rectangle':{
             this.leafObj = new MyRectangle(graph.scene, stringArray[0], stringArray[1], stringArray[2], stringArray[3]);
            break;
        }
        case 'cylinder':{
            this.leafObj = new MyCylinder(graph.scene,stringArray[0], stringArray[1], stringArray[2], stringArray[3], stringArray[4], stringArray[5],stringArray[6]);
            break;
        }
        case 'sphere':{
            this.leafObj = new MySphere(graph.scene,stringArray[0], stringArray[1], stringArray[2]);
            break;
        }
        case 'triangle':{
            var p1 = [stringArray[0], stringArray[1], stringArray[2]];
            var p2 = [stringArray[3], stringArray[4], stringArray[5]];
            var p3 = [stringArray[6], stringArray[7], stringArray[8]];
            this.leafObj = new MyTriangle(graph.scene, p1, p2, p3);

            break;
        }
        default:{
            graph.onXMLMinorError("Unkown leaf");
        } 
        
    }

}

MyGraphLeaf.prototype.setAmplifFactor = function(afS, afT) {
    if(this.leafObj != null && (this.type == 'rectangle'|| this.type == 'triangle')){
        this.leafObj.setAmplifFactor(afS, afT);
    }
}

MyGraphLeaf.prototype.display = function() {
    if(this.leafObj!=null){
        this.leafObj.display();
    }
}
