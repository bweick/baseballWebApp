(function(bbviz) {
    'use strict';
    var fieldHold = d3.select("#main");

    var boundingRect = fieldHold.node()
        .getBoundingClientRect();
    var width = boundingRect.width;
    var height = boundingRect.height;

    bbviz.initField = (function() {
        var svg = fieldHold.append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("id", "fieldChart")
            .append("g").attr("id", "field")
    });

    bbviz.fieldUpdate = (function(data) {
        var outfieldLoc = function(circs) {
            var angScale = d3.scale.linear()
                .range([Math.PI/6,(5*Math.PI)/6]);
            var ang = angScale(Math.random());
            var outX = circs.outR*Math.cos(ang) + circs.outCX;
            var outY = circs.outCY - circs.outR*Math.sin(ang);
            var inX = circs.inR*Math.cos(ang) + circs.inCX;
            var inY = circs.outCY - circs.inR*Math.sin(ang);

            var slope = (inY-outY)/(outX-inX);
            var lenScale = d3.scale.linear()
                .range([0,(outX-inX)]);
            var x = lenScale(Math.random());
            var y = -slope*x

            return {'x':(inX+x), 'y':(inY+y)};
        };

        var parseData = function(d) {
            if (d.type == 0 || d.type==1) {
                if (d.hit == 1) {
                    var pos = outfieldLoc({'outR':195, 'outCX':225, 'outCY':305, 'inR':160, 'inCX':225, 'inCY':305})
                    return {'x':pos.x, 'y':pos.y, 'stroke':'black', 'fill':'none', 'ease':'linear'};
                } else {
                    var pos = outfieldLoc({'outR':154, 'outCX':225, 'outCY':305, 'inR':65, 'inCX':225, 'inCY':345})
                    return {'x':pos.x, 'y':pos.y, 'stroke':'black', 'fill':'none', 'ease':'linear'};
              };
            } else if (d.type == 2 || d.type==3) {
                var pos = outfieldLoc({'outR':249, 'outCX':225, 'outCY':263, 'inR':187, 'inCX':225, 'inCY':305});
                return {'x':pos.x, 'y':pos.y, 'stroke':'black', 'fill':'none', 'ease':'linear'};
            } else if (d.type == 4) {
                var pos = outfieldLoc({'outR':260, 'outCX':225, 'outCY':263, 'inR':255, 'inCX':225, 'inCY':263})
                return {'x':pos.x, 'y':pos.y, 'stroke':'black', 'fill':'none', 'ease':'linear'};
            } else if (d.type == 5) {
                return {'x':10, 'y':355, 'stroke':'none', 'fill':'red', 'ease':'linear'};
            } else if (d.type == 6) {
                return {'x':313, 'y':273, 'stroke':'none', 'fill':'blue', 'ease':'linear'};
            } else if (d.type == 7) {
                return {'x':150, 'y':200, 'stroke':'black', 'fill':'none', 'ease':'linear'};
            };
        };

        var radiusCalc = function(selection, d) {
            d3.select(selection).transition()
                .duration(1000)
                .attrTween("r", function() {
                    return function(t) {
                        if (d.type == 3 || d.type == 4) {
                            return (-Math.pow(t-0.5, 2)/.125) + 5.5;
                        } else if (d.type == 1) {
                            return (-Math.pow(t-0.5, 2)/(.25/6)) + 8.5;
                        } else if (d.type == 0 || d.type == 7) {
                            return (Math.abs(2*Math.sin(Math.PI*5*t)) + 3.5)
                        } else {
                            return 3.5;
                        };
                    };
                });
        };

        var updateBoxes = function(d, i) {
            if (d.type == 4) {
                hr += 1;
                d3.select('#hr').transition()
                    .duration(100)
                    .style("background-color", "rgba(0,255,0,.2)")
                  .transition()
                    .duration(100)
                    .style("background-color", "rgba(0,255,0,0)");
            } else if (d.type == 5) {
                so += 1;
                d3.select('#so').transition()
                    .duration(100)
                    .style("background-color", "rgba(255,0,0,.2)")
                  .transition()
                    .duration(100)
                    .style("background-color", "rgba(255,0,0,0)");
            } else if (d.type == 6) {
                bb += 1;
                d3.select('#bb').transition()
                    .duration(100)
                    .style("background-color", "rgba(0,0,255,.2)")
                  .transition()
                    .duration(100)
                    .style("background-color", "rgba(0,0,255,0)");
            };
            d3.select('#hr')
                .html("HR: "+hr+"<br> HR%: "+((hr/i)*100).toFixed(1)+"%")
            d3.select('#bb')
                .html("BB: "+bb+"<br> BB%: "+((bb/i)*100).toFixed(1)+"%");
            d3.select('#so')
                .html("SO: "+so+"<br> SO%: "+((so/i)*100).toFixed(1)+"%");
            d3.select('#babip')
                .html("BABIP: "+data.babip[i]+"<br> xBABIP: "+data.xbabip[i]);
            d3.select('#pbpSum')
                .html("<strong>Summary Stats</strong> <br> PA: "+(i+1)+"<br> BA: "+data.ba[i]+
                "<br> OBP: "+data.obp[i]+"<br> BABIP: " + data.babip[i]);
        };

        var translateAlong = function(selection, d, i) {
            var pos = parseData(d);
            var object = d3.select(selection);

            object.transition()
                .ease(pos.ease)
                .style("fill", pos.fill)
                .style("stroke", pos.stroke)
                .duration(1200)
                .attrTween("transform", function() {
                    return d3.interpolateString("translate("+plate.x+", "+plate.y+")",
                    "translate("+pos.x+", "+pos.y+")");
                })
                .each(function(d) {
                    radiusCalc(this, d);
                })
                .each("end", function(d) {
                    if (d.type == 6 || d.hit == 1) {
                        var fill="rgba(0,255,0,.9)";
                    } else {
                        var fill="rgba(255,0,0,.9)";
                    };
                    /*if (d.type == 0 || d.type == 1) {
                        var opac = 1;
                    } else {
                        var opac = 0;
                    };*/

                    object.transition()
                        .style("fill", fill)
                        .style("stroke", "none")
                        .duration(1000)
                        .style("opacity", 0);
                    updateBoxes(d, i);
                } );
        };
        var child = document.getElementById("field");
        while (child.lastChild) {
            child.removeChild(child.lastChild);
        }
        $(".pbpBoxes").remove();
        $("#babip").remove();
        $("#pbpSum").remove();

        var plate = {'x':225, 'y':355};
        var pbpData = data.pbp;
        var bb = 0;
        var so = 0;
        var hr = 0;

        var cont = d3.select("#main")
        var hrBox = cont.append("div")
            .attr("class", "pbpBoxes")
            .attr("id", "hr")
            .html("HR: <br> HR%: ");

        var soBox = cont.append("div")
            .attr("class", "pbpBoxes")
            .attr("id", "so")
            .html("SO: <br> SO%: ");

        var bbBox = cont.append("div")
            .attr("class", "pbpBoxes")
            .attr("id", "bb")
            .html("BB: <br> BB%: ");

        var babipBox = cont.append("div")
            .attr("id", "babip")
            .html("BABIP: <br> xBABIP: ");

        var sumBox = cont.append("div")
            .attr("id", "pbpSum")
            .html("<strong>Summary Stats</strong> <br> PA: <br> BA: <br> OBP: <br> BABIP: ")

        var svg = d3.select("#main #field")

        /*svg.append("circle")
            .attr("cx", plate.x+42)
            .attr("cy", plate.y-36)
            .attr("r", 2)
            .style("stroke", "red")
            .style("fill", "none");

        svg.append("circle")
            .attr("cx", plate.x)
            .attr("cy", plate.y-10)
            .attr("r", 50)
            .style("stroke", "red")
            .style("fill", "none");*/


        var circles = svg.selectAll(".traj")
            .data(pbpData).enter()
        var time = document.getElementById("time").value
        circles.append("circle")
            .attr("class", "traj")
            .transition()
            .delay(function(d,i) {
                return i*time; })
            .each("end", function(d,i) {
                translateAlong(this, d, i);
            });
    });
}(window.bbviz=window.bbviz || {}));
