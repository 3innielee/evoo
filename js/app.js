'use strict';
$(function(){
  // Setting up the chart area
  var margin = {
    top: 40,
    right: 20,
    bottom: 30,
    left: 90
  };
  var canvasWidth = 600;
  var canvasHeight = 350;
  var width = canvasWidth - margin.left - margin.right-200;
  var height = canvasHeight - margin.top - margin.bottom-50;

  var svg = d3.select('svg')
    .attr('width', canvasWidth)
    .attr('height', canvasHeight);
  // Add area for points
  var graphArea = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  var xScale;
  var yScale;
  var div = d3.select("#price").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // axis labels
  svg.append('text')
      .attr('x', -175)
      .attr('y', 50)
      .attr('class', 'label')
      .attr("transform", "rotate(-90)")
      .text('Sensory Test Pass Rate (%)');
    //3.attr("fill","white");
  svg.append('text')
      .attr('x', canvasWidth-200)
      .attr('y', canvasHeight-45)
      .attr('text-anchor', 'end')
      .attr('class', 'label')
      .text('Price ($ per ounce)');
      //.attr("fill","white");
  // title
  /*svg.append('text')
    .attr('x', 400)
    .attr('y', 20)
    .attr('class', 'ttitle')
    .style('font-size',20)
    .style('fill','green')
    .attr('text-anchor', 'end')
    
    .text('Top U.S. and Imported Brands');*/



      
  
  var legend = svg.selectAll(".legend")
    .data(["Imported Brand", "California Brand"])
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("text")
    .attr('x', canvasWidth)
    .attr('y', canvasHeight-300)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });

  legend.append("rect")
    .attr('x', canvasWidth-425)
    .attr('y', canvasHeight-320)
    .attr('height', 20)
    .attr('width', 20)
    .style("fill", function(d) {
      if (d=="Imported Brand"){return '#241023';}
        else{return '#E3D26F';}

    })
    .attr("transform", function(d, i) { 
        return "translate(" + (width -10) + "," + 10 + ")";
    });
      
 
  
  d3.csv('data.csv', function(data) {
    
    
    // Add code here
    xScale = d3.scaleLinear().domain([0, 1]).range([0, width]);
    yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    //console.log(xScale(1734));
    svg.selectAll("dot")
      .data(data)
      .enter().append("circle")
      .attr("r", 5)
      .attr("cx", function(d) { return xScale(d.price_2014)+margin.left; })
      .attr("cy", function(d) { return yScale(d.rate_2014)+margin.top; })
      .style('fill', function(d){ 
        if (d.source=='imported'){return '#241023';}
        else{return '#E3D26F';}
      })
      


    // Add axes (uncomment this code to add axes)
    graphArea.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (height) + ')')
      .call(d3.axisBottom(xScale));

    graphArea.append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(yScale));


  });

  // Animate points
  var originalYear = 2014;
  var maxYear = 2015;
  var year = originalYear;
  d3.select('#nextButton').on('click', function(event) {
    if (year == maxYear) {
      year = originalYear;
    } else {
      year = year + 1;
    }
    var xColumn = 'price_' + String(year);
    var yColumn = 'rate_' + String(year);
    
    // Get the data again
    d3.csv('data.csv', function(error, data) {
      // Make the changes

      svg.selectAll("circle")
        .transition()
        .duration(2000)
        .delay(10)
        .attr("cx", function(d) { return xScale(d[xColumn])+margin.left; })
        .attr("cy", function(d) { return yScale(d[yColumn])+margin.top; });
      svg.selectAll("circle")
        .on("mouseover", function(d) {
          div.transition()
             .duration(200)
             .style("opacity", .9);
          div.html(d.brand+"<br/>("+d[xColumn]+","+d[yColumn]+"%)")
             .style("left", (d3.event.pageX) + "px")
             .style("top", (d3.event.pageY - 28) + "px");
          })
        .on("mouseout", function(d) {
       div.transition()
         .duration(500)
         .style("opacity", 0);
       });

    });

  });

});
