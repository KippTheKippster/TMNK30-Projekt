
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
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
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

/*An array containing Place-holder brick names:*/
var countries = ["Brick 1 x 1","Brick 1 x 1 x 3","Brick 1 x 1 x 5 ","Brick 1 x 2","Brick 1 x 2 x 2","Brick 1 x 2 x 3","Brick 1 x 2 x 5","Brick 1 x 3","Brick 1 x 3 x 5","Brick 1 x 4","Brick 1 x 4 x 3","Brick 1 x 6","Brick 1 x 6 x 5","Brick 1 x 8","Brick 1 x 10","Brick 1 x 12","Brick 1 x 16","Brick 2 x 2","Brick 2 x 2 Corner","Brick 2 x 2 x 3","Brick 2 x 3","Brick 2 x 4","Brick 2 x 4 x 3","Brick 2 x 6","Brick 2 x 6 x 3","Brick 2 x 8","Brick 2 x 10","Brick 4 x 4 ","Brick 4 x 6","Brick 4 x 10","Brick 4 x 12","Brick 4 x 18","Brick 8 x 8","Brick 8 x 16","Brick 10 x 10","Brick 10 x 20","Brick 12 x 24","Boat, 14 x 5 x 2 ","Boat, 14 x 5 x 2","Boat, 18 x 8 x 2","Boat, 18 x 8 x 3","Boat, Anchor","Boat, Bow Brick 6 x 6 x 1","Boat, Bow Brick 8 x 10 x 1","Boat, Bow Brick 10 x 12 x 1","Boat, Canoe"];

/*initiate the autocomplete function on the "search_bar" element, and pass along the lego-list array as possible autocomplete values:*/
autocomplete(document.getElementById("search_bar"), countries);
