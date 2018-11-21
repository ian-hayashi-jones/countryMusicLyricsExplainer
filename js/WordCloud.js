/*
// wordCloud class
// 
// public draw() method renders and animates text in a word cloud
// constructor takes data input in the form of an array of {word, count}
//
*/


const RECT_MARGIN = 20;		// Horizontal margin around words
const WORD_COLOR = "red";	// Text color


class WordCloud {
	/*
	 * Options:
	 * 		element = div this belongs to
	 *		data = array of {word, count}		
	 */
	constructor(opts) {
		this.element = opts.element;
		this.data = opts.data;
		this.width = opts.element.offsetWidth;
		this.height = this.width * 2 / 3;
		this.draw();
	}

	/*
	 * Randomly renders text on screen, animating its appearance
	 */
	draw() {
		const svg = d3.select(this.element)
					  .append("svg")
					  .attr("width", this.width)
					  .attr("height", this.height)

		var locList = [];
		var loc = null;

		// Iterate through word list and render from largest to smallest
		for (var i = 0; i < this.data.length; i++) {
			// if (i == 3) break;
 			var x, y, size;
			// 1 biggest word
			if (i == 0) {
				x = this.width / 2;
				y = this.height / 2;
				size = this.width / 7;
			} 
			else if (i >= 1 && i <= 3) {
				size = this.width / 13;
			}
			else if (i >= 4 && i <= 9) {
				size = this.width / 17;
			} 
			else if (i >= 10 && i <= 16) {
				size = this.width / 21;
			}
			else if (i >= 17 && i <= 24) {
				size = this.width / 26;
			}
			else if (i >= 24 && i <= 31) {
				size = this.width / 36;
			}
			else if (i >= 31 && i <= 50) {
				size = this.width / 43;
			}
			else {
				size = this.width / 50;
			}

			var text_width, text_height;
			var textDraft = null;
			var locListCopy = locList.slice(0);			// To keep track of what locations have been tested for word fit

			// Check whether current word fits in its bounding rectangle
			while (!wordFits(svg, textDraft, loc, this.width, this.height) && locListCopy.length > 1) {
				var index = locListCopy.indexOf(loc);
				locListCopy.splice(index, 1);
				// Get random location from possible bounding rectangle list
				loc = locListCopy[getRandomInt(0, locListCopy.length - 1)];
				var wordData = drawWord(svg, this.width, this.height, this.data[i].word, loc, size);
				textDraft = wordData[0];
				x = wordData[1];
				y = wordData[2];

				var bounds = textDraft.node().getBoundingClientRect();
				text_width = bounds.right - bounds.left;
				text_height = bounds.bottom - bounds.top;
			}
			if (locListCopy.length == 0 && i != 0) break;

			// Render first word largest and in center of element
			if (i == 0) {
				textDraft = svg.append("text")
							   .attr("id", "textDraft")
							   .attr("x", x)
							   .attr("y", y)
							   .text(this.data[i].word)
							   .attr("font-family", "sans-serif")
				    		   .attr("font-size", size + "px")
							   .attr("fill", WORD_COLOR)

				var bounds = textDraft.node().getBoundingClientRect();
				text_width = bounds.right - bounds.left;
				text_height = bounds.bottom - bounds.top;
				text_height *= (5/6);

				locList.push.apply(locList, addPrelimRectsToList(locList, x - text_width / 2, y + text_height / 2, text_width, text_height));

				// Redraw inital word in correct place
				svg.selectAll("#textDraft").remove();
				var text = svg.append("text")
							  .attr("id", "wordInCloud")
							  .attr("x", x - text_width / 2)
							  .attr("y", y + text_height / 2 - text_height * (1/7))
							  .text(this.data[i].word)
							  .attr("font-family", "sans-serif")
				    		  .attr("font-size", 0)
							  .attr("fill", WORD_COLOR)
							  .style("opacity", 0)
				
				text.transition()
					.attr("font-size", size + "px")
					.style("opacity", 1.0)
					.duration(1000)
					.ease(d3.easeCubic)
			}

			// Other words have different bounding rectangle subdivision algo
			else {

				svg.selectAll("#textDraft").remove();
				var text = svg.append("text")
							  .attr("id", "wordInCloud")
							  .attr("x", x)
							  .attr("y", y)
							  .text(this.data[i].word)
							  .attr("font-family", "sans-serif")
				    		  .attr("font-size", 0)
							  .attr("fill", WORD_COLOR)
							  .style("opacity", 0)

				text.transition()
					.attr("font-size", size + "px")
					.style("opacity", 1.0)
					.duration(1000)
					.ease(d3.easeCubic)

				// Remove location from list of possible locations
				if (loc != null) {
					var index = locList.indexOf(loc);
					locList.splice(index, 1);
				}

				// Subdivide rectangle that this word was placed in, add to list of possible locations
				locList.push.apply(locList, subdivideLoc(locList, loc, this.width, this.height, text_width, text_height));
			}
		}
	}
}



