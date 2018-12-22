/*
 * projectsNavigation.js
 ************************
 * Handles the navigation between project pages.
 * 
 * Usage:
 * Add another project to the navigation by adding its directory link to 
 * the 'projectLinks' array in the correct order of appearance.
 */


var currSelection = "podmate-button";
const projectLinks = [
    "podmate.html", 
    "avalaunch.html", 
    "https://ianjones763.github.io/countryMusicLyricsExplainer/", 
    "quest.html"
];

const highlightColors = {
    "podmate-button" : "#69CB43",
    "avalaunch-button" : "#1F2B53",
    "country-button" : "black",
    "quest-button" : "white"
};


/* 
 * Switch to the clicked project page 
 */
function on_projectlink_clicked(id, index) {
    console.log("clicked project = " + id);
    currSelection = id;

    // navigate to new page
    window.location = projectLinks[index];
}

/* 
 * Highlight button when hovering 
 */
function on_mouseover_highlight(selection) {
    var currElement = document.getElementById(currSelection);

    // Only dehighlight if not current page
    if (currElement != selection) {
        currElement.style.setProperty('--highlight-color', highlightColors[currSelection]);
        currElement.style.animationName = "dehighlight"; 
    } 

    // Highlight selection
    selection.style.setProperty('--highlight-color', highlightColors[currSelection]);
    selection.style.animationName = "highlight"; 
}


/* 
 * De highlight the selection unless its the current page 
 */
function on_mouseout_dehighlight(selection) {
    var currElement = document.getElementById(currSelection); 

    // Not current page
    if (currElement != selection) {
        selection.style.setProperty('--highlight-color', highlightColors[currSelection]);
        selection.style.animationName = "dehighlight";
    }

    // Keep current page highlighted
    currElement.style.setProperty('--highlight-color', highlightColors[currSelection]);
    currElement.style.animationName = "highlight";
}


/* 
 * Adds the footer to the specific project page, highlighting the current project 
 */
function addFooter(buttonToHighlight, color) {
    // Callback
    function highlight() {
        document.getElementById(buttonToHighlight).style.color = color; 
        document.getElementById(buttonToHighlight).style.borderBottomColor = color; 
        currSelection = buttonToHighlight;
    }
    includeHTML(highlight)
}


/* 
 * Include html snippet, with optional callback function 
 */
var includeHTML = function(callback) {
    var z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
            if (this.status == 200) {elmnt.innerHTML = this.responseText;}
            if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
            elmnt.removeAttribute("w3-include-html");
            includeHTML(callback);
            }
        }      
        xhttp.open("GET", file, true);
        xhttp.send();
        return;
        }
    }
    if (callback) callback();
};
