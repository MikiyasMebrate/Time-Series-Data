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
        )
    }
   
}

let hideLoadingSkeletonTopic = () =>{
    $("#loading-skeleton-topic").html('')
}

let showLoadingSkeleton = () => {
  for (let i = 0; i < 4; i++) {
    $("#loading-skeleton-category").append(`
        <div class="col-md-6 col-xxl-6 container loading-skeleton">
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
    $("#loading-skeleton-category").html('')
}

$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "/dashboard-api/topic_lists/",
    beforeSend: function () {
        showLoadingSkeletonTopic();
        showLoadingSkeleton()
      },          
      complete: function () {
        hideLoadingSkeletonTopic();
        hideLoadingSkeletonCategory()
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
                <div class="card social-widget-card bg-${
                  bootstrapColors[Math.floor(Math.random() * bootstrapColors.length)]}">
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

        sideNav += `  <li class="pc-item topic-card" data-id = ${
          item.id
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
            $("#category-title").html(buttonData.categoryName);

            data.categories.forEach((item) => {
              const valueItem = [];
              //Filter Indicator Value
              let value = data.values.filter(
                (value) =>
                  value.for_indicator_id ==
                  item.dashboard_category_indicator__id
              );
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

              //console.log(Number(value[value.length - 1].value))
              let calculatePercentageDifference,
                roundDifference,
                difference = null;
              try {
                calculatePercentageDifference =
                  ((value[value.length - 1].value -
                    value[value.length - 2].value) /
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
                    <div class="col-md-6 col-xxl-6">
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
                                                <a class="dropdown-item" href="#">Month</a>
                                                <a class="dropdown-item" href="#">Year</a>
                                                <button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModal" >Detail</button>
                                                </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-body p-3 mt-3 rounded" style="height: 190px;">
                                    <div class="mt-3 row align-items-center">
                                        <div class="col-7">
                                            <div id="all-earnings-graph${
                                              item.id
                                            }"></div>
                                            <div class="text-center pt-3">${
                                              item.dashboard_category_indicator__title_ENG
                                            }</div>
                                        </div>
                                        <div class="col-5">
                                            <h5 class="mb-1">${
                                              difference
                                                ? difference < 0
                                                  ? (
                                                      difference * -1
                                                    ).toLocaleString()
                                                  : difference.toLocaleString()
                                                : "None"
                                            }</h5>
                                            <h5 class="${
                                              roundDifference
                                                ? roundDifference > 0
                                                  ? "text-primary "
                                                  : "text-danger "
                                                : ""
                                            }" mb-0"><i  class="${
                roundDifference
                  ? roundDifference > 0
                    ? "ti ti-arrow-up-right text-primary "
                    : "ti ti-arrow-down-left text-danger "
                  : "None"
              }"></i> ${
                roundDifference
                  ? (roundDifference > 0
                      ? roundDifference
                      : roundDifference * -1) + "%"
                  : "None"
              }</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    `;

              $("#category-card-list").append(categoryCard);
              renderCategoryGraph(item.id, valueItem, [2000]);
            });
          },
        });
      });
    },
  });

        //Default
        $("#category-card-list").html("");
        $.ajax({
          type: "GET",
          url: `/dashboard-api/category_list/2`,
          beforeSend: function () {
              showLoadingSkeleton();
            },          
            complete: function () {
              hideLoadingSkeletonCategory();
            },
          success: function (data) {
            let categoryCard = ``;
            $("#category-title").html(
              data.categories[0].dashboard_topic__title_ENG
            );
  
            data.categories.forEach((item) => {
              const valueItem = [];
              let value = data.values.filter(
                (value) =>
                  value.for_indicator_id == item.dashboard_category_indicator__id
              );
              for (val of value) {
                valueItem.push([val.for_datapoint_id__year_EC, val.value]);
              }
  
              //console.log(Number(value[value.length - 1].value))
              let calculatePercentageDifference,
                roundDifference,
                difference = null;
              try {
                calculatePercentageDifference =
                  ((value[value.length - 1].value -
                    value[value.length - 2].value) /
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
                      <div class="col-md-6 col-xxl-6">
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
                                                  <a class="dropdown-item" href="#">Month</a>
                                                  <a class="dropdown-item" href="#">Year</a>
  
                                                  <button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModal" >Detail</button>
                                                  </div>
                                          </div>
                                      </div>
                                  </div>
                                  <div class="bg-body p-3 mt-3 rounded" style="height: 190px;">
                                      <div class="mt-3 row align-items-center">
                                          <div class="col-7">
                                              <div id="all-earnings-graph${
                                                item.id
                                              }"></div>
                                              <div class="text-center pt-3">${
                                                item.dashboard_category_indicator__title_ENG
                                              }</div>
                                          </div>
                                          <div class="col-5">
                                              <h5 class="mb-1">${
                                                difference
                                                  ? difference < 0
                                                    ? (
                                                        difference * -1
                                                      ).toLocaleString()
                                                    : difference.toLocaleString()
                                                  : "None"
                                              }</h5>
                                              <h5 class="${
                                                roundDifference
                                                  ? roundDifference > 0
                                                    ? "text-primary "
                                                    : "text-danger "
                                                  : ""
                                              }" mb-0"><i  class="${
                roundDifference
                  ? roundDifference > 0
                    ? "ti ti-arrow-up-right text-primary "
                    : "ti ti-arrow-down-left text-danger "
                  : "None"
              }"></i> ${
                roundDifference
                  ? (roundDifference > 0
                      ? roundDifference
                      : roundDifference * -1) + "%"
                  : "None"
              }</h5>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
  
                      `;
  
              $("#category-card-list").append(categoryCard);
              renderCategoryGraph(item.id, valueItem, [2000]);
            });
          },
        });


});

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
      `${
        bootstrapColorsCode[
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
