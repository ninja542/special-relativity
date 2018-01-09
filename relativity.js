// PERSONAL NOTES
// 1 pixel = 1000 meters

// set up graph
var margin = { top: 30, right: 30, bottom: 30, left: 30 },
		width = 640 - margin.left - margin.right,
		height = 640 - margin.top - margin.bottom;

var svgSelection = d3.select('#graph').append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
	.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
var xScale = d3.scaleLinear().domain([0, 1]).range([0, width]);
var yScale = d3.scaleLinear().domain([1, 0]).range([0, height]);
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);
// calls the number of ticks and sets the ticks size to make grid
svgSelection.append("g").call(d3.axisBottom(xScale).ticks(20).tickSize(-height).tickFormat(""))
// translate gridlines to the bottom and add the class to make it look better
	.attr("transform", "translate(" + 0 + ", " + height + ")")
	.attr("class", "grid");
// repeat for y axis
svgSelection.append("g").call(d3.axisLeft(yScale).ticks(20).tickSize(-width).tickFormat(""))
	.attr("class", "grid");
	// x and y axes
svgSelection.append("g").attr("class", "x axis").attr("transform", "translate(" + 0 + ", " + yScale(0) + ")").call(xAxis);
svgSelection.append("g").call(yAxis).attr("transform", "translate(" + xScale(0) + ", " + 0 + ")");

// line function
var line = d3.line().x(function(d){ return d.x; }).y(function(d){ return d.y; });

// transformed graph
// speed is in units of c
var tempspeed = 0.4;
// for the lorentz transformation
var tempgamma = 1/(Math.sqrt(1-Math.pow(tempspeed, 2))/1);
var temptransformXScale = d3.scaleLinear().domain([0, 1/tempgamma]).range([0, width]);
var temptransformXAxis = d3.axisBottom(temptransformXScale);
var temptransformYScale = d3.scaleLinear().domain([1/tempgamma, 0]).range([0, height]);
var temptransformYAxis = d3.axisLeft(temptransformYScale);
// angle of the graph itself
var tempangle = Math.atan(tempspeed)*180/Math.PI;
// gridlines
svgSelection.append("g").call(d3.axisBottom(temptransformXScale).ticks(20).tickSize(-height).tickFormat(""))
	.attr("transform", "translate(" + 0 + ", " + temptransformYScale(0) + ") rotate ("+(-tempangle)+","+(temptransformXScale(0))+","+ "0"+")")
	.attr("class", "gridx1");
svgSelection.append("g").call(d3.axisBottom(temptransformXScale).ticks(20).tickSize(height).tickFormat(""))
	.attr("transform", "translate(" + 0 + ", " + temptransformYScale(0) + ") rotate ("+(-tempangle)+","+(temptransformXScale(0))+","+ "0"+")")
	.attr("class", "gridx2");
svgSelection.append("g").call(d3.axisLeft(temptransformYScale).ticks(20).tickSize(-width).tickFormat(""))
	.attr("transform", "translate(" + temptransformXScale(0) + ", " + 0 + ") rotate ("+tempangle+", 0,"+temptransformYScale(0)+")")
	.attr("class", "gridy1");
svgSelection.append("g").call(d3.axisLeft(temptransformYScale).ticks(20).tickSize(width).tickFormat(""))
	.attr("transform", "translate(" + temptransformXScale(0) + ", " + 0 + ") rotate ("+tempangle+", 0,"+temptransformYScale(0)+")")
	.attr("class", "gridy2");

// axes
svgSelection.append("g")
	.attr("id", "specialX")
	.attr("transform", "translate(" + 0 + ", " + temptransformYScale(0) + ") rotate ("+(-tempangle)+","+(temptransformXScale(0))+","+ "0"+")")
	.attr("class", "redAxis")
	.call(temptransformXAxis);
svgSelection.append("g")
	.attr("id", "specialY")
	.call(temptransformYAxis)
	.attr("transform", "translate(" + temptransformXScale(0) + ", " + 0 + ") rotate ("+tempangle+", 0,"+temptransformYScale(0)+")")
	.attr("class", "redAxis");

// points for the minkowski diagram
var pointData = [
	{x: 0.4, y: 0.2}
];
svgSelection.selectAll("circle").data(pointData).enter().append("circle").attr("fill", "red").attr("r", 4).attr("cx", function(d){return xScale(d.x);}).attr("cy", function(d){ return yScale(d.y);});
var rectangleData = [
	{x: 0, y: 20},
];

svgSelection.append("circle").attr("r", 5).attr("fill", "green").attr("class", "change");

// constant light speed graph
svgSelection.append("path").attr("d", line([
		{x: 0, y: height},
		{x: width, y: 0}
	])).attr("stroke", "yellow").attr("stroke-width", 1);
// vue app
var specialApp = new Vue({
	el: "#wrapper",
	data: {
		speed: 0.4,
	},
	methods: {
		updateAxis: function(){
			d3.select("#specialX").call(d3.axisBottom(this.transformXScale())).attr("transform", "translate(" + 0 + ", " + yScale(0) + ") rotate ("+(-this.angle)+",0,"+ "0"+")");
			d3.select("#specialY").call(d3.axisLeft(this.transformYScale())).attr("transform", "translate(" + xScale(0) + ", " + 0 + ") rotate ("+this.angle+", 0,"+yScale(0)+")");
			d3.select(".gridx1").call(d3.axisBottom(this.transformXScale()).ticks(20).tickSize(-height).tickFormat(""))
				.attr("transform", "translate(" + 0 + ", " + yScale(0) + ") rotate ("+(-this.angle)+","+(xScale(0))+","+ 0 +")");
			d3.select(".gridx2").call(d3.axisBottom(this.transformXScale()).ticks(20).tickSize(height).tickFormat(""))
				.attr("transform", "translate(" + 0 + ", " + yScale(0) + ") rotate ("+(-this.angle)+","+(xScale(0))+","+ "0"+")");
			d3.select(".gridy1").call(d3.axisLeft(this.transformYScale()).ticks(20).tickSize(-width).tickFormat(""))
				.attr("transform", "translate(" + xScale(0) + ", " + 0 + ") rotate ("+this.angle+", 0,"+yScale(0)+")");
			d3.select(".gridy2").call(d3.axisLeft(this.transformYScale()).ticks(20).tickSize(width).tickFormat(""))
				.attr("transform", "translate(" + xScale(0) + ", " + 0 + ") rotate ("+this.angle+", 0,"+yScale(0)+")");
		},
		transformXScale: function(){
			return d3.scaleLinear().domain([0, 1/this.gamma]).range([0, width]);
		},
		transformYScale: function(){
			return d3.scaleLinear().domain([1/this.gamma, 0]).range([0, height]);
		}
	},
	computed: {
		gamma: function(){
			return 1/(Math.sqrt(1-Math.pow(this.speed, 2))/1);
		},
		angle: function(){
			return Math.atan(this.speed)*180/Math.PI;
		},
	},
	mounted: function(){

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
	scaleX: {
		value: 1/tempgamma,
		duration: 0,
	}
});
anime({
	targets: "#lightspeed #mountain",
	translateX: {
		value: -1100,
		duration: 10000,
		delay: 1000,
		easing: "linear",
	},
	scaleX: {
		value: 1/tempgamma,
		duration: 0,
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