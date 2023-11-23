
let catargoryCount = 0;
let catargorySelected = 0;
let databaseCount = 0;
let databaseSelected = 0;
let indicatorcount = 0;
let indicatorSelected = 0;
let yearSelected = 0;
let isdatatable = 0;
let yearcount = 0;

function updateFilterSelection() {
  var isFilterSelected = true;
  var applyButtonExists = $('#applyButton').length > 0;

  // Check if at least one filter submenu is selected from each filter option
  $('.accordion .accordion-item').each(function () {
    var filterOption = $(this);
    var filterOptionName = filterOption.find('strong').text();
    var filterSubmenu = filterOption.find('.filter-submenu');

    // Check if at least one checkbox or radio button is checked in the filter submenu
    var filterOptionSelection = $('#filterSelections .filter-option-selection:contains("' + filterOptionName + '")');
    var filterOptionCheckmark = filterOptionSelection.find('.filter-option-checkmark');
    if (filterSubmenu.find('input[type="checkbox"]:checked').length === 0 && filterSubmenu.find('input[type="radio"]:checked').length === 0) {
      // Remove the checkmark on the card
      filterOptionCheckmark.removeClass('bi bi-check check');
      isFilterSelected = false;
    } else {
      // Add the checkmark on the card
      filterOptionCheckmark.addClass('bi bi-check check');
    }
  });

  // Create and append new apply button to the #button div if all filters are selected and the button doesn't exist
  if (isFilterSelected && !applyButtonExists) {
    var applyButton = $('<button>').attr('id', 'applyButton').addClass('btn btn-info text-white mt-3').text('Apply');
    $('#button').append(applyButton);
  }

  // Remove the apply button from the #button div if not all filters are selected and the button exists
  if (!isFilterSelected && applyButtonExists) {
    $('#applyButton').remove();
  }

  // Reset counts to zero
  indicatorcount = 0;
  yearcount = 0;

  // Update the counts based on the selected filter submenu items
  indicatorcount = $('input[name="indicator_lists"]:checked').length;
  yearcount = $('input[name="yearListsCheckBox"]:checked').length;

  // Update the UI or perform any other actions based on the counts
  // Only update if the length is greater than 0 and the count has changed
  if ($('input[name="category_lists"]:checked').length == 0) {
    document.getElementById('seriesAvailableBadge').innerHTML = 0;
    document.getElementById('yearAvailableBadge').innerHTML = 0;
  }


  // Store the previous counts
  const prevCatargoryCount = catargorySelected;
  const prevDatabaseCount = databaseSelected;
  const prevIndicatorCount = indicatorSelected;
  const prevYearCount = yearSelected;

  // Reset counts to zero
  catargorySelected = 0;
  databaseSelected = 0;
  indicatorSelected = 0;
  yearSelected = 0;

  // Update the counts based on the selected filter submenu items
  catargorySelected = $('input[name="category_lists"]:checked').length;
  databaseSelected = $('input[name="topic_lists"]:checked').length;
  indicatorSelected = $('input[name="indicator_lists"]:checked').length;
  yearSelected = $('input[name="yearListsCheckBox"]:checked').length;

  // Update the UI or perform any other actions based on the counts
  // Only update if the length is greater than 0 and the count has changed
  if (prevCatargoryCount !== catargorySelected || catargorySelected > 0) {
    document.getElementById('categorySelectedBadge').innerHTML = catargorySelected;
  }

  if (prevDatabaseCount !== databaseSelected || databaseSelected > 0) {
    document.getElementById('databaseSelectedBadge').innerHTML = databaseSelected;
  }

  if (prevIndicatorCount !== indicatorSelected || indicatorSelected > 0) {
    document.getElementById('seriesSelectedBadge').innerHTML = indicatorSelected;
  }

  if (prevYearCount !== yearSelected || yearSelected > 0) {
    document.getElementById('yearSelectedBadge').innerHTML = yearSelected;
  }
}


//make datatable
$(function () {
  $('#table').DataTable({
    "paging": true,
    "lengthChange": false,
    "searching": false,
    "ordering": true,
    "info": true,
    "autoWidth": false,
    "responsive": true,
  });
});


