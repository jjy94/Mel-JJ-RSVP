let currentScene = 0;
let responses = {};

const scenes = [
    {
        text: "You receive a gilded scroll from [Your Names]. A grand wedding feast is nigh, but only the worthy may attend. Will you accept the quest?",
        choices: ["Yes, I’ll attend!", "No, I must decline"],
        key: "rsvp"
    },
    {
        text: "You set off across the Enchanted Valley. The feast requires provisions—what dish shall you bring?",
        choices: ["Roasted Chicken", "Vegetarian Delight", "Gluten-Free Treasure"],
        key: "meal"
    },
    {
        text: "A bard stops you, seeking a tune for the celebration. What song do you suggest?",
        input: true,
        key: "song"
    },
    {
        text: "You arrive at the wedding gates. Swear your name to the guestbook to enter!",
        input: true,
        key: "name"
    },
    {
        text: "Welcome, brave soul, to the Wedding Feast of [Your Names]! Your quest is complete—see you on [Wedding Date]!",
        end: true
    }
];

function nextScene(choice) {
    responses[scenes[currentScene].key] = choice;
    currentScene++;
    updateScene();
}

function updateScene() {
    if (currentScene >= scenes.length) return;
    const scene = scenes[currentScene];
    document.getElementById("story-text").innerText = scene.text;

    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";
    if (scene.choices) {
        scene.choices.forEach(choice => {
            const button = document.createElement("button");
            button.innerText = choice;
            button.onclick = () => nextScene(choice);
            choicesDiv.appendChild(button);
        });
    } else if (scene.input) {
        const input = document.createElement("input");
        input.type = "text";
        choicesDiv.appendChild(input);
        const submit = document.createElement("button");
        submit.innerText = "Submit";
        submit.onclick = () => nextScene(input.value);
        choicesDiv.appendChild(submit);
    } else if (scene.end) {
        const submit = document.createElement("button");
        submit.innerText = "Finish Quest";
        submit.onclick = submitToGoogleSheets;
        choicesDiv.appendChild(submit);
    }
}

function submitToGoogleSheets() {
    fetch("https://script.google.com/macros/s/[YOUR_SCRIPT_ID]/exec", {
        method: "POST",
        body: JSON.stringify(responses)
    }).then(() => alert("Your quest is logged! See you at the wedding!"));
}
