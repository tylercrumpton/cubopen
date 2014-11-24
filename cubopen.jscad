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
    
    return union(block1, block2, block3);
}
