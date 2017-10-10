
function MyPatch(graph, xmlelem) {
	CGFobject.call(this,graph.scene);
	
	this.graph=graph;
    
    var args = graph.reader.getString(xmlelem, 'args');
    var stringArray = args.split(" ");//array com os valores dos argumentos (args)
	for(var i=0;i<stringArray.length;i++){
            stringArray[i]=parseFloat(stringArray[i]);
    }

    var s = this.controlvertexes(xmlelem);
	//TODO CHANGE

 	var u=s.length;
 	var v=s[0].length;
 	 alert("S[0]"+u+v);
	var nurbsSurface = new CGFnurbsSurface(u,v,s);
	var nurbsSurface = new CGFnurbsSurface(
								s.length,
								s0.length,
								this.getKnotsVector(s.length),
								this.getKnotsVector(s0.length),
								s);
	
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	this.surface = new CGFnurbsObject(this, getSurfacePoint, stringArray[0], stringArray[1]);
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
	var lines = xmlelem.children
	var s = new Array();
	for(var i=0;i<lines.length;i++){
		var a = new Array();
		var points = lines[i].children
		for(var j=0;j<points.length;j++){
			var b = new Array();
			b.push(this.graph.reader.getFloat(points[j], 'xx'));
			b.push(this.graph.reader.getFloat(points[j], 'yy'));
			b.push(this.graph.reader.getFloat(points[j], 'zz'));
			b.push(this.graph.reader.getFloat(points[j], 'ww'));
			a.push(b);

		}
		s.push(a);

	}

	return s;
};