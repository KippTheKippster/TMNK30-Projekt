
function autocomplete(inp) {
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    console.log("Pressed");
    loadParts();
    console.log("this.value: " + inp.value + " e: " + e.data);
  });

  function loadParts() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "get_parts.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    let post = "text=" + search_bar.value;
    console.log(search_bar.value);
    xhttp.send(post);

    xhttp.onload = function () {
      //document.getElementById("sets_table").innerHTML = this.responseText;
      //console.log("get parts loaded!: " + this.responseText);
      const result = JSON.parse(this.responseText);
      parts = result;
      sortSearch();
      createVisuals(inp);
    }
  }

  function createVisuals(inp) {
    console.log("starting visuals");
    var a, b, i, val = inp.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", inp.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    inp.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < parts.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      //if (parts[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
      /*create a DIV element for each matching element:*/
      b = document.createElement("DIV");
      /*make the matching letters bold:*/
      b.innerHTML = "<strong>" + parts[i].substr(0, val.length) + "</strong>";
      b.innerHTML += parts[i].substr(val.length);
      /*insert a input field that will hold the current array item's value:*/
      b.innerHTML += "<input type='hidden' value='" + parts[i] + "'>";
      /*execute a function when someone clicks on the item value (DIV element):*/
      b.addEventListener("click", function (e) {
        /*insert the value for the autocomplete text field:*/
        inp.value = this.getElementsByTagName("input")[0].value;
        /*close the list of autocompleted values,
        (or any other open lists of autocompleted values:*/
        closeAllLists();
        updateSets();

      });
      a.appendChild(b);
    }
    //}
  }

  function updateSets() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "get_sets.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    let post = "text=" + search_bar.value;
    console.log(search_bar.value);
    xhttp.send(post);

    xhttp.onload = function () {
      document.getElementById("sets_table").innerHTML = this.responseText;
      connectGoToSetInfo();
    }
  }

  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    //Loads the parts from the database
    //Updates the visual list
    //autocomplete(search_bar, parts)
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
      else {
        updateSets();
        closeAllLists();
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

function sortSearch() {
  console.log("Sorting...");
  let tmp = [];

  for (let j = 0; j < parts.length; j++) {
    let position = 0;
    let length = 999999;

    //Get shortest
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].length < length) {
        position = i;
        length = parts[i].length;
      }
    }

    tmp[j] = parts[position];
    parts.splice(position, 1);
  }

  console.log(tmp, " : ");
  parts = tmp;
}

let parts = []
let firstPress = true;
const search_bar = document.getElementById("search_bar");
console.log("start");

autocomplete(search_bar);

//Modal
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("close");

closeModal();

modalClose.addEventListener("click", closeModal);
connectGoToSetInfo();

function openModal() {
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
  modalBody.innerHTML = "<h1 class='loading'>loading...<h1>";
  console.log("Closing modal...");
}

function loadModal(setID) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "get_set_info.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  let post = "id=" + setID;
  console.log(search_bar.value);
  xhttp.send(post);

  xhttp.onload = function () {
    modalBody.innerHTML = this.responseText;
  }
}

function connectGoToSetInfo() {
  const a = document.getElementsByClassName("go_to_set_info");
  console.log("Connecting...");
  for (let i = 0; i < a.length; i++) {
    a[i].addEventListener("click", function (e) {
      const id = this.getElementsByClassName("id_number")[0].textContent;
      console.log("Pressed: " + this.getElementsByClassName("id_number")[0].textContent);
      openModal();
      loadModal(id);
    });
  }

}