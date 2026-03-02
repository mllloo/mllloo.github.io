document.addEventListener("DOMContentLoaded", function () {
    fetch("https://csumb.space/api/allStatesAPI.php")
      .then(res => res.json())
      .then(data => {
  
        let stateSelect = document.getElementById("state");
        stateSelect.innerHTML = "<option value=''>Select State</option>";
  
        data.states.forEach(state => {
          stateSelect.innerHTML += 
            `<option value="${state.usps}">${state.name}</option>`;
        });
  
      })
      .catch(error => console.log("States error:", error));
  

    document.getElementById("state").addEventListener("change", function () {
  
      fetch(`https://csumb.space/api/countyListAPI.php?state=${this.value}`)
        .then(res => res.json())
        .then(data => {
  
          let countySelect = document.getElementById("county");
          countySelect.innerHTML = "";
  
          data.forEach(county => {
            countySelect.innerHTML += 
              `<option>${county.county}</option>`;
          });
  
        });
  
    });
  
    document.getElementById("zip").addEventListener("change", function () {
  
      fetch(`https://csumb.space/api/cityInfoAPI.php?zip=${this.value}`)
        .then(res => res.json())
        .then(data => {
  
          if (!data) {
            document.getElementById("zipMsg").innerHTML = "Zip code not found";
            document.getElementById("city").value = "";
            document.getElementById("lat").value = "";
            document.getElementById("lon").value = "";
          } else {
            document.getElementById("zipMsg").innerHTML = "";
            document.getElementById("city").value = data.city;
            document.getElementById("lat").value = data.latitude;
            document.getElementById("lon").value = data.longitude;
          }
  
        });
  
    });
  
    document.getElementById("username").addEventListener("input", function () {
  
      fetch(`https://csumb.space/api/usernamesAPI.php?username=${this.value}`)
        .then(res => res.json())
        .then(data => {
  
          if (data.available) {
            document.getElementById("userMsg").innerHTML = "Username available";
            document.getElementById("userMsg").className = "success";
          } else {
            document.getElementById("userMsg").innerHTML = "Username not available";
            document.getElementById("userMsg").className = "error";
          }
  
        });
  
    });
  
  
    
    document.getElementById("password").addEventListener("focus", function () {
  
      let randomPass = Math.random().toString(36).slice(-8);
      document.getElementById("suggestedPassword").innerHTML =
        "Suggested password: " + randomPass;
  
    });
  
  
    document.getElementById("signupForm").addEventListener("submit", function (e) {
  
      let username = document.getElementById("username").value;
      let password = document.getElementById("password").value;
      let retype = document.getElementById("retypePassword").value;
  
      if (username.length < 3) {
        alert("Username must be at least 3 characters.");
        e.preventDefault();
        return;
      }
  
      if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        e.preventDefault();
        return;
      }
  
      if (password !== retype) {
        alert("Passwords do not match.");
        e.preventDefault();
        return;
      }
  
    });
  
  });
  