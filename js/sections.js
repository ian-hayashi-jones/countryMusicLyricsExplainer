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
              new Word(['turtle', .12247131, .3516464]),
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
      csv: 'data/country_hot.csv',
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
              new Word(['turtle', .12247131, .3516464]),
              new Word(['nights', 4.36510576, 1.54109188]),
              new Word(['shell', 1.621325, .74821127]),
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
    activateFunctions[0] = showCountryLinePlot;
    activateFunctions[1] = showCountryYAxis;
    activateFunctions[2] = showCountryTriangles;
    activateFunctions[3] = showCountryScatterPlot;
    activateFunctions[4] = showLeastCountry;
    activateFunctions[5] = showMostCountry;
    activateFunctions[6] = showGenderLinePlot;
    activateFunctions[7] = showGenderYAxis;
    activateFunctions[8] = showGenderScatterPlot;
    activateFunctions[9] = showGenderWordList;
    activateFunctions[10] = showGenderWordList;

    // updateFunctions are called while
    // in a particular section to update
    // the scroll progress in that section.
    // Most sections do not need to be updated
    // for all scrolling and so are set to
    // no-op functions.
    for (var i = 0; i < 9; i++) {
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
   * showLinePlot
   *
   * index: 0
   */
  function showCountryLinePlot() {
    countryLinePlot.show();
  }

  /**
   * stepOneLinePlot
   *
   * index: 1
   */
  function showCountryYAxis() {
    countryLinePlot.stopAnimation(-1);
    countryScatterPlot.hide();
    countryLinePlot.showYAxis();
  }

  /**
   * showScatterPlot - graph of ___
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
   * showScatterPlot - graph of ___
   *
   * index: 3/4
   */
  function showCountryScatterPlot() {
    countryLinePlot.stopAnimation(1);
    countryScatterPlot.showTriangles();
    countryScatterPlot.hideTriangles();
    countryScatterPlot.showSearch();
    countryScatterPlot.show(1);
  }

  function showLeastCountry() {
    // countryLinePlot.stopAnimation(1);
    countryScatterPlot.showTriangles();
    countryScatterPlot.hideTriangles();
    countryScatterPlot.showSearch();
    countryScatterPlot.show(1);
    countryScatterPlot.highlightYWords();
  }

  function showMostCountry() {
    // countryLinePlot.stopAnimation(1);
    countryScatterPlot.showTriangles();
    countryScatterPlot.hideTriangles();
    countryScatterPlot.showSearch();
    countryScatterPlot.show(1);
    countryScatterPlot.highlightXWords();
  }

  /**
   * showLinePlot
   *
   * index: 5
   */
  function showGenderLinePlot() {
    genderScatterPlot.hide();
    // genderLinePlot.show();
  }

  /**
   * stepOneLinePlot
   *
   * index: 6
   */
  function showGenderYAxis() {
    // genderScatterPlot.hide();
    // genderLinePlot.showYAxis();
  }

  /**
   * showScatterPlot - graph of ___
   *
   * index: 7
   */
  function showGenderScatterPlot() {
    // genderLinePlot.updateToScatterPlot();
    // genderScatterPlot.showTriangles();
    // genderScatterPlot.show(.1);
    // genderScatterPlot.hideSearch();
  }

  /**
   * showScatterPlot - graph of ___
   *
   * index: 8/9
   */
  function showGenderWordList() {
    // genderScatterPlot.hideTriangles();
    // genderScatterPlot.showSearch();
    // genderScatterPlot.show(1);
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
