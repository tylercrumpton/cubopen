function Cubopen(cubeEdgeLength, holeDiameter, squareHoles) {
    var sqrt2 = 1.41421356; // Square-root of 2
    this.fn = squareHoles ? 4 : CSG.defaultResolution2D;
    this.cubeEdgeLength = cubeEdgeLength;
    this.holeRadius = squareHoles ? holeDiameter*sqrt2/2.0 : holeDiameter/2.0;
    this.block = cube({
        size: cubeEdgeLength, 
        center: true
    });


    this.addStraightHole = function(face) {
        var hole = cylinder({
            r: this.holeRadius,
            h: this.cubeEdgeLength,
            center: true,
            fn:this.fn
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
            ri: this.holeRadius,
            ro: halfLength,
            fni:this.fn
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
            r: this.holeRadius,
            h: this.cubeEdgeLength,
            center: true,
            fn:this.fn
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
            ri: this.holeRadius,
            ro: halfLength,
            fni:this.fn
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
        var halfLength = this.cubeEdgeLength/2.0;
        var tempCube = cube({
            size:this.cubeEdgeLength,
            center:false
        });
        var curvePart = torus({
            ri: this.holeRadius,
            ro: halfLength,
            fni:this.fn
        });
        var straightPart = cylinder({
            r: this.holeRadius,
            h: halfLength,
            center: true,
            fn:this.fn
        });
        
        straightPart = straightPart.rotateY(90);
        straightPart = straightPart.translate([-halfLength/2,halfLength,0]);
        tempCube = tempCube.translate([0,0,-halfLength]);
        curvePart = intersection(curvePart, tempCube);
        
        var hole = union(curvePart, straightPart);
        hole = hole.translate([-this.holeRadius,-halfLength,0]);
        
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
    var cubeSize = 50;
    var holeDiameter = 16;

    var testCubopen1 = new Cubopen(cubeSize, holeDiameter);
    testCubopen1.addCurveHole("front", 1);
    testCubopen1.addStraightChannel("top", false);
    testCubopen1.addStraightChannel("top", true);
    testCubopen1.addStraightChannel("bottom", false);
    
    var block1 = testCubopen1.block;
    block1 = block1.rotateZ(180);
    block1 = block1.translate([cubeSize*1.1, 0, 0]);
    
    var testCubopen2 = new Cubopen(cubeSize, holeDiameter);
    testCubopen2.addStraightHole("front");
    testCubopen2.addStraightChannel("top", false);
    testCubopen2.addStraightChannel("bottom", true);
    
    var block2 = testCubopen2.block;
    
    var testCubopen3 = new Cubopen(cubeSize, holeDiameter);
    testCubopen3.addCurveChannel("top", 0);
    testCubopen3.addCurveChannel("bottom", 3);
    testCubopen3.addStraightHole("front");
    
    var block3 = testCubopen3.block;
    block3 = block3.translate([-cubeSize*1.1, 0, 0]);
    
    var testCubopen4 = new Cubopen(cubeSize, holeDiameter);
    testCubopen4.addLongCurveHole("top", 0);
    testCubopen4.addStraightChannel("top", false);
    testCubopen4.addStraightChannel("top", true);
    
    var block4 = testCubopen4.block;
    block4 = block4.translate([2*cubeSize*1.1,0,0]);
    
    return union(block1, block2, block3, block4);
}
