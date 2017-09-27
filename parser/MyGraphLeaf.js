/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
**/

function MyGraphLeaf(graph, xmlelem) {
   //E O rectangle...etc
   //this.object
   var type=graph.reader.getItem(xmlelem, 'type', ['rectangle', 'cylinder', 'sphere', 'triangle']);
   if (type=='rectangle'){
       this.object=new MyRectangle(graph.scene);
   }
}

//CRIAR FUNCAO DISPLAY PARA 