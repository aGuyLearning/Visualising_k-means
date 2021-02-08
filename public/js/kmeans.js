const { pointer } = require("d3");

// Functions specific to kmeans
var centroids;

function dist(w, z) {
    return Math.sqrt(Math.pow(w.x - z.x, 2) + Math.pow(w.y - z.y, 2));
}
function eu_dist(p1, p2) {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

function getIndexOfK(arr, k) {
    for (var i = 0; i < arr.length; i++) {
        var index = arr[i].indexOf(k);
        if (index > -1) {
            return [i, index];
        }
    }
}

// calculates dunn-index and updates Hull array 
function dunn_index(data, cluster) {
    clusters = d3.groups(data, d => d.cluster);
    console.log(clusters);
    var intra, inter;
    var pts_c = [];
    var ma_d = [];
    var col = [];
    var pts_o = new Array();
    for (var i = 0; i < clusters.length; i++) {
        if (clusters[i][0] == cluster) {
            //get points within a cluster

            pts_c = clusters[i][1];
        }
        else { pts_o = pts_o.concat(clusters[i][1]); }
    }
    if (pts_c.length > 3) {
        //get vertex Hull
        hull = d3.polygonHull(pts_c.map((d) => [d.x, d.y]));

        // calculate distance Matrix intra
        for (var i = 0; i < hull.length; i++) {
            col = [];
            for (var j = 0; j < hull.length; j++) {
                col.push(eu_dist([hull[i][0], hull[i][1]], [hull[j][0], hull[j][1]]));
            }
            ma_d.push(col);
        }

        intra = d3.max(ma_d, function (array) {
            return d3.max(array);
        });
        intra_pts = getIndexOfK(ma_d, intra);
        console.log()

        // reset the distance matrix
        ma_d = [];
        // calculate distance Matrix inter
        for (var i = 0; i < pts_c.length; i++) {
            col = [];
            for (var j = 0; j < hull.length; j++) {
                col.push(dist(pts_c[i], pts_o[j]));
            }
            ma_d.push(col);
        }
        inter = d3.min(ma_d, function (array) {
            return d3.min(array);
        });
        console.log(inter, intra);
        
    }
    else{
        for (var i = 0; i < pts_c.length; i++) {
            col = [];
            for (var j = 0; j < pts_c.length; j++) {
                col.push(eu_dist([pts_c[i][0], pts_c[i][1]], [pts_c[j][0], pts_c[j][1]]));
            }
            ma_d.push(col);
        }
        intra = d3.max(ma_d, function (array) {
            return d3.max(array);
        });
        intra_pts = getIndexOfK(ma_d, intra);
        console.log()

        // reset the distance matrix
        ma_d = [];
        // calculate distance Matrix inter
        for (var i = 0; i < pts_c.length; i++) {
            col = [];
            for (var j = 0; j < hull.length; j++) {
                col.push(dist(pts_c[i], pts_o[j]));
            }
            ma_d.push(col);
        }
        inter = d3.min(ma_d, function (array) {
            return d3.min(array);
        });

    }
    return inter / intra;
}

// function silhouetten_koeffizient(data, point){
//     var a = 0;
//     var b = 0;
//     var min_c_dist = Infinity;
//     var min_c = 0;
//     var pts_c = [];
//     var pts_o = new Array();
//     clusters = d3.groups(data, d => d.cluster);
//     for (var i = 0; i < clusters.length; i++) {
//         if (clusters[i][0] == point.cluster) {
//             //get points within a cluster

//             pts_c = clusters[i][1];
//         }
//         else { pts_o = pts_o.concat(clusters[i][1]); }
//     }
    
//     for (var i = 0; i < pts_c.length; i++){
//         a = a + dist(point,pts_c[i]);
//     }
//     // mean of distance to points in cluster
//     a = a / (pts_c.length -1)

//     for (var i = 0; i < pts_o.length; i++){
//         var c = dist(point, pts_o[i])
//         if (c < min_c_dist){
//             min_c_dist = c;
//             min_c = pts_o[i].cluster
//         }
//     } 
// }

function choose_init_method(callback) {
    var choices = [{ name: "Ich wähle", choice: "user" },
    { name: "Zufällig", choice: "random" },
    { name: "Weitester Punkt", choice: "farthest" }
    ];

    var title = { text: "Wie wollen Sie die anfänglichen Zentroiden wählen?" };

    display_choice(choices, title, callback);
}

function reassign_points() {
    // assign new cluster to each data point
    for (var j = 0; j < data.length; j++) {
        var ibest = 0;
        var dbest = Infinity;
        for (var i = 1; i < centroids.length; i++) {
            var d = dist(data[j], centroids[i]);
            if (d < dbest) {
                dbest = d;
                ibest = i;
            }
        }
        data[j].cluster = ibest;
    }

    g.selectAll(".dot")
        .transition()
        .style("fill", function (d) { return clr[d.cluster]; })
        .each(function () {

            d3.select("#next_button")
                .attr("value", "Update Centroids")
                .on("click", update_centroids);
        });

    // update the lines
    var l = g.selectAll('.line_cluster')
        .data(data);
    var updateLine = function (lines) {
        lines
            .attr("class", "line_cluster")
            .attr('x1', function (d) { return x(d.x); })
            .attr('y1', function (d) { return y(d.y); })
            .attr('x2', function (d) { return x(centroids[d.cluster].x); })
            .attr('y2', function (d) { return y(centroids[d.cluster].y); })
            .attr('stroke', function (d) { return clr[d.cluster]; });
    };
    updateLine(l.enter().append('line'));
    updateLine(l.transition().duration(500));
    l.exit().remove();

    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', function (event) {
            g.selectAll('.line_cluster')
                .attr('transform', event.transform);
            g.selectAll("circle")
                .attr('transform', event.transform);
        });
    svg.call(zoom);
}

