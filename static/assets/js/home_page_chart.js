  /*
   * BAR CHART
   * ---------
   */

  var bar_data = {
    data: [
      [1, 10],
      [2, 8],
      [3, 4],
      [4, 13],
      [5, 17],
      [6, 9],
    ],
    bars: { show: true },
  };
  $.plot("#bar-chart", [bar_data], {
    grid: {
      borderWidth: 1,
      borderColor: "#f3f3f3",
      tickColor: "#f3f3f3",
    },
    series: {
      bars: {
        show: true,
        barWidth: 0.5,
        align: "center",
      },
    },
    colors: ["#3c8dbc"],
    xaxis: {
      ticks: [
        [1, "January"],
        [2, "February"],
        [3, "March"],
        [4, "April"],
        [5, "May"],
        [6, "June"],
      ],
    },
  });
  /* END BAR CHART */


/*
 * LINE CHART
 * ----------
 */
//LINE randomly generated data

var sin = [],
  cos = [];
for (var i = 0; i < 14; i += 0.5) {
  sin.push([i, Math.sin(i)]);
  cos.push([i, Math.cos(i)]);
}
var line_data1 = {
  data: sin,
  color: "#3c8dbc",
};
var line_data2 = {
  data: cos,
  color: "#00c0ef",
};
$.plot("#line-chart", [line_data1, line_data2], {
  grid: {
    hoverable: true,
    borderColor: "#f3f3f3",
    borderWidth: 1,
    tickColor: "#f3f3f3",
  },
  series: {
    shadowSize: 0,
    lines: {
      show: true,
    },
    points: {
      show: true,
    },
  },
  lines: {
    fill: false,
    color: ["#3c8dbc", "#f56954"],
  },
  yaxis: {
    show: true,
  },
  xaxis: {
    show: true,
  },
});

//Initialize tooltip on hover
$('<div class="tooltip-inner" id="line-chart-tooltip"></div>')
  .css({
    position: "absolute",
    display: "none",
    opacity: 0.8,
  })
  .appendTo("body");
$("#line-chart").bind("plothover", function (event, pos, item) {
  if (item) {
    var x = item.datapoint[0].toFixed(2),
      y = item.datapoint[1].toFixed(2);

    $("#line-chart-tooltip")
      .html(item.series.label + " of " + x + " = " + y)
      .css({
        top: item.pageY + 5,
        left: item.pageX + 5,
      })
      .fadeIn(200);
  } else {
    $("#line-chart-tooltip").hide();
  }
});
/* END LINE CHART */

/*
 * Custom Label formatter
 * ----------------------
 */
function labelFormatter(label, series) {
  return (
    '<div style="font-size:13px; text-align:center; padding:2px; color: #fff; font-weight: 600;">' +
    label +
    "<br>" +
    Math.round(series.percent) +
    "%</div>"
  );
}