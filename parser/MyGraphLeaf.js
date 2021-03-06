/**
 * @brief MyGraphLeaf class, representing a leaf in the scene graph.
 * @param graph graph of the leaf
 * @param xmlelem LSX
 * @constructor
**/
function MyGraphLeaf(graph, xmlelem) {
    this.leafObj = null;
    this.type = graph.reader.getItem(xmlelem, 'type', ['rectangle', 'cylinder', 'sphere', 'triangle', 'circle', 'patch', 'hexnut', 'crown', 'lamp']); //TODO added patch
    var args = graph.reader.getString(xmlelem, 'args');
    var stringArray = args.split(" ");//array com os valores dos argumentos (args)
    for(var i=0;i<stringArray.length;i++){
            stringArray[i]=parseFloat(stringArray[i]);
            if(isNaN(stringArray[i])){
                stringArray.splice(i, 1);
                i--;
            }
    }
    switch (this.type){
        case 'patch':{
            this.leafObj = new MyPatch(graph, xmlelem);
            break;
        }
        case 'rectangle':{
            if(stringArray.length!=4){graph.onXMLError("Numero de args errado\n");}else{
            this.leafObj = new MyRectangle(graph.scene, stringArray[0], stringArray[1], stringArray[2], stringArray[3]);
            }break;
        }
        case 'cylinder':{
            if(stringArray.length!=7){graph.onXMLError("Numero de args errado\n");}else{
                this.leafObj = new MyCylinder(graph.scene,stringArray[0], stringArray[1], stringArray[2], stringArray[3], stringArray[4], stringArray[5],stringArray[6]);
            }break;
        }
        case 'sphere':{
            if(stringArray.length!=3){graph.onXMLError("Numero de args errado\n");}else{
            this.leafObj = new MySphere(graph.scene,stringArray[0], stringArray[1], stringArray[2]);
            }break;
        }
        case 'triangle':{
            if(stringArray.length!=9){graph.onXMLError("Numero de args errado\n");}else{
            var p1 = [stringArray[0], stringArray[1], stringArray[2]];
            var p2 = [stringArray[3], stringArray[4], stringArray[5]];
            var p3 = [stringArray[6], stringArray[7], stringArray[8]];
            this.leafObj = new MyTriangle(graph.scene, p1, p2, p3);

            }break;
        }
        case 'circle':{
            if(stringArray.length!=1){graph.onXMLError("Numero de args errado\n");}else{
                this.leafObj = new MyCircle(graph.scene, stringArray[0]);
            }
            break;
        }
        case 'hexnut':{
            if(stringArray.length!=2){graph.onXMLError("Numero de args errado\n");}else{
                this.leafObj = new MyHexNut(graph.scene,stringArray[0], stringArray[1]);
            }break;
        }
        case 'crown':{
        this.leafObj = new MyCrown(graph.scene);
        break;
        }
        case 'lamp':{
            if(stringArray.length!=2){graph.onXMLError("Numero de args errado\n");}else{
                this.leafObj = new MyLamp(graph.scene,stringArray[0], stringArray[1]);
            }
            break;
        }
        default:{
            graph.onXMLMinorError("Unkown leaf");
        } 
        
    }

}
/**
 * @brief Sets the amplification factors on resctangles and triangles
 * @param afS amplification factor in the S coordenate
 * @param afT amplification factor in the T coordenate
 */
MyGraphLeaf.prototype.setAmplifFactor = function(afS, afT) {
    if(this.leafObj != null && (this.type == 'rectangle'|| this.type == 'triangle')){
        this.leafObj.setAmplifFactor(afS, afT);
    }
}
/**
 * @brief Displays the leaf
 */
MyGraphLeaf.prototype.display = function() {
    if(this.leafObj!=null){
        this.leafObj.display();
    }
}
