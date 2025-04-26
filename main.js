// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Set up physics world
const world = new CANNON.World();
console.log("Physics world created:", world);
world.gravity.set(0, -9.82, 0); // Earth gravity
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;

// Add lights
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;

// Adjust shadow camera frustum to cover both discs
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;

scene.add(directionalLight);

// Create a ground plane
const groundGeometry = new THREE.PlaneGeometry(100, 100); // Much larger ground
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 1.0,
  metalness: 0.0,
});

// Create grass texture
const textureLoader = new THREE.TextureLoader();
const grassTexture = textureLoader.load(
  "https://threejs.org/examples/textures/terrain/grasslight-big.jpg"
);
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(25, 25); // Repeat the texture to cover the larger ground
groundMaterial.map = grassTexture;

const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
ground.receiveShadow = true;
scene.add(ground);

// Create ground physics body
const groundBody = new CANNON.Body({
  mass: 0, // mass = 0 makes it static
  shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
groundBody.position.y = -1;
world.addBody(groundBody);
console.log("Ground body added to world");

// Create first disc
const discGeometry = new THREE.CylinderGeometry(5, 5, 0.5, 32);
const discMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  roughness: 0.7,
  metalness: 0.3,
});
const disc = new THREE.Mesh(discGeometry, discMaterial);
disc.castShadow = true;
disc.receiveShadow = true;
disc.position.y = 2;
scene.add(disc);

// Create first disc physics body
const discBody = new CANNON.Body({
  mass: 0, // Static body
  shape: new CANNON.Cylinder(5, 5, 0.5, 32),
  material: new CANNON.Material({
    restitution: 0.1,
    friction: 0.5,
  }),
});
discBody.position.copy(disc.position);
discBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
world.addBody(discBody);

// Create second disc
const disc2Geometry = new THREE.CylinderGeometry(5, 5, 0.5, 32);
const disc2Material = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  roughness: 0.7,
  metalness: 0.3,
});
const disc2 = new THREE.Mesh(disc2Geometry, disc2Material);
disc2.castShadow = true;
disc2.receiveShadow = true;
disc2.position.set(0, 2, -10);
scene.add(disc2);

// Create second disc physics body
const disc2Body = new CANNON.Body({
  mass: 0, // Static body
  shape: new CANNON.Cylinder(5, 5, 0.5, 32),
  material: new CANNON.Material({
    restitution: 0.1,
    friction: 0.5,
  }),
});
disc2Body.position.copy(disc2.position);
disc2Body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
world.addBody(disc2Body);

// Create third disc
const disc3Geometry = new THREE.CylinderGeometry(5, 5, 0.5, 32);
const disc3Material = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  roughness: 0.7,
  metalness: 0.3,
});
const disc3 = new THREE.Mesh(disc3Geometry, disc3Material);
disc3.castShadow = true;
disc3.receiveShadow = true;
disc3.position.set(0, 2, -20);
scene.add(disc3);

// Create third disc physics body
const disc3Body = new CANNON.Body({
  mass: 0, // Static body
  shape: new CANNON.Cylinder(5, 5, 0.5, 32),
  material: new CANNON.Material({
    restitution: 0.1,
    friction: 0.5,
  }),
});
disc3Body.position.copy(disc3.position);
disc3Body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
world.addBody(disc3Body);

