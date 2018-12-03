

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
		self.data 	 = opts.data;
		
		this.draw();
	}

	/*
	 * Renders the line plot
	 * Called in constructor
	 */
	draw() {
		/* Render x axis */
		var xValue = function(d) { return d.getCountryFreq(); },					// x is string to specify value
			xScale = d3.scaleLinear().range([0, this.width]),						// value --> display
			xMap   = function(d) { return xScale(xValue(d)) + self.margin.left; },	// data --> display
			xAxis  = d3.axisBottom(xScale).ticks(0).tickSize(0), 					// axis
			yScale = d3.scaleLinear().range([this.height, 0]);		// value --> display

		var colorMap = function(d) {	
			var res = d.getGeneralFreq() - d.getCountryFreq();
			// More common in country, bottom triangle
			if (res < 0) {
				var spectrum = (yScale(d.getGeneralFreq()) - yScale(d.getCountryFreq()));
				if (spectrum > 0 && spectrum <= self.height / 5.0) {
					return "#ccccff";
				}
				else if (spectrum > self.height / 5.0 && spectrum <= 2.0/5.0 * self.height) {
					return "#9999ff";
				}
				else if (spectrum > 2.0/5.0 * self.height && spectrum <=  3.0/5.0 * self.height) {
					return "#6666ff";
				}
				else if (spectrum > 3.0/5.0 * self.height && spectrum <= 4.0/5.0 * self.height5) {
					return "#3333ff";
				}
				else if (spectrum > 4.0/5.0 * self.height) {
					return "#0000ff";
				}
			}
			// Less common in country, top triangle
			else if (res > 0) {
				var spectrum = (yScale(d.getGeneralFreq()) - yScale(d.getCountryFreq())) * -1;
				if (spectrum > 0 && spectrum <= self.height / 5.0) {
					return "#ffcccc";
				}
				else if (spectrum > self.height / 5.0 && spectrum <= 2.0/5.0 * self.height) {
					return "#ff9999";
				}
				else if (spectrum > 2.0/5.0 * self.height && spectrum <=  3.0/5.0 * self.height) {
					return "#ff6666";
				}
				else if (spectrum > 3.0/5.0 * self.height && spectrum <= 4.0/5.0 * self.height5) {
					return "#ff3333";
				}
				else if (spectrum > 4.0/5.0 * self.height) {
					return "#ff0000";
				}

			}
			// Equally common in both genres
			else {
				return "#e6e6e6";
			}
		};
		
		// x axis
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
		// "In Country"
		self.svg.append("text")
			.attr("id", "lineaxislabelincountry")
		  	.attr("x", self.margin.left + (this.width / 2) - 50)
		  	.attr("y", xAxisLabelsY)
		  	.text("In Country")
		  	.style("font-weight", "bold")
		// "More usage"
		self.svg.append("text")
			.attr("id", "lineaxislabelmore")
		  	.attr("x", this.width + self.margin.left - 70)
		  	.attr("y", xAxisLabelsY)
		  	.text("More Usage")
		  	.style("font-style", "italic")
		// "Less"
		self.svg.append("text")
		  	.attr("id", "lineaxislabelless")
		  	.attr("x", self.margin.left)
		  	.attr("y", xAxisLabelsY)
		  	.text("Less")
		  	.style("font-style", "italic")
		// "Usage"
		self.svg.append("text")
		  	.attr("id", "lineaxislabelusage")
		  	.attr("x", self.margin.left + 32)
		  	.attr("y", xAxisLabelsY)
		  	.text("Usage")
		  	.style("font-style", "italic")

		/* Plot points */
		var pointG = self.svg.selectAll(".lineplotdot")
			.data(self.data)
		  .enter().append("g")
		pointG.append("circle")
		  	.attr("class", "lineplotdot")
		  	.attr("id", function(d) { return d.getWord(); })
		  	.attr("r", DOT_SIZE)
		  	.attr("cx", xMap)
		  	.attr("cy", xAxisShift)
		  	.style("fill", colorMap)
		pointG.append("text")
		  	.attr("class", "lineplotdot info word")
		  	.attr("x", xMap)
		  	.attr("y", xAxisShift + 20)
		  	.style("font-style", "italic")
		  	.style("font-weight", "bold")
		  	.text(function(d) { return d.getWord(); })
		pointG.append("text")
		  	.attr("class", "lineplotdot info freq")
		  	.attr("x", xMap)
		  	.attr("y", xAxisShift + 40)
		  	.attr("fill", "grey")
		  	.text(function(d) { return d.getCountryFreq(); })

		// Center labels around their corresponding points
		var labels = self.svg.selectAll(".lineplotdot.info");
		labels._groups[0].forEach(function(d) {
			var x = d.getAttribute("x");
			d.setAttribute("x", x - d.getComputedTextLength()/2)
		})
	}


	/*
	 * Displays the line plot
	 * Animates the transition back to the original state from draw() method
	 */
	show() {
		/* Animate x axis appearing */
		var spacing = 30;
		var xAxisLabelsY = self.margin.top;
		var xAxisShift = xAxisLabelsY + spacing;
		var xArrowX = this.width + self.margin.left;

		// animate x axis rise
		self.svg.selectAll(".lineaxis")
		    .transition()
     		.duration(TRANSITION_DURATION)
			.attr("transform", "translate(" + self.margin.left + "," + xAxisShift + ")")
		self.svg.selectAll(".lineaxisarrow")
		    .transition()
     		.duration(TRANSITION_DURATION)
			.attr("transform", "translate(" + xArrowX + "," + xAxisShift + ")rotate(90)")

		// animate labels coming back up
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

	  	// animate data falling into place on the scatter plot
     	self.svg.selectAll(".lineplotdot")
     		.transition()
     		.duration(TRANSITION_DURATION)
     		.attr("cy", xAxisShift)
     	self.svg.selectAll(".lineplotdot.info.word")
     		.transition()
     		.duration(TRANSITION_DURATION)
     		.attr("y", xAxisShift + 20)
     	self.svg.selectAll(".lineplotdot.info.freq")
     		.transition()
     		.duration(TRANSITION_DURATION)
     		.attr("y", xAxisShift + 40)

     	// animate y axis hiding
		self.svg.selectAll(".lineplotyaxis")
			.transition()
     		.duration(TRANSITION_DURATION)
     		.attr("x", 0)
     		// .attr("transform", "translate(" + 0 + "," + 0 + ")")
			.style("opacity", 0);
	}


	/*
	 * Animates the transition to the first change in the displayed data
	 */
	showYAxis() {

		// Re-show if coming from below
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
 		self.svg.selectAll(".lineplotdot")
 			.style("opacity", 1);


		// y mappings
		var yValue = function(d) { return d.getGeneralFreq(); },	// y is string to specify value
			yScale = d3.scaleLinear().range([this.height, 0]),		// value --> display
			yMap   = function(d) { return yScale(yValue(d)) + self.margin.top; },		// data --> display
			yLabelMap   = function(d) { return yScale(yValue(d)) + self.margin.top - 10; },		// data --> display
			yAxis  = d3.axisLeft(yScale).ticks(0).tickSize(0);		// axis

		var xAxisShift = this.height + self.margin.top,
		    xArrowX = this.width + self.margin.left,
		    xArrowY = this.height + self.margin.top,
			xAxisLabelsY = this.height  + self.margin.bottom + 10,
	        v_spacing = 17,
		    yAxisLabelsX = 40;


		/* Draw y axis */
		self.svg.append("g")
			.attr("class", "lineplotyaxis")
			.style("opacity", 0)
			.attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")")
			.transition()
			.duration(TRANSITION_DURATION)
			.style("opacity", 1)
			.call(yAxis)

		// y axis arrow
		self.svg.append("svg:path")
			.attr("class", "lineplotyaxis")
			.style("opacity", 0)
			.attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")")
			.transition()
			.duration(TRANSITION_DURATION)
			.style("opacity", 1)
			.attr("d", d3.symbol().type(d3.symbolTriangle))
			.attr("fill", "black")

		// y axis labels
		var v_spacing = 17;
		var yAxisLabelsX = 40;
		self.svg.append("text")
		  	.attr("class", "lineplotyaxis")
		  	.style("opacity", 0)
			.transition()
			.duration(TRANSITION_DURATION)
			.style("opacity", 1)
		  	.attr("x", yAxisLabelsX + 10)
		  	.attr("y", self.margin.top + v_spacing)
		  	.text("More")
		  	.style("font-style", "italic")
		self.svg.append("text")
		  	.attr("class", "lineplotyaxis")
		  	.style("opacity", 0)
			.transition()
			.duration(TRANSITION_DURATION)
			.style("opacity", 1)
		  	.attr("x", yAxisLabelsX + 10)
		  	.attr("y", self.margin.top + (2 * v_spacing))
		  	.text("Usage")
		  	.style("font-style", "italic")
		self.svg.append("text")
		  	.attr("class", "lineplotyaxis")
		  	.style("opacity", 0)
			.transition()
			.duration(TRANSITION_DURATION)
			.style("opacity", 1)
		  	.attr("x", yAxisLabelsX)
		  	.attr("y", self.margin.top + (this.height / 2) - v_spacing)
		  	.text("In")
		  	.style("font-weight", "bold")
		self.svg.append("text")
		  	.attr("class", "lineplotyaxis")
		  	.style("opacity", 0)
			.transition()
			.duration(TRANSITION_DURATION)
			.style("opacity", 1)
		  	.attr("x", yAxisLabelsX)
		  	.attr("y", self.margin.top + (this.height / 2))
		  	.text("Other")
		  	.style("font-weight", "bold")
		self.svg.append("text")
		  	.attr("class", "lineplotyaxis")
		  	.style("opacity", 0)
			.transition()
			.duration(TRANSITION_DURATION)
			.style("opacity", 1)
		  	.attr("x", yAxisLabelsX)
		  	.attr("y", self.margin.top + (this.height / 2) + v_spacing)
		  	.text("Genres")
		  	.style("font-weight", "bold")


		// animate x axis drop
		self.svg.selectAll(".lineaxis")
		    .transition()
     		.duration(TRANSITION_DURATION)
     		.attr("transform", "translate(" + self.margin.left + "," + xAxisShift + ")")
		self.svg.selectAll(".lineaxisarrow")
		    .transition()
     		.duration(TRANSITION_DURATION)
     		.attr("transform", "translate(" + xArrowX + "," + xArrowY + ")rotate(90)")

     	// animate axis labels drop
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

     	// animate data falling into place on the scatter plot
     	self.svg.selectAll(".lineplotdot")
     		.transition()
     		.duration(TRANSITION_DURATION)
     		.attr("y", yMap)
     		.attr("cy", yMap)

		self.svg.selectAll(".lineplotdot.info.word")
			.transition()
			.duration(TRANSITION_DURATION)
			.attr("y", yLabelMap)   		

		self.svg.selectAll(".lineplotdot.info.freq")
			.transition()
			.duration(TRANSITION_DURATION)
			.style("opacity", 0)
	}

	/*
	 * Animates the transition to the second change in the displayed data
	 */
	updateSecond() {
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
 		self.svg.selectAll(".lineplotdot")
 			.style("opacity", 1);
	}


	/*
	 * Animates the transition to the scatter plot datas
	 */
	updateToScatterPlot() {

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
     		self.svg.selectAll(".lineplotdot")
 				.style("opacity", 0);
		}, TRANSITION_DURATION);
	}













}


















