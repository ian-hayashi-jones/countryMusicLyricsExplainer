

class LinePlot {


	constructor(opts) {
		self.svg	 = opts.svg;		// background
		this.width   = opts.width - MARGIN_RIGHT - MARGIN_LEFT;			// graph width
		this.height  = opts.height - MARGIN_BOT - MARGIN_TOP;			// graph height
		this.width   = Math.min(this.width, this.height);
		this.height  = this.width;
		self.width   = opts.width;
		self.height  = opts.height;
		this.draw();
	}

	draw() {
		console.log("drawing line plot");


	}
}