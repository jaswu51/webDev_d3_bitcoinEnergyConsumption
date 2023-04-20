/* Set the time format
  Ref: https://github.com/d3/d3-time-format */

const parseTime = d3.timeParse("%Y");
console.log(parseTime("2010"));

/* Load the dataset and formatting variables
  Ref: https://www.d3indepth.com/requests/ */
d3.csv(`/data/data.csv`, d3.autoType).then(data => {
	// Print out the data on the console
	console.groupCollapsed("Data from csv file");
	console.table(data)
	console.groupEnd()

	/* Data Manipulation in D3 
		Ref: https://observablehq.com/@d3/d3-extent?collection=@d3/d3-array */

	// Get the minimum and maximum of the percent pay gap
	const minPayGap = d3.min(data, d => d.value);
	const maxPayGap = d3.max(data, d => d.value);
	// const [min, max] = d3.extend(data, d => d.value);

	console.groupCollapsed("Min and Max");
	console.log(`Min pay gap: ${minPayGap}`);
	console.log(`Max pay gap: ${maxPayGap}`);
	console.groupEnd()
	
	// Filter the data from the year 2020
	const data2020 = data.filter(d => d.year === 2020);
	console.groupCollapsed("Data from 2020");
	console.table(data2020)
	console.groupEnd()
	
	// Sort the country by the percentage in the descending order
	const sortedData = data2020.sort((a, b) => d3.descending(a.value, b.value));
	console.groupCollapsed("Sorted Data");
	console.table(sortedData)
	console.groupEnd()

	// Get the mean and median of gender gap percentage
	const mean = d3.mean(data2020, d => d.value);
	const median = d3.median(data2020, d => d.value);
	console.groupCollapsed("Mean and Median");
	console.log(`Mean: ${mean}`);
	console.log(`Median: ${median}`);
	console.groupEnd()

	// Move the color scale here to share with both charts
	const colorScale = d3.scaleOrdinal()
		.domain(data2020.map(d => d.country))
		.range(d3.schemeTableau10);
	console.log(`Color scale: ${colorScale}`);

	// Plot the bar chart
	createBarChart(data);

	// Plot the line chart
	createLineChart(data);
})

const createBarChart = (data) => {
	/* Set the dimensions and margins of the graph
		Ref: https://observablehq.com/@d3/margin-convention */
	
	const width = 900, height = 500;
	const margin = {top: 20, right: 20, bottom: 80, left: 40};
	/* Create the SVG container */
	const svg = d3
		.select("#bar")
		.append("svg")
		.attr("viewBox", [0, 0, width, height]);

	/* Define x-axis, y-axis, and color scales
		Ref: https://observablehq.com/@d3/introduction-to-d3s-scales */
	
	const xScale = d3
		.scaleBand()
		.domain(data.map(d => d.country))
		.range([margin.left, width - margin.right])
		.paddingInner(0.35);

	console.groupCollapsed("xScale");
	console.log(xScale);
	console.log(xScale.bandwidth());
	console.log(xScale.step());
	console.groupEnd();

	const yScale = d3
		.scaleLinear()
		.domain([0, d3.max(data, d => d.value)])
		.range([height - margin.bottom, margin.top])

	const colorScale = d3.scaleOrdinal()
		.domain(data.map(d => d.country))
		.range(d3.schemeTableau10);

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
	.attr("fill", "black");

	/* Create the bars and append them to the chart
		Ref: https://observablehq.com/@d3/enter-update-exit */
	
	svg.selectAll("rect")
	.data(data)
	.join("rect")
	.attr("x", d => xScale(d.country))
	.attr("y", d => yScale(d.value))
	.attr("width", xScale.bandwidth())
	.attr("height", d => yScale(0) - yScale(d.value))
	.attr("fill", d => colorScale(d.country))
	.attr("stroke", "black")
	.attr("stroke-width", 1);


	/* Working with Color: https://observablehq.com/@d3/working-with-color 
		d3-scale-chromatic: https://github.com/d3/d3-scale-chromatic */
	

	/* Create the bar elements and append to the SVG group
		Ref: https://observablehq.com/@d3/bar-chart */
	
	//   svg
	// 	.append("g")
	// 	.attr("class", "bar")
	// 	.selectAll("rect")
	// 	.data(data)
	// 	.join("rect")
	// 		.attr("x", d => xScale(d.country))
	// 		.attr("y", d => yScale(d.value))
	// 		.attr("width", xScale.bandwidth())
	// 		.attr("height", d => yScale(0) - yScale(d.value))
	// 		.attr("fill", d => colorScale(d.country))

	/* Add the tooltip when hover on the bar */
	
	
	/* Create the x and y axes and append them to the chart
		Ref: https://www.d3indepth.com/axes/ and https://github.com/d3/d3-axis */
  
}

const createLineChart = (data, colors) => {
  /* Set the dimensions and margins of the graph */
  

  /* Create the SVG container */
  

  /* Define x-axis, y-axis, and color scales */
  

  /* Construct a line generator
    Ref: https://observablehq.com/@d3/line-chart and https://github.com/d3/d3-shape */
  

  /* Group the data for each country
    Ref: https://observablehq.com/@d3/d3-group */
  

  /* Create line paths for each country */
  

  /* Add the tooltip when hover on the line */
  

  /* Create the x and y axes and append them to the chart */


  /* Add text labels on the right of the chart */
  
}