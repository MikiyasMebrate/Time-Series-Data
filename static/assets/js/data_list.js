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
      var selectTopic = data.topics.map(function (topic) {
        return '<div class="filter-submenu flex-grow-2">' +
          '  <input type="radio" value="' + topic.id + '" name="topic_lists" id="topic_list' + topic.id + '">' +
          '  <label for="topic_list' + topic.id + '" style="font-size: small;" class="mb-0">' + topic.title_ENG + ' - ' + topic.title_AMH + '</label>' +
          '</div>';
      }).join('');

      $('#topic_list_filter').html(selectTopic);

      $('input[name="topic_lists"]').on('change', function (event) {
        var selectedTopicId = event.target.value;

        // Process categories
        var selectCategory = data.categories.map(function (category) {
          if (String(category.topics[0].id) === String(selectedTopicId)) {
            return '<div class="filter-submenu">' +
              '  <input type="radio" value="' + category.id + '" name="category_lists" id="category_list' + category.id + '">' +
              '  <label class="form-label" for="category_list' + category.id + '" style="font-size: small;">' + category.name_ENG + ' - ' + category.name_AMH + '</label>' +
              '</div>';
          }
          return '';
        }).join('');

        $(document).on('change', '.filter-submenu input[type="checkbox"], .filter-submenu input[type="radio"]', function() {
          updateFilterSelection();
        });
        
        $('#category_list_filter').html(selectCategory);

        $('input[name="category_lists"]').on('change', function (eventCategory) {
          var selectedCategoryId = eventCategory.target.value;

          // Process indicators
          var selectIndicator = data.indicators.map(function (indicator) {
            if (String(indicator.for_category_id) === String(selectedCategoryId)) {
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

            $(document).on('change', '.filter-submenu input[type="checkbox"], .filter-submenu input[type="radio"]', function() {
              updateFilterSelection();
            });
            
          $('#indicator_list_filter').html(selectAll + selectIndicator);
          //apply Button
          let displayApplyButton = document.getElementById("applyButton");

          // Attach event handler for 'Select All' for indicators
          $('#select_all').change(function () {
            var checkedStatus = this.checked;
            $('input[name="indicator_lists"]').each(function () {
              $(this).prop('checked', checkedStatus);
            });
          });
          $(document).on('change', '.filter-submenu input[type="checkbox"], .filter-submenu input[type="radio"]', function() {
            updateFilterSelection();
          });
          
          // Start the .column div before the map function
          var selectYear = '<div class="column">';

          // Append to selectYear within the map function without creating a new .column
          selectYear += data.year.map(function (year) {
            if (!year.is_interval) {
              return '<div class="filter-submenu">' +
                    '  <input type="checkbox" value="' + year.id + '" name="yearListsCheckBox" id="yearList' + year.id + '">' +
                    '  <label for="yearList' + year.id + '" style="font-size: small;">' + year.year_EC + ' E.C - ' + year.year_GC + ' G.C</label>' +
                    '</div>';
            }
            return '';
          }).join('');

          // Close the .column div after the map function
          selectYear += '</div>';

          var selectYearAll = '<div class="filter-submenu d-flex">' +
            '  <input class="form-check" type="checkbox" id="select_all_year_filter">' +
            '  <label class="form-label pl-1" for="select_all_year_filter" style="font-size: small;"> Select All</label>' +
            '</div>';

          var viewRecentYearButtons = '<p class="m-0 mb-1 fw-bold">View Recent Year</p>' +
            '<div class="filter-submenu mb-2">' +
            '  <button class="ms-1 btn btn-outline-primary text-primary bg-white" id="last_5_year">5</button>' +
            '  <button class="ms-1 btn btn-outline-primary text-primary bg-white" id="last_10_year">10</button>' +
            '  <button class="ms-1 btn btn-outline-primary text-primary bg-white" id="last_15_year">15</button>' +
            '  <button class="ms-1 btn btn-outline-primary text-primary bg-white" id="last_20_year">20</button>' +
            '</div>';

          $('#Year_list_filter').html(viewRecentYearButtons + selectYearAll + selectYear);

          // Attach event handlers for 'Select All' for years
          $('#select_all_year_filter').change(function () {
            var checkedStatus = this.checked;
            $('input[name="yearListsCheckBox"]').each(function () {
              $(this).prop('checked', checkedStatus);
            });
          });

          // Attach event handlers for view recent year buttons
          $('#last_5_year, #last_10_year, #last_15_year, #last_20_year').click(function () {
            var yearsToShow = parseInt($(this).text(), 10);
            $('input[name="yearListsCheckBox"]').prop('checked', false); // Uncheck all first
            $('input[name="yearListsCheckBox"]:lt(' + yearsToShow + ')').prop('checked', true); // Check the first N checkboxes
            
            // After changing the checkboxes, call updateFilterSelection to update the check mark
            updateFilterSelection();
          });
          
          
          //Display Data with Apply Button
          displayApplyButton.addEventListener("click", () => {
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

            selectIndicator = data.indicators.map(
              ({ title_ENG, title_AMH, id, for_category_id }) => {
                if (
                  String(for_category_id) === String(selectedCategoryId) &&
                  selectedIndictorId.includes(String(id))
                ) {
                  let title_amharic = "";
                  if (!title_AMH === null)
                    title_amharic = " - " + title_AMH;

                  //Table Row Start
                  table += `
                        <tr>
                          <td>
                            <a>
                              <h6 class="mb-1">
                                <a href="/Admin/data_list_detail.html" style="font-size: small;" class="d-block text-reset">${title_ENG} ${title_amharic}</a>
                              </h6>
                            </a>
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
                      if (String(i.parent_id) === String(parent)) {
                        status = true;
                        //Table Row Start
                        table += `
                              <tr>
                                <td>
                                  <a>
                                    <h6 class="mb-1">
                                      <a href="/Admin/data_list_detail.html" style="font-size: small;" class="d-block text-secondary ps-2  fw-normal">${space} ${i.title_ENG} </a>
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
                    if (String(indicator.parent_id) == String(id)) {
                      test = true;
                      //li.push(`<optgroup label="${title_ENG}">`)

                      //Table Row Start
                      table += `
                      <tr>
                        <td>
                          <a>
                            <h6 class="mb-1">
                              <a href="/Admin/data_list_detail.html" style="font-size: small;" class="d-block text-secondary  fw-normal"> &nbsp;&nbsp; ${indicator.title_ENG} </a>
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
                  { width: "200px", targets: 0 },
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
  $('.filter-submenu input[type="checkbox"], .filter-submenu input[type="radio"]').on('change', function () {
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
    $(".data-display #chart").show();

    // Hide table
    $(".data-display #table-container").hide();
    $(".data-display #map").hide();

    // Set chart button active
    $("#displayOptions a:nth-child(2)").addClass("active");
    $("#displayOptions a:nth-child(1)").removeClass("active");
    $("#displayOptions a:nth-child(3)").removeClass("active");
  });

  //make the third button in display-option div display map when clicked
  $("#displayOptions a:nth-child(3)").click(function () {
    // Show map
    $(".data-display #map").show();

    // Hide table and chart
    $(".data-display #table-container").hide();
    $(".data-display #chart").hide();

    // Set map button active
    $("#displayOptions a:nth-child(3)").addClass("active");
    $("#displayOptions a:nth-child(1)").removeClass("active");
    $("#displayOptions a:nth-child(2)").removeClass("active");

    (async () => {
      let sonifyOnHover = false;

      const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/fr/fr-all.topo.json'
      ).then(response => response.json());

      // Instantiate the map
      Highcharts.mapChart('map', {
        chart: {
          map: topology
        },
        subtitle: {
          text: 'Click a map area to start sonifying as you interact with the map',
          align: 'left'
        },
        sonification: {
          // Play marker / tooltip can make it hard to click other points
          // while a point is playing, so we turn it off
          showTooltip: false
        },
        legend: {
          layout: 'vertical',
          backgroundColor: 'rgba(255,255,255,0.85)',
          floating: true,
          verticalAlign: 'bottom',
          align: 'left',
          symbolHeight: 450
        },
        colorAxis: {
          min: 1,
          max: 1000,
          type: 'logarithmic',
          stops: [
            [0, '#0B4C63'],
            [0.5, '#7350BB'],
            [0.7, '#3CD391'],
            [0.9, '#4AA0FF']
          ],
          marker: {
            color: '#343'
          }
        },
        responsive: {
          rules: [{
            condition: {
              maxWidth: 580
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                floating: false,
                align: 'center',
                symbolHeight: 10
              }
            }
          }]
        },
        tooltip: {
          valueSuffix: '/km²'
        },
        series: [{
          name: 'Population density',
          sonification: {
            tracks: [{
              // First play a note to indicate new map area
              instrument: 'vibraphone',
              mapping: {
                pitch: 'c7',
                volume: 0.3
              }
            }, {
              mapping: {
                // Array of notes to play. We just repeat the same note
                // and vary the gap between the notes to indicate
                // density. Note: Can use Array.from in modern browsers
                pitch: Array.apply(null, Array(25)).map(function () {
                  return 'g2';
                }),
                gapBetweenNotes: {
                  mapTo: '-value', // Smaller value = bigger gaps
                  min: 90,
                  max: 1000,
                  mapFunction: 'logarithmic'
                },
                pan: 0,
                noteDuration: 500,
                playDelay: 150 // Make space for initial notification
              }
            }, {
              // Speak the name after a while
              type: 'speech',
              language: 'fr-FR', // Speak in French, preferably
              mapping: {
                text: '{point.name}',
                volume: 0.4,
                rate: 1.5,
                playDelay: 1500
              }
            }]
          },
          accessibility: {
            point: {
              valueDescriptionFormat: '{xDescription}, {point.value} people per square kilometer.'
            }
          },
          events: {
            mouseOut: function () {
              // Cancel sonification when mousing out of point
              this.chart.sonification.cancel();
            }
          },
          point: {
            // Handle when to sonify and not
            events: {
              // We require a click before we start playing, so we don't
              // surprise users. Also some browsers will block audio
              // until there have been interactions.
              click: function () {
                if (!sonifyOnHover) {
                  this.sonify();
                } else {
                  this.series.chart.sonification.cancel();
                }
                sonifyOnHover = !sonifyOnHover;
              },
              mouseOver: function () {
                if (sonifyOnHover) {
                  this.sonify();
                }
              }
            }
          },
          cursor: 'pointer',
          borderColor: '#4A5A4A',
          dataLabels: {
            enabled: true,
            format: '{point.name}'
          },
          data: [
            ['fr-hdf', 189],
            ['fr-nor', 111],
            ['fr-idf', 1021],
            ['fr-ges', 97],
            ['fr-bre', 123],
            ['fr-pdl', 119],
            ['fr-cvl', 66],
            ['fr-bfc', 59],
            ['fr-naq', 72],
            ['fr-ara', 115],
            ['fr-occ', 82],
            ['fr-pac', 162],
            ['fr-lre', 344],
            ['fr-may', 1],
            ['fr-gf', 3],
            ['fr-mq', 323],
            ['fr-gua', 236],
            ['fr-cor', 39]
          ]
        }]
      });
    })();

  });

  // Add sample data for the chart
  var chartData = [
    { year: "2018", value: 1000 },
    { year: "2019", value: 1200 },
    { year: "2020", value: 1500 },
    { year: "2021", value: 1800 },
    { year: "2022", value: 2000 }
  ];

  // Create the chart using highcharts library
  Highcharts.chart('chart', {
    chart: {
      type: 'line'
    },
    title: {
      text: 'Sample Chart'
    },
    xAxis: {
      categories: chartData.map(function (data) { return data.year; })
    },
    yAxis: {
      title: {
        text: 'Value'
      }
    },
    series: [{
      name: 'Value',
      data: chartData.map(function (data) { return data.value; })
    }],
    exporting: {
      enabled: true,
      csv: {
        dateFormat: '%Y-%m-%d'
      }
    }
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


  // Add event listener to the #button div
  $('#button').on('click', '#applyButton', function () {
    // Hide filter selection card
    $(".card").hide();

    // Show data display section
    $("#dataDisplay").show();

    // Show table
    $("#table-container").show();

    document.getElementById("downloadButton").disabled = false;
    // Hide chart
    $("#chart").hide();
    $("#map").hide();
  });
  $('.filter-submenu input[type="checkbox"], .filter-submenu input[type="radio"]').on('change', function () {
    updateFilterSelection();
});
});
