function Cubopen(cubeEdgeLength, holeDiameter) {
    this.cubeEdgeLength = cubeEdgeLength;
    this.holeDiameter = holeDiameter;
    this.block = cube({
        size: cubeEdgeLength, 
        center: true
    });


    this.addStraightHole = function(face) {
        var hole = cylinder({
            r: this.holeDiameter,
            h: this.cubeEdgeLength,
            center: true
        });
        if (face == 'left' || face == 'right') {
            hole = hole.rotateX(90);
        } else if (face == 'front' || face == 'back') {
            hole = hole.rotateY(90);
        }
        this.block = difference(this.block, hole);
    };
    
    this.addCurveHole = function(face, rotation) {
        var halfLength = this.cubeEdgeLength/2.0;
        var hole = torus({
            ri: this.holeDiameter,
            ro: halfLength
        });
        if (face == 'front') {
            hole = hole.translate([halfLength,halfLength,0]);
            hole = hole.rotateX(rotation*90);
        } else if (face == 'back') {
            hole = hole.translate([-halfLength,halfLength,0]);
            hole = hole.rotateX(rotation*90);
        } else if (face == 'left') {
            hole = hole.translate([halfLength,-halfLength,0]);
            hole = hole.rotateY(rotation*90);
        } else if (face == 'right') {
            hole = hole.translate([halfLength,halfLength,0]);
            hole = hole.rotateY(rotation*90);
        } 
        this.block = difference(this.block, hole);
    };
    
    this.addStraightChannel = function(face, rotation) {
        var halfLength = this.cubeEdgeLength/2.0;
        var channel = cylinder({
            r: this.holeDiameter,
            h: this.cubeEdgeLength,
            center: true
        });
        channel = channel.rotateY(90);
        channel = channel.rotateZ(rotation*90);
        channel = channel.translate([0,0,halfLength]);
        
        if (face == 'front') {
            channel = channel.rotateY(90);
        } else if (face == 'left') {
            channel = channel.rotateX(90);
        } else if (face == 'right') {
            channel = channel.rotateX(-90);
        } else if (face == 'back') {
            channel = channel.rotateY(-90);
        } else if (face == 'bottom') {
            channel = channel.rotateY(180);
        }
    
        this.block = difference(this.block, channel);
    };
    
    this.addCurveChannel = function(face, rotation) {
        var halfLength = this.cubeEdgeLength/2.0;
        var channel = torus({
            ri: this.holeDiameter,
            ro: halfLength
        });
        channel = channel.translate([
            halfLength,
            halfLength,
            halfLength
        ]);
        channel = channel.rotateZ(rotation*90);
        
        if (face == 'bottom') {
            channel = channel.rotateY(180);
        } else if (face == 'left') {
            channel = channel.rotateX(90);
        } else if (face == 'right') {
            channel = channel.rotateX(-90);
        } else if (face == 'front') {
            channel = channel.rotateY(90);
        } else if (face == 'back') {
            channel = channel.rotateY(-90);
        } 
        
        this.block = difference(this.block, channel);
    };
    
    this.addLongCurveHole = function(face, rotation) {
        var halfLength = cubeEdgeLength/2.0;
        var tempCube = cube({
            size:cubeEdgeLength,
            center:false
        });
        var curvePart = torus({
            ri: holeDiameter,
            ro: halfLength
        });
        var straightPart = cylinder({
            r: holeDiameter,
            h: halfLength,
            center: true
        });
        
        straightPart = straightPart.rotateY(90);
        straightPart = straightPart.translate([-halfLength/2,halfLength,0]);
        tempCube = tempCube.translate([0,0,-halfLength]);
        curvePart = intersection(curvePart, tempCube);
        
        var hole = union(curvePart, straightPart);
        hole = hole.translate([-holeDiameter,-halfLength,0]);
        
        if (face == 'top') {
            hole = hole.rotateY(90);
            hole = hole.rotateZ(rotation*90);
        } else if (face == 'bottom') {
            hole = hole.rotateY(-90);
            hole = hole.rotateZ(rotation*90);
        } else if (face == 'back') {
            hole = hole.rotateX(rotation*90);
        } else if (face == 'front') {
            hole = hole.rotateZ(180);
            hole = hole.rotateX(rotation*90);
        } else if (face == 'right') {
            hole = hole.rotateZ(90);
            hole = hole.rotateX(rotation*90);
        } else if (face == 'left') {
            hole = hole.rotateZ(-90);
            hole = hole.rotateX(rotation*90);
        } 
        this.block = difference(this.block, hole);
    };
}

function main() {
    var testCubopen1 = new Cubopen(5, 0.85);
    testCubopen1.addCurveHole("front", 1);
    testCubopen1.addStraightChannel("top", false);
    testCubopen1.addStraightChannel("top", true);
    testCubopen1.addStraightChannel("bottom", false);
    
    var block1 = testCubopen1.block;
    block1 = block1.rotateZ(180);
    block1 = block1.translate([6, 0, 0]);
    
    var testCubopen2 = new Cubopen(5, 0.85);
    testCubopen2.addStraightHole("front");
    testCubopen2.addStraightChannel("top", false);
    testCubopen2.addStraightChannel("bottom", true);
    
    var block2 = testCubopen2.block;
    
    var testCubopen3 = new Cubopen(5, 0.85);
    testCubopen3.addCurveChannel("top", 0);
    testCubopen3.addCurveChannel("bottom", 3);
    testCubopen3.addStraightHole("front");
    
    var block3 = testCubopen3.block;
    block3 = block3.translate([-6, 0, 0]);
    
    var testCubopen4 = new Cubopen(5, 0.85);
    testCubopen4.addLongCurveHole("top", 0);
    testCubopen4.addStraightChannel("top", false);
    testCubopen4.addStraightChannel("top", true);
    
    var block4 = testCubopen4.block;
    block4 = block4.translate([12,0,0]);
    
    return union(block1, block2, block3, block4);
}