// Create win ring
const ringGeometry = new THREE.TorusGeometry(2, 0.2, 16, 32);
const ringMaterial = new THREE.MeshStandardMaterial({
  color: 0xffd700, // Gold color
  roughness: 0.3,
  metalness: 0.8,
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.castShadow = true;
ring.receiveShadow = true;
ring.position.set(0, 5, -25);
ring.rotation.z = Math.PI / 2; // Rotate around Z axis to make it vertical
scene.add(ring);

// Create win ring physics body
const ringBody = new CANNON.Body({
  mass: 0, // Static body
  shape: new CANNON.Sphere(2), // Using sphere instead of cylinder
  material: new CANNON.Material({
    restitution: 0.1,
    friction: 0.5,
  }),
});
ringBody.position.copy(ring.position);
world.addBody(ringBody);

// Create attempt counter overlay
const attemptCounter = document.createElement("div");
attemptCounter.style.position = "fixed";
attemptCounter.style.top = "20px";
attemptCounter.style.left = "20px";
attemptCounter.style.fontSize = "2em";
attemptCounter.style.color = "white";
attemptCounter.style.fontFamily = "Arial, sans-serif";
attemptCounter.style.zIndex = "1000";
attemptCounter.style.textShadow = "2px 2px 4px rgba(0,0,0,0.5)";
attemptCounter.textContent = "Attempts: 0";
document.body.appendChild(attemptCounter);

// Create level counter overlay
const levelCounter = document.createElement("div");
levelCounter.style.position = "fixed";
levelCounter.style.top = "60px"; // Positioned below attempts counter
levelCounter.style.left = "20px";
levelCounter.style.fontSize = "2em";
levelCounter.style.color = "white";
levelCounter.style.fontFamily = "Arial, sans-serif";
levelCounter.style.zIndex = "1000";
levelCounter.style.textShadow = "2px 2px 4px rgba(0,0,0,0.5)";
levelCounter.textContent = "Level: 1";
document.body.appendChild(levelCounter);

let currentLevel = 1;
let attempts = 0;
let time = 0;

// Create level selector
const levelSelector = document.createElement("div");
levelSelector.style.position = "fixed";
levelSelector.style.bottom = "20px";
levelSelector.style.left = "20px";
levelSelector.style.display = "flex";
levelSelector.style.gap = "10px";
levelSelector.style.zIndex = "1000";

// Create level buttons
for (let i = 1; i <= 3; i++) {
  const levelButton = document.createElement("button");
  levelButton.textContent = `Level ${i}`;
  levelButton.style.padding = "10px 20px";
  levelButton.style.fontSize = "1.2em";
  levelButton.style.backgroundColor = i === currentLevel ? "#4CAF50" : "#666";
  levelButton.style.color = "white";
  levelButton.style.border = "none";
  levelButton.style.borderRadius = "5px";
  levelButton.style.cursor = "pointer";
  levelButton.style.transition = "background-color 0.3s";
  levelButton.style.textShadow = "2px 2px 4px rgba(0,0,0,0.5)";

  levelButton.onmouseover = () => {
    levelButton.style.backgroundColor = "#45a049";
  };

  levelButton.onmouseout = () => {
    levelButton.style.backgroundColor = i === currentLevel ? "#4CAF50" : "#666";
  };

  levelButton.onclick = () => {
    currentLevel = i;
    levelCounter.textContent = `Level: ${currentLevel}`;
    attempts = 0;
    attemptCounter.textContent = `Attempts: ${attempts}`;
    victoryOverlay.style.display = "none";
    initializeLevel();
    // Reset ball position and velocity
    ballBody.position.copy(ballResetPosition);
    ballBody.velocity.set(0, 0, 0);
    ballBody.angularVelocity.set(0, 0, 0);
  };

  levelSelector.appendChild(levelButton);
}

document.body.appendChild(levelSelector);

// Create victory screen overlay
const victoryOverlay = document.createElement("div");
victoryOverlay.style.position = "fixed";
victoryOverlay.style.top = "0";
victoryOverlay.style.left = "0";
victoryOverlay.style.width = "100%";
victoryOverlay.style.height = "100%";
victoryOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
victoryOverlay.style.display = "none";
victoryOverlay.style.flexDirection = "column";
victoryOverlay.style.justifyContent = "center";
victoryOverlay.style.alignItems = "center";
victoryOverlay.style.color = "white";
victoryOverlay.style.fontFamily = "Arial, sans-serif";
victoryOverlay.style.zIndex = "1000";

const victoryText = document.createElement("h1");
victoryText.textContent = "VICTORY!";
victoryText.style.fontSize = "4em";
victoryText.style.marginBottom = "20px";
victoryText.style.color = "#ffd700";

const attemptsText = document.createElement("p");
attemptsText.style.fontSize = "2em";
attemptsText.style.marginBottom = "20px";
attemptsText.style.color = "white";

const restartButton = document.createElement("button");
restartButton.textContent = "Play Again";
restartButton.style.padding = "15px 30px";
restartButton.style.fontSize = "1.5em";
restartButton.style.backgroundColor = "#4CAF50";
restartButton.style.color = "white";
restartButton.style.border = "none";
restartButton.style.borderRadius = "5px";
restartButton.style.cursor = "pointer";
restartButton.style.transition = "background-color 0.3s";

restartButton.onmouseover = () => {
  restartButton.style.backgroundColor = "#45a049";
};

restartButton.onmouseout = () => {
  restartButton.style.backgroundColor = "#4CAF50";
};

restartButton.onclick = () => {
  victoryOverlay.style.display = "none";
  // Reset ball position and velocity
  ballBody.position.copy(ballResetPosition);
  ballBody.velocity.set(0, 0, 0);
  ballBody.angularVelocity.set(0, 0, 0);

  // Move to next level
  currentLevel++;
  levelCounter.textContent = `Level: ${currentLevel}`;
  attempts = 0;
  attemptCounter.textContent = `Attempts: ${attempts}`;

  // Reset disc positions
  disc.position.set(0, 2, 0);
  disc2.position.set(0, 2, -10);
  disc3.position.set(0, 2, -20);
  initializeLevel();
};

function initializeLevel() {
  // Reset disc positions
  if (currentLevel === 1) {
    disc.position.set(0, 2, 0);
    disc2.position.set(0, 2, -10);
    disc3.position.set(0, 2, -20);
  } else if (currentLevel === 2) {
    disc.position.set(0, 2, 0);
    disc2.position.set(-3, 2, -10);
    disc3.position.set(3, 2, -20);
  }
}

const levelCompleteText = document.createElement("p");
levelCompleteText.style.fontSize = "2em";
levelCompleteText.style.marginBottom = "20px";
levelCompleteText.style.color = "white";
victoryOverlay.appendChild(levelCompleteText);

victoryOverlay.appendChild(victoryText);
victoryOverlay.appendChild(levelCompleteText);
victoryOverlay.appendChild(attemptsText);
victoryOverlay.appendChild(restartButton);
document.body.appendChild(victoryOverlay);

// Create a ball
const ballGeometry = new THREE.SphereGeometry(1, 32, 32);
const ballMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  roughness: 0.3,
  metalness: 0.7,
  emissive: 0xff0000,
  emissiveIntensity: 0.2,
});
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.castShadow = true;
ball.receiveShadow = true;
// Start the ball higher up
ball.position.set(0, 5, 0);
scene.add(ball);
console.log("Ball mesh created and added to scene");

