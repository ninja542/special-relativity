// PERSONAL NOTES
// 1 pixel = 400000 meters about I think last time I checked rip. 1 s = 1 s in real life
// 250 pixels covered in 0.4 * 3e+8 speed of light * 0.625 seconds
// 150 pixels turns into 0.15c, so 1 pixel = 0.001 c = 3e5 meters so 300000 meters
const trainlength = 0.15;
const mountainlength = 0.13;
const distance = 0.1;
// animations done using anime library
function doorAOpen(){
	anime({
		targets: "#observer #doorA, #lightspeed #doorA",
		translateY: {
			value: -72,
			duration: 500,
			easing: "linear",
		}
	});
}
function doorAClose(){
	anime({
		targets: "#observer #doorA",
		translateY: {
			value: 72,
			duration: 500,
			easing: "linear",
		}
	});
}
function doorAClose2(){
	anime({
		targets: "#lightspeed #doorA",
		translateY: {
			value: 72,
			duration: 500,
			easing: "linear",
		}
	});
}
function doorBOpen(){
	anime({
		targets: "#observer #doorB",
		translateY: {
			value: -72,
			duration: 500,
			easing: "linear",
		}
	});
}
function doorBOpen2(){
	anime({
		targets: "#lightspeed #doorB",
		translateY: {
			value: -72,
			duration: 500,
			easing: "linear",
		}
	});
}
function doorBClose(){
	anime({
		targets: "#lightspeed #doorB, #observer #doorB",
		translateY: {
			value: 72,
			duration: 500,
			easing: "linear",
		}
	});
}
function round (number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
}

// set up graph
let margin = { top: 30, right: 30, bottom: 30, left: 30 },
		width = 640 - margin.left - margin.right,
		height = 640 - margin.top - margin.bottom;

let svgSelection = d3.select('#graph').append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
	.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')').attr("id", "transform");
let xScale = d3.scaleLinear().domain([0, 1]).range([0, width]);
let yScale = d3.scaleLinear().domain([1, 0]).range([0, height]);
let xAxis = d3.axisBottom(xScale);
let yAxis = d3.axisLeft(yScale);

// distance marker for the animation
let distanceScale = d3.scaleLinear().domain([0, 1]).range([0, 1000]);
d3.select('#distance').append('svg').append('g').call(d3.axisBottom(distanceScale));

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
let line = d3.line().x(function(d){ return d.x; }).y(function(d){ return d.y; });

// transformed graph
// speed is in units of c
let tempspeed = 0.4;
// angle of the graph itself
let tempangle = Math.atan(tempspeed)*180/Math.PI;
let tempanglerad = Math.atan(tempspeed);
// for the lorentz transformation
let tempgamma = 1/(Math.sqrt(1-Math.pow(tempspeed, 2))/1);
let temptransformXScale = d3.scaleLinear().domain([0, 1/tempgamma]).range([0, Math.abs(width/Math.cos(tempanglerad))]);
let temptransformXAxis = d3.axisBottom(temptransformXScale);
let temptransformYScale = d3.scaleLinear().domain([0, 1/tempgamma]).range([Math.abs(height/Math.cos(tempanglerad)), 0]);
let temptransformYAxis = d3.axisLeft(temptransformYScale);
// gridlines
svgSelection.append("g").call(d3.axisBottom(temptransformXScale).ticks(20).tickSize(-height-200).tickFormat(""))
	.attr("transform", "translate(" + 0 + ", " + yScale(0) + ") rotate ("+(tempangle)+","+(xScale(0))+","+"0"+")")
	.attr("class", "gridx1");
svgSelection.append("g").call(d3.axisBottom(temptransformXScale).ticks(20).tickSize(height).tickFormat(""))
	.attr("transform", "translate(" + 0 + ", " + temptransformYScale(0) + ") rotate ("+(tempangle)+","+(temptransformXScale(0))+","+ "0"+")")
	.attr("class", "gridx2");
