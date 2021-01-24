// Functions for making choice buttons

var choice = null; // global variable indicating user choice

function make_choice(d, next_fn) {
    d3.select("#choice_area").selectAll(".choice_rect").remove();
    d3.select("#choice_area").selectAll(".choice_title").remove();

    choice = d.choice;
    next_fn(choice);
}

function display_choice(choices, title, next_fn) {
    choice = null;

    // Make the title
    d3.select("#choice_area")
    .append("h4")
    .attr("class", "card-title choice_title")
    .html(title.text);

    // Make the rectangles
    var choice_rects = d3.select("#choice_area").selectAll(".choice_rect")
    .data(choices)
    .enter().append("input")
    .attr("class", "choice_rect btn btn-light")
    .attr("style", "width: 150px; margin: 5px;")
    .attr("type", "button")
    .attr("value", function(d){return d.name;})
    .style("cursor", "pointer")
    .on("click", function(event,d) { make_choice(d, next_fn); } );

    
}
