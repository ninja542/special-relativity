var margin = { top: 20, right: 20, bottom: 20, left: 20 },
		width = 640 - margin.left - margin.right,
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

// margins for the animation stuffs
var margin2 = { top: 10, right: 10, bottom: 10, left: 10 },
		width2 = 640 - margin2.left - margin2.right,
		height2 = 320 - margin2.top - margin2.bottom;
var svg2 = d3.select("#lightspeed").append('svg')
		.attr("width", width2 + margin2.left + margin2.right)
		.attr("height", height2 + margin2.top + margin2.bottom)
	.append('g')
		.attr("transform", 'translate(' + margin2.left + "," + margin2.top + ')');
var svg3 = d3.select("#observer").append('svg')
		.attr("width", width2 + margin2.left + margin2.right)
		.attr("height", height2 + margin2.top + margin2.bottom)
	.append('g')
		.attr("transform", 'translate(' + margin2.left + "," + margin2.top + ')');

svg.append("g").call(xAxis).attr("transform", "translate(" + 0 + ", " + yScale(0) + ")");
svg.append("g").call(yAxis).attr("transform", "translate(" + xScale(0) + ", " + 0 + ")");

var pointData = [
	{x: 40, y: 20}
];
svg.selectAll("circle").data(pointData).enter().append("circle").attr("fill", "red").attr("r", 4).attr("cx", function(d){return xScale(d.x);}).attr("cy", function(d){ return yScale(d.y);});
var rectangleData = [

];

var line = d3.line().x(function(d){ return d.x; }).y(function(d){ return d.y; });

// constant light speed graph
svg.append("path").attr("d", line([
		{x: 0, y: height},
		{x: width, y: 0}
	])).attr("stroke", "yellow").attr("stroke-width", 1);

// transformed graph
// speed is in units of c
var speed = 0.6;
// for the lorentz transformation
var gamma = 1/(Math.sqrt(1-Math.pow(speed, 2))/1);
// angle of the graph itself
var angle = Math.atan(speed)*180/Math.PI;
svg.append("g").call(xAxis).attr("transform", "translate(" + 0 + ", " + yScale(0) + ") rotate ("+(-angle)+","+(xScale(0))+","+ "0"+")")
	.attr("class", "redAxis");
svg.append("g").call(yAxis).attr("transform", "translate("+xScale(0)+", "+ 0 + ") rotate ("+angle+", 0,"+yScale(0)+")")
	.attr("class", "redAxis");

var specialApp = new Vue({
	el: "#everything",
	mounted: function(){
		console.log("hi");
	}
});