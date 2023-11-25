$(document).ready(function () {
  let url = `/user-admin/json-filter-measurement/`;

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

      //Child Measurement

      let measurementChild = (parent, space) => {
        let status = false;
        space += String("&nbsp;&nbsp;&nbsp;&nbsp");
        for (measure of data.measurements) {
          if (String(measure.parent_id) === String(parent.id) && !measure.is_deleted) {
            for (check of data.measurements) {
              if (String(measure.id) === String(check.parent_id)) {
                status = true;
              }
            }
            if (status == true) {
              table += `
                <tr>
                  <td class="fw-bold">
                  &nbsp;&nbsp;&nbsp;&nbsp; ${space} ${measure.Amount_ENG}
                  </td>
                  <td>
                    <button type="button" name="btnAddMeasurement" id="${measure.id}" data-bs-toggle="modal"  data-bs-target="#addIndicatorModal"  class="btn btn-outline-primary border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add new Sub-Indicator">+</button>
    
                    <button type="button" name="EditSubIndicator" id="${measure.id}" data-bs-toggle="modal"  data-bs-toggle="modal" data-bs-target="#editModalIndicator"   data-bs-toggle="modal"  data-bs-target="#addIndicatorModal"  class="btn btn-outline-warning border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Edit indicator "><i class="fas fa-pen"></i></button>
    
                    <button type="button" name="btnDeleteMeasurement" id="${measure.id}" data-bs-toggle="modal"  data-bs-target="#removeIndicatorModal"  class="btn btn-outline-danger border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Remove Indicator"><i class="fas fa-trash"></i></button>
                  </td>
                </tr>`;
              measurementChild(measure, space);
            } else {
              table += `
                <tr>
                  <td class="">
                  &nbsp;&nbsp;&nbsp;&nbsp;  ${space} ${measure.Amount_ENG}
                  </td>
                  <td>
                    <button type="button" name="btnAddMeasurement" id="${measure.id}" data-bs-toggle="modal"  data-bs-target="#addIndicatorModal"  class="btn btn-outline-primary border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add new Sub-Indicator">+</button>
    
                    <button type="button" name="EditSubIndicator" id="${measure.id}" data-bs-toggle="modal"  data-bs-toggle="modal" data-bs-target="#editModalIndicator"   data-bs-toggle="modal"  data-bs-target="#addIndicatorModal"  class="btn btn-outline-warning border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Edit indicator "><i class="fas fa-pen"></i></button>
    
                    <button type="button" name="btnDeleteMeasurement" id="${measure.id}" data-bs-toggle="modal"  data-bs-target="#removeIndicatorModal"  class="btn btn-outline-danger border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Remove Indicator"><i class="fas fa-trash"></i></button>
                  </td>
                </tr>`;
            }
          }
        }
      };

      //Parent Measurement
      for (measurement of data.measurements) {
        if (measurement.parent_id == null && !measurement.is_deleted) {
          table += `
              <tr>
                <td class="fw-bold">
                          ${measurement.Amount_ENG}
                </td>
                <td>
                  <button type="button" name="btnAddMeasurement" id="${measurement.id}" data-bs-toggle="modal"  data-bs-target="#addIndicatorModal"  class="btn btn-outline-primary border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add new Sub-Indicator">+</button>
  
                  <button type="button" name="EditSubIndicator" id="${measurement.id}" data-bs-toggle="modal"  data-bs-toggle="modal" data-bs-target="#editModalIndicator"   data-bs-toggle="modal"  data-bs-target="#addIndicatorModal"  class="btn btn-outline-warning border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Edit indicator "><i class="fas fa-pen"></i></button>
  
                  <button type="button" name="btnDeleteMeasurement" id="${measurement.id}" data-bs-toggle="modal"  data-bs-target="#removeIndicatorModal"  class="btn btn-outline-danger border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Remove Indicator"><i class="fas fa-trash"></i></button>
                </td>
              </tr>`;
              measurementChild(measurement, " ");
        }
       
      }

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
            [25, 50, -1],
            ["25 rows", "50 rows", "Show all"],
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
      let addSubMeasurement = () => {
        let btnAddMeasurement = document.getElementsByName("btnAddMeasurement");
        btnAddMeasurement.forEach((clickableButton) => {
          clickableButton.addEventListener("click", () => {
            let measurementId = clickableButton.id;
            console.log(measurementId)
            document.getElementById("addNewMeasurement").value = measurementId;
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
        let btnDeleteMeasurement = document.getElementsByName(
          "btnDeleteMeasurement"
        );
        btnDeleteMeasurement.forEach((deleteMeasurement) => {
          deleteMeasurement.addEventListener("click", () => {
            let approveAnchor = document.getElementById("forRemoveMeasurement");
            approveAnchor.setAttribute(
              "href",
              `/user-admin/measurement-delete/${deleteMeasurement.id}`
            );
          });
        });
      };

      //Before any changes
      editSubIndicator();
      removeSubIndicator();
      addSubMeasurement();
      //Call After table is Changed
      parentContainer.addEventListener("click", () => {
        editSubIndicator();
        removeSubIndicator();
        addSubMeasurement();
      });
    })
    .catch((err) => console.log(err));
});
