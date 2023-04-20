const parseTime = d3.timeParse("%Y");
console.log(parseTime("2010"));

/* Load the dataset and formatting variables
  Ref: https://www.d3indepth.com/requests/ */
d3.csv(`data/bitcoindata/Annualized bitcoin electricity consumption (unit_ kilowatt-hours). - 工作表1.csv`, d=>{
	return{
		'Year':d.Year,
		'Electricity_comsumption_KWh':d.Electricity_comsumption_KWh,
		'Cumulative_comsumption_KWh':d.Cumulative_comsumption_KWh
	}
}).then(data => {

	createBarChart(data);
	createMap(data);

})

const createBarChart = (data) => {
	/* Set the dimensions and margins of the graph
		Ref: https://observablehq.com/@d3/margin-convention */
	
	const width = 900, height = 500;
	const margin = {top: 50, right: 20, bottom: 80, left: 90};
	/* Create the SVG container */
	const svg = d3
		.select("#bar")
		.append("svg")
		.attr("viewBox", [0, 0, width, height]);

	/* Define x-axis, y-axis, and color scales
		Ref: https://observablehq.com/@d3/introduction-to-d3s-scales */
	
	const xScale = d3
		.scaleBand()
		.domain(data.map(d => d.Year))
		.range([margin.left, width - margin.right])
		.paddingInner(0.35);

	console.groupCollapsed("xScale");
	console.log(xScale);
	console.log(xScale.bandwidth());
	console.log(xScale.step());
	console.groupEnd();

	const yScale = d3
		.scaleLinear()
		.domain([0, 120])
		.range([height - margin.bottom, margin.top])


	/* Create the x and y axes and append them to the chart
		Ref: https://observablehq.com/@d3/axes */
	
	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScale);




	svg.append("g")
	.attr("transform", `translate(0, ${height - margin.bottom})`)
	.call(xAxis)
	.selectAll("text")
	.attr("transform", "rotate(-45)")
	.attr("text-anchor", "end")
	.attr("font-size", "12px")
	.attr("fill", "black");

	svg.append("g")
	.attr("transform", `translate(${margin.left}, 0)`)
	.call(yAxis)
	.selectAll("text")
	.attr("font-size", "12px")
	.attr("fill","black");

  svg.append("g")
   .attr("transform", "translate(" + (width/2 - 250) + "," + 20 + ")")
   .append("text")
   .text("Annualized Bitcoin Mining Electricity Consumption (unit TWh)")
   .attr("class", "title")

	const Year=data.map(d=>d.Year);
	const color = d3.scaleOrdinal().domain(Year).range(d3.schemeTableau10);

	  svg
		.append("g")
		.attr("class", "bar")
		.selectAll("rect")
		.data(data)
		.join("rect")
			.attr("x", d => xScale(d.Year))
			.attr("y", d => yScale(d.Electricity_comsumption_KWh/1000))
			.attr("width", xScale.bandwidth())
			.attr("height", d => yScale(0) - yScale(d.Electricity_comsumption_KWh/1000))
			.attr("fill", color);
}


const createMap = (data) =>  {
  // Define a height for the map. We'll use Observable's derived width.
  const height = 600;
  const width = 1500;
  const svg=d3.select('body').append('svg').attr('width',width).attr('height',height);
  const projection=d3.geoMercator().scale(150).translate([width/3,height/1.3]);

  const path=d3.geoPath(projection);
  const g=svg.append('g');
  d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(data =>{
    const countries=topojson.feature(data,data.objects.countries);
    g.selectAll('path').data(countries.features).enter().append('path').attr('class','country').attr('fill',function(d){ 
                        var str = d.properties.name;
                        if (str.includes("Finland")|str.includes("Kazakhstan")|str.includes("Philippines")|str.includes("Netherlands")|str.includes("Kazakhstan")) { return "blue"}
                                          else {return "pink";
                                        }
                                    }).attr('d',path);
    console.log(countries.features[0].properties.name);
  })

  svg.append("g")
  .attr("transform", "translate(" + (width/2 - 600) + "," + 20 + ")")
  .append("text")
  .text("Countries whose Electricity Consumption is within range +/- 20% of Bitcoin in 2021")
  .attr("class", "title")

  svg.append("g")
  .attr("transform", "translate(" + (width/2+100 ) + "," + 40 + ")")
  .append('rect').attr('width',40).attr('height',15).attr('fill','blue')
  svg.append("g")
  .attr("transform", "translate(" + (width/2+150 ) + "," + 50 + ")")
  .append("text")
  .text("Countries")
  .style('font-size', '15px')
  svg.append("g")
  .attr("transform", "translate(" + (width/2-300 ) + "," + 300 + ")")
  .append("text")
  .text("Netherlands")
  .style('font-size', '12px')
  svg.append("g")
  .attr("transform", "translate(" + (width/2-230 ) + "," + 220 + ")")
  .append("text")
  .text("Finland")
  .style('font-size', '12px')
  svg.append("g")
  .attr("transform", "translate(" + (width/2+40 ) + "," + 460 + ")")
  .append("text")
  .text("Philippines")
  .style('font-size', '12px')
  svg.append("g")
  .attr("transform", "translate(" + (width/2-100 ) + "," + 280 + ")")
  .append("text")
  .text("Kazakhstan")
  .style('font-size', '12px')
}
