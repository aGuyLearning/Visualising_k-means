// Functions for generating data

// Returns vanilla data with 3 circular normals
function threenorm(n) {
    var random = d3.randomNormal(0, 0.2),
    sqrt3 = Math.sqrt(3),
    points0 = d3.range(50).map(function() { return {x:random() + sqrt3,y: random() + 1, cluster:0} }),
    points1 = d3.range(50).map(function() { return {x:random() - sqrt3,y: random() + 1, cluster:0}; }),
    points2 = d3.range(50).map(function() { return {x:random(),y: random() - 1, cluster:0}; }),
    points = d3.merge([points0, points1, points2]);
    return points;

    
}
// Uniformly
function uniform(n) {
    var data = new Array(n);

    for(var i = 0; i < n; i++) {
        data[i] = {x: Math.random() * 20 - 10, y: Math.random() * 20 - 10, cluster: 0};
    }

    return data;
}

// Varying density
function density_bars(n) {
    var data = new Array(n);
    for(var i = 0; i < n; i++) {
        var u = Math.floor(8 * Math.random());
        var y = Math.random() * 8 - 4;
        var x;
        if(u == 0) {
            x = Math.random() * 20 / 3 - 10;
        }
        else if(u  <= 6) {
            x = Math.random() * 20 / 3 - 10 + 20 / 3;
        }
        else {
            x = Math.random() * 20 / 3 - 10 + 40 / 3;
        }
        data[i] = {x: x, y: y, cluster: 0};
    }
    return data;
}



