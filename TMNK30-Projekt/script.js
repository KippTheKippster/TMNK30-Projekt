
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
    let post = "text=" + addWhiteSpaces(search_bar.value);
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
      b.innerHTML += "<input type='hidden' value=\"" + parts[i] + "\">";
      /*execute a function when someone clicks on the item value (DIV element):*/
      b.addEventListener("click", function (e) {
        /*insert the value for the autocomplete text field:*/
        const input = this.getElementsByTagName("input")[0].value;
        inp.value = input;

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
    console.log("Searching for: " + search_bar.value);
    console.log(search_bar.value);
    xhttp.send(post);

    xhttp.onload = function () {
      document.getElementById("sets_table").innerHTML = this.responseText;
      setColor();
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
        search_bar.value = addWhiteSpaces(search_bar.value);
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

function addWhiteSpaces(text)
{
  // regex pattern to match numbers and characters not separated by a space
  const pattern = /([a-zA-Z])(\d)|(\d)([a-zA-Z])/;
  // replace instances of pattern with a space between the number and character
  text = text.replace(pattern, '$1 $2');

  // regex pattern to match numbers followed by "x" and another optional number
  const xPattern = /(\d)x(\d)?/g;
  // replace instances of pattern with a space between the numbers and "x" surrounded by spaces
  text = text.replace(xPattern, '$1 x $2');

  return text;
}

let parts = []
let firstPress = true;
const search_bar = document.getElementById("search_bar");
console.log("start");

autocomplete(search_bar);

//Modal
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("close");
let mouseOverModal = false;
let modalLoading = false;

closeModal();

modalClose.addEventListener("click", closeModal);
connectGoToSetInfo();

function openModal() {
  modal.style.display = "block";
  modalContent.addEventListener("mouseleave", function(event){
    mouseOverModal = false;
    console.log(mouseOverModal);
  });

  modalContent.addEventListener("mouseover", function(event){
    mouseOverModal = true;
    console.log(mouseOverModal);
  });

  modal.addEventListener("click", function(event){
    if (mouseOverModal == false)
    {
      closeModal();
    }
  });
}

function closeModal() {
  if (modalLoading == true)
  {
    return;
  }
  
  modal.style.display = "none";
  modalBody.innerHTML = "<h1 class='loading'>Loading...<h1>";
  console.log("Closing modal...");
}

function loadModal(setID) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "get_set_info.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  let post = "id=" + setID;
  console.log(search_bar.value);
  xhttp.send(post);
  modalLoading = true;

  xhttp.onload = function () {
    modalBody.innerHTML = this.responseText;
    modalLoading = false;
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

function setColor() {
  const colors = document.getElementsByClassName("brick-colors-text");

  for (let i = 0; i < colors.length; i++) {
    console.log("Classlist: " + colors[i].classList);
    const colorHex = '#' + colors[i].classList[0];
    colors[i].parentElement.style.backgroundColor = colorHex;
    colors[i].style.color = getContrastColor(colorHex);
  }
}

function getContrastColor(hex) 
{
  //Checks if the first character is a '#', if that is the case then remove it
  if (hex.indexOf('#') === 0) 
  {
    hex = hex.slice(1);
  }
  //Converts 3-digit hex code to 6-digits
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  //Makes sure the length of the hex code is valid
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }

  //Transforms the hex values to regular ints
  var 
    r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);

  //Chooses between if the most contrasting color is black or white.
  return (r * 0.299 + g * 0.587 + b * 0.114) > 186
    ? '#000000'
    : '#FFFFFF';
}