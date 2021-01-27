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


function setup() {
    // Iremove former svg and choice elements
    d3.select("svg").remove();
    d3.selectAll('.choice_rect').remove();
    d3.select('.choice_title').remove();

    // initiallize svg
    svg = d3.select("#svg_area").append("svg")
        .attr("width", "100%")
        .attr("height", "500px")
        .attr("viewBox", "0 0 " + width + " " + height)
        .style('cursor', 'pointer');


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

// draw scaled data points and add little animation
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

// render the available example data buttons and activate their functions
function choose_data(callback) {
    algo = choice;

    var unif_dat = function () { return uniform(250); };
    var threenorm_dat = function () { return threenorm(250); };
    var density = function () { return density_bars(500); };

    var choices = [
        { name: "Uniform Points", choice: unif_dat },
        { name: "Gaussian Mixture", choice: threenorm_dat },
        { name: "Density Bars", choice: density }
    ];

    var title = { text: "Wie sollen deine Daten aussehen?" };

    display_choice(choices, title, callback);
}
