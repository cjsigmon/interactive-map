var controller = new ScrollMagic.Controller();
var direction;

$(function () { // wait for document ready
    var controller = new ScrollMagic.Controller({
        globalSceneOptions: {
            triggerHook: 'onLeave',
            duration: "20%"
        }
    });
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
                if (e.type != "start") {
                    nextPlace(direction);
                }
            });
    }
});
 
