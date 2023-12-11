
let catargoryCount = 0;
let catargorySelected = 0;
let databaseCount = 0;
let databaseSelected = 0;
let indicatorcount = 0;
let indicatorSelected = 0;
let yearSelected = 0;
let isdatatable = 0;
let yearcount = 0;
let theSelectedCatagory;

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
        if (topic.is_deleted === false) {
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
          if (String(category.topic_id) === String(selectedTopicId) && category.is_deleted === false) {
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
          theSelectedCatagory = data.categories.find((item) => String(item.id) == String(selectedCategoryId))
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

          var selectAll = '';
          if (selectIndicator.trim() !== '') {
            var selectAll = '<div class="filter-submenu d-flex">' +
              '  <input class="form-check" type="checkbox" id="select_all">' +
              '  <label class="form-label pl-1" for="select_all" style="font-size: small;">Select All</label>' +
              '</div>';
          }

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

          if (selectIndicator.trim() !== '') {
            // Attach event handler for 'Select All' for indicators
            $('#select_all').change(function () {
              var checkedStatus = this.checked;
              $('input[name="indicator_lists"]').each(function () {
                $(this).prop('checked', checkedStatus);
              });
            });
          }
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

            if (selectIndicator.trim() !== '') {
              var selectYearAll = '<div class="filter-submenu d-flex">' +
                '  <input class="form-check" type="checkbox" id="select_all_year_filter">' +
                '  <label class="form-label pl-1" for="select_all_year_filter" style="font-size: small;"> Select All</label>' +
                '</div>';
            }
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
            let yearListCheckAll =
              document.getElementsByName("yearListsCheckBox");

            //Selected Year
            yearListCheckAll.forEach((yearCheckBox) => {
              yearCheckBox.addEventListener(
                "change",
                (eventYearCheckBox) => {
                  if (eventYearCheckBox.target.checked) {
                    for (checkedYear of data.year) {
                      if (
                        !checkedYear.is_interval &&
                        String(yearCheckBox.value) ===
                        String(checkedYear.id)
                      ) {
                        if (
                          yearTableList.includes([
                            checkedYear.id,
                            checkedYear.year_EC,
                            checkedYear.year_GC,
                          ])
                        ) {
                          continue;
                        } else {
                          yearTableList.push([
                            checkedYear.id,
                            checkedYear.year_EC,
                            checkedYear.year_GC,
                          ]);
                        }
                      }
                    }
                  } else {
                    selectAllYear.checked = false;
                    try {
                      for (checkedYear of data.year) {
                        if (
                          !checkedYear.is_interval &&
                          String(yearCheckBox.value) ===
                          String(checkedYear.id)
                        ) {
                          let valueToCheck = [
                            checkedYear.id,
                            checkedYear.year_EC,
                            checkedYear.year_GC,
                          ];
                          console.log([checkedYear.id, checkedYear.year_EC, checkedYear.year_GC])
                          console.log(yearTableList)
                          console.log(yearTableList.includes(valueToCheck))

                          for (let i = 0; i < yearTableList.length; i++) {
                            if (
                              String(yearTableList[i][0]) ===
                              String(valueToCheck[0])
                            ) {
                              yearTableList.splice(i, 1);
                            }
                          }
                        }
                      }
                    } catch {
                      null;
                    }
                  }
                }
              );
            });
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

            $('input[name="yearListsCheckBox"]:checked').each(function () {
              var yearId = $(this).val();
              var yearData = data.year.find(y => y.id.toString() === yearId);
              if (yearData && !yearData.is_interval) {
                yearTableList.push([yearData.id, yearData.year_EC, yearData.year_GC]);
              }
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
            let table_card = document.getElementById("table_card")
            table_card.style.display = "block"
            let list_table = document.getElementById("list_table_view")
            list_table.style.display = "block"
            

            // Hide chart
            $("#chart").hide();
            $("#map").hide();
            $("#display_chart").hide();

            $("#displayOptions a:nth-child(1)").addClass("active");
            $("#displayOptions a:nth-child(2)").removeClass("active");

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
                                 <a  style="font-size: small;" class="d-block fw-bold text-dark">${title_ENG} ${title_amharic}</a>
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

            // Trigger click event on the "Bar" button
            $("#bar_btn").trigger('click');
            // Set the display property of the select dropdown to 'block'
            $(".indicatorDropdown").css("display", "block");

            // Set chart button active
            $("#displayOptions a:nth-child(2)").addClass("active");
            $("#displayOptions a:nth-child(1)").removeClass("active");
            // $("#displayOptions a:nth-child(3)").removeClass("active");

            $(document).ready(function () {
              document.getElementById('titleForCatagory').innerHTML = theSelectedCatagory.name_ENG
              const labelElement = document.getElementById('select_label');
              const selectElement = document.querySelector('.indicatorDropdown');

              // Add event listeners to all nav links
              const navLinks = document.querySelectorAll('.nav-link');
              navLinks.forEach(navLink => {
                navLink.addEventListener('click', function () {
                  // Toggle the visibility of the label and select elements
                  if (labelElement && selectElement) {
                    // Check if the clicked nav link is the "Area" nav link
                    const isAreaNavLink = this.id === 'area';

                    labelElement.style.display = isAreaNavLink ? 'none' : 'block';
                    selectElement.style.display = isAreaNavLink ? 'none' : 'block';
                  }
                });
              });
              // Extract data for the chart
              let chartData = [];
              let indicators = [];

              selectIndicator = data.indicators.map(({ title_ENG, id, for_category_id, is_deleted }) => {
                if (String(for_category_id) === String(selectedCategoryId) && selectedIndictorId.includes(String(id)) && !is_deleted) {
                  let indicatorData = {
                    name: title_ENG,
                    data: []
                  };

                  for (let j of yearTableList) {
                    let statusData = false;
                    for (let k of data.value) {
                      if (String(j[0]) === String(k.for_datapoint_id) && String(id) === String(k.for_indicator_id)) {
                        indicatorData.data.push({
                          x: `${j[1]}-E.C ${j[2]}-G.C`,
                          y: parseFloat(k.value)
                        });
                        statusData = false;
                        break;
                      } else {
                        statusData = true;
                      }
                    }
                    if (statusData) {
                      indicatorData.data.push({
                        x: `${j[1]}-E.C ${j[2]}-G.C`,
                        y: null
                      });
                    }
                  }

                  chartData.push(indicatorData);
                  indicators.push({ id, title_ENG, for_category_id, is_deleted });
                }
              });

              // Convert data to JSON
              let jsonData = {
                indicators: indicators,
                chartData: chartData
              };
              // Select all elements with the class "indicatorDropdown"
              const dropdowns = document.querySelectorAll(`.indicatorDropdown`);


              // Iterate over each dropdown and update its options
              dropdowns.forEach((dropdown, index) => {
                dropdown.innerHTML = ''; // Clear existing options
                indicators.forEach(({ id, title_ENG }, i) => {
                  const option = document.createElement('option');
                  option.value = id;
                  option.text = title_ENG;
                  dropdown.appendChild(option);

                  // Set the first option as selected by default
                  if (i === 0) {
                    option.selected = true;
                  }
                });

                // Add event listener to the dropdown
                dropdown.addEventListener('change', function () {
                  const selectedIndicatorId = this.value;


                  // Find the selected indicator in jsonData.indicators
                  const selectedIndicator = jsonData.indicators.find(indicator => indicator.id === Number(selectedIndicatorId));


                  if (selectedIndicator) {
                    // Find the selected indicator's data in jsonData.chartData
                    const selectedChartData = jsonData.chartData.find(chartItem => chartItem.name === selectedIndicator.title_ENG);

                    if (selectedChartData && selectedChartData.data) {
                      // Pass the index to identify the correct chart
                      draw(selectedChartData.data);
                    } else {
                      console.error('Selected indicator data is undefined in jsonData.chartData.');
                    }
                  } else {
                    console.error('Selected indicator is undefined.');
                  }
                });

                // Trigger change event on the first dropdown
                if (index === 0) {
                  dropdown.dispatchEvent(new Event('change'));
                }
              });

              function areachart(alldata) {
                let allyears = [];
                let input = document.getElementById('play-range');
                for (let i of yearTableList) {
                  allyears.push(i[1])
                }
                // Find the minimum and maximum values in allyears array
                const minYear = Math.min(...allyears);
                const maxYear = Math.max(...allyears);

                // Set the min and max attributes of the input range
                input.min = minYear;
                input.max = maxYear;

                const btn = document.getElementById('play-pause-button'),
                  startYear = minYear,
                  endYear = maxYear;


                // General helper functions
                const arrToAssociative = arr => {
                  const tmp = {};
                  arr.forEach(item => {
                    tmp[item[0]] = item[1];
                  });

                  return tmp;
                };


                // ================================== second chart =================================
                const formatRevenue = [];
                const chart = Highcharts.chart('area-chart-canvas', {
                  chart: {
                    events: {
                      load: function () {
                        const annotations = this.annotations;

                        if (annotations && annotations[0] && annotations[0].labels) {
                          const labels = annotations[0].labels;

                          // Check if the label with id 'vinyl-label' exists
                          const vinylLabel = labels.find(a => a.options.id === 'vinyl-label');
                          if (vinylLabel && vinylLabel.graphic) {
                            vinylLabel.graphic.attr({
                              rotation: -20
                            });
                          }

                          // Check if the label with id 'cassettes-label' exists
                          const cassettesLabel = labels.find(a => a.options.id === 'cassettes-label');
                          if (cassettesLabel && cassettesLabel.graphic) {
                            cassettesLabel.graphic.attr({
                              rotation: 20
                            });
                          }
                        }
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
                    text: 'All indicators Values'
                  },
                  xAxis: {
                    categories: (alldata[0] && alldata[0].data) ? alldata[0].data.map(point => point.x) : [],
                    labels: {
                      rotation: -45,
                      formatter: function () {
                        return this.value;
                      }
                    }
                  },
                  yAxis: {
                    reversedStacks: false,
                    title: {
                      text: 'values'
                    },
                    labels: {
                      format: '${text} B'
                    }
                  },
                  tooltip: {
                    split: true,
                    headerFormat: '<span style="font-size: 1.2em">{point.x}</span>',
                    pointFormat: '{series.name}: <b>${point.y:,.1f} B</b> ({point.percentage:.1f}%)',
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
                        // Annotation labels
                      ]
                    }
                  ],
                  responsive: {
                    rules: [
                      // Responsive rules
                    ]
                  },
                  series: alldata.map(item => ({
                    type: 'area',
                    name: item.name,
                    data: item.data.map(point => ({
                      x: point.x,
                      y: point.y
                    }))
                  }))
                });

                function pause(button) {
                  button.title = 'play';
                  button.className = 'fa fa-play';
                  clearTimeout(chart.sequenceTimer);
                  chart.sequenceTimer = undefined;
                }

                // ...

                function update() {
                  console.log('Update function called');
                  console.log('alldata:', alldata);

                  if (!alldata || !alldata.length || !alldata[0] || !alldata[0].data) {
                    console.error('alldata, alldata[0], or alldata[0].data is undefined.');
                    return;
                  }

                  const series = chart.series,
                    labels = chart.annotations && chart.annotations[0] && chart.annotations[0].labels,
                    selectedYear = parseInt(input.value, 10),
                    yearIndex = selectedYear - startYear;



                  if (yearIndex >= alldata[0].data.length) {
                    // Stop the timer if we reach the end of the available data
                    pause(btn);
                    return;
                  }

                  // Replace null values with 0
                  alldata.forEach((item) => {
                    item.data.forEach((point) => {
                      if (point.y === null) {
                        point.y = 0;
                      }
                    });
                  });

                  // Check if the chart is already initialized
                  if (!chart.sequenceTimer) {
                    // Perform the initial update
                    if (series && series.length) {
                      for (let i = 0; i < series.length; i++) {
                        // Check if alldata[i] is defined and has a 'data' property
                        if (alldata[i] && alldata[i].data) {
                          const seriesData = alldata[i].data.slice(0, yearIndex + 1);
                          series[i].setData(seriesData, false);
                        } else {
                          console.error(`alldata[${i}] or alldata[${i}].data is undefined.`);
                        }
                      }
                    } else {
                      console.error('Series is undefined or has a length of 0.');
                    }

                  }

                  // If slider moved forward in time
                  if (yearIndex > alldata[0].data.length - 1) {
                    const remainingYears = yearIndex - alldata[0].data.length + 1;
                    for (let i = 0; i < series.length; i++) {
                      for (let j = alldata[0].data.length; j < selectedYear; j++) {
                        series[i].addPoint({ x: alldata[i].data[j].x, y: 0 }, false);
                      }
                    }
                  }

                  // Add current year
                  if (series && series.length) {
                    for (let i = 0; i < series.length; i++) {
                      const currentData = alldata[i].data[yearIndex];
                      if (currentData && currentData.x) {
                        const match = currentData.x.match(/\d+/g); // Extract numeric values
                        const currentYear = match ? parseInt(match[0], 10) : null;

                        const newY = currentData.y;
                        series[i].addPoint({ x: currentYear, y: newY }, false);
                      }
                    }
                  }

                  labels.forEach((label) => {
                    if (label.options.point && label.options.point.x) {
                      label.graphic.css({
                        opacity: selectedYear >= label.options.point.x | 0,
                      });
                    }
                  });

                  chart.redraw();

                  input.value = selectedYear + 1;

                  if (selectedYear >= endYear) {
                    // Auto-pause
                    pause(btn);
                  }
                }

                function play(button) {
                  console.log('Play function called');
                  // Reset slider at the end
                  if (input.value >= endYear) {
                    input.value = startYear;
                  }

                  button.title = 'pause';
                  button.className = 'fa fa-pause';

                  chart.sequenceTimer = setInterval(function () {
                    const selectedYear = parseInt(input.value, 10);
                    const yearIndex = selectedYear - startYear;

                    // Check if the year index is within the available range
                    if (alldata[0] && alldata[0].data && yearIndex < alldata[0].data.length) {
                      update();
                    } else {
                      // Stop the timer if we reach the end of the available data
                      pause(button);
                    }
                  }, 800);
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
              }

              area_btn = document.getElementById('area')
              area_btn.addEventListener('click', function () {
                console.log('Area button clicked');
                const areaChartContainer = document.getElementById('area-chart-canvas');
                if (areaChartContainer) {
                  // Destroy the existing chart
                  Highcharts.charts.forEach(chart => {
                    if (chart && chart.renderTo === areaChartContainer) {
                      chart.destroy();
                    }
                  });


                  // Draw the new chart
                  areachart(jsonData.chartData);
                  console.log('area data', jsonData.chartData)
                } else {
                  console.error('Element with id "area-chart-canvas" not found.');
                }
              });



              function draw(chartdata) {
                const dropdown = document.querySelector('.indicatorDropdown');
                const selectedIndicatorName = dropdown.options[dropdown.selectedIndex].text;
                // ================================================ first chart =======================================
                Highcharts.chart('series-chart-canvas', {
                  chart: {
                    zoomType: 'x'
                  },
                  title: {
                    text: selectedIndicatorName,
                    align: 'left'
                  },
                  subtitle: {
                    text: document.ontouchstart === undefined ?
                      'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in',
                    align: 'left'
                  },
                  xAxis: {
                    type: 'category',
                    labels: {
                      step: 1
                    },
                    accessibility: {
                      rangeDescription: `Range: ${chartdata[0].x} to ${chartdata[chartdata.length - 1].x}`
                    },
                    pointStart: chartdata[0].x,
                    pointInterval: 1
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
                    name: 'Custom Data',
                    data: chartdata.map(item => [item.x, item.y !== null ? item.y : 0])
                  }]
                });



                //==================================================== third chart===================================================
                Highcharts.chart('line-chart-canvas', {
                  title: {
                    text: selectedIndicatorName,
                    align: 'left'
                  },
                  xAxis: {
                    accessibility: {
                      rangeDescription: `Range: ${chartdata[0].x} to ${chartdata[chartdata.length - 1].x}`
                    },
                    categories: chartdata.map(item => item.x),
                  },
                  legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                  },
                  series: [{
                    data: chartdata.map(item => (item.y !== null ? item.y : 0)),
                  }],
                  responsive: {
                    rules: [
                      {
                        condition: {
                          maxWidth: 500,
                        },
                        chartOptions: {
                          legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom',
                          },
                        },
                      },
                    ],
                  },
                });



                // ======================================= fourth chart create a line chart ==============================
                // Replace null values with 0
                const modifiedData = chartdata.map(item => ({
                  x: item.x,
                  y: item.y !== null ? item.y : 0
                }));

                if (modifiedData.length === 0) {
                  console.error('No valid data points to display.');
                  return;
                }

                // Check if the dropdown element is found
                if (dropdown) {


                  Highcharts.chart('bar-chart-canvas', {
                    chart: {
                      type: 'column'
                    },
                    title: {
                      text: selectedIndicatorName // Set the title to the selected indicator name
                    },
                    xAxis: {
                      categories: modifiedData.map(item => item.x),
                      // Other xAxis configurations...
                    },
                    series: [{
                      data: modifiedData.map(item => item.y)
                    }]
                  });
                } else {
                  console.error('Dropdown element not found.');
                }

              };

            });
          });

        });

      });
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
