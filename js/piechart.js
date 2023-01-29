d3.csv(`data/EnergyConsumptionBySource.csv`, d=>{
    return{
      'Year':d.Year,
      'Energy_Source':d.Energy_Source,
      'Consumption_TWh': parseFloat(d.Consumption_TWh),
      'Country':d.Country,
    };
}).then(data => {
  createPieChart(data);
})

//create the pie chart
const createPieChart = (data) => {


  //initialization
  const windowWidth = window.innerWidth/1.1, windowHeight = window.innerHeight/1.5;
  const Energy_Source_list = ["nuclear", "fossil_fuels", "renewable"];
  const color_list = ["rgba(233,233,12,0.6)","rgba(33,23,122,0.6)","rgba(175,238,238,0.6)"] //175,238,238  33,23,122
  const value_range=0.2;
  const outRadius_Bitcoin=data.filter(d => d.Year == "2020" & d.Country == "Bitcoin" & d.Energy_Source=='total').map(d => d.Consumption_TWh/1.5)[0];
  var svg_legends=d3.select("#piechart")
    .append("svg")
    .attr("id","inner_piechart")
    .attr("width", windowWidth)
    .attr("height", windowHeight);

  //read the data
  const data2020 = data.filter(d => d.Year == "2020" & d.Energy_Source!='total');
  const data2020_bitcoin=data.filter(d => d.Year == "2020" & d.Energy_Source!='total' & d.Country=="Bitcoin");
  const data2020_bitcoinConsumption=data.filter(d => d.Year == "2020" & d.Energy_Source=='total' & d.Country=="Bitcoin").map(d=>d.Consumption_TWh);
  const data2020_nearBitcoin=data.filter(d => d.Year == "2020" & d.Country!="Bitcoin" & d.Energy_Source=='total' & ((d.Consumption_TWh<(data2020_bitcoinConsumption[0]*(1+value_range))) & (d.Consumption_TWh>(data2020_bitcoinConsumption[0]*(1-value_range)))));
  const country_list=  Array.from(d3.group(data2020_nearBitcoin, d => d.Country).keys());
  

  //call functions
  drawLegend();drawBitcoinPie();drawCountryPie();floating();
  
  function drawLegend(){

      //add the legend
      for (let i = 0; i < Energy_Source_list.length; i++) {
        svg_legends.append('rect')
        .attr('x', width/20)
        .attr('y', 30+i*20)
        .attr('width', 30)
        .attr('height', 10)
        .attr('fill', color_list[i]);

        svg_legends.append("text")
        .text(Energy_Source_list[i])
        .attr("x", width/9)             
        .attr("y", 37+i*20)
        .attr('text-anchor', 'start')
        .style("font-size","12px");
      };
}

function drawBitcoinPie(){
  //create bitcoin pie chart
  var  g_bitcoin=svg_legends.append("g")
  .attr("transform",  "translate("+Math.round(windowWidth/2)+","+Math.round(windowHeight/2)+")")
  .attr("id","bitcoinPie")
  .call(
    d3.drag()
  .on("start", dragstarted)
  .on("drag", dragged)
  .on("end", dragended)
  )
  .selectAll().data(d3.pie()
  .value((d) => d.Consumption_TWh)
  .sort((a, b) => a.Energy_Source - b.Energy_Source)(data2020_bitcoin)).enter();

  g_bitcoin.append("path")
  .attr("d",d3.arc().innerRadius(0).outerRadius(outRadius_Bitcoin))
  .attr("fill", function(d, i) {
  return color_list[i%3] // here it is picking up colors in sequence
  });

  g_bitcoin.append("text")
  .text("Bitcoin")
  .attr("x", 0)             
  .attr("y", function(d) {return -data.filter(d => d.Year == "2020" & d.Country == "Bitcoin" & d.Energy_Source=='total').map(d => d.Consumption_TWh/1.5)-5; })
  .attr('text-anchor', 'middle')
  .style("font-size","16px");
  

}

function drawCountryPie(){
    // countries that are near bitcoin
    for (let j = 0; j < country_list.length; j++) {
    const xPosition=(Math.random()* (0.7 - 0.1) + 0)*windowWidth;
    const yPosition=(Math.random()* (0.9 - 0.2) + 0.1)*windowHeight;
      
    if (country_list[j]!="bitcoin"){
      var g_country= svg_legends.append("g")
      .attr("transform","translate("+xPosition+","+yPosition+")")
      .attr("id",country_list[j])
      .attr("class","countries")
      .call(
        d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      )
      .selectAll().data(d3.pie()
      .value((d) => d.Consumption_TWh)
      .sort((a, b) => a.Energy_Source - b.Energy_Source)(data.filter(d => d.Year == "2020" & d.Energy_Source!='total' & d.Country == country_list[j]))).enter()
      ;}
      
    const outRadius_country=data.filter(d => d.Year == "2020" & d.Country == country_list[j] & d.Energy_Source=='total').map(d => d.Consumption_TWh/1.5);

    g_country.append("path")
    .attr("d",d3.arc().innerRadius(0).outerRadius(outRadius_country))
    .attr("fill", function(d, j) {
      return color_list[j%3] // here it is picking up colors in sequence
    });
    g_country.append("text")
    .text(country_list[j])
    .attr("x", 0)             
    .attr("y", function(d) {return data.filter(d => d.Year == "2020" & d.Country == country_list[j] & d.Energy_Source=='total').map(d => d.Consumption_TWh/1.5+15); })
    .attr('text-anchor', 'middle')
    .style("font-size","12px");
    };
}


function floating() {
    width_box=windowWidth/(country_list.length+1);
    console.log(width_box);
    const ideal_position_list = [];
    for (let m = 0; m < country_list.length; m++) {
      ideal_position_list[m]=width_box*(m+1)+width_box*Math.random()/2;
      console.log(country_list[m],ideal_position_list[m]);
      y1=parseInt(d3.select("#"+country_list[m]).attr('transform').match(/(?<=\,).*(?=\))/));
      d3.select("#"+country_list[m]).transition().duration(5000)
          .attr("transform", "translate("+ideal_position_list[m]+","+(y1)+")");
    }
      // for (let n = m+1; n < country_list.length; n++) {
      //   x1=parseInt(d3.select("#"+country_list[m]).attr('transform').match(/(?<=\().*(?=\,)/));
      //   y1=parseInt(d3.select("#"+country_list[m]).attr('transform').match(/(?<=\,).*(?=\))/));
      //   x2=parseInt(d3.select("#"+country_list[n]).attr('transform').match(/(?<=\().*(?=\,)/));
      //   y2=parseInt(d3.select("#"+country_list[n]).attr('transform').match(/(?<=\,).*(?=\))/));
    
      //   twoPiesDistance=Eucliendistance(x1,y1,x2,y2);
      //   x1_radius=parseInt(data.filter(d => d.Year == "2020" & d.Country == country_list[m] & d.Energy_Source=='total').map(d => d.Consumption_TWh/1.5));
      //   x2_radius=parseInt(data.filter(d => d.Year == "2020" & d.Country == country_list[n] & d.Energy_Source=='total').map(d => d.Consumption_TWh/1.5));
        
      //   twoPiesRadius=x1_radius+ x2_radius;


      //   if (twoPiesDistance < twoPiesRadius)
      //   {
    
        
          // console.log(x1+(Math.random()-0.5)*x1);
          // d3.select("#"+country_list[m]).transition()
          // .duration(5000)
          // .attr("transform", "translate("+(Math.random()*windowWidth+","+(Math.random()*windowHeight+")")));

        }
      

function Eucliendistance(x1,y1,x2,y2){
  var a=x1-x2;
  var b=y1-y2;
  var distance=Math.sqrt( a*a + b*b );
  return distance;
}


  //function of dragging
  function dragstarted(_event) {
    d3.select(this).raise().classed("active", true);
    }

  function dragged(event) {
      d3.select(this).attr("transform", "translate("+event.x+","+event.y+")");
      }
  
  function dragended(event) {
      const bitcoin_x= parseInt( d3.select("#bitcoinPie").attr("transform").match(/(?<=\().*(?=\,)/));
      const bitcoin_y= parseInt( d3.select("#bitcoinPie").attr("transform").match(/(?<=\,).*(?=\))/));
      var distance=Eucliendistance(event.x,event.y,bitcoin_x,bitcoin_y);
      console.log(distance,outRadius_Bitcoin*2 );
      if (this.id!="bitcoinPie"){
      if (distance<outRadius_Bitcoin*2 ){
      d3.select(this).attr("transform", "translate("+bitcoin_x+","+bitcoin_y+")");
      }}
      d3.select(this).classed("active", false);
  }}