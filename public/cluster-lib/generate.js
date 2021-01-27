// Functions for generating data

// Returns vanilla data with 3 circular normals
function threenorm(n) {
    var rnorm = d3.randomNormal();
    var data = new Array(n);

    for(var i = 0; i < n; i++){
        var j = Math.floor(Math.random() * 3);
        if(j % 3 == 0){
            mux = -6;
            muy = -6;
        }
        else if(j % 3 == 1){
            mux = 6;
            muy = -6;
        }
        else {
            mux = 0;
            muy = 6;
        }
        data[i] = {x: rnorm() + mux, y: rnorm() + muy, cluster: 0};
    }

    return data;
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

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

