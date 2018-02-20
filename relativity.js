// PERSONAL NOTES
// 1 pixel = 400000 meters about I think last time I checked rip. 1 s = 1 s in real life

const trainlength = 0.15;
const mountainlength = 0.13;
const distance = 0.1;
// set up graph
var margin = { top: 30, right: 30, bottom: 30, left: 30 },
		width = 640 - margin.left - margin.right,
		height = 640 - margin.top - margin.bottom;

var svgSelection = d3.select('#graph').append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
	.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')').attr("id", "transform");
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
// angle of the graph itself
var tempangle = Math.atan(tempspeed)*180/Math.PI;
var tempanglerad = Math.atan(tempspeed);
// for the lorentz transformation
var tempgamma = 1/(Math.sqrt(1-Math.pow(tempspeed, 2))/1);
var temptransformXScale = d3.scaleLinear().domain([0, 1/tempgamma]).range([0, width]);
var temptransformXAxis = d3.axisBottom(temptransformXScale);
var temptransformYScale = d3.scaleLinear().domain([0, 1/tempgamma]).range([Math.abs(height/Math.cos(tempanglerad)), 0]);
var temptransformYAxis = d3.axisLeft(temptransformYScale);
// gridlines
svgSelection.append("g").call(d3.axisBottom(temptransformXScale).ticks(20).tickSize(-height).tickFormat(""))
	.attr("transform", "translate(" + 0 + ", " + temptransformYScale(0) + ") rotate ("+(tempangle)+","+(temptransformXScale(0))+","+ "0"+")")
	.attr("class", "gridx1");
svgSelection.append("g").call(d3.axisBottom(temptransformXScale).ticks(20).tickSize(height).tickFormat(""))
	.attr("transform", "translate(" + 0 + ", " + temptransformYScale(0) + ") rotate ("+(tempangle)+","+(temptransformXScale(0))+","+ "0"+")")
	.attr("class", "gridx2");
svgSelection.append("g").call(d3.axisLeft(temptransformYScale).ticks(20).tickSize(-width).tickFormat(""))
	.attr("transform", "translate(" + temptransformXScale(0) + ", " + 0 + ") rotate ("+(-tempangle)+", 0,"+temptransformYScale(0)+")")
	.attr("class", "gridy1");
svgSelection.append("g").call(d3.axisLeft(temptransformYScale).ticks(20).tickSize(width).tickFormat(""))
	.attr("transform", "translate(" + temptransformXScale(0) + ", " + 0 + ") rotate ("+(-tempangle)+", 0,"+temptransformYScale(0)+")")
	.attr("class", "gridy2");

// axes
svgSelection.append("g")
	.attr("id", "specialX")
	.attr("transform", "translate(" + 0 + ", " + (temptransformYScale(0)+height-Math.abs(height/Math.cos(tempanglerad))) + ") rotate ("+(-tempangle)+","+(temptransformXScale(0))+","+ "0"+")")
	.attr("class", "redAxis")
	.call(temptransformXAxis);
