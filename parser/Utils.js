function distanceBetweenPoints(point1, point2) {
    var dist = Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2) + Math.pow(point1[2] - point2[2], 2));
    return dist;
}

/*
* @brief clacula o angulo que um vetor no plano xy faz com o eixo dos xs;
* angulo de rotacao em relacao ao eixo dos z's.
* */
function calculateRotZ(vec) {
    var vecDist = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));
    if(vecDist == 0) {
        return 0;
    }
    var ang = Math.acos(vec[0]/vecDist);
    if(vec[1] < 0) {
        ang = -ang;
    }
    console.log("Par o vec "+vec+" o angulo rotZ e "+ang);
    return ang;
}

/*
* @brief clacula o angulo que um vetor no plano xz faz com o eixo dos xs;
* angulo de rotacao em relacao ao eixo dos y's.
* */
function calculateRotY(vec) {
    var vecDist = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[2], 2));
    if(vecDist == 0) {
        return 0;
    }
    var ang = Math.acos(vec[0]/vecDist);
    if(vec[2] > 0) {
        ang = -ang;
    }
    console.log("Par o vec "+vec+" o angulo rotY e "+ang);
    return ang;
}

/*
* @brief angulo de rotacao em relacao ao eixo dos z's
* entre dois vetores
* */
function rotZBetweenVectors(vec1, vec2) {
    var vec1Dist = Math.sqrt(Math.pow(vec1[0], 2) + Math.pow(vec1[1], 2));
    var vec2Dist = Math.sqrt(Math.pow(vec2[0], 2) + Math.pow(vec2[1], 2));
    var ang = Math.acos((vec1[0] * vec2[0] + vec1[1] * vec2[1])/(vec1Dist * vec2Dist));

    return ang;
}

/*
* @brief angulo de rotacao em relacao ao eixo dos y's
* entre dois vetores
* */
function rotYBetweenVectors(vec1, vec2) {
    var vec1Dist = Math.sqrt(Math.pow(vec1[0], 2) + Math.pow(vec1[2], 2));
    var vec2Dist = Math.sqrt(Math.pow(vec2[0], 2) + Math.pow(vec2[2], 2));
    var ang = Math.acos((vec1[0] * vec2[0] + vec1[2] * vec2[2])/(vec1Dist * vec2Dist));

    return ang;
}

function getDirectionVec(point, target) {
    var direction = [
        target[0] - point[0],
        target[1] - point[1],
        target[2] - point[2]
    ]
    return direction;
}

function calculateDeltaTranslation(pos, deltaPos, distanceToGo, dist) {
    let vectorToGo = [
        pos[0] + deltaPos[0] * (distanceToGo/dist),
        pos[1] + deltaPos[1] * (distanceToGo/dist),
        pos[2] + deltaPos[2] * (distanceToGo/dist)
    ];
    return vectorToGo;
}
