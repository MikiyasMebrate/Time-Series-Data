// Function to update category information
let updateCategory = () => {
    // Fetch category data from the server
    fetch("/user-admin/json-filter-indicator/")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Get all elements with the name "EditCategory"
            let btnEditCategory = document.getElementsByName("EditCategory");

            // Add click event listener to each "EditCategory" button
            btnEditCategory.forEach((editCategory) => {
                editCategory.addEventListener("click", () => {
                    // Extract category ID from the button's ID attribute
                    let categoryId = editCategory.id;

                    // Select relevant form elements using jQuery
                    let nameEnglish = $("#form_catagory_edit #id_name_ENG");
                    let nameAmharic = $("#form_catagory_edit #id_name_AMH");
                    let topic = $("#form_catagory_edit #id_topic");

                    // Find the selected category in the fetched data
                    let selectedCategory = data.categories.find(
                        (cat) => String(cat.id) === String(categoryId)
                    );

                    // Check if all necessary elements and data are available
                    if (nameEnglish && nameAmharic && topic && selectedCategory && selectedCategory.topics.length > 0) {
                        // Populate form fields with selected category data
                        nameEnglish.val(selectedCategory.name_ENG);
                        nameAmharic.val(selectedCategory.name_AMH);

                       // Clear existing options
                        $("#id_topic").empty();

                        // Append new options
                        selectedCategory.topics.forEach((selectedTopic) => {
                            let option = new Option(selectedTopic.title_AMH, selectedTopic.id, true, true);
                            $("#id_topic").append(option);
                        });

                        // Manually update the hidden input value to trigger Select2 refresh
                        $("#id_topic").val(selectedCategory.topics.map(topic => topic.id));
                        $("#id_topic").trigger("change");

                        // Log the selected values with both text and ID
                        let selectedOptions = $("#id_topic option:selected").map(function () {
                            return { id: this.value, text: $(this).text() };
                        }).get();
                        console.log('Selected topics:', selectedOptions);


                        // Set the category ID in a hidden field for form submission
                        $("#id_catagory_id").val(categoryId);
                    } else {
                        console.error("Error: Could not find elements or selected category.");
                    }
                });
            });
        })
        .catch((error) => {
            console.error("Fetch error:", error);
        });
};

// Function to update topic information
let updatetopic = () => {
    // Fetch topic data from the server
    fetch("/user-admin/json-filter-topic/")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Get all elements with the name "Edittopic"
            let btnEdittopic = document.getElementsByName("Edittopic");

            // Add click event listener to each "Edittopic" button
            btnEdittopic.forEach((edittopic) => {
                edittopic.addEventListener("click", () => {
                    // Extract topic ID from the button's ID attribute
                    let topicId = edittopic.id;

                    // Select relevant form elements using jQuery
                    let nameEnglish = $("#form_topic_edit #id_title_ENG");
                    let nameAmharic = $("#form_topic_edit #id_title_AMH");

                    // Find the selected topic in the fetched data
                    let selectedtopic = data.topics.find(
                        (cat) => String(cat.id) === String(topicId)
                    );

                    // Check if all necessary elements and data are available
                    if (nameEnglish && nameAmharic  && selectedtopic) {
                        // Populate form fields with selected topic data
                        nameEnglish.val(selectedtopic.title_ENG);
                        nameAmharic.val(selectedtopic.title_AMH);

                        // Set the topic ID in a hidden field for form submission
                        $("#id_topic_id").val(topicId);
                    } else {
                        console.error("Error: Could not find elements or selected topic.");
                    }
                });
            });
        })
        .catch((error) => {
            console.error("Fetch error:", error);
        });
};

// Execute the update functions when the document is ready
$(document).ready(function () {
    console.log('document is ready');
    let parentContainer = document.querySelector("#example");
        //Call After table paginator is Changed
        parentContainer.addEventListener("click", (event) => {
            ////Check Table is Changed
            if (event.target.classList.contains("paginate_button")) {
              //Edit Indicator re-initializing
              updatetopic();
              updateCategory();
            }
        });
});
