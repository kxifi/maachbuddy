import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/+esm";

const HF_SPACE_ID = "wrezachow/Maach_Buddy";

const imageInput = document.getElementById("imageInput");
const detectBtn = document.getElementById("detectBtn");
const loadingDiv = document.getElementById("loading");

const predictionBox = document.getElementById("predictionBox");
const recipeBox = document.getElementById("recipeBox");

detectBtn.addEventListener("click", async () => {
    const file = imageInput.files[0];
    if (!file) {
        alert("Please upload an image first!");
        return;
    }

    loadingDiv.classList.remove("hidden");
    predictionBox.textContent = "";
    recipeBox.textContent = "";

    try {
        const client = await Client.connect(HF_SPACE_ID);

        const result = await client.predict("/recognize_image", {
            image: file
        });

        console.log(result);

        // result.data = [ predictions_dict, markdown_recipe ]
        const predictions = result.data[0];
        const recipeMarkdown = result.data[1];

        // Show predictions (pretty JSON)
        predictionBox.textContent = JSON.stringify(predictions, null, 2);

        // Show recipe (raw markdown for now)
        recipeBox.textContent = recipeMarkdown;

    } catch (err) {
        console.error(err);
        alert("Error contacting HuggingFace Space");
    }

    loadingDiv.classList.add("hidden");
});