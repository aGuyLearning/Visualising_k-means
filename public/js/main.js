// Some global variables
var svg;
var data;
var centroids;
var drop_centroid;
var kmeans_init;

function restart() {
    /* Reset global variables */
    data = [];
    centroids = [];
    drop_centroid = true;
    kmeans_init = "none";

    setup();

    choose_init_method(function() {
        kmeans_init = choice;

        choose_data(function(){
            data = choice();
            draw(data);
            centroids = get_centroids();
        });
    });
}