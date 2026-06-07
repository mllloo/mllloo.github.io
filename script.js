// Get the theme button from the HTML
const themeToggle = document.getElementById("themeToggle");

// Get the greeting paragraph from the HTML
const greeting = document.getElementById("greeting");

// Check if the user already picked dark mode before
const savedTheme = localStorage.getItem("theme");

// If dark mode was saved, turn it back on when the page loads
if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = " Light Mode";
}

// This runs when the user clicks the dark mode button
themeToggle.addEventListener("click", function () {
    // Add or remove the dark class on the body
    document.body.classList.toggle("dark");

    // Check if dark mode is active right now
    const darkModeIsOn = document.body.classList.contains("dark");

    // Save the theme so it stays after refreshing
    if (darkModeIsOn) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️ Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = " Dark Mode";
    }
});

// Get the current hour from the computer
const hour = new Date().getHours();

// Change the greeting depending on the time of day
if (hour < 12) {
    greeting.textContent = "Good morning, I'm Millonoel";
} else if (hour < 18) {
    greeting.textContent = "Good afternoon, I'm Millonoel";
} else {
    greeting.textContent = "Good evening, I'm Millonoel";
}