/* Returns random int between min, max inclusive */
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

/* Checks whether the given text element will fit within the given bounding rectangle */
function wordFits(svg, textDraft, loc, elemWidth, elemHeight) {
	if (textDraft == null) return false;

	var bounds = textDraft.node().getBoundingClientRect();
	var w = bounds.right - bounds.left;
	var h = bounds.bottom - bounds.top;

	// Doesn't fit inside bounding rectangle
	if (loc.width < w || loc.height < h) {
		svg.selectAll("#textDraft").remove();
		return false;
	}

	// Text off screen horizontally
	if (bounds.left < 10 || bounds.right >= elemWidth - 20) {
		svg.selectAll("#textDraft").remove();
		return false;
	}

	// Text off screen vertically
	if (bounds.top < 0 || bounds.bottom >= elemHeight - 10) {
		svg.selectAll("#textDraft").remove();
		return false;
	}

	return true;
}

/* Add 8 bounding rectangles to initial bounding rectangle list */
function addPrelimRectsToList(locList, text_x, text_y, text_width, text_height) {
	var newRects = [];

	// Upper left rect
	newRects.push({x: 0, y: 0, width: text_x, height: text_y - text_height});

	// Upper mid rect
	newRects.push({x: text_x, y: 0, width: text_width, height: text_y - text_height});

	// Upper right rect
	newRects.push({x: text_x + text_width, y: 0, width: text_x, height: text_y - text_height});

	// Mid left rect
	newRects.push({x: 0, y: text_y - text_height, width: text_x, height: text_height});

	// Mid right rect
	newRects.push({x: text_x + text_width, y: text_y - text_height, width: text_x, height: text_height});

	// Bottom left rect
	newRects.push({x: 0, y: text_y, width: text_x, height: text_y - text_height});

	// Bottom mid rect
	newRects.push({x: text_x, y: text_y, width: text_width, height: text_y - text_height});

	// Bottom right rect
	newRects.push({x: text_x + text_width, y: text_y, width: text_x, height: text_y - text_height});

	return newRects;
}

/* 
 * Subdivides the bounding rectangle that the current word is being drawn in
 * Returns a list of the subdivisions to be added to the list of possible locations
 */
