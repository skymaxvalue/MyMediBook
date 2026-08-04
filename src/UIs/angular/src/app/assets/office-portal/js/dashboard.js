

document.addEventListener("DOMContentLoaded", () => {

    initializeDashboard();

});


function initializeDashboard(){

    setupSearch();

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

