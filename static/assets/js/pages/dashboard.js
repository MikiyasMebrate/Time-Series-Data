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
      var randomIndicator;
      var indicatorData = null;
      // Extract values and years from the filtered data
      var values = [];
      var years = [];

      // Keep looping until values is not empty
      while (values.length === 0) {
        // Randomly select a topic
        randomTopic = data.topics[Math.floor(Math.random() * data.topics.length)];

        if (randomTopic && randomTopic.id) {
          // Filter categories related to the selected topic
          relatedCategories = data.categories.filter(category => category.topic_id === randomTopic.id);

          // Check if there are related categories
          if (relatedCategories.length > 0) {
            // Randomly select a category from the filtered list
            randomCategory = relatedCategories[Math.floor(Math.random() * relatedCategories.length)];

            relatedIndicators = data.indicators.filter(indicator => indicator.for_category_id === randomCategory.id  &&  String(indicator.type_of) == 'yearly');
            

            // Check if there are related indicators
            if (relatedIndicators.length > 0) {
              console.log(relatedIndicators)
              randomIndicator = relatedIndicators[Math.floor(Math.random() * relatedIndicators.length)];

              // Fetch data for the selected indicator
              indicatorData = generateForIndicator(randomIndicator.id, data);
            }
            // else {
            //   console.error('No related indicators for the selected category:');
            // }
          }
          // else {
          //   console.error('No related categories for the selected topic. Selecting a new random topic...');
          // }
        }
        // else {
        //   console.error('Invalid randomTopic:');
        // }
      }


      function generateForIndicator(indicatorId, data) {

        // Filter the data for the selected indicator
        var indicatorData = data.value.filter(value => value.for_indicator_id === indicatorId );

        indicatorData.forEach(entry => {
          var datapointId = entry.for_datapoint_id;
          var datapoint = getDataPointById(datapointId, data.year); // Assuming 'year' is the array containing DataPoint information
          if (datapoint) {
            values.push(entry.value); // Limit value to a maximum length of 10
            years.push(datapoint.year_EC || datapoint.year_GC);
          }
        });

        // Reverse both the values and years arrays
        values = values.reverse();
        years = years.reverse();

        // Keep only the last 10 values and corresponding years
        values = values.slice(0, 10);
        years = years.slice(0, 10);

        // Draw the chart using the fetched data
        drawChart(values, years);

        // Return the values and years for potential further use
        return { values, years };
      }

      // Helper function to get DataPoint by ID
      function getDataPointById(datapointId, datapoints) {
        return datapoints.find(datapoint => datapoint.id === datapointId);
      }
      // Function to draw the chart
      function drawChart(values, years) {
        var categoryName = `${randomIndicator.title_ENG} ${randomIndicator.title_AMH}`;
        document.getElementById('chart_head_id').innerHTML = `${randomCategory.name_ENG} ${randomCategory.name_AMH}`;
        document.getElementById('chart_indicator').innerHTML = categoryName;

        // Extend the years array with missing years
        var minYear = Math.min(...years);
        var maxYear = Math.max(...years);
        var extendedYears = Array.from({ length: maxYear - minYear + 1 }, (_, index) => (minYear + index).toString());

        // Map values to corresponding years
        var mappedValues = extendedYears.map(year => {
          var valueIndex = years.indexOf(year);
          return valueIndex !== -1 ? values[valueIndex] : 0; // Assign zero if no data for the year
        });

        // Use the extended years and corresponding values to draw the chart
        var salesChartCanvas = document.getElementById("revenue-chart-canvas").getContext("2d");
        var salesChartData = {
          labels: extendedYears,
          datasets: [
            {
              label: categoryName,
              backgroundColor: "rgba(60,141,188,0.9)",
              borderColor: "rgba(60,141,188,0.8)",
              pointRadius: false,
              pointColor: "#3b8bba",
              pointStrokeColor: "rgba(60,141,188,1)",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(60,141,188,1)",
              data: mappedValues,
            },
          ],
        };
        var salesChartOptions = {
          maintainAspectRatio: false,
          responsive: true,
          legend: { display: false },
          scales: {
            xAxes: [{
              gridLines: { display: false },
              ticks: {
                // Display years in ascending order
                callback: function (value, index, values) {
                  return value;
                }
              },
            }],
            yAxes: [{
              gridLines: { display: false },
            }],
          },
        };

        var salesChart = new Chart(salesChartCanvas, {
          type: "line",
          data: salesChartData,
          options: salesChartOptions,
        });
      }

    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('Error fetching data: ' + textStatus, errorThrown);
    }
  });
});

