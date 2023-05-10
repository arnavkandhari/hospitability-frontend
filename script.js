const baseURL = "http://731d-14-96-13-220.ngrok.io/users/"


function d(x) {
  return document.getElementById(x);
}

// Get the exact Latitude and Longitude
function getAndSetLocation() {
  // console.log("working");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setPosition);
  } else {
    alert("Cannot get exact location");
  }
}

// Set Latitude and Longitude in the form
function setPosition(position) {
  d("hospital-latitude").value = position.coords.latitude;
  d("hospital-longitude").value = position.coords.latitude;
}

// Validate if user is a hospital
function validate() {
  // Authorised organisations
  // Added edu too for checking purposes
  var auth_orgs = ["org", "edu"];

  let org_half = d("hospital-email").value.split("@");
  let org = org_half[1].split(".");
  console.log(org);
  // Check for authorised email
  if (auth_orgs.includes(org[1])) {
    console.log(org[1]);
    form_submitted();
  } else {
    // console.log(org[1]);
    alert("You are not authorized to proceed");
  }
}

// Display number of rooms in each floor
function displayFloorRooms() {
  var nFloors = parseInt(d("hospital-total-floors").value);
  var nFloorRooms = parseInt(d("hospital-floor-rooms").value);
  var input = document.createElement("input");

  console.table(nFloors, nFloorRooms);

  // Delete previous table entries
  delete_table("FloorWiseDetailsTable");

  // Create new entries
  var table = d("FloorWiseDetailsTable");
  var row = table.insertRow();
  var cell = row.insertCell();
  cell.innerHTML = "Floor";
  cell = row.insertCell();
  cell.innerHTML = "Number of Rooms";

  for (let i = 1; i < nFloors + 1; i++) {
    var table = d("FloorWiseDetailsTable");
    var row = table.insertRow();
    var cell = row.insertCell();
    cell.innerHTML = "Floor " + i;
    cell = row.insertCell();
    cell.innerHTML = `<input type="number" value=${nFloorRooms} id="F${i}" class="room--number--input"/>`;
  }
}

// Delete all rows in a table
function delete_table(x) {
  var table = document.getElementById(x);
  while (table.rows.length) {
    table.deleteRow(0);
  }
}

// Update number of rooms in each floor
function updateFloorRooms() {
  var nFloors = parseInt(d("hospital-total-floors").value);
  let totalRooms = 0;
  for (let index = 1; index < nFloors + 1; index++) {
    totalRooms += parseInt(d("F" + index).value);
  }
  console.log(totalRooms);
  d("hospital-total-rooms").value = totalRooms;
}

// Toggle Visibility
function toggleVisibility(x) {
  if (d(x).style.display === "none") {
    d(x).style.display = "block";
  } else {
    d(x).style.display = "none";
  }
}

function togglePasswordEyeVisibility(x,y) {
  if (d(x).style.display === "none") {
    d(x).style.display = "inline-block";
    d(y).style.display = "none";
  } else {
    d(x).style.display = "none";
    d(y).style.display = "inline-block";
  }
}

// Function to update total number of rooms
let inputs = document.querySelectorAll(".calcNRooms");
for (i of inputs) {
  i.addEventListener("change", function () {
    // console.log("change detected");
    // do something on change
    d("hospital-total-rooms").value =
      parseInt(d("hospital-total-floors").value) *
      parseInt(d("hospital-floor-rooms").value);
  });
}

function get_room_in_each_floor() {
  var rooms = [];
  const room_els = document.getElementsByClassName("room--number--input");
  for(let i=0; i<room_els.length; i++){
      rooms.push(parseInt(room_els[i].value));
  }
  console.log("rooms", rooms);
  return rooms;
}

async function form_submitted() {
  var hospitalName = d("hospital-name").value;
  var hospitalEmail = d("hospital-email").value;
  var hospitalPass = d("hospital-password").value;
  var hospitalCity = d("hospital-location").value;
  var hospitalCoords = {
    latitude: d("hospital-latitude").value,
    longitude: d("hospital-longitude").value,
  };
  // console.log(hospitalCoords);
  // Object is getting printed, but must think how to update the coords once user clicks the button.
  var hospitalTotalFloors = d("hospital-total-floors").value;
  var hospitalTotalRooms = d("hospital-total-rooms").value;

  var rooms_on_each_floor = get_room_in_each_floor();

  let req_options = {
    name: hospitalName,
    loginEmail: hospitalEmail,
    loginPass: hospitalPass,
    location: hospitalCity,
    latitude: hospitalCoords.latitude,
    longitude: hospitalCoords.longitude,
  };
  let floor_details = {};

  for (let i = 1; i <= hospitalTotalFloors; i++) {
    floor_details["F" + i.toString()] = rooms_on_each_floor[i - 1];
  }
  req_options["floors"] = floor_details;

  console.log(req_options);

  fetch(baseURL + "signup", {
    method: "POST",
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify(req_options)
  }).then(res => {
    console.log("Request complete! response:", res.data);
    alert("Updated successfully");
  }).catch(err => {console.log(err.message)});
}

// Toggle Password Visibility
function togglePasswordVisibility() {
  const togglePasswordEye = document.querySelector('#password-eye');
  const password = document.querySelector('#hospital-password');

  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);

  togglePasswordEyeVisibility("password-eye-open","password-eye-close");
}
