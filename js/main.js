$('document').ready(() => {
    function autocomplete(input, arr) {
        let currentFocus;

        /*close any already open lists of autocompleted values*/
        closeAllLists();

        if (!input.value) { return false; }
        currentFocus = -1;

        /*create a DIV element that will contain the items (values)*/
        let autoCompleteDiv = document.createElement("div");
        autoCompleteDiv.setAttribute("id", input.id + "autocomplete-list");
        autoCompleteDiv.setAttribute("class", "autocomplete-items");
        autoCompleteDiv.style.height = "300%";
        autoCompleteDiv.style.overflowY = "auto";

        /*append the DIV element as a child of the input group div*/
        input.parentNode.appendChild(autoCompleteDiv);

        /*for each item in the array...*/
        arr.forEach(element => {
            /*create a DIV element for each matching element:*/
            let suggestionDiv = document.createElement("div");

            suggestionDiv.innerHTML = "<p>" + element + "</p>";

            /*insert a input field that will hold the current array item's value:*/
            suggestionDiv.innerHTML += "<input type='hidden' value='" + element + "'>";

            /*execute a function when someone clicks on the item value (DIV element):*/
            suggestionDiv.addEventListener("click", function () {
                /*insert the value for the autocomplete text field:*/
                input.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });

            autoCompleteDiv.appendChild(suggestionDiv);
        });


        /*execute a function presses a key on the keyboard:*/
        input.addEventListener("keydown", function (e) {
            let x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and  make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /* and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
            }
        });
        function addActive(x) {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-active");
            $(".autocomplete-items").scrollTop(0);//set to top
            $(".autocomplete-items").scrollTop(($('.autocomplete-active:first').offset().top - $(".autocomplete-items").height()) - 350);
            console.log();

        }
        function removeActive(x) {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (let i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            let x = document.getElementsByClassName("autocomplete-items");
            for (let i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != input) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }


    const searchCountry = (input, searchText) => {
        let suggestions = [];
        fetch(`https://tripadvisor1.p.rapidapi.com/airports/search?query=${searchText}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
                "x-rapidapi-key": "4833256de4msh821bf8fed67c3c1p1f7df4jsn04f9c41a9d82"
            }
        })
        .then(resp => resp.json())
            .then(data => {
                data.map((element) => {

                    suggestions.push(element.display_name)
                })
                autocomplete(input, suggestions)
            })
            .catch(error => {
                console.log(error);
            });
    }

    const departure = document.getElementById("departure");
    const arrival = document.getElementById("arrival");

    departure.addEventListener('input', () => searchCountry(departure, departure.value));
    arrival.addEventListener('input', () => searchCountry(arrival, arrival.value));
})


