import { Client } from "@gradio/client";
	
	const response_0 = await fetch("https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png");
	const exampleImage = await response_0.blob();
						
	const client = await Client.connect("wrezachow/south-asian-fish-recognition");
	const result = await client.predict("/predict", { 
					image: exampleImage, 
	});

	console.log(result.data);

// start?

// --------------------------
// CONFIG
// --------------------------
const HF_URL = "YOUR_HF_SPACE_API_URL"; 
const HF_TOKEN = "YOUR_HF_API_KEY";

const LLM_URL = "https://api.openai.com/v1/chat/completions";
const LLM_KEY = "YOUR_OPENAI_OR_GITHUB_MODELS_KEY";

// --------------------------
// DOM ELEMENTS
// --------------------------
const uploadInput = document.getElementById("imageUpload");
const detectBtn = document.getElementById("detectBtn");
const recipeBtn = document.getElementById("recipeBtn");
const ingredientList = document.getElementById("ingredientList");
const recipesDiv = document.getElementById("recipes");
const loadingDiv = document.getElementById("loading");

// --------------------------
// 1. SEND IMAGE → HUGGING FACE MODEL
// --------------------------
async function detectIngredients() {
  const file = uploadInput.files[0];
  if (!file) {
    alert("Please upload an image first!");
    return;
  }

  loadingDiv.classList.remove("hidden");
  ingredientList.innerHTML = "";
  recipesDiv.innerHTML = "";

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(HF_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${HF_TOKEN}`
    },
    body: formData
  });

  const data = await response.json();
  console.log("HF response:", data);

  loadingDiv.classList.add("hidden");

  let ingredients = data.ingredients || data || [];

  ingredients.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    ingredientList.appendChild(li);
  });

  recipeBtn.classList.remove("hidden");

  return ingredients;
}

// --------------------------
// 2. INGREDIENTS → LLM → RECIPES
// --------------------------
async function generateRecipes() {
  const ingredients = [];
  document.querySelectorAll("#ingredientList li").forEach(li =>
    ingredients.push(li.textContent)
  );

  const prompt = `
You are a recipe generator.
User has these ingredients: ${ingredients.join(", ")}.
Suggest 2–3 dishes they can cook.
For each dish, provide:
- Name
- Short description
- Ingredients with amounts (estimated)
- Step-by-step instructions
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
      max_tokens: 500
    })
  });

  const result = await response.json();
  console.log("LLM:", result);

  recipesDiv.innerHTML =
    `<pre>${result.choices[0].message.content}</pre>`;
}

// --------------------------
// EVENT LISTENERS
// --------------------------
detectBtn.addEventListener("click", detectIngredients);
recipeBtn.addEventListener("click", generateRecipes);