function filterData() {
  $.ajax({
    url: "/user-admin/json/",
    type: "GET",
    dataType: "json",
    success: function (data) {
      // Process topics
      databaseCount = 0;
      var selectTopic = data.topics.map(function (topic) {
        if(topic.is_deleted === false){
        databaseCount += 1;
        return '<div class="filter-submenu flex-grow-2">' +
          '  <input type="radio" value="' + topic.id + '" name="topic_lists" id="topic_list' + topic.id + '">' +
          '  <label for="topic_list' + topic.id + '" style="font-size: small;" class="mb-0">' + topic.title_ENG + ' - ' + topic.title_AMH + '</label>' +
          '</div>';
        }
      }).join('');
      

      $('#topic_list_filter').html(selectTopic);
      
      document.getElementById('databaseAvailableBadge').innerHTML = databaseCount
      $('input[name="topic_lists"]').on('change', function (event) {
        var selectedTopicId = event.target.value;

        // Process categories
        catargoryCount = 0;
        var selectCategory = data.categories.map(function (category) {
          if (String(category.topics[0].id) === String(selectedTopicId) && category.is_deleted === false) {
            catargoryCount += 1;
            return '<div class="filter-submenu">' +
              '  <input type="radio" value="' + category.id + '" name="category_lists" id="category_list' + category.id + '">' +
              '  <label class="form-label" for="category_list' + category.id + '" style="font-size: small;">' + category.name_ENG + ' - ' + category.name_AMH + '</label>' +
              '</div>';
          }
          return '';
        }).join('');
        document.getElementById('categoryAvailableBadge').innerHTML = catargoryCount
        $(document).on('change', '.filter-submenu input[type="checkbox"], .filter-submenu input[type="radio"]', function () {
          updateFilterSelection();
        });
        document.getElementById('indicator_list_filter').innerHTML = ' <p class="text-danger">Please Select Category</p>'
        document.getElementById('Year_list_filter').innerHTML = ' <p class="text-danger">Please Select Indicator</p>'
        $('#category_list_filter').html(selectCategory);

        $('input[name="category_lists"]').on('change', function (eventCategory) {
          var selectedCategoryId = eventCategory.target.value;
          // Process indicators
          var selectIndicator = data.indicators.map(function (indicator) {
            if (String(indicator.for_category_id) === String(selectedCategoryId) && indicator.is_deleted == false) {
              indicatorcount += 1;
              var title_amharic = indicator.title_AMH ? ' - ' + indicator.title_AMH : '';
              return '<div class="filter-submenu">' +
                '  <input type="checkbox" value="' + indicator.id + '" name="indicator_lists" id="indicator_list' + indicator.id + '">' +
                '  <label class="form-label" for="indicator_list' + indicator.id + '" style="font-size: small;">' + indicator.title_ENG + title_amharic + '</label>' +
                '</div>';
            }
            return '';
          }).join('');

          var selectAll = '<div class="filter-submenu d-flex">' +
            '  <input class="form-check" type="checkbox" id="select_all">' +
            '  <label class="form-label pl-1" for="select_all" style="font-size: small;">Select All</label>' +
            '</div>';
          if ($('input[name="category_lists"]:checked').length > 0) {
            document.getElementById('seriesAvailableBadge').innerHTML = indicatorcount
          } else {
            document.getElementById('seriesAvailableBadge').innerHTML = 0;
          }
          $(document).on('change', '.filter-submenu input[type="checkbox"], .filter-submenu input[type="radio"]', function () {
            updateFilterSelection();
          });

          document.getElementById('indicator_list_filter').innerHTML = ' <p class="text-danger">Please Select Category</p>'
          document.getElementById('Year_list_filter').innerHTML = ' <p class="text-danger">Please Select Indicator</p>'
          $('#indicator_list_filter').html(selectAll + selectIndicator);


          // Attach event handler for 'Select All' for indicators
          $('#select_all').change(function () {
            var checkedStatus = this.checked;
            $('input[name="indicator_lists"]').each(function () {
              $(this).prop('checked', checkedStatus);
            });
          });

          $(document).on('change', '.filter-submenu input[type="checkbox"], .filter-submenu input[type="radio"]', function () {
            updateFilterSelection();
            if (indicatorSelected > 0) {
              document.getElementById('yearAvailableBadge').innerHTML = data.year.length;
            } else {
              document.getElementById('yearAvailableBadge').innerHTML = 0;
            }
          });


          let yearTableList = [];
          let yearList = () => {
            //Year list
            let selectYear = data.year.map(
              ({ id, year_EC, year_GC, is_interval }) => {
                if (!is_interval) {
                  return '<div class="filter-submenu">' +
                    '  <input type="checkbox" value="' + id + '" name="yearListsCheckBox" id="yearList' + id + '">' +
                    '  <label for="yearList' + id + '" style="font-size: small;">' + year_EC + ' E.C - ' + year_GC + ' G.C</label>' +
                    '</div>';
                }
              }
            );

            var selectYearAll = '<div class="filter-submenu d-flex">' +
              '  <input class="form-check" type="checkbox" id="select_all_year_filter">' +
              '  <label class="form-label pl-1" for="select_all_year_filter" style="font-size: small;"> Select All</label>' +
              '</div>';

            var viewRecentYear = '<p class="m-0 mb-1 fw-bold">View Recent Year</p>' +
              '<div class="filter-submenu mb-2">' +
              '  <button class="ms-1 btn btn-outline-primary text-primary bg-white" id="last_5_year">5</button>' +
              '  <button class="ms-1 btn btn-outline-primary text-primary bg-white" id="last_10_year">10</button>' +
              '  <button class="ms-1 btn btn-outline-primary text-primary bg-white" id="last_15_year">15</button>' +
              '  <button class="ms-1 btn btn-outline-primary text-primary bg-white" id="last_20_year">20</button>' +
              '</div>';

            let yearHtml = document.getElementById("Year_list_filter");
            yearHtml.innerHTML =
              viewRecentYear + selectYearAll + selectYear.join("");

            let selectAllYear = document.getElementById(
              "select_all_year_filter"
            );

            selectAllYear.addEventListener("change", () => {
              let yearListCheckAll =
                document.getElementsByName("yearListsCheckBox");
              if (selectAllYear.checked) {
                yearListCheckAll.forEach((eventYear) => {
                  eventYear.checked = true;

                  yearTableList = data.year.map(
                    ({ id, year_EC, year_GC, is_interval }) => {
                      if (!is_interval) {
                        return [id, year_EC, year_GC];
                      }
                    }
                  );
                });

              } else {
                yearListCheckAll.forEach((eventYear) => {
                  eventYear.checked = false;

                  yearTableList = [];
                });
              }
            });

            $('#last_5_year, #last_10_year, #last_15_year, #last_20_year').click(function () {
              var yearsToShow = parseInt($(this).text(), 10);
              $('input[name="yearListsCheckBox"]').prop('checked', false); // Uncheck all first
              $('input[name="yearListsCheckBox"]:lt(' + yearsToShow + ')').prop('checked', true); // Check the first N checkboxes

              // Trigger change event for year checkboxes
              $('input[name="yearListsCheckBox"]').trigger('change');
              // Construct or update yearTableList based on checked years
              yearTableList = [];
              $('input[name="yearListsCheckBox"]:checked').each(function () {
                var yearId = $(this).val();
                var yearData = data.year.find(y => y.id.toString() === yearId);
                if (yearData && !yearData.is_interval) {
                  yearTableList.push([yearData.id, yearData.year_EC, yearData.year_GC]);
                }
              });
            });
          };
          //Select-all Button for Indicator
          let selectAllIndicator = document.getElementById("select_all");
          let selectedIndictorId = [];
          selectAllIndicator.addEventListener("change", () => {

            let indicatorListCheckAll =
              document.getElementsByName("indicator_lists");

            if (selectAllIndicator.checked) {
              indicatorListCheckAll.forEach((event) => {
                event.checked = true;
                if (!selectedIndictorId.includes(event.value)) {
                  selectedIndictorId.push(event.value);
                }
                //Active apply Button
                yearList();
              });
            } else {
              indicatorListCheckAll.forEach((event) => {
                event.checked = false;
                try {
                  selectedIndictorId.pop(event.value);
                } catch {
                  null;
                }
              });
            }
          });

          //indicator list HTML
          let indicatorHtmlList =
            document.getElementsByName("indicator_lists");

          //Display Indicator into Table

          //Push selected Indicator
          indicatorHtmlList.forEach((indicatorCheckBox) => {
            indicatorCheckBox.addEventListener(
              "change",
              (eventIndicator) => {
                if (
                  eventIndicator.target.checked &&
                  !selectedIndictorId.includes(eventIndicator.target.value)
                ) {
                  selectedIndictorId.push(eventIndicator.target.value);
                } else {
                  try {
                    selectedIndictorId.pop(eventIndicator.target.value);
                  } catch {
                    null;
                  }
                }
                yearList();
              }
            );
          });

          //Display Data with Apply Button
          $('#button').on('click', '#applyButton', function () {
            // Hide filter selection card
            $(".card").hide();

            // Show data display section
            $("#dataDisplay").show();
            // Show table
            $("#table-container").show();
            $("#table_card").show();

            // Hide chart
            $("#chart").hide();
            $("#map").hide();
            $("#display_chart").hide();

            let table = "";
            table += `
                  <table id="newTable" class="table table-bordered m-0 p-0">
                  <thead>
                    <tr>
                      <th class="ps-5 pe-5">Name</th>`;
            for (let i of yearTableList) {
              table += `<th style="font-size: small;">${i[1]}-E.C </br>${i[2]}<span>-G.C</span></th>`;
            }

            table += `</tr>
                             </thead>
                        <tbody>
                  `;

            selectIndicator = data.indicators.map(({ title_ENG, title_AMH, id, for_category_id, is_deleted }) => {
              if (String(for_category_id) === String(selectedCategoryId) && selectedIndictorId.includes(String(id)) && is_deleted === false) {
                let title_amharic = "";
                if (!title_AMH === null)
                  title_amharic = " - " + title_AMH;

                //Table Row Start
                table += `
                      <tr>
                        <td>
                            <div class="row">
                               <div class="col-10">
                                 <a href="/user-admin/data-list-detail/${id}" style="font-size: small;" class="d-block fw-bold text-dark">${title_ENG} ${title_amharic}</a>
                               </div>
                            </div>
                        </td>`;

                for (j of yearTableList) {
                  let statusData = false;
                  for (k of data.value) {
                    if (
                      String(j[0]) === String(k.for_datapoint_id) &&
                      String(id) === String(k.for_indicator_id)
                    ) {
                      table += `<td>${k.value}</td>`;
                      statusData = false;
                      break;
                    } else {
                      statusData = true;
                    }
                  }
                  if (statusData) {
                    table += `<td> - </td>`;
                  }
                }

                table += `</tr>`;

                //Table Row End

                let table_child_list = (parent, title_ENG, space) => {
                  space += String("&nbsp;&nbsp;&nbsp;&nbsp");
                  let status = false;

                  for (i of data.indicators) {
                    if (String(i.parent_id) === String(parent) && i.is_deleted == false) {
                      status = true;
                      //Table Row Start
                      table += `
                      <tr>
                        <td>
                          <a>
                            <h6 class="mb-1">
                              <a style="font-size: small;" class="d-block text-dark fw-normal ps-2 ">${space} ${i.title_ENG} </a>
                            </h6>
                          </a>
                        </td>`;

                      for (j of yearTableList) {
                        let statusData = false;
                        for (k of data.value) {
                          if (
                            String(j[0]) === String(k.for_datapoint_id) &&
                            String(i.id) === String(k.for_indicator_id)
                          ) {
                            table += `<td>${k.value}</td>`;
                            statusData = false;
                            break;
                          } else {
                            statusData = true;
                          }
                        }
                        if (statusData) {
                          table += `<td> - </td>`;
                        }
                      }

                      table += `</tr>`;

                      //Table Row End

                      //child.push(`<option value=${i.id}> ${space} ${i.title_ENG} ${i.title_AMH} </option>`)
                      table_child_list(i.id, i.title_ENG, String(space));
                    }
                  }
                  return status;
                };

                //Child Lists
                for (let indicator of data.indicators) {
                  if (String(indicator.parent_id) == String(id) && indicator.is_deleted == false) {
                    test = true;
                    //li.push(`<optgroup label="${title_ENG}">`)

                    //Table Row Start
                    table += `
                    <tr>
                      <td>
                        <a>
                          <h6 class="mb-1">
                            <a style="font-size: small;" class="d-block text-dark  fw-normal"> &nbsp;&nbsp; ${indicator.title_ENG}  </a>
                          </h6>
                        </a>
                      </td>`;

                    for (j of yearTableList) {
                      let statusData = false;
                      for (k of data.value) {
                        if (
                          String(j[0]) === String(k.for_datapoint_id) &&
                          String(indicator.id) ===
                          String(k.for_indicator_id)
                        ) {
                          table += `<td>${k.value}</td>`;
                          statusData = false;
                          break;
                        } else {
                          statusData = true;
                        }
                      }
                      if (statusData) {
                        table += `<td> - </td>`;
                      }
                    }

                    table += `</tr>`;

                    //Table Row End

                    //li.push(`<option value=${indicator.id}>${indicator.title_ENG} ${indicator.title_AMH} </option>`)
                    table_child_list(
                      indicator.id,
                      indicator.title_ENG,
                      " "
                    );
                    //li.push(child)
                    // li.push('</optgroup>')
                  }
                }
                return null;
              }
            }
            );

            table += `</tbody>
                  </table>`;

            let dataListViewTable =
              document.getElementById("list_table_view");
            dataListViewTable.innerHTML = table;
            table = "";

            $(document).ready(function () {
              $("#newTable").DataTable({
                retrieve: true,
                ordering: false,
                scrollX: true,
                responsive: true,
                paging: true,
                searching: true,
                orderNumber: true,
                lengthMenu: [
                  [10, 25, 50, -1],
                  ["10 rows", "25 rows", "50 rows", "Show all"],
                ],
                columnDefs: [
                  { width: "100%" },
                  { width: "250px", targets: 0 },
                ],
                dom: "Bfrtip",
                buttons: ["pageLength", "excel", "csv", "pdf", "print"],
              });
            });
          });
          //End Indicator table

        });
      });
      // ... the rest of your code for setting up years and handling 'Select All' logic ...
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('Error fetching data: ' + textStatus, errorThrown);
    }
  });
}

