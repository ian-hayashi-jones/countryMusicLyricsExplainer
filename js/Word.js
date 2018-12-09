/*
 * Word.js
 *
 * Word class
 * 
 */
class Word {

	constructor(opts) {
		this.word  = opts[0];
		this.x     = opts[1];
		this.y 	   = opts[2];
		this.newX  = opts[3];
		this.newY  = opts[4];
	}

	getWord() { return this.word; }

	getX() { return this.x; }

	getY() { return this.y; }

	getXOdds() { return this.xOdds; }

	getYOdds() { return this.yOdds; }

	getNewX() { return this.newX; }

	getNewY() { return this.newY; }
}