// import ScatterPlot from './ScatterPlot.js'



const TRANSITION_DURATION = 600;
var scatterPlot;

/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
var scrollVis = function () {
  // constants to define the size
  // and margins of the vis area.
  var width = 700;
  var height = 500;
  var margin = { top: 0, left: 20, bottom: 40, right: 10 };

  // Keep track of which visualization
  // we are on and which was the last
  // index activated. When user scrolls
  // quickly, we want to call all the
  // activate functions that they pass.
  var lastIndex = -1;
  var activeIndex = 0;

  // main svg used for visualization
  var svg = null;

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
    selection.each(function (rawData) {
      // create svg and give it a width and height
      svg = d3.select(this).append('svg')
                           .attr('width', width + margin.left + margin.right)
                           .attr('height', height + margin.top + margin.bottom)
      setupVis();
      setupSections();
    });
  };


  /**
   * setupVis - creates initial elements for all
   * sections of the visualization.
   */
  var setupVis = function () {

    // Title
    svg.append('text')
       .attr('class', 'title vis-title')
       .attr('x', width / 2)
       .attr('y', height / 3)
       .text('Country Music');

    // Subtitle
    svg.append('text')
       .attr('class', 'sub-title vis-title')
       .attr('x', width / 2)
       .attr('y', (height / 3) + (height / 5))
       .text('Blue Jeans, Trucks, and Beer');

    svg.selectAll('.vis-title')
       .attr('opacity', 0);

    // Scatterplot
    scatterPlot = new ScatterPlot({
      svg: svg,
      width: width,
      height: height,
      // element: document.querySelector('#vis'),
      data: 'data/words.csv',
      x: "countryCount",
      y: "generalCount",
      data: [
              new Word(['howdy', 500, 100, 200, 75, 300, 25]),
              new Word(['yo', 100, 500, 50, 100, 50, 400]),
              new Word(['what', 200, 200, 100, 100, 100, 100]),
              new Word(['wow', 3000, 2500, 200, 75, 300, 25]),
              new Word(['advantage', 2000, 5000, 50, 100, 50, 400]),
              new Word(['nascar', 7000, 1000, 100, 100, 100, 100]),
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
    activateFunctions[0] = showTitle;
    activateFunctions[1] = showScatterPlot;
    activateFunctions[2] = showTitle;
    activateFunctions[3] = showTitle;
    activateFunctions[4] = showTitle;
    activateFunctions[5] = showTitle;
    activateFunctions[6] = showTitle;
    activateFunctions[7] = showTitle;
    activateFunctions[8] = showTitle;

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
   * showTitle - initial title
   *
   * section index: 0
   * hides: count title
   * (no previous step to hide)
   * shows: intro title
   */
  function showTitle() {
    svg.selectAll('.vis-title')
     .transition()
     .duration(TRANSITION_DURATION)
     .attr('opacity', 1.0)

    scatterPlot.hide();
  }

  /**
   * showSubtitle - 
   * 
   * section index: 1
   * hides: title and next
   * shows: subtitle
   */
  function showSubtitle() {
    svg.selectAll('.vis-title')
       .transition()
       .duration(TRANSITION_DURATION)
       .attr('opacity', 0);
    
    svg.selectAll('.vis-subtitle')
     .transition()
     .duration(TRANSITION_DURATION)
     .attr('opacity', 1.0)
  }


  /**
   * showScatterPlot - graph of ___
   *
   * index: ___
   * hides: previous and next
   * shows: scatterplot
   */
  function showScatterPlot() {
    svg.selectAll('.vis-title')
       .transition()
       .duration(TRANSITION_DURATION)
       .attr('opacity', 0)

    scatterPlot.show();
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
function display() {
  // create visualization
  var vis = scrollVis();
  d3.select('#vis')
    .call(vis);

  // setup scroll functionality
  var scroll = scroller()
    .container(d3.select('#graphic'));

  // pass in .step selection as the steps
  scroll(d3.selectAll('.step'));

  // setup event handling
  scroll.on('active', function (index) {
    // highlight current step text
    d3.selectAll('.step')
      .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });

    // activate current section
    vis.activate(index);
  });

  scroll.on('progress', function (index, progress) {
    vis.update(index, progress);
  });
}

// display -- load data here when ready
display();
