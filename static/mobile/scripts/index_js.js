$(document).ready(function () {

    $.ajax({
      type: "GET",
      url: "/dashboard-api/topic_lists/",
      beforeSend: function () {
        
      },
      complete: function () {
        
      },
      success: function (data) {
       
        const bootstrapColors = [
          "primary",
          "secondary",
          "success",
          "warning",
          "info",
          "dark",
        ];
  
        let cardTopic = ``
        let sideNav = ``;
        let selectedCard = 'border border-secondary shadow-lg border-4'
        console.log(data.topics)
        data.topics.forEach((item) => {
          cardTopic +=` <div class="card card-style m-0 bg-5 shadow-card shadow-card-m" style="height:200px">
          <div class="card-top p-3">
              <a href="#" data-bs-toggle="offcanvas" data-bs-target="#menu-card-more"
                  class="icon icon-xxs bg-white color-black float-end"><i
                      class="bi bi-three-dots font-18"></i></a>
          </div>
          <div class="card-center">
              <div class="bg-theme px-3 py-2 rounded-end d-inline-block">
                  <h1 class="font-13 my-n1">
                      <a class="color-theme" data-bs-toggle="collapse" href="#balance3"
                          aria-controls="balance2">Categories</a>
                  </h1>
                  <div  id="balance3">
                      <h2 class="color-theme font-26">${item.category_count}</h2>
                  </div>
              </div>
          </div>
          <div class="card-overlay bg-black opacity-50"></div>
      </div>`
  
          sideNav += `  <li class="pc-item topic-card" data-id = ${item.id
            } data-category-name = "${item.title_ENG}">
              <a href="#" class="pc-link">
                  <span class="pc-micon">
                      <i class="fa fa-${item.icon.split(",")[1]}"></i>
                  </span>
                  <span class="pc-mtext">${item.title_ENG}</span>   
                  </a>
                  
                  
          </li>
          `
  
          
        });
  
         cardTopic += `
        <div class="col-md-6  col-xl-3 d-none d-md-block topic-card"  data-id="Civil_Service" data-category-name="Civil_Service" id="Civil_Service" bis_skin_checked="1">
        <div class="card  social-widget-card bg-${bootstrapColors[Math.floor(Math.random() * bootstrapColors.length)]}">
                    <div class="card-body d-flex justify-content-between align-items-center p-2" bis_skin_checked="1">
                        <div class="d-flex flex-column" bis_skin_checked="1">
                            <h3 class="text-white m-0">3 +</h3>
                            <span class="m-t-10">Civil Service</span>
                        </div>
                        <i class="fa fa-briefcase" aria-hidden="true"></i>
  
                    </div>
                </div>
            </div>
        `;
        cardTopic += `
        <!-- custom cards -->
        <div class="col-md-6  col-xl-3 d-none d-md-block topic-card" data-id = "project" data-category-name = "project">
           <div class="card  social-widget-card bg-${bootstrapColors[Math.floor(Math.random() * bootstrapColors.length)]}">
               <div class="card-body d-flex justify-content-between align-items-center p-2">
                   <div class="d-flex flex-column">
                       <h3 class="text-white m-0">3 +</h3>
                       <span class="m-t-10">Project</span>
                   </div>
                   <i class="fa fa-cogs" aria-hidden="true"></i>
               </div>
           </div>
       </div>
       `;
  
       sideNav += `  <li class="pc-item topic-card" data-id = "Civil_Service" data-category-name = "Civil_Service">
         <a href="#" class="pc-link">
             <span class="pc-micon">
             <i class="fa fa-briefcase" aria-hidden="true"></i>
             </span>
             <span class="pc-mtext">Civil Service</span>   
             </a>     
     </li>
     `
       sideNav += `  <li class="pc-item topic-card" data-id = "project" data-category-name = "project">
         <a href="#" class="pc-link">
             <span class="pc-micon">
             <i class="fa fa-cogs" aria-hidden="true"></i>
             </span>
             <span class="pc-mtext">Project</span>   
             </a>     
     </li>
     `
        $("#mobile-collapse").click(function(){
          $("#sidebarHtml").removeClass("d-none")
        })
        
        $("#splide__slide").html(cardTopic);
        console.log( $("#splide__slide"))
        $("#sidebar-topic-list").html(sideNav);
  
      },
    
    });
  

    
  });