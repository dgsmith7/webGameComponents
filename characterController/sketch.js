/*//////////////////////////////////////////////////////////
"1ofX Simple ThreeJS template" 
Original code by David Gail Smith, February 2022
Twitter: @davidgailsmith
http://baconbitscollective.org
A simple JS starter template for THREE js projects on 1ofX
*/ //////////////////////////////////////////////////////////

// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import {
//   Scene,
//   Color,
//   PerspectiveCamera,
//   AmbientLight,
//   DirectionalLight,
//   SpotLight,
//   HemisphereLight,
//   WebGLRenderer,
//   BoxGeometry,
//   MeshPhongMaterial,
//   DoubleSide,
//   Mesh,
//   Clock,
//   AnimationMixer,
//   Vector3,
//   PlaneGeometry,
// } from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let container,
  scene,
  camera,
  renderer,
  ambLt,
  dirLt,
  spotLt,
  geometry,
  material,
  mesh,
  controls,
  mixer,
  model;
let screenShotDone = false;
let clock = new THREE.Clock();
let idleAction,
  walkAction,
  runAction,
  magicAreaAction,
  magicAttackAction,
  putDownAction,
  pickUpAction,
  dyingAction,
  standToKneelAction,
  kneelingIdleAction,
  kneelToStandAction,
  breakDanceAction,
  victoryAction;
let actions, currentAction, nextAction;
let nextActionIdx = 0;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);
  setCamera();
  setLights();
  buildRenderer();
  container = renderer.domElement;
  document.body.appendChild(container);
  //  loadAssets();  //  to load a 3d model from ipfs link
  loadGLTF();
  buildIt();
  //buildHawkCluster();
  addOrbitControls();
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("click", onKeyPress);
  window.addEventListener("touchstart", onKeyPress);
  //idleAction.play();
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  updateScene();
  renderer.render(scene, camera);
}

function updateScene() {
  if (screenShotDone == false) {
    // waits for first frame to take screenshot and send features
    //  add features on next line if desired
    //  window.OneOfX.save({Hubs: 6, Stages: 3, Gears: 26, Rods: 29, Color_Schemes: 12, Palettes: 130});
    screenShotDone = true;
  }
  // put any scene updates here (rotation of objects for example, etc)
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  controls.update();
  camera.lookAt(0, 125, 0);
}

function setCamera() {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.x = 0;
  camera.position.y = -75;
  camera.position.z = 25;
  scene.add(camera);
  camera.lookAt(0, 0, 0);
}

function setLights() {
  ambLt = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambLt);

  dirLt = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLt.position.set(0, -15, 20);
  dirLt.castShadow = true;
  scene.add(dirLt);

  spotLt = new THREE.SpotLight(0xffffff, 0.5);
  spotLt.position.set(2, -55, 50);
  spotLt.decay = 2.0;
  spotLt.castShadow = true;
  scene.add(spotLt);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, -10, 20);
  scene.add(hemiLight);
}

function buildRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight, true);
  renderer.setPixelRatio(window.devicePixelRatio || 1);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// function loadAssets() {
//   const loader = new OBJLoader();
//   let material;
//   let cubeColor = new Color(baconRand.rand(), baconRand.rand(), baconRand.rand());
//   // Texture cubes as background
//   loader.load('https://ipfs.io/ipfs/bafybeihsxmq6fqvjzew7sje5fg5ahtr3rytafzrrsdu3bkwuhbnsxvrcmm', function(object) {
//     object.name = "modelname";
//     object.position = new Vector3();
//     object.position.x = 0;
//     object.position.y = 0;
//     object.position.z = 0;
//     object.rotation.y = 0;
//     material = new MeshStandardMaterial({
//       color: cubeColor,
//       metalness: 0.8,
//       roughness: 0.2,
//     });
// object.material = material;
//    scene.add(object);
//     console.log("Spinner - ", object);
//   }, function(xhr) {
//     console.log((xhr.loaded / xhr.total * 100) + '% of SPinner loaded');
//   }, function(error) {
//     console.log('An error happened with Spinner:' + error);
//   });
// }

function loadGLTF() {
  let fNames = [
    "WarriorIdle",
    "Running",
    "Walking",
    "Breakdance",
    "CrouchingIdle",
    "CrouchToStand",
    "Dying",
    "Lifting",
    "MagicAttack",
    "PuttingDown",
    "StandingToCrouched",
    "Victory",
  ];
  const loader = new GLTFLoader();
  loader.load("./models/dummy2/DummyMultiAnim.gltf", function (gltf) {
    model = gltf.scene;

    model.rotation.x = Math.PI / 2;
    let offset = 2;
    console.log(model.position.y);
    model.position.z = 9;
    console.log(model.position.y);
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    scene.add(model);

    model.traverse(function (object) {
      if (object.isMesh) {
        object.castShadow = true;
      }
    });

    //

    // skeleton = new THREE.SkeletonHelper( model );
    // skeleton.visible = false;
    // scene.add( skeleton );

    //

    const animations = gltf.animations;

    mixer = new THREE.AnimationMixer(model);

    idleAction = mixer.clipAction(animations[11]);
    walkAction = mixer.clipAction(animations[9]);
    runAction = mixer.clipAction(animations[8]);
    magicAreaAction = mixer.clipAction(animations[0]);
    magicAttackAction = mixer.clipAction(animations[1]);
    putDownAction = mixer.clipAction(animations[2]);
    pickUpAction = mixer.clipAction(animations[3]);
    dyingAction = mixer.clipAction(animations[4]);
    standToKneelAction = mixer.clipAction(animations[5]);
    kneelingIdleAction = mixer.clipAction(animations[6]);
    kneelToStandAction = mixer.clipAction(animations[12]);
    breakDanceAction = mixer.clipAction(animations[10]);
    victoryAction = mixer.clipAction(animations[7]);

    actions = [
      idleAction,
      victoryAction,
      walkAction,
      runAction,
      magicAreaAction,
      magicAttackAction,
      putDownAction,
      pickUpAction,
      dyingAction,
      //     standToKneelAction,
      kneelingIdleAction,
      kneelToStandAction,
      breakDanceAction,
    ];

    currentAction = actions[0];
    nextAction = actions[0];
    currentAction.play();
    //activateAllActions();

    //animate();
  });
}

