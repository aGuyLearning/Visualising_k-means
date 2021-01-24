var margin = 40, width = 1000, height = 500;

var x
var y


var clr = ["white", "red", "blue", "green", "yellow", "black", "purple", "grey", "brown", "orange", "pink"];
function color(i) {
    if (i == 0) {
        return clr[0];
    }
    else {
        return clr[1 + (i - 1) % (clr.length - 1)];
    }
}

function dist(w, z) {
    return Math.sqrt(Math.pow(w.x - z.x, 2) + Math.pow(w.y - z.y, 2));
}

function setup() {
    // Iremove former svg and choice elements
    d3.select("svg").remove();
    d3.selectAll('.choice_rect').remove();
    d3.select('.choice_title').remove();

    // initiallize svg
    svg = d3.select("#svg_area").append("svg")
        .attr("width", "100%")
        .attr("height", "500px")
        .attr("viewBox", "0 0 " + width + " " + height);


    // Initialize the restart button
    d3.select("#button_area").selectAll("input").remove();

    d3.select("#button_area")
        .append("input")
        .attr("class", "restart_button btn btn-primary")
        .attr("name", "restart_button")
        .attr("type", "button")
        .attr("value", "Restart")
        .on("click", restart);
}

function draw(data) {

    // coordinate scaling
    xMinMax = d3.extent(data,function(d){
        return parseFloat(d.x)
    })
    yMinMax = d3.extent(data,function(d){
        return parseFloat(d.y)
    })
    x = d3.scaleLinear()
        .range([0 + margin, width - margin])
        .domain(xMinMax);

    y = d3.scaleLinear()
        .range([height - margin, 0 + margin])
        .domain(yMinMax);

    // Axis
    xAxis = d3.axisBottom(x);
    yAxis = d3.axisLeft(y);

    xAxisG = svg.append('g')
        .attr('id', 'xAxis')
        .attr('class', 'axis');
    
    yAxisG = svg.append('g')
        .attr('id', 'yAxis')
        .attr('class', 'axis');

    xAxisG.call(xAxis)
        .attr('transform', 'translate(0, ' + (height -margin) + ')');

    yAxisG.call(yAxis)
        .attr('transform', 'translate(' + margin + ',0)');



    // actually drawing points
    var points = svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function (d, i) { return x(30 * Math.cos(i / 5)); })
        .attr("cy", function (d, i) { return y(30 * Math.sin(i / 5)); })
        .style("fill", function (d) { return color(d.cluster); })
        .style("stroke", "black")
        .style("stroke-width", "1px");

    points.transition()
        .duration(500)
        .attr("cx", function (d) { return x(d.x); })
        .attr("cy", function (d) { return y(d.y); });
}

function choose_data(callback) {
    algo = choice;

    //var smiley_dat = function() { return smiley(500); };
    var unif_dat = function () { return uniform(250); };
    var threenorm_dat = function () { return threenorm(250); };
    //var pimples_dat = function() { return pimples(500); };
    var circles = function () { return circle_pack(500); };
    var density = function () { return density_bars(500); };
    var dbscan_dat = function () { return dbscan_all(); };
    var dbscan_nonunique = function () { return dbscan_borders(); };

    var choices = [
        { name: "Uniform Points", choice: unif_dat },
        { name: "Gaussian Mixture", choice: threenorm_dat },
        //{name: "Smiley Face", choice: smiley_dat, txtpos_x: 6.6},
        { name: "Density Bars", choice: density },
        { name: "Packed Circles", choice: circles },
        //{name: "Pimpled Smiley", choice: pimples_dat, txtpos_x: 5.8},
        { name: "DBSCAN Rings", choice: dbscan_dat },
        { name: "Example A", choice: dbscan_nonunique }
    ];

    var title = { text: "Wie sollen deine Daten aussehen?" };

    display_choice(choices, title, callback);
}