svgSelection.append("g")
	.attr("id", "specialY")
	.call(temptransformYAxis)
	.attr("transform", "translate(" + temptransformXScale(0) + ", " + (height-Math.abs(height/Math.cos(tempanglerad))) + ") rotate ("+tempangle+", 0,"+temptransformYScale(0)+")")
	.attr("class", "redAxis");

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
		animationspeed: 1,
	},
	methods: {
		update: function(){
			d3.select("#specialX").call(d3.axisBottom(this.transformXScale())).attr("transform", "translate(" + 0 + ", " + yScale(0) + ") rotate ("+(-this.angle)+",0,"+ "0"+")");
			d3.select("#specialY").call(d3.axisLeft(this.transformYScale())).attr("transform", "translate(" + xScale(0) + ", " + 0 + ") rotate ("+this.angle+", 0,"+yScale(0)+")");
			d3.select(".gridx1").call(d3.axisBottom(this.transformXScale()).ticks(20).tickSize(-height).tickFormat(""))
				.attr("transform", "translate(" + 0 + ", " + yScale(0) + ") rotate ("+(this.angle)+","+(xScale(0))+","+ 0 +")");
			d3.select(".gridx2").call(d3.axisBottom(this.transformXScale()).ticks(20).tickSize(height).tickFormat(""))
				.attr("transform", "translate(" + 0 + ", " + yScale(0) + ") rotate ("+(this.angle)+","+(xScale(0))+","+ "0"+")");
			d3.select(".gridy1").call(d3.axisLeft(this.transformYScale()).ticks(20).tickSize(-width).tickFormat(""))
				.attr("transform", "translate(" + xScale(0) + ", " + 0 + ") rotate ("+(-this.angle)+", 0,"+yScale(0)+")");
			d3.select(".gridy2").call(d3.axisLeft(this.transformYScale()).ticks(20).tickSize(width).tickFormat(""))
				.attr("transform", "translate(" + xScale(0) + ", " + 0 + ") rotate ("+(-this.angle)+", 0,"+yScale(0)+")");
			d3.select(".train").attr("d", line([
				{x: xScale(0), y: yScale(0)},
				{x: xScale(0), y: yScale(trainlength/this.gamma)},
				{x: xScale(1), y: yScale(this.speed+trainlength/this.gamma)},
				{x: xScale(1), y: yScale(this.speed)}
			]));
			var data =  d3.select("#transform").selectAll("circle").data(this.door);
			data.attr("r", 4).attr("cx", function(d){return xScale(d.x);}).attr("cy", function(d){ return yScale(d.y);});
			data.enter().append("circle").attr("fill", "red").attr("r", 4).attr("cx", function(d){return xScale(d.x);}).attr("cy", function(d){ return yScale(d.y);});
			data.exit().remove();
		},
		transformXScale: function(){
			return d3.scaleLinear().domain([0, 1/this.gamma]).range([0, width]);
		},
		transformYScale: function(){
			return d3.scaleLinear().domain([1/this.gamma, 0]).range([0, height/Math.cos(this.angle)]);
		}
	},
	computed: {
		gamma: function(){
			return 1/(Math.sqrt(1-Math.pow(this.speed, 2)));
		},
		angle: function(){
			return Math.atan(this.speed)*180/Math.PI;
		},
		anglerad: function(){
			return Math.atan(this.speed);
		},
		door: function(){
			return [{x: (distance + mountainlength)/this.speed, y: trainlength+distance+mountainlength},
			{x: (trainlength+distance)/this.speed, y: trainlength+distance}];
		},
	},
	mounted: function(){
		d3.select("#transform").append("path").attr("d", line([
				{x: xScale(0), y: yScale(0)},
				{x: xScale(0), y: yScale(trainlength/this.gamma)},
				{x: xScale(1), y: yScale(this.speed+trainlength/this.gamma)},
				{x: xScale(1), y: yScale(this.speed)}
			])).attr("fill", "teal").attr("opacity", "0.3").attr("class", "train");
		d3.select("#transform").append("path").attr("d", line([
				{x: xScale(0), y: yScale(distance+trainlength)},
				{x: xScale(0), y: yScale(distance+trainlength+mountainlength)},
				{x: xScale(1), y: yScale(distance+trainlength+mountainlength)},
				{x: xScale(1), y: yScale(distance+trainlength)}
			])).attr("fill", "grey").attr("opacity", "0.3").attr("class", "mountain");
		d3.select("#transform").append("path").attr("d", line([
				{x: xScale(trainlength+distance)/this.speed, y: yScale(trainlength+distance)}
			]));
		// points for the minkowski diagram
		d3.select("#transform").selectAll("circle").data(this.door).enter().append("circle").attr("fill", "red").attr("r", 4).attr("cx", function(d){return xScale(d.x);}).attr("cy", function(d){ return yScale(d.y);}).attr("class", "door");
	},
	watch: {
		speed: function(){
			this.update();
		}
	}
});
d3.select("#transform").append("circle").attr("cx", xScale(0)).attr("cy", yScale(0)).attr("fill", "none").attr("stroke", "black").attr("r", temptransformYScale(0.15)).attr("stroke-width", 1);
// animation testing sorta
// TODO: name the animations
function playAnimation(){
	anime.speed = 1;
	anime({
		targets: "#observer #observetrain",
		translateX: {
			value: 1100,
			duration: 10000,
			easing: "linear",
		},
		scaleX: {
			value: 1/specialApp.gamma,
			duration: 0,
		}
	});
	anime({
		targets: "#lightspeed #mountain",
		translateX: {
			value: -1100,
			duration: 10000,
			easing: "linear",
		},
		scaleX: {
			value: 1/specialApp.gamma,
			duration: 0,
		},
	});
	anime({
		targets: ["#lightspeed #doorB", "#observer #doorB"],
		translateY: {
			value: 72,
			duration: 1000,
			easing: "linear",
		}
	});
}