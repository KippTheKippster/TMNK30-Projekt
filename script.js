//An self contained function that fixes all the autocomplete recomendations for the searchbar
function autocomplete(inp) {
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    console.log("Pressed");
    loadParts();
    console.log("this.value: " + inp.value + " e: " + e.data);
  });

  function search() {
    closeAllLists();
    currentPageNumber = 0;
    currentSet = search_bar.value;
    updateSets();
  }

  //Loads all the recomended parts
  function loadParts() {
    //Uses ajax to post a form without refreshing the site, uses all that get_parts.php prints out to make the recomendation elements.
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "get_parts.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
    let post = "text=" + formatSearch(search_bar.value);
    xhttp.send(post);

    xhttp.onload = function () {
      //When the page has finished loading parse the result to an array and create the visuals.
      const result = JSON.parse(this.responseText);
      parts = result;
      createVisuals(inp);
    }
  }

  //Creates the recomend elements
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
      b.innerHTML = makeMatchingTextBold(parts[i], formatSearch(val));
      /*insert a input field that will hold the current array item's value:*/
      b.innerHTML += "<input type='hidden' value=\"" + parts[i] + "\">";
      /*execute a function when someone clicks on the item value (DIV element):*/
      b.addEventListener("click", function (e) {
        /*insert the value for the autocomplete text field:*/
        const input = this.getElementsByTagName("input")[0].value;
        inp.value = input;

        /*close the list of autocompleted values,
        (or any other open lists of autocompleted values:*/
        search();

      });
      a.appendChild(b);
    }
    //}
  }

  //Runs when the user presses a key.
  inp.addEventListener("keydown", function (e) {
    //Loads the parts from the database
    //Updates the visual list
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
      e.preventDefault(); //Prevents the default function of the enter button
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
      else {
        search_bar.value = formatSearch(search_bar.value);
        search();
      }
    }
  });

  //Makes the next element active (makes it glows and the one part that is searched when enter is pressed)
  function addActive(x) {
    if (!x) return false;
    //Removes all current actives
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    //Add the current active to a class so that css changes it's appearance 
    x[currentFocus].classList.add("autocomplete-active");
  }

  //A function to remove the active class from all elements 
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  //A function that closes (removes) all the active items in the list execpt for the element entered
  function closeAllLists(elmnt) {
    //Goes through all the elemnts and removes them execpt for the entered element, this is because sometimes the list closes before the element the user clicked on executes it's function
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  //Closes the list when the user clicks (apart from the element the user clicked on)
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });

  //Formats the text the user is writing to match the format of the database
  function formatSearch(text) {
    /* Old code, search brick 1x1 does not work, gives result Brick 1
    //
    // regex pattern to match numbers and characters not separated by a space
    const pattern = /([a-zA-Z])(\d)|(\d)([a-zA-Z])/;
    // replace instances of pattern with a space between the number and character
    text = text.replace(pattern, '$1 $2');
  
    // regex pattern to match numbers followed by "x" and another optional number
    const xPattern = /(\d)x(\d)?/g;
    // replace instances of pattern with a space between the numbers and "x" surrounded by spaces
    text = text.replace(xPattern, '$1 x $2');
    */

    //Goes through the entire string and add spaces where needed
    for (let i = 0; i < text.length; i++) {
      let prevChar = text[i - 1];
      let currentChar = text[i];
      let nextChar = text[i + 1];

      if (isNumber(currentChar)) {
        if (!isWhiteSpace(prevChar) && !isNumber(prevChar)) {
          text = text.slice(0, i) + " " + text.slice(i);
        }
        continue;
      }

      if (isNumber(prevChar)) {
        if (!isWhiteSpace(currentChar) && !isNumber(currentChar)) {
          text = text.slice(0, i) + " " + text.slice(i);
        }
        continue;
      }
    }

    text = text.replace(/\s+/g, ' ').trim() //Removes multiple whitespaces in a row //"brick 1 x             1" -> brick 1 x 1

    return text;

    //Checks if the inputed character is a number
    function isNumber(c) {
      if (c >= '0' && c <= '9') {
        // it is a number
        return true
      } else {
        // it isn't
        return false
      }
    }

    //Checks if the inputed character is a whitespaces
    function isWhiteSpace(c) {
      if (c == ' ') {
        return true
      }

      return false;
    }
  }

  //Adds the html <strong> element inbetween the matching text to make it BOLD, used by the searchbar to make the search and matching recomended text bold   
  function makeMatchingTextBold(fullText, matchingText) {
    let text = fullText;
    for (let i = 0; i < fullText.length; i++) {
      if (fullText.substring(i, i + matchingText.length).toUpperCase() == matchingText.toUpperCase()) {
        text = fullText.substring(0, i) + "<strong>" + fullText.substring(i, i + matchingText.length) + "</strong/>" + fullText.substring(i + matchingText.length);
        break;
      }
    }
    return text;
  }

  //Old function to sort the recomendations, is now sorted with php.
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
}

