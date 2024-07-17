function createWhiteboardMesh(scene) {
  // Create a plane
  const plane = BABYLON.MeshBuilder.CreatePlane(
    "whiteboardPlane",
    { width: 5, height: 5 },
    scene
  );

  // Create a dynamic texture
  const dynamicTexture = new BABYLON.DynamicTexture(
    "dynamicTexture",
    { width: 512, height: 512 },
    scene
  );

  // Create a material and set the dynamic texture as its diffuse texture
  const material = new BABYLON.StandardMaterial("whiteboardMaterial", scene);
  material.diffuseTexture = dynamicTexture;

  // Apply the material to the plane
  plane.material = material;

  // Create an image and draw it onto the dynamic texture
  const img = new Image();
  img.src = "path/to/your/image.png"; // Replace with the actual path to your image
  img.onload = function () {
    const context = dynamicTexture.getContext();
    context.clearRect(
      0,
      0,
      dynamicTexture.getSize().width,
      dynamicTexture.getSize().height
    );
    context.drawImage(
      img,
      0,
      0,
      dynamicTexture.getSize().width,
      dynamicTexture.getSize().height
    );
    dynamicTexture.update();
  };

  // Position the plane in the scene
  plane.position = new BABYLON.Vector3(0, 0, 0);

  return plane;
}

// Assuming you have an existing scene object, call the function to create and add the whiteboard mesh
const whiteboardMesh = createWhiteboardMesh(scene);
