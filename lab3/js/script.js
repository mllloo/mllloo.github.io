const submitBtn = document.getElementById("submitBtn");
const q1OptionsDiv = document.getElementById("q1-options");
const timesDisplay = document.getElementById("timesTaken");

const correctImage = "https://cdn-icons-png.flaticon.com/512/845/845646.png";
const wrongImage = "https://cdn-icons-png.flaticon.com/512/1828/1828843.png";

let q1Options = [
    { text: "//", value: "correct" },
    { text: "##", value: "wrong" },
    { text: "<!-- -->", value: "wrong" }
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffle(q1Options);

q1Options.forEach(option => {
    let label = document.createElement("label");
    let input = document.createElement("input");
    input.type = "radio";
    input.name = "q1";
    input.value = option.value;
    label.appendChild(input);
    label.append(" " + option.text);
    q1OptionsDiv.appendChild(label);
});

submitBtn.addEventListener("click", function() {

    let score = 0;

    document.querySelectorAll("span").forEach(span => span.innerHTML = "");

    let q1 = document.querySelector("input[name='q1']:checked");
    if (q1 && q1.value === "correct") {
        score += 20;
        showFeedback("q1-feedback", true);
    } else {
        showFeedback("q1-feedback", false);
    }

    let q2Answers = Array.from(document.querySelectorAll("input[name='q2']:checked")).map(e => e.value);
    if (q2Answers.includes("string") && q2Answers.includes("boolean") &&
        q2Answers.includes("number") && !q2Answers.includes("car")) {
        score += 20;
        showFeedback("q2-feedback", true);
    } else {
        showFeedback("q2-feedback", false);
    }

    let q3 = document.querySelector("input[name='q3']:checked");
    if (q3 && q3.value === "document") {
        score += 20;
        showFeedback("q3-feedback", true);
    } else {
        showFeedback("q3-feedback", false);
    }

    let q4 = document.getElementById("q4").value;
    if (q4 === "getElementById") {
        score += 20;
        showFeedback("q4-feedback", true);
    } else {
        showFeedback("q4-feedback", false);
    }

    let q5 = document.getElementById("q5").value.trim().toLowerCase();
    if (q5 === "let" || q5 === "var" || q5 === "const") {
        score += 20;
        showFeedback("q5-feedback", true);
    } else {
        showFeedback("q5-feedback", false);
    }

    document.getElementById("score").textContent = "Total Score: " + score;

    if (score > 80) {
        document.getElementById("congrats").textContent = "Congratulations! Great job!";
    }

    let times = localStorage.getItem("quizTimes") || 0;
    times++;
    localStorage.setItem("quizTimes", times);
    timesDisplay.textContent = "Quiz Taken: " + times + " times";

});

function showFeedback(id, correct) {
    let span = document.getElementById(id);
    let img = document.createElement("img");
    img.src = correct ? correctImage : wrongImage;
    img.width = 20;

    span.className = correct ? "correct" : "incorrect";
    span.textContent = correct ? " Correct" : " Incorrect";
    span.prepend(img);
}
