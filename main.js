import { Client } from "@gradio/client";
	
	const response_0 = await fetch("https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png");
	const exampleImage = await response_0.blob();
						
	const client = await Client.connect("wrezachow/south-asian-fish-recognition");
	const result = await client.predict("/predict", { 
					image: exampleImage, 
	});

	console.log(result.data);

// start?

//--------------------------------------------------
// CONFIG
//--------------------------------------------------
const HF_URL = "YOUR_HF_SPACE_API_URL";
const HF_TOKEN = "YOUR_HF_API_KEY";

const LLM_URL = "https://api.openai.com/v1/chat/completions";
const LLM_KEY = "YOUR_LLM_KEY";

//--------------------------------------------------
// DOM ELEMENTS
//--------------------------------------------------
const uploadInput = document.getElementById("imageUpload");
const detectBtn = document.getElementById("detectBtn");
const recipeBtn = document.getElementById("recipeBtn");
const ingredientList = document.getElementById("ingredientList");
const imageList = document.getElementById("imageList");
const recipesDiv = document.getElementById("recipes");
const loadingDiv = document.getElementById("loading");
const dropArea = document.getElementById("dropArea");

let selectedFiles = [];

//--------------------------------------------------
// MULTI-FILE UPLOAD + REMOVE
//--------------------------------------------------
function renderImageList() {
  imageList.innerHTML = "";

  selectedFiles.forEach((file, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    li.innerHTML = `
      ${file.name}
      <span class="remove-btn" data-index="${index}">
        <i class="fa-solid fa-trash"></i>
      </span>
    `;

    imageList.appendChild(li);
  });
}

uploadInput.addEventListener("change", (e) => {
  selectedFiles.push(...e.target.files);
  renderImageList();
});

// Remove image
imageList.addEventListener("click", (e) => {
  if (e.target.closest(".remove-btn")) {
    const index = e.target.closest(".remove-btn").dataset.index;
    selectedFiles.splice(index, 1);
    renderImageList();
  }
});

//--------------------------------------------------
// DRAG & DROP SUPPORT
//--------------------------------------------------
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("bg-light");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("bg-light");
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.classList.remove("bg-light");

  const files = Array.from(e.dataTransfer.files);
  selectedFiles.push(...files);
  renderImageList();
});

//--------------------------------------------------
// 1. SEND MULTIPLE IMAGES → HUGGING FACE MODEL
//--------------------------------------------------
async function detectIngredients() {
  if (selectedFiles.length === 0) {
    alert("Please upload at least one image!");
    return;
  }

  loadingDiv.classList.remove("hidden");
  ingredientList.innerHTML = "";
  recipesDiv.innerHTML = "";

  const formData = new FormData();
  selectedFiles.forEach((file) => formData.append("files", file));

  const response = await fetch(HF_URL, {
    method: "POST",
    headers: { "Authorization": `Bearer ${HF_TOKEN}` },
    body: formData
  });

  const data = await response.json();
  loadingDiv.classList.add("hidden");

  console.log("HF:", data);

  let ingredients = data.ingredients || data || [];

  ingredientList.innerHTML = "";
  ingredients.forEach(ing => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = ing;
    ingredientList.appendChild(li);
  });

  recipeBtn.classList.remove("hidden");
  return ingredients;
}

//--------------------------------------------------
// 2. INGREDIENTS → LLM → RECIPES
//--------------------------------------------------
async function generateRecipes() {
  const ingredients = Array.from(document.querySelectorAll("#ingredientList li"))
    .map(li => li.textContent);

  const prompt = `
User has these ingredients: ${ingredients.join(", ")}.
Suggest 2–3 creative dishes.
Each dish must include:
- Name
- Description
- Ingredient amounts
- Steps
Format cleanly.
`;

  const response = await fetch(LLM_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${LLM_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 700
    })
  });

  const result = await response.json();
  const content = result.choices[0].message.content;

  // Format recipe output into cards
  recipesDiv.innerHTML = "";

  const recipeBlocks = content.split(/\n\s*\n/);
  recipeBlocks.forEach(block => {
    const div = document.createElement("div");
    div.className = "recipe-card";
    div.innerHTML = `<pre>${block}</pre>`;
    recipesDiv.appendChild(div);
  });
}

//--------------------------------------------------
// BUTTON EVENTS
//--------------------------------------------------
detectBtn.addEventListener("click", detectIngredients);
recipeBtn.addEventListener("click", generateRecipes);