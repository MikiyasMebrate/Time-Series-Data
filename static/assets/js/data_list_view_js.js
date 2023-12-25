let filterData = () => {
  fetch("/user-admin/json/")
    .then((response) => response.json())
    .then((data) => {
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

        let selectAllYear = document.getElementById("select_all_year_filter");

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

        let yearListCheckAll = document.getElementsByName("yearListsCheckBox");

        //Select last 5 Year
        let lastFiveYear = document.getElementById("last_5_year");
        lastFiveYear.addEventListener("click", () => {
          for (let uncheck = 0; uncheck < yearListCheckAll.length; uncheck++) {
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
          for (let uncheck = 0; uncheck < yearListCheckAll.length; uncheck++) {
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
          for (let uncheck = 0; uncheck < yearListCheckAll.length; uncheck++) {
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
          for (let uncheck = 0; uncheck < yearListCheckAll.length; uncheck++) {
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
          yearCheckBox.addEventListener("change", (eventYearCheckBox) => {
            displayApplyButton.style.display = "block";
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
          document.getElementById("indicator_list_filter_header").innerHTML =
            ' <p class="text-danger">Please Select Category</p>';
          document.getElementById("indicator_list_filter_body").innerHTML = "";
          displayNone(indicatorHtmlSelectAll);

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
                ' <p class="text-danger">Please Select Indicator</p>';
              document.getElementById(
                "indicator_list_filter_header"
              ).innerHTML =
                ' <p class="text-danger">Please Select Category</p>';
              document.getElementById("indicator_list_filter_body").innerHTML =
                "";
              displayApplyButton.style.display = "none";

              let selectedCategoryId = eventCategory.target.value;

              let selectYearIndicator = [];
              let selectQuarterlyIndicator = [];
              let selectMonthlyIndicator = [];

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
                        `
                      );
                    } else if (String(type_of) == "quarterly") {
                      selectQuarterlyIndicator.push(
                        `
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
                        `
                      );
                    } else if (String(type_of) == "monthly") {
                      selectMonthlyIndicator.push(
                        `
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
                        `
                      );
                    }
                  }
                }
              );

              let indicator_type = ` 
              <div class="row fw-bold">
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

                selectedIndicatorType.forEach((type) => {
                  type.addEventListener("change", () => {
                    table = "";
                    displayApplyButton.style.display = "none";
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

                    selectAllIndicator.checked = false;
                    indicatorHtmlList.forEach((indicatorCheckBox) => {
                      indicatorCheckBox.addEventListener(
                        "change",
                        (eventIndicator) => {
                          table = "";
                          displayApplyButton.style.display = "none";
                          if (
                            eventIndicator.target.checked &&
                            !selectedIndictorId.includes(
                              eventIndicator.target.value
                            )
                          ) {
                            selectedIndictorId.push(
                              eventIndicator.target.value
                            );
                          } else {
                            try {
                              selectedIndictorId.pop(
                                eventIndicator.target.value
                              );
                            } catch {
                              null;
                            }
                          }
                          yearList();
                        }
                      );
                    });
                  });
                });
              }

              selectAllIndicator.addEventListener("change", () => {
                displayApplyButton.style.display = "none";
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

              //Display Indicator into Table

              // For Fist TIme Checked Indicator
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
                  <table id="newTable" class="table table-bordered m-0 p-0" style="width: 100%;">
                  <thead>
                    <tr class="text-center">
                    <th  style="width: 40px;"  class="vertical-text border">Year</th>
                    <th style="width: 40px;"  class="vertical-text border">Month</th>`;


                   let filterIndicators =  data.indicators.filter((item) => String(item.for_category_id) === String(selectedCategoryId) && selectedIndictorId.includes(String(item.id)) && item.is_deleted == false )
                    for(filterIndicator of filterIndicators) {
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
                            String(indicator.parent_id) == String(filterIndicator.id) &&
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
                    for (let month of data.month) {
                      table += `
                      <tr class="text-center">`;

                      if (!checkYearPrint) {
                        table += `<td style="width: 28%;"  class="border-bottom-0 fw-bold">${year[1]} E.C - ${year[2]} G.C</td>`;
                      } else {
                        table += ` <td class="border-0"></td>`;
                      }

                      table += `                     
                      <td class="fw-bold" style="width: 22%;" >${month.month_AMH}: ${month.month_ENG}</td>`
                    


                      //Filter parent indicators 
                      let indicatorsObject = data.indicators.filter((item) => String(item.for_category_id) ===  String(selectedCategoryId) && selectedIndictorId.includes(String(item.id)) &&
                      item.is_deleted == false )

                      for(let indicatorObj of indicatorsObject){
                          table+=`<td class="fw-bold"  style="width: 10%";> 5 </td>`
                          //Filter Only Child Indicator 
                          let childIndicators = data.indicators.filter((item)=> String(item.parent_id) == String(indicatorObj.id))


                          let childIndicatorDataValue = (parent)=>{
                            let filterChild = data.indicators.filter((item) => String(item.parent_id) == String(parent) && item.is_deleted == false )
                            if(filterChild){
                              for(indicatorList of filterChild){
                                valueData = data.value.find((value)=> {
                                  if(String(value.for_month_id) === String(month.id) && String(value.for_indicator_id) === String(indicatorList.id) && String(value.for_datapoint_id) === String(year[0])){
                                    return value
                                  }
                                })
      
                                if(valueData){
                                  table+=`<td> ${valueData.value} </td>`
                                }else{
                                  table+=`<td> - </td>`
                                }
                                childIndicatorDataValue(indicatorList.id)
                              }
                            }
                          }



                          for(let childIndicator of childIndicators){
                            valueData = data.value.find((value)=> {
                              if(String(value.for_month_id) === String(month.id) && String(value.for_indicator_id) === String(childIndicator.id) && String(value.for_datapoint_id) === String(year[0])){
                                return value
                              }
                            })
  
                            if(valueData){
                              table+=`<td> ${valueData.value} </td>`
                            }else{
                              table+=`<td> - </td>`
                            }


                            //Call Child
                            childIndicatorDataValue(childIndicator.id)

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
                      scrollX: true,
                      responsive: true,
                      paging: true,
                      searching: true,
                      orderNumber: true,
                      columnDefs: [{ width: "100%" }],
                      lengthMenu: [
                        [24, 50, 100, -1],
                        ["24 rows", "50 rows", "100 rows", "Show all"],
                      ],
                      dom: "Bfrtip",
                      buttons: ["pageLength", "excel", "csv", "pdf", "print"],
                    });
                  });
                };

                if (String(indicatorSelectedType) == "yearly") {
                  typeYearTable();
                } else if (String(indicatorSelectedType) == "monthly") {
                  typeMonthTable();
                }

                let dataListViewTable =
                  document.getElementById("list_table_view");
                dataListViewTable.innerHTML = table;
                table = "";
              });

              indicatorSelectedType = "yearly";
              //End Indicator table
            });
          });
        });
      });
    });
};

filterData();
