let filterIndicator = () => {
  fetch("/user-admin/json-filter-indicator/")
    .then((response) => response.json())
    .then((data) => {
      // Edit Indicator
      let btnEdit = document.getElementsByName("EditIndicator");

      btnEdit.forEach((editIndicator) => {
        editIndicator.addEventListener("click", () => {
          let indicatorId = editIndicator.id;
          let titleEnglish = document.getElementById("id_title_ENG");
          let titleAmharic = document.getElementById("id_title_AMH");
          let category = document.getElementById("id_for_category");

          let selectedIndicator = data.indicators.find(
            (indicator) => String(indicator.id) == String(indicatorId)
          );
          let selectCategory = data.categories.find(
            (cat) => String(cat.id) == String(selectedIndicator.for_category_id)
          );
          if (selectedIndicator.title_AMH == null)
            selectedIndicator.title_AmH = "";
          titleEnglish.value = selectedIndicator.title_ENG;
          titleAmharic.value = selectedIndicator.title_AMH;
          category.value = selectCategory.id;
          document.getElementById("id_indicator_id").value = indicatorId;
        });
      });

      //remove Indicator
      let btnDelete = document.getElementsByName("btnDeleteIndicator");
      btnDelete.forEach((deleteIndicator)=>{
        deleteIndicator.addEventListener('click', ()=>{
          console.log(deleteIndicator.id)
          let approveAnchor = document.getElementById('forRemoveIndicator')
          approveAnchor.setAttribute('href', `/user-admin/indicator-delete/${deleteIndicator.id}`)
          console.log(approveAnchor)
        })
      })

      selectTopic = data.topics.map(
        ({ title_ENG, title_AMH, id }) =>
          `
                    <li>
                    <div class="flex-grow-2">
                       <input type="radio" value=${id} name="topic_lists" id="topic_list${id}">
                        <label for="topic_list${id}" style="font-size: small;" class="mb-0">${title_ENG} - ${title_AMH}</label>
                      </div>
                  </li>
                    `
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
            ({ name_ENG, name_AMH, id, topics }) => {
              let tID = null;
              try {
                tID = topics[0].id;
              } catch {
                tID = null;
              }
              if (String(tID) === String(selectedTopicId)) {
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
          );

          categoryHtml = document.getElementById("category_list_filter");
          categoryHtml.innerHTML = selectCategory.join("");
          categoryHtmlList = document.getElementsByName("category_lists");

          categoryHtmlList.forEach((radioCategory) => {
            radioCategory.addEventListener("change", () => {
              displayApplyButton.style.display = "block";
              displayApplyButton.setAttribute(
                "href",
                `/user-admin/indicators-list/${radioCategory.value}`
              );

              // Edit Indicator
              let btnEdit = document.getElementsByName("EditIndicator");
              btnEdit.forEach((editIndicator) => {
                editIndicator.addEventListener("click", () => {
                  let indicatorId = editIndicator.id;
                  let titleEnglish = document.getElementById("id_title_ENG");
                  let titleAmharic = document.getElementById("id_title_AMH");
                  let category = document.getElementById("id_for_category");

                  let selectedIndicator = data.indicators.find(
                    (indicator) => String(indicator.id) == String(indicatorId)
                  );
                  let selectCategory = data.categories.find(
                    (cat) =>
                      String(cat.id) ==
                      String(selectedIndicator.for_category_id)
                  );
                  if (selectedIndicator.title_AMH == null)
                    selectedIndicator.title_AmH = "";
                  titleEnglish.value = selectedIndicator.title_ENG;
                  titleAmharic.value = selectedIndicator.title_AMH;
                  category.value = selectCategory.id;
                  document.getElementById("id_indicator_id").value;
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
                        ${title_ENG} 
              </td>
              <td> 
                      <button type="button" name="btnAddIndicator" indicator_id="${id}" data-bs-toggle="modal"  data-bs-target="#addIndicatorModal"  class="btn btn-outline-primary border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add new Sub-Indicator">+</button> 
                      <button type="button" name="btnAddIndicator" indicator_id="${id}" data-bs-toggle="modal"  data-bs-target="#addIndicatorModal"  class="btn btn-outline-warning border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Edit Indicator"><i class="fas fa-pen"></i></button> 
                      <button type="button" name="btnDeleteIndicator" indicator_id="${id}" data-bs-toggle="modal"  data-bs-target="#removeIndicatorModal"  class="btn btn-outline-danger border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Remove Indicator"><i class="fas fa-trash"></i></button> 
              </td>
            </tr>`;
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
              <td> 
              <button type="button" name="btnAddIndicator" indicator_id="${id}" data-bs-toggle="modal"  data-bs-target="#addIndicatorModal"  class="btn btn-outline-primary border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add new Sub-Indicator">+</button> 
              <button type="button" name="btnAddIndicator" indicator_id="${id}" data-bs-toggle="modal"  data-bs-target="#addIndicatorModal"  class="btn btn-outline-warning border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Edit Indicator"><i class="fas fa-pen"></i></button> 
              <button type="button" name="btnDeleteIndicator" indicator_id="${id}" data-bs-toggle="modal"  data-bs-target="#removeIndicatorModal"  class="btn btn-outline-danger border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Remove Indicator"><i class="fas fa-trash"></i></button> 
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
                    </td>
                    <td > 
                    <button type="button" name="btnAddIndicator" indicator_id="${id}" data-bs-toggle="modal"  data-bs-target="#addIndicatorModal"  class="btn btn-outline-primary border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add new Sub-Indicator">+</button> 
                    <button type="button" name="btnAddIndicator" indicator_id="${id}" data-bs-toggle="modal"  data-bs-target="#editModalIndicator"  class="btn btn-outline-warning border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Edit Indicator"><i class="fas fa-pen"></i></button> 
                    <button type="button" name="btnDeleteIndicator" indicator_id="${id}" data-bs-toggle="modal"  data-bs-target="#removeIndicatorModal"  class="btn btn-outline-danger border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Remove Indicator"><i class="fas fa-trash"></i></button> 
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
    });

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
    let btnAddIndicator = document.getElementsByName("btnAddIndicator");
    btnAddIndicator.forEach((clickableButton) => {
      clickableButton.addEventListener("click", (eventButton) => {
        let indicatorId = eventButton.target.getAttribute("indicator_id");
        document.getElementById("addNewIndicatorId").value = indicatorId;
      });
    });

    //Remove Indicator
    let btnRemoveIndicator = document.getElementsByName("btnDeleteIndicator");
    btnRemoveIndicator.forEach((btn) => {
      btn.addEventListener("click", (eventDelete) => {
        let indicatorId = eventDelete.target.getAttribute("indicator_id");
        document
          .getElementById("forRemoveIndicator")
          .setAttribute("href", `/user-admin/indicator-delete/${indicatorId}`);
      });
    });
  })
  .catch((err) => console.log(err));
