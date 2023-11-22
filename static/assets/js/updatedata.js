
    let updateCategory = () => {
        fetch("/user-admin/json-filter-indicator/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {

                let btnEditCategory = document.getElementsByName("EditCategory");

                btnEditCategory.forEach((editCategory) => {
                    editCategory.addEventListener("click", () => {
                        let categoryId = editCategory.id;
                        let nameEnglish = $("#form_catagory_edit #id_name_ENG");
                        let nameAmharic = $("#form_catagory_edit #id_name_AMH");
                        let topic = $("#id_topic");

                        let selectedCategory = data.categories.find(
                            (cat) => String(cat.id) === String(categoryId)
                        );

                        if (nameEnglish && nameAmharic && topic && selectedCategory && selectedCategory.topics.length > 0) {
                            nameEnglish.val(selectedCategory.name_ENG);
                            nameAmharic.val(selectedCategory.name_AMH);
                            topic.val(selectedCategory.topics[0].title_AMH)


                            console.log("categoryId:", categoryId);
                            console.log("nameEnglish.value:", nameEnglish.val());
                            console.log("nameAmharic.value:", nameAmharic.val());
                            console.log("topic.value:", selectedCategory.topics[0].title_AMH);

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

    let updatetopic = () => {
        fetch("/user-admin/json-filter-topic/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetched data:", data);
    
                let btnEdittopic = document.getElementsByName("Edittopic");
    
                btnEdittopic.forEach((edittopic) => {
                    edittopic.addEventListener("click", () => {
                        let topicId = edittopic.id;
                        let nameEnglish = $("#form_topic_edit #id_title_ENG");
                        let nameAmharic = $("#form_topic_edit #id_title_AMH");

                            console.log("nameEnglish.value:", nameEnglish.val());
                            console.log("nameAmharic.value:", nameAmharic.val());
                        let selectedtopic = data.topics.find(
                            (cat) => String(cat.id) === String(topicId)
                        );

                        if (nameEnglish && nameAmharic  && selectedtopic) {
                            nameEnglish.val(selectedtopic.title_ENG);
                            nameAmharic.val(selectedtopic.title_AMH);


                            console.log("categoryId:", topicId);
                            console.log("nameEnglish.value:", nameEnglish.val());
                            console.log("nameAmharic.value:", nameAmharic.val());

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
    
$(document).ready(function () {
    console.log('document is ready');
    updatetopic();
    updateCategory();
});
