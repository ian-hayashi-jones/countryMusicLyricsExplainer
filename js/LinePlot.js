

class LinePlot {


	constructor(opts) {
		self.svg	 = opts.svg;		// background
		self.margin  = opts.margin;
		this.width   = opts.width - self.margin.right - self.margin.left;			// graph width
		this.height  = opts.height - self.margin.bottom - self.margin.top;			// graph height
		this.width   = Math.min(this.width, this.height);
		this.height  = this.width;
		self.width   = opts.width;
		self.height  = opts.height;
		this.draw();
	}

	draw() {
		console.log("drawing line plot");

		var xValue = function(d) { return d.getCountryFreq(); },				// x is string to specify value
			xScale = d3.scaleLinear().range([0, this.width]),					// value --> display
			xMap   = function(d) { return xScale(xValue(d)) + self.margin.left; },	// data --> display
			xAxis  = d3.axisBottom(xScale).ticks(0).tickSize(0); 				// axis
		
		/* Draw x axis */
		var spacing = 30;
		var xAxisLabelsY = self.margin.top;
		var xAxisShift = xAxisLabelsY + spacing;
		self.svg.append("g")
			.attr("class", "lineaxis")
			.attr("transform", "translate(" + self.margin.left + "," + xAxisShift + ")")
			.call(xAxis)
			
		// x axis arrow
		var xArrowX = this.width + self.margin.left;
		self.svg.append("svg:path")
			.attr("class", "lineaxisarrow")
			.attr("d", d3.symbol().type(d3.symbolTriangle))
			.attr("transform", "translate(" + xArrowX + "," + xAxisShift + ")rotate(90)")
			.attr("fill", "black")

		// x axis labels
		self.svg.append("text")
			.attr("id", "lineaxislabelincountry")
		  	.attr("x", self.margin.left + (this.width / 2) - 50)
		  	.attr("y", xAxisLabelsY)
		  	.text("In Country")
		  	.style("font-weight", "bold")
		self.svg.append("text")
			.attr("id", "lineaxislabelmore")
		  	.attr("x", this.width + self.margin.left - 70)
		  	.attr("y", xAxisLabelsY)
		  	.text("More Usage")
		  	.style("font-style", "italic")
		
		self.svg.append("text")
		  	.attr("id", "lineaxislabelless")
		  	.attr("x", self.margin.left)
		  	.attr("y", xAxisLabelsY)
		  	.text("Less")
		  	.style("font-style", "italic")

		self.svg.append("text")
		  	.attr("id", "lineaxislabelusage")
		  	.attr("x", self.margin.left + 32)
		  	.attr("y", xAxisLabelsY)
		  	.text("Usage")
		  	.style("font-style", "italic")
	}

	show() {
		/* Animate x axis appearing */
		var spacing = 30;
		var xAxisLabelsY = self.margin.top;
		var xAxisShift = xAxisLabelsY + spacing;
		var xArrowX = this.width + self.margin.left;

		self.svg.selectAll(".lineaxis")
		    .transition()
     		.duration(TRANSITION_DURATION)
			.attr("transform", "translate(" + self.margin.left + "," + xAxisShift + ")")

     	// animate x axis drop
		self.svg.selectAll(".lineaxisarrow")
		    .transition()
     		.duration(TRANSITION_DURATION)
			.attr("transform", "translate(" + xArrowX + "," + xAxisShift + ")rotate(90)")

     	self.svg.selectAll("#lineaxislabelincountry")
     		.transition()
     		.duration(TRANSITION_DURATION)
		  	.attr("y", xAxisLabelsY)

     	self.svg.selectAll("#lineaxislabelmore")
     		.transition()
     		.duration(TRANSITION_DURATION)
		  	.attr("y", xAxisLabelsY)

     	self.svg.selectAll("#lineaxislabelless")
     		.transition()
     		.duration(TRANSITION_DURATION)
		  	.attr("x", self.margin.left)
     		.attr("y", xAxisLabelsY)

     	self.svg.selectAll("#lineaxislabelusage")
     		.transition()
     		.duration(TRANSITION_DURATION)
		  	.attr("x", self.margin.left + 32)
	  		.attr("y", xAxisLabelsY)

	}


	updateFirst() {
		console.log("update second");
	}


	updateSecond() {
		console.log("update second");
		self.svg.selectAll(".lineaxis")
 			.style("opacity", 1);
 		self.svg.selectAll(".lineaxisarrow")
 		    .style("opacity", 1);
 		self.svg.selectAll("#lineaxislabelincountry")
 		     .style("opacity", 1);
 		self.svg.selectAll("#lineaxislabelmore")
 		    .style("opacity", 1);
 		self.svg.selectAll("#lineaxislabelless")
 		    .style("opacity", 1);
 		self.svg.selectAll("#lineaxislabelusage")
 			.style("opacity", 1);
	}

	updateToScatterPlot() {
		console.log("update to scatter");

		var xAxisShift = this.height + self.margin.top;
		var xArrowX = this.width + self.margin.left;
		var xArrowY = this.height + self.margin.top;
		var xAxisLabelsY = this.height  + self.margin.bottom + 10;
		var v_spacing = 17;
		var yAxisLabelsX = 40;
		// animate x axis drop
		self.svg.selectAll(".lineaxis")
		    .transition()
     		.duration(TRANSITION_DURATION)
     		.attr("transform", "translate(" + self.margin.left + "," + xAxisShift + ")")

     	// animate x axis drop
		self.svg.selectAll(".lineaxisarrow")
		    .transition()
     		.duration(TRANSITION_DURATION)
     		.attr("transform", "translate(" + xArrowX + "," + xArrowY + ")rotate(90)")

     	self.svg.selectAll("#lineaxislabelincountry")
     		.transition()
     		.duration(TRANSITION_DURATION)
     		.attr("y", xAxisLabelsY)

     	self.svg.selectAll("#lineaxislabelmore")
     		.transition()
     		.duration(TRANSITION_DURATION)
     		.attr("x", this.width + self.margin.left - 70)
		  	.attr("y", xAxisLabelsY)

     	self.svg.selectAll("#lineaxislabelless")
     		.transition()
     		.duration(TRANSITION_DURATION)
     		.attr("x", yAxisLabelsX + 20)
     		.attr("y", self.margin.top + self.margin.bottom / 2 + this.height)

     	self.svg.selectAll("#lineaxislabelusage")
     		.transition()
     		.duration(TRANSITION_DURATION)
     		.attr("x", yAxisLabelsX + 15)
     		.attr("y", self.margin.top + self.margin.bottom / 2 + this.height + v_spacing)



     	// wait till animation is over and then remove these so that there aren't two of everything once scatterplot is rendered
     	window.setTimeout(function () {
			self.svg.selectAll(".lineaxis")
     			.style("opacity", 0);
     		self.svg.selectAll(".lineaxisarrow")
     		    .style("opacity", 0);
     		self.svg.selectAll("#lineaxislabelincountry")
     		     .style("opacity", 0);
     		self.svg.selectAll("#lineaxislabelmore")
     		    .style("opacity", 0);
     		self.svg.selectAll("#lineaxislabelless")
     		    .style("opacity", 0);
     		self.svg.selectAll("#lineaxislabelusage")
     			.style("opacity", 0);

		}, TRANSITION_DURATION);

	}













}


















