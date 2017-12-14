// set up graph
var margin = { top: 20, right: 20, bottom: 20, left: 20 },
		width = 640 - margin.left - margin.right,
		height = 640 - margin.top - margin.bottom;

var svg = d3.select('#graph').append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
	.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
d3.selectAll("#transform").style("position", "relative").attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
var xScale = d3.scaleLinear().domain([-100, 100]).range([0, width]);
var yScale = d3.scaleLinear().domain([100, -100]).range([0, height]);
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);
svg.append("g").call(xAxis).attr("transform", "translate(" + 0 + ", " + yScale(0) + ")");
svg.append("g").call(yAxis).attr("transform", "translate(" + xScale(0) + ", " + 0 + ")");

// line function
var line = d3.line().x(function(d){ return d.x; }).y(function(d){ return d.y; });

// points for the minkowski diagram
var pointData = [
	{x: 40, y: 20}
];
svg.selectAll("circle").data(pointData).enter().append("circle").attr("fill", "red").attr("r", 4).attr("cx", function(d){return xScale(d.x);}).attr("cy", function(d){ return yScale(d.y);});
var rectangleData = [

];
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

// vue app
var specialApp = new Vue({
	el: "#everything",
	data: {
		speed: 0.6,
	},
	mounted: function(){
	}
});

// animation testing sorta
d3.select("#observetrain").style("position", "relative").style("left", "-360px");
anime({
	targets: "#observer #observetrain",
	translateX: 1100,
	duration: 10000,
	delay: 1000,
	easing: "linear"
});