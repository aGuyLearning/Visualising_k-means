// Functions specific to kmeans

function dist(w, z) {
    return Math.sqrt(Math.pow(w.x - z.x, 2) + Math.pow(w.y - z.y, 2));
}

function choose_init_method(callback) {
    var choices = [{ name: "Ich wähle", choice: "user" },
    { name: "Zufällig", choice: "random" },
    { name: "Weitester Punkt", choice: "farthest" }
    ];

    var title = { text: "Wie wollen sie die anfänglichen Zentroiden wählen?" };

    display_choice(choices, title, callback);
}

function reassign_points() {
    console.log(data)
    for(var j = 0; j < data.length; j++){
        var ibest = 0;
        var dbest = Infinity;
        for(var i = 1; i < centroids.length; i++) {
            var d = dist(data[j], centroids[i]);
            if(d < dbest) {
                dbest = d;
                ibest = i;
            }
        }
        data[j].cluster = ibest;
    }

    console.log(data);
    console.log(centroids);
    svg.selectAll(".dot")
        .transition()
        .style("fill", function (d) { return color(d.cluster); })
        .each(function () {
            d3.select("#next_button")
                .attr("value", "Update Centroids")
                .on("click", update_centroids);
        });
}

function update_centroids() {
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
    }

    svg.selectAll(".centroid")
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
        .attr("value", "   GO!   ")
        .on("click", function () {
            svg.selectAll(".cursor").remove();
            d3.select(".target_rect").remove();
            reassign_points();
        });
}

function add_next_centroid_button(callback) {
    d3.select("#button_area").append("input")
        .attr("id", "next_centroid")
        .attr("name", "nextCentroidButton")
        .attr("type", "button")
        .attr("value", "Add Centroid")
        .on("click", callback);
}

function rm_next_centroid_button() {
    d3.select("#next_centroid").remove();
}

function get_centroids() {
    var centroids = new Array(0);
    centroids.push({ x: -30, y: -30 });  /* -30 for better animation in furthest */
    var centcount = 0;

    if (kmeans_init == "random") {

        function drop_random() {

            centcount += 1;
            var chosen = data[Math.floor(Math.random() * data.length)];
            centroids[centcount] = { x: chosen.x, y: chosen.y, cluster: centcount };

            svg.selectAll(".centroid").data(centroids.slice(1, centroids.length))
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
                centroids[centcount] = { x: best_centroid.x, y: best_centroid.y, cluster: centcount };
            }

            svg.selectAll(".centroid").data(centroids.slice(1, centroids.length))
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
            var cent = { x: x.invert(xy[0]), y: y.invert(xy[1]), cluster: centcount };
            centroids.push(cent);
            console.log
            // draw centroid
            svg.selectAll(".centroid").data(centroids.slice(1, centroids.length))
                .enter().append("circle")
                .attr("class", "centroid")
                .attr("r", 10.0)
                .attr("cx", function (d) { return x(d.x); })
                .attr("cy", function (d) { return y(d.y); })
                .style("fill", function (d) { return color(d.cluster); });

            // draw_voronoi();

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