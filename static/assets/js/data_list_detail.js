$(document).ready(function () {
  let urlPath = window.location.pathname;
  let pathID = urlPath.replace("/user-admin/data-list-detail/", "");
  let url = `/user-admin/json-indicator/${pathID}/`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let parentIndicator = data.indicators.find((item) => item.parent == null )
        


 
      let currentIndicator = data.indicators.find(
        (indicator) => String(indicator.id) == String(pathID)
      );


      

      //Edit Measurement
      let currentMeasurement = data.measurements.find(
        (measure) => String(measure.id) == String(currentIndicator.measurement)
      );
      
      let measurementOptions = "";
      
      //Child Measurement
      let measurementChild = (parent) => {
        let status = false;

        for (measure of data.measurements) {
          if (String(measure.parent_id) === String(parent.id) && !measure.is_deleted) {
            for (check of data.measurements) {
              if (String(measure.id) === String(check.parent_id) && !measure.is_deleted ) {
                status = true;
              }
            }

            if (status == true) {
              measurementOptions += `<optgroup label="${measure.Amount_ENG}">`;
              measurementChild(measure);
              measurementOptions += ` </optgroup>`;
            } else {
              measurementOptions += `<option value="${measure.id}" >${measure.Amount_ENG}</option>`;
            }
          }
        }
      };

      //Parent Measurement
      for (measure of data.measurements) {
        if (!measure.parent_id && !measure.is_deleted) {
          measurementOptions += `<optgroup label="${measure.Amount_ENG}">`;
          measurementChild(measure);
          measurementOptions += ` </optgroup>`;
        }
      }

      measurementOptions +=
        `<select name="measurement_form" id="measurement_option_id_select" class="form-select">` +
        measurementOptions +
        `</select>`;
      let measurementHtml = document.getElementById("measurementOptionId");
      measurementHtml.innerHTML = measurementOptions;

      try{
        document.getElementById("measurement_option_id_select").value =
        currentMeasurement.id;
      }

        catch{
          null
        }


      let table = "";
      table += `
    <table id="newTable" class="table table-bordered m-0 p-0">
    <thead>
      <tr>
        <th class="ps-5 pe-5">Name</th>`;

       

        for (let year of data.year) {
          let checkActual = data.indicator_point.find((item) => String(item.for_indicator_id) == String(parentIndicator.id) && String(item.for_datapoint_id) == String(year.id))
          let is_actual = null
          let actualId = null
           
          try{
            if(checkActual.is_actual){
            is_actual = 'Actual'
            }else{
              is_actual = "Not Actual"
            }

            actualId = checkActual.id

          }catch{
            is_actual = "No Data"
          }
          
        table += `<th style="font-size: small;" class = "text-center">${year.year_EC}-E.C </br>${year.year_GC}-G.C  <hr> <button id="${actualId}" yearId = ${year.id} name="btnEditIsActual" class="btn btn-sm btn-secondary fw-sm" data-bs-toggle="modal" data-bs-target="#isActualModal" > ${is_actual} </button>   </th>`;
      }

       

      table += `</tr>
    </thead> 
    <tbody>`;

      data.indicators.map(
        ({ title_ENG, title_AMH, id, for_category, is_deleted }) => {
          if (for_category != null && is_deleted == false) {
            let title_amharic = "";
            if (!title_AMH === null) title_amharic = " - " + title_AMH;
            //Table Row Start
            let checkParentHasChild = false;
            for (check of data.indicators) {
              if (
                String(check.parent_id) === String(id) &&
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
                        ${title_ENG} ${title_amharic}
                    </div>
                    <div class="col-1">
                      <button type="button" name="btnAddIndicator" indicator_id="${id}" data-bs-toggle="modal"  data-bs-target="#addIndicatorModal"  class="btn btn-outline-primary border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add new Sub-Indicator">+</button> 
                    </div>
                    <div class="col-1">
                      <button type="button" name="btnDeleteIndicator" indicator_id="${id}" data-bs-toggle="modal"  data-bs-target="#removeIndicatorModal"  class="btn btn-outline-danger border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Remove Indicator">-</button> 
                    </div>
                  </div>
              </td>
               `;

            for (year of data.year) {
              let statusData = false;
              for (value of data.value) {
                if (
                  String(year.id) === String(value.for_datapoint_id) &&
                  String(id) === String(value.for_indicator_id)
                ) {
                  if (checkParentHasChild) {
                    if (value.value != null) {
                      table += `<td class="text-center fw-bold"> ${value.value} </td>`;
                    } else {
                      table += `<td class="text-center fw-bold"> - </td>`;
                    }
                  } else {
                    table += ` <td class="p-0"><button id="${value.id}" value="${value.value}" data-bs-toggle="modal" name="btnIndicator" data-bs-target="#indicatorEditValue" class="btn btn-outline-secondary border-0 ps-5 pe-5 pt-2 pb-2">${value.value}</button></td>`;
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
                  table += ` <td class="p-0"><button data-bs-toggle="modal"  id="${id}-${year.id}" name="btnIndicator" data-bs-target="#indicatorEditValue" class="btn btn-outline-secondary border-0 ps-5 pe-5 pt-2 pb-2"> - </button></td>`;
                }
              }
            }
            table += `</tr>`;
            //Table Row End
            if (checkParentHasChild) {
              for (let indicator of data.indicators) {
                let checkChildHasChild = false;

                for (check of data.indicators) {
                  if (
                    String(check.parent_id) === String(indicator.id) &&
                    check.is_deleted == false
                  ) {
                    checkChildHasChild = true;
                  }
                }

                if (
                  String(indicator.parent_id) == String(id) &&
                  indicator.is_deleted == false
                ) {
                  test = true;
                  //Table Row Start
                  table += `
            <tr>
              <td class="fw-normal">   
                  <div class="row">
                    <div class="col-9">
                        &nbsp;&nbsp;&nbsp;&nbsp;  ${indicator.title_ENG}
                    </div>
                    <div class="col-1">
                        <button type="button" name="btnAddIndicator" indicator_id="${indicator.id}" data-bs-toggle="modal"  data-bs-target="#addIndicatorModal"  class="btn btn-outline-primary border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add new Sub-Indicator">+</button> 
                    </div>
                    <div class="col-1">
                      <button type="button" name="btnDeleteIndicator" indicator_id="${indicator.id}" data-bs-toggle="modal"  data-bs-target="#removeIndicatorModal"  class="btn btn-outline-danger border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Remove Indicator">-</button> 
                    </div>
                  </div>
              </td>
            `;

                  //Child of Child List
                  let table_child_list = (parent, space) => {
                    space += String("&nbsp;&nbsp;&nbsp;&nbsp");
                    let status = false;

                    for (i of data.indicators) {
                      if (
                        String(i.parent_id) === String(parent) &&
                        i.is_deleted == false
                      ) {
                        let checkChildOfChildHasChild = false;
                        for (check of data.indicators) {
                          if (
                            String(check.parent_id) === String(i.id) &&
                            check.is_deleted == false
                          ) {
                            checkChildOfChildHasChild = true;
                          }
                        }
                        status = true;
                        //Table Row Start
                        table += `
                    <tr>
                    <td class="fw-normal">
                      <div class="row">
                        <div class="col-9">
                          &nbsp;&nbsp;&nbsp;&nbsp; ${space} ${i.title_ENG}
                        </div>
                        <div class="col-1">
                          <button type="button" name="btnAddIndicator" indicator_id="${i.id}" data-bs-toggle="modal"  data-bs-target="#addIndicatorModal"  class="btn btn-outline-primary border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add new Sub-Indicator">+</button>
                        </div>
                        <div class="col-1">
                      <button type="button" name="btnDeleteIndicator" indicator_id="${i.id}" data-bs-toggle="modal"  data-bs-target="#removeIndicatorModal"  class="btn btn-outline-danger border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Remove Indicator">-</button> 
                    </div>
                      </div>
                    </td>`;

                        for (year of data.year) {
                          let statusData = false;
                          for (value of data.value) {
                            if (
                              String(year.id) ===
                                String(value.for_datapoint_id) &&
                              String(i.id) === String(value.for_indicator_id)
                            ) {
                              if (checkChildOfChildHasChild) {
                                if (value.value != null) {
                                  table += `<td class="text-center fw-bold"> ${value.value} </td>`;
                                } else {
                                  table += `<td class="text-center fw-bold"> - </td>`;
                                }
                              } else {
                                if (value.value != null) {
                                  table += ` <td class="p-0"><button id="${value.id}" value="${value.value}" data-bs-toggle="modal" name="btnIndicator" data-bs-target="#indicatorEditValue" class="btn btn-outline-secondary border-0 ps-5 pe-5 pt-2 pb-2">${value.value}</button></td>`;
                                } else {
                                  table += ` <td class="p-0"><button id="${value.id}" value="${value.value}" data-bs-toggle="modal" name="btnIndicator" data-bs-target="#indicatorEditValue" class="btn btn-outline-secondary border-0 ps-5 pe-5 pt-2 pb-2"> - </button></td>`;
                                }
                              }
                              statusData = false;
                              break;
                            } else {
                              statusData = true;
                            }
                          }
                          if (statusData) {
                            if (checkChildOfChildHasChild) {
                              table += `<td class="text-center fw-bold"> - </td>`;
                            } else {
                              table += ` <td class="p-0"><button data-bs-toggle="modal" name="btnIndicator"  id="${i.id}-${year.id}" data-bs-target="#indicatorEditValue" class="btn btn-outline-secondary border-0 ps-5 pe-5 pt-2 pb-2"> - </button></td>`;
                            }
                          }
                        }

                        table += `</tr>`;

                        //Table Row End

                        //child.push(`<option value=${i.id}> ${space} ${i.title_ENG} ${i.title_AMH} </option>`)
                        table_child_list(i.id, String(space));
                      }
                    }
                  };

                  //Child List
                  for (year of data.year) {
                    let statusData = false;
                    for (value of data.value) {
                      if (
                        String(year.id) === String(value.for_datapoint_id) &&
                        String(indicator.id) ===
                          String(value.for_indicator_id) &&
                        indicator.is_deleted == false
                      ) {
                        if (checkChildHasChild) {
                          if (value.value != null) {
                            table += `<td class="text-center fw-bold"> ${value.value} </td>`;
                          } else {
                            table += `<td class="text-center fw-bold"> - </td>`;
                          }
                        } else {
                          if (value.value != null) {
                            table += ` <td class="p-0"><button id="${value.id}" value="${value.value}" data-bs-toggle="modal" name="btnIndicator" data-bs-target="#indicatorEditValue" class="btn btn-outline-secondary border-0 ps-5 pe-5 pt-2 pb-2">${value.value}</button></td>`;
                          } else {
                            table += ` <td class="p-0"><button id="${value.id}" value="${value.value}" data-bs-toggle="modal" name="btnIndicator" data-bs-target="#indicatorEditValue" class="btn btn-outline-secondary border-0 ps-5 pe-5 pt-2 pb-2"> - </button></td>`;
                          }
                        }
                        statusData = false;
                        break;
                      } else {
                        statusData = true;
                      }
                    }
                    if (statusData) {
                      if (checkChildHasChild) {
                        table += `<td class="text-center fw-bold"> - </td>`;
                      } else {
                        table += ` <td class="p-0"><button data-bs-toggle="modal" name="btnIndicator"  id="${indicator.id}-${year.id}" data-bs-target="#indicatorEditValue" class="btn btn-outline-secondary border-0 ps-5 pe-5 pt-2 pb-2"> - </button></td>`;
                      }
                    }
                  }

                  table += `</tr>`;

                  //Table Row End

                  if (checkChildHasChild) {
                    table_child_list(indicator.id, " ");
                  }
                }
              }
            }
          }
        }
      );

      document.getElementById("tableTest").innerHTML = table;


      
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
          columnDefs: [{ width: "100%" }, { width: "300px", targets: 0 }],
          dom: "Bfrtip",
          buttons: ["pageLength", "excel", "csv", "pdf", "print"],
        });
      });

      let btnIndicator = document.getElementsByName("btnIndicator");

      btnIndicator.forEach((clickableButton) => {
        clickableButton.addEventListener("click", (eventButton) => {
          let target = eventButton.target.getAttribute("id");
          let form1 = document.getElementById("form_1");
          let form2 = document.getElementById("form_2");
          try {
            target = target.split("-");
            let indicatorId = target[0];
            let yearId = target[1];
            if (yearId != undefined) {
              let indicatorInput = document.getElementById("indicator_id");
              let dataPointInput = document.getElementById("data_point_id");

              indicatorInput.value = indicatorId;
              dataPointInput.value = yearId;

              form2.style.display = "none";
              form1.style.display = "block";
            } else {
              let value_id = eventButton.target.getAttribute("id");
              let value = eventButton.target.getAttribute("value");
              form1.style.display = "none";
              form2.style.display = "block";
              document.getElementById("data_value").value = value_id;
              let setValue = (document.getElementById("id_value_form2").value =
                value);
            }
          } catch {
            null;
          }
        });
      });

      //Add Indicator
      let addIndicator = () => {
        let btnAddIndicator = document.getElementsByName("btnAddIndicator");
        btnAddIndicator.forEach((clickableButton) => {
          clickableButton.addEventListener("click", (eventButton) => {
            let indicatorId = eventButton.target.getAttribute("indicator_id");
            document.getElementById("addNewIndicatorId").value = indicatorId;
          });
        });
      };

      let removeIndicator = () => {
        //Remove Indicator
        let btnRemoveIndicator =
          document.getElementsByName("btnDeleteIndicator");
        btnRemoveIndicator.forEach((btn) => {
          btn.addEventListener("click", (eventDelete) => {
            let indicatorId = eventDelete.target.getAttribute("indicator_id");
            document
              .getElementById("forRemoveIndicator")
              .setAttribute(
                "href",
                `/user-admin/indicator-delete/${indicatorId}`
              );
          });
        });
      };

      addIndicator();
      removeIndicator();

      let parentContainer = document.querySelector("#list_table_view");
      parentContainer.addEventListener("click", () => {
        addIndicator();
        removeIndicator();
      });



      //Edit Actual nesss
      let btnActual = document.getElementsByName('btnEditIsActual')
      btnActual.forEach((btn) =>{
        btn.addEventListener('click', ()=>{
          console.log('clicked', btn.id)
          let selectedYearId = btn.getAttribute('yearId')
          let indicatorPoint  = data.indicator_point.find((item) => String(item.id) == String(btn.id))
          
          
          if(indicatorPoint){
            if(indicatorPoint.is_actual){
              document.getElementById('isActualInput').checked = true
            }else{
              document.getElementById('isActualInput').checked = false
            }
          }
          console.log(selectedYearId)
          document.getElementById('indicatorYearId').value = selectedYearId
        })
      })

    })
    .catch((err) => console.log(err));
});