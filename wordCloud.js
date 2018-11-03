
const RECT_MARGIN = 10;

class wordCloud {

	constructor(opts) {
		this.element = opts.element;
		this.data = opts.data;
		this.width = opts.element.offsetWidth;
		this.height = this.width * 2 / 3;
	}

	draw() {
		const svg = d3.select(this.element)
					  .append("svg")
					  .attr("width", this.width)
					  .attr("height", this.height)

		var locList = [];
		var loc = null;

		// Iterate through word list and render from largest to smallest
		for (var i = 0; i < this.data.length; i++) {
			// if (i > 3) break;
 			var x, y, size;
			// 1 biggest word
			if (i == 0) {
				x = this.width / 2;
				y = this.height / 2;
				size = this.width / 10;
			} 
			// 2 second biggest word
			else if (i >= 1 && i <= 2) {
				size = this.width / 15;
			}
			// 5 third biggest word
			else if (i >= 3 && i <= 7) {
				size = this.width / 20;
			} 
			// 9 fourth biggest word
			else if (i >= 8 && i <= 16) {
				size = this.width / 25;
			}
			// 14 fifth biggest word
			else if (i >= 17 && i <= 30) {
				size = this.width / 30;
			}
			// 20 sixth biggest word
			else if (i >= 31 && i <= 50) {
				size = this.width / 35;
			}
			// rest seventh biggest word
			else {
				size = this.width / 40;
			}


			var text_width, text_height;
			var textDraft = null;
			// Check whether current word fits in its bounding rectangle
			while (!wordFits(svg, textDraft, loc) && locList.length > 0) {
				
				// Get random location from possible bounding rectangle list
				loc = locList[getRandomInt(0, locList.length - 1)];
				var wordData = drawWord(svg, this.width, this.height, this.data[i].word, loc, size);
				textDraft = wordData[0];
				x = wordData[1];
				y = wordData[2];

				var bounds = textDraft.node().getBoundingClientRect();
				text_width = bounds.right - bounds.left;
				text_height = bounds.bottom - bounds.top;
				console.log("(" + bounds.x + ", " + bounds.y + ")");
			}

			if (loc != null) {
				var index = locList.indexOf(loc);
				locList.splice(index, 1);
			}

			// Render first word largest and in center of element
			if (i == 0) {
				textDraft = svg.append("text")
							   .attr("id", "textDraft")
							   .attr("x", x)
							   .attr("y", y)
							   .text(this.data[i].word)
							   .attr("font-family", "sans-serif")
				    		   .attr("font-size", size + "px")
							   .attr("fill", "red")

				var bounds = textDraft.node().getBoundingClientRect();
				text_width = bounds.right - bounds.left;
				text_height = bounds.bottom - bounds.top;

				locList.push.apply(locList, addPrelimRectsToList(locList, x - text_width / 2, y + text_height / 2, 
																 text_width, text_height));

				// Draw initial rectangles //
				locList.forEach(function(d) {
					console.log("(" + d.x + ", " + d.y + ") ==> width = " + d.width + ", height = " + d.height);
					svg.append("rect")
					   .attr("x", d.x)
					   .attr("y", d.y)
					   .attr("width", d.width)
					   .attr("height", d.height)
					   .attr("fill", d.color)
				});
				// Remove when done //

				// Redraw inital word in correct place
				svg.selectAll("#textDraft").remove();
				svg.append("text")
				   .attr("id", "wordInCloud")
				   .attr("x", x - text_width / 2)
				   .attr("y", y + text_height / 2)
				   .text(this.data[i].word)
				   .attr("font-family", "sans-serif")
	    		   .attr("font-size", size + "px")
				   .attr("fill", "red")
			}

			// Other words have different bounding rectangle subdivision algo
			else {
				svg.selectAll("#textDraft").remove();
				svg.append("text")
				   .attr("id", "wordInCloud")
				   .attr("x", x)
				   .attr("y", y)
				   .text(this.data[i].word)
				   .attr("font-family", "sans-serif")
	    		   .attr("font-size", size + "px")
				   .attr("fill", "red")


				// Subdivide rectangle that this word was placed in, add to list of possible locations
			}
		}
	}







