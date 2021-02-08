
var margin = 40, width = 650, height = 500;
var k = height / width,
    x,
    y,
    z = d3.schemeCategory10;
var svg, g, hull;
var clr = ["white", "red", "blue", "green", "yellow", "black", "purple", "grey", "brown", "orange", "pink"];



function color(i) {
    if (i == 0) {
        return clr[0];
    }
    else {
        return clr[1 + (i - 1) % (clr.length - 1)];
    }
}

// setting up the svg and restart button
// also removes previous
function setup() {
    // Iremove former svg and choice elements
    d3.select("svg").remove();
    d3.selectAll('.choice_rect').remove();
    d3.select('.choice_title').remove();

    // initiallize svg
    svg = d3.select("#svg_area").append("svg")
        .attr("width", "100%")
        .attr("height", "500px")
        .attr("viewBox", [0, 0, width, height])
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

    // Axis
    xMinMax = d3.extent(data, function (d) {
        return parseFloat(d.x)
    })
    yMinMax = d3.extent(data, function (d) {
        return parseFloat(d.y)
    })
    x = d3.scaleLinear()
        .range([0 + margin, width - margin])
        .domain(xMinMax);

    y = d3.scaleLinear()
        .range([height - margin, 0 + margin])
        .domain(yMinMax);

    svg.selectAll(".domain")
        .style("display", "none");


    // actually drawing points

    g = svg.append('g')

    var points = g.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function (d, i) { return x(30 * Math.cos(i / 5)); })
        .attr("cy", function (d, i) { return y(30 * Math.sin(i / 5)); })
        .style("fill", function (d) { return color(d.cluster); })
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .on("mouseover", function (event, d) {
            // get dunn-index from clusters
            var d_i;
            for (var i = 0; i < centroids.length; i++) {
                if (centroids[i].cluster == d.cluster) {
                    d_i = centroids[i].dunn_index;
                }
            }
            // var s_c = silhouetten_koeffizient(data, d);
            // render HTML for tooltip
            html = 'X: ' + d.x + '<br />';
            html += 'Y: ' + d.y + '<br />';
            html += 'Cluster: ' + d.cluster + '<br />';
            html += 'Dunn-index: ' + d_i + '<br />';
            // html += 'Silhouetten-Koeffizient: ' + s_c + '<br />';

            // populate tooltip
            d3.select('#tooltip')
                .html(html)
                .style('left', event.pageX - 100 + "px")
                .style('top', event.pageY - 150 + "px")
                .style('opacity', 0.85);
        })
        .on('mouseout', function () {
            d3.select('#tooltip')
                .style('left', -1000)
                .style('opacity', 0);
            g.select('path').remove();
        });

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