// Create ball physics body
const ballBody = new CANNON.Body({
  mass: 5,
  shape: new CANNON.Sphere(1),
  material: new CANNON.Material({
    restitution: 0.95,
    friction: 0.5,
  }),
  linearDamping: 0.1,
  angularDamping: 0.1,
  collisionFilterGroup: 1,
  collisionFilterMask: 1,
});
ballBody.position.copy(ball.position);
world.addBody(ballBody);
console.log("Ball body added to world");

// Ball reset position
const ballResetPosition = new CANNON.Vec3(0, 5, 0);

// Position the camera
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Camera follow settings
const cameraOffset = new THREE.Vector3(0, 5, 10);
const cameraLookOffset = new THREE.Vector3(0, 2, 0);
const cameraLerpFactor = 0.1; // Lower value = smoother but slower following

const keys = {};
const lean = { x: 0, y: 0 };

function updateLean() {
  let dx = 0,
    dy = 0;
  if (keys.ArrowLeft || keys.a) dx += -0.05;
  if (keys.ArrowRight || keys.d) dx += 0.05;
  if (keys.ArrowUp || keys.w) dy += 0.05;
  if (keys.ArrowDown || keys.s) dy += -0.05;
  lean.x = lean.x * 0.9 + dx;
  lean.y = lean.y * 0.9 + dy;
}

document.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});

