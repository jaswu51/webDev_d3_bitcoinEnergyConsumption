d3.csv(`data/bitcoindata/EnergyConsumptionBySource.csv`, d=>{
	return{
		'Year':d.Year,
		'Energy_Source':d.Energy_Source,
		'Consumption_TWh': d.Consumption_TWh,
    'Country':d.Country
	}
}).then(data => {

	createPieChart(data);

})

const createPieChart = (data) => {
  // const data2019 = data.filter(d => d.Year == "2019");
  const data2019 = data.filter(d => d.Year == "2019" & d.Country === "Bitcoin" & d.Energy_Source!='total' );
  const data2020 = data.filter(d => d.Year == "2020");
  const data2021 = data.filter(d => d.Year == "2021");


  const pieData2019 = d3.pie()
    .value((d) => d.Consumption_TWh)
    .sort((a, b) => a.Consumption_TWh - b.Consumption_TWh)(data2019);
var width = 450,
    height = 450,
    outRadius=50,
    outRadius1=60;




const svg=d3.select("#piechart")
.append("svg")
  .attr("width", width)
  .attr("height", height);

const arc1 = d3.arc().innerRadius(0).outerRadius(function(d) {return data.filter(d => d.Year == "2019" & d.Country == "Bitcoin" & d.Energy_Source=='total').map(d => d.Consumption_TWh); });

const arc2 = d3.arc().innerRadius(0).outerRadius(outRadius1);
const label=d3.arc().innerRadius(outRadius-40).outerRadius(outRadius-40);

const color1 = d3.scaleOrdinal(d3.schemeCategory10);
const color2 = d3.scaleLinear().domain([1,3]).range(["green", "yellow"]);

var g1=svg.append("g")
.attr("id", "g1")
.attr("class","pie")
.attr("transform", "translate("+width/2+","+height/2+")")
.selectAll().data(pieData2019).enter();

g1.append("path")
.attr("d",arc1)
.attr("fill", (d, i) => color1(i))
;

var g2=svg.append("g")
.attr("id", "g2")
.attr("class","pie")
    .attr("transform", "translate("+width/5+","+height/5+")").call(
      d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended)
    )
    .selectAll().data(pieData2019).enter();

    g2.append("path")
      .attr("d",arc2)
      .attr("fill", (d, i) => color2(i))
    ;

    const dots =  d3.selectAll('.pie');

const simulation = d3.forceSimulation()
 .alphaDecay(0) // 收斂永不停止
 .velocityDecay(0.2) // 設定摩擦係數
 .force("x", d3.forceX()) // 設定Ｘ軸平移位置
 .force("y", d3.forceY()) // 設定Ｙ軸移動位置
 // 設定中心點位置
 .force("center", d3.forceCenter().x(250).y(150)) 
 // 設定節點間電荷力
 .force("charge", d3.forceManyBody().strength(1))
 // 設定節點間彼此的互斥力
 .force("collide", d3.forceCollide().strength(0.1).radius(40).iterations(0.2));

 simulation.nodes(dots)
          .on("tick", function(d){
            d3.select(this).attr('transform', d => `translate(${d.x},${d.y})`);
            });

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
}
