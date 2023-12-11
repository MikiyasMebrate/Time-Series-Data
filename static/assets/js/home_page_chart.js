$(function () {
  $.ajax({
    url: "/user-admin/json/",
    type: "GET",
    dataType: "json",
    success: function (data) {
      var randomTopic;
      var relatedCategories;
      var randomCategory;
      var relatedIndicators;
      var randomIndicator1;
      var randomIndicator2;
      var indicatorData1 = null;
      var indicatorData2 = null;

      // Extract values and years from the filtered data
      var values1 = [];
      var years1 = [];
      var values2 = [];
      var years2 = [];

      // Maximum number of attempts to break out of the loop
      var maxAttempts = 10;
      var attempts = 0;

      // Keep looping until values are not empty for both indicators
      while ((values1.length === 0 || values2.length === 0) && attempts < maxAttempts) {
        // Increment attempts
        attempts++;

        // Randomly select a topic
        randomTopic = data.topics[Math.floor(Math.random() * data.topics.length)];
        console.log('randomTopic', randomTopic);

        // Filter categories related to the selected topic
        relatedCategories = data.categories.filter(category => category.topic_id === randomTopic.id);

        // Check if there are related categories
        if (relatedCategories.length > 0) {
          // Randomly select a category from the filtered list
          randomCategory = relatedCategories[Math.floor(Math.random() * relatedCategories.length)];
          console.log('randomCategory', randomCategory);

          // Filter indicators related to the selected category
          relatedIndicators = data.indicators.filter(indicator => indicator.for_category_id === randomCategory.id);

          // Check if there are related indicators
          if (relatedIndicators.length > 1) {
            // Randomly select two indicators from the filtered list
            randomIndicator1 = relatedIndicators[Math.floor(Math.random() * relatedIndicators.length)];
            randomIndicator2 = relatedIndicators.filter(indicator => indicator.id !== randomIndicator1.id)[0];
            console.log('randomIndicator1', randomIndicator1);
            console.log('randomIndicator2', randomIndicator2);

            // Fetch data for the selected indicators
            indicatorData1 = generateForIndicator(randomIndicator1.id, data);
            indicatorData2 = generateForIndicator(randomIndicator2.id, data);

            values1 = indicatorData1 ? indicatorData1.values : null;
            years1 = indicatorData1 ? indicatorData1.years : null;
            values2 = indicatorData2 ? indicatorData2.values : null;
            years2 = indicatorData2 ? indicatorData2.years : null;
          } else {
            console.error('Not enough related indicators for the selected category:', randomCategory);
          }
        } else {
          console.error('No related categories for the selected topic. Trying another topic...');
        }
      }

      // Check if we successfully obtained data for both indicators
      if (values1.length > 0 && values2.length > 0) {
        // Draw Line Chart
        drawLineChart([values1, values2], [years1, years2]);

        // Draw Bar Chart
        drawBarChart(values1);
      } else {
        console.error('Failed to obtain data for both indicators after maximum attempts.');
      }

      function generateForIndicator(indicatorId, data) {
        // Filter the data for the selected indicator
        var indicatorData = data.value.filter(value => value.for_indicator_id === indicatorId);

        // Extract values and years from the filtered data
        var values = [];
        var years = [];

        indicatorData.forEach(entry => {
          var datapointId = entry.for_datapoint_id;
          var datapoint = getDataPointById(datapointId, data.year); // Assuming 'year' is the array containing DataPoint information
          if (datapoint) {
            values.push(entry.value.substring(0, 10)); // Limit value to a maximum length of 10
            years.push(datapoint.year_EC || datapoint.year_GC);
          }
        });

        // Reverse both the values and years arrays
        values = values.reverse();
        years = years.reverse();

        // Draw the chart using the fetched data
        return { values, years };
      }

      function getDataPointById(datapointId, datapoints) {
        return datapoints.find(datapoint => datapoint.id === datapointId);
      }

      // Function to draw the line chart
      function drawLineChart(valuesArray, yearsArray) {
        // Draw Line Chart using the fetched data
        var lineChartCanvas = document.getElementById("line-chart").getContext("2d");
        var lineChartColors = ["#3c8dbc", "#00c0ef"];
        var lineChartData = [];

        for (var i = 0; i < valuesArray.length; i++) {
          lineChartData.push({
            data: valuesArray[i].map(value => parseFloat(value)),
            color: lineChartColors[i],
          });
        }

        var lineChartOptions = {
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
            color: lineChartColors,
          },
          yaxis: {
            show: true,
          },
          xaxis: {
            show: true,
          },
        };

        var lineChart = new Chart(lineChartCanvas, {
          type: "line",
          data: {
            datasets: lineChartData,
            labels: yearsArray[0],
          },
          options: lineChartOptions,
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
      }

      // Function to draw the bar chart
      function drawBarChart(values) {
        // Draw Bar Chart using the fetched data
        var barChartCanvas = document.getElementById("bar-chart").getContext("2d");
        var barChartColors = ["#3c8dbc"];
        var barChartData = {
          data: values.map(value => parseFloat(value)),
          bars: { show: true },
        };

        var barChartOptions = {
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
          colors: barChartColors,
          xaxis: {
            ticks: yearsArray[0].map((year, index) => [index + 1, year]),
          },
        };

        var barChart = new Chart(barChartCanvas, {
          type: "bar",
          data: {
            datasets: [barChartData],
          },
          options: barChartOptions,
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('Error fetching data: ' + textStatus, errorThrown);
    }
  });
});
