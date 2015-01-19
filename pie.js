var createPie = function(domainFreqs) {
    var l = [];
    var s = [];
    for (var i in domainFreqs) {
	l.push(i);
	s.push(domainFreqs[i].totalTime);
    }
    var data = {
	labels: l,
	series: s
    };
    var options = {
	labelInterpolationFnc: function(value) {
	    return value[0]
	}
    };

    var responsiveOptions = [
	['screen and (min-width: 30px)', {
	    chartPadding: 0,
	    labelOffset: 0,
	    labelDirection: 'explode',
	    labelInterpolationFnc: function(value) {
		return value;
	    }
	}],
	['screen and (min-width: 30px)', {
	    labelOffset: 10,
	    chartPadding: 0
	}]
    ];

    new Chartist.Pie('.ct-chart', data, options, responsiveOptions);

    
};
