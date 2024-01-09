// Generate a random integer between min (inclusive) and max (exclusive)

let filterData = () => {
  fetch("/user-admin/json")
    .then((response) => response.json())
    .then((data) => {
      let yearRandomDataChart = () => {

        let excludedRandomNumbers = [];

        //last 5 Year Data
        let lastFiveYearData = []

        function getRandomInt(min, max) {
          min = Math.ceil(min);
          max = Math.floor(max);
          let index = Math.floor(Math.random() * (max - min)) + min;
          while (excludedRandomNumbers.includes(index)) {
            index = Math.floor(Math.random() * (max - min)) + min;
            excludedRandomNumbers.push(index);
          }
          return index;
        }

        let randomCategoryIndex1 = getRandomInt(0, data.categories.length);
        let randomCategoryIndex2 = getRandomInt(0, data.categories.length);

        //Random Category
        let randomCategory = () => {
          randomCategoryIndex1 = getRandomInt(0, data.categories.length);
          return data.categories[randomCategoryIndex1];
        };

        let randomChoocedCategory = "";

        let indicatorActualvalue = [];
        let checkIndicatorValue = false;

        while (checkIndicatorValue != true) {
          //Indicaor
          indicatorActualvalue = [];
          randomChoocedCategory = randomCategory();
          indicatorLists = data.indicators.filter(
            (item) =>
              String(item.for_category_id) ==
              String(randomChoocedCategory.id) && item.type_of == "yearly"
          );

          while (indicatorLists.length == 0) {
            randomChoocedCategory = randomCategory();
            indicatorLists = data.indicators.filter(
              (item) =>
                String(item.for_category_id) ==
                String(randomChoocedCategory.id) && item.type_of == "yearly"
            );
          }

          //Value
          for (indicator of indicatorLists) {
            let val = [];
            for (year of data.year) {
              let value = data.value.find(
                (value) =>
                  String(value.for_indicator_id) == String(indicator.id) &&
                  String(value.for_datapoint_id) == String(year.id) &&
                  value.for_month_id == null &&
                  value.for_quarter_id == null
              );
              value ? val.push(value.value) : val.push(null);
            }
            indicatorActualvalue.push({ name: indicator.title_ENG, data: val });
          }

          for (let i of indicatorActualvalue) {
            let checkValue = i.data.filter((item) => item != null);
            if (checkValue.length != 0) {
              checkIndicatorValue = true;
              break;
            }
          }
        }


        for (let cut of indicatorActualvalue) {
          lastFiveYearData.push({ name: cut.name, data: cut.data.slice(cut.data.length - 5, cut.data.length) })
        }


        ///CHART

        //Random Yearly Graph 1
        Highcharts.chart("containerYear1", {
          title: {
            text: `${randomChoocedCategory.name_ENG}`,
            align: "left",
          },

          subtitle: {
            text: "Source: MOPD.",
            align: "left",
          },

          yAxis: {
            title: {
              text: "Values",
            },
          },

          xAxis: {
            accessibility: {
              rangeDescription: "Range: 1967 to 2015",
            },
          },

          plotOptions: {
            series: {
              label: {
                connectorAllowed: false,
              },
              pointStart: parseInt(data.year[0].year_EC),
            },
          },

          series: indicatorActualvalue,

          responsive: {
            rules: [
              {
                condition: {
                  maxWidth: 500,
                },
                chartOptions: {
                  legend: {
                    layout: "horizontal",
                    align: "center",
                    verticalAlign: "bottom",
                  },
                },
              },
            ],
          },
        });


        //Random Yearly Graph 2
        Highcharts.chart("containerYear2", {
          title: {
            text: `${randomChoocedCategory.name_ENG} Last 5 Years`,
            align: "left",
          },

          subtitle: {
            text: "Source: MOPD.",
            align: "left",
          },

          yAxis: {
            title: {
              text: "Values",
            },
          },

          xAxis: {
            accessibility: {
              rangeDescription: "Range: 1967 to 2015",
            },
          },

          plotOptions: {
            series: {
              label: {
                connectorAllowed: false,
              },
              pointStart: parseInt(data.year[data.year.length - 5].year_EC),
            },
          },

          series: lastFiveYearData,

          responsive: {
            rules: [
              {
                condition: {
                  maxWidth: 500,
                },
                chartOptions: {
                  legend: {
                    layout: "horizontal",
                    align: "center",
                    verticalAlign: "bottom",
                  },
                },
              },
            ],
          },
        });
      };


      let monthRandomDataChart = () => {
        let lastYear = data.year[data.year.length - 1]; // last Year
        //Month Data
        let monthlyValue = [];

        //Month Data
        let monthlyIndicator = data.indicators.filter(
          (item) => item.type_of == "monthly"
        );
        let randomMonthlyIndicatorIndex1 = null;
        let randomMonthlyIndicatorIndex2 = null;
        let randomMonthlyIndicator1 = null;
        let randomMonthlyIndicator2 = null;

        //Find the right indicator which is the indicator shouldn't duplicated and is not deleted
        do {
          do {
            randomMonthlyIndicatorIndex1 =
              Math.floor(Math.random() * (monthlyIndicator.length - 0)) + 0;
            randomMonthlyIndicatorIndex2 =
              Math.floor(Math.random() * (monthlyIndicator.length - 0)) + 0;
          } while (
            String(randomMonthlyIndicatorIndex1) ==
            String(randomMonthlyIndicatorIndex2)
          );

          randomMonthlyIndicator1 =
            monthlyIndicator[randomMonthlyIndicatorIndex1];
          randomMonthlyIndicator2 =
            monthlyIndicator[randomMonthlyIndicatorIndex2];
        } while (
          randomMonthlyIndicator1.is_deleted == true ||
          randomMonthlyIndicator2.is_deleted == true
        );

        let monthValue1 = [];
        let monthValue2 = [];

        for (month of data.month) {
          let value1 = data.value.find(
            (itemValue) =>
              String(itemValue.for_indicator_id) ==
              String(randomMonthlyIndicator1.id) &&
              String(itemValue.for_month_id) == String(month.id) &&
              String(itemValue.for_datapoint_id) == String(lastYear.id)
          );
          value1 ? monthValue1.push(value1.value) : monthValue1.push(null);

          let value2 = data.value.find(
            (itemValue) =>
              String(itemValue.for_indicator_id) ==
              String(randomMonthlyIndicator2.id) &&
              String(itemValue.for_month_id) == String(month.id) &&
              String(itemValue.for_datapoint_id) == String(lastYear.id)
          );
          value2 ? monthValue2.push(value2.value) : monthValue2.push(null);
        }

        monthlyValue.push(
          { name: randomMonthlyIndicator1.title_ENG, data: monthValue1 },
          { name: randomMonthlyIndicator2.title_ENG, data: monthValue2 }
        );

        //Random Month Graph
        // Data retrieved https://en.wikipedia.org/wiki/List_of_cities_by_average_temperature
        Highcharts.chart("containerMonth1", {
          chart: {
            type: "spline",
          },
          title: {
            text: `${lastYear.year_EC} Yearly Random Data`,
          },
          subtitle: {
            text: "Source: " + "MoPD",
          },
          xAxis: {
            categories: [
              "መስከረም",
              "ጥቅምት",
              "ኅዳር",
              "ታኅሣሥ",
              "ጥር",
              "የካቲት",
              "መጋቢት",
              "ሚያዝያ",
              "ግንቦት",
              "ሰኔ",
              "ሐምሌ",
              "ነሐሴ",
            ],
            accessibility: {
              description: "Months of the year",
            },
          },
          yAxis: {
            title: {
              text: "Value",
            },
            labels: {
              format: "{value}°",
            },
          },
          tooltip: {
            crosshairs: true,
            shared: true,
          },
          plotOptions: {
            spline: {
              marker: {
                radius: 4,
                lineColor: "#666666",
                lineWidth: 1,
              },
            },
          },
          series: monthlyValue,
        });
      }


      yearRandomDataChart()
      monthRandomDataChart()


    })
    .catch((err) => console.log(err));
};

