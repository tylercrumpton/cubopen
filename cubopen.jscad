function mainCube(cubesize) {
    return cube({size: cubesize, center: true});
}

function addStraightHole(cube, face) {
    var hole = cylinder({r: 0.85, h: 5, center: true});
    if (face == 'left' || face == 'right') {
        hole = hole.rotateX(90);
    } else if (face == 'front' || face == 'back') {
        hole = hole.rotateY(90);
    }
    return difference(cube, hole);
}

function addCurveHole(cube, face, rotation) {
    var hole = torus({ri: (0.85), ro: (5.0/2)});
    if (face == 'front') {
        hole = hole.translate([5.0/2,5.0/2,0]);
        hole = hole.rotateX(rotation*90);
    } else if (face == 'back') {
        hole = hole.translate([-5.0/2,5.0/2,0]);
        hole = hole.rotateX(rotation*90);
    } else if (face == 'left') {
        hole = hole.translate([5.0/2,-5.0/2,0]);
        hole = hole.rotateY(rotation*90);
    } else if (face == 'right') {
        hole = hole.translate([5.0/2,5.0/2,0]);
        hole = hole.rotateY(rotation*90);
    } 
    return difference(cube, hole);
}

function addStraightChannel(cube, face, doRotate) {

    var channel = cylinder({r: 0.85, h: 5, center: true});
    channel = channel.rotateY(90);
    if (doRotate) {
        channel = channel.rotateZ(90);
    }
    channel = channel.translate([0,0,2.5]);
    
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

    return difference(cube, channel);
}

function main() {
    var size = 5;
    
    var block1 = mainCube(size);
    block1 = addCurveHole(block1, "front", 1);
    block1 = addStraightChannel(block1, "top", false);
    block1 = addStraightChannel(block1, "top", true);
    
    block2 = mainCube(size);
    block2 = addStraightHole(block2, "front");
    block2 = addStraightChannel(block2, "top", false);
    block2 = addStraightChannel(block2, "bottom", true);
    
    return block1;
}