function onKeyPress(evt) {
  evt.preventDefault();
  nextActionIdx++;
  if (nextActionIdx >= actions.length) {
    nextActionIdx = 0;
    mixer.stopAllAction();
  }
  console.log("Key - next action is ", actions[nextActionIdx]._clip.name);
  transitionToNextAnim(nextActionIdx);
}

function transitionToNextAnim(nextActionIdx) {
  //  current.play();
  nextAction = actions[nextActionIdx];
  // after two seconds, start crossfade

  //  setTimeout(function () {
  //  currentAction.play();
  console.log(
    "transitioning from ",
    currentAction._clip.name,
    " to ",
    nextAction._clip.name
  );
  currentAction.play();
  nextAction.play();
  currentAction.crossFadeTo(nextAction, 1);
  //  }, 2000);
  //  currentAction.stop();
  currentAction = nextAction;

  console.log("Current action is now ", currentAction._clip.name);
}
// function showModel( visibility ) {

//   model.visible = visibility;

// }

// function showSkeleton( visibility ) {

//   skeleton.visible = visibility;

// }

// function modifyTimeScale( speed ) {

//   mixer.timeScale = speed;

// }

// function deactivateAllActions() {

//   actions.forEach( function ( action ) {

//     action.stop();

//   } );

// }

// function activateAllActions() {

//   setWeight( idleAction, settings[ 'modify idle weight' ] );
//   setWeight( walkAction, settings[ 'modify walk weight' ] );
//   setWeight( runAction, settings[ 'modify run weight' ] );

//   actions.forEach( function ( action ) {

//     action.play();

//   } );

// }

// function pauseContinue() {

//   if ( singleStepMode ) {

//     singleStepMode = false;
//     unPauseAllActions();

//   } else {

//     if ( idleAction.paused ) {

//       unPauseAllActions();

//     } else {

//       pauseAllActions();

//     }

//   }

// }

// function pauseAllActions() {

//   actions.forEach( function ( action ) {

//     action.paused = true;

//   } );

// }

// function unPauseAllActions() {

//   actions.forEach( function ( action ) {

//     action.paused = false;

//   } );

// }

// function toSingleStepMode() {

//   unPauseAllActions();

//   singleStepMode = true;
//   sizeOfNextStep = settings[ 'modify step size' ];

// }

// function prepareCrossFade( startAction, endAction, defaultDuration ) {

//   // Switch default / custom crossfade duration (according to the user's choice)

//   const duration = setCrossFadeDuration( defaultDuration );

//   // Make sure that we don't go on in singleStepMode, and that all actions are unpaused

//   singleStepMode = false;
//   unPauseAllActions();

//   // If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
//   // else wait until the current action has finished its current loop

//   if ( startAction === idleAction ) {

//     executeCrossFade( startAction, endAction, duration );

//   } else {

//     synchronizeCrossFade( startAction, endAction, duration );

//   }

// }

// function setCrossFadeDuration( defaultDuration ) {

//   // Switch default crossfade duration <-> custom crossfade duration

//   if ( settings[ 'use default duration' ] ) {

//     return defaultDuration;

//   } else {

//     return settings[ 'set custom duration' ];

//   }

// }

// function synchronizeCrossFade( startAction, endAction, duration ) {

//   mixer.addEventListener( 'loop', onLoopFinished );

//   function onLoopFinished( event ) {

//     if ( event.action === startAction ) {

//       mixer.removeEventListener( 'loop', onLoopFinished );

//       executeCrossFade( startAction, endAction, duration );

//     }

//   }

// }

// function executeCrossFade( startAction, endAction, duration ) {

//   // Not only the start action, but also the end action must get a weight of 1 before fading
//   // (concerning the start action this is already guaranteed in this place)

//   setWeight( endAction, 1 );
//   endAction.time = 0;

//   // Crossfade with warping - you can also try without warping by setting the third parameter to false

//   startAction.crossFadeTo( endAction, duration, true );

// }

// // This function is needed, since animationAction.crossFadeTo() disables its start action and sets
// // the start action's timeScale to ((start animation's duration) / (end animation's duration))

// function setWeight( action, weight ) {

//   action.enabled = true;
//   action.setEffectiveTimeScale( 1 );
//   action.setEffectiveWeight( weight );

// }

function buildIt() {
  //  put all of your geometry and materials in here
  // ground

  (geometry = new THREE.PlaneGeometry(100, 100)),
    (material = new THREE.MeshPhongMaterial({
      color: 0x555555,
      //    depthWrite: false,
      side: DoubleSide,
    }));
  mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.z = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  // geometry = new BoxGeometry(2, 2, 2);
  // material = new MeshPhongMaterial({
  //   color: "purple",
  //   side: DoubleSide,
  // });
  // mesh = new Mesh(geometry, material);
  // scene.add(mesh);
  console.log(scene);
}

function addOrbitControls() {
  controls = new OrbitControls(camera, container);
  controls.minDistance = 5;
  controls.maxDistance = 500;
  //  controls.autoRotate = true;
}

init();
animate();
