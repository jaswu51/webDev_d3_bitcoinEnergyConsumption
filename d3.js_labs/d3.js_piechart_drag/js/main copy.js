const data = [
  { name: "外包", value: 3000 },
  { name: "金融", value: 4754 },
  { name: "制造", value: 1120 },
  { name: "咨询", value: 4032 }
];

d3.csv(`d3.js_piechart_drag/data/bitcoindata/BitcoinEnergyConsumptionBySource.csv`, d=>{
	return{
		'Year':d.Year,
		'Energy_Source':d.Energy_Source,
		'Consumption_TWh':+d.Consumption_TWh,
	}
}).then(data => {
	const data2020 = data.filter(d => d.year === 2020);
	
	createLineChart(data2020);
})



const createBarChart = (data) => {}
var width = 450,
    height = 450,
    outRadius=100,
    outRadius1=60;

const svg=d3.select("#piechart")
.append("svg")
  .attr("width", width)
  .attr("height", height);

  const pieData = d3.pie()
    .value((d) => d.value)
    .sort((a, b) => a.value - b.value)(data);

const arc1 = d3.arc().innerRadius(0).outerRadius(outRadius);
const arc2 = d3.arc().innerRadius(0).outerRadius(outRadius1);
const label=d3.arc().innerRadius(outRadius-40).outerRadius(outRadius-40);

const color1 = d3.scaleOrdinal(d3.schemeCategory10);
const color2 = d3.scaleLinear().domain([1,3]).range(["green", "yellow"]);

var g1=svg.append("g").attr("id", "g1").attr("transform", "translate("+width/2+","+height/2+")").selectAll().data(pieData).enter();
g1.append("path")
  .attr("d",arc1)
  .attr("fill", (d, i) => color1(i))
;

g1.append("text")
    .attr("transform", function(d){return "translate(" + label.centroid(d) + ")"; })
    .style("font-size","10px")
    .attr("dy", "0.35em")
    .attr('text-anchor', 'middle')
    .text(function(d,i) {return data[i].name; });

d3.select("#g1")
.transition()
    .duration(2000)
    .attr("transform", 500);

    const g2=svg.append("g").attr("id", "g2").attr("transform", "translate("+width/5+","+height/5+")").call(
      d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended)
    )
    .selectAll().data(pieData).enter();

    g2.append("path")
      .attr("d",arc2)
      .attr("fill", (d, i) => color2(i))
    ;
    
    g2.append("text")
        .attr("transform", function(d){return "translate(" + label.centroid(d) + ")"; })
        .style("font-size","10px")
        .attr("dy", "0.35em")
        .attr('text-anchor', 'middle')
        .text(function(d,i) {return data[i].name; });
        function dragstarted(_event) {
          d3.select(this).raise().classed("active", true);
      }
      
      function dragged(event) {
          d3.select(this).attr("transform", "translate("+event.x+","+event.y+")");
          
      
      }
      
      
      function dragended(event) {
        const another_x= d3.select("#g1").attr("transform").match(/(?<=\()\d{1,}(?=\,)/);
        const another_y= d3.select("#g1").attr("transform").match(/\d{1,}(?=\))/);
        const a=another_x-event.x;
        const b=another_y-event.y;
        var distance=Math.sqrt( a*a + b*b );
        console.log(another_x);
        console.log(another_y);
        console.log(distance);
        if (distance<Math.abs(outRadius+outRadius1)){
          d3.select(this).attr("transform", "translate("+d3.select("#g1").attr("transform").match(/(?<=\()\d{1,}(?=\,)/)+","+d3.select("#g1").attr("transform").match(/\d{1,}(?=\))/)+")");
        }
        d3.select(this).classed("active", false);
      }