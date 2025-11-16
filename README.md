# 🐠 Maach Buddy

A web-based fish identification tool powered by AI that recognizes fish species from images and generates cooking recipes using a local LLM.

## 🌟 Features

- **Fish Species Recognition**: Identifies 22 different South Asian fish species
- **AI Recipe Generation**: Creates custom recipes using Qwen2.5-0.5B-Instruct LLM
- **Real-time Processing**: Instant image analysis via Gradio API
- **Top 5 Predictions**: Visual confidence bars showing prediction probabilities
- **Responsive Design**: Clean, modern interface that works on all devices

## 🐟 Supported Fish Species

- Anchovies, Barramundi, Bombay Duck, Catla, Clams
- Cod, Herring, Hilsa, Lobsters, Mackerel
- Mrigal Carp, Mussels, Octopus, Oysters, Pabda Catfish
- Rohu, Salmon, Shrimp, Silver Pomfret, Squid
- Tilapia, Tuna

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)
1. Fork this repository
2. Go to Settings → Pages
3. Select `main` branch as source
4. Save and wait 2-3 minutes
5. Access via: `https://your-username.github.io/repository-name`

### Option 2: Local Development
```bash
# Simply open index.html in a modern browser
# No build process or dependencies required!
```

## 📁 Project Structure

```
├── index.html          # Complete single-file application
└── README.md          # Documentation
```

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
- **API Integration**: Gradio Client Library
- **Backend**: FastAI + Hugging Face Transformers (hosted on HF Spaces)
- **Model**: Custom fish recognition model + Qwen2.5-0.5B-Instruct LLM

## 🔌 API Details

- **Endpoint**: `wrezachow/Maach_Buddy` (Hugging Face Space)
- **Function**: `/recognize_image`
- **Input**: Image file (JPG, PNG, JPEG)
- **Output**: 
  - Prediction confidences for all fish types
  - AI-generated recipe in markdown format

## 💻 How It Works

1. **Upload**: User selects a fish image
2. **Connect**: JavaScript connects to Gradio API via `@gradio/client`
3. **Predict**: Image sent to `/recognize_image` endpoint
4. **Process**: Backend runs FastAI model + LLM recipe generation
5. **Display**: Results shown with confidence bars and recipe

## 🎨 Code Highlights

### JavaScript API Integration
```javascript
import { Client } from "https://esm.sh/@gradio/client";

const client = await Client.connect("wrezachow/Maach_Buddy");
const result = await client.predict("/recognize_image", { 
    image: selectedFile 
});
```

### Prediction Parsing
```javascript
// Handles Gradio Label format
if (predictionsData.confidences && Array.isArray(predictionsData.confidences)) {
    predictionsData.confidences.forEach(item => {
        predictions[item.label] = item.confidence;
    });
}
```

## 🐛 Troubleshooting

### NaN in Confidence Scores
**Cause**: Gradio Label returns nested `confidences` array
**Fix**: Code automatically handles both flat and nested formats

### API Connection Errors
- Verify Hugging Face Space is active
- Check browser console for CORS issues
- Ensure stable internet connection

### Image Not Processing
- Supported formats: JPG, PNG, JPEG
- Max recommended size: 5MB
- Clear browser cache if issues persist

## 📝 Development Notes

- **No Backend Required**: Fully client-side implementation
- **No API Key Needed**: Uses public Hugging Face Space
- **No Build Tools**: Pure HTML/CSS/JS (ES6 modules)
- **Cross-Browser**: Works in Chrome, Firefox, Safari, Edge (modern versions)

## 🤝 Contributing

This is a beginner-friendly project! Areas for improvement:
- Add drag-and-drop file upload
- Implement image compression for faster uploads
- Add more fish species
- Improve recipe formatting/presentation
- Add download/share recipe functionality

## 📄 License

Open source - feel free to use and modify for learning purposes.

## 🔗 Links

- **Live Demo**: [GitHub Pages URL]
- **Backend Space**: [wrezachow/Maach_Buddy](https://huggingface.co/spaces/wrezachow/Maach_Buddy)
- **Gradio Docs**: [https://www.gradio.app/docs](https://www.gradio.app/docs)

## 👥 Authors

Built as a collaborative learning project with @wrezachow for web development practice.

---

**Note**: This app uses a hosted AI model on Hugging Face Spaces.
Processing time depends on Space availability and may take 5-90 seconds per image.