document.addEventListener("keyup", (event) => {
  delete keys[event.key];
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Step the physics world
  world.step(1 / 60);

  time += 1 / 60;

  // Level-specific disc movements
  if (currentLevel === 4) {
    // Level 2: Discs move left/right
    const xOffset = Math.sin(time * 2) * 3; // Move 3 units left/right
    disc.position.x = xOffset;
    disc2.position.x = xOffset;
    disc3.position.x = xOffset;

    // Update physics bodies
    discBody.position.x = xOffset;
    disc2Body.position.x = xOffset;
    disc3Body.position.x = xOffset;
  } else if (currentLevel === 4) {
    // Level 2: Discs move left/right
    const xOffset = Math.sin(time * 2) * 3; // Move 3 units left/right
    disc.position.x = xOffset;
    disc2.position.x = xOffset;
    disc3.position.x = xOffset;

    // Update physics bodies
    discBody.position.x = xOffset;
    disc2Body.position.x = xOffset;
    disc3Body.position.x = xOffset;
  } else if (currentLevel === 3) {
    // Level 3: Discs move up/down
    const yOffset = Math.sin(time * 2) * 1 + 2; // Move between y=1 and y=3
    disc.position.y = yOffset;
    disc2.position.y = yOffset;
    disc3.position.y = yOffset;

    // Update physics bodies
    discBody.position.y = yOffset;
    disc2Body.position.y = yOffset;
    disc3Body.position.y = yOffset;
  }

  // Check if ball hit the ground and reset if needed
  if (ballBody.position.y < 0) {
    // Reset ball position and velocity
    ballBody.position.copy(ballResetPosition);
    ballBody.velocity.set(0, 0, 0);
    ballBody.angularVelocity.set(0, 0, 0);
    attempts++;
    attemptCounter.textContent = `Attempts: ${attempts}`;
  }

  // Check for collision with ring using contact equations
  const distance = ballBody.position.distanceTo(ringBody.position);
  const minDistance =
    ballBody.shapes[0].boundingSphereRadius +
    ringBody.shapes[0].boundingSphereRadius;

  if (distance < minDistance) {
    console.log(
      "Collision detected! Distance:",
      distance,
      "Min distance:",
      minDistance
    );
    victoryOverlay.style.display = "flex";
    if (currentLevel < 3) {
      levelCompleteText.textContent = `Level ${currentLevel} Complete!`;
      attemptsText.textContent = `You completed level ${currentLevel} in ${attempts} attempts!`;
    } else {
      levelCompleteText.textContent = "Game Complete!";
      attemptsText.textContent = `You finished all levels in ${attempts} attempts!`;
    }
    // Stop the ball
    ballBody.velocity.set(0, 0, 0);
    ballBody.angularVelocity.set(0, 0, 0);
  }

  // Update ball position and rotation
  ball.position.copy(ballBody.position);
  ball.quaternion.copy(ballBody.quaternion);

  // Update first disc rotation
  updateLean();
  disc.rotation.z = lean.x;
  disc.rotation.x = lean.y;

  // Update first disc physics body rotation
  const euler = new THREE.Euler(lean.y, 0, lean.x, "XYZ");
  const quaternion = new CANNON.Quaternion();
  quaternion.setFromEuler(euler.x, euler.y, euler.z);
  const initialRotation = new CANNON.Quaternion();
  initialRotation.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
  quaternion.mult(initialRotation, quaternion);
  discBody.quaternion.copy(quaternion);

  // Update second and third disc rotation (same as first disc)
  disc2.rotation.z = lean.x;
  disc2.rotation.x = lean.y;
  disc2Body.quaternion.copy(quaternion);
  disc3.rotation.z = lean.x;
  disc3.rotation.x = lean.y;
  disc3Body.quaternion.copy(quaternion);

  // Smoothly follow the ball with camera
  const targetPosition = new THREE.Vector3();
  targetPosition.copy(ball.position).add(cameraOffset);
  camera.position.lerp(targetPosition, cameraLerpFactor);

  // Smoothly look at a point slightly above the ball
  const targetLookAt = new THREE.Vector3();
  targetLookAt.copy(ball.position).add(cameraLookOffset);
  camera.lookAt(targetLookAt);

  renderer.render(scene, camera);
}

// Start the animation
console.log("Starting animation loop");
animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add collision event listener after all bodies are created
console.log("Setting up collision listener...");
world.addEventListener("collide", (event) => {
  console.log("Collision detected!");
  const bodyA = event.bodyA;
  const bodyB = event.bodyB;

  console.log("Body A:", bodyA);
  console.log("Body B:", bodyB);

  // Check if the collision is between the ball and the ring
  if (
    (bodyA === ballBody && bodyB === ringBody) ||
    (bodyA === ringBody && bodyB === ballBody)
  ) {
    // console.log("Victory condition met!");
    victoryOverlay.style.display = "flex";
    // Stop the ball
    ballBody.velocity.set(0, 0, 0);
    ballBody.angularVelocity.set(0, 0, 0);
  }
});

// Add debug logging for physics step
const originalStep = world.step;
world.step = function (dt) {
  console.log("Physics step:", dt);
  originalStep.call(this, dt);
};

// Create game description overlay
const descriptionOverlay = document.createElement("div");
descriptionOverlay.style.position = "fixed";
descriptionOverlay.style.top = "0";
descriptionOverlay.style.left = "0";
descriptionOverlay.style.width = "100%";
descriptionOverlay.style.height = "100%";
descriptionOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
descriptionOverlay.style.display = "flex";
descriptionOverlay.style.flexDirection = "column";
descriptionOverlay.style.justifyContent = "center";
descriptionOverlay.style.alignItems = "center";
descriptionOverlay.style.color = "white";
descriptionOverlay.style.fontFamily = "Arial, sans-serif";
descriptionOverlay.style.zIndex = "1000";
descriptionOverlay.style.textAlign = "center";
descriptionOverlay.style.padding = "20px";

const title = document.createElement("h1");
title.textContent = "Gravity Maze";
title.style.fontSize = "4em";
title.style.color = "#ffd700";
title.style.marginBottom = "20px";
title.style.textShadow = "2px 2px 4px rgba(0,0,0,0.5)";

const description = document.createElement("p");
description.textContent =
  "A physics-based puzzle game where you guide a ball through a series of rotating discs to reach the golden ring. Each level presents new challenges with moving platforms and gravity-defying obstacles.";
description.style.fontSize = "1.5em";
description.style.maxWidth = "800px";
description.style.marginBottom = "40px";
description.style.lineHeight = "1.5";

const requirements = document.createElement("div");
requirements.style.fontSize = "1.2em";
requirements.style.marginBottom = "40px";
requirements.style.lineHeight = "1.8";
requirements.style.color = "#ffd700";

const requirementsList = [
  "Recommended window size: 1280x720 or larger",
  "Fullscreen recommended for best experience",
];

requirementsList.forEach((text) => {
  const p = document.createElement("p");
  p.textContent = text;
  p.style.marginBottom = "8px";
  requirements.appendChild(p);
});

const instructions = document.createElement("div");
instructions.style.fontSize = "1.2em";
instructions.style.marginBottom = "40px";
instructions.style.lineHeight = "1.8";

const controls = document.createElement("p");
controls.textContent = "Controls:";
controls.style.fontWeight = "bold";
controls.style.marginBottom = "10px";

const controlList = document.createElement("ul");
controlList.style.listStyle = "none";
controlList.style.padding = "0";
controlList.style.margin = "0";

const controlsList = [
  "Arrow keys OR WASD to rotate the disc",
  "Guide the ball through the discs",
  "Avoid falling off the platforms",
  "Reach the golden ring to win",
];

controlsList.forEach((text) => {
  const li = document.createElement("li");
  li.textContent = text;
  li.style.marginBottom = "8px";
  controlList.appendChild(li);
});

const startButton = document.createElement("button");
startButton.textContent = "Start Game";
startButton.style.padding = "15px 30px";
startButton.style.fontSize = "1.5em";
startButton.style.backgroundColor = "#4CAF50";
startButton.style.color = "white";
startButton.style.border = "none";
startButton.style.borderRadius = "5px";
startButton.style.cursor = "pointer";
startButton.style.transition = "background-color 0.3s";

startButton.onmouseover = () => {
  startButton.style.backgroundColor = "#45a049";
};

startButton.onmouseout = () => {
  startButton.style.backgroundColor = "#4CAF50";
};

startButton.onclick = () => {
  descriptionOverlay.style.display = "none";
};

instructions.appendChild(controls);
instructions.appendChild(controlList);

descriptionOverlay.appendChild(title);
descriptionOverlay.appendChild(description);
descriptionOverlay.appendChild(requirements);
descriptionOverlay.appendChild(instructions);
descriptionOverlay.appendChild(startButton);
document.body.appendChild(descriptionOverlay);

// Add viewport size warning
const sizeWarning = document.createElement("div");
sizeWarning.style.position = "fixed";
sizeWarning.style.bottom = "20px";
sizeWarning.style.right = "20px";
sizeWarning.style.backgroundColor = "rgba(255, 0, 0, 0.7)";
sizeWarning.style.color = "white";
sizeWarning.style.padding = "10px 20px";
sizeWarning.style.borderRadius = "5px";
sizeWarning.style.fontFamily = "Arial, sans-serif";
sizeWarning.style.zIndex = "1000";
sizeWarning.style.display = "none";
sizeWarning.textContent =
  "Window too small! Please resize to at least 1280x720";
document.body.appendChild(sizeWarning);

// Check viewport size
function checkViewportSize() {
  if (window.innerWidth < 1280 || window.innerHeight < 720) {
    sizeWarning.style.display = "block";
  } else {
    sizeWarning.style.display = "none";
  }
}

// Initial check
checkViewportSize();

// Check on resize
window.addEventListener("resize", checkViewportSize);
