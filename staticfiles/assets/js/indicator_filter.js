$(document).ready(function () {
  let filterIndicator = () => {
    fetch("/user-admin/json-filter-indicator/")
      .then((response) => response.json())
      .then((data) => {

        //Add New indicator
        selectTopicOptions = data.topics.map(
          ({ title_ENG, title_AMH, id, is_deleted }) =>{
            if(!is_deleted){
              
              return (
                `<option value="${id}">${title_ENG}</option>`
              )
            }
          }
        );
        let topicOption = document.getElementById('topic_option')
        topicOption.innerHTML =  `<option >---------</option>` + selectTopicOptions

        topicOption.addEventListener('change', ()=>{
         let selectedTopic  = topicOption.options[topicOption.selectedIndex].value
         console.log(selectedTopic)

         let categoryOption = data.categories.map(
          ({ name_ENG, name_AMH, id, topic_id, is_deleted}) => {
            if (String(topic_id) === String(selectedTopic)) {
              
              if(!is_deleted){
                console.log('hello')
                return (
                  `<option value="${id}">${name_ENG} - ${name_AMH}</option>`
                )
              }else{
                return null
              }
            }else{
              return null
            }
          }
        );

        document.getElementById('for_category_add').innerHTML = `<option value="" selected="">---------</option>` + categoryOption
        categoryOption = ''
        })
        


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
          ({ title_ENG, title_AMH, id, is_deleted }) =>{
            if(!is_deleted){
              return             `
              <li>
              <div class="flex-grow-2">
                 <input type="radio" value=${id} name="topic_lists" id="topic_list${id}">
                  <label for="topic_list${id}" style="font-size: small;" class="mb-0">${title_ENG} - ${title_AMH}</label>
                </div>
            </li>
              `
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
              ({ name_ENG, name_AMH, id, topic_id, is_deleted}) => {
                if (String(topic_id) === String(selectedTopicId)) {
                  if(!is_deleted){
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
});