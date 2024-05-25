$(document).ready(function () {
    $.ajax({
      url: "/dashboard-api/pie_chart_data",
      type: "GET",
  
      success: function (dataMain) {
        let data = [
          {
            id: "0.0",
            parent: "",
            name: "National Topic",
          },
        ];
  
        // Assign topics with their corresponding parent
  for (const topic of dataMain.topics) {
      const newObj = {
        id: `1.${topic.id}`,
        parent: '0.0',
        name: topic.title_ENG,
      };
      data.push(newObj);
    }
    
    // Assign categories with their corresponding parent
    for (const category of dataMain.category) {
      const newObj = {
        id: `2.${category.id}`,
        parent: `1.${category.dashboard_topic__id}`,
        name: category.name_ENG,
      };
      data.push(newObj);
    }
    
    // Assign indicators with their corresponding parent
    for (const indicator of dataMain.indicators) {
      const newObj = {
        id: `3.${indicator.id}`,
        parent: `2.${indicator.for_category__id}`,
        name: indicator.title_ENG,
        value: indicator.indicator_value__value
      };
      data.push(newObj);
    }


    Highcharts.chart('bigPieChart', {

      chart: {
          height: '100%'
      },
  
      // Let the center circle be transparent
      colors: ['transparent'].concat(Highcharts.getOptions().colors),
  
      title: {
          text: 'National Topic'
      },
  
      series: [{
          type: 'sunburst',
          data: data,
          name: 'National Level',
          allowDrillToNode: true,
          borderRadius: 3,
          cursor: 'pointer',
          dataLabels: {
              format: '{point.name}',
              filter: {
                  property: 'innerArcLength',
                  operator: '>',
                  value: 16
              }
          },
          levels: [{
              level: 1,
              levelIsConstant: false,
              dataLabels: {
                  filter: {
                      property: 'outerArcLength',
                      operator: '>',
                      value: 64
                  }
              }
          }, {
              level: 2,
              colorByPoint: true
          },
          {
              level: 3,
              colorVariation: {
                  key: 'brightness',
                  to: -0.5
              }
          }, {
              level: 4,
              colorVariation: {
                  key: 'brightness',
                  to: 0.5
              }
          }]
  
      }],
  
      tooltip: {
          headerFormat: '',
          pointFormat: '<b>{point.name}</b> is <b>' +
              '{point.value}</b>'
      }
  });
    

      },
      error: function (xhr, status, error) {
        console.error("AJAX request failed:", error);
      },
    });
  });
  


  