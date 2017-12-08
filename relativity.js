var margin = { top: 20, right: 20, bottom: 20, left: 20 },
    width = 960 - margin.left - margin.right,
    height = 640 - margin.top - margin.bottom;

var svg = d3.select('#graph').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
var xScale = d3.scaleLinear().domain([-100, 100]).range([0, width]);
var yScale = d3.scaleLinear().domain([100, -100]).range([0, height]);
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);

svg.append("g").call(xAxis).attr("transform", "translate(" + 0 + ", " + yScale(0) + ")");
svg.append("g").call(yAxis).attr("transform", "translate(" + xScale(0) + ", " + 0 + ")");