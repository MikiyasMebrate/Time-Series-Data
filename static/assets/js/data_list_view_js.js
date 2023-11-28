let filterData = () => {
  fetch("/user-admin/json/")
    .then((response) => response.json())
    .then((data) => {
      selectTopic = data.topics.map(
        ({ title_ENG, title_AMH, id, is_deleted }) => {
          if (is_deleted) {
            return null;
          } else {
            return `
              <li>
              <div class="flex-grow-2">
                 <input type="radio" value=${id} name="topic_lists" id="topic_list${id}">
                  <label for="topic_list${id}" style="font-size: small;" class="mb-0">${title_ENG} - ${title_AMH}</label>
                </div>
            </li>
              `;
          }
        }
      );

      //apply Button
      let displayApplyButton = document.getElementById("apply_button");

      topicHtml = document.getElementById("topic_list_filter");
      topicHtml.innerHTML = selectTopic.join("");

      topicHtmlList = document.getElementsByName("topic_lists");
      topicHtmlList.forEach((topicRadio) => {
        topicRadio.addEventListener("change", (event) => {
          document.getElementById("indicator_list_filter").innerHTML =
            ' <p class="text-danger">Please Select Category</p>';
          document.getElementById("Year_list_filter").innerHTML =
            ' <p class="text-danger">Please Select Indicator</p>';
          displayApplyButton.style.display = "none";
          selectedTopicId = event.target.value;
          defaultTable = `
        <table id="example1" class="table table-striped table-responsive">
              <thead>
                <tr>
                  <th class="ps-5 pe-5">Name</th>
                  <th>2000</th>
                  <th>2001</th>
                  <th>2002</th>
                  <th>2003</th>
                  <th>2004</th>
                  <th>2005</th>
                  <th>2006</th>
                  <th>2007</th>
                  <th>2008</th>
                  <th >2009</th>
                  <th>2010</th>
                  <th>2011</th>
                  <th>2012</th>
                  <th>2013</th>
                  <th >2014</th>
                </tr>
              </thead>
            <tbody>
          </tbody>
        </table>
               `;

          document.getElementById("list_table_view").innerHTML = defaultTable;
          table = $("#example1")
            .DataTable({
              retrieve: true,
              ordering: false,
              scrollX: true,
              paging: true,
              searching: false,
              orderNumber: false,
              lengthMenu: [25, 50, 100],
            })
            .buttons()
            .container()
            .appendTo("#example1_wrapper .col-md-6:eq(0)");

          let selectCategory = data.categories.map(
            ({ name_ENG, name_AMH, id, topic_id, is_deleted }) => {
              if (String(topic_id) === String(selectedTopicId)) {
                if (is_deleted) {
                  return null;
                } else {
                  return `
                        <li>
                        <div class="flex-grow-2 ">
                           <div class="row ">
                              <div class="col-1"> 
                                   <input  type="radio" value=${id} name="category_lists" id="category_list${id}">
                              </div>
                              <div class="col-11">
                                 <label class="form-label" for="category_list${id}" style="font-size: small;">${name_ENG} - ${name_AMH}</label></div>
                             </div>
                          </div>
                      </li>
                        `;
                }
              }
            }
          );

          categoryHtml = document.getElementById("category_list_filter");

          if (selectCategory.join("") == "") {
            categoryHtml.innerHTML =
              '<p class="text-danger">Please select Another Category</p>';
          } else {
            categoryHtml.innerHTML = selectCategory.join("");
          }

          categoryHtmlList = document.getElementsByName("category_lists");

          categoryHtmlList.forEach((categoryRadio) => {
            categoryRadio.addEventListener("change", (eventCategory) => {
              document.getElementById("Year_list_filter").innerHTML =
                ' <p class="text-danger">Please Select Category</p>';
              displayApplyButton.style.display = "none";

              let selectedCategoryId = eventCategory.target.value;
              selectIndicator = data.indicators.map(
                ({ title_ENG, title_AMH, id, for_category_id, is_deleted }) => {
                  if (
                    String(for_category_id) === String(selectedCategoryId) &&
                    is_deleted == false
                  ) {
                    let title_amharic = "";

                    if (!title_AMH == null) {
                      title_amharic = " - " + title_AMH;
                    }

                    return `
                            <li>
                            <div class="flex-grow-2 ">
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
                            `;
                  }
                }
              );

              let selectAll = `
                        <li>
                          <div class="flex-grow-2 ">
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

              let indicatorHtml = document.getElementById(
                "indicator_list_filter"
              );

              if (selectIndicator.join("") == "") {
                indicatorHtml.innerHTML =
                  '<p class="text-danger">Please select Another Category</p>';
              } else {
                indicatorHtml.innerHTML = selectAll + selectIndicator.join("");
              }

              //Return Selected Year
              let yearTableList = [];

              let yearList = () => {
                //Year list
                let selectYear = data.year.map(
                  ({ id, year_EC, year_GC, is_interval }) => {
                    if (!is_interval) {
                      return `
                    <li>
                    <div class="flex-grow-2 ">
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
                );

                let selectYearAll = `
                <li>
                  <div class="flex-grow-2 ">
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

                let viewRecentYear = `
                <p class="m-0 mb-1 fw-bold">View Recent Year </p>
                <div class="mb-2">
                  <button class="ms-1 btn btn-outline-primary text-primary bg-white" id="last_5_year">5</button> <button class="ms-1 btn btn-outline-primary text-primary bg-white" id="last_10_year">10</button> <button class="ms-1 btn btn-outline-primary text-primary bg-white" id="last_15_year">15</button> <button class="ms-1 btn btn-outline-primary text-primary bg-white" id="last_20_year">20</button>
                </div>
                <hr>
                `;

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
                      displayApplyButton.style.display = "block";
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
                      displayApplyButton.style.display = "none";
                      yearTableList = [];
                    });
                  }
                });

                let yearListCheckAll =
                  document.getElementsByName("yearListsCheckBox");

                //Select last 5 Year
                let lastFiveYear = document.getElementById("last_5_year");
                lastFiveYear.addEventListener("click", () => {
                  for (
                    let uncheck = 0;
                    uncheck < yearListCheckAll.length;
                    uncheck++
                  ) {
                    try {
                      yearListCheckAll[uncheck].checked = false;
                    } catch {
                      null;
                    }
                  }
                  yearTableList = [];
                  for (let checkedYear = 0; checkedYear < 5; checkedYear++) {
                    try {
                      yearListCheckAll[checkedYear].checked = true;
                    } catch {
                      null;
                    }
                    if (
                      !data.year[checkedYear].is_interval &&
                      String(yearListCheckAll[checkedYear].value) ===
                        String(data.year[checkedYear].id)
                    ) {
                      yearTableList.push([
                        data.year[checkedYear].id,
                        data.year[checkedYear].year_EC,
                        data.year[checkedYear].year_GC,
                      ]);
                    }
                  }
                  displayApplyButton.style.display = "block";
                });

                //Select last 10 Year
                let lastTenYear = document.getElementById("last_10_year");
                lastTenYear.addEventListener("click", () => {
                  for (
                    let uncheck = 0;
                    uncheck < yearListCheckAll.length;
                    uncheck++
                  ) {
                    try {
                      yearListCheckAll[uncheck].checked = false;
                    } catch {
                      null;
                    }
                  }
                  yearTableList = [];
                  for (let checkedYear = 0; checkedYear < 10; checkedYear++) {
                    try {
                      yearListCheckAll[checkedYear].checked = true;
                    } catch {
                      null;
                    }
                    if (
                      !data.year[checkedYear].is_interval &&
                      String(yearListCheckAll[checkedYear].value) ===
                        String(data.year[checkedYear].id)
                    ) {
                      yearTableList.push([
                        data.year[checkedYear].id,
                        data.year[checkedYear].year_EC,
                        data.year[checkedYear].year_GC,
                      ]);
                    }
                  }
                  displayApplyButton.style.display = "block";
                });

                //Select last 15 Year
                let lastFiftyYear = document.getElementById("last_15_year");
                lastFiftyYear.addEventListener("click", () => {
                  for (
                    let uncheck = 0;
                    uncheck < yearListCheckAll.length;
                    uncheck++
                  ) {
                    try {
                      yearListCheckAll[uncheck].checked = false;
                    } catch {
                      null;
                    }
                  }

                  yearTableList = [];
                  for (let checkedYear = 0; checkedYear < 15; checkedYear++) {
                    try {
                      yearListCheckAll[checkedYear].checked = true;
                    } catch {
                      null;
                    }
                    if (
                      !data.year[checkedYear].is_interval &&
                      String(yearListCheckAll[checkedYear].value) ===
                        String(data.year[checkedYear].id)
                    ) {
                      yearTableList.push([
                        data.year[checkedYear].id,
                        data.year[checkedYear].year_EC,
                        data.year[checkedYear].year_GC,
                      ]);
                    }
                  }
                  displayApplyButton.style.display = "block";
                });

                //Select last 20 Year
                let lastTwentyYear = document.getElementById("last_20_year");
                lastTwentyYear.addEventListener("click", () => {
                  for (
                    let uncheck = 0;
                    uncheck < yearListCheckAll.length;
                    uncheck++
                  ) {
                    try {
                      yearListCheckAll[uncheck].checked = false;
                    } catch {
                      null;
                    }
                  }

                  yearTableList = [];
                  for (let checkedYear = 0; checkedYear < 20; checkedYear++) {
                    try {
                      yearListCheckAll[checkedYear].checked = true;
                    } catch {
                      null;
                    }
                    try {
                      if (
                        !data.year[checkedYear].is_interval &&
                        String(yearListCheckAll[checkedYear].value) ===
                          String(data.year[checkedYear].id)
                      ) {
                        yearTableList.push([
                          data.year[checkedYear].id,
                          data.year[checkedYear].year_EC,
                          data.year[checkedYear].year_GC,
                        ]);
                      }
                    } catch {
                      null;
                    }
                  }
                  displayApplyButton.style.display = "block";
                });

                //Selected Year
                yearListCheckAll.forEach((yearCheckBox) => {
                  yearCheckBox.addEventListener(
                    "change",
                    (eventYearCheckBox) => {
                      displayApplyButton.style.display = "block";
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
                              // console.log([checkedYear.id, checkedYear.year_EC,checkedYear.year_GC])
                              // console.log(yearTableList)
                              // console.log(yearTableList.includes(valueToCheck))

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
              };

              //Select-all Button for Indicator
              let selectAllIndicator = document.getElementById("select_all");
              let selectedIndictorId = [];
              selectAllIndicator.addEventListener("change", () => {
                displayApplyButton.style.display = "none";
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
                    displayApplyButton.style.display = "none";
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
                  ({
                    title_ENG,
                    title_AMH,
                    id,
                    for_category_id,
                    is_deleted,
                  }) => {
                    if (
                      String(for_category_id) === String(selectedCategoryId) &&
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
                            table_child_list(i.id, i.title_ENG, String(space));
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
        });
      });
    });
};

filterData();

//AJAX SUBMIT FORM
let form = document.getElementById("addDataForm");
$(document).on("submit", "#addDataForm", function (e) {
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: "/user-admin/data-list/",
    data: {
      topic: $("#id_topic_option").val(),
      category: $("#id_categories_option").val(),
      is_interval: $("#is_interval").val(),
      year: $("#id_year_option").val(),
      indicator: $("#id_indicators_option").val(),
      is_actual: $("#is_actual").val(),
      type: $("#id_type_option").val(),
      value: $("#id_value").val(),
      source: $("#id_source").val(),
    },
    beforeSend: function (xhr, settings) {
      xhr.setRequestHeader(
        "X-CSRFToken",
        $("input[name=csrfmiddlewaretoken]").val()
      );
    },
    success: function (response) {
      if (response == "Successfully Added!") {
        swal({
          title: "Successfully Added! Do you want to Add Another data?",
          icon: "success",
          buttons: ["No", "Yes"],
          dangerMode: true,
        }).then((willProceed) => {
          if (willProceed) {
            const selectElement = document.getElementById(
              "id_indicators_option"
            );
            selectElement.selectedIndex = 0;
            const value = (document.getElementById("id_value").value = "");
          } else {
            location.reload();
          }
        });
      } else if (response == "The Data Already Added") {
        swal({
          title: "The Data Already Submitted!",
          icon: "error",
          buttons: ["No", "Re-Enter"],
          dangerMode: true,
        }).then((willProceed) => {
          if (willProceed) {
          } else {
            location.reload();
          }
        });
      } else {
        swal({
          title: "Please Try Again!",
          icon: "error",
          buttons: ["No", "Re-Enter"],
          dangerMode: true,
        }).then((willProceed) => {
          if (willProceed) {
          } else {
          }
        });
      }
    },

    error: function (error) {
      // handle any errors that occurred during the request
      console.log(error);
      swal({
        title: "Please Try Again!",
        icon: "error",
        buttons: ["No", "Yes"],
        dangerMode: true,
      }).then((willProceed) => {
        if (willProceed) {
          const selectElement = document.getElementById("id_indicators_option");
          selectElement.selectedIndex = 0;

          const value = (document.getElementById("id_value").value = "");
        } else {
          // No option selected
          // Add your code here for the "No" scenario
        }
      });
    },
  });
});
