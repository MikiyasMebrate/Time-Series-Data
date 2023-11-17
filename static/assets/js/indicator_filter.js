let filterIndicator = () => {
  fetch("/user-admin/json-filter-indicator/")
    .then((response) => response.json())
    .then((data) => {
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
            radioCategory.addEventListener("change", (event) => {
              console.log(event.target.value);
              selectedCategoryId = event.target.value;
              displayApplyButton.style.display = "block";

              //Display Indicators
              displayApplyButton.addEventListener("click", () => {
                let table = "";
                table += `
                      <table   id="tableIndicator" class="table table-bordered m-0 p-0" style="width:100%">
                        <thead>
                           <tr>
                             <th class="ps-5 pe-5">English</th>
                             <th class="ps-5 pe-5">Amharic</th>
                             <th class="ps-5 pe-5">Created</th> 
                             <th class="ps-5 pe-5">Action</th>  
                          </tr>
                        </thead>
                      <tbody>
                      `;
                selectIndicator = data.indicators.map(
                  ({
                    title_ENG,
                    title_AMH,
                    id,
                    for_category_id,
                    created_at,
                  }) => {
                    //Table Row Start
                    if (
                      String(selectedCategoryId) === String(for_category_id)
                    ) {
                      let date = new Date(created_at);
                      if (title_AMH == null) {
                        title_AMH = " - ";
                      }
                      table += `
                      <tr>
                          <td>
                              <div class="row">
                                 <div class="col-10">
                                   <a href="/user-admin/data-list-detail/${id}" style="font-size: small;" class="d-block fw-bold text-dark">${title_ENG}</a>
                                 </div>
                              </div>
                          </td>
                          <td>
                          <div class="row">
                             <div class="col-10">
                               <a  style="font-size: small;" class="d-block fw-bold text-dark">${title_AMH}</a>
                             </div>
                          </div>
                      </td>
                      <td>
                      <div class="row">
                         <div class="col-10">
                           <a  style="font-size: small;" class="d-block fw-bold text-dark">${date.getDay()}/${date.getMonth()}/${date.getFullYear()}</a>
                         </div>
                      </div>
                      </td>
                      <td>
                      <div class="row">
                         <div class="col-10">
                         <button  type="button" name="btnAddIndicator" indicator_id="${id}" data-bs-toggle="modal"  data-bs-target="#addIndicatorModal"  class="btn btn-outline-primary border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add new Sub-Indicator"><i class="fas fa-eye"></i></button> 
                         <button type="button" name="btnEditIndicator" data-bs-toggle="modal" data-bs-target="#editModalIndicator"  indicator_id="${id}" data-bs-toggle="modal"  data-bs-target="#addIndicatorModal"  class="btn btn-outline-warning border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add new Sub-Indicator"><i class="fas fa-pen"></i></button> 
                         <button type="button" name="btnAddIndicator" indicator_id="${id}" data-bs-toggle="modal"  data-bs-target="#addIndicatorModal"  class="btn btn-outline-danger border-0  pt-1 pb-1" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add new Sub-Indicator"><i class="fas  fa-trash"></i></button> 
                         </div>
                      </div>
                      </td>
                      </tr>`;
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
                  $("#tableIndicator").DataTable({
                    retrieve: true,
                    ordering: false,
                    scrollX: true,
                    responsive: true,
                    paging: true,
                    searching: true,
                    orderNumber: true,
                    maintainAspectRatio: true,
                    lengthMenu: [
                      [10, 25, 50, -1],
                      ["10 rows", "25 rows", "50 rows", "Show all"],
                    ],
                    columnDefs: [{ width: "100%" }],
                    dom: "Bfrtip",
                    buttons: ["pageLength", "excel", "csv", "pdf", "print"],
                  });
                });

                let btnEdit = document.getElementsByName("btnEditIndicator");
                console.log(btnEdit);
                btnEdit.forEach((editIndicatorBtn) => {
                  editIndicatorBtn.addEventListener("click", (event) => {
                    console.log("clicked");
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
