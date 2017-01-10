(function(bbviz) {
    'use strict';
    var graphHold = d3.select('#statplot');

    var margin = {top:20, right:45, bottom:30, left:45};
    var boundingRect = graphHold.node()
        .getBoundingClientRect();
    var width = boundingRect.width - margin.left - margin.right;
    var height = boundingRect.height - margin.top - margin.bottom;
    var stat = $("input[name=stat]:checked").val()

    bbviz.initGraph = (function(callback) {
        var colors = bbviz.colorScheme();
        var svg = d3.select('#statplot').append("svg")
            .attr('width', width+margin.left+margin.right)
            .attr('height', height+margin.top+margin.bottom)
            .append("g").classed('chart', true).attr("id", "chart")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        d3.select('.chart')
            .append("g")
            .attr('id', 'xaxis')
            .attr('class', 'axis')
            .attr("transform", "translate(0, " +height+")");
        d3.select('.chart')
            .append("g")
            .attr('id', 'yaxis')
            .attr('class', 'axis');
        d3.select('.chart')
            .append("g")
            .attr('id', 'zaxis')
            .attr('class', 'axis')
            .attr("transform", "translate("+width+", 0)");

        var scalex = d3.scale.linear()
            .domain([150,600]).range([0,width]);
        var axisx = d3.svg.axis()
            .scale(scalex)
            .orient("bottom");
        var scaley = d3.scale.linear()
            .domain([.2,.5]).range([height,0]);
        var axisy = d3.svg.axis()
            .scale(scaley)
            .orient("left");
        var axisz = d3.svg.axis()
            .scale(scaley)
            .orient("right");

        d3.select('#xaxis').call(axisx);
        d3.select('#yaxis').call(axisy);
        d3.select('#zaxis').call(axisz)

        d3.select("#run").style("background", colors.secondary);
        d3.select("#run").style("border-color", colors.tertiary);
        d3.selectAll("th").style("background", colors.primary);
        d3.select("#chart-header").style("color", colors.primary);
        document.styleSheets[0].insertRule("input[type='radio']:checked:before { background:"+colors.primary+"}", 1);
        return callback(null);
    });

    bbviz.graphUpdate = (function(data) {
        $('.label').remove();
        $('.title').remove();
        var colors = bbviz.colorScheme();
        var stat = $("input[name=stat]:checked").val()
        if (stat == 0) {
            var min = data.sum.min_ba;
            var lab = "BA";
        }
        else if (stat==1) {
            var min = data.sum.min_obp;
            var lab = "OBP";
        } else {
            var min = data.sum.min_babip;
            var lab = "BABIP";
        }

        d3.select('.chart').append("text")
            .attr("class", "label")
            .attr("transform", "translate("+width/2+", "+(height+margin.bottom-5)+")")
            .text("PA");

        d3.select('.chart').append("text")
            .attr("class", "label")
            .attr("transform", "translate("+(-margin.left+10)+", "+height/2+") rotate(-90)")
            .text(lab);

        d3.select('.chart').append("text")
            .attr("class", "label")
            .attr("transform", "translate("+(width+margin.right-3)+", "+height/2+") rotate(-90)")
            .text(lab);

        d3.select('.chart').append("text")
            .attr("class", "title")
            .text(lab + " Changes During Season")
            .attr("transform", function() {
                var len = d3.select('.title').node().getBoundingClientRect()
                return "translate("+((width/2)-(len.width/2))+", "+(-2)+")";
            });

        var xScale = d3.scale.linear()
            .domain([150,600]).range([0,width]);
        var normXScale = d3.scale.linear()
            .domain([0,d3.max(data.freq[0].freq_ba, function(d) {return +d.y;})]).range([0,100])
        var yScale = d3.scale.linear()
            .domain([min-.05, min+.25]).range([height,0])

        var axisx = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");
        var axisy = d3.svg.axis()
            .scale(yScale)
            .orient("left");
        var axisz = d3.svg.axis()
            .scale(yScale)
            .orient("right");

        d3.select('#xaxis').call(axisx);
        d3.select('#yaxis').call(axisy);
        d3.select('#zaxis').call(axisz)

        var line = function(d) {
            var out = d3.svg.line()
                .x(function(d) {
                    return xScale(d.x); })
                .y(function(d) {return yScale(d.y); })
                .interpolate('linear');

            var parsed = []

            if (stat == 0) {
                for (var i=150; i < d.ba.length; i++) {
                    parsed.push({'x':i, 'y':d.ba[i]})
                };
            } else if (stat == 1) {
                for (var i=150; i < d.obp.length; i++) {
                    parsed.push({'x':i, 'y':d.obp[i]})
                };
            } else {
                for (var i=150; i < d.babip.length; i++) {
                    parsed.push({'x':i, 'y':d.babip[i]})
                };
            };
            return out(parsed);
        };

        var moveCirc = function(d) {
            return function(d) {
                return function(t) {
                    if (stat == 0) {
                        var dataArr = d.ba;
                    }
                    else if (stat==1) {
                        var dataArr = d.obp;
                    } else {
                        var dataArr = d.babip;
                    };

                    var x = Math.floor(450*t)+149;
                    var y = yScale(dataArr[x])
                    return "translate("+xScale(x)+", "+y+")";
                };
            };
        };

        var area = function(d) {
            if (stat == 0) {
                var data = d.freq_ba
            }
            else if (stat == 1) {
                var data = d.freq_obp
            } else {
                var data = d.freq_babip
            };

            var out = d3.svg.area()
                .x0(width)
                .x1(function(d) {
                    return normXScale(-d.y)+width; })
                .y(function(d) {
                    return (yScale(d.x)); })
                .interpolate('linear');
            return out(data);
        };

        if (stat == 0) {
            var stDev = data.sum.std_ba;
            var mean = data.sum.mean_ba;
            var range = data.sum.rng_ba;
        } else if (stat == 1) {
            var stDev = data.sum.std_obp;
            var mean = data.sum.mean_obp;
            var range = data.sum.rng_obp;
        } else {
            var stDev = data.sum.std_babip;
            var mean = data.sum.mean_babip;
            var range = data.sum.rng_babip;
        };

        var infoBox = d3.select("#statplot").append("div")
            .attr("id", "description")
            .style("display", "none");

        var sumStat = d3.select("#statplot").append("div")
            .attr("id", "sumStat")
            .html("<strong>Summary Stats</strong> <br> Mean: "+mean+"<br> St. Dev: "+stDev +"<br> Rng: "+range);

        var j = 0;

        var batData = data.lines;
        var svg = d3.select('#statplot .chart');
        var lines = svg.selectAll('.line')
            .data(batData).enter()

        lines.append('path')
            .attr('class', 'line')
            .attr('d', line)
            .attr("stroke", colors.secondary)
            .on("mouseover", function(d) {
                infoBox.html("BA: " + d.ba[d.ba.length-1] + "<br> BA-PCTL: "+ (d.pct_ba*100).toFixed(1) + "% <br> OBP: "
                + d.obp[d.obp.length-1] +"<br> OBP-PCTL: "+ (d.pct_obp*100).toFixed(1) +"%")
                   .style("display", "inline")
                   .style("left", (d3.event.pageX-775) + "px")
                   .style("top", (d3.event.pageY-153) + "px")
                   .style("background", colors.secondary);
                if($(this).attr('id') == "current") {
                    d3.select(this).style("stroke", colors.tertiary);
                } else {
                    d3.select(this).style("stroke", colors.tertiary);
                ;};

                this.parentNode.appendChild(this);
              })
            .on("mouseout", function(d) {
                infoBox.style("display", "none");
                this.parentNode.appendChild(d3.select('.areaDist')[0][0]);
                d3.select(this).style("stroke", colors.secondary);
                if($(this).attr('id') == "current") {
                    d3.select(this).style("stroke", colors.tertiary)
                };
            })
            .on("click", function(d) {
                d3.selectAll(".traj").transition();
                $("#tracker").remove();
                d3.select("#current").style("stroke", colors.secondary);
                $("#current").removeAttr("id", "current");

                d3.select('#instruct').style("display", "none");
                d3.select(this).attr("id", "current");
                d3.select(this).style("stroke", colors.tertiary);
                bbviz.fieldUpdate(d);

                var time = document.getElementById("time").value
                var start = this.getPointAtLength(0);
                var track = d3.select("#statplot .chart").selectAll("#tracker")
                    .data([d]).enter();

                track.append('circle')
                    .attr("id", "tracker")
                    .attr("r", 4)
                    .attr("transform", "translate("+start.x+", "+start.y+")")
                    .style("fill", colors.primary)
                    .style("stroke", "black")
                    .transition()
                    .ease("linear")
                    .delay(time*150 + 1200)
                    .duration(450*time)
                    .attrTween("transform", moveCirc(d));
            });

        var freqData = data.freq;
        var areaDist = svg.selectAll('.areaDist')
            .data(freqData).enter()

        areaDist.append('path')
            .attr('class', 'areaDist')
            .attr('d', area)
            .attr("fill", colors.primary)
            .on("mouseover", function() {
                sumStat.style("color", colors.primary)
                    .style("border", "solid "+colors.tertiary+" 2px");
            })
            .on("mouseout", function() {
                sumStat.style("color", "black")
                    .style("border", "solid black 1px");
            });
    });
}(window.bbviz=window.bbviz || {}));
