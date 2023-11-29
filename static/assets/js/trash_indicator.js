$(document).ready(function () {
  let filterIndicator = () => {
    fetch("/user-admin/json/")
      .then((response) => response.json())
      .then((data) => {
        //Add New indicator
        selectTopicOptions = data.topics.map(
          ({ title_ENG, title_AMH, id, is_deleted }) => {
            if (!is_deleted) {
              return `<option value="${id}">${title_ENG}</option>`;
            }
          }
        );

        let titleEnglish = document.getElementById("id_title_ENG");
        let titleAmharic = document.getElementById("id_title_AMH");
        let category = document.getElementById("id_for_category");
        let category_div = document.getElementById("id_category_option");
        let parentContainer = document.querySelector("#list_table_view");

        //Edit Indicator Function
        let editIndicatorModal = () => {
          let btnEdit = document.getElementsByName("EditIndicator");
          btnEdit.forEach((editIndicator) => {
            editIndicator.addEventListener("click", () => {
              let indicatorId = editIndicator.id;
              category_div.style.display = "block";
              let selectedIndicator = data.indicators.find(
                (indicator) => String(indicator.id) == String(indicatorId)
              );
              let selectCategory = data.categories.find(
                (cat) =>
                  String(cat.id) == String(selectedIndicator.for_category_id)
              );
              if (selectedIndicator.title_AMH == null)
                selectedIndicator.title_AmH = "";
              titleEnglish.value = selectedIndicator.title_ENG;
              titleAmharic.value = selectedIndicator.title_AMH;
              category.value = selectCategory.id;
              document.getElementById("id_indicator_id").value = indicatorId;
            });
          });
        };

        //Remove Indicators Function
        let removeIndicatorModal = () => {
          let btnDelete = document.getElementsByName("btnDeleteIndicator");
          btnDelete.forEach((deleteIndicator) => {
            deleteIndicator.addEventListener("click", () => {
              console.log(deleteIndicator.id);
              let approveAnchor = document.getElementById("forRemoveIndicator");
              approveAnchor.setAttribute(
                "href",
                `/user-admin/indicator-delete/${deleteIndicator.id}`
              );
              console.log(approveAnchor);
            });
          });
        };

        //Call for First Time
        editIndicatorModal();
        removeIndicatorModal();

        //Call After table is Changed
        parentContainer.addEventListener("click", (event) => {
          //Edit Indicator re-initializing
          editIndicatorModal();
          //Remove Indicator re-initializing
          removeIndicatorModal();
        });

        selectTopic = data.topics.map(
          ({ title_ENG, title_AMH, id, is_deleted }) => {
            if (!is_deleted) {
              let countDeletedIndicatorCategory = 0;

              for (let i of data.categories) {
                if (String(i.topic_id) === String(id)) {
                  //Count Deleted Indicator Start

                  let countDeleteIndicatorChild = (parentIndicator) => {
                    for (let childIndicator of data.indicators) {
                      if (
                        String(childIndicator.parent_id) ==
                        String(parentIndicator.id)
                      ) {
                        countDeletedIndicatorCategory++;
                        countDeleteIndicatorChild(childIndicator);
                      }
                    }
                  };

                  let checkIndicatorChildIsDeleted = (parentIndicator) => {
                    for (let childIndicator of data.indicators) {
                      if (
                        String(childIndicator.parent_id) ==
                          String(parentIndicator.id) &&
                        childIndicator.is_deleted
                      ) {
                        countDeletedIndicatorCategory++;
                        countDeleteIndicatorChild(childIndicator);
                      } else if (
                        String(childIndicator.parent_id) ==
                        String(parentIndicator.id)
                      ) {
                        checkIndicatorChildIsDeleted(childIndicator);
                      }
                    }
                  };

                  for (parentIndicator of data.indicators) {
                    if (
                      String(parentIndicator.for_category_id) == String(i.id)
                    ) {
                      if (parentIndicator.is_deleted) {
                        countDeletedIndicatorCategory++;
                        countDeleteIndicatorChild(parentIndicator);
                      } else {
                        for (childIndicator of data.indicators) {
                          if (
                            String(childIndicator.parent_id) ==
                            String(parentIndicator.id)
                          ) {
                            if (childIndicator.is_deleted) {
                              countDeletedIndicatorCategory++;
                              countDeleteIndicatorChild(childIndicator);
                            } else {
                              checkIndicatorChildIsDeleted(childIndicator);
                            }
                          }
                        }
                      }
                    }
                  }
                  //End count Indicator End
                }
              }

              console.log(countDeletedIndicatorCategory);
              if (!countDeletedIndicatorCategory == 0) {
                return `
                <li>
                <div class="flex-grow-2">
                   <input type="radio" value=${id} name="topic_lists" id="topic_list${id}">
                    <label for="topic_list${id}" style="font-size: small;" class="mb-0">${title_ENG} - ${title_AMH}</label>
                  </div>
              </li>
                `;
              } else {
                null;
              }
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
            displayApplyButton.style.display = "none";
            selectedTopicId = event.target.value;

            let selectCategory = data.categories.map(
              ({ name_ENG, name_AMH, id, topic_id, is_deleted }) => {
                if (String(topic_id) === String(selectedTopicId)) {
                  if (!is_deleted) {
                    //Count Deleted Indicator Start
                    let countDeletedIndicator = 0;

                    let countDeleteIndicatorChild = (parentIndicator) => {
                      for (let childIndicator of data.indicators) {
                        if (
                          String(childIndicator.parent_id) ==
                          String(parentIndicator.id)
                        ) {
                          countDeletedIndicator++;
                          countDeleteIndicatorChild(childIndicator);
                        }
                      }
                    };

                    let checkIndicatorChildIsDeleted = (parentIndicator) => {
                      for (let childIndicator of data.indicators) {
                        if (
                          String(childIndicator.parent_id) ==
                            String(parentIndicator.id) &&
                          childIndicator.is_deleted
                        ) {
                          countDeletedIndicator++;
                          countDeleteIndicatorChild(childIndicator);
                        } else if (
                          String(childIndicator.parent_id) ==
                          String(parentIndicator.id)
                        ) {
                          checkIndicatorChildIsDeleted(childIndicator);
                        }
                      }
                    };

                    for (parentIndicator of data.indicators) {
                      if (
                        String(parentIndicator.for_category_id) == String(id)
                      ) {
                        if (parentIndicator.is_deleted) {
                          countDeletedIndicator++;
                          countDeleteIndicatorChild(parentIndicator);
                        } else {
                          for (childIndicator of data.indicators) {
                            if (
                              String(childIndicator.parent_id) ==
                              String(parentIndicator.id)
                            ) {
                              if (childIndicator.is_deleted) {
                                countDeletedIndicator++;
                                countDeleteIndicatorChild(childIndicator);
                              } else {
                                checkIndicatorChildIsDeleted(childIndicator);
                              }
                            }
                          }
                        }
                      }
                    }
                    //End count Indicator End

                    if (!countDeletedIndicator == 0) {
                      return `
                      <li>
                      <div class="flex-grow-2 ">
                         <div class="row ">
                            <div class="col-1"> 
                                 <input  type="radio" value=${id} name="category_lists" id="category_list${id}">
                            </div>
                            <div class="col-10">
                               <label class="form-label" for="category_list${id}" style="font-size: small;">${name_ENG} - ${name_AMH}</label> <span class="ms-1 position-absolute  badge bg-danger">${countDeletedIndicator}</span></div>
                            </div>
                        </div>
                      </div>
                    </li>
                      `;
                    }
                  }
                }
              }
            );

            categoryHtml = document.getElementById("category_list_filter");
            categoryHtml.innerHTML = selectCategory.join("");
            categoryHtmlList = document.getElementsByName("category_lists");

            categoryHtmlList.forEach((radioCategory) => {
              radioCategory.addEventListener("change", () => {
                displayApplyButton.style.display = "block";
                let tableHtmlIndicator =
                  document.getElementById("list_table_view");

                displayApplyButton.addEventListener("click", () => {
                  //Updated Your table Here
                  let table = "";
                  table += `
              <table id="newTable" class="table table-bordered m-0 p-0">
              <thead>
                <tr>
                  <th class="ps-5 pe-5">Name</th>`;

                  for (let year of data.year) {
                    table += `<th style="font-size: small;">${year.year_EC}-E.C </br>${year.year_GC}<span>-G.C</span></th>`;
                  }
                  table += `</tr>
              </thead> 
              <tbody>`;

                  let tableDeletedIndicatorChild = (parentIndicator, space) => {
                    space += String("&nbsp;&nbsp;&nbsp;&nbsp");
                    for (let childIndicator of data.indicators) {
                      if (
                        String(childIndicator.parent_id) ==
                        String(parentIndicator.id)
                      ) {
                        test = true;

                        //Table Row Start
                        table += `
                                    <tr>
                                      <td class="fw-normal">   
                                          <div class="row">
                                <div class="col-9">
                                 ${space}  ${childIndicator.title_ENG} ${childIndicator.is_deleted}
                                </div>
                                <div class="col-1">
                              
                            </div> 
                                      </td>
                                    `;
                        //Child List
                        let checkParentHasChild = false;
                        for (check of data.indicators) {
                          if (
                            String(check.parent_id) ===
                              String(parentIndicator.id) &&
                            check.is_deleted == false
                          ) {
                            checkParentHasChild = true;
                          }
                        }
                        for (year of data.year) {
                          let statusData = false;
                          for (value of data.value) {
                            if (
                              String(year.id) ===
                                String(value.for_datapoint_id) &&
                              String(childIndicator.id) ===
                                String(value.for_indicator_id)
                            ) {
                              if (checkParentHasChild) {
                                if (value.value != null) {
                                  table += `<td class="text-center fw-bold"> ${value.value} </td>`;
                                } else {
                                  table += `<td class="text-center fw-bold"> - </td>`;
                                }
                              } else {
                                if (value.value != null) {
                                  table += ` <td class="text-center">${value.value}</td>`;
                                } else {
                                  table += ` <td class="text-center"> - </td>`;
                                }
                              }
                              statusData = false;
                              break;
                            } else {
                              statusData = true;
                            }
                          }
                          if (statusData) {
                            if (checkParentHasChild) {
                              table += `<td class="text-center fw-bold"> - </td>`;
                            } else {
                              table += ` <td class="text-center"> - </td>`;
                            }
                          }
                        }
                        tableDeletedIndicatorChild(
                          childIndicator,
                          String(space)
                        );
                      }
                    }
                  };

                  let checkTableDeletedIndicatorChild = (parentIndicator) => {
                    for (let childIndicator of data.indicators) {
                      if (
                        String(childIndicator.parent_id) ==
                          String(parentIndicator.id) &&
                        childIndicator.is_deleted
                      ) {

                        //Add Parent Indicator 

                        
                        test = true;

                        //Table Row Start
                        table += `
                              <tr>
                                <td class="fw-bold">  
                                <div class="row">
                                <div class="col-9">
                                ${childIndicator.title_ENG} ${childIndicator.is_deleted}
                                </div>
                                <div class="col-1">
                              <button type="button" name="btnDeleteIndicator" data-bs-toggle="modal"  data-bs-target="#removeIndicatorModal"  class="btn btn-outline-primary border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Remove Indicator">Restore</button> 
                            </div> 
                                </td>
                              `;
                        //Child List
                        let checkParentHasChild = false;
                        for (check of data.indicators) {
                          if (
                            String(check.parent_id) ===
                              String(parentIndicator.id) &&
                            check.is_deleted == false
                          ) {
                            checkParentHasChild = true;
                          }
                        }
                        for (year of data.year) {
                          let statusData = false;
                          for (value of data.value) {
                            if (
                              String(year.id) ===
                                String(value.for_datapoint_id) &&
                              String(childIndicator.id) ===
                                String(value.for_indicator_id)
                            ) {
                              if (checkParentHasChild) {
                                if (value.value != null) {
                                  table += `<td class="text-center fw-bold"> ${value.value} </td>`;
                                } else {
                                  table += `<td class="text-center fw-bold"> - </td>`;
                                }
                              } else {
                                if (value.value != null) {
                                  table += ` <td class="text-center">${value.value}</td>`;
                                } else {
                                  table += ` <td class="text-center"> - </td>`;
                                }
                              }
                              statusData = false;
                              break;
                            } else {
                              statusData = true;
                            }
                          }
                          if (statusData) {
                            if (checkParentHasChild) {
                              table += `<td class="text-center fw-bold"> - </td>`;
                            } else {
                              table += ` <td class="text-center"> - </td>`;
                            }
                          }
                        }
                        tableDeletedIndicatorChild(childIndicator, " ");
                      } else if (
                        String(childIndicator.parent_id) ==
                        String(parentIndicator.id)
                      ) {
                        tableDeletedIndicatorChild(childIndicator, " ");
                      }
                    }
                  };

                  //Main Loop
                  for (parentIndicator of data.indicators) {
                    if (
                      String(parentIndicator.for_category_id) ==
                      String(radioCategory.value)
                    ) {
                      if (parentIndicator.is_deleted) {
                        let checkParentHasChild = false;
                        for (check of data.indicators) {
                          if (
                            String(check.parent_id) ===
                              String(parentIndicator.id) &&
                            check.is_deleted == false
                          ) {
                            checkParentHasChild = true;
                          }
                        }
                        table += `
                                 <tr>

                                 <td class="fw-bold">  
                                 <div class="row">
                                 <div class="col-9">
                                 ${parentIndicator.title_ENG} ${parentIndicator.title_AMH} --> ${parentIndicator.is_deleted}
                                 </div>
                                 <div class="col-1">
                               <button type="button" name="btnDeleteIndicator" data-bs-toggle="modal"  data-bs-target="#removeIndicatorModal"  class="btn btn-outline-primary border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Remove Indicator">Restore</button> 
                             </div> 
                                 </td>
                                    `;

                        for (year of data.year) {
                          let statusData = false;
                          for (value of data.value) {
                            if (
                              String(year.id) ===
                                String(value.for_datapoint_id) &&
                              String(parentIndicator.id) ===
                                String(value.for_indicator_id)
                            ) {
                              if (checkParentHasChild) {
                                if (value.value != null) {
                                  table += `<td class="text-center fw-bold"> ${value.value} </td>`;
                                } else {
                                  table += `<td class="text-center fw-bold"> - </td>`;
                                }
                              } else {
                                table += ` <td class="text-center">${value.value}</td>`;
                              }

                              statusData = false;
                              break;
                            } else {
                              statusData = true;
                            }
                          }
                          if (statusData) {
                            if (checkParentHasChild) {
                              table += `<td class="text-center fw-bold"> - </td>`;
                            } else {
                              table += ` <td class="text-center"> - </td>`;
                            }
                          }
                        }
                        table += `</tr>`;
                        tableDeletedIndicatorChild(parentIndicator, " ");
                      } else {
                        checkTableDeletedIndicatorChild(parentIndicator);
                      }
                    }
                  }

                  tableHtmlIndicator.innerHTML = table;

                  //tableHtmlIndicator.innerHTML = table;
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
                        { width: "300px", targets: 0 },
                      ],
                      dom: "Bfrtip",
                      buttons: ["pageLength", "excel", "csv", "pdf", "print"],
                    });
                  });
                });
              });
            });
          });
        });
      })
      .catch((err) => console.log(err));
  };

  filterIndicator();
});

// Function to initialize DataTable
function initDataTable(tableId) {
  console.log("Initializing DataTable for table with ID:", tableId);

  // Check if DataTable is already initialized on the table
  if (!$.fn.dataTable.isDataTable("#" + tableId)) {
    $(document).ready(function () {
      $("#" + tableId)
        .DataTable({
          responsive: true,
          lengthChange: true,
          autoWidth: false,
          buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
        })
        .buttons()
        .container()
        .appendTo("#" + tableId + "_wrapper .col-md-6:eq(0)");
    });
  } else {
    console.log("DataTable is already initialized on table with ID:", tableId);
  }
}

// Call the function for each table
initDataTable("deletedTopicsTable");
