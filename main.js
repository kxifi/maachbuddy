import { Client } from "@gradio/client";
	
	const response_0 = await fetch("https://raw.githubusercontent.com/gradio-app/gradio/main/test/test_files/bus.png");
	const exampleImage = await response_0.blob();
						
	const client = await Client.connect("wrezachow/south-asian-fish-recognition");
	const result = await client.predict("/predict", { 
					image: exampleImage, 
	});

	console.log(result.data);