function update_centroids() {
    h_array = []
    var new_centroids = new Array(centroids.length);
    var cent_counts = new Array(centroids.length);
    for (var i = 1; i < new_centroids.length; i++) {
        new_centroids[i] = { x: 0.0, y: 0.0, cluster: i };
        cent_counts[i] = 0;
    }
    for (var j = 0; j < data.length; j++) {
        z = data[j];
        cent_counts[z.cluster] += 1;
        new_centroids[z.cluster].x += z.x;
        new_centroids[z.cluster].y += z.y;
    }

    for (var i = 1; i < new_centroids.length; i++) {
        if (cent_counts[i] == 0) {
            // No change
            new_centroids[i].x = centroids[i].x;
            new_centroids[i].y = centroids[i].y;
        }
        else {
            new_centroids[i].x /= cent_counts[i];
            new_centroids[i].y /= cent_counts[i];
        }
    }

    for (var i = 1; i < new_centroids.length; i++) {
        centroids[i].x = new_centroids[i].x;
        centroids[i].y = new_centroids[i].y;
        centroids[i].dunn_index = dunn_index(data, centroids[i].cluster)
    }

    g.selectAll(".centroid")
        .transition()
        .duration(250)
        .attr("cx", function (d) { return x(d.x); })
        .attr("cy", function (d) { return y(d.y); })
        .each(function () {

            d3.select("#next_button")
                .attr("value", "Reassign Points")
                .on("click", reassign_points);
        });





}

function add_go_button() {
    d3.select("#button_area").append("input")
        .attr("id", "next_button")
        .attr("name", "updateButton")
        .attr("type", "button")
        .attr("class", "choice_rect btn btn-success")
        .attr("style", "width: 150px; margin: 5px;")
        .attr("value", "   LOS!   ")
        .on("click", function () {
            g.selectAll(".cursor").remove();
            d3.select(".target_rect").remove();
            reassign_points();
        });
}

