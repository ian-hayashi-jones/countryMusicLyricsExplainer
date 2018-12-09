const TRANSITION_DURATION = 600;

var countryScatterPlot;
var countryLinePlot;
var genderScatterPlot;
var genderScatterPlot;

/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
var scrollVis = function () {
  // constants to define the size
  // and margins of the vis area.
  var width = 800;
  var height = 500;
  var margin = { top: 20, left: 100, bottom: 40, right: 20 };

  // Keep track of which visualization
  // we are on and which was the last
  // index activated. When user scrolls
  // quickly, we want to call all the
  // activate functions that they pass.
  var lastIndex = -1;
  var activeIndex = 0;

  // main svg used for visualization
  var svg1 = null;
  var svg2 = null;

  // d3 selection that will be used
  // for displaying visualizations
  // var g = null;

  // When scrolling to a new section
  // the activation function for that
  // section is called.
  var activateFunctions = [];
  // If a section has an update function
  // then it is called while scrolling
  // through the section with the current
  // progress through the section.
  var updateFunctions = [];

  /**
   * vis
   *
   * @param selection - the current d3 selection(s)
   *  to draw the visualization in. For this
   *  example, we will be drawing it in #vis
   */
  var vis = function (selection) {
    // For country vis
    svg1 = d3.select(selection._groups[0][0]).append('svg')
                           .attr('width', width + margin.left + margin.right)
                           .attr('height', height + margin.top + margin.bottom)
                           .attr("id", "svg1")
    // For gender vis
    svg2 = d3.select(selection._groups[0][1]).append('svg')
                           .attr('width', width + margin.left + margin.right)
                           .attr('height', height + margin.top + margin.bottom)
                           .attr("id", "svg2")

      setupVis();
      setupSections();
  };


  /**
   * setupVis - creates initial elements for all
   * sections of the visualization.
   */
  var setupVis = function () {
        // Country scatterplot
    countryScatterPlot = new ScatterPlot({
      svg: svg1,
      width: width,
      height: height,
      margin: margin,
      csv: 'data/country_hot.csv',
      type: "country"
    });
    countryScatterPlot.hideFast();

    // Country line plot
    countryLinePlot = new LinePlot({
      svg: svg1,
      width: width,
      height: height,
      margin: margin,
      type: "country",
      data: [
              new Word(['struggle', .083145, .268016]),
              new Word(['nights', 4.36510576, 1.54109188]),
              new Word(['trailer', .71, .06]),
              new Word(['baby', 48.7, 36.5]),
            ]
    });

    // Gender scatterplot
    genderScatterPlot = new ScatterPlot({
      svg: svg2,
      width: width,
      height: height,
      margin: margin,
      csv: 'data/gender.csv',
      type: "gender",
    });
    genderScatterPlot.hideFast();


    // Gender line plot
    genderLinePlot = new LinePlot({
      svg: svg2,
      width: width,
      height: height,
      margin: margin,
      type: "gender",
      data: [
              new Word(['beer', 5.9449, .055837, .60105, 7.1048]),
              new Word(['blessed', .20786, .848717, .901578, .102228]),
              new Word(['gravel', .78988, .033502, 1.50263, .715593]),
            ]
    });
  };
   

  /**
   * setupSections - each section is activated
   * by a separate function. Here we associate
   * these functions to the sections based on
   * the section's index.
   *
   */
  var setupSections = function () {
    // activateFunctions are called each
    // time the active section changes
    activateFunctions[0] = showSection;
    activateFunctions[1] = showCountryLinePlot;
    activateFunctions[2] = showCountryYAxis;
    activateFunctions[3] = showCountryTriangles;
    activateFunctions[4] = showCountryScatterPlot;
    activateFunctions[5] = showLeastCountry;
    activateFunctions[6] = showMostCountry;
    activateFunctions[7] = showSection;
    activateFunctions[8] = showGenderLinePlot;
    activateFunctions[9] = showGenderYAxis;
    activateFunctions[10] = showGenderTriangles;
    activateFunctions[11] = showGenderScatterPlot;
    activateFunctions[12] = showMaleWordList;
    activateFunctions[13] = showFemaleWordList;
    activateFunctions[14] = showSection;
    activateFunctions[15] = showSection;

    // updateFunctions are called while
    // in a particular section to update
    // the scroll progress in that section.
    // Most sections do not need to be updated
    // for all scrolling and so are set to
    // no-op functions.
    for (var i = 0; i < 16; i++) {
      updateFunctions[i] = function () {};
    }
  };

  /**
   * ACTIVATE FUNCTIONS
   *
   * These will be called their
   * section is scrolled to.
   *
   * General pattern is to ensure
   * all content for the current section
   * is transitioned in, while hiding
   * the content for the previous section
   * as well as the next section (as the
   * user may be scrolling up or down).
   *
   */

  /**
   * No-op
   * No visual to update
   */
  function showSection() {
    //
  }

  /**
   * Shows the country line plot
   *
   * index: 0
   */
  function showCountryLinePlot() {
    countryLinePlot.show();
  }

  /**
   * Shows the country y axis
   *
   * index: 1
   */
  function showCountryYAxis() {
    countryLinePlot.stopAnimation(-1);
    countryScatterPlot.hide();
    countryLinePlot.showYAxis();
  }

  /**
   * Shows the country scatterplot with triangles
   *
   * index: 2
   */
  function showCountryTriangles() {
    countryLinePlot.updateToScatterPlot();
    countryScatterPlot.showTriangles();
    countryScatterPlot.show(.1);
    countryScatterPlot.hideSearch();
  }

  /**
   * Hides the triangles
   *
   * index: 3
   */
  function showCountryScatterPlot() {
    countryLinePlot.stopAnimation(1);
    countryScatterPlot.showTriangles();
    countryScatterPlot.hideTriangles();
    countryScatterPlot.showSearch();
    countryScatterPlot.show(1);
  }


  /**
   * Shows the least country word list triangle
   *
   * index: 4
   */
  function showLeastCountry() {
    // countryLinePlot.stopAnimation(1);
    countryScatterPlot.showTriangles();
    countryScatterPlot.hideTriangles();
    countryScatterPlot.showSearch();
    countryScatterPlot.show(1);
    countryScatterPlot.highlightYWords();
  }


  /**
   * Shows the most country word list triangle
   *
   * index: 5
   */
  function showMostCountry() {
    // countryLinePlot.stopAnimation(1);
    countryScatterPlot.showTriangles();
    countryScatterPlot.hideTriangles();
    countryScatterPlot.showSearch();
    countryScatterPlot.show(1);
    countryScatterPlot.highlightXWords();
  }

  /**
   * Shows the gender line plot
   *
   * index: 6
   */
  function showGenderLinePlot() {
    genderLinePlot.show();
  }

  /**
   * Shows the gender y axis
   *
   * index: 7
   */
  function showGenderYAxis() {
    genderLinePlot.stopAnimation(-1);
    genderScatterPlot.hide();
    genderLinePlot.showYAxis();
  }

  /**
   * Shows the gender scatterplot with triangles
   *
   * index: 8
   */
  function showGenderTriangles() {
    genderLinePlot.updateToScatterPlot();
    genderScatterPlot.showTriangles();
    genderScatterPlot.show(.1);
    genderScatterPlot.hideSearch();
  }

  /**
   * Hides the triangles
   *
   * index: 9
   */
  function showGenderScatterPlot() {
    genderLinePlot.stopAnimation(1);
    genderScatterPlot.showTriangles();
    genderScatterPlot.hideTriangles();
    genderScatterPlot.showSearch();
    genderScatterPlot.show(1);
  }

  /**
   * Shows the male word list triangle
   *
   * index: 10
   */
  function showMaleWordList() {
    genderScatterPlot.showTriangles();
    genderScatterPlot.hideTriangles();
    genderScatterPlot.showSearch();
    genderScatterPlot.show(1);
    genderScatterPlot.highlightYWords();
  }

  /**
   * Shows the female word list triangle
   *
   * index: 11
   */
  function showFemaleWordList() {
    genderScatterPlot.showTriangles();
    genderScatterPlot.hideTriangles();
    genderScatterPlot.showSearch();
    genderScatterPlot.show(1);
    genderScatterPlot.highlightXWords();
  }



  /**
   * activate -
   *
   * @param index - index of the activated section
   */
  vis.activate = function (index) {
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };

  // /**
  //  * update
  //  *
  //  * @param index
  //  * @param progress
  //  */
  vis.update = function (index, progress) {
    updateFunctions[index](progress);
  };

  // return vis function
  return vis;
};


/**
 * display 
 * sets up the scroller and
 * displays the visualization.
 *
 */
function display(visID, stepID) {
  // create visualization
  var vis = scrollVis();
  d3.selectAll(visID)
    .call(vis);

  // setup scroll functionality
  var scroll = scroller()
    .container(d3.select('body'));

  // pass in .step selection as the steps
  scroll(d3.selectAll(stepID));

  // setup event handling
  scroll.on('active', function (index) {
    // highlight current step text
    d3.selectAll(stepID)
      .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });

    // activate current section
    vis.activate(index);
  });

  scroll.on('progress', function (index, progress) {
    vis.update(index, progress);
  });
}

// display -- load data here when ready
display('.vis', '.step');
