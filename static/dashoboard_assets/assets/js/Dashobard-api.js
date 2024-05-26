//Loading
let showLoadingSpinner = (div) => {
  $(`#${div}`).html(
    `
    <div class="text-center">
  <div class="spinner-grow text-success" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>
    `
  )
}


let hideLoadingSpinner = (div) =>{
  $(`#${div}`).html('')
}



let showLoadingSkeletonTopic = () => {
  for (let i = 0; i < 8; i++) {
    $("#loading-skeleton-topic").append(
      `
            <div class="col-md-6 col-xl-3 d-none d-md-block container loading-skeleton ">
               <div class="card social-widget-card">
                   <div class="card-body d-flex justify-content-between align-items-center p-2">
                    <div class="bg-body p-3 mt-3 rounded" style="height: 40px; width: 100%;">
                    </div>
                   </div>
               </div>
            </div>
            `
    );
  }
};

let hideLoadingSkeletonTopic = () => {
  $("#loading-skeleton-topic").html("");
};

let showLoadingSkeleton = () => {
  for (let i = 0; i < 6; i++) {
    $("#loading-skeleton-category").append(`
        <div class="col-md-4 col-xxl-4 container loading-skeleton">
            <div class="card" >
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <div class="flex-shrink-0">
                        </div>
                        <div class="flex-grow-1 ms-3" >
                            <h6 class="mb-0"></h6>
                        </div>
                    </div>
                    <div class="bg-body p-3 mt-3 rounded" style="height: 190px;">
                        <div class="mt-3 row align-items-center">
                            <div class="col-7">
                                <div id="all-earnings-graph"></div>
                                <div class="text-center pt-3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
  }
};

let hideLoadingSkeletonCategory = () => {
  $("#loading-skeleton-category").html("");
};


let renderCategoryGraph = (id, dataArray) => {
  const bootstrapColorsCode = [
    "#0d6efd",
    "#6610f2",
    "#6f42c1",
    "#d63384",
    "#dc3545",
    "#fd7e14",
    "#ffc107",
    "#198754",
    "#20c997",
    "#0dcaf0",
  ];

  const seriesData = dataArray.map((dataPoint) => {
    return {
      x: dataPoint[0], // Year
      y: dataPoint[1], // Value
    };
  });

  new ApexCharts(document.querySelector(`#all-earnings-graph${id}`), {
    chart: {
      type: "bar",
      height: 50,
      sparkline: {
        enabled: true,
      },
    },
    colors: [
      `${bootstrapColorsCode[
      Math.floor(Math.random() * bootstrapColorsCode.length)
      ]
      }`,
    ],
    plotOptions: {
      bar: {
        columnWidth: "80%",
      },
    },
    series: [
      {
        data: seriesData,
      },
    ],
    xaxis: {
      crosshairs: {
        width: 1,
      },
    },
    tooltip: {
      fixed: {
        enabled: true,
      },
      x: {
        show: true,
        formatter: function (val) {
          return `Year: ${val}`; // Access x value (year) directly
        },
      },
      y: {
        title: {
          formatter: function (e) {
            return "";
          },
        },
      },
      marker: {
        show: false,
      },
    },
  }).render();
};


let renderHalfPieChart = (data, html, max) => {
  Highcharts.chart(`${html}`, {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
    },
    title: {
        text: `Indicator<br>shares<br>${max}`,
        align: 'center',
        verticalAlign: 'middle',
        y: 60,
        style: {
            fontSize: '1.1em'
        }
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enabled: true,
                distance: -50,
                style: {
                    fontWeight: 'bold',
                    color: 'white'
                }
            },
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '75%'],
            size: '110%'
        }
    },
    series: [{
        type: 'pie',
        name: 'Indicators share',
        innerSize: '50%',
        data: data
    }]
});

}


let lineGraph = (graphData, min, html) => {
  Highcharts.chart(`${html}`, {
    chart: {
        type: 'area'
    },
    title: {
        text: 'Indicators Relation'
    },
    yAxis: {
        title: {
            text: 'Value'
        }
    },
    tooltip: {
        pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>' +
            'warheads in {point.x}'
    },
    plotOptions: {
        area: {
            pointStart: Number(min),
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
        }
    },
    series: graphData
  });
}

