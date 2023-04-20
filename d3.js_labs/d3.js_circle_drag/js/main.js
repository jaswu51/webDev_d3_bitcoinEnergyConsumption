data= [
  { x: 10, y: 10, r:10,color: "red" },
  { x: 40, y: 40, r:10,color: "yellow" },
  { x: 70, y: 70, r:10,color: "blue" }
];
svg=d3.select('#piechart').append("svg")
.attr("width", document.body.clientWidth)
.attr("height", document.body.clientWidth);

svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .style("stroke", "gray")
    .style("fill", "black")
    .attr("r", d=>d.r)
    .attr("cx",  d=>d.x)
    .attr("cy",  d=>d.y)
    .on("mouseover", function (d) {d3.select(this).style("cursor", "move");})
    .on("mouseout", function (d) {})
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));
function dragstarted(event) {
      d3.select(this).raise().classed("active", true);
  }

  function dragged(event) {
      d3.select(this).attr("cx", x = event.x).attr("cy", y = event.y);
  }

  function dragended(event) {
    d3.select(this).classed("active", false);
  }