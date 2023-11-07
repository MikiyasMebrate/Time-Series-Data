let urlPath = window.location.pathname;
let id = urlPath.replace("/user-admin/data-list-detail/", "");
let url = `/user-admin/json-indicator/${id}/`;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
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

    data.indicators.map(({ title_ENG, title_AMH, id, for_category }) => {
      if (for_category != null) {
        let title_amharic = "";
        if (!title_AMH === null) title_amharic = " - " + title_AMH;
        //Table Row Start
        let checkParentHasChild = false;
        for (check of data.indicators) {
          if (String(check.parent_id) === String(id)) {
            checkParentHasChild = true;
          }
        }
        table += `
             <tr>
             <td class="fw-bold">
                          ${title_ENG} ${title_amharic}
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
                table += `<td class="text-center fw-bold"> ${value.value} </td>`;
              } else {
                table += ` <td class="p-0"><button class="btn btn-outline-secondary border-0 ps-5 pe-5 pt-2 pb-2">${value.value}</button></td>`;
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
              table += ` <td class="p-0"><button class="btn btn-outline-secondary border-0 ps-5 pe-5 pt-2 pb-2"> - </button></td>`;
            }
          }
        }
        table += `</tr>`;
        //Table Row End
        if (checkParentHasChild) {
          for (let indicator of data.indicators) {
            let checkChildHasChild = false;

            for (check of data.indicators) {
              if (String(check.parent_id) === String(indicator.id)) {
                checkChildHasChild = true;
              }
            }

            if (String(indicator.parent_id) == String(id)) {
              test = true;
              //Table Row Start
              table += `
            <tr>
            <td class="fw-normal">
                          &nbsp;&nbsp;&nbsp;&nbsp;  ${indicator.title_ENG}
                        </td>
            `;

              //Child of Child List
              let table_child_list = (parent, space) => {
                space += String("&nbsp;&nbsp;&nbsp;&nbsp");
                let status = false;

                for (i of data.indicators) {
                  if (String(i.parent_id) === String(parent)) {

                    let checkChildOfChildHasChild = false;
                    for (check of data.indicators) {
                      if (String(check.parent_id) === String(i.id)) {
                        checkChildOfChildHasChild = true;
                      }
                    }
                    status = true;
                    //Table Row Start
                    table += `
                    <tr>
                    <td class="fw-normal">
                          &nbsp;&nbsp;&nbsp;&nbsp; ${space} ${i.title_ENG}
                        </td>`;

                    for (year of data.year) {
                      let statusData = false;
                      for (value of data.value) {
                        if (
                          String(year.id) === String(value.for_datapoint_id) &&
                          String(i.id) === String(value.for_indicator_id)
                        ) {
                          if (checkChildOfChildHasChild) {
                            table += `<td class="text-center fw-bold"> ${value.value} </td>`;
                          } else {
                            table += ` <td class="p-0"><button class="btn btn-outline-secondary border-0 ps-5 pe-5 pt-2 pb-2">${value.value}</button></td>`;
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
                          table += ` <td class="p-0"><button class="btn btn-outline-secondary border-0 ps-5 pe-5 pt-2 pb-2"> - </button></td>`;
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
                    String(indicator.id) === String(value.for_indicator_id)
                  ) {
                    if (checkChildHasChild) {
                      table += `<td class="text-center fw-bold"> ${value.value} </td>`;
                    } else {
                      table += ` <td class="p-0"><button class="btn btn-outline-secondary border-0 ps-5 pe-5 pt-2 pb-2">${value.value}</button></td>`;
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
                    table += ` <td class="p-0"><button class="btn btn-outline-secondary border-0 ps-5 pe-5 pt-2 pb-2"> - </button></td>`;
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
    });
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
        columnDefs: [{ width: "100%" }, { width: "200px", targets: 0 }],
        dom: "Bfrtip",
        buttons: ["pageLength", "excel", "csv", "pdf", "print"],
      });
    });
  })
  .catch((err) => console.log(err));
