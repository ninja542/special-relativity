// set up graph
var margin = { top: 30, right: 30, bottom: 30, left: 30 },
		width = 640 - margin.left - margin.right,
		height = 640 - margin.top - margin.bottom;

var svg = d3.select('#graph').append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
	.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
d3.selectAll("#transform").style("position", "relative").attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
var xScale = d3.scaleLinear().domain([0, 1]).range([0, width]);
var yScale = d3.scaleLinear().domain([1, 0]).range([0, height]);
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);
// calls the number of ticks and sets the ticks size to make grid
svg.append("g").call(d3.axisBottom(xScale).ticks(20).tickSize(-height).tickFormat(""))
// translate gridlines to the bottom and add the class to make it look better
	.attr("transform", "translate(" + 0 + ", " + height + ")")
	.attr("class", "grid");
// repeat for y axis
svg.append("g").call(d3.axisLeft(yScale).ticks(20).tickSize(-width).tickFormat(""))
	.attr("class", "grid");
svg.append("g").call(xAxis).attr("transform", "translate(" + 0 + ", " + yScale(0) + ")");
svg.append("g").call(yAxis).attr("transform", "translate(" + xScale(0) + ", " + 0 + ")");

// line function
var line = d3.line().x(function(d){ return d.x; }).y(function(d){ return d.y; });

// transformed graph
// speed is in units of c
var speed = 0.4;
// for the lorentz transformation
var gamma = 1/(Math.sqrt(1-Math.pow(speed, 2))/1);
var transformXScale = d3.scaleLinear().domain([0, 1/gamma]).range([0, width]);
var transformXAxis = d3.axisBottom(transformXScale);
var transformYScale = d3.scaleLinear().domain([1/gamma, 0]).range([0, height]);
var transformYAxis = d3.axisLeft(transformYScale);
// angle of the graph itself
var angle = Math.atan(speed)*180/Math.PI;
// gridlines
svg.append("g").call(d3.axisBottom(transformXScale).ticks(20).tickSize(-height).tickFormat(""))
	.attr("transform", "translate(" + 0 + ", " + transformYScale(0) + ") rotate ("+(-angle)+","+(transformXScale(0))+","+ "0"+")")
	.attr("class", "specialgrid");
svg.append("g").call(d3.axisBottom(transformXScale).ticks(20).tickSize(height).tickFormat(""))
	.attr("transform", "translate(" + 0 + ", " + transformYScale(0) + ") rotate ("+(-angle)+","+(transformXScale(0))+","+ "0"+")")
	.attr("class", "specialgrid");
svg.append("g").call(d3.axisLeft(transformYScale).ticks(20).tickSize(-width).tickFormat(""))
	.attr("transform", "translate(" + transformXScale(0) + ", " + 0 + ") rotate ("+angle+", 0,"+transformYScale(0)+")")
	.attr("class", "specialgrid");
svg.append("g").call(d3.axisLeft(transformYScale).ticks(20).tickSize(width).tickFormat(""))
	.attr("transform", "translate(" + transformXScale(0) + ", " + 0 + ") rotate ("+angle+", 0,"+transformYScale(0)+")")
	.attr("class", "specialgrid");

// axes
svg.append("g").attr("class", "specialX").call(transformXAxis).attr("transform", "translate(" + 0 + ", " + transformYScale(0) + ") rotate ("+(-angle)+","+(transformXScale(0))+","+ "0"+")")
	.attr("class", "redAxis");
svg.append("g").call(transformYAxis).attr("transform", "translate(" + transformXScale(0) + ", " + 0 + ") rotate ("+angle+", 0,"+transformYScale(0)+")")
	.attr("class", "redAxis")
	.attr("id", "transformY");

// points for the minkowski diagram
var pointData = [
	{x: 40, y: 20}
];
svg.selectAll("circle").data(pointData).enter().append("circle").attr("fill", "red").attr("r", 4).attr("cx", function(d){return xScale(d.x);}).attr("cy", function(d){ return yScale(d.y);});
var rectangleData = [
	{x: 0, y: 20},
];
// constant light speed graph
svg.append("path").attr("d", line([
		{x: 0, y: height},
		{x: width, y: 0}
	])).attr("stroke", "yellow").attr("stroke-width", 1);
// vue app
var specialApp = new Vue({
	el: "#wrapper",
	data: {
		speed: 0.4,
	},
	computed: {
		gamma: function(){
			return 1/(Math.sqrt(1-Math.pow(this.speed, 2))/1);
		},
		angle: function(){
			return Math.atan(this.speed)*180/Math.PI;
		},
		transformXScale: function(){
			return d3.scaleLinear().domain([0, 1/gamma]).range([0, width]);
		},
		transformYScale: function(){
			return d3.scaleLinear().domain([1/gamma, 0]).range([0, height]);
		}
	},
	methods: {
		updateAxis: function(){
			console.log("hi");
			svg.select(".specialX").attr("transform", "rotate ("+(-this.angle)+",0"+","+ yScale(0) +")");
		}
	},
	watch: {
		speed: function(){
			// TODO: actually update the axis
			this.updateAxis();
		}
	}
});

// animation testing sorta
// TODO: name the animations
anime({
	targets: "#observer #observetrain",
	translateX: {
		value: 1100,
		duration: 10000,
		delay: 1000,
		easing: "linear",
	},
});
anime({
	targets: "#lightspeed #mountain",
	translateX: {
		value: -1100,
		duration: 10000,
		delay: 1000,
		easing: "linear",
	},
});
anime({
	targets: "#lightspeed #doorA",
	translateY: {
		value: 72,
		duration: 1000,
		easing: "linear",
	}
});