svgSelection.append("g").call(d3.axisLeft(temptransformYScale).ticks(20).tickSize(-width-200).tickFormat(""))
	.attr("transform", "translate(" + temptransformXScale(0) + ", " + (height-Math.abs(height/Math.cos(tempanglerad))) + ") rotate ("+(-tempangle)+", 0,"+temptransformYScale(0)+")")
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
let app = new Vue({
	el: "#wrapper",
	data: {
		speed: 0.4,
		animationspeed: 1,
		// scale: 'scaleX('+(1/this.gamma)+')',
		time: 0.00,
		control: 'pause',
	},
	methods: {
		update: function(){
			let scalevar = this.transformYScale();
			// the special relativity grid
			d3.select("#specialX").call(d3.axisBottom(this.transformXScale())).attr("transform", "translate(" + 0 + ", " + yScale(0) + ") rotate ("+(-this.angle)+",0,"+ "0"+")");
			d3.select("#specialY").call(d3.axisLeft(this.transformYScale())).attr("transform", "translate(" + xScale(0) + ", " + (height-Math.abs(height/Math.cos(this.anglerad))) + ") rotate ("+this.angle+", 0,"+(scalevar(0))+")");
			d3.select(".gridx1").call(d3.axisBottom(this.transformXScale()).ticks(20).tickSize(-height-200).tickFormat(""))
				.attr("transform", "translate(" + 0 + ", " + yScale(0) + ") rotate ("+(this.angle)+","+(xScale(0))+","+ 0 +")");
			d3.select(".gridx2").call(d3.axisBottom(this.transformXScale()).ticks(20).tickSize(height).tickFormat(""))
				.attr("transform", "translate(" + 0 + ", " + yScale(0) + ") rotate ("+(this.angle)+","+(xScale(0))+","+ "0"+")");
			d3.select(".gridy1").call(d3.axisLeft(this.transformYScale()).ticks(20).tickSize(-width-200).tickFormat(""))
				.attr("transform", "translate(" + xScale(0) + ", " + (height-Math.abs(height/Math.cos(this.anglerad))) + ") rotate ("+(-this.angle)+", 0,"+scalevar(0)+")");
			d3.select(".gridy2").call(d3.axisLeft(this.transformYScale()).ticks(20).tickSize(width).tickFormat(""))
				.attr("transform", "translate(" + xScale(0) + ", " + (height-Math.abs(height/Math.cos(this.anglerad))) + ") rotate ("+(-this.angle)+", 0,"+scalevar(0)+")");
			// the box representing the train path
			d3.select(".train").attr("d", line([
				{x: xScale(0), y: yScale(0)},
				{x: xScale(0), y: yScale(trainlength/this.gamma)},
				{x: xScale(1), y: yScale(this.speed+trainlength/this.gamma)},
				{x: xScale(1), y: yScale(this.speed)}
			]));
			// the points where the doors are supposed to open
			var data =  d3.select("#transform").selectAll("circle").data(this.door);
			data.attr("r", 4).attr("cx", function(d){return xScale(d.x);}).attr("cy", function(d){ return yScale(d.y);});
			data.enter().append("circle").attr("fill", "green").attr("r", 4).attr("cx", function(d){return xScale(d.x);}).attr("cy", function(d){ return yScale(d.y);});
			data.exit().remove();
		},
		transformXScale: function(){
			return d3.scaleLinear().domain([0, 1/this.gamma]).range([0, Math.abs(width/Math.cos(this.anglerad))]);
		},
		transformYScale: function(){
			return d3.scaleLinear().domain([1/this.gamma, 0]).range([0, Math.abs(height/Math.cos(this.anglerad))]);
		},
		updateTime: function(){
			if(this.control == "play"){
				this.advanceTime();
			}
		},
		advanceTime: function(){
			if (this.time >= 1){
				this.time = 0;
				doorBClose();
				doorAOpen();
			}
			else{
				if(this.control == "play"){
					this.time += 0.001 * this.animationspeed;
				}
				else if(this.control == "pause"){
					this.time += 0;
				}
				else if(this.control == "restart"){
					this.time = 0;
					doorBClose();
					doorAOpen();
				}
			}
			if (this.time >= this.door[1].x - 0.01 && this.time < this.door[1].x){
				doorBOpen();
			}
			if (this.time >= this.door[0].x - 0.01 && this.time < this.door[0].x){
				doorAClose();
			}
			if (this.time / this.gamma >= this.door[1].x - 0.01 && this.time / this.gamma < this.door[1].x){
				doorBOpen2();
			}
			this.time = round(this.time, 6);
			d3.select(".trainpoint")
				.attr("x", xScale(this.time) - 4)
				.attr("y", yScale(this.time * this.speed) - 4);
			d3.select(".trainpoint2")
				.attr("x", xScale(this.time) - 4)
				.attr("y", yScale(this.time * this.speed + trainlength/this.gamma) - 4);
			d3.select(".newpoint")
				.attr("x", xScale(this.convertTime()[0]) - 4)
				.attr("y", yScale(this.convertTime()[1]) - 4);
			d3.select(".timeconnect")
				.attr("d", line([
					{x: xScale(this.time), y: yScale(this.time * this.speed + trainlength/this.gamma)},
					{x: xScale(this.convertTime()[0]), y: yScale(this.convertTime()[1])},
				]));
		},
		animate: function(thing){
			// animation frame is native and it allows for the animation to stop when focus is on another area
			let animation = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback){
				window.setTimeout(callback, 1000/60);
			};
			return animation(thing);
		},
		updatePoints: function(){
		},
		convertTime: function(){
			// angle has to be in radians!!!
			// let newtime = (this.time - (this.speed*this.speed*this.time)) * this.gamma;
			// let timeoffset = 0.15 * Math.sin(this.anglerad);
			// timeoffset = timeoffset/(Math.sin((Math.PI/4) - this.anglerad));
			let timeoffset = (this.speed * trainlength / this.gamma) / (1 - Math.pow(this.speed, 2));
			let newtime = this.time - timeoffset;
			// newtime *= this.gamma;
			// let mapx = Math.cos(this.anglerad) * newtime;
			// let mapy = Math.sin(this.anglerad) * newtime;
			let mapy = newtime * this.speed;
			return [newtime, mapy];
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
			return [
				// {x: ((distance+mountainlength+(trainlength - trainlength/this.gamma))/this.speed), y: trainlength+distance+mountainlength},
				{x: (trainlength+distance)/this.speed, y: trainlength+distance},
				{x: (mountainlength+0.25-(trainlength/this.gamma))/this.speed, y: 0.25+mountainlength}
			];
		},
		doorEndTime: function(){

		}

	},
	mounted: function(){
		// train box
		d3.select("#transform").append("path").attr("d", line([
				{x: xScale(0), y: yScale(0)},
				{x: xScale(0), y: yScale(trainlength/this.gamma)},
				{x: xScale(1), y: yScale(this.speed+trainlength/this.gamma)},
				{x: xScale(1), y: yScale(this.speed)}
			])).attr("fill", "orangered").attr("opacity", "0.3").attr("class", "train");
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
		// the door points
		d3.select("#transform").selectAll("circle").data(this.door).enter().append("circle").attr("fill", "red").attr("r", 4).attr("cx", function(d){return xScale(d.x);}).attr("cy", function(d){ return yScale(d.y);}).attr("class", "point");
		// the points with the train
		d3.select("#transform").append("rect").attr("fill", "#f15a24").attr("width", 8).attr("height", 8).attr("class", "trainpoint").attr("x", xScale(0)-4).attr("y", yScale(0)-4);
		d3.select("#transform").append("rect").attr("fill", "#f15a24").attr("width", 8).attr("height", 8).attr("class", "trainpoint2").attr("x", xScale(0)-4).attr("y", yScale(trainlength/this.gamma)-4);
		// the time point that corresponds with the front of the train
		d3.select("#transform").append("rect").attr("fill", "green").attr("width", 8).attr("height", 8).attr("class", "newpoint").attr("x", xScale(0)-4).attr("y", yScale(0)-4);
		d3.select("#transform").append("path").attr("stroke-width", 1).attr("stroke", "green").attr("stroke-dasharray", "5 10").attr("class", "timeconnect");
		doorBClose();
	},
	watch: {
		speed: function(){
			this.update();
		},
	}
});

let step = function(){
	app.advanceTime();
	app.animate(step);
};

window.onload = function(){
	app.animate(step);
};