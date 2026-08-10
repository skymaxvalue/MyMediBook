

document.addEventListener("DOMContentLoaded", () => {

    initializeDashboard();

});


function initializeDashboard(){

    setupSearch();

    setupCardNavigation();

}


function setupSearch(){

    const searchInput =
        document.getElementById(
            "dashboardSearch"
        );

    const searchButton =
        document.getElementById(
            "dashboardSearchBtn"
        );

    if(searchInput){

        searchInput.addEventListener(

            "keydown",

            function(event){

                if(event.key === "Enter"){

                    openSearchPage();

                }

            }

        );

    }

    if(searchButton){

        searchButton.addEventListener(

            "click",

            openSearchPage

        );

    }

}
function setupCardNavigation(){

    const cards=document.querySelectorAll(

        ".action-card,.service-card,.billing-card"

    );

    cards.forEach(card=>{

        card.addEventListener(

            "click",

            navigateToCardPage

        );

        card.addEventListener(

            "keydown",

            function(event){

                if(

                    event.key==="Enter"

                    ||

                    event.key===" "

                ){

                    event.preventDefault();

                    navigateToCardPage.call(this);

                }

            }

        );

    });

}



function navigateToCardPage(){

    const page=this.dataset.page;

    if(!page){

        return;

    }

    window.location.href=page;

}



function openSearchPage(){

    const searchInput =
        document.getElementById("dashboardSearch");

    const value =
        searchInput.value.trim();

    if(value===""){

        window.location.href="search-patient.html";

        return;

    }

    window.location.href=
        "search-patient.html?q="+
        encodeURIComponent(value);

}