	// Print out word cloud data
	printData() {
		this.data.forEach(function(d) {
			console.log(d);
		});
	}
}




/* Returns random int between min, max inclusive */
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

/* Checks whether the given text element will fit within the given bounding rectangle */
function wordFits(svg, textDraft, loc) {
	if (textDraft == null) return false;

	var bounds = textDraft.node().getBoundingClientRect();
	var w = bounds.right - bounds.left;
	var h = bounds.bottom - bounds.top;

	if (loc.width < w || loc.height < h) {
		svg.selectAll("#textDraft").remove();
		return false;
	}

	return true;
}

/* Add 8 bounding rectangles to initial bounding rectangle list */
function addPrelimRectsToList(locList, text_x, text_y, text_width, text_height) {
	var newRects = [];

	// Upper left rect
	newRects.push({x: 0, y: 0, width: text_x, height: text_y - text_height, color: "darkgrey"});

	// Upper mid rect
	newRects.push({x: text_x, y: 0, width: text_width, height: text_y - text_height, color: "blue"});

	// Upper right rect
	newRects.push({x: text_x + text_width, y: 0, width: text_x, height: text_y - text_height, color: "green"});

	// Mid left rect
	newRects.push({x: 0, y: text_y - text_height, width: text_x, height: text_height, color: "purple"});

	// Mid right rect
	newRects.push({x: text_x + text_width, y: text_y - text_height, width: text_x, height: text_height, color: "black"});

	// Bottom left rect
	newRects.push({x: 0, y: text_y, width: text_x, height: text_y - text_height, color: "yellow"});

	// Bottom mid rect
	newRects.push({x: text_x, y: text_y, width: text_width, height: text_y - text_height, color: "brown"});

	// Bottom right rect
	newRects.push({x: text_x + text_width, y: text_y, width: text_x, height: text_y - text_height, color: "orange"});

	return newRects;
}


/* 
 * Draws word in given bounding rect defined by loc
 * Returns the text element, and coordinates of the element
 */
function drawWord(svg, elemWidth, elemHeight, word, loc, size) {

	x = loc.x;
	y = loc.y;



	console.log("word = " + word + ", (" + x + ", " + y + ")");
	console.log("height = " + elemHeight)

	// Draw draft of word to get height
	var textDraft = svg.append("text")
					   .attr("id", "textDraft")
					   .attr("x", x)
					   .attr("y", y)
					   .text(word)
					   .attr("font-family", "sans-serif")
		    		   .attr("font-size", size + "px")
					   .attr("fill", "red")

	var bounds = textDraft.node().getBoundingClientRect();
	var w = bounds.right - bounds.left;
	var h = bounds.bottom - bounds.top;
	svg.selectAll("#textDraft").remove();

	// Right side of page, draw hugging left side of bounding rect
	if (loc.x >= elemWidth / 2) {
		x += RECT_MARGIN;
	} 
	// Left side of page, draw hugging right side of bounding rect
	else {
		x = loc.x + loc.width - w - RECT_MARGIN;
	}
	// Bottom of page, draw hugging top of bounding rect
	if (loc.y >= elemHeight / 2) {
		console.log("bottom of page");
		y += (3/4 * h);
	}
	// Top of page, draw hugging bottom of bounding rect
	else {
		y = loc.y + loc.height - (1/4 * h);
	}


	// Draw 	
	var textDraft = svg.append("text")
					   .attr("id", "textDraft")
					   .attr("x", x)
					   .attr("y", y)
					   .text(word)
					   .attr("font-family", "sans-serif")
		    		   .attr("font-size", size + "px")
					   .attr("fill", "red")


	return [textDraft, x, y];
}
