let barChart = (graphData, indicators) => {
  Highcharts.chart('barChart', {
    chart: {
        type: 'bar'
    },
    title: {
        text: `Last 3 Year's `,
        align: 'left'
    },
    xAxis: {
        categories: indicators,
        title: {
            text: null
        },
        gridLineWidth: 1,
        lineWidth: 0
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Values',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        },
        gridLineWidth: 0
    },
    tooltip: {
        valueSuffix: ' '
    },
    plotOptions: {
        bar: {
            borderRadius: '50%',
            dataLabels: {
                enabled: true
            },
            groupPadding: 0.1
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        shadow: true
    },
    credits: {
        enabled: false
    },
    series: graphData,
  });
}

let pieChart = (graphData, max) => {
  // Data retrieved from https://netmarketshare.com/
// Build the chart
Highcharts.chart('pieChart', {
  chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
  },
  title: {
      text: `Indicator shares in ${max}`,
      align: 'left'
  },
  tooltip: {
      pointFormat: '{series.name} <b>{point.percentage:.1f}%</b>'
  },
  accessibility: {
      point: {
          valueSuffix: '%'
      }
  },
  plotOptions: {
      pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
              enabled: false
          },
      }
  },
  series: [{
      name: 'Values',
      colorByPoint: true,
      data: graphData,
  }]
});

}

let fetchIndicatorDetail = () =>{
  $(".indicator-detail").click(function(){
    const buttonData = $(this).data()

      $("#analytics-tab-2")[0].click(); //Trigger to detail button clicked automatically 

   
  
    $.ajax({
      type: "GET",
      url: `/dashboard-api/indicator-detail/${buttonData.indicatorId}`,
      success: function(data){
        const graphData = []
        const dataValue = []
        const childData = []
        let min = data.values[0].for_datapoint_id__year_EC
        let max = data.values[data.values.length - 1].for_datapoint_id__year_EC

        table = `
        <div class="table-responsive">
        <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Indicator</th>
            
        `
        for (let i = min; i <= max; i++) {
          table += `<th scope="col">${i}</th>`
        }

        table += `
      </tr>
        </thead>
        <tbody>`

        let counter = 1
        let parentIndicator = data.indicators[0]

        table += `<tr>
        <th scope="row">${counter}</th>
        <td class="fw-bold">  ${parentIndicator.title_ENG}</td>
      `
      let values = data.values.filter((value) => value.for_indicator_id == parentIndicator.id)
      for (let value of values) {
        table += `<td>${value.value}</td>`
        dataValue.push(value.value)
      }

      graphData.push(
        {
          name: parentIndicator.title_ENG,
          data : dataValue
        }
      )

      table+=`</tr>`
       

        let filterChildIndicatorTable = (parent, space) =>{
          let spaceChild = space+"&nbsp;&nbsp;&nbsp;&nbsp;"

          let childLists = data.indicators.filter((children) => children.parent_id == parent.id )
          for(let child of  childLists){   
            if(child.parent_id == parent.id){
              counter++;
              table += `<tr>
              <th scope="row">${counter}</th>
              <td> ${space} ${child.title_ENG}</td>
            `
            let values = data.values.filter((value) => value.for_indicator_id == child.id)

            for (let value  of values) {
              table += `<td>${value.value}</td>`
            }

            childData.push(
              [child.title_ENG, values[values.length-1].value]
            )

            table+=`</tr>`
            filterChildIndicatorTable(child, spaceChild)
            }
          }
        }
        
        filterChildIndicatorTable(parentIndicator, "&nbsp;&nbsp;")

        table += `</tbody>
        </table>
      </div>
        `

      
        $('#indicator-detail-table').html(table)
        lineGraph(graphData, min, 'lineGraph-detail')

        if(childData.length > 0){
          $('#lineGraph-detail-parent-html').removeClass('col-12').addClass('col-md-6')
          renderHalfPieChart(childData, 'half-pie-chart-detail', max)
        }else{
          $('#lineGraph-detail-parent-html').removeClass('col-md-6').addClass('col-12')

          $('#half-pie-chart-detail').html('')
        }
       
      }
    })
  })
}

