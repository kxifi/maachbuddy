// -------------------------------
// DARK MODE
// -------------------------------
document.getElementById("darkModeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// -------------------------------
// CONFIG — FILL THESE IN
// -------------------------------
const HF_SPACE = "wrezachow/south-asian-fish-recognition";  // your teammate's Space
const LLM_KEY = "your_openai_key";


// -------------------------------
// DOM ELEMENTS
// -------------------------------
const uploadInput = document.getElementById("imageUpload");
const detectBtn = document.getElementById("detectBtn");
const recipeBtn = document.getElementById("recipeBtn");

const ingredientList = document.getElementById("ingredientList");
const imageList = document.getElementById("imageList");
const recipesDiv = document.getElementById("recipes");
const loadingDiv = document.getElementById("loading");
const dropArea = document.getElementById("dropArea");

let selectedFiles = [];

// -------------------------------
// RENDER FILE LIST
// -------------------------------
function renderImageList() {
  imageList.innerHTML = "";

  selectedFiles.forEach((file, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${file.name}
      <span class="remove-btn" data-index="${index}">
        <i class="fa-solid fa-trash"></i>
      </span>
    `;

    imageList.appendChild(li);
  });
}

// -------------------------------
// HANDLE FILE INPUT
// -------------------------------
uploadInput.addEventListener("change", (e) => {
  selectedFiles.push(...e.target.files);
  renderImageList();
});

// REMOVE FILE
imageList.addEventListener("click", (e) => {
  const btn = e.target.closest(".remove-btn");
  if (!btn) return;

  selectedFiles.splice(btn.dataset.index, 1);
  renderImageList();
});

// -------------------------------
// DRAG & DROP
// -------------------------------
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("hover");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("hover");
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.classList.remove("hover");

  selectedFiles.push(...e.dataTransfer.files);
  renderImageList();
});

// -------------------------------
// 1. DETECT INGREDIENTS (GRADIO CLIENT)
// -------------------------------
async function detectIngredients() {
  if (selectedFiles.length === 0) {
    alert("Upload at least one image!");
    return;
  }

  loadingDiv.classList.remove("hidden");
  ingredientList.innerHTML = "";
  recipesDiv.innerHTML = "";

  try {
    const client = await window.gradio.Client.connect(HF_SPACE);

    let detected = new Set();

    for (const file of selectedFiles) {
      const result = await client.predict("/predict", { image: file });
      result.data.forEach((i) => detected.add(i));
    }

    loadingDiv.classList.add("hidden");

    // Display detected ingredients
    ingredientList.innerHTML = "";
    [...detected].forEach((ing) => {
      const li = document.createElement("li");
      li.textContent = ing;
      ingredientList.appendChild(li);
    });

    recipeBtn.classList.remove("hidden");

  } catch (err) {
    console.error(err);
    alert("Ingredient detection failed.");
    loadingDiv.classList.add("hidden");
  }
}

// -------------------------------
// 2. GENERATE RECIPES (OPENAI / GPT)
// -------------------------------
async function generateRecipes() {
  const ingredients = [...ingredientList.querySelectorAll("li")].map((li) => li.textContent);

  const prompt = `
User has these ingredients: ${ingredients.join(", ")}.
Suggest 2–3 creative dishes.
Include:
- Name
- Description
- Ingredient amounts
- Steps
Format cleanly.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
    const text = result.choices[0].message.content;

    recipesDiv.innerHTML = "";

    text.split(/\n\s*\n/).forEach((block) => {
      const div = document.createElement("div");
      div.classList.add("recipe-card");
      div.innerHTML = `<pre>${block}</pre>`;
      recipesDiv.appendChild(div);
    });

  } catch (error) {
    console.error(error);
    alert("Recipe generation failed.");
  }
}

// -------------------------------
// BUTTON EVENTS
// -------------------------------
detectBtn.addEventListener("click", detectIngredients);
recipeBtn.addEventListener("click", generateRecipes);