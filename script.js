let currentScene = 0;
let responses = {};

const scenes = [
    {
        text: "Before our story begins, may I know your name adventurer?",
        input: true,
        nextScene: 1,
        key: "name"
    },
    {
        text: "T'was a warm, cozy night, filled only with the sounds of dogs and crickets. You were closing your book as you planned to retire for the night, when suddenly there was a knock at your door..",
        choices: [{ text: "Who's there?" , nextScene: 2 }]
    },
    {
        text: "You receive a gilded scroll from your dear friends Mel and JJ. A grand wedding feast is nigh, but only the worthy may attend. Will you accept the quest?",
        choices: [
            { text: "Yes, I’ll attend!", nextScene: 3, key: "rsvp", value: "Yes" },
            { text: "No, I must decline", nextScene: 6, key: "rsvp", value: "No" }
        ]
    },
    {
        text: ".. And how many other guests will be journeying with you? (0 if alone)",
        input: true,
        nextScene: 4,
        key: "guests"
    },
    {
        text: "Before you set off, the hosts would like to know whether you have any dietary restrictions? (none if n/a)",
        input: true,
        nextScene: 5,
        key: "allergies"
    },
    {
        text: "A bard stops you, seeking a tune for the celebration. What song do you suggest?",
        input: true,
        nextScene: 7,
        key: "song"
    },
    {
        text: "The scroll fades as you turn away. ‘We’ll miss you,’ whispers the wind. Farewell, traveler.",
        end: true // Branch for "No" RSVP
    },
    {
        text: "Welcome, brave soul, to the Wedding Feast of Mel and JJ! Your quest is complete—see you on [Wedding Date]!",
        end: true // Main ending for "Yes" path
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
    if (current.choices) {
        const selectedChoice = current.choices.find(c => c.text === choice);
        if (selectedChoice) {
            if (selectedChoice.key) responses[selectedChoice.key] = selectedChoice.value;
            currentScene = selectedChoice.nextScene; // Follow the branch
        }
    } else if (current.input && choice) {
        responses[current.key] = choice;
        currentScene = current.nextScene; // Use nextScene for input scenes
    }
    if (currentScene === 0) {
        document.getElementById("knock-sound").play(); // Knock still plays leaving Scene 0
    }
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
    fetch("https://script.google.com/macros/s/AKfycbxRQFIYQIC1mPthSSSnToePpPKgYPqzqDNAeWG6eFRoKk1QwiNaDcRwkyv3vVVselhL8A/exec", {
        method: "POST",
        body: JSON.stringify(responses)
    }).then(() => alert("Your quest is logged! See you at the wedding!"));
}
