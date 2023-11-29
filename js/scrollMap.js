// init controller
var controller = new ScrollMagic.Controller();

// build scene
var scene = new ScrollMagic.Scene({triggerElement: "#trigger", duration: 200})
                .addTo(controller)
                .addIndicators() // add indicators (requires plugin)
                .on("update", function (e) {
                    $("#scrollDirection").text(e.target.controller().info("scrollDirection"));
                })
                .on("enter leave", function (e) {
                    $("#state").text(e.type == "enter" ? "inside" : "outside");
                })
                .on("start end", function (e) {
                    $("#lastHit").text(e.type == "start" ? "top" : "bottom");
                })
                .on("progress", function (e) {
                    $("#progress").text(e.progress.toFixed(3));
                });
