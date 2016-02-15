/* Load the proper responsive classes when document loads and resize events
 *
 */

// Responsive classes function
var deviceSizes = function(width, bodyEl) {

    if( width <= 480 ) {
        bodyEl.classList.add("mobile");
        bodyEl.classList.remove("tablet");
    } else if( width <= 960 && width > 480 ) {
        bodyEl.classList.add("tablet");
        bodyEl.classList.remove("mobile");
    } else if( width > 960 ) {
        bodyEl.classList.remove('mobile');
        bodyEl.classList.remove('tablet');
    }
};

// document load event
document.addEventListener("DOMContentLoaded", function(event) {
    var bodyEl = document.getElementsByTagName('body')[0];
    var width = event.path[0].body.clientWidth;

    deviceSizes(width, bodyEl);
});

// Resize event
window.addEventListener("resize", function(event) {
    var bodyEl = document.getElementsByTagName('body')[0];
    var width = event.path[0].innerWidth;

    deviceSizes(width, bodyEl);
});

