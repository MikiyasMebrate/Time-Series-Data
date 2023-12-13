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

      // Extract values and years from the filtered data
      var values1 = [];
      var years1 = [];
      var values2 = [];
      var years2 = [];

      // Maximum number of attempts to break out of the loop
      var maxAttempts = 15;
      var attempts = 0;

      // Keep looping until values are not empty for both indicators
      while ((values1.length == 0 || values2.length == 0) ) {
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
          if (relatedIndicators.length > 2) {
            // Randomly select two indicators from the filtered list
            randomIndicator1 = relatedIndicators[Math.floor(Math.random() * relatedIndicators.length)];
            randomIndicator2 = relatedIndicators.filter(indicator => indicator.id !== randomIndicator1.id)[0];
            console.log('randomIndicator1', randomIndicator1);
            console.log('randomIndicator2', randomIndicator2);

            // Fetch data for the selected indicators
            generateForIndicator1(randomIndicator1.id, data);
            generateForIndicator2(randomIndicator2.id, data);
          } else {
            console.error('Not enough related indicators for the selected category:', randomCategory);
          }
        } else {
          console.error('No related categories for the selected topic. Trying another topic...');
        }
      }

      function generateForIndicator1(indicatorId, data) {
        // Filter the data for the selected indicator
        var indicatorData = data.value.filter(value => value.for_indicator_id === indicatorId);
        console.log('first indicator data', indicatorData)

        indicatorData.forEach(entry => {
          var datapointId = entry.for_datapoint_id;
          var datapoint = getDataPointById(datapointId, data.year); // Assuming 'year' is the array containing DataPoint information
          if (datapoint) {
            values1.push(entry.value.substring(0, 10)); // Limit value to a maximum length of 10
            years1.push(datapoint.year_EC || datapoint.year_GC);
          }
        });

        // Reverse both the values and years arrays
        values1 = values1.reverse();
        years1 = years1.reverse();
        console.log('stored values on values2 ', values1)
        console.log('stored values on values2 ', years1)
        // Draw the chart using the fetched data;
        drawLineChart(values1, years1);
      }

      function generateForIndicator2(indicatorId, data) {
        // Filter the data for the selected indicator
        var indicatorData = data.value.filter(value => value.for_indicator_id === indicatorId);
        console.log('second indicator data', indicatorData)
        indicatorData.forEach(entry => {
          var datapointId = entry.for_datapoint_id;
          var datapoint = getDataPointById(datapointId, data.year); // Assuming 'year' is the array containing DataPoint information
          if (datapoint) {
            values2.push(entry.value.substring(0, 10)); // Limit value to a maximum length of 10
            years2.push(datapoint.year_EC || datapoint.year_GC);
          }
        });

        // Reverse both the values and years arrays
        values2 = values2.reverse();
        years2 = years2.reverse();
        console.log('stored values on values2 ', values2)
        console.log('stored values on years2', years2)
        // Draw the chart using the fetched data
        drawBarChart(values2, years2)
      }

      function getDataPointById(datapointId, datapoints) {
        console.log('the year found', datapoints)
        return datapoints.find(datapoint => datapoint.id === datapointId);
      }

      // Function to draw the line chart using Highcharts
      function drawLineChart(valuesArray, yearsArray) {
        document.getElementById('linechart_head_id').innerHTML=randomCategory.name_ENG
        console.log('data passed to the line chart array', valuesArray, yearsArray);
    
        // Check if Highcharts library is loaded
        if (typeof Highcharts === 'undefined') {
            console.error('Highcharts library not found.');
            return;
        }
    
        // Convert values to integers or fallback to 0
        var seriesData = {
            name: randomIndicator1.title_ENG,
            data: valuesArray.map(value => {
                // Use parseInt for integer values
                var parsedValue = parseInt(value);
    
                // Check if parsing is successful, otherwise fallback to 0
                return isNaN(parsedValue) ? 0 : parsedValue;
            })
        };
    
        // Draw Highcharts Line Chart
        Highcharts.chart('line-chart', {
            chart: {
                type: 'line'
            },
            title: {
                text: randomIndicator1.title_ENG
            },
            xAxis: {
                categories: yearsArray.map(String)
            },
            yAxis: {
                title: {
                    text: 'Amount'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }
            },
            series: [seriesData]
        });
    }
    
      // Function to draw the bar chart
      function drawBarChart(valuesArray, yearsArray) {
        document.getElementById('barchart_head_id').innerHTML=randomCategory.name_ENG
        console.log('data passed to the bar chart array', valuesArray, yearsArray);
        // Check if valuesArray is an array and has at least one series
        if (Array.isArray(valuesArray) && valuesArray.length) {
          Highcharts.chart('bar-chart', {
            chart: {
              type: 'column'
            },
            title: {
              text: randomIndicator2.title_ENG
            },
            subtitle: {
              text: 'Resize the frame or click buttons to change appearance'
            },
            legend: {
              align: 'right',
              verticalAlign: 'middle',
              layout: 'vertical'
            },
            xAxis: {
              categories: yearsArray,
              labels: {
                x: -10
              }
            },
            yAxis: {
              allowDecimals: false,
              title: {
                text: 'Amount'
              }
            },
            series: [{
              name: randomIndicator2.title_ENG,
              data: valuesArray.map(value => parseInt(value))
            }],
            responsive: {
              rules: [{
                condition: {
                  maxWidth: 500
                },
                chartOptions: {
                  legend: {
                    align: 'center',
                    verticalAlign: 'bottom',
                    layout: 'horizontal'
                  },
                  yAxis: {
                    labels: {
                      align: 'left',
                      x: 0,
                      y: -5
                    },
                    title: {
                      text: null
                    }
                  },
                  subtitle: {
                    text: null
                  },
                  credits: {
                    enabled: false
                  }
                }
              }]
            }
          });
        } else {
          console.error('Invalid data format. Check valuesArray structure.');
        }

      }

    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('Error fetching data: ' + textStatus, errorThrown);
    }
  });
});