let monthGraph = (data_set) =>{

  (async () => {
    /**
     * Create the chart when all data is loaded
     * @return {undefined}
     */
    function createChart(series) {
      Highcharts.stockChart("monthChart", {
        rangeSelector: {
          selected: 4,
        },

        yAxis: {
          labels: {
            format: "{#if (gt value 0)}+{/if}{value}%",
          },
          plotLines: [
            {
              value: 0,
              width: 2,
              color: "silver",
            },
          ],
        },

        plotOptions: {
          series: {
            label: {
              connectorAllowed: false,
            },
          },
        },

        tooltip: {
          pointFormat:
            '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
          valueDecimals: 2,
          split: true,
        },

        series,
      });
    }
    createChart(data_set);
  })();

}

$(document).ready(function () {

  $.ajax({
    type: "GET",
    url: "/dashboard-api/topic_lists/",
    beforeSend: function () {
      showLoadingSkeletonTopic();
      showLoadingSkeleton();
    },
    complete: function () {
      hideLoadingSkeletonTopic();
    },
    success: function (data) {
      const bootstrapColors = [
        "primary",
        "secondary",
        "success",
        "warning",
        "info",
        "dark",
      ];

      let cardTopic = ``;
      let sideNav = ``;

      data.topics.forEach((item) => {
        cardTopic += `
        <!-- custom cards -->
             <div class="col-md-6 col-xl-3 d-none d-md-block topic-card"
             data-id = ${item.id}
             data-category-name = "${item.title_ENG}"
             >
                <div class="card social-widget-card bg-${bootstrapColors[
          Math.floor(Math.random() * bootstrapColors.length)
          ]
          }">
                    <div class="card-body d-flex justify-content-between align-items-center p-2">
                        <div class="d-flex flex-column">
                            <h3 class="text-white m-0">${Number(
            item.category_count
          )} +</h3>
                            <span class="m-t-10">${item.title_ENG}</span>
                        </div>
                        <i class="fa fa-${item.icon.split(",")[1]}"></i>

                    </div>
                </div>
            </div>`;

        sideNav += `  <li class="pc-item topic-card" data-id = ${item.id
          } data-category-name = "${item.title_ENG}">
            <a href="#" class="pc-link">
                <span class="pc-micon">
                    <i class="fa fa-${item.icon.split(",")[1]}"></i>
                </span>
                <span class="pc-mtext">${item.title_ENG}</span>   
                </a>
                
                
        </li>
        `;
      });

      $("#topic-card-lists").html(cardTopic);
      $("#sidebar-topic-list").html(sideNav);

      //Handel on Click topic card
      $(".topic-card").click(function () {
        $("#category-card-list").html("");
        const buttonData = $(this).data();
        $.ajax({
          type: "GET",
          url: `/dashboard-api/category_list/${buttonData.id}`,
          beforeSend: function () {
            showLoadingSkeleton();
          },
          complete: function () {
            hideLoadingSkeletonCategory();
          },
          success: function (data) {
            let categoryCard = ``;
            $("#category-title").html(data.categories[0].dashboard_topic__title_ENG);
      
            data.categories.forEach((item) => {
              const valueItem = [];
              let value = data.values.filter(
                (value) =>
                  value.for_indicator_id == item.indicator__id
              );
      
      
              let seasonType = value.length > 0 ? (value[0].for_indicator__type_of == "monthly" ? 'Month' : 'Year') : 'None'
      
              for (val of value) {
                if (String(val.for_indicator__type_of) == "monthly") {
                  valueItem.push([
                    val.for_datapoint_id__year_EC +
                    " - " +
                    val.for_month_id__month_AMH,
                    val.value,
                  ]);
                } else {
                  valueItem.push([val.for_datapoint_id__year_EC, val.value]);
                }
              }
      
      
              let calculatePercentageDifference,
                roundDifference,
                difference = null;
              try {
                calculatePercentageDifference =
                  ((value[value.length - 1].value - value[value.length - 2].value) /
                    value[value.length - 2].value) *
                  100;
                roundDifference =
                  Math.round(calculatePercentageDifference * 100) / 100;
                difference = (
                  value[value.length - 1].value - value[value.length - 2].value
                ).toFixed(2);
              } catch {
                null;
              }
      
              categoryCard = `
              <div class="col-md-6 col-xxl-4 col-12 ">
                  <div class="card" >
                      <div class="card-body">
                          <div class="d-flex align-items-center">
                              <div class="flex-shrink-0">
                                  <div class="avtar avtar-s  bg-light-primary">
                                      <svg  width="24" height="24"
                                          viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path opacity="0.4" d="M13 9H7" stroke="#4680FF" stroke-width="1.5"
                                              stroke-linecap="round" stroke-linejoin="round" />
                                          <path
                                              d="M22.0002 10.9702V13.0302C22.0002 13.5802 21.5602 14.0302 21.0002 14.0502H19.0402C17.9602 14.0502 16.9702 13.2602 16.8802 12.1802C16.8202 11.5502 17.0602 10.9602 17.4802 10.5502C17.8502 10.1702 18.3602 9.9502 18.9202 9.9502H21.0002C21.5602 9.9702 22.0002 10.4202 22.0002 10.9702Z"
                                              stroke="#4680FF" stroke-width="1.5" stroke-linecap="round"
                                              stroke-linejoin="round" />
                                          <path
                                              d="M17.48 10.55C17.06 10.96 16.82 11.55 16.88 12.18C16.97 13.26 17.96 14.05 19.04 14.05H21V15.5C21 18.5 19 20.5 16 20.5H7C4 20.5 2 18.5 2 15.5V8.5C2 5.78 3.64 3.88 6.19 3.56C6.45 3.52 6.72 3.5 7 3.5H16C16.26 3.5 16.51 3.50999 16.75 3.54999C19.33 3.84999 21 5.76 21 8.5V9.95001H18.92C18.36 9.95001 17.85 10.17 17.48 10.55Z"
                                              stroke="#4680FF" stroke-width="1.5" stroke-linecap="round"
                                              stroke-linejoin="round" />
                                      </svg>
                                      </div>
                              </div>
                              <div class="flex-grow-1 ms-3" >
                                  <h6 class="mb-0">${item.name_ENG}</h6>
                              </div>
                              <div class="flex-shrink-0 ms-3">
                                  <div class="dropdown"><a
                                          class="avtar avtar-s btn-link-primary dropdown-toggle arrow-none" href="#"
                                          data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i
                                              class="ti ti-dots-vertical f-18"></i></a>
                                      <div class="dropdown-menu dropdown-menu-end">
                                      ${seasonType == 'monthly' ? `
                                      <a class="dropdown-item" href="#">Month</a>
                                      <a class="dropdown-item" href="#">Year</a>
                                      ` : ''}
                                         
                                          <button data-id="${item.id}"  data-type-of = "${item.indicator__type_of}" class=" detail-category  detail-category dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModal" > <svg class="pc-icon"> <use xlink:href="#custom-flash"></use></svg> Detail</button>
                                          </div>
                                  </div>
                              </div>
                          </div>
                          <div class="bg-body p-3 mt-3 rounded" style="height: 190px;">
                              <div class="mt-3 row align-items-center">
                                  <div class="col-7">
                                      <div id="all-earnings-graph${item.indicator__id}"></div>
                                      <div class="text-center pt-3">${item.indicator__title_ENG}</div>
                                  </div>
                                  <div class="col-5">
                                      <h5 class="mb-1">Last ${seasonType}: ${difference ? difference < 0 ? ( difference * -1 ).toLocaleString() : difference.toLocaleString() : "0" }</h5>
                                      <h5 class="text-primary" mb-0">
                                      <svg  class="text-primary" xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-dot" viewBox="0 0 16 16">
                                      <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                                      </svg>
                                       ${roundDifference ? (roundDifference > 0 ? roundDifference : roundDifference * -1) + "%" : "0"}</h5>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              `;
      
              $("#category-card-list").append(categoryCard);
              renderCategoryGraph(item.indicator__id, valueItem);
            });
            handelCategoryDetail() //Call handle on category detail
          },
        });
      });
    },
  });

  //Default 
  $("#category-card-list").html("");
  $.ajax({
    type: "GET",
    url: `/dashboard-api/category_list/3`,
    beforeSend: function () {
      showLoadingSkeleton();
    },
    complete: function () {
      hideLoadingSkeletonCategory();
    },
    success: function (data) {
      let categoryCard = ``;
      $("#category-title").html(data.categories[0].dashboard_topic__title_ENG);

      data.categories.forEach((item) => {
        const valueItem = [];
        let value = data.values.filter(
          (value) =>
            value.for_indicator_id == item.indicator__id
        );


        let seasonType = value.length > 0 ? (value[0].for_indicator__type_of == "monthly" ? 'Month' : 'Year') : 'None'

        for (val of value) {
          if (String(val.for_indicator__type_of) == "monthly") {
            valueItem.push([
              val.for_datapoint_id__year_EC +
              " - " +
              val.for_month_id__month_AMH,
              val.value,
            ]);
          } else {
            valueItem.push([val.for_datapoint_id__year_EC, val.value]);
          }
        }



        let calculatePercentageDifference,
          roundDifference,
          difference = null;
        try {
          calculatePercentageDifference =
            ((value[value.length - 1].value - value[value.length - 2].value) /
              value[value.length - 2].value) *
            100;
          roundDifference =
            Math.round(calculatePercentageDifference * 100) / 100;
          difference = (
            value[value.length - 1].value - value[value.length - 2].value
          ).toFixed(2);
        } catch {
          null;
        }

        categoryCard = `
                      <div class="col-md-6 col-xxl-4 col-12 ">
                          <div class="card" >
                              <div class="card-body">
                                  <div class="d-flex align-items-center">
                                      <div class="flex-shrink-0">
                                          <div class="avtar avtar-s  bg-light-primary">
                                              <svg  width="24" height="24"
                                                  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                  <path opacity="0.4" d="M13 9H7" stroke="#4680FF" stroke-width="1.5"
                                                      stroke-linecap="round" stroke-linejoin="round" />
                                                  <path
                                                      d="M22.0002 10.9702V13.0302C22.0002 13.5802 21.5602 14.0302 21.0002 14.0502H19.0402C17.9602 14.0502 16.9702 13.2602 16.8802 12.1802C16.8202 11.5502 17.0602 10.9602 17.4802 10.5502C17.8502 10.1702 18.3602 9.9502 18.9202 9.9502H21.0002C21.5602 9.9702 22.0002 10.4202 22.0002 10.9702Z"
                                                      stroke="#4680FF" stroke-width="1.5" stroke-linecap="round"
                                                      stroke-linejoin="round" />
                                                  <path
                                                      d="M17.48 10.55C17.06 10.96 16.82 11.55 16.88 12.18C16.97 13.26 17.96 14.05 19.04 14.05H21V15.5C21 18.5 19 20.5 16 20.5H7C4 20.5 2 18.5 2 15.5V8.5C2 5.78 3.64 3.88 6.19 3.56C6.45 3.52 6.72 3.5 7 3.5H16C16.26 3.5 16.51 3.50999 16.75 3.54999C19.33 3.84999 21 5.76 21 8.5V9.95001H18.92C18.36 9.95001 17.85 10.17 17.48 10.55Z"
                                                      stroke="#4680FF" stroke-width="1.5" stroke-linecap="round"
                                                      stroke-linejoin="round" />
                                              </svg>
                                              </div>
                                      </div>
                                      <div class="flex-grow-1 ms-3" >
                                          <h6 class="mb-0">${item.name_ENG}</h6>
                                      </div>
                                      <div class="flex-shrink-0 ms-3">
                                          <div class="dropdown"><a
                                                  class="avtar avtar-s btn-link-primary dropdown-toggle arrow-none" href="#"
                                                  data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i
                                                      class="ti ti-dots-vertical f-18"></i></a>
                                              <div class="dropdown-menu dropdown-menu-end">
                                              ${seasonType == 'monthly' ? `
                                              <a class="dropdown-item" href="#">Month</a>
                                              <a class="dropdown-item" href="#">Year</a>
                                              ` : ''}
                                                 
                                                  <button data-id="${item.id}"  data-type-of = "${item.indicator__type_of}" class=" detail-category  detail-category dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModal" > <svg class="pc-icon"> <use xlink:href="#custom-flash"></use></svg> Detail</button>
                                                  </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div class="bg-body p-3 mt-3 rounded" style="height: 190px;">
                                      <div class="mt-3 row align-items-center">
                                          <div class="col-7">
                                              <div id="all-earnings-graph${item.indicator__id}"></div>
                                              <div class="text-center pt-3">${item.indicator__title_ENG}</div>
                                          </div>
                                          <div class="col-5">
                                              <h5 class="mb-1">Last ${seasonType}: ${difference ? difference < 0 ? ( difference * -1 ).toLocaleString() : difference.toLocaleString() : "0" }</h5>
                                              <h5 class="text-primary" mb-0">
                                              <svg  class="text-primary" xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-dot" viewBox="0 0 16 16">
                                              <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                                              </svg>
                                               ${roundDifference ? (roundDifference > 0 ? roundDifference : roundDifference * -1) + "%" : "0"}</h5>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
  
                      `;

        $("#category-card-list").append(categoryCard);
        renderCategoryGraph(item.indicator__id, valueItem);
      });
      handelCategoryDetail() //Call handle on category detail
    },
  });


  //Handel onclick category detail
  let handelCategoryDetail = () => {
    $(".detail-category").click(function () {
      let buttonData = $(this).data();
     
      $.ajax({
        url: `/dashboard-api/category_detail_list/${buttonData.id}`,
        beforeSend: function () {
          showLoadingSpinner('spinnerLoading')
          $("#analytics-tab-1")[0].click();
          $("#monthChart").hide()
          $("#analytics-tab-2").hide()
          $("#indicator-detail-table").hide()
          $("#category-detail-chart-lists").hide()
          $("#analytics-tab-2").hide()
          $("#indicator-detail-table").hide()
          $("#category-detail-chart-lists").hide()
          $('#category-detail-table').hide()
        },
        complete: function () {
          hideLoadingSpinner('spinnerLoading')
          $('#category-detail-table').show()
        },
        success: function (data) {
          data.year = data.year.sort()
          let min = data.year[0]
          let max = data.year[data.year.length - 1]

          if(buttonData.typeOf == 'yearly'){
            const graphData = []
            const barChartData = []
            const pieChartData = []
  
            
  
  
            table = `
            <div class="table-responsive">
            <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Indicator</th>
                
            `
            for (let i = min; i <= max; i++) {
              table += `<th scope="col">${i}</th>`
            }
  
            table += `
          <th scope="col">Action</th>    
          </tr>
            </thead>
            <tbody>`
            let counter = 1
            const dataValueChart1 = []
            const dataValueChart2 = []
            const dataValueChart3 = []
  
            const indicatorName = []
  
            data.indicators.forEach((item) => {
              indicatorName.push(item.title_ENG)
  
              let values = data.values.filter((value) => value.for_indicator_id == item.id)
  
  
  
  
              table += `<tr>
                 <th scope="row">${counter}</th>
                  <td>${item.title_ENG}</td>
                 `
              const dataValue = []
              
  
              for (let yr = min; yr <= max; yr++) {
                let checkedYear = false

                let yearValue = values.find((item) => item.for_datapoint_id__year_EC == yr)

                  if(yearValue){
                    checkedYear = true
                    table += `<td>${yearValue.value}</td>`
                    dataValue.push(yearValue.value)
                  }
              
              if(checkedYear  == false ){
                dataValue.push(0)
                table += `<td> - </td>`
              }
            }
              
              table+=`
              <td> <button data-indicator-id = ${item.id} class="btn btn-sm btn-primary indicator-detail" ><i class="bi bi-eye"></i></button> </td>
              </tr>`
             
  
              graphData.push(
                {
                  name: item.title_ENG,
                  data : dataValue
                }
              )
  
              dataValueChart1.push(dataValue[dataValue.length -  1])
              dataValueChart2.push(dataValue[dataValue.length -  2])
              dataValueChart3.push(dataValue[dataValue.length -  3])
  
              pieChartData.push({
                name: item.title_ENG,
                y : dataValue[dataValue.length -  1]
              })
            
  
              counter++;
            
            })
  
            barChartData.push(
              {
                name: `Year ${max}`,
                data: dataValueChart1,
              }
            )
            barChartData.push(
              {
                name: `Year ${max-1}`,
                data: dataValueChart2,
              }
            )
            barChartData.push(
              {
                name: `Year ${max-2}`,
                data: dataValueChart3,
              }
            )
  
          
  
  
            table += `</tbody>
                </table>
              </div>
                `
            $("#analytics-tab-1")[0].click();
            $("#monthChart").hide()
            $('#category-detail-table').html(table)
            $("#analytics-tab-2").show()
            $("#indicator-detail-table").show()
            $("#category-detail-chart-lists").show()
            lineGraph(graphData, min, 'lineGraph')
            barChart(barChartData,indicatorName)
            pieChart(pieChartData, max)
            fetchIndicatorDetail()
          }
          else if (buttonData.typeOf == 'monthly'){
            let data_set = []

            table = `
            <div class="table-responsive">
            <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Year</th>
                <th scope="col">Month</th>
            `

            let counter = 1;
            for(indicator of data.indicators){
              table += `<th scope="col">${indicator.title_ENG}</th>`
            }

            table += `
          </tr>
            </thead>
            <tbody>`

            //For table creation
            for (let i = min; i <= max; i++) {
              let yearPrint = false
              

              for(let month of data.months){
                table += `
                <tr>`
                if(!yearPrint){
                  table += `
                  <th scope="col">${counter}</th>
                  <td class="fw-bold">${i}</td>
                  `
                  counter++;
                }else{
                  table += `
                  <th scope="col"></th>
                  <td> </td>
                  `
                }

                table+=`
                <td>${month.month_AMH}</td>
                `
              
                yearPrint = true


                for(indicator of data.indicators){
                   let value = data.values.find((value) => value.for_datapoint_id__year_EC == i && value.for_month_id__number == month.number && value.for_indicator_id == indicator.id)
                   if(value){
                      table+=` <td>${value.value}</td>`
                   }else{
                    table+=` <td> - </td>`
                   }
                }

                
                table+= `
                </tr>
                `
              }
              
            }


            //for chart
            let arr = [];
            for(indicator of data.indicators){
              for(let year=min; year<=max; year++){
                for(month of data.months){
                  let value = data.values.find((value) => value.for_datapoint_id__year_EC == year && value.for_month_id__number == month.number && value.for_indicator_id == indicator.id)
                  if(value){
                    arr.push([Date.UTC(parseInt(year), parseInt(month.number), 1), (value.value)]);
                  }
                }
              }
              data_set.push({'name' : indicator.title_ENG, 'data' : arr})
              arr = []
            }

            console.log(data_set)


  
  

            table += `</tbody>
                  </table>
                </div>
                  `


            monthGraph(data_set)
            $("#monthChart").show()
            $("#analytics-tab-1")[0].click();
            $("#analytics-tab-2").hide()
            $("#indicator-detail-table").hide()
            $("#category-detail-chart-lists").hide()
            $('#category-detail-table').html(table)
            

            
            
          }

          


        }

      })
    })
  }
  
});