function subdivideLoc(locList, loc, elemWidth, elemHeight, text_width, text_height) {
	var newRects = [];

	if (loc.x >= elemWidth / 2) {
		// Text hugging top-left of bounding rect
		if (loc.y >= elemHeight / 2) {
			// top-right rect
			newRects.push({x: loc.x + text_width + RECT_MARGIN, y: loc.y, width: loc.width - text_width - RECT_MARGIN, height: text_height, color: "lawngreen"});
			// bottom-left rect
			newRects.push({x: loc.x, y: loc.y + text_height, width: text_width + RECT_MARGIN, height: loc.height - text_height, color: "magenta"});
			// bottom-right rect
			newRects.push({x: loc.x + text_width + RECT_MARGIN, y: loc.y + text_height, width: loc.width - text_width - RECT_MARGIN, height: loc.height - text_height, color: "teal"});
		}
		// Text hugging bottom-left of bounding rect
		else {
			// top-left rect
			newRects.push({x: loc.x, y: loc.y, width: text_width + RECT_MARGIN, height: loc.height - text_height, color: "lawngreen"});
			// top-right rect
			newRects.push({x: loc.x + text_width + RECT_MARGIN, y: loc.y, width: loc.width - text_width - RECT_MARGIN, height: loc.height - text_height, color: "magenta"});
			// bottom-right rect
			newRects.push({x: loc.x + text_width + RECT_MARGIN, y: loc.y + loc.height - text_height, width: loc.width - text_width - RECT_MARGIN, height: text_height, color: "teal"});	
		}
	} 
	else {
		// Text hugging top-right of bounding rect
		if (loc.y >= elemHeight / 2) {
			// top-left rect
			newRects.push({x: loc.x, y: loc.y, width: loc.width - text_width - RECT_MARGIN, height: text_height, color: "lawngreen"});
			// bottom-left rect
			newRects.push({x: loc.x, y: loc.y + text_height, width: loc.width - text_width - RECT_MARGIN, height: loc.height - text_height, color: "magenta"});
			// bottom-right rect
			newRects.push({x: loc.x + loc.width - text_width - RECT_MARGIN, y: loc.y + text_height, width: text_width + RECT_MARGIN, height: loc.height - text_height, color: "teal"});
		}
		// Text hugging bottom-right of bounding rect
		else {
			// top-left rect
			newRects.push({x: loc.x, y: loc.y, width: loc.width - text_width - RECT_MARGIN, height: loc.height - text_height, color: "lawngreen"});
			// top-right rect
			newRects.push({x: loc.x + loc.width - text_width - RECT_MARGIN, y: loc.y, width: text_width + RECT_MARGIN, height: loc.height - text_height, color: "magenta"});
			// bottom-left rect
			newRects.push({x: loc.x, y: loc.y + loc.height - text_height, width: loc.width - text_width - RECT_MARGIN, height: text_height, color: "teal"});
		}
	}	
	newRects.forEach(function(d) {
		if (d.x < 0 || d.y < 0 || d.x + d.width > elemWidth || d.y + d.height > elemHeight || d.width <= 0 || d.height <= 0) {
			newRects.splice(newRects.indexOf(d), 1);
		}
	});

	return newRects;
}


/* 
 * Draws word in given bounding rect defined by loc
 * Returns the text element, and coordinates of the element
 */
function drawWord(svg, elemWidth, elemHeight, word, loc, size) {

	var x = loc.x;
	var y = loc.y;

	// Draw draft of word to get height
	var textDraft = svg.append("text")
					   .attr("id", "textDraft")
					   .attr("x", x)
					   .attr("y", y)
					   .text(word)
					   .attr("font-family", "sans-serif")
		    		   .attr("font-size", size + "px")
					   .attr("fill", WORD_COLOR)

	var bounds = textDraft.node().getBoundingClientRect();
	var w = bounds.right - bounds.left;
	var h = bounds.bottom - bounds.top;
	svg.selectAll("#textDraft").remove();

	// Right side of page, draw hugging left side of bounding rect
	if (loc.x >= elemWidth / 2) {
		x += getRandomInt(0, RECT_MARGIN);
	} 
	// Left side of page, draw hugging right side of bounding rect
	else {
		// x = loc.x + loc.width - w - RECT_MARGIN;
		x = loc.x + loc.width - w - getRandomInt(0, RECT_MARGIN);
	}
	// Bottom of page, draw hugging top of bounding rect
	if (loc.y >= elemHeight / 2) {
		// y += (3/4 * h);
		y += getRandomInt((3/4 * h), h);
	}
	// Top of page, draw hugging bottom of bounding rect
	else {
		// y = loc.y + loc.height - (1/4 * h);
		y = loc.y + loc.height - getRandomInt((1/4 * h), (1/2 * h));
	}

	// Draw 	
	var textDraft = svg.append("text")
					   .attr("id", "textDraft")
					   .attr("x", x)
					   .attr("y", y)
					   .text(word)
					   .attr("font-family", "sans-serif")
		    		   .attr("font-size", size + "px")
					   .attr("fill", WORD_COLOR)

	return [textDraft, x, y];
}
















