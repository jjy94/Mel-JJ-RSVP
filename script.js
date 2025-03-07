let currentScene = 0;
let responses = {};

const scenes = [
    {
        text: "It was a warm and cozy night filled only with the sounds of crickets, when there was a sudden knock at the door."
        // No choices - narrative only
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

function nextScene(choice) {
    const current = scenes[currentScene];
    if (current.choices) {
        responses[current.key] = choice;
    } else if (current.input && choice) {
        responses[current.key] = choice;
    }
    // Play knock sound when moving from Scene 0 to Scene 1
    if (currentScene === 0) {
        document.getElementById("knock-sound").play();
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
    } else {
        // Narrative-only scene
        const continueButton = document.createElement("button");
        continueButton.innerText = "Continue";
        continueButton.onclick = () => nextScene(null);
        choicesDiv.appendChild(continueButton);
    }
}

function submitToGoogleSheets() {
    fetch("https://script.google.com/macros/s/[YOUR_SCRIPT_ID]/exec", {
        method: "POST",
        body: JSON.stringify(responses)
    }).then(() => alert("Your quest is logged! See you at the wedding!"));
}