//Loads and creates the new sets
function updateSets() {
  //Uses ajax to post a form without refreshing the site, sets the printed text to a html element to create the visuals.
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "get_sets.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  let post = "text=" + currentSet + "&offset=" + setLimit * currentPageNumber + "&limit=" + setLimit;
  console.log("Searching for: " + currentSet);
  console.log("Sending: " + post);
  xhttp.send(post);
  loadingSets = true;
  document.body.style.cursor = 'progress';

  xhttp.onload = function () {
    //When it has finished loading all the sets
    document.body.style.cursor = 'default';
    //Sets the div "sets_table" to the text printed by the php document
    document.getElementById("sets_table").innerHTML = this.responseText;
    setBrickColorTextContrastColor();
    connectGoToSetInfo();
    //Gets the max number of sets that the search contains
    maxSetsNumber = document.getElementById("item_count").value;
    updateArrows();
    console.log("maxNumber: " + maxSetsNumber);
    window.scrollTo(0, 0);
    loadingSets = false;
  }
}

let parts = []
let firstPress = true;
const search_bar = document.getElementById("search_bar");
const setLimit = 50;
let currentPageNumber = 0;
let maxSetsNumber = 0;
let loadingSets = false;
const nextArrow = document.getElementById("next_arrow");
const prevArrow = document.getElementById("prev_arrow");
const pageNumberVisual = document.getElementById("page_number");
console.log("start");

autocomplete(search_bar);

//Modal
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("close");
const startLink = document.getElementById("start-row");
let mouseOverModal = false;
let modalLoading = false;
let currentSet = "";

closeModal();

modalClose.addEventListener("click", closeModal);
startLink.addEventListener("click", refresh);
nextArrow.addEventListener("click", nextPage)
prevArrow.addEventListener("click", prevPage)
currentPageNumber
updateArrows();
connectGoToSetInfo();

//Makes the arrows visible or invisble depending on if you can press them or not.
function updateArrows() {
  console.log("Updating arrows : ");

  pageNumberVisual.textContent = currentPageNumber + 1;

  if ((currentPageNumber + 1) * setLimit < maxSetsNumber) {
    nextArrow.style.visibility = "visible";
  }
  else {
    nextArrow.style.visibility = "hidden";
  }

  if (currentPageNumber > 0) {
    prevArrow.style.visibility = "visible";
  }
  else {
    prevArrow.style.visibility = "hidden";
  }

  if (nextArrow.style.visibility == "hidden" && prevArrow.style.visibility == "hidden") {
    pageNumberVisual.style.visibility = "hidden";
  }
  else {
    pageNumberVisual.style.visibility = "visible";
  }
}

//Goes to the next page
function nextPage() {
  if (loadingSets) {
    return;
  }

  currentPageNumber++;
  console.log("Next Page");
  updateSets();
}

//Goes to the previous page
function prevPage() {
  if (loadingSets) {
    return;
  }

  currentPageNumber--;
  console.log("Prev Page");
  updateSets();

}

//refreshes the page
function refresh() {
  location.reload();
}

//Opens the modal and connects events to decide when to close the modal
function openModal() {
  if (loadingSets) {
    return;
  }

  modal.style.display = "block";
  modalContent.addEventListener("mouseleave", function (event) {
    mouseOverModal = false;
    console.log(mouseOverModal);
  });

  modalContent.addEventListener("mouseover", function (event) {
    mouseOverModal = true;
    console.log(mouseOverModal);
  });

  modal.addEventListener("click", function (event) {
    if (mouseOverModal == false) {
      closeModal();
    }
  });
}

//Closes the modal
function closeModal() {
  if (modalLoading == true) {
    return;
  }

  modal.style.display = "none";
  modalBody.innerHTML = "<h1 class='loading'>Loading...<h1>";
  console.log("Closing modal...");
}

//Loads the information about the set the user clicked on with help of ajax
function loadModal(setID) {
  if (loadingSets) {
    return;
  }

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "get_set_info.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  let post = "id=" + setID;
  console.log(currentSet);
  xhttp.send(post);
  modalLoading = true;

  xhttp.onload = function () {
    modalBody.innerHTML = this.responseText;
    modalLoading = false;
  }
}

//Connects all sets to a click function that will load and open the modal with it's information
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

//Sets all text that shows the color the sets uses to a contrasting color against the background
function setBrickColorTextContrastColor() {
  const colors = document.getElementsByClassName("brick-colors-text");

  for (let i = 0; i < colors.length; i++) {
    const colorHex = '#' + colors[i].classList[0];
    colors[i].parentElement.style.backgroundColor = colorHex;
    colors[i].style.color = getContrastColor(colorHex);
  }
}

//Returns black or white depending on the color entered
function getContrastColor(hex) {
  //Checks if the first character is a '#', if that is the case then remove it
  if (hex.indexOf('#') === 0) {
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