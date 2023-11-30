// init controller
var controller = new ScrollMagic.Controller();
var direction;

// build scene
var scene = new ScrollMagic.Scene({triggerElement: "#trigger", duration: 400})
                .addTo(controller)
                .addIndicators() // add indicators (requires plugin)
                .on("update", function (e) {
                    direction = (e.target.controller().info("scrollDirection"));
                    $("#scrollDirection").text(e.target.controller().info("scrollDirection"));
                })
                .on("enter leave", function (e) {
                    $("#state").text(e.type == "enter" ? "inside" : "outside");
                })
                .on("start end", function (e) {
                    console.log(direction);
                    $("#lastHit").text(e.type == "start" ? "top" : "bottom");
                    if (e.type != "start" && direction == "FORWARD") {
                        nextPlace();
                    }
                })
                .on("progress", function (e) {
                    $("#progress").text(e.progress.toFixed(3));
                });
