
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
      filterOptionCheckmark.empty(); // Clear the checkmark content
      isFilterSelected = false;
    } else {
      // Add the checkmark on the card
      filterOptionCheckmark.html('<span class="bi bi-check check"></span>'); // Add the checkmark content
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
  yearcount = 0;

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
      let table = "";
      let indicatorSelectedType = "yearly";
      let indicatorHtmlSelectAll = document.getElementById(
        "indicator_list_filter_select_all"
      );
      let displayNone = (element) => {
        element.style.display = "none";
      };
      let displayBlock = (element) => {
        element.style.display = "block";
      };
      //Return Selected Year
      let yearTableList = [];

      let yearList = () => {
        yearTableList = [];
        //Year list
        let selectYear = data.year.map(
          ({ id, year_EC, year_GC, is_interval }) => {
            if (!is_interval) {
              return `
            <li>
            <div class="flex-grow-2 filter-submenu"">
               <div class="row ">
                  <div class="col-1"> 
                       <input  type="checkbox" value=${id} name="yearListsCheckBox" id="yearList${id}">
                  </div>
                  <div class="col-11">
                     <label class="form-label" for="yearList${id}" style="font-size: small;">${year_EC} E.C  - ${year_GC} G.C </label></div>
                 </div>
              </div>
            </div>
          </li>
            `;
            }
          }
        ).reverse();

        let selectYearAll = `
        <li>
          <div class="flex-grow-2 filter-submenu"">
             <div class="row ">
                <div class="col-1"> 
                     <input class='form-check' type="checkbox"  id="select_all_year_filter">
                </div>
                <div class="col-11">
                   <label class="form-label" for="select_all_year_filter" style="font-size: small;">Select All</label></div>
               </div>
               <hr>
            </div>
          </div>
        </li>
        `;

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

        let selectAllYear = document.getElementById("select_all_year_filter");

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

        let yearListCheckAll = document.getElementsByName("yearListsCheckBox");

        document.querySelectorAll('#last_5_year, #last_10_year, #last_15_year, #last_20_year').forEach(function (button) {
          button.addEventListener('click', function () {
            var yearsToShow = parseInt(this.textContent, 10);
            var yearCheckboxes = document.querySelectorAll('input[name="yearListsCheckBox"]');
            yearCheckboxes.forEach(function (checkbox, index) {
              checkbox.checked = index < yearsToShow;
            });
            yearCheckboxes[0].dispatchEvent(new Event('change', { bubbles: true })); // Batch change events
            yearTableList = Array.from(yearCheckboxes).filter(function (checkbox) {
              return checkbox.checked;
            }).map(function (checkedCheckbox) {
              var yearData = data.year.find(y => y.id.toString() === checkedCheckbox.value);
              return yearData && !yearData.is_interval ? [yearData.id, yearData.year_EC, yearData.year_GC] : null;
            }).filter(Boolean);
          });
        });


        //Selected Year
        yearListCheckAll.forEach((yearCheckBox) => {
          yearCheckBox.addEventListener("change", (eventYearCheckBox) => {
            if (eventYearCheckBox.target.checked) {
              for (checkedYear of data.year) {
                if (
                  !checkedYear.is_interval &&
                  String(yearCheckBox.value) === String(checkedYear.id)
                ) {
                  if (
                    yearTableList.find(
                      (item) => String(item[0]) == String(checkedYear.id)
                    )
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
                    String(yearCheckBox.value) === String(checkedYear.id)
                  ) {
                    let valueToCheck = [
                      checkedYear.id,
                      checkedYear.year_EC,
                      checkedYear.year_GC,
                    ];

                    for (let i = 0; i < yearTableList.length; i++) {
                      if (
                        String(yearTableList[i][0]) === String(valueToCheck[0])
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
            //Sort Year by Ethiopian Calender
            yearTableList.sort((a, b) => (a[1] > b[1] ? 1 : -1));
          });

        });
      };

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
        document.getElementById("Year_list_filter").innerHTML =
          ' <p class="text-danger">Please Select Indicator</p>';
        document.getElementById(
          "indicator_list_filter_header"
        ).innerHTML =
          ' <p class="text-danger">Please Select Category</p>';
        document.getElementById("indicator_list_filter_body").innerHTML =
          "";
        document.getElementById("indicator_list_filter_select_all").innerHTML =
          "";


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

        $('#category_list_filter').html(selectCategory);


        $('input[name="category_lists"]').on('change', function (eventCategory) {

          document.getElementById("Year_list_filter").innerHTML =
            ' <p class="text-danger">Please Select Indicator</p>';
          document.getElementById(
            "indicator_list_filter_header"
          ).innerHTML =
            ' <p class="text-danger">Please Select Category</p>';
          document.getElementById("indicator_list_filter_body").innerHTML =
            "";

          let selectedCategoryId = eventCategory.target.value;
          let selectYearIndicator = [];
          let selectQuarterlyIndicator = [];
          let selectMonthlyIndicator = [];
          theSelectedCatagory = data.categories.find((item) => String(item.id) == String(selectedCategoryId))

          //Yearly Indicator
          data.indicators.map(
            ({
              title_ENG,
              title_AMH,
              id,
              for_category_id,
              is_deleted,
              type_of,
            }) => {
              if (
                String(for_category_id) === String(selectedCategoryId) &&
                is_deleted == false
              ) {
                let title_amharic = "";

                if (!title_AMH == null) {
                  title_amharic = " - " + title_AMH;
                }

                if (String(type_of) == "yearly") {
                  selectYearIndicator.push(
                    `
                  <li>
                  <div class="flex-grow-2 filter-submenu"">
                     <div class="row ">
                        <div class="col-1"> 
                             <input  type="checkbox" value=${id} name="indicator_lists" id="indicator_list${id}">
                        </div>
                        <div class="col-11">
                           <label class="form-label" for="indicator_list${id}" style="font-size: small;">${title_ENG} ${title_amharic}</label></div>
                       </div>
                    </div>
                  </div>
                </li>
                  `
                  );
                  $(document).on('change', '.filter-submenu input[type="checkbox"], .filter-submenu input[type="radio"]', function () {
                    updateFilterSelection();
                  });
                } else if (String(type_of) == "quarterly") {
                  selectQuarterlyIndicator.push(
                    `
                  <li>
                  <div class="flex-grow-2 filter-submenu"">
                     <div class="row ">
                        <div class="col-1"> 
                             <input  type="checkbox" value=${id} name="indicator_lists" id="indicator_list${id}">
                        </div>
                        <div class="col-11">
                           <label class="form-label" for="indicator_list${id}" style="font-size: small;">${title_ENG} ${title_amharic}</label></div>
                       </div>
                    </div>
                  </div>
                </li>
                  `
                  );
                  $(document).on('change', '.filter-submenu input[type="checkbox"], .filter-submenu input[type="radio"]', function () {
                    updateFilterSelection();
                  });
                } else if (String(type_of) == "monthly") {
                  selectMonthlyIndicator.push(
                    `
                  <li>
                  <div class="flex-grow-2 filter-submenu"">
                     <div class="row ">
                        <div class="col-1"> 
                             <input  type="checkbox" value=${id} name="indicator_lists" id="indicator_list${id}">
                        </div>
                        <div class="col-11">
                           <label class="form-label" for="indicator_list${id}" style="font-size: small;">${title_ENG} ${title_amharic}</label></div>
                       </div>
                    </div>
                  </div>
                </li>
                  `
                  );
                }
              }
              $(document).on('change', '.filter-submenu input[type="checkbox"], .filter-submenu input[type="radio"]', function () {
                updateFilterSelection();
              });
            }
          );

          let indicator_type = ` 
        <div class="row fw-bold" id=options_for_Type>
             <div class="col">
                Yr <span class="badge bg-danger">${selectYearIndicator.length}</span>:  <input type="radio"  checked name="indicator_type_input" value="yearly" id=""> 
             </div>
             <div class="col">
                 Qr <span class="badge bg-danger">${selectQuarterlyIndicator.length}</span>:  <input type="radio" name="indicator_type_input" value="quarterly" id=""> 
             </div>
             <div class="col">
                  Mon <span class="badge bg-danger">${selectMonthlyIndicator.length}</span>:  <input type="radio" name="indicator_type_input" value="monthly" id=""> 
             </div>
        </div>

        <hr class="pt-1">
        `;

          let selectAll = `
                  <li id="">
                    <div class="flex-grow-2 filter-submenu"">
                       <div class="row ">
                          <div class="col-1"> 
                               <input class='form-check' type="checkbox"  id="select_all">
                          </div>
                          <div class="col-11">
                             <label class="form-label" for="select_all" style="font-size: small;">Select All</label></div>
                         </div>
                         <hr>
                      </div>
                    </div>
                  </li>
                  `;
          //Select-all Button for Indicator
          let selectAllIndicator = document.getElementById("select_all");
          let selectedIndictorId = [];

          let indicatorHtmlHeader = document.getElementById(
            "indicator_list_filter_header"
          );
          let indicatorHtmlBody = document.getElementById(
            "indicator_list_filter_body"
          );

          let indicatorListCheckAll =
            document.getElementsByName("indicator_lists");
          //indicator list HTML
          let indicatorHtmlList =
            document.getElementsByName("indicator_lists");
          indicatorHtmlSelectAll.innerHTML = selectAll;
          selectAllIndicator = document.getElementById("select_all");

          if (
            selectYearIndicator.length == 0 &&
            selectQuarterlyIndicator.length == 0 &&
            selectMonthlyIndicator.length == 0
          ) {
            indicatorHtmlHeader.innerHTML =
              '<p class="text-danger">Please select Another Category, No data Found! </p>';
            indicatorHtmlBody.innerHTML = "";
          } else {
            indicatorHtmlHeader.innerHTML = indicator_type;

            if (selectYearIndicator.length == 0) {
              indicatorHtmlBody.innerHTML =
                '<p class="text-danger">Please select Another Time Series, No data Found! </p>';
              displayNone(indicatorHtmlSelectAll);
            } else {
              indicatorHtmlBody.innerHTML = selectYearIndicator.join("");
              displayBlock(indicatorHtmlSelectAll);
            }

            let selectedIndicatorType = document.getElementsByName(
              "indicator_type_input"
            );
            $(document).on('change', '#options_for_Type input[type="radio"]', function () {
              updateFilterSelection();
            });

            selectedIndicatorType.forEach((type) => {
              type.addEventListener("change", () => {
                table = "";
                document.getElementById("Year_list_filter").innerHTML =
                  ' <p class="text-danger">Please Select Indicator</p>';

                if (String(type.value) == "yearly") {
                  indicatorSelectedType = "yearly";
                  if (selectYearIndicator.length == 0) {
                    displayNone(indicatorHtmlSelectAll);
                    indicatorHtmlBody.innerHTML =
                      '<p class="text-danger">Please select Another Time Series, No data Found! </p>';
                  } else {
                    displayBlock(indicatorHtmlSelectAll);
                    indicatorHtmlBody.innerHTML =
                      selectYearIndicator.join("");
                  }
                } else if (String(type.value) == "quarterly") {
                  indicatorSelectedType = "quarterly";
                  if (selectQuarterlyIndicator.length == 0) {
                    displayNone(indicatorHtmlSelectAll);
                    indicatorHtmlBody.innerHTML =
                      '<p class="text-danger">Please select Another Time Series, No data Found! </p>';
                  } else {
                    displayBlock(indicatorHtmlSelectAll);
                    indicatorHtmlBody.innerHTML =
                      selectQuarterlyIndicator.join("");
                  }
                } else if (String(type.value) == "monthly") {
                  indicatorSelectedType = "monthly";
                  if (selectMonthlyIndicator.length == 0) {
                    displayNone(indicatorHtmlSelectAll);
                    indicatorHtmlBody.innerHTML =
                      '<p class="text-danger">Please select Another Time Series, No data Found! </p>';
                  } else {
                    displayBlock(indicatorHtmlSelectAll);
                    indicatorHtmlBody.innerHTML =
                      selectMonthlyIndicator.join("");
                  }
                }

                // Unselect the 'Select All' button
                selectAllIndicator.checked = false;
                selectedIndictorId = []; // Reinitialized the Array
                indicatorHtmlList.forEach((indicatorCheckBox) => {
                  indicatorCheckBox.addEventListener(
                    "change",
                    (eventIndicator) => {
                      if (eventIndicator.target.checked) {
                        selectedIndictorId.push(eventIndicator.target.value);
                      } else {
                        selectedIndictorId = selectedIndictorId.filter(id => id !== eventIndicator.target.value);
                      }

                      // Update the 'Select All' checkbox state based on individual checkboxes
                      selectedIndictorId.checked = indicatorHtmlList.length === selectedIndictorId.length;

                      // Update the year checkboxes based on selected indicators
                      yearList();
                    }
                  );
                });
              });
            });
            if ($('input[name="category_lists"]:checked').length > 0) {
              let allIndicators = selectYearIndicator.concat(selectQuarterlyIndicator, selectMonthlyIndicator);
              indicatorcount = allIndicators.length;
              document.getElementById('seriesAvailableBadge').innerHTML = indicatorcount;
            } else {
              document.getElementById('seriesAvailableBadge').innerHTML = 0;
            }

          }

          selectAllIndicator.addEventListener("change", () => {
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

          indicatorHtmlList.forEach((indicatorCheckBox) => {
            indicatorCheckBox.addEventListener(
              "change",
              (eventIndicator) => {
                if (eventIndicator.target.checked) {
                  selectedIndictorId.push(eventIndicator.target.value);
                } else {
                  selectedIndictorId = selectedIndictorId.filter(id => id !== eventIndicator.target.value);
                }

                // Update the 'Select All' checkbox state based on individual checkboxes
                selectedIndictorId.checked = indicatorHtmlList.length === selectedIndictorId.length;

                // Update the year checkboxes based on selected indicators
                yearList();
              }
            );
          });

          $(document).on('change', '.filter-submenu input[type="checkbox"], .filter-submenu input[type="radio"]', function () {
            updateFilterSelection();
            if (indicatorSelected > 0) {
              document.getElementById('yearAvailableBadge').innerHTML = data.year.length;
            } else {
              document.getElementById('yearAvailableBadge').innerHTML = 0;
            }
          });

          if ($('input[name="category_lists"]:checked').length == 0) {
            document.querySelector('.indicator_filter').innerHTML = ' <p class="text-danger">Please Select Category</p>';
            document.getElementById('Year_list_filter').innerHTML = ' <p class="text-danger">Please Select Indicator</p>'
          }

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

            table = "";
            yearTableList=yearTableList.reverse()
            let dataListViewTable =
              document.getElementById("list_table_view");

            //Type Year Table
            let typeYearTable = () => {
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

              //let indicatorList = data.indicators.filter((item)=>String(item.for_category_id) === String(selectedCategoryId) && selectedIndictorId.includes(String(item.id)) && item.is_deleted == false)
              data.indicators.map(
                ({
                  title_ENG,
                  title_AMH,
                  id,
                  for_category_id,
                  is_deleted,
                }) => {
                  if (
                    String(for_category_id) ===
                    String(selectedCategoryId) &&
                    selectedIndictorId.includes(String(id)) &&
                    is_deleted == false
                  ) {
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
                        if (
                          String(i.parent_id) === String(parent) &&
                          i.is_deleted == false
                        ) {
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
                                String(j[0]) ===
                                String(k.for_datapoint_id) &&
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
                          table_child_list(
                            i.id,
                            i.title_ENG,
                            String(space)
                          );
                        }
                      }
                      return status;
                    };

                    //Child Lists
                    for (let indicator of data.indicators) {
                      if (
                        String(indicator.parent_id) == String(id) &&
                        indicator.is_deleted == false
                      ) {
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
            };

            //Type Month table
            let typeMonthTable = () => {
              table += `
                  <style>
                  table.dataTable th {
                    writing-mode: vertical-lr !important;
                    vertical-align: middle !important;
                    transform: rotate(180deg) !important;
                }
                </style>
                  <table id="newTable" class="table table-bordered table-responsive m-0 p-0" style="width:100%;">
                  <thead>
                    <tr class="text-center">
                    <th style="padding-left: 100px !important;padding-right: 100px !important;" class=" border">Year</th>
                    <th style="padding-left: 100px !important;padding-right: 100px !important;" class=" border">Month</th>`;

              let filterIndicators = data.indicators.filter(
                (item) =>
                  String(item.for_category_id) ===
                  String(selectedCategoryId) &&
                  selectedIndictorId.includes(String(item.id)) &&
                  item.is_deleted == false
              );
              for (filterIndicator of filterIndicators) {
                let title_amharic = "";
                if (!filterIndicator.title_AMH === null)
                  title_amharic = " - " + filterIndicator.title_AMH;

                table += ` <th class="vertical-text border" ">
                         <a href="/user-admin/data-list-detail/${filterIndicator.id}" class="fw-bold text-dark p-0 m-0">${filterIndicator.title_ENG} ${title_amharic}</a>
                         </th>`;

                let childIndicatorList = (parent, space) => {
                  space += String("&nbsp;&nbsp;&nbsp;&nbsp");
                  let status = false;

                  for (let indicator of data.indicators) {
                    if (
                      String(indicator.parent_id) === String(parent) &&
                      indicator.is_deleted == false
                    ) {
                      test = true;
                      table += `
                              <th class="vertical-text fw-normal border" >${space} ${indicator.title_ENG} </th>
                              `;

                      childIndicatorList(indicator.id, String(space));
                    }
                  }
                };
                //Child List
                for (let indicator of data.indicators) {
                  if (
                    String(indicator.parent_id) ==
                    String(filterIndicator.id) &&
                    indicator.is_deleted == false
                  ) {
                    test = true;
                    table += `
                            <th class="vertical-text fw-normal border">&nbsp;&nbsp;  ${indicator.title_ENG} </th>
                            `;

                    childIndicatorList(indicator.id, " ");
                  }
                }
              }

              table += `</tr>
                  </thead>`;

              table += `<tbody>`;

              //year loop
              for (let year of yearTableList) {
                let checkYearPrint = false;

                //month loop
                for (let month of data.month) {
                  table += `
                      <tr class="text-center">`;

                  if (!checkYearPrint) {
                    table += `<td class="border-bottom-0 fw-bold" "">${year[1]} E.C - ${year[2]} G.C</td>`;
                  } else {
                    table += `<td class="border-0"><p style="display:none;" >${year[1]} E.C - ${year[2]} G.C</p></td>`;
                  }

                  table += `                     
                      <td class="fw-bold" >${month.month_AMH}: ${month.month_ENG}</td>`;

                  //Filter parent indicators
                  let indicatorsObject = data.indicators.filter(
                    (item) =>
                      String(item.for_category_id) ===
                      String(selectedCategoryId) &&
                      selectedIndictorId.includes(String(item.id)) &&
                      item.is_deleted == false
                  );

                  for (let indicatorObj of indicatorsObject) {
                    let currentDataValue = data.value.find((item) => {
                      if (
                        String(item.for_month_id) === String(month.id) &&
                        String(item.for_indicator_id) ===
                        String(indicatorObj.id) &&
                        String(item.for_datapoint_id) === String(year[0])
                      ) {
                        return item;
                      }
                    });

                    //Print Main Indicator Value
                    table += `<td class="fw-bold";> ${currentDataValue ? currentDataValue.value : " - "
                      } </td>`;

                    //Filter Only Child Indicator
                    let childIndicators = data.indicators.filter(
                      (item) =>
                        String(item.parent_id) == String(indicatorObj.id) &&
                        !item.is_deleted
                    );

                    let childIndicatorDataValue = (parent) => {
                      let filterChild = data.indicators.filter(
                        (item) =>
                          String(item.parent_id) == String(parent) &&
                          item.is_deleted == false
                      );
                      if (filterChild) {
                        for (indicatorList of filterChild) {
                          valueData = data.value.find((value) => {
                            if (
                              String(value.for_month_id) ===
                              String(month.id) &&
                              String(value.for_indicator_id) ===
                              String(indicatorList.id) &&
                              String(value.for_datapoint_id) ===
                              String(year[0])
                            ) {
                              return value;
                            }
                          });

                          if (valueData) {
                            table += `<td> ${valueData.value} </td>`;
                          } else {
                            table += `<td> - </td>`;
                          }
                          childIndicatorDataValue(indicatorList.id);
                        }
                      }
                    };

                    for (let childIndicator of childIndicators) {
                      valueData = data.value.find((value) => {
                        if (
                          String(value.for_month_id) === String(month.id) &&
                          String(value.for_indicator_id) ===
                          String(childIndicator.id) &&
                          String(value.for_datapoint_id) === String(year[0])
                        ) {
                          return value;
                        }
                      });

                      if (valueData) {
                        table += `<td> ${valueData.value} </td>`;
                      } else {
                        table += `<td> - </td>`;
                      }

                      //Call Child
                      childIndicatorDataValue(childIndicator.id);
                    }
                  }
                  table += `
                    </tr>`;

                  checkYearPrint = true;
                }
              }
              table += `</tbody>`;

              $(document).ready(function () {
                $("#newTable").DataTable({
                  columnDefs: [{ width: 900, targets: 0 }],
                  retrieve: true,
                  ordering: false,
                  responsive: true,
                  paging: true,
                  searching: true,
                  orderNumber: true,
                  lengthMenu: [
                    [36, 72, 108, -1],
                    ["36 rows", "72 rows", "108 rows", "Show all"],
                  ],
                  buttons: [
                    "pageLength", "copy",
                    {
                      extend: "excelHtml5",
                      text: "Save as Excel",
                      customize: function (xlsx) {
                        var sheet = xlsx.xl.worksheets["sheet1.xml"];
                        $("row:nth-child(2) c", sheet).attr("s", "54");
                      },
                    },
                    ,
                    "print",
                  ],
                  dom: "Bfrtip",
                });
              });



            };

            //Type Quarter table
            let typeQuarterTable = () => {
              table += `
                       <style>
                       table.dataTable th {
                        writing-mode: vertical-lr !important;
                        vertical-align: middle !important;
                        transform: rotate(180deg) !important;
                    }
                   </style>
                  <table id="newTable" class="table table-bordered m-0 p-0">
                  <thead>
                    <tr class="text-center">
                    <th style="padding-left: 100px !important;padding-right: 100px !important;" class="vertical-text border">Year</th>
                    <th style="padding-left: 100px !important;padding-right: 100px !important;" class="vertical-text border">Month</th>`;

              let filterIndicators = data.indicators.filter(
                (item) =>
                  String(item.for_category_id) ===
                  String(selectedCategoryId) &&
                  selectedIndictorId.includes(String(item.id)) &&
                  item.is_deleted == false
              );
              for (filterIndicator of filterIndicators) {
                let title_amharic = "";
                if (!filterIndicator.title_AMH === null)
                  title_amharic = " - " + filterIndicator.title_AMH;

                table += ` <th class="vertical-text  border" ">
                         <a href="/user-admin/data-list-detail/${filterIndicator.id}" class="fw-bold text-dark p-0 m-0">${filterIndicator.title_ENG} ${title_amharic}</a>
                         </th>`;

                let childIndicatorList = (parent, space) => {
                  space += String("&nbsp;&nbsp;&nbsp;&nbsp");
                  let status = false;

                  for (let indicator of data.indicators) {
                    if (
                      String(indicator.parent_id) === String(parent) &&
                      indicator.is_deleted == false
                    ) {
                      test = true;
                      table += `
                              <th class="vertical-text fw-normal border" >${space} ${indicator.title_ENG} </th>
                              `;

                      childIndicatorList(indicator.id, String(space));
                    }
                  }
                };
                //Child List
                for (let indicator of data.indicators) {
                  if (
                    String(indicator.parent_id) ==
                    String(filterIndicator.id) &&
                    indicator.is_deleted == false
                  ) {
                    test = true;
                    table += `
                            <th class="vertical-text fw-normal border" >&nbsp;&nbsp;  ${indicator.title_ENG} </th>
                            `;

                    childIndicatorList(indicator.id, " ");
                  }
                }
              }

              table += `</tr>
                  </thead>`;

              table += `<tbody>`;

              //year loop
              for (let year of yearTableList) {
                let checkYearPrint = false;

                //month loop
                for (let quarter of data.quarter) {
                  table += `
                      <tr class="text-center">`;

                  if (!checkYearPrint) {
                    table += `<td style="width: 28%;"  class="border-bottom-0 fw-bold">${year[1]} E.C - ${year[2]} G.C</td>`;
                  } else {
                    table += ` <td class="border-0"></td>`;
                  }

                  table += `                     
                      <td class="fw-bold" style="width: 22%;" >${quarter.title_ENG}: ${quarter.title_AMH}</td>`;

                  //Filter parent indicators
                  let indicatorsObject = data.indicators.filter(
                    (item) =>
                      String(item.for_category_id) ===
                      String(selectedCategoryId) &&
                      selectedIndictorId.includes(String(item.id)) &&
                      item.is_deleted == false
                  );

                  for (let indicatorObj of indicatorsObject) {
                    let currentDataValue = data.value.find((item) => {
                      if (
                        String(item.for_quarter_id) ===
                        String(quarter.id) &&
                        String(item.for_indicator_id) ===
                        String(indicatorObj.id) &&
                        String(item.for_datapoint_id) === String(year[0])
                      ) {
                        return item;
                      }
                    });

                    //Print Main Indicator Value
                    table += `<td class="fw-bold"  style="width: 10%";> ${currentDataValue ? currentDataValue.value : " - "
                      } </td>`;

                    //Filter Only Child Indicator
                    let childIndicators = data.indicators.filter(
                      (item) =>
                        String(item.parent_id) == String(indicatorObj.id)
                    );

                    let childIndicatorDataValue = (parent) => {
                      let filterChild = data.indicators.filter(
                        (item) =>
                          String(item.parent_id) == String(parent) &&
                          item.is_deleted == false
                      );
                      if (filterChild) {
                        for (indicatorList of filterChild) {
                          valueData = data.value.find((value) => {
                            if (
                              String(value.for_month_id) ===
                              String(month.id) &&
                              String(value.for_indicator_id) ===
                              String(indicatorList.id) &&
                              String(value.for_datapoint_id) ===
                              String(year[0])
                            ) {
                              return value;
                            }
                          });

                          if (valueData) {
                            table += `<td> ${valueData.value} </td>`;
                          } else {
                            table += `<td> - </td>`;
                          }
                          childIndicatorDataValue(indicatorList.id);
                        }
                      }
                    };

                    for (let childIndicator of childIndicators) {
                      valueData = data.value.find((value) => {
                        if (
                          String(value.for_quarter_id) ===
                          String(quarter.id) &&
                          String(value.for_indicator_id) ===
                          String(childIndicator.id) &&
                          String(value.for_datapoint_id) === String(year[0])
                        ) {
                          return value;
                        }
                      });

                      if (valueData) {
                        table += `<td> ${valueData.value} </td>`;
                      } else {
                        table += `<td> - </td>`;
                      }

                      //Call Child
                      childIndicatorDataValue(childIndicator.id);
                    }
                  }
                  table += `
                    </tr>`;

                  checkYearPrint = true;
                }
              }
              table += `</tbody>`;

              $(document).ready(function () {
                $("#newTable").DataTable({
                  retrieve: true,
                  ordering: false,
                  responsive: true,
                  paging: true,
                  searching: true,
                  orderNumber: true,
                  lengthMenu: [
                    [24, 50, 100, -1],
                    ["24 rows", "50 rows", "100 rows", "Show all"],
                  ],
                  buttons: [
                    "pageLength", "copy",
                    {
                      extend: "excelHtml5",
                      text: "Save as Excel",
                      customize: function (xlsx) {
                        var sheet = xlsx.xl.worksheets["sheet1.xml"];
                        $("row:nth-child(2) c", sheet).attr("s", "54");
                      },
                    },
                    ,
                    "print",
                  ],
                  dom: "Bfrtip",
                });
              });


            };

            if (String(indicatorSelectedType) == "yearly") {
              typeYearTable();
            } else if (String(indicatorSelectedType) == "monthly") {
              typeMonthTable();
            } else if (String(indicatorSelectedType) == "quarterly") {
              typeQuarterTable();
            }

            dataListViewTable.innerHTML = table;
            table = "";
          });


          indicatorSelectedType = "yearly";
          //End Indicator table


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
              console.log('indicator type', indicatorSelectedType)


              if (indicatorSelectedType === 'yearly') {
                console.log('hello from yearly ')
                console.log(indicatorSelectedType)
                let area_main = document.getElementById('main_area')
                area_main.style.display = 'block'
                const datasetDropdown = document.getElementById('drop');
                datasetDropdown.style.display = 'none'
                let incicator_drop1 = document.getElementById('drop_two')
                incicator_drop1.style.display = 'none'
                let incicator_drop3 = document.getElementById('drop_three')
                incicator_drop3.style.display = 'none'
                let datasetDropdown1 = document.getElementById('drop_second')
                datasetDropdown1.style.display = 'none'

                document.getElementById('bar-chart-canvas1').style.display = 'none'
                document.getElementById('series-chart-canvas1').style.display = 'none'
                document.getElementById('line-chart-canvas1').style.display = 'none'

                document.getElementById('bar-chart-canvas').style.display = 'block'
                document.getElementById('series-chart-canvas').style.display = 'block'
                document.getElementById('line-chart-canvas').style.display = 'block'

                document.getElementById('bar-chart-canvas2').style.display = 'none'
                document.getElementById('series-chart-canvas2').style.display = 'none'
                document.getElementById('line-chart-canvas2').style.display = 'none'

                // Clear existing charts
                Highcharts.charts.forEach(chart => {
                  if (chart) {
                    chart.destroy();
                  }
                });

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
                    datasetDropdown.style.display = 'none'
                    incicator_drop3.style.display = (this.id === 'bar_btn' || this.id === 'series_btn' || this.id === 'line_btn') ? 'none' : 'none';
                    datasetDropdown1.style.display = (this.id === 'bar_btn' || this.id === 'series_btn' || this.id === 'line_btn') ? 'none' : 'none';
                  });
                });


                // Extract data for the chart
                let chartData = [];
                let indicators = [];

                // Filter indicators based on selectedIndictorId
                let selectedIndicators = data.indicators.filter(({ id, for_category_id, is_deleted }) => {
                  return String(for_category_id) === String(selectedCategoryId) &&
                    selectedIndictorId.includes(String(id)) &&
                    !is_deleted;
                });

                selectedIndicators.forEach(({ title_ENG, id }) => {
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
                  indicators.push({ id, title_ENG });
                });

                // Convert data to JSON
                let jsonData = {
                  indicators: indicators,
                  chartData: chartData
                };


                console.log('indicators from yearly', indicators)
                // Select all elements with the class "indicatorDropdown"
                const dropdowns = document.querySelectorAll(`.indicatorDropdown`);

                // Iterate over each dropdown and update its options
                dropdowns.forEach((dropdown) => {
                  dropdown.innerHTML = '';
                })
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

                  // if (indicatorSelectedType == '') {
                  // Add event listener to the dropdown
                  dropdown.addEventListener('change', function () {
                    const selectedIndictorId = this.value;
                    // Find the selected indicator in jsonData.indicators
                    const selectedIndicator = jsonData.indicators.find(indicator => indicator.id === Number(selectedIndictorId));

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
                  // }

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

              }
              else if (indicatorSelectedType === 'monthly') {
                console.log('hello from monthly');
                console.log(indicatorSelectedType)
                let area_main = document.getElementById('main_area')
                area_main.style.display = 'none'
                let incicator_drop1 = document.getElementById('drop_first')
                incicator_drop1.style.display = 'none'
                let incicator_drop2 = document.getElementById('drop_two')
                incicator_drop2.style.display = 'block'
                let incicator_drop3 = document.getElementById('drop_three')
                incicator_drop3.style.display = 'none'
                let datasetDropdown1 = document.getElementById('drop_second')
                datasetDropdown1.style.display = 'none'



                document.getElementById('bar-chart-canvas').style.display = 'none'
                document.getElementById('series-chart-canvas').style.display = 'none'
                document.getElementById('line-chart-canvas').style.display = 'none'

                document.getElementById('bar-chart-canvas2').style.display = 'none'
                document.getElementById('series-chart-canvas2').style.display = 'none'
                document.getElementById('line-chart-canvas2').style.display = 'none'

                document.getElementById('bar-chart-canvas1').style.display = 'block'
                document.getElementById('series-chart-canvas1').style.display = 'block'
                document.getElementById('line-chart-canvas1').style.display = 'block'

                const navLinks = document.querySelectorAll('.nav-link');
                const datasetDropdown = document.getElementById('drop');
                datasetDropdown.style.display = 'block'
                navLinks.forEach(navLink => {
                  navLink.addEventListener('click', function () {
                    // Toggle the visibility of the label and select elements
                    if (labelElement && selectElement) {
                      // Check if the clicked nav link is the "Area" nav link
                      const isAreaNavLink = this.id === 'area';

                      labelElement.style.display = isAreaNavLink ? 'none' : 'block';
                      selectElement.style.display = isAreaNavLink ? 'none' : 'block';
                    }
                    // Show/hide the second dropdown based on the selected chart type
                    datasetDropdown.style.display = (this.id === 'bar_btn' || this.id === 'series_btn') ? 'block' : 'none';
                    incicator_drop2.style.display = (this.id === 'bar_btn' || this.id === 'series_btn' || this.id === 'line_btn') ? 'block' : 'none';
                    incicator_drop1.style.display = (this.id === 'bar_btn' || this.id === 'series_btn' || this.id === 'line_btn') ? 'none' : 'none';
                    incicator_drop3.style.display = (this.id === 'bar_btn' || this.id === 'series_btn' || this.id === 'line_btn') ? 'none' : 'none';
                    datasetDropdown1.style.display = (this.id === 'bar_btn' || this.id === 'series_btn' || this.id === 'line_btn') ? 'none' : 'none';
                  });
                });


                // Process the data as needed
                let chartData = [];
                let indicators = [];

                // Filter indicators based on selectedIndictorId
                let selectedIndicators = data.indicators.filter(({ id, for_category_id, is_deleted }) => {
                  return String(for_category_id) === String(selectedCategoryId) &&
                    selectedIndictorId.includes(String(id)) &&
                    !is_deleted;
                });

                selectedIndicators.forEach(({ title_ENG, id }) => {
                  indicators.push({ id, title_ENG });
                });

                console.log('indicators from month', indicators)
                // Select all elements with the class "indicatorDropdown"
                const dropdowns = document.querySelectorAll(`.indicatorDropdown1`);
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
                });


                (async () => {
                  /**
                   * Create the chart when all data is loaded
                   * @return {undefined}
                   */
                  async function bar_chart(indc_name, data, selectedname,) {
                    const datasetData1 = data.find(dataset => dataset.name === selectedname)?.data || [];
                    // create the chart
                    Highcharts.stockChart('bar-chart-canvas1', {
                      chart: {
                        alignTicks: false
                      },

                      rangeSelector: {
                        selected: 1
                      },

                      title: {
                        text: indc_name
                      },

                      series: [{
                        type: 'column',
                        name: selectedname,
                        data: datasetData1,
                        dataGrouping: {
                          units: [[
                            'week', // unit name
                            [1] // allowed multiples
                          ], [
                            'month',
                            [1, 2, 3, 4, 6]
                          ]]
                        }
                      }]
                    });
                  }

                  async function draw_line(selectedIndicator, chartData, selectedDataset) {
                    const datasetData = chartData.find(dataset => dataset.name === selectedDataset)?.data || [];

                    // Create the chart
                    Highcharts.stockChart('series-chart-canvas1', {
                      rangeSelector: {
                        selected: 0
                      },
                      title: {
                        text: selectedIndicator
                      },
                      tooltip: {
                        style: {
                          width: '200px'
                        },
                        valueDecimals: 4,
                        shared: true
                      },
                      yAxis: {
                        title: {
                          text: 'Exchange rate'
                        }
                      },
                      series: [{
                        name: selectedDataset,
                        data: datasetData,
                        id: 'dataseries'
                      }]
                    });

                  }
                  // Function to create the dataset dropdown
                  function createDatasetDropdown(chartData) {
                    const datasetDropdown = document.querySelector('.datasetDropdown');
                    console.log('hello')

                    // Clear existing options
                    datasetDropdown.innerHTML = '';

                    // Add options based on the chartData
                    chartData.forEach(dataset => {
                      const option = document.createElement('option');
                      option.value = dataset.name;
                      option.text = dataset.name;
                      datasetDropdown.appendChild(option);
                    });

                    // Trigger change event on the dataset dropdown to update the chart
                    datasetDropdown.dispatchEvent(new Event('change'));
                  }

                  function createChart(series) {
                    //calling to creatr new dopdown menue from the data set names on a single indicator selected 
                    createDatasetDropdown(series)

                    Highcharts.stockChart('line-chart-canvas1', {

                      rangeSelector: {
                        selected: 4
                      },

                      yAxis: {
                        labels: {
                          format: '{#if (gt value 0)}+{/if}{value}%'
                        },
                        plotLines: [{
                          value: 0,
                          width: 2,
                          color: 'silver'
                        }]
                      },

                      plotOptions: {
                        series: {
                          label: {
                            connectorAllowed: false
                          },
                        }
                      },

                      tooltip: {
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
                        valueDecimals: 2,
                        split: true
                      },

                      series
                    });

                  }
                  // Function to fetch and update data based on the selected indicator
                  async function updateChartData(selectedIndicator) {
                    // Clear existing charts
                    Highcharts.charts.forEach(chart => {
                      if (chart) {
                        chart.destroy();
                      }
                    });
                    // Use AJAX or fetch to get data from the server based on the selected indicator
                    const response = await fetch(`/user-admin/json-filter-month/${selectedIndicator}/`);
                    const data = await response.json();

                    // Process the data as needed
                    chartData = [];
                    if (Array.isArray(data)) {
                      data.forEach((category) => {
                        let arr = [];
                        category.data.forEach((dataPoint) => {
                          arr.push([Date.UTC(dataPoint[0][0], dataPoint[0][1] - 1, dataPoint[0][2]), dataPoint[1]]);
                        });
                        chartData.push({ name: category.name, data: arr });
                      });
                    } else {
                      console.error('Invalid or missing data format in the response.');
                    }

                    // Call the createChart function with the updated data
                    createChart(chartData);
                  }

                  // Event listener for dropdown change
                  $('.indicatorDropdown1').change(function () {
                    const selectedIndicator = $(this).val();
                    $('.datasetDropdown').prop('disabled', false);
                    updateChartData(selectedIndicator);
                  });

                  // Initial load with the first indicator (assuming the first indicator is selected by default)
                  const initialIndicator = $('.indicatorDropdown1').val();

                  // Further check and update as needed
                  if (initialIndicator) {
                    updateChartData(initialIndicator);
                  }
                  else {
                    console.error('Initial indicator is not valid or not set correctly.');
                    // Handle the situation where the initial indicator is not valid or not set correctly.
                  }

                  // Event listener for dataset dropdown change
                  $('.datasetDropdown').change(function () {
                    const selectedDataset = $(this).val();
                    const selectedIndicator = $('.indicatorDropdown1').val();
                    bar_chart(selectedIndicator, chartData, selectedDataset);
                    draw_line(selectedIndicator, chartData, selectedDataset);
                  });

                })();
              }
              else {
                console.log('hello from quarterly');
                console.log(indicatorSelectedType)
                let area_main = document.getElementById('main_area')
                area_main.style.display = 'none'
                let incicator_drop1 = document.getElementById('drop_first')
                incicator_drop1.style.display = 'none'
                let datasetDropdown1 = document.getElementById('drop')
                datasetDropdown1.style.display = 'none'
                let incicator_drop2 = document.getElementById('drop_two')
                incicator_drop2.style.display = 'none'
                let incicator_drop3 = document.getElementById('drop_three')
                incicator_drop3.style.display = 'block'



                document.getElementById('bar-chart-canvas').style.display = 'none'
                document.getElementById('series-chart-canvas').style.display = 'none'
                document.getElementById('line-chart-canvas').style.display = 'none'

                document.getElementById('bar-chart-canvas1').style.display = 'none'
                document.getElementById('series-chart-canvas1').style.display = 'none'
                document.getElementById('line-chart-canvas1').style.display = 'none'

                document.getElementById('bar-chart-canvas2').style.display = 'block'
                document.getElementById('series-chart-canvas2').style.display = 'block'
                document.getElementById('line-chart-canvas2').style.display = 'block'



                const navLinks = document.querySelectorAll('.nav-link');
                const datasetDropdown = document.getElementById('drop_second');
                datasetDropdown.style.display = 'block'
                navLinks.forEach(navLink => {
                  navLink.addEventListener('click', function () {
                    // Toggle the visibility of the label and select elements
                    if (labelElement && selectElement) {
                      // Check if the clicked nav link is the "Area" nav link
                      const isAreaNavLink = this.id === 'area';

                      labelElement.style.display = isAreaNavLink ? 'none' : 'block';
                      selectElement.style.display = isAreaNavLink ? 'none' : 'block';
                    }
                    // Show/hide the second dropdown based on the selected chart type
                    datasetDropdown.style.display = (this.id === 'bar_btn' || this.id === 'series_btn') ? 'block' : 'none';
                    incicator_drop1.style.display = (this.id === 'bar_btn' || this.id === 'series_btn' || this.id === 'line_btn') ? 'none' : 'none';
                    incicator_drop3.style.display = (this.id === 'bar_btn' || this.id === 'series_btn' || this.id === 'line_btn') ? 'block' : 'none';
                    incicator_drop2.style.display = (this.id === 'bar_btn' || this.id === 'series_btn' || this.id === 'line_btn') ? 'none' : 'none';
                    datasetDropdown1.style.display = (this.id === 'bar_btn' || this.id === 'series_btn' || this.id === 'line_btn') ? 'none' : 'none';
                  });
                });


                // Process the data as needed
                let chartData = [];
                let indicators = [];

                // Filter indicators based on selectedIndictorId
                let selectedIndicators = data.indicators.filter(({ id, for_category_id, is_deleted }) => {
                  return String(for_category_id) === String(selectedCategoryId) &&
                    selectedIndictorId.includes(String(id)) &&
                    !is_deleted;
                });

                selectedIndicators.forEach(({ title_ENG, id }) => {
                  indicators.push({ id, title_ENG });
                });

                console.log('indicators from quarter', indicators)
                // Select all elements with the class "indicatorDropdown"
                const dropdowns = document.querySelectorAll(`.indicatorDropdown2`);
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
                });


                (async () => {
                  /**
                   * Create the chart when all data is loaded
                   * @return {undefined}
                   */
                  async function bar_chart(indc_name, data, selectedname) {
                    const datasetData1 = data.find(dataset => dataset.name === selectedname)?.data || [];
                    // Convert indc_name to a number (if it's a string)
                    const selectedIndicatorId = parseInt(indc_name, 10);
                    const selectedIndicatorObject = indicators.find(indicator => indicator.id === selectedIndicatorId);

                    // create the chart
                    Highcharts.stockChart('bar-chart-canvas2', {
                      chart: {
                        alignTicks: false
                      },

                      rangeSelector: {
                        selected: 1
                      },

                      title: {
                        text: selectedIndicatorObject.title_ENG
                      },
                      tooltip: {
                        style: {
                          width: '200px'
                        },
                        valueDecimals: 4,
                        shared: true
                        , formatter: function () {
                          const point = this.points[0];
                          const value = point.point.options.quarter;
                          let quarter;

                          switch (value) {
                            case 1:
                              quarter = '1';
                              break;
                            case 3:
                              quarter = '2';
                              break;
                            case 6:
                              quarter = '3';
                              break;
                            case 9:
                              quarter = '4';
                              break;
                            default:
                              quarter = 'Unknown Quarter';
                          }

                          return `<span style="color:${point.color}">${point.series.name}</span>: <b>${point.point.options.quarter}</b><br/>
                Quarter: ${quarter}`;
                        }

                      },

                      series: [{
                        type: 'column',
                        name: selectedname,
                        data: datasetData1,
                        dataGrouping: {
                          units: [[
                            'week', // unit name
                            [1] // allowed multiples
                          ], [
                            'month',
                            [1, 2, 3, 4, 6]
                          ]]
                        }
                      }]
                    });
                  }

                  async function draw_line(selectedIndicator, chartData, selectedDataset) {
                    const datasetData = chartData.find(dataset => dataset.name === selectedDataset)?.data || [];

                    const selectedIndicatorId = parseInt(selectedIndicator, 10);
                    const selectedIndicatorObject = indicators.find(indicator => indicator.id === selectedIndicatorId);

                    // Create the chart
                    Highcharts.stockChart('series-chart-canvas2', {
                      rangeSelector: {
                        selected: 0
                      },
                      title: {
                        text: selectedIndicatorObject.title_ENG
                      },
                      tooltip: {
                        style: {
                          width: '200px'
                        },
                        valueDecimals: 4,
                        shared: true
                        , formatter: function () {
                          const point = this.points[0];
                          const value = point.point.options.quarter;
                          let quarter;

                          switch (value) {
                            case 1:
                              quarter = '1';
                              break;
                            case 3:
                              quarter = '2';
                              break;
                            case 6:
                              quarter = '3';
                              break;
                            case 9:
                              quarter = '4';
                              break;
                            default:
                              quarter = 'Unknown Quarter';
                          }

                          return `<span style="color:${point.color}">${point.series.name}</span>: <b>${point.point.options.quarter}</b><br/>
                Quarter: ${quarter}`;
                        }

                      },
                      yAxis: {
                        title: {
                          text: 'Exchange rate'
                        }
                      },
                      series: [{
                        name: selectedDataset,
                        data: datasetData,
                        id: 'dataseries'
                      }]
                    });

                  }
                  // Function to create the dataset dropdown
                  function createDatasetDropdown(chartData) {
                    const datasetDropdown = document.querySelector('.datasetDropdown1');
                    console.log('hello')

                    // Clear existing options
                    datasetDropdown.innerHTML = '';

                    // Add options based on the chartData
                    chartData.forEach(dataset => {
                      const option = document.createElement('option');
                      option.value = dataset.name;
                      option.text = dataset.name;
                      datasetDropdown.appendChild(option);
                    });

                    // Trigger change event on the dataset dropdown to update the chart
                    datasetDropdown.dispatchEvent(new Event('change'));
                  }

                  // Function to create the chart
                  function createChart(series) {
                    // Calling to create a new dropdown menu from the dataset names on a single indicator selected
                    createDatasetDropdown(series);

                    Highcharts.stockChart('line-chart-canvas2', {
                      rangeSelector: {
                        selected: 4
                      },

                      yAxis: {
                        labels: {
                          format: '{#if (gt value 0)}+{/if}{value}%'
                        },
                        plotLines: [{
                          value: 0,
                          width: 2,
                          color: 'silver'
                        }]
                      },

                      plotOptions: {
                        series: {
                          label: {
                            connectorAllowed: false
                          },
                        }
                      },
                      tooltip: {
                        formatter: function () {
                          const point = this.points[0];
                          const quarter = point.point.options.quarter;


                          switch (quarter) {
                            case 1:
                              return `<span style="color:${point.color}">${point.series.name}</span>: <b>${point.y}</b><br/>Quarter: 1`;
                            case 3:
                              return `<span style="color:${point.color}">${point.series.name}</span>: <b>${point.y}</b><br/>Quarter:  2`;
                            case 6:
                              return `<span style="color:${point.color}">${point.series.name}</span>: <b>${point.y}</b><br/>Quarter:  3`;
                            case 9:
                              return `<span style="color:${point.color}">${point.series.name}</span>: <b>${point.y}</b><br/>Quarter:  4`;
                            default:
                              return `<span style="color:${point.color}">${point.series.name}</span>: <b>${point.y}</b><br/>Quarter: Unknown Quarter`;
                          }
                        },
                        valueDecimals: 2,
                        shared: true
                      },

                      series
                    });

                  }

                  // Function to fetch and update data based on the selected indicator
                  async function updateChartData(selectedIndicator) {
                    // Clear existing charts
                    Highcharts.charts.forEach(chart => {
                      if (chart) {
                        chart.destroy();
                      }
                    });

                    // Use AJAX or fetch to get data from the server based on the selected indicator
                    const response = await fetch(`/user-admin/json-filter-quaarter/${selectedIndicator}/`);
                    const data = await response.json();

                    // Process the data as needed
                    chartData = [];
                    if (Array.isArray(data)) {
                      data.forEach((category) => {
                        let arr = [];
                        category.data.forEach((dataPoint) => {
                          const quarterValue = dataPoint[0][1];
                          arr.push({
                            x: Date.UTC(dataPoint[0][0], quarterValue - 1, dataPoint[0][2]),
                            y: dataPoint[1],
                            quarter: quarterValue
                          });
                        });
                        chartData.push({ name: category.name, data: arr });
                      });


                    } else {
                      console.error('Invalid or missing data format in the response.');
                    }

                    // Call the createChart function with the updated data
                    createChart(chartData);
                  }




                  // Event listener for dropdown change
                  $('.indicatorDropdown2').change(function () {
                    const selectedIndicator = $(this).val();
                    $('.datasetDropdown1').prop('disabled', false);
                    updateChartData(selectedIndicator);
                  });

                  // Initial load with the first indicator (assuming the first indicator is selected by default)
                  const initialIndicator = $('.indicatorDropdown2').val();

                  // Further check and update as needed
                  if (initialIndicator) {
                    updateChartData(initialIndicator);
                  }
                  else {
                    console.error('Initial indicator is not valid or not set correctly.');
                    // Handle the situation where the initial indicator is not valid or not set correctly.
                  }

                  // Event listener for dataset dropdown change
                  $('.datasetDropdown1').change(function () {
                    const selectedDataset = $(this).val();
                    const selectedIndicator = $('.indicatorDropdown2').val();
                    bar_chart(selectedIndicator, chartData, selectedDataset);
                    draw_line(selectedIndicator, chartData, selectedDataset);
                  });

                })();
              }
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
