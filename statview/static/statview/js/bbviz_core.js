(function(bbviz) {
    'use strict';
    bbviz.colorScheme = (function() {
        var allColors = {"COL":{"primary":"#24135E", "secondary":"#CACDCD", "tertiary":"black"},
                         "ARI":{"primary":"#A71930", "secondary":"#D9C89E", "tertiary":"#09ADAD"},
                         "ATL":{"primary":"#BA0C2F", "secondary":"#CACDCD", "tertiary":" #002855"},
                         "BAL":{"primary":"#FC4C00", "secondary":"#CACDCD", "tertiary":"black"},
                         "BOS":{"primary":"#C60C30", "secondary":"#CACDCD", "tertiary":"#002244"},
                         "CHC":{"primary":"#002F6C", "secondary":"#CACDCD", "tertiary":"#C8102E"},
                         "CHW":{"primary":"black", "secondary":"#CACDCD", "tertiary":"red"},
                         "CIN":{"primary":"#BA0C2F", "secondary":"#CACDCD", "tertiary":"black"},
                         "CLE":{"primary":"#D50032", "secondary":"#CACDCD", "tertiary":"#0C2340"},
                         "DET":{"primary":"#0C2340", "secondary":"#CACDCD", "tertiary":"#FA4614"},
                         "HOU":{"primary":"#072854", "secondary":"#CACDCD", "tertiary":"#FF7F00"},
                         "KCR":{"primary":"#15317E", "secondary":"#CACDCD", "tertiary":"#74B4FA"},
                         "LAA":{"primary":"#BA032E", "secondary":"#CACDCD", "tertiary":"#0C2344"},
                         "LAD":{"primary":"#002F6C", "secondary":"#CACDCD", "tertiary":"red"},
                         "MIA":{"primary":"#F9423B", "secondary":"#FCDE04", "tertiary":"#0482CC"},
                         "MIL":{"primary":"#012143", "secondary":"#CACDCD", "tertiary":"#C4953B"},
                         "MIN":{"primary":"#BA0C2E", "secondary":"#CFAB7A", "tertiary":"#0C2341"},
                         "NYM":{"primary":"#FC4C00", "secondary":"#CACDCD", "tertiary":"#002D70"},
                         "NYY":{"primary":"#1C2841", "secondary":"#808080", "tertiary":"#DC343B"},
                         "OAK":{"primary":"#00483A", "secondary":"#CACDCD", "tertiary":"#FFBE00"},
                         "PHI":{"primary":"#BA0C2E", "secondary":"#CACDCD", "tertiary":"#003086"},
                         "PIT":{"primary":"#FFC72B", "secondary":"#CACDCD", "tertiary":"black"},
                         "SDP":{"primary":"#002D62", "secondary":"#FEC325", "tertiary":"#483727"},
                         "SEA":{"primary":"#003166", "secondary":"#C0C0C0", "tertiary":"#1C8B85"},
                         "SFG":{"primary":"#FB5B1F", "secondary":"#CACDCD", "tertiary":"black"},
                         "STL":{"primary":"#C41E3A", "secondary":"#CACDCD", "tertiary":"#0A2252"},
                         "TBR":{"primary":"#00285D", "secondary":"#79BDEE", "tertiary":"#FFD700"},
                         "TEX":{"primary":"#003279", "secondary":"#CACDCD", "tertiary":"#BD1021"},
                         "TOR":{"primary":"#003DA5", "secondary":"#CACDCD", "tertiary":"#DA291C"},
                         "WSN":{"primary":"#BA122B", "secondary":"#CACDCD", "tertiary":"#14225A"}};
        var team = d3.selectAll("td")[0][1].innerText;
        return allColors[team]
    });

    var colors = bbviz.colorScheme();

    bbviz.loadGraph = (function(config) {
        function spin(selection, duration) {
            selection.transition()
                .ease("linear")
                .duration(duration)
                .attrTween("transform", function() {
                      return d3.interpolateString("rotate(0)", "rotate(360)");
                });
            setTimeout(function() {
               spin(selection, duration);
            }, duration);
        };

        var tau = 2*Math.PI

        var arc = d3.svg.arc()
            .innerRadius(25)
            .outerRadius(40)
            .startAngle(0);

        var svg = d3.select(config.container).append('svg')
            .attr("id", config.id)
            .attr("width", config.width+"px")
            .attr("height", config.height+"px")
          .append("g")
            .attr("transform", "translate(" + config.width / 2 + "," + config.height / 2 + ")");

        var background = svg.append("path")
            .attr("class", "backLoad")
            .datum({endAngle:tau})
            .attr("d", arc)
            .style("fill", colors.primary);

        var foreground = svg.append("path")
            .attr("class", "foreLoad")
            .datum({endAngle:(tau/8)})
            .attr("d", arc)
            .style("stroke", "#FFF")
            .style("stroke-width", "2px")
            .style("fill", colors.tertiary)
            .call(spin, 3000);
    });

    bbviz.errorGraph = (function() {
        d3.select("#statplot").append('div')
            .attr("id", "errorContain")
            .html("<p>There was an error!</p>");
    });

    bbviz.onStart = (function() {
        var profile = d3.select('select#talent').node().value;
        var batter = document.getElementsByName("head")[0].id;

        //clear chart
        $(".line").remove();
        $(".areaDist").remove();
        $("#tracker").remove();
        $("#sumStat").remove();

        //clear field
        d3.selectAll(".traj").transition();
        $(".pbpBoxes").remove();
        $("#pbpSum").remove();
        $("#babip").remove();
        $("#instruct").remove();
        var child = document.getElementById("field");
        while (child.lastChild) {
            child.removeChild(child.lastChild);
        };

        $.ajax({
            method:'GET',
            //url:'http://localhost:8000/statview/simulation/',
            url:'https://baseballstatview.herokuapp.com/statview/simulation/',
            data:{'url':batter, 'profile':profile},
            async:'asynchronous',
            dataType:'json',
            beforeSend: function() {
                d3.select("#statplot").append('div')
                    .attr("id", "loaderContain")
                    .style("border", "none");
                bbviz.loadGraph({width:100, height:100, container:"#loaderContain", id:"loader"});
            },
            /*complete: function() {
                var rmv = document.getElementById("loaderContain")
                rmv.parentNode.removeChild(rmv);
                bbviz.fieldUpdate(data);
            },*/
            success: function(data) {
                bbviz.graphUpdate(data);
                var rmv = document.getElementById("loaderContain")
                rmv.parentNode.removeChild(rmv);
                d3.select("#main").append('div')
                    .attr("id", "instruct")
                    .html("Click a line to see time lapse of season.")
                    .style("text-align", "center")
                    .style("position", "absolute")
                    .style("top", "120px").style("left", "97.5px")
                    .style("border", "none")
                    .style("display", "inline");
            },
            error: function(error) {
                var rmv = document.getElementById("loaderContain")
                rmv.parentNode.removeChild(rmv);
                bbviz.errorGraph();
            }
        });
    });

    var btn = d3.select('#run')
        .on('click', bbviz.onStart);
}(window.bbviz=window.bbviz || {}));