function add_next_centroid_button(callback) {
    d3.select("#button_area").append("input")
        .attr("id", "next_centroid")
        .attr("name", "nextCentroidButton")
        .attr("type", "button")
        .attr("class", "choice_rect btn btn-success")
        .attr("style", "width: 150px; margin: 5px;")
        .attr("value", "Neuer Zentroid")
        .on("click", callback);
}

function rm_next_centroid_button() {
    d3.select("#next_centroid").remove();
}

function get_centroids() {
    h_array = [];
    centroids = new Array(0);
    centroids.push({ x: -30, y: -30 });  /* -30 for better animation in furthest */
    var centcount = 0;

    if (kmeans_init == "random") {

        function drop_random() {

            centcount += 1;
            var chosen = data[Math.floor(Math.random() * data.length)];
            centroids[centcount] = { x: chosen.x, y: chosen.y, cluster: centcount, dunn_index: 0 };

            g.selectAll(".centroid").data(centroids.slice(1, centroids.length))
                .enter().append("circle")
                .attr("class", "centroid")
                .attr("r", 10.0)
                .style("fill", function (d) { return color(d.cluster); })
                .attr("cx", x(-20.0))
                .attr("cy", x(-20.0))
                .transition()
                .attr("cx", function (d) { return x(d.x); })
                .attr("cy", function (d) { return y(d.y); });



            if (centcount == 2) {
                add_go_button();
            }

            if (centcount >= 10) {
                rm_next_centroid_button();
            }
        }

        add_next_centroid_button(drop_random);

        return centroids;
    }

    else if (kmeans_init == "farthest") {

        function drop_furthest() {

            centcount += 1;

            /* Choose first centroid randomly */
            if (centcount == 1) {
                var chosen = data[Math.floor(Math.random() * data.length)];
                centroids[1] = { x: chosen.x, y: chosen.y, cluster: 1 };
            } else {
                /* Choose rest as furthest from others */
                var best_length = 0;
                var best_centroid = null;
                for (var i = 0; i < data.length; i++) {
                    var inner_best_length = Infinity;
                    for (var j = 1; j < centcount; j++) {
                        inner_best_length = Math.min(inner_best_length, dist(data[i], centroids[j]));
                    }
                    if (inner_best_length > best_length) {
                        best_length = inner_best_length;
                        best_centroid = data[i];
                    }
                }
                centroids[centcount] = { x: best_centroid.x, y: best_centroid.y, cluster: centcount, dunn_index: 0 };
            }

            g.selectAll(".centroid").data(centroids.slice(1, centroids.length))
                .enter().append("circle")
                .attr("class", "centroid")
                .attr("r", 10.0)
                .style("fill", function (d) { return color(d.cluster); })
                .attr("cx", x(centroids[centcount - 1].x))
                .attr("cy", y(centroids[centcount - 1].y))
                .transition()
                .attr("cx", function (d) { return x(d.x); })
                .attr("cy", function (d) { return y(d.y); });



            if (centcount == 2) {
                add_go_button();
            }

            if (centcount >= 10) {
                rm_next_centroid_button();
            }
        }

        add_next_centroid_button(drop_furthest);

        return centroids;

    }

    else if (kmeans_init == "user") {
        svg.on("click", function (event) {
            if (centcount >= 10) {
                return;
            }
            centcount += 1;
            var xy = d3.pointer(event, svg.node());
            var cent = { x: x.invert(xy[0]), y: y.invert(xy[1]), cluster: centcount, dunn_index: 0 };
            centroids.push(cent);
            // draw centroid
            g.selectAll(".centroid").data(centroids.slice(1, centroids.length))
                .enter().append("circle")
                .attr("class", "centroid")
                .attr("r", 10.0)
                .attr("cx", function (d) { return x(d.x); })
                .attr("cy", function (d) { return y(d.y); })
                .style("fill", function (d) { return color(d.cluster); });

            if (centcount == 2) {
                add_go_button();
            }

            if (centcount >= 10) {
                cursor.remove();
                d3.select(".target_rect").remove();
            }
        });
        return centroids;
    }
}