filterData();


Highcharts.chart('drilldown', {
  chart: {
    type: 'column'
  },
  title: {
    align: 'left',
    text: 'Browser market shares. January, 2022'
  },
  subtitle: {
    align: 'left',
    text: 'Click the columns to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>'
  },
  accessibility: {
    announceNewData: {
      enabled: true
    }
  },
  xAxis: {
    type: 'category'
  },
  yAxis: {
    title: {
      text: 'Total percent market share'
    }

  },
  legend: {
    enabled: false
  },
  plotOptions: {
    series: {
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        format: '{point.y:.1f}%'
      }
    }
  },

  tooltip: {
    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
  },

  series: [
    {
      name: 'Browsers',
      colorByPoint: true,
      data: [
        {
          name: 'Chrome',
          y: 63.06,
          drilldown: 'Chrome'
        },
        {
          name: 'Safari',
          y: 19.84,
          drilldown: 'Safari'
        },
        {
          name: 'Firefox',
          y: 4.18,
          drilldown: 'Firefox'
        },
        {
          name: 'Edge',
          y: 4.12,
          drilldown: 'Edge'
        },
        {
          name: 'Opera',
          y: 2.33,
          drilldown: 'Opera'
        },
        {
          name: 'Internet Explorer',
          y: 0.45,
          drilldown: 'Internet Explorer'
        },
        {
          name: 'Other',
          y: 1.582,
          drilldown: null
        }
      ]
    }
  ],
  drilldown: {
    breadcrumbs: {
      position: {
        align: 'right'
      }
    },
    series: [
      {
        name: 'Chrome',
        id: 'Chrome',
        data: [
          [
            'v65.0',
            0.1
          ],
          [
            'v64.0',
            1.3
          ],
          [
            'v63.0',
            53.02
          ],
          [
            'v62.0',
            1.4
          ],
          [
            'v61.0',
            0.88
          ],
          [
            'v60.0',
            0.56
          ],
          [
            'v59.0',
            0.45
          ],
          [
            'v58.0',
            0.49
          ],
          [
            'v57.0',
            0.32
          ],
          [
            'v56.0',
            0.29
          ],
          [
            'v55.0',
            0.79
          ],
          [
            'v54.0',
            0.18
          ],
          [
            'v51.0',
            0.13
          ],
          [
            'v49.0',
            2.16
          ],
          [
            'v48.0',
            0.13
          ],
          [
            'v47.0',
            0.11
          ],
          [
            'v43.0',
            0.17
          ],
          [
            'v29.0',
            0.26
          ]
        ]
      },
      {
        name: 'Firefox',
        id: 'Firefox',
        data: [
          [
            'v58.0',
            1.02
          ],
          [
            'v57.0',
            7.36
          ],
          [
            'v56.0',
            0.35
          ],
          [
            'v55.0',
            0.11
          ],
          [
            'v54.0',
            0.1
          ],
          [
            'v52.0',
            0.95
          ],
          [
            'v51.0',
            0.15
          ],
          [
            'v50.0',
            0.1
          ],
          [
            'v48.0',
            0.31
          ],
          [
            'v47.0',
            0.12
          ]
        ]
      },
      {
        name: 'Internet Explorer',
        id: 'Internet Explorer',
        data: [
          [
            'v11.0',
            6.2
          ],
          [
            'v10.0',
            0.29
          ],
          [
            'v9.0',
            0.27
          ],
          [
            'v8.0',
            0.47
          ]
        ]
      },
      {
        name: 'Safari',
        id: 'Safari',
        data: [
          [
            'v11.0',
            3.39
          ],
          [
            'v10.1',
            0.96
          ],
          [
            'v10.0',
            0.36
          ],
          [
            'v9.1',
            0.54
          ],
          [
            'v9.0',
            0.13
          ],
          [
            'v5.1',
            0.2
          ]
        ]
      },
      {
        name: 'Edge',
        id: 'Edge',
        data: [
          [
            'v16',
            2.6
          ],
          [
            'v15',
            0.92
          ],
          [
            'v14',
            0.4
          ],
          [
            'v13',
            0.1
          ]
        ]
      },
      {
        name: 'Opera',
        id: 'Opera',
        data: [
          [
            'v50.0',
            0.96
          ],
          [
            'v49.0',
            0.82
          ],
          [
            'v12.1',
            0.14
          ]
        ]
      }
    ]
  }
});

