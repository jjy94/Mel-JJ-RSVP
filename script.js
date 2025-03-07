let currentScene = 0;
let responses = {};

const scenes = [
    {
        text: "T'was was a warm and peaceful night filled with the sounds of birds and crickets, when there was a sudden knock at the door."
        // No choices - narrative only
    },
    {
        text: "You receive a gilded scroll from JJ and Melanie. An intimate wedding is nigh, but only the worthy may attend. Will you accept the quest?",
        choices: ["Yes, I’ll attend!", "No, I must decline"],
        key: "rsvp"
    },
    {
        text: "The scroll also asked whether you have any restrictions regarding food (ie. Allergies), what are these restrictions?",
        input: true,
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
        text: "Welcome, brave soul, to the Wedding Feast of JJ and Mel! Your quest is complete—see you on June 7, 2025!",
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

    //knocking sound
    if (currentScene === 1) {
        document.getElementById("knock-sound").play();
    }
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
