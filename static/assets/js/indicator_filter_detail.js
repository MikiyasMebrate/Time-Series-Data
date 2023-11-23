$(document).ready(function () {
  let urlPath = window.location.pathname;
  let id = urlPath.replace("/user-admin/indicator-detail/", "");
  let url = `/user-admin/json-indicator/${id}/`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let table = "";
      table += `
    <table id="newTable" class="table table-bordered m-0 p-0" style="width:100%">
    <thead>
      <tr>
        <th class="ps-5 pe-5">Title</th>
        <th class="ps-5 pe-5">Action</th>
      </tr>

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
              if (String(check.parent_id) === String(id)) {
                checkParentHasChild = true;
              }
            }
            table += `
            <tr>
              <td class="fw-bold">
                        ${title_ENG}
              </td>
              <td>
                <button type="button" name="btnAddIndicator" id="${id}" data-bs-toggle="modal"  data-bs-target="#addIndicatorModal"  class="btn btn-outline-primary border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add new Sub-Indicator">+</button>

                <button type="button" name="EditSubIndicator" id="${id}" data-bs-toggle="modal"  data-bs-toggle="modal" data-bs-target="#editModalIndicator"   data-bs-toggle="modal"  data-bs-target="#addIndicatorModal"  class="btn btn-outline-warning border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Edit indicator "><i class="fas fa-pen"></i></button>

                <button type="button" name="btnDeleteSubIndicator" id="${id}" data-bs-toggle="modal"  data-bs-target="#removeIndicatorModal"  class="btn btn-outline-danger border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Remove Indicator"><i class="fas fa-trash"></i></button>
              </td>
            </tr>`;
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
                        &nbsp;&nbsp;&nbsp;&nbsp;  ${indicator.title_ENG}
              </td>
              <td>
              <button type="button" name="btnAddIndicator" id="${indicator.id}" data-bs-toggle="modal"  data-bs-target="#addIndicatorModal"  class="btn btn-outline-primary border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add new Sub-Indicator">+</button>

              <button type="button" name="EditSubIndicator" id="${indicator.id}" data-bs-toggle="modal"  data-bs-toggle="modal" data-bs-target="#editModalIndicator"   data-bs-toggle="modal"  data-bs-target="#addIndicatorModal"  class="btn btn-outline-warning border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Edit indicator "><i class="fas fa-pen"></i></button>

              <button type="button" name="btnDeleteSubIndicator" id="${indicator.id}" data-bs-toggle="modal"  data-bs-target="#removeIndicatorModal"  class="btn btn-outline-danger border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Remove Indicator"><i class="fas fa-trash"></i></button>
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
                          &nbsp;&nbsp;&nbsp;&nbsp; ${space} ${i.title_ENG}
                    </td>
                    <td >
                    <button type="button" name="btnAddIndicator" id="${i.id}" data-bs-toggle="modal"  data-bs-target="#addIndicatorModal"  class="btn btn-outline-primary border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add new Sub-Indicator">+</button>

                    <button type="button" name="EditSubIndicator" id="${i.id}" data-bs-toggle="modal"  data-bs-target="#editModalIndicator"  class="btn btn-outline-warning border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Edit Indicator"><i class="fas fa-pen"></i></button>

                    <button type="button" name="btnDeleteSubIndicator" id="${i.id}" data-bs-toggle="modal"  data-bs-target="#removeIndicatorModal"  class="btn btn-outline-danger border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Remove Indicator"><i class="fas fa-trash"></i></button>
                    </td>
                    </tr>`;

                        //Table Row End

                        //child.push(`<option value=${i.id}> ${space} ${i.title_ENG} ${i.title_AMH} </option>`)
                        table_child_list(i.id, String(space));
                      }
                    }
                  };
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

      document.getElementById("tableTest").innerHTML =
        `<p class="fs-2">Sub-Indicators</p>` + table;

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

          dom: "Bfrtip",
          buttons: ["pageLength", "excel", "csv", "pdf", "print"],
        });
      });

      let parentContainer = document.querySelector("#tableTest");

      let titleEnglish = document.getElementById("id_title_ENG");
      let titleAmharic = document.getElementById("id_title_AMH");
      let category = document.getElementById("id_category_option");

      //Add Indicator Function
      let addSubIndicator = () => {
        let btnAddIndicator = document.getElementsByName("btnAddIndicator");
        btnAddIndicator.forEach((clickableButton) => {
          clickableButton.addEventListener("click", () => {
            let indicatorId = clickableButton.id;
            document.getElementById("addNewIndicatorId").value = indicatorId;
          });
        });
      };
      //Edit Indicator Function
      let editSubIndicator = () => {
        let btnSubIndicatorEdit =
          document.getElementsByName("EditSubIndicator");
        btnSubIndicatorEdit.forEach((editIndicator) => {
          editIndicator.addEventListener("click", () => {
            let indicatorId = editIndicator.id;
            category.style.display = "none";

            let selectedIndicator = data.indicators.find(
              (indicator) => String(indicator.id) == String(indicatorId)
            );

            if (selectedIndicator.title_AMH == null) {
              selectedIndicator.title_AMH = "";
            }

            titleEnglish.value = selectedIndicator.title_ENG;
            titleAmharic.value = selectedIndicator.title_AMH;
            document.getElementById("id_indicator_id").value = indicatorId;
          });
        });
      };

      //Delete Indicator Function
      let removeSubIndicator = () => {
        let btnDeleteSubIndicator = document.getElementsByName(
          "btnDeleteSubIndicator"
        );
        btnDeleteSubIndicator.forEach((deleteIndicator) => {
          deleteIndicator.addEventListener("click", () => {
            console.log(deleteIndicator.id);
            let approveAnchor = document.getElementById("forRemoveIndicator");
            approveAnchor.setAttribute(
              "href",
              `/user-admin/indicator-delete/${deleteIndicator.id}`
            );
          });
        });
      };

      //Before any changes
      editSubIndicator();
      removeSubIndicator();
      addSubIndicator();
      //Call After table is Changed
      parentContainer.addEventListener("click", () => {
        editSubIndicator();
        removeSubIndicator();
        addSubIndicator();
      });
    })
    .catch((err) => console.log(err));
});
