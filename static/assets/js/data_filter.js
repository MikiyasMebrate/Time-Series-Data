
let selectedIndictorId = [];
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

function filterData() {
  console.log('hello')
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

        $(document).on('change', '.filter-submenu input[type="checkbox"], .filter-submenu input[type="radio"]', function () {
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

          $(document).on('change', '.filter-submenu input[type="checkbox"], .filter-submenu input[type="radio"]', function () {
            updateFilterSelection();
          });

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
          });

          //Return Selected Year
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

              // Construct or update yearTableList based on checked years
              yearTableList = [];
              $('input[name="yearListsCheckBox"]:checked').each(function () {
                var yearId = $(this).val();
                var yearData = data.year.find(y => y.id.toString() === yearId);
                if (yearData && !yearData.is_interval) {
                  yearTableList.push([yearData.id, yearData.year_EC, yearData.year_GC]);
                }
              });

              // After changing the checkboxes, call updateFilterSelection to update the check mark
              updateFilterSelection();
            });
          };
          // After changing the checkboxes, call updateFilterSelection to update the check mark
          updateFilterSelection();

          //Select-all Button for Indicator
          let selectAllIndicator = document.getElementById("select_all");
          let selectedIndictorId = [];

          selectAllIndicator.addEventListener("change", () => {
            let indicatorListCheckAll = document.getElementsByName("indicator_lists");

            if (selectAllIndicator.checked) {
              indicatorListCheckAll.forEach((event) => {
                event.checked = true;
                if (!selectedIndictorId.includes(event.value)) {
                  selectedIndictorId.push(event.value);
                }
                // Active apply Button
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

            // Log the selectedIndictorId array after changes
            console.log(selectedIndictorId);
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


          let table = generateTable();

          function generateTable() {

            let tableHTML = `
              <table id="newTable" class="table table-bordered m-0 p-0">
                <thead>
                  <tr>
                    <th class="ps-5 pe-5">Name</th>`;

            for (let i of yearTableList) {
              tableHTML += `<th style="font-size: small;">${i[1]}-E.C </br>${i[2]}<span>-G.C</span></th>`;
            }
            console.log('selectindicator', selectedIndictorId)
            tableHTML += `</tr>
                         </thead>
                         <tbody>`;
            selectIndicator = data.indicators.map(({ title_ENG, title_AMH, id, for_category_id }) => {
              console.log('Checking for id:', id);
              console.log('String(id):', String(id), 'Length:', String(id).length);
              console.log('selectedIndictorId.includes(String(id)):', selectedIndictorId.includes(String(id).trim()), 'Length:', selectedIndictorId.length);

              if (String(for_category_id) === String(selectedCategoryId) && selectedIndictorId.includes(String(id))) {
                console.log('Condition met.');
                let title_amharic = title_AMH !== null ? " - " + title_AMH : "";
                tableHTML += generateTableRow(id, title_ENG, title_amharic);

                let table_child_list = (parent, title_ENG, space) => {
                  space += "&nbsp;&nbsp;&nbsp;&nbsp";
                  for (let i of data.indicators) {
                    if (String(i.parent_id) === String(parent)) {
                      tableHTML += generateTableRow(i.id, title_ENG + " " + i.title_ENG, "", space);
                      table_child_list(i.id, i.title_ENG, space);
                    }
                  }
                };

                for (let indicator of data.indicators) {
                  if (String(indicator.parent_id) == String(id)) {
                    tableHTML += generateTableRow(indicator.id, indicator.title_ENG, "", "  ");
                    table_child_list(indicator.id, indicator.title_ENG, " ");
                  }
                }

                return null;
              } else {
                console.log('Condition not met.');
              }
            });

            tableHTML += `</tbody>
              </table>`;

            return tableHTML;
          }

          function generateTableRow(id, title, title_amharic = "", space = "") {
            console.log("==============================================in the row  ============================")
            let rowHTML = `
              <tr>
                <td>
                  <a href="/Admin/data_list_detail.html" style="font-size: small;" class="d-block text-reset">
                    <h6 class="mb-1">${title} ${title_amharic}</h6>
                  </a>
                </td>`;

            for (let j of yearTableList) {
              let statusData = false;
              for (let k of data.value) {
                if (String(j[0]) === String(k.for_datapoint_id) && String(id) === String(k.for_indicator_id)) {
                  rowHTML += `<td>${k.value}</td>`;
                  statusData = false;
                  break;
                } else {
                  statusData = true;
                }
              }
              if (statusData) {
                rowHTML += `<td> - </td>`;
              }
            }

            rowHTML += `</tr>`;
            return rowHTML;
          }

          let dataListViewTable = document.getElementById("list_table_view");
          dataListViewTable.innerHTML = table;

          console.log('indicator lenght', selectedIndictorId.length)

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

          // Function to update the table in the DOM
          function updateTable() {
            // Replace the inner HTML with the newly generated table
            dataListViewTable.innerHTML = table;

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
          }

          // Example of updating the table when your data changes
          function onDataChanged() {
            // Update the table when data changes
            table = generateTable();
            updateTable();
          }
          //End Indicator table
          onDataChanged()
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
  // $("#displayOptions a:nth-child(3)").click(function () {
  //   // Show map
  //   $(".data-display #map").show();

  //   // Hide table and chart
  //   $(".data-display #table-container").hide();
  //   $(".data-display #chart").hide();

  //   // Set map button active
  //   $("#displayOptions a:nth-child(3)").addClass("active");
  //   $("#displayOptions a:nth-child(1)").removeClass("active");
  //   $("#displayOptions a:nth-child(2)").removeClass("active");
  // });

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
    let displayecard = document.getElementById("main-card")
    displayecard.style.display = "block";
    document.getElementById("downloadButton").disabled = false;
    // Hide chart
    $("#chart").hide();
    $("#map").hide();
  });
  $('.filter-submenu input[type="checkbox"], .filter-submenu input[type="radio"]').on('change', function () {
    updateFilterSelection();
  });
}); 