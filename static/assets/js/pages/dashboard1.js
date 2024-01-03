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


        for(let cut of indicatorActualvalue){
          lastFiveYearData.push({name:cut.name, data:cut.data.slice(cut.data.length - 5, cut.data.length)})
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
                      pointStart: parseInt(data.year[data.year.length-5].year_EC),
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
