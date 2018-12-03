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


	/* 
	 * opts = [ word,
	 			country word count, 
	            general word count, 
	            female general word count,
	            male general word count,
	            female country word count,
	            male country word count ]
	 */
	constructor(opts) {
		this.word 			   = opts[0];
		this.countryFreq       = opts[1] / NUM_COUNTRY_WORDS;
		this.generalFreq 	   = opts[2] / NUM_GENERAL_WORDS;
		this.femaleCountryFreq = opts[3] / NUM_COUNTRY_FEMALE_WORDS;
		this.femaleGeneralFreq = opts[4] / NUM_GEN_FEMALE_WORDS;
		this.maleCountryFreq   = opts[5] / NUM_COUNTRY_MALE_WORDS;	
		this.maleGeneralFreq   = opts[6] / NUM_GEN_MALE_WORDS;	
	}

	print() { console.log("printing word " + this.word); }

	getWord() { return this.word; }

	getGeneralFreq() { return this.generalFreq; }

	getCountryFreq() { return this.countryFreq; }

	getFemaleGeneralFreq() { return this.femaleGeneralFreq; }

	getFemalCountryFreq() { return this.femaleCountryFreq; }

	getMaleGeneralFreq() { return this.maleGeneralFreq; }

	getMaleCountryFreq() { return this.maleCountryFreq; }

	getCountryOdds() { return this.countryFreq / this.generalFreq; }

	// getColor() { 
	// 	if (this.countryFreq > this.generalFreq) return "#CE4040";
	// 	if (this.countryFreq < this.generalFreq) return "#4079CE";
	// 	return "#C040CE";
	// }



	/* Static info about corpuses */

	static getTotalGeneral() { return NUM_GENERAL_WORDS; }

	static getTotalCountry() { return NUM_COUNTRY_WORDS; }

	static getTotalGenFemale() { return NUM_GEN_FEMALE_WORDS; }

	static getTotalGenMale() { return NUM_GEN_MALE_WORDS; }

	static getTotalCountryFemale() { return NUM_COUNTRY_FEMALE_WORDS; }

	static getTotalCountryMale() { return NUM_COUNTRY_MALE_WORDS; }
}