// init controller
var controller = new ScrollMagic.Controller();
var direction;

$(function () { // wait for document ready
    // init
    var controller = new ScrollMagic.Controller({
        globalSceneOptions: {
            triggerHook: 'onLeave',
            duration: "20%" // this works just fine with duration 0 as well
            // However with large numbers (>20) of pinned sections display errors can occur so every section should be unpinned once it's covered by the next section.
            // Normally 100% would work for this, but here 200% is used, as Panel 3 is shown for more than 100% of scrollheight due to the pause.
        }
    });

    // get all slides
    var slides = document.querySelectorAll("section.panel");

    // create scene for every slide
    for (var i=0; i<slides.length; i++) {
        new ScrollMagic.Scene({
                triggerElement: slides[i]
            })
            .setPin(slides[i], {pushFollowers: false})
            .addTo(controller)
            .addIndicators() 
            .on("update", function (e) {
                direction = (e.target.controller().info("scrollDirection"));
            })
            .on("start end", function (e) {
                console.log(direction);
                if (e.type != "start" && direction == "FORWARD") {
                    nextPlace();
                }
            });

    }
});

// for (let i = 0; i < worldWonders.length; i++) {
//     var triggerId = "#trigger"+i;
//     var scene = new ScrollMagic.Scene({triggerElement: triggerId, duration: 400})
//     .addTo(controller)
//     .addIndicators() // add indicators (requires plugin)
//     .on("update", function (e) {
//         direction = (e.target.controller().info("scrollDirection"));
//     })
//     .on("start end", function (e) {
//         console.log(direction);
//         if (e.type != "start" && direction == "FORWARD") {
//             nextPlace();
//         }
//     })
// }
 
