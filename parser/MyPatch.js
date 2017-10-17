
function MyPatch(graph, xmlelem) {
	CGFobject.call(this,graph.scene);
	
	this.graph=graph;
    
    var args = graph.reader.getString(xmlelem, 'args');
    var stringArray = args.split(" ");//array com os valores dos argumentos (args)
	for(var i=0;i<stringArray.length;i++){
            stringArray[i]=parseFloat(stringArray[i]);
    }

    var s = this.controlvertexes(xmlelem);

	var nurbsSurface = new CGFnurbsSurface(
								s.length-1,
								s[0].length - 1,
								this.getKnotsVector(s.length-1),
								this.getKnotsVector(s[0].length - 1),
								s);
	
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	this.surface = new CGFnurbsObject(this.graph.scene, getSurfacePoint, stringArray[0], stringArray[1]);
	this.surface.initBuffers();
};

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor=MyPatch;

MyPatch.prototype.display = function (){
	this.surface.display();
}
MyPatch.prototype.getKnotsVector = function(degree) {
	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
}
MyPatch.prototype.controlvertexes = function (xmlelem){
	var lines = xmlelem.children; //controlpoint line to characterize de U dimension (CPLINE)
	var controlVertexesU = new Array();//to make the surface
	for(var i=0;i<lines.length;i++){
		var controlVertexesOnV = new Array();
		var points = lines[i].children//controlpoints to characterize de V dimension (CPOINT)
		for(var j=0;j<points.length;j++){
			var controlPoint = new Array();
            controlPoint.push(this.graph.reader.getFloat(points[j], 'xx'));
            controlPoint.push(this.graph.reader.getFloat(points[j], 'yy'));
            controlPoint.push(this.graph.reader.getFloat(points[j], 'zz'));
            controlPoint.push(this.graph.reader.getFloat(points[j], 'ww'));
            controlVertexesOnV.push(controlPoint);

		}
        controlVertexesU.push(controlVertexesOnV);

	}

	return controlVertexesU;
};