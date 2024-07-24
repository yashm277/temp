var createScene = function () {
  var scene = new BABYLON.Scene(engine);

  // Camera
  var camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI / 2.5, Math.PI / 3, 25, new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);

  // Light
  var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.9;

  // Create box with dynamic texture
  var createBoxWithText = function (text) {
      var font_type = "Arial";
      var boxDepth = 0.1; // Very thin to simulate a sheet

      var DTWidth = 600; // Adjusted to a reasonable size
      var DTHeight = 300;

      var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", { width: DTWidth, height: DTHeight }, scene);
      var ctx = dynamicTexture.getContext();
      var size = 12;
      ctx.font = size + "px " + font_type;

      // Clear the texture before drawing
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, DTWidth, DTHeight);

      var textWidth = ctx.measureText(text).width;
      var ratio = textWidth / size;
      var font_size = Math.floor(DTWidth / (ratio * 1)); // size of multiplier (1) can be adjusted
      var font = font_size + "px " + font_type;

      dynamicTexture.drawText(text, null, null, font, "#000000", "#ffffff", true);

      var boxWidth = (textWidth / 60) + 1;
      var boxHeight = (font_size / 60) + 1;

      var box = BABYLON.MeshBuilder.CreateBox("box", { width: boxWidth, height: boxHeight, depth: boxDepth, faceUV: [
          new BABYLON.Vector4(1, 1, 0, 0), // front face
          new BABYLON.Vector4(0, 0, 0, 0), // back face
          new BABYLON.Vector4(0, 0, 0, 0), // top face
          new BABYLON.Vector4(0, 0, 0, 0), // bottom face
          new BABYLON.Vector4(0, 0, 0, 0), // right face
          new BABYLON.Vector4(0, 0, 0, 0)  // left face
      ]}, scene);

      var mat = new BABYLON.StandardMaterial("mat", scene);
      mat.diffuseTexture = dynamicTexture;
      mat.backFaceCulling = true; // Enable back face culling to only show text on one side

      box.material = mat;

      // Ensure the box faces the camera correctly without unnecessary rotation
      box.rotation.y = Math.PI;

      return box;
  };

  var box = createBoxWithText("Some words to fit");

  // Create bounding box for the box
  var boundingBox = BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(box);

  // Create bounding box gizmo
  var utilLayer = new BABYLON.UtilityLayerRenderer(scene);
  utilLayer.utilityLayerScene.autoClearDepthAndStencil = false;
  var gizmo = new BABYLON.BoundingBoxGizmo(BABYLON.Color3.FromHexString("#0984e3"), utilLayer);
  gizmo.attachedMesh = boundingBox;

  // Create behaviors to drag, scale, and rotate with pointers in VR
  var sixDofDragBehavior = new BABYLON.SixDofDragBehavior();
  boundingBox.addBehavior(sixDofDragBehavior);
  var multiPointerScaleBehavior = new BABYLON.MultiPointerScaleBehavior();
  boundingBox.addBehavior(multiPointerScaleBehavior);
  var pointerDragBehavior = new BABYLON.PointerDragBehavior();
  pointerDragBehavior.useObjectOrientationForDragging = false;
  boundingBox.addBehavior(pointerDragBehavior);

  // Create app bar
  var manager = new BABYLON.GUI.GUI3DManager(scene);
  var appBar = new BABYLON.TransformNode("");
  appBar.scaling.scaleInPlace(0.4); // Increased size for better readability
  var panel = new BABYLON.GUI.PlanePanel();
  panel.margin = 0;
  panel.rows = 1;
  manager.addControl(panel);
  panel.linkToTransformNode(appBar);

  for (var index = 0; index < 3; index++) {
      var button = new BABYLON.GUI.HolographicButton("button");
      panel.addControl(button);
      button.text = "Button #" + panel.children.length;

      if (index == 0) {
          button.text = "Toggle Resize";
          button.onPointerClickObservable.add(() => {
              if (gizmo.attachedMesh) {
                  gizmo.attachedMesh = null;
                  boundingBox.removeBehavior(sixDofDragBehavior);
                  boundingBox.removeBehavior(multiPointerScaleBehavior);
                  boundingBox.removeBehavior(pointerDragBehavior);
              } else {
                  gizmo.attachedMesh = boundingBox;
                  boundingBox.addBehavior(sixDofDragBehavior);
                  boundingBox.addBehavior(multiPointerScaleBehavior);
                  boundingBox.addBehavior(pointerDragBehavior);
              }
          });
      } else if (index == 1) {
          button.text = "Delete";
          button.onPointerClickObservable.add(() => {
              if (gizmo.attachedMesh) {
                  gizmo.attachedMesh.dispose();
                  gizmo.attachedMesh = null;
                  appBar.dispose(); // Remove the app bar as well
              }
          });
          button.mesh.material = new BABYLON.StandardMaterial("redMat", scene);
          button.mesh.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
      } else if (index == 2) {
          button.text = "Edit Text";
          button.onPointerClickObservable.add(() => {
              var newText = prompt("Enter new text for the box:");
              if (newText) {
                  box.dispose();
                  box = createBoxWithText(newText);
                  boundingBox = BABYLON.BoundingBoxGizmo.MakeNotPickableAndWrapInBoundingBox(box);
                  gizmo.attachedMesh = boundingBox;
                  boundingBox.addBehavior(sixDofDragBehavior);
                  boundingBox.addBehavior(multiPointerScaleBehavior);
                  boundingBox.addBehavior(pointerDragBehavior);
              }
          });
      }
  }

  // Attach app bar to bounding box
  var behavior = new BABYLON.AttachToBoxBehavior(appBar);
  boundingBox.addBehavior(behavior);

  return scene;
};