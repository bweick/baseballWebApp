(function(bbviz) {
    'use strict';
    function ready(error) {
        if(error) throw error;
    };

    var url = document.getElementsByName("head")[0].id;

    var query = '?url='+url;

    var q = d3.queue()
        .defer(bbviz.initGraph)
        .defer(bbviz.initField)
        .await(ready);
}(window.bbviz=window.bbviz || {}));
