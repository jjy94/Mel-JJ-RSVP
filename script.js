let currentScene = 0;
let responses = {};

const scenes = [
    {
        text: "It was a warm, cozy night when there was a sudden knock at the door.",
        choices: ["Who’s there?"]
    },
    {
        text: "You receive a gilded scroll from Mel and JJ. A grand wedding feast is nigh, but only the worthy may attend. Will you accept the quest?",
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
        text: "Welcome, brave soul, to the Wedding Feast of Mel and JJ! Your quest is complete—see you on [Wedding Date]!",
        end: true
    }
];

// Initialize game elements when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.createElement("div");
    gameContainer.id = "game-container";

    const storyText = document.createElement("p");
    storyText.id = "story-text";
    gameContainer.appendChild(storyText);

    const choicesDiv = document.createElement("div");
    choicesDiv.id = "choices";
    gameContainer.appendChild(choicesDiv);

    document.body.appendChild(gameContainer);

    // Start the game
    updateScene();
});

function nextScene(choice) {
    const current = scenes[currentScene];
    if (current.choices && current.choices.length === 1 && choice === "Who’s there?") {
        document.getElementById("knock-sound").play();
    }
    if (current.key) {
        responses[current.key] = choice;
    }
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
