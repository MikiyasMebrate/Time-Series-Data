$(function () {
  "use strict";
  $(".connectedSortable").sortable({
    placeholder: "sort-highlight",
    connectWith: ".connectedSortable",
    handle: ".card-header, .nav-tabs",
    forcePlaceholderSize: true,
    zIndex: 999999,
  });
  $(".connectedSortable .card-header").css("cursor", "move");
  $(".todo-list").sortable({
    placeholder: "sort-highlight",
    handle: ".handle",
    forcePlaceholderSize: true,
    zIndex: 999999,
  });
  $(".textarea").summernote();
  $(".daterange").daterangepicker(
    {
      ranges: {
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
        "Last 7 Days": [moment().subtract(6, "days"), moment()],
        "Last 30 Days": [moment().subtract(29, "days"), moment()],
        "This Month": [moment().startOf("month"), moment().endOf("month")],
        "Last Month": [
          moment().subtract(1, "month").startOf("month"),
          moment().subtract(1, "month").endOf("month"),
        ],
      },
      startDate: moment().subtract(29, "days"),
      endDate: moment(),
    },
    function (start, end) {
      alert(
        "You chose: " +
          start.format("MMMM D, YYYY") +
          " - " +
          end.format("MMMM D, YYYY")
      );
    }
  );
  $(".knob").knob();
  var visitorsData = {
    US: 398,
    SA: 400,
    CA: 1000,
    DE: 500,
    FR: 760,
    CN: 300,
    AU: 700,
    BR: 600,
    IN: 800,
    GB: 320,
    RU: 3000,
  };
  $("#calendar").datetimepicker({ format: "L", inline: true });
  $("#chat-box").overlayScrollbars({ height: "250px" });
  var salesChartCanvas = document
    .getElementById("revenue-chart-canvas")
    .getContext("2d");
  var salesChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Digital Goods",
        backgroundColor: "rgba(60,141,188,0.9)",
        borderColor: "rgba(60,141,188,0.8)",
        pointRadius: false,
        pointColor: "#3b8bba",
        pointStrokeColor: "rgba(60,141,188,1)",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(60,141,188,1)",
        data: [28, 48, 40, 19, 86, 27, 90],
      },
      {
        label: "Electronics",
        backgroundColor: "rgba(210, 214, 222, 1)",
        borderColor: "rgba(210, 214, 222, 1)",
        pointRadius: false,
        pointColor: "rgba(210, 214, 222, 1)",
        pointStrokeColor: "#c1c7d1",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  };
  var salesChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    legend: { display: false },
    scales: {
      xAxes: [{ gridLines: { display: false } }],
      yAxes: [{ gridLines: { display: false } }],
    },
  };
  var salesChart = new Chart(salesChartCanvas, {
    type: "line",
    data: salesChartData,
    options: salesChartOptions,
  });
  var pieChartCanvas = $("#sales-chart-canvas").get(0).getContext("2d");
  var pieData = {
    labels: ["Instore Sales", "Download Sales", "Mail-Order Sales"],
    datasets: [
      {
        data: [30, 12, 20],
        backgroundColor: ["#f56954", "#00a65a", "#f39c12"],
      },
    ],
  };
  var pieOptions = {
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
  };
  var pieChart = new Chart(pieChartCanvas, {
    type: "doughnut",
    data: pieData,
    options: pieOptions,
  });

  var salesGraphChart = new Chart(salesGraphChartCanvas, {
    type: "line",
    data: salesGraphChartData,
    options: salesGraphChartOptions,
  });
});