let globalData = [];
let chart;

let duration = 500; // Determines how long the animation between new points should be take
let startIterator = 1; // Determines how many points will be rendered on chart's init
let currentIterator = startIterator;
let maxIterator = 1;

let guiButton = document.getElementById('start');
let guiButtonState = 'Start';
let intervalId;

// Fetch data:
fetch('https://pomber.github.io/covid19/timeseries.json')
  .then(response => response.json())
  .then(data => {
    parseData(data);
    createChart();
    initEvents();
  });

function initEvents() {
  guiButton.addEventListener('click', function () {
    if (guiButtonState === 'Stop') {
      // User clicked "Stop" -> stop animation and allow to resume
      intervalId = clearInterval(intervalId);
      guiButton.innerText = guiButtonState = 'Resume';
    } else {
      // If animation has finished, recreate chart
      if (guiButtonState === 'Restart') {
        createChart();
      }
      guiButton.innerText = guiButtonState = 'Stop';
      // Start animation:
      redrawChart(currentIterator += 1);
      intervalId = setInterval(function () {
        // If we reached last available point, stop animation:
        if (currentIterator === maxIterator) {
          intervalId = clearInterval(intervalId);
          currentIterator = startIterator;
          guiButton.innerText = guiButtonState = 'Restart';
        } else {
          redrawChart(currentIterator += 1);
        }
      }, duration);
    }
  });
}

