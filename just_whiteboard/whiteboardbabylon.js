var createScene = function () {
  var scene = new BABYLON.Scene(engine);

  // camera
  var camera = new BABYLON.ArcRotateCamera(
    "camera1",
    -Math.PI / 2.5,
    Math.PI / 3,
    25,
    new BABYLON.Vector3(0, 0, 0),
    scene
  );
  camera.attachControl(canvas, true);

  // lights
  var light = new BABYLON.HemisphericLight(
    "light1",
    new BABYLON.Vector3(0, 0, -1),
    scene
  );
  light.intensity = 0.9;

  //Set font type
  var font_type = "Arial";

  //Set width an height for plane
  var planeWidth = 10;
  var planeHeight = 3;

  //Create plane
  var plane = BABYLON.MeshBuilder.CreatePlane(
    "plane",
    { width: planeWidth, height: planeHeight },
    scene
  );

  //Set width and height for dynamic texture using same multiplier
  var DTWidth = planeWidth * 60;
  var DTHeight = planeHeight * 60;

  //Set text
  var text = "Some words to fit";

  //Create dynamic texture
  var dynamicTexture = new BABYLON.DynamicTexture(
    "DynamicTexture",
    { width: DTWidth, height: DTHeight },
    scene
  );

  // Function to draw text on the dynamic texture
  function drawTextOnPlane(text) {
    var ctx = dynamicTexture.getContext();
    var size = 12; // any value will work
    ctx.font = size + "px " + font_type;
    var textWidth = ctx.measureText(text).width;
    var ratio = textWidth / size;
    var font_size = Math.floor(DTWidth / (ratio * 1)); // size of multiplier (1) can be adjusted, increase for smaller text
    var font = font_size + "px " + font_type;
    dynamicTexture.clear();
    dynamicTexture.drawText(text, null, null, font, "#000000", "#ffffff", true);
  }

  // Initial text drawing
  drawTextOnPlane(text);

  // create material
  var mat = new BABYLON.StandardMaterial("mat", scene);
  mat.diffuseTexture = dynamicTexture;

  // apply material
  plane.material = mat;

  // Variables for dragging and resizing
  var isDragging = false;
  var isResizing = false;
  var startingPoint;
  var currentMesh;
  var initialWidth, initialHeight;
  var initialScaleX, initialScaleY;

  var getGroundPosition = function (evt) {
    var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
      return mesh == plane;
    });
    if (pickinfo.hit) {
      return pickinfo.pickedPoint;
    }
    return null;
  };

  var onPointerDown = function (evt) {
    if (evt.button !== 0) {
      return;
    }

    // Check if we are picking a mesh
    var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
      return mesh == plane;
    });
    if (pickInfo.hit) {
      currentMesh = pickInfo.pickedMesh;
      startingPoint = getGroundPosition(evt);
      if (startingPoint) {
        var boundingInfo = currentMesh.getBoundingInfo();
        var min = boundingInfo.minimumWorld;
        var max = boundingInfo.maximumWorld;

        if (
          Math.abs(startingPoint.x - max.x) < 0.5 &&
          Math.abs(startingPoint.y - max.y) < 0.5
        ) {
          isResizing = true;
          initialWidth = currentMesh.scaling.x;
          initialHeight = currentMesh.scaling.y;
          initialScaleX = currentMesh.scaling.x;
          initialScaleY = currentMesh.scaling.y;
          canvas.style.cursor = "nwse-resize";
        } else {
          isDragging = true;
          canvas.style.cursor = "move";
        }
      }
    }
  };

  var onPointerUp = function () {
    if (isDragging) {
      isDragging = false;
      startingPoint = null;
      canvas.style.cursor = "default";
      return;
    }
    if (isResizing) {
      isResizing = false;
      startingPoint = null;
      canvas.style.cursor = "default";
      return;
    }
  };

  var onPointerMove = function (evt) {
    if (!isDragging && !isResizing) {
      return;
    }

    var current = getGroundPosition(evt);
    if (!current) {
      return;
    }

    if (isDragging) {
      var diff = current.subtract(startingPoint);
      currentMesh.position.addInPlace(diff);
      startingPoint = current;
    }

    if (isResizing) {
      var diff = current.subtract(startingPoint);
      var newWidth = initialWidth + diff.x;
      var newHeight = initialHeight + diff.y;
      if (newWidth > 0.5 && newHeight > 0.5) {
        currentMesh.scaling.x = initialScaleX * (newWidth / initialWidth);
        currentMesh.scaling.y = initialScaleY * (newHeight / initialHeight);
        drawTextOnPlane(text); // Redraw text to fit new plane size
      }
    }
  };

  scene.onPointerObservable.add(function (evt) {
    switch (evt.type) {
      case BABYLON.PointerEventTypes.POINTERDOWN:
        onPointerDown(evt.event);
        break;
      case BABYLON.PointerEventTypes.POINTERUP:
        onPointerUp();
        break;
      case BABYLON.PointerEventTypes.POINTERMOVE:
        onPointerMove(evt.event);
        break;
    }
  });

  // Button for editing text on the plane
  var buttonPlane = BABYLON.MeshBuilder.CreatePlane(
    "buttonPlane",
    { width: 2, height: 0.5 },
    scene
  );
  buttonPlane.position.y = 2;
  buttonPlane.position.z = 0.01; // slightly in front of the plane
  buttonPlane.parent = plane;

  var advancedTexture =
    BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(buttonPlane);
  var button = BABYLON.GUI.Button.CreateSimpleButton("editButton", "Edit Text");
  button.width = "150px";
  button.height = "40px";
  button.color = "white";
  button.background = "black";
  advancedTexture.addControl(button);

  button.onPointerUpObservable.add(function () {
    var newText = prompt("Enter new text:", text);
    if (newText !== null) {
      text = newText;
      drawTextOnPlane(text); // Redraw text with new value
    }
  });

  return scene;
};
