/*
 * Word.js
 *
 * Word class
 * 
 */


/* corpus data */
const NUM_GENERAL_WORDS 	   = 10000;
const NUM_COUNTRY_WORDS 	   = 10000;
const NUM_GEN_FEMALE_WORDS 	   = 5000;
const NUM_GEN_MALE_WORDS 	   = 5000;
const NUM_COUNTRY_FEMALE_WORDS = 5000;
const NUM_COUNTRY_MALE_WORDS   = 5000;

class Word {

	constructor(opts) {
		this.word  = opts[0];
		this.x     = opts[1];
		this.y 	   = opts[2];
		this.xOdds = opts[3];
		this.yOdds = opts[4];
	}

	getWord() { return this.word; }

	getX() { return this.x; }

	getY() { return this.y; }

	getXOdds() { return this.xOdds; }

	getYOdds() { return this.yOdds; }


	/* Static info about corpuses */

	static getTotalGeneral() { return NUM_GENERAL_WORDS; }

	static getTotalCountry() { return NUM_COUNTRY_WORDS; }

	static getTotalGenFemale() { return NUM_GEN_FEMALE_WORDS; }

	static getTotalGenMale() { return NUM_GEN_MALE_WORDS; }

	static getTotalCountryFemale() { return NUM_COUNTRY_FEMALE_WORDS; }

	static getTotalCountryMale() { return NUM_COUNTRY_MALE_WORDS; }
}