function redrawChart(index) {
  // Set new subtitle on every redraw
  chart.setTitle(null, {
    text: `Day #${index - 1}`
  }, false);

  const newValues = globalData.map(series => series.data[index] && series.data[index][1] || -1);
  const maxIndex = newValues.indexOf(Math.max.apply(null, newValues));

  // To each series, add a point:
  chart.series.forEach(
    (series, seriesIndex) => {
      const enabled = maxIndex === seriesIndex && ((index < 5) || (index % 5 === 0));
      if (!globalData[seriesIndex].data[index]) {
        return;
      }
      series.addPoint(
        {
          y: globalData[seriesIndex].data[index][1],
          dataLabels: {
            enabled
          },
          marker: {
            enabled
          }
        },
        false,
        false,
        false
      );
    }
  );

  // Now, once everything is updated, redraw chart:
  chart.redraw({
    duration
  });
}

function parseData(data) {
  Highcharts.objectEach(
    data,
    // Prepare Highcharts data-format:
    // series: [{
    //   data: [ [x, y], [x, y], ..., [x, y]]
    // }]
    (countryData, country) => globalData.push({
      name: country,
      data: countryData.map(p => [Date.parse(p.date.replace(/-/g, "/")), p.confirmed])
    })
  );


  // Sort and limit dataset:
  globalData = globalData
    .map(country => {
      country.data = country.data.filter(p => p[1] > 0);
      return country;
    })
    .sort((countryA, countryB) => {
      let countryALen,
        countryBLen;

      if (!countryA || !countryA.data || countryA.data.length === 0) {
        return 1;
      }

      if (!countryB || !countryB.data || countryB.data.length === 0) {
        return -1;
      }

      return countryB.data[countryB.data.length - 1][1] - countryA.data[countryA.data.length - 1][1];
    })
    .splice(0, 8);

  maxIterator = Math.max.apply(null, globalData.map(series => series.data.length - 1));
}

function createChart() {
  chart = Highcharts.chart('live_data', {
    chart: {
      type: 'line',
      marginLeft: 100
    },

    legend: {
      layout: 'proximate',
      align: 'right'
    },


    title: {
      floating: true,
      align: 'left',
      x: 93,
      y: 20,
      text: 'Confirmed cases per country'
    },
    subtitle: {
      floating: true,
      align: 'left',
      y: 60,
      x: 90,
      text: 'Day #0',
      style: {
        fontSize: '40px'
      }
    },
    tooltip: {
      split: true
    },

    yAxis: {
      title: {
        text: ''
      },
      maxPadding: 0.2,
      softMax: 200
    },

    xAxis: {
      gridLineWidth: 2,
      min: 0,
      softMax: 7,
      labels: {
        format: 'Day #{value}'
      }
    },


    plotOptions: {
      series: {
        animation: {
          duration
        },
        marker: {
          symbol: 'circle'
        }
      }
    },
    series: globalData.map(series => {
      return {
        name: series.name,
        data: series.data.slice(0, startIterator).map(point => {
          return { y: point[1] }
        })
      }
    })
  });
}

createChart()