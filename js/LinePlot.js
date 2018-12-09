

class LinePlot {


	constructor(opts) {
		this.svg	 = opts.svg;		// background
		self.margin  = opts.margin;
		
		// make width and height equal
		this.width   = opts.width - self.margin.right - self.margin.left;			// graph width
		this.height  = opts.height - self.margin.bottom - self.margin.top;			// graph height
		this.width   = Math.min(this.width, this.height);
		this.height  = this.width;
		self.width   = this.width;
		self.height  = this.height;

		this.data = opts.data;
		this.type = opts.type;			// for alternate x/y variables

		this.draw();
	}

	/*
	 * Renders the line plot
	 * Called in constructor
	 */
	draw() {
		// show line
		var lineData = [{"x": self.margin.left, "y": self.height + self.margin.top}, {"x": self.margin.left + self.width, "y": self.margin.top}]
		var line = d3.line()
	 			.x(function(d) { return d.x; })
	 			.y(function(d) { return d.y; })
	 	this.svg.append("path")
	 		.attr("class", "lineplotline")
	        .attr("d", line(lineData))
	        .attr("stroke", GREY_ACCENT)
	        .attr("stroke-width", 2)
	        .attr("opacity", 0)

		/* Render x axis, country to start out in both types */
		var xScale = d3.scaleLog()
		    				.domain([
								0.033501997, 
								387.1602479
		    				])
							.range([0, self.width]),
			yScale = d3.scaleLog()
				    		.domain([
				    			0.033501997,
				    			387.1602479
				    		])
				    		.range([self.height, 0]);
		
		// x and y mappings
		var xMap   = function(d) { return xScale(+d.x) + self.margin.left; },
			xAxis  = d3.axisBottom(xScale).ticks(0).tickSize(0), 				
			yMap   = function(d) { return yScale(+d.y) + self.margin.top; };		

		var colorMap = function(d) {
			var res = +d.y - +d.x;
			// More common in country, bottom triangle
			if (res < 0) {
				var spectrum = (yScale(+d.y) - yScale(+d.x));
				if (spectrum > 0 && spectrum <= self.height / 20.0) {
					return "#ccccff";
				}
				else if (spectrum > self.height / 20.0 && spectrum <= 1.0/10.0 * self.height) {
					return "#9999ff";
				}
				else if (spectrum > 1.0/10.0 * self.height && spectrum <=  1.0/5.0 * self.height) {
					return "#6666ff";
				}
				else if (spectrum > 1.0/5.0 * self.height && spectrum <= 1.0/2.0 * self.height) {
					return "#3333ff";
				}
				else if (spectrum > 1.0/2.0 * self.height) {
					return "#0000ff";
				}
			}
			// Less common in country, top triangle
			else if (res > 0) {
				var spectrum = (yScale(+d.y) - yScale(+d.x)) * -1;
				if (spectrum > 0 && spectrum <= self.height / 20.0) {
					return "#ffcccc";
				}
				else if (spectrum > self.height / 20.0 && spectrum <= 1.0/10.0 * self.height) {
					return "#ff9999";
				}
				else if (spectrum > 1.0/10.0 * self.height && spectrum <=  1.0/5.0 * self.height) {
					return "#ff6666";
				}
				else if (spectrum > 1.0/5.0 * self.height && spectrum <= 1.0/2.0 * self.height) {
					return "#ff3333";
				}
				else if (spectrum > 1.0/2.0 * self.height) {
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
		this.svg.append("g")
			.attr("class", "lineaxis")
			.attr("transform", "translate(" + self.margin.left + "," + xAxisShift + ")")
			.call(xAxis)
			
		// x axis arrow
		var xArrowX = this.width + self.margin.left;
		this.svg.append("svg:path")
			.attr("class", "lineaxisarrow")
			.attr("d", d3.symbol().type(d3.symbolTriangle))
			.attr("transform", "translate(" + xArrowX + "," + xAxisShift + ")rotate(90)")
			.attr("fill", "black")

		// x axis labels
		// "More usage"
		this.svg.append("text")
			.attr("id", "lineaxislabelmore")
		  	.attr("x", this.width + self.margin.left - 70)
		  	.attr("y", xAxisLabelsY)
		  	.text("More Usage")
		  	.style("font-style", "italic")
		// "Less"
		this.svg.append("text")
		  	.attr("id", "lineaxislabelless")
		  	.attr("x", self.margin.left)
		  	.attr("y", xAxisLabelsY)
		  	.text("Less")
		  	.style("font-style", "italic")
		// "Usage"
		this.svg.append("text")
		  	.attr("id", "lineaxislabelusage")
		  	.attr("x", self.margin.left + 32)
		  	.attr("y", xAxisLabelsY)
		  	.text("Usage")
		  	.style("font-style", "italic")


		if (this.type == "country") {
			// "In Country"
			this.svg.append("text")
				.attr("id", "lineaxislabel")
			  	.attr("x", self.margin.left + (this.width / 2) - 50)
			  	.attr("y", xAxisLabelsY)
			  	.text("In Country")
			  	.style("font-weight", "bold")

		} else if (this.type == "gender") {
			// "Female artists"
			this.svg.append("text")
				.attr("id", "lineaxislabel")
			  	.attr("x", self.margin.left + (this.width / 2) - 65)
			  	.attr("y", xAxisLabelsY)
			  	.text("Female artists")
			  	.style("font-weight", "bold")
		}

		/* Plot points */
		var pointG = this.svg.selectAll(".lineplotdot")
			.data(this.data)
		  .enter().append("g")
		pointG.append("circle")
		  	.attr("class", "lineplotdot")
		  	.attr("id", function(d) { return d.word; })
		  	.attr("r", DOT_SIZE)
		  	.attr("cx", xMap)
		  	.attr("cy", xAxisShift)
		  	.attr("fill", colorMap)
		pointG.append("text")
		  	.attr("class", "lineplotdot info word")
		  	.attr("x", xMap)
		  	.attr("y", xAxisShift + 20)
		  	.attr("fill", "black")
		  	.style("font-style", "italic")
		  	.style("font-weight", "bold")
		  	.text(function(d) { return d.word; })
		pointG.append("text")
		  	.attr("class", "lineplotdot info freq")
		  	.attr("x", xMap)
		  	.attr("y", xAxisShift + 40)
		  	.attr("fill", "grey")
		  	.text(function(d) { return Math.round(d.x * 100) / 100; })

		// Center labels around their corresponding points
		var labels = this.svg.selectAll(".lineplotdot.info");
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

		/* For moving points back to country x positions */
		var xScale = d3.scaleLog()
		    				.domain([
								0.033501997, 
								387.1602479
		    				])
							.range([0, self.width]),
			yScale = d3.scaleLog()
				    		.domain([
				    			0.033501997,
				    			387.1602479
				    		])
				    		.range([self.height, 0]);		
		// x mapping
		var xMap = function(d) { return xScale(d.x) + self.margin.left; };

		var colorMap = function(d) {
			var res = +d.y - +d.x;
			// More common in country, bottom triangle
			if (res < 0) {
				var spectrum = (yScale(+d.y) - yScale(+d.x));
				if (spectrum > 0 && spectrum <= self.height / 20.0) {
					return "#ccccff";
				}
				else if (spectrum > self.height / 20.0 && spectrum <= 1.0/10.0 * self.height) {
					return "#9999ff";
				}
				else if (spectrum > 1.0/10.0 * self.height && spectrum <=  1.0/5.0 * self.height) {
					return "#6666ff";
				}
				else if (spectrum > 1.0/5.0 * self.height && spectrum <= 1.0/2.0 * self.height) {
					return "#3333ff";
				}
				else if (spectrum > 1.0/2.0 * self.height) {
					return "#0000ff";
				}
			}
			// Less common in country, top triangle
			else if (res > 0) {
				var spectrum = (yScale(+d.y) - yScale(+d.x)) * -1;
				if (spectrum > 0 && spectrum <= self.height / 20.0) {
					return "#ffcccc";
				}
				else if (spectrum > self.height / 20.0 && spectrum <= 1.0/10.0 * self.height) {
					return "#ff9999";
				}
				else if (spectrum > 1.0/10.0 * self.height && spectrum <=  1.0/5.0 * self.height) {
					return "#ff6666";
				}
				else if (spectrum > 1.0/5.0 * self.height && spectrum <= 1.0/2.0 * self.height) {
					return "#ff3333";
				}
				else if (spectrum > 1.0/2.0 * self.height) {
					return "#ff0000";
				}
			}
			// Equally common in both genres
			else {
				return "#e6e6e6";
			}
		};

		// animate x axis rise
		this.svg.selectAll(".lineaxis")
		    .transition()
     		.duration(TRANSITION_DURATION)
			.attr("transform", "translate(" + self.margin.left + "," + xAxisShift + ")")
		this.svg.selectAll(".lineaxisarrow")
		    .transition()
     		.duration(TRANSITION_DURATION)
			.attr("transform", "translate(" + xArrowX + "," + xAxisShift + ")rotate(90)")

		// animate labels coming back up
     	this.svg.selectAll("#lineaxislabel")
     		.transition()
     		.duration(TRANSITION_DURATION)
		  	.attr("y", xAxisLabelsY)
		  	.text("In Country")
     	this.svg.selectAll("#lineaxislabelmore")
     		.transition()
     		.duration(TRANSITION_DURATION)
		  	.attr("y", xAxisLabelsY)
     	this.svg.selectAll("#lineaxislabelless")
     		.transition()
     		.duration(TRANSITION_DURATION)
		  	.attr("x", self.margin.left)
     		.attr("y", xAxisLabelsY)
     	this.svg.selectAll("#lineaxislabelusage")
     		.transition()
     		.duration(TRANSITION_DURATION)
		  	.attr("x", self.margin.left + 32)
	  		.attr("y", xAxisLabelsY)

	  	// animate data falling into place on the scatter plot
     	this.svg.selectAll(".lineplotdot")
     		.transition()
     		.duration(TRANSITION_DURATION)
     		.attr("cy", xAxisShift)
     		.attr("cx", xMap)
     		.attr("fill", colorMap)


     	// Don't shift x position
     	if (this.type == "country") {
	     	this.svg.selectAll(".lineplotdot.info.word")
	     		.transition()
	     		.duration(TRANSITION_DURATION)
	     		.attr("y", xAxisShift + 20)
	     	this.svg.selectAll(".lineplotdot.info.freq")
	     		.transition()
	     		.duration(TRANSITION_DURATION)
	     		.attr("y", xAxisShift + 40)
	     		.style("opacity", 1)

	    // Shift x position
     	} else if (this.type == "gender") {

	     	// Center labels around their corresponding points
			var words = this.svg.selectAll(".lineplotdot.info.word");
			words._groups[0].forEach(function(d) {
				d3.select(d)
					.transition()
					.duration(TRANSITION_DURATION)
					.attr("x", function() {
						return xMap(d3.select(d).datum()) - d.getComputedTextLength()/2;
					})
					.attr("y", xAxisShift + 20)	
			})

			// Center labels around their corresponding points
			var freqs = this.svg.selectAll(".lineplotdot.info.freq");
			freqs._groups[0].forEach(function(d) {
				d3.select(d)
					.transition()
					.duration(TRANSITION_DURATION)
					.attr("x", function() {
						return xMap(d3.select(d).datum()) - d.getComputedTextLength()/2;
					})	
					.attr("y", xAxisShift + 40)
					.style("opacity", 1)
			})

     	}


     	// animate y axis hiding
		this.svg.selectAll(".lineplotyaxis")
			.transition()
     		.duration(TRANSITION_DURATION)
     		.attr("x", 0)
			.style("opacity", 0);

		// hide line points
		this.svg.selectAll(".scatter.line")
		    .transition()
     		.duration(TRANSITION_DURATION)
			.style("opacity", 0);

		// hide line appearing
     	this.svg.selectAll(".lineplotline")
     		.transition()
     		.duration(TRANSITION_DURATION)
     		.style("opacity", 0)
	}


	/*
	 * Animates the transition to the first change in the displayed data
	 */
	showYAxis(type) {
		// Animate line appearing
     	this.svg.selectAll(".lineplotline")
     		.transition()
     		.duration(TRANSITION_DURATION)
     		.style("opacity", 1)

		// Re-show if coming from below
		this.svg.selectAll(".lineaxis")
 			.style("opacity", 1);
 		this.svg.selectAll(".lineaxisarrow")
 		    .style("opacity", 1);
 		this.svg.selectAll("#lineaxislabel")
 		     .style("opacity", 1);
 		this.svg.selectAll("#lineaxislabelmore")
 		    .style("opacity", 1);
 		this.svg.selectAll("#lineaxislabelless")
 		    .style("opacity", 1);
 		this.svg.selectAll("#lineaxislabelusage")
 			.style("opacity", 1);

		var xAxisShift = this.height + self.margin.top,
		    xArrowX = this.width + self.margin.left,
		    xArrowY = this.height + self.margin.top,
			xAxisLabelsY = this.height  + self.margin.bottom + 10,
	        v_spacing = 17,
		    yAxisLabelsX = 40;


		var xScale, xMap;
		var yScale, yAxis, yMap, yLabelMap, yFreqMap;

		if (type == "country") {
			xScale = d3.scaleLog()
				.domain([
					0.033501997, 
					387.1602479
				])
				.range([0, self.width]),
			yScale = d3.scaleLog()
	    		.domain([
	    			0.033501997,
	    			387.1602479
	    		])
	    		.range([self.height, 0]);

			xMap       = function(d) { return xScale(+d.x) + self.margin.left;},				// data --> display
			yMap   	   = function(d) { return yScale(+d.y) + self.margin.top; },				// data --> display
			yLabelMap  = function(d) { return yScale(+d.y) + self.margin.top - 28; },		// data --> display
			yFreqMap   = function(d) { return yScale(+d.y) + self.margin.top - 10 ; };		// data --> display
		} else if (type == "gender") {
			xScale = d3.scaleLog()
				.domain([
					.102228, 
					353.4184823
				])
				.range([0, self.width]),
			yScale = d3.scaleLog()
	    		.domain([
	    			.102228,
	    			353.4184823
	    		])
	    		.range([self.height, 0]);

	    	xMap      = function(d) { return xScale(d.getNewX()) + self.margin.left;},		    	// data --> display
			yMap      = function(d) { return yScale(d.getNewY()) + self.margin.top; },				// data --> display
	    	yLabelMap = function(d) { return yScale(d.getNewY()) + self.margin.top - 28; },			// data --> display
			yFreqMap  = function(d) { return yScale(d.getNewY()) + self.margin.top - 10 ; };		// data --> display
		}

		yAxis  = d3.axisLeft(yScale).ticks(0).tickSize(0);	

		var colorMap;

		if (type == "country") {
			colorMap = function(d) {
				var res = +d.y - +d.x;
				// More common in country, bottom triangle
				if (res < 0) {
					var spectrum = (yScale(+d.y) - yScale(+d.x));
					if (spectrum > 0 && spectrum <= self.height / 20.0) {
						return "#ccccff";
					}
					else if (spectrum > self.height / 20.0 && spectrum <= 1.0/10.0 * self.height) {
						return "#9999ff";
					}
					else if (spectrum > 1.0/10.0 * self.height && spectrum <=  1.0/5.0 * self.height) {
						return "#6666ff";
					}
					else if (spectrum > 1.0/5.0 * self.height && spectrum <= 1.0/2.0 * self.height) {
						return "#3333ff";
					}
					else if (spectrum > 1.0/2.0 * self.height) {
						return "#0000ff";
					}
				}
				// Less common in country, top triangle
				else if (res > 0) {
					var spectrum = (yScale(+d.y) - yScale(+d.x)) * -1;
					if (spectrum > 0 && spectrum <= self.height / 20.0) {
						return "#ffcccc";
					}
					else if (spectrum > self.height / 20.0 && spectrum <= 1.0/10.0 * self.height) {
						return "#ff9999";
					}
					else if (spectrum > 1.0/10.0 * self.height && spectrum <=  1.0/5.0 * self.height) {
						return "#ff6666";
					}
					else if (spectrum > 1.0/5.0 * self.height && spectrum <= 1.0/2.0 * self.height) {
						return "#ff3333";
					}
					else if (spectrum > 1.0/2.0 * self.height) {
						return "#ff0000";
					}
				}
				// Equally common in both genres
				else {
					return "#e6e6e6";
				}
			};

		} else if (type == "gender") {
			colorMap = function(d) {
				var res = d.getNewY() - d.getNewX();
				// More common in country, bottom triangle
				if (res < 0) {
					var spectrum = (yScale(d.getNewY()) - yScale(d.getNewX()));
					if (spectrum > 0 && spectrum <= self.height / 20.0) {
						return "#ccccff";
					}
					else if (spectrum > self.height / 20.0 && spectrum <= 1.0/10.0 * self.height) {
						return "#9999ff";
					}
					else if (spectrum > 1.0/10.0 * self.height && spectrum <=  1.0/5.0 * self.height) {
						return "#6666ff";
					}
					else if (spectrum > 1.0/5.0 * self.height && spectrum <= 1.0/2.0 * self.height) {
						return "#3333ff";
					}
					else if (spectrum > 1.0/2.0 * self.height) {
						return "#0000ff";
					}
				}
				// Less common in country, top triangle
				else if (res > 0) {
					var spectrum = (yScale(d.getNewY()) - yScale(d.getNewX())) * -1;
					if (spectrum > 0 && spectrum <= self.height / 20.0) {
						return "#ffcccc";
					}
					else if (spectrum > self.height / 20.0 && spectrum <= 1.0/10.0 * self.height) {
						return "#ff9999";
					}
					else if (spectrum > 1.0/10.0 * self.height && spectrum <=  1.0/5.0 * self.height) {
						return "#ff6666";
					}
					else if (spectrum > 1.0/5.0 * self.height && spectrum <= 1.0/2.0 * self.height) {
						return "#ff3333";
					}
					else if (spectrum > 1.0/2.0 * self.height) {
						return "#ff0000";
					}
				}
				// Equally common in both genres
				else {
					return "#e6e6e6";
				}
			};
		}


		/* Draw y axis */
		this.svg.append("g")
			.attr("class", "lineplotyaxis")
			.style("opacity", 0)
			.attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")")
			.transition()
			.duration(TRANSITION_DURATION)
			.style("opacity", 1)
			.call(yAxis)

		// y axis arrow
		this.svg.append("svg:path")
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
		this.svg.append("text")
		  	.attr("class", "lineplotyaxis")
		  	.style("opacity", 0)
			.transition()
			.duration(TRANSITION_DURATION)
			.style("opacity", 1)
		  	.attr("x", yAxisLabelsX + 10)
		  	.attr("y", self.margin.top + v_spacing)
		  	.text("More")
		  	.style("font-style", "italic")
		this.svg.append("text")
		  	.attr("class", "lineplotyaxis")
		  	.style("opacity", 0)
			.transition()
			.duration(TRANSITION_DURATION)
			.style("opacity", 1)
		  	.attr("x", yAxisLabelsX + 10)
		  	.attr("y", self.margin.top + (2 * v_spacing))
		  	.text("Usage")
		  	.style("font-style", "italic")

		if (this.type == "country") {
			this.svg.append("text")
			  	.attr("class", "lineplotyaxis")
			  	.style("opacity", 0)
				.transition()
				.duration(TRANSITION_DURATION)
				.style("opacity", 1)
			  	.attr("x", yAxisLabelsX)
			  	.attr("y", self.margin.top + (this.height / 2) - v_spacing)
			  	.text("In")
			  	.style("font-weight", "bold")
			this.svg.append("text")
			  	.attr("class", "lineplotyaxis")
			  	.style("opacity", 0)
				.transition()
				.duration(TRANSITION_DURATION)
				.style("opacity", 1)
			  	.attr("x", yAxisLabelsX)
			  	.attr("y", self.margin.top + (this.height / 2))
			  	.text("Other")
			  	.style("font-weight", "bold")
			this.svg.append("text")
			  	.attr("class", "lineplotyaxis")
			  	.style("opacity", 0)
				.transition()
				.duration(TRANSITION_DURATION)
				.style("opacity", 1)
			  	.attr("x", yAxisLabelsX)
			  	.attr("y", self.margin.top + (this.height / 2) + v_spacing)
			  	.text("Genres")
			  	.style("font-weight", "bold")

		} else if (this.type == "gender") {
			this.svg.append("text")
			  	.attr("class", "lineplotyaxis")
			  	.style("opacity", 0)
				.transition()
				.duration(TRANSITION_DURATION)
				.style("opacity", 1)
			  	.attr("x", yAxisLabelsX)
			  	.attr("y", self.margin.top + (this.height / 2) - v_spacing)
			  	.text("Male")
			  	.style("font-weight", "bold")
			this.svg.append("text")
			  	.attr("class", "lineplotyaxis")
			  	.style("opacity", 0)
				.transition()
				.duration(TRANSITION_DURATION)
				.style("opacity", 1)
			  	.attr("x", yAxisLabelsX)
			  	.attr("y", self.margin.top + (this.height / 2))
			  	.text("Artists")
			  	.style("font-weight", "bold")
		}


		// animate x axis drop
		this.svg.selectAll(".lineaxis")
		    .transition()
     		.duration(TRANSITION_DURATION)
     		.attr("transform", "translate(" + self.margin.left + "," + xAxisShift + ")")
		this.svg.selectAll(".lineaxisarrow")
		    .transition()
     		.duration(TRANSITION_DURATION)
     		.attr("transform", "translate(" + xArrowX + "," + xArrowY + ")rotate(90)")

     	if (type == "country") {
	     	// animate axis labels drop
	     	this.svg.selectAll("#lineaxislabel")
	     		.transition()
	     		.duration(TRANSITION_DURATION)
	     		.attr("y", xAxisLabelsY)
     	} else if (type == "gender") {
     		// animate axis labels drop
     		this.svg.selectAll("#lineaxislabel")
	     		.transition()
	     		.duration(TRANSITION_DURATION)
	     		.attr("y", xAxisLabelsY)
	     		.text("Female Artists")
     	}


     	this.svg.selectAll("#lineaxislabelmore")
     		.transition()
     		.duration(TRANSITION_DURATION)
     		.attr("x", this.width + self.margin.left - 70)
		  	.attr("y", xAxisLabelsY)
     	this.svg.selectAll("#lineaxislabelless")
     		.transition()
     		.duration(TRANSITION_DURATION)
     		.attr("x", yAxisLabelsX + 20)
     		.attr("y", self.margin.top + self.margin.bottom / 2 + this.height)
     	this.svg.selectAll("#lineaxislabelusage")
     		.transition()
     		.duration(TRANSITION_DURATION)
     		.attr("x", yAxisLabelsX + 15)
     		.attr("y", self.margin.top + self.margin.bottom / 2 + this.height + v_spacing)

     	// animate data falling into place on the scatter plot
     	this.svg.selectAll(".lineplotdot")
     		.transition()
     		.duration(TRANSITION_DURATION)
     		.attr("r", DOT_SIZE)
     		.attr("cx", xMap)
     		.attr("cy", yMap)
     		.attr("fill", colorMap)
     		.style("stroke-width", 0)
 			.style("opacity", 1)


 		// No x position change
		if (type == "country") {
			this.svg.selectAll(".lineplotdot.info.word")
				.transition()
				.duration(TRANSITION_DURATION)
				.attr("y", yLabelMap)  
				.style("opacity", 1) 		

			this.svg.selectAll(".lineplotdot.info.freq")
				.transition()
				.duration(TRANSITION_DURATION)
				.attr("y", yFreqMap)
				.style("opacity", 1)

		// x position change
		} else if (type == "gender") {
			// Center labels around their corresponding points
			var labels = this.svg.selectAll(".lineplotdot.info.word");
			labels._groups[0].forEach(function(d) {
				d3.select(d)
					.transition()
					.duration(TRANSITION_DURATION)
					.attr("x", function() {
						return xMap(d3.select(d).datum()) - d.getComputedTextLength()/2;
					})
					.attr("y", yLabelMap)
					.style("opacity", 1)
			})
			// Center labels around their corresponding points
			var freqs = this.svg.selectAll(".lineplotdot.info.freq");
			freqs._groups[0].forEach(function(d) {
				d3.select(d)
					.transition()
					.duration(TRANSITION_DURATION)
					.attr("x", function() {
						return xMap(d3.select(d).datum()) - d.getComputedTextLength()/2;
					})
					.attr("y", yFreqMap)
					.style("opacity", 1)
			})
		}
	}




	/*
	 * Animates the transition to the scatter plot datas
	 */
	updateToScatterPlot() {
		// y mappings
		var yScale = d3.scaleLog()
			    		.domain([
			    			0.033501997,
			    			387.1602479
			    		])
			    		.range([self.height, 0]),
			yMap   = function(d) { return yScale(+d.y) + self.margin.top; },
			yLabelMap   = function(d) { return yScale(+d.y) + self.margin.top - 10; };	


		// hide line appearing
     	this.svg.selectAll(".lineplotline")
     		.transition()
     		.duration(TRANSITION_DURATION)
     		.style("opacity", 0)

		// animate data falling into place on the scatter plot
     	this.svg.selectAll(".lineplotdot")
     		.transition()
     		.duration(TRANSITION_DURATION)
     		.attr("cy", yMap)

		this.svg.selectAll(".lineplotdot.info.word")
			.transition()
			.duration(TRANSITION_DURATION)
			.attr("y", yLabelMap)   		

		var svg = this.svg;
     	// wait till animation is over and then remove these so that there aren't two of everything once scatterplot is rendered
     	window.setTimeout(function () {
			svg.selectAll(".lineaxis")
     			.style("opacity", 0);
     		svg.selectAll(".lineaxisarrow")
     		    .style("opacity", 0);
     		svg.selectAll("#lineaxislabel")
     		     .style("opacity", 0);
     		svg.selectAll("#lineaxislabelmore")
     		    .style("opacity", 0);
     		svg.selectAll("#lineaxislabelless")
     		    .style("opacity", 0);
     		svg.selectAll("#lineaxislabelusage")
     			.style("opacity", 0);
     		animatePoints();
		}, TRANSITION_DURATION - 50);


     	// Show/hide 
	    this.svg.selectAll(".lineplotdot")
	    	.style("opacity", 1)
	        // .style("stroke", "black") 
			.style("stroke-width", 2) 
		this.svg.selectAll(".lineplotdot.info")
	        .style("stroke", "black") 
			.style("stroke-width", 0) 
		this.svg.selectAll(".lineplotdot.info.freq")
			.transition()
			.duration(TRANSITION_DURATION)
	        .style("opacity", 0) 
     	
	    function animatePoints() {
	      svg.selectAll(".lineplotdot")
	        .transition()  
	        .duration(1000)  
	        .attr('r', 6)
	        .transition()     
	        .duration(1000)      
	        .attr('r', DOT_SIZE)    
	        .on("end", function(d) {
	        	if (d3.select(this).style("stroke-width") == 2)
	        	animatePoints(); 
	    	})
		};
	}


	/* 
	 * Stops the pulsing circles and hides labels
	 */
	stopAnimation(progress) {
		if (progress == 1) {
			this.svg.selectAll(".lineplotdot")
				.style("opacity", 0); 
		} 
		var circles = d3.selectAll(".lineplotdot") 
	        .transition()     
	        .duration(1000)   
	        .attr('r', DOT_SIZE)   
	        .style('stroke-width', 0)    			
	}


}


