$(document).ready(function () {

  filterData();

  // Initialize the filter selection card
  jQuery(document).on('change', '.filter-submenu input[type="checkbox"], .filter-submenu input[type="radio"]', function () {
    $(".card").show();
    // Hide data display section by default
    $(".data-display").hide();

    updateFilterSelection();
  });

  $(".card").show();
  // Hide data display section by default
  $(".data-display").hide();



  //collpase button 
  $("#toggleButton").click(function () {
    $("#filterColumn").toggleClass("d-none");
    $("#dataColumn").toggleClass("col-md-8 col-lg-12");
  });
  //make the first button in display-option div display table when clicked
  $("#displayOptions a:nth-child(1)").click(function () {
    // Show table
    $(".data-display #table-container").show();
    $("#display_chart").hide();

    // Hide chart
    $(".data-display #chart").hide();
    $(".data-display #map").hide();

    // Set table button active
    $("#displayOptions a:nth-child(1)").addClass("active");
    $("#displayOptions a:nth-child(2)").removeClass("active");
    $("#displayOptions a:nth-child(3)").removeClass("active");
  });

  //make the second button in display-option div display chart when clicked
  $("#displayOptions a:nth-child(2)").click(function () {
    // Show chart
    $(".data-display #display_chart").show();
    let carddisplay = document.getElementById("chart_display")
    carddisplay.style.display = "block";
    // Hide table
    $(".data-display #table-container").hide();
    $(".data-display #main-card").hide();
    // $(".data-display #map").hide();

    // Set chart button active
    $("#displayOptions a:nth-child(2)").addClass("active");
    $("#displayOptions a:nth-child(1)").removeClass("active");
    // $("#displayOptions a:nth-child(3)").removeClass("active");

    $(document).ready(function () {
      draw();
    });

    function draw() {

      (async () => {

        const data = await fetch(
          'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v10.3.3/samples/data/usdeur.json'
        ).then(response => response.json());

        Highcharts.chart('series-chart-canvas', {
          chart: {
            zoomType: 'x'
          },
          title: {
            text: 'USD to EUR exchange rate over time',
            align: 'left'
          },
          subtitle: {
            text: document.ontouchstart === undefined ?
              'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in',
            align: 'left'
          },
          xAxis: {
            type: 'datetime'
          },
          yAxis: {
            title: {
              text: 'Exchange rate'
            }
          },
          legend: {
            enabled: false
          },
          plotOptions: {
            area: {
              fillColor: {
                linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 1
                },
                stops: [
                  [0, Highcharts.getOptions().colors[0]],
                  [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
              },
              marker: {
                radius: 2
              },
              lineWidth: 1,
              states: {
                hover: {
                  lineWidth: 1
                }
              },
              threshold: null
            }
          },

          series: [{
            type: 'area',
            name: 'USD to EUR',
            data: data
          }]
        });
      })();


      //second chart 
      const btn = document.getElementById('play-pause-button'),
        input = document.getElementById('play-range'),
        startYear = 1973,
        endYear = 2021;

      // General helper functions
      const arrToAssociative = arr => {
        const tmp = {};
        arr.forEach(item => {
          tmp[item[0]] = item[1];
        });

        return tmp;
      };

      function getSubtitle() {
        return `<span style='font-size: 60px'>${input.value}</span>`;
      }

      const formatRevenue = [];

      const chart = Highcharts.chart('area-chart-canvas', {
        chart: {
          events: {
            // Some annotation labels need to be rotated to make room
            load: function () {
              const labels = this.annotations[0].labels;
              labels
                .find(a => a.options.id === 'vinyl-label')
                .graphic.attr({
                  rotation: -20
                });
              labels
                .find(a => a.options.id === 'cassettes-label')
                .graphic.attr({
                  rotation: 20
                });
            }
          },
          type: 'area',
          marginTop: 100,
          animation: {
            duration: 700,
            easing: t => t
          }
        },
        title: {
          text: 'Music revenue race chart'
        },
        subtitle: {
          text: getSubtitle(),
          floating: true,
          align: 'right',
          verticalAlign: 'middle',
          x: -100,
          y: -110
        },
        data: {
          csv: document.getElementById('csv').innerHTML,
          itemDelimiter: '\t',
          complete: function (options) {
            for (let i = 0; i < options.series.length; i++) {
              formatRevenue[i] = arrToAssociative(options.series[i].data);
              options.series[i].data = null;
            }
          }
        },
        xAxis: {
          allowDecimals: false,
          min: startYear,
          max: endYear
        },
        yAxis: {
          reversedStacks: false,
          title: {
            text: 'Revenue in the U.S.'
          },
          labels: {
            format: '${text} B'
          }
        },
        tooltip: {
          split: true,
          headerFormat: '<span style="font-size: 1.2em">{point.x}</span>',
          pointFormat:
            '{series.name}: <b>${point.y:,.1f} B</b> ({point.percentage:.1f}%)',
          crosshairs: true
        },
        plotOptions: {
          area: {
            stacking: 'normal',
            pointStart: startYear,
            marker: {
              enabled: false
            }
          }
        },
        annotations: [
          {
            labelOptions: {
              borderWidth: 0,
              backgroundColor: undefined,
              verticalAlign: 'middle',
              allowOverlap: true,
              style: {
                pointerEvents: 'none',
                opacity: 0,
                transition: 'opacity 500ms'
              }
            },
            labels: [
              {
                text: 'Vinyl',
                verticalAlign: 'top',
                point: {
                  x: 1975,
                  xAxis: 0,
                  y: 1.45,
                  yAxis: 0
                },
                style: {
                  fontSize: '0.8em',
                  color: '#000'
                },
                id: 'vinyl-label'
              },
              {
                text: 'LP-EP',
                point: {
                  x: 1980,
                  xAxis: 0,
                  y: 0.2,
                  yAxis: 0
                },
                style: {
                  fontSize: '1.4em',
                  color: '#ffffff'
                },
                id: 'lpep-label'
              },
              {
                text: 'Cass',
                point: {
                  x: 1987,
                  xAxis: 0,
                  y: 2.6,
                  yAxis: 0
                },
                style: {
                  fontSize: '1.5em',
                  color: '#ffffff'
                },
                id: 'cassettes-label'
              },
              {
                text: 'CD',
                point: {
                  x: 1999,
                  xAxis: 0,
                  y: 6,
                  yAxis: 0
                },
                style: {
                  fontSize: '4em',
                  color: '#ffffff'
                },
                id: 'cd-label'
              },
              {
                text: 'DL',
                point: {
                  x: 2011,
                  xAxis: 0,
                  y: 4,
                  yAxis: 0
                },
                style: {
                  fontSize: '1.2em',
                  color: '#ffffff'
                },
                id: 'dl-label'
              },
              {
                text: 'Strm',
                point: {
                  x: 2018,
                  xAxis: 0,
                  y: 5,
                  yAxis: 0
                },
                style: {
                  fontSize: '1.5em',
                  color: '#ffffff'
                },
                id: 'streams-label'
              }
            ]
          }
        ],

        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                title: {
                  align: 'left'
                },
                subtitle: {
                  y: -150,
                  x: -20
                },
                yAxis: {
                  labels: {
                    align: 'left',
                    x: 0,
                    y: -3
                  },
                  tickLength: 0,
                  title: {
                    align: 'high',
                    reserveSpace: false,
                    rotation: 0,
                    textAlign: 'left',
                    y: -20
                  }
                }
              }
            }
          ]
        }
      });

      function pause(button) {
        button.title = 'play';
        button.className = 'fa fa-play';
        clearTimeout(chart.sequenceTimer);
        chart.sequenceTimer = undefined;
      }

      function update() {
        chart.update(
          {
            subtitle: {
              text: getSubtitle()
            }
          },
          false,
          false,
          false
        );

        const series = chart.series,
          labels = chart.annotations[0].labels,
          yearIndex = input.value - startYear,
          dataLength = series[0].options.data.length;

        // If slider moved back in time
        if (yearIndex < dataLength - 1) {
          for (let i = 0; i < series.length; i++) {
            const seriesData = series[i].data.slice(0, yearIndex);
            series[i].setData(seriesData, false);
          }
        }

        // If slider moved forward in time
        if (yearIndex > dataLength - 1) {
          const remainingYears = yearIndex - dataLength;
          for (let i = 0; i < series.length; i++) {
            for (let j = input.value - remainingYears; j < input.value; j++) {
              series[i].addPoint([formatRevenue[i][j]], false);
            }
          }
        }

        // Add current year
        for (let i = 0; i < series.length; i++) {
          const newY = formatRevenue[i][input.value];
          series[i].addPoint([newY], false);
        }

        labels.forEach(label => {
          label
            .graphic
            .css({
              opacity: input.value >= label.options.point.x | 0
            });
        });

        chart.redraw();

        input.value = parseInt(input.value, 10) + 1;

        if (input.value > endYear) {
          // Auto-pause
          pause(btn);
        }
      }

      function play(button) {
        // Reset slider at the end
        if (input.value > endYear) {
          input.value = startYear;
        }
        button.title = 'pause';
        button.className = 'fa fa-pause';
        chart.sequenceTimer = setInterval(function () {
          update();
        }, 700);
      }

      btn.addEventListener('click', function () {
        if (chart.sequenceTimer) {
          pause(this);
        } else {
          play(this);
        }
      });

      play(btn);

      // Trigger the update on the range bar click.
      input.addEventListener('input', update);


      //=========================== third chart ====================================
      // On chart load, start an interval that adds points to the chart and animate
      // the pulsating marker.
      const onChartLoad = function () {
        const chart = this,
          series = chart.series[0];

        setInterval(function () {
          const x = (new Date()).getTime(), // current time
            y = Math.random();

          series.addPoint([x, y], true, true);
        }, 1000);
      };

      // Create the initial data
      const data = (function () {
        const data = [];
        const time = new Date().getTime();

        for (let i = -19; i <= 0; i += 1) {
          data.push({
            x: time + i * 1000,
            y: Math.random()
          });
        }
        return data;
      }());

      // Plugin to add a pulsating marker on add point
      Highcharts.addEvent(Highcharts.Series, 'addPoint', e => {
        const point = e.point,
          series = e.target;

        if (!series.pulse) {
          series.pulse = series.chart.renderer.circle()
            .add(series.markerGroup);
        }

        setTimeout(() => {
          series.pulse
            .attr({
              x: series.xAxis.toPixels(point.x, true),
              y: series.yAxis.toPixels(point.y, true),
              r: series.options.marker.radius,
              opacity: 1,
              fill: series.color
            })
            .animate({
              r: 20,
              opacity: 0
            }, {
              duration: 1000
            });
        }, 1);
      });

      //third chart moving line chart
      Highcharts.chart('line-chart-canvas', {
        chart: {
          type: 'spline',
          events: {
            load: onChartLoad
          }
        },

        time: {
          useUTC: false
        },

        title: {
          text: 'Live random data'
        },

        accessibility: {
          announceNewData: {
            enabled: true,
            minAnnounceInterval: 15000,
            announcementFormatter: function (allSeries, newSeries, newPoint) {
              if (newPoint) {
                return 'New point added. Value: ' + newPoint.y;
              }
              return false;
            }
          }
        },

        xAxis: {
          type: 'datetime',
          tickPixelInterval: 150,
          maxPadding: 0.1
        },

        yAxis: {
          title: {
            text: 'Value'
          },
          plotLines: [
            {
              value: 0,
              width: 1,
              color: '#808080'
            }
          ]
        },

        tooltip: {
          headerFormat: '<b>{series.name}</b><br/>',
          pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
        },

        legend: {
          enabled: false
        },

        exporting: {
          enabled: false
        },

        series: [
          {
            name: 'Random data',
            lineWidth: 2,
            color: Highcharts.getOptions().colors[2],
            data
          }
        ]
      });


      //fourth chart 
      // Implement the logic to create a line chart
      // Example:
      // Create the chart
      Highcharts.chart('bar-chart-canvas', {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Corn vs wheat estimated production for 2020',
          align: 'left'
        },
        subtitle: {
          text:
            'Source: <a target="_blank" ' +
            'href="https://www.indexmundi.com/agriculture/?commodity=corn">indexmundi</a>',
          align: 'left'
        },
        xAxis: {
          categories: ['USA', 'China', 'Brazil', 'EU', 'India', 'Russia'],
          crosshair: true,
          accessibility: {
            description: 'Countries'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: '1000 metric tons (MT)'
          }
        },
        tooltip: {
          valueSuffix: ' (1000 MT)'
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: [
          {
            name: 'Corn',
            data: [406292, 260000, 107000, 68300, 27500, 14500]
          },
          {
            name: 'Wheat',
            data: [51086, 136000, 5500, 141000, 107180, 77000]
          }
        ]
      });

    };
  });


  // Add event listener to table button to be active color
  $("#tableButton").click(function () {
    // Show table
    $(".data-display #table-container").show();

    // Hide chart
    $(".data-display #chart").hide();
    $(".data-display #map").hide();


    // Set table button active
    $("#tableButton").addClass("active");
    $("#chartButton").removeClass("active");
    $("#mapbutton").removeClass("active");
  });

  // Add event listener to chart button to be active color
  $("#chartButton").click(function () {
    // Show chart
    $(".data-display #chart").show();

    // Hide table
    $(".data-display #table-container").hide();
    $(".data-display #map").hide();

    // Set chart button active
    $("#chartButton").addClass("active");
    $("#tableButton").removeClass("active");
    $("#mapbutton").removeClass("active");

  });

  // Add event listener to map button to be active color
  $("#mapbutton").click(function () {
    // Show chart
    $(".data-display #map").show();

    // Hide table
    $(".data-display #chart").hide();
    $(".data-display #table-container").hide();

    // Set chart button active
    $("#mapbutton").addClass("active");
    $("#chartButton").removeClass("active");
    $("#tableButton").removeClass("active");
  });



  $('.filter-submenu input[type="checkbox"], .filter-submenu input[type="radio"]').on('change', function () {
    updateFilterSelection();
  });
});
