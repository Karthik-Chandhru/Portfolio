import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ThreeAvatar({ isLightOn }) {
  const mountRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSpeakingRef = useRef(false);
  const [speechError, setSpeechError] = useState(null);
  
  const mouthRef = useRef(null);
  const rightArmRef = useRef(null);
  const headRef = useRef(null);
  const bodyRef = useRef(null);
  
  // Table Lamp Refs for dynamic lighting toggles
  const bulbRef = useRef(null);
  const lampLightRef = useRef(null);
  const shadeRef = useRef(null);
  
  // Track mouse coordinates for cursor-following head movement
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize to -1 to 1
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // PointLight / Emissive toggles inside the active 3D scene when the light switch is pulled
  useEffect(() => {
    if (lampLightRef.current) {
      lampLightRef.current.intensity = isLightOn ? 5.5 : 0.0;
    }
    if (bulbRef.current) {
      if (isLightOn) {
        bulbRef.current.material.emissive = new THREE.Color(0xfacc15);
        bulbRef.current.material.emissiveIntensity = 3.0;
      } else {
        bulbRef.current.material.emissive = new THREE.Color(0x000000);
        bulbRef.current.material.emissiveIntensity = 0.0;
      }
    }
    if (shadeRef.current) {
      if (isLightOn) {
        shadeRef.current.material.emissive = new THREE.Color(0xd97706);
        shadeRef.current.material.emissiveIntensity = 0.55;
      } else {
        shadeRef.current.material.emissive = new THREE.Color(0x000000);
        shadeRef.current.material.emissiveIntensity = 0.0;
      }
    }
  }, [isLightOn]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    container.innerHTML = '';

    // --- THREE.JS INITIALIZATION ---
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    
    // Perspective Camera focusing on the avatar
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.45, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(1.5, 4, 3.5);
    scene.add(mainLight);

    // Neon Rim lights to match Yellow-Blue scenic theme
    const rimLightBlue = new THREE.PointLight(0x3b82f6, 3.5, 10);
    rimLightBlue.position.set(-2, 1, 1.2);
    scene.add(rimLightBlue);

    const rimLightYellow = new THREE.PointLight(0xfacc15, 3.5, 10);
    rimLightYellow.position.set(2, 1, 1.2);
    scene.add(rimLightYellow);

    // --- AVATAR GEOMETRY ---
    const avatarGroup = new THREE.Group();
    avatarGroup.position.y = -0.75;
    scene.add(avatarGroup);

    // Materials
    const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xdf9a6b, roughness: 0.45 }); // Clean skin
    const hoodieMaterial = new THREE.MeshStandardMaterial({ color: 0x2b4c7e, roughness: 0.7 }); // Cozy Blue Hoodie
    const innerHoodieMaterial = new THREE.MeshStandardMaterial({ color: 0x3d669e, roughness: 0.6 }); 
    const stringMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }); 
    const glassesMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1 }); 
    const hairMaterial = new THREE.MeshStandardMaterial({ color: 0x5a3d28, roughness: 0.85 }); // Warm brown hair
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
    const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x1c1917 });
    const catchlightMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
    const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0x5c1d1d, roughness: 0.5 });

    // 1. Chibi Torso in Hoodie (Cylinder shape)
    const torsoGeom = new THREE.CylinderGeometry(0.38, 0.3, 1.0, 32);
    const torso = new THREE.Mesh(torsoGeom, hoodieMaterial);
    torso.position.y = 0.5;
    avatarGroup.add(torso);
    bodyRef.current = torso;

    // 2. Hoodie Hood (Large squashed sphere behind the head)
    const hoodGeom = new THREE.SphereGeometry(0.48, 32, 16);
    const hood = new THREE.Mesh(hoodGeom, hoodieMaterial);
    hood.scale.set(1.05, 1.1, 0.7);
    hood.position.set(0, 0.9, -0.15);
    avatarGroup.add(hood);

    // Inner Hood rim (gives a layered look)
    const hoodRimGeom = new THREE.CylinderGeometry(0.4, 0.42, 0.1, 32);
    const hoodRim = new THREE.Mesh(hoodRimGeom, innerHoodieMaterial);
    hoodRim.rotation.x = Math.PI / 2.2;
    hoodRim.position.set(0, 0.95, 0.08);
    avatarGroup.add(hoodRim);

    // 3. Hoodie Drawstrings (Hanging cylinders)
    const stringGeom = new THREE.CylinderGeometry(0.012, 0.012, 0.4, 8);
    const leftString = new THREE.Mesh(stringGeom, stringMaterial);
    leftString.position.set(-0.1, 0.65, 0.3);
    leftString.rotation.z = 0.05;
    avatarGroup.add(leftString);

    const rightString = new THREE.Mesh(stringGeom, stringMaterial);
    rightString.position.set(0.1, 0.65, 0.3);
    rightString.rotation.z = -0.05;
    avatarGroup.add(rightString);

    // String knots (caps at the end)
    const knotGeom = new THREE.SphereGeometry(0.02, 8, 8);
    const leftKnot = new THREE.Mesh(knotGeom, stringMaterial);
    leftKnot.position.set(-0.11, 0.45, 0.31);
    avatarGroup.add(leftKnot);

    const rightKnot = new THREE.Mesh(knotGeom, stringMaterial);
    rightKnot.position.set(0.11, 0.45, 0.31);
    avatarGroup.add(rightKnot);

    // 4. Head Group (Clean-shaven boy)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.4, 0);
    avatarGroup.add(headGroup);
    headRef.current = headGroup;

    // Large Chibi Head Sphere (Radius 0.46)
    const headGeom = new THREE.SphereGeometry(0.46, 32, 32);
    const head = new THREE.Mesh(headGeom, skinMaterial);
    headGroup.add(head);

    // --- CUSTOM HAIR DESIGN matching user photo (Swept up & right) ---
    const hairGroup = new THREE.Group();
    headGroup.add(hairGroup);

    // Main Hair Base
    const hairBaseGeom = new THREE.SphereGeometry(0.48, 32, 16);
    const hairBase = new THREE.Mesh(hairBaseGeom, hairMaterial);
    hairBase.position.set(0, 0.05, -0.02);
    hairBase.scale.set(1.02, 1.0, 1.05);
    hairGroup.add(hairBase);

    // Back Hair Coverage
    const hairBackGeom = new THREE.BoxGeometry(0.74, 0.5, 0.4);
    const hairBack = new THREE.Mesh(hairBackGeom, hairMaterial);
    hairBack.position.set(0, -0.08, -0.2);
    hairGroup.add(hairBack);

    // Hair Sideburns
    const sideburnGeom = new THREE.BoxGeometry(0.04, 0.16, 0.12);
    const leftSideburn = new THREE.Mesh(sideburnGeom, hairMaterial);
    leftSideburn.position.set(-0.46, -0.05, 0.1);
    leftSideburn.rotation.y = 0.2;
    hairGroup.add(leftSideburn);

    const rightSideburn = new THREE.Mesh(sideburnGeom, hairMaterial);
    rightSideburn.position.set(0.46, -0.05, 0.1);
    rightSideburn.rotation.y = -0.2;
    hairGroup.add(rightSideburn);

    // Swept Up & Right Hair Volumes (Multiple overlapping curved boxes/spheres)
    const swoop1Geom = new THREE.BoxGeometry(0.24, 0.28, 0.24);
    const swoop1 = new THREE.Mesh(swoop1Geom, hairMaterial);
    swoop1.position.set(0.12, 0.38, 0.16);
    swoop1.rotation.set(-0.25, 0.3, -0.3); // Angled right and up
    hairGroup.add(swoop1);

    const swoop2Geom = new THREE.BoxGeometry(0.22, 0.22, 0.22);
    const swoop2 = new THREE.Mesh(swoop2Geom, hairMaterial);
    swoop2.position.set(0.26, 0.32, 0.08);
    swoop2.rotation.set(-0.2, 0.2, -0.4);
    hairGroup.add(swoop2);

    const swoop3Geom = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    const swoop3 = new THREE.Mesh(swoop3Geom, hairMaterial);
    swoop3.position.set(-0.06, 0.42, 0.14);
    swoop3.rotation.set(-0.3, 0.4, -0.2);
    hairGroup.add(swoop3);

    // Fringe Bangs Swept to the Right across forehead
    const fringeGeom = new THREE.BoxGeometry(0.22, 0.12, 0.18);
    const fringe1 = new THREE.Mesh(fringeGeom, hairMaterial);
    fringe1.position.set(0.04, 0.28, 0.34);
    fringe1.rotation.set(-0.15, 0.25, -0.2);
    hairGroup.add(fringe1);

    const fringe2 = new THREE.Mesh(fringeGeom, hairMaterial);
    fringe2.position.set(-0.14, 0.29, 0.33);
    fringe2.rotation.set(-0.2, 0.3, -0.1);
    hairGroup.add(fringe2);

    // --- CARTOON EYES (Large & expressive) ---
    const eyeGeom = new THREE.SphereGeometry(0.085, 16, 16);
    const pupilGeom = new THREE.SphereGeometry(0.052, 16, 16);
    const catchlightGeom = new THREE.SphereGeometry(0.016, 8, 8);

    // Left Eye Base
    const leftEye = new THREE.Mesh(eyeGeom, eyeMaterial);
    leftEye.position.set(-0.16, 0.04, 0.39);
    leftEye.scale.set(1, 1.05, 0.25);
    headGroup.add(leftEye);

    // Left Pupil
    const leftPupil = new THREE.Mesh(pupilGeom, pupilMaterial);
    leftPupil.position.set(-0.16, 0.04, 0.41);
    leftPupil.scale.set(1, 1.15, 0.15);
    headGroup.add(leftPupil);

    // Left Pupil Shiny Catchlight (Top-Left)
    const leftCatchlight = new THREE.Mesh(catchlightGeom, catchlightMaterial);
    leftCatchlight.position.set(-0.13, 0.07, 0.422);
    headGroup.add(leftCatchlight);

    // Right Eye Base
    const rightEye = new THREE.Mesh(eyeGeom, eyeMaterial);
    rightEye.position.set(0.16, 0.04, 0.39);
    rightEye.scale.set(1, 1.05, 0.25);
    headGroup.add(rightEye);

    // Right Pupil
    const rightPupil = new THREE.Mesh(pupilGeom, pupilMaterial);
    rightPupil.position.set(0.16, 0.04, 0.41);
    rightPupil.scale.set(1, 1.15, 0.15);
    headGroup.add(rightPupil);

    // Right Pupil Shiny Catchlight (Top-Left)
    const rightCatchlight = new THREE.Mesh(catchlightGeom, catchlightMaterial);
    rightCatchlight.position.set(0.19, 0.07, 0.422);
    headGroup.add(rightCatchlight);

    // Eyebrows (styled brown)
    const browGeom = new THREE.BoxGeometry(0.13, 0.024, 0.02);
    const leftBrow = new THREE.Mesh(browGeom, hairMaterial);
    leftBrow.position.set(-0.17, 0.15, 0.41);
    leftBrow.rotation.z = 0.06;
    headGroup.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeom, hairMaterial);
    rightBrow.position.set(0.17, 0.15, 0.41);
    rightBrow.rotation.z = -0.06;
    headGroup.add(rightBrow);

    // Nose
    const noseGeom = new THREE.ConeGeometry(0.032, 0.075, 4);
    const nose = new THREE.Mesh(noseGeom, skinMaterial);
    nose.position.set(0, -0.05, 0.45);
    nose.rotation.x = 0.12;
    headGroup.add(nose);

    // --- SLEEK ROUND BLACK GLASSES (Matching the boy's look) ---
    const glassesGroup = new THREE.Group();
    glassesGroup.position.set(0, 0.04, 0.42);
    headGroup.add(glassesGroup);

    // Left Ring Frame (Torus: radius = 0.13, tubeWidth = 0.015)
    const torusGeom = new THREE.TorusGeometry(0.13, 0.014, 8, 32);
    const leftFrame = new THREE.Mesh(torusGeom, glassesMaterial);
    leftFrame.position.set(-0.16, 0, 0);
    glassesGroup.add(leftFrame);

    // Right Ring Frame
    const rightFrame = new THREE.Mesh(torusGeom, glassesMaterial);
    rightFrame.position.set(0.16, 0, 0);
    glassesGroup.add(rightFrame);

    // Bridge connector
    const bridgeGeom = new THREE.CylinderGeometry(0.01, 0.01, 0.08, 8);
    const bridge = new THREE.Mesh(bridgeGeom, glassesMaterial);
    bridge.rotation.z = Math.PI / 2;
    bridge.position.set(0, 0.01, -0.005);
    glassesGroup.add(bridge);

    // Left temple arm running to ears
    const templeGeom = new THREE.BoxGeometry(0.01, 0.01, 0.46);
    const leftTemple = new THREE.Mesh(templeGeom, glassesMaterial);
    leftTemple.position.set(-0.29, 0.01, -0.22);
    leftTemple.rotation.y = 0.08;
    glassesGroup.add(leftTemple);

    // Right temple arm
    const rightTemple = new THREE.Mesh(templeGeom, glassesMaterial);
    rightTemple.position.set(0.29, 0.01, -0.22);
    rightTemple.rotation.y = -0.08;
    glassesGroup.add(rightTemple);

    // Mouth (used for speech animation)
    const mouthGeom = new THREE.BoxGeometry(0.11, 0.02, 0.03);
    const mouth = new THREE.Mesh(mouthGeom, mouthMaterial);
    mouth.position.set(0, -0.17, 0.42);
    headGroup.add(mouth);
    mouthRef.current = mouth;

    // 5. Limbs (Arms in Blue Hoodie sleeves)
    const armGeom = new THREE.CylinderGeometry(0.085, 0.07, 0.8, 16);
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.52, 0.95, 0);
    avatarGroup.add(leftArmGroup);

    const leftArm = new THREE.Mesh(armGeom, hoodieMaterial);
    leftArm.position.y = -0.3;
    leftArmGroup.add(leftArm);

    const leftHandGeom = new THREE.SphereGeometry(0.08, 16, 16);
    const leftHand = new THREE.Mesh(leftHandGeom, skinMaterial);
    leftHand.position.y = -0.7;
    leftArmGroup.add(leftHand);

    // Right Arm (Waving gesture arm during speech!)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.52, 0.95, 0);
    avatarGroup.add(rightArmGroup);
    rightArmRef.current = rightArmGroup;

    const rightArm = new THREE.Mesh(armGeom, hoodieMaterial);
    rightArm.position.y = -0.3;
    rightArmGroup.add(rightArm);

    const rightHand = new THREE.Mesh(leftHandGeom, skinMaterial);
    rightHand.position.y = -0.7;
    rightArmGroup.add(rightHand);

    rightArmGroup.rotation.z = -0.1;

    // --- 3D TABLE LAMP DESIGN ---
    const lampGroup = new THREE.Group();
    lampGroup.position.set(-0.72, 0.0, 0.25); 
    avatarGroup.add(lampGroup);

    const metalMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xd97706, // Gold/Brass base metal
      metalness: 0.8, 
      roughness: 0.25 
    });

    const lampShadeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1e3a8a, // Midnight Blue shade body
      roughness: 0.4,
      emissive: 0x000000,
      emissiveIntensity: 0.0
    });

    const lampBulbMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff, 
      roughness: 0.1,
      emissive: 0x000000,
      emissiveIntensity: 0.0
    });

    // Lamp Base
    const lampBaseGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.03, 16);
    const lampBase = new THREE.Mesh(lampBaseGeom, metalMaterial);
    lampBase.position.y = 0.015;
    lampGroup.add(lampBase);

    // Lamp Stand / Rod
    const lampRodGeom = new THREE.CylinderGeometry(0.012, 0.012, 0.65, 16);
    const lampRod = new THREE.Mesh(lampRodGeom, metalMaterial);
    lampRod.position.y = 0.34;
    lampGroup.add(lampRod);

    // Lamp Shade
    const lampShadeGeom = new THREE.CylinderGeometry(0.06, 0.15, 0.18, 16);
    const lampShade = new THREE.Mesh(lampShadeGeom, lampShadeMaterial);
    lampShade.position.y = 0.65;
    lampShade.rotation.z = 0.2; // Pointed towards the boy
    lampGroup.add(lampShade);
    shadeRef.current = lampShade;

    // Glowing Light Bulb
    const lampBulbGeom = new THREE.SphereGeometry(0.035, 16, 16);
    const lampBulb = new THREE.Mesh(lampBulbGeom, lampBulbMaterial);
    lampBulb.position.set(0.015, 0.58, 0);
    lampGroup.add(lampBulb);
    bulbRef.current = lampBulb;

    // 3D PointLight source (illuminates the boy avatar!)
    const pointLight = new THREE.PointLight(0xfacc15, 0, 5);
    pointLight.position.set(0.015, 0.58, 0);
    lampGroup.add(pointLight);
    lampLightRef.current = pointLight;

    // --- ANIMATION LOOP ---
    let time = 0;
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.05;

      // 1. Idle Breathing Animation (body rising/lowering)
      if (bodyRef.current) {
        bodyRef.current.scale.y = 1 + Math.sin(time * 0.5) * 0.015;
      }
      leftArmGroup.rotation.z = Math.sin(time * 0.5) * 0.03 - 0.05;

      // 2. Arm gestures when speaking
      if (isSpeakingRef.current) {
        rightArmGroup.rotation.z = (Math.PI / 2) + Math.sin(time * 2.2) * 0.18;
        rightArmGroup.rotation.x = Math.sin(time * 1.1) * 0.12;
      } else {
        rightArmGroup.rotation.z = -0.1 + Math.sin(time * 0.5) * 0.02;
        rightArmGroup.rotation.x = 0;
      }

      // 3. Cursor Tracking (smooth head rotations)
      if (headRef.current) {
        const targetRY = mouse.current.x * 0.42;
        const targetRX = mouse.current.y * 0.22;

        headRef.current.rotation.y += (targetRY - headRef.current.rotation.y) * 0.08;
        headRef.current.rotation.x += (targetRX - headRef.current.rotation.x) * 0.08;
      }

      // 4. Lip-sync mouth shape scaling
      if (mouthRef.current) {
        if (isSpeakingRef.current) {
          const openAmount = 0.5 + Math.abs(Math.sin(time * 4)) * 1.6;
          mouthRef.current.scale.y = openAmount;
          mouthRef.current.scale.x = 1.0 + Math.sin(time * 2.5) * 0.08; 
        } else {
          mouthRef.current.scale.set(1, 1, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- RESIZE HANDLING ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // --- CLEANUP ---
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      // Dispose geometries
      torsoGeom.dispose();
      hoodGeom.dispose();
      hoodRimGeom.dispose();
      stringGeom.dispose();
      knotGeom.dispose();
      headGeom.dispose();
      hairBaseGeom.dispose();
      hairBackGeom.dispose();
      sideburnGeom.dispose();
      swoop1Geom.dispose();
      swoop2Geom.dispose();
      swoop3Geom.dispose();
      fringeGeom.dispose();
      eyeGeom.dispose();
      pupilGeom.dispose();
      catchlightGeom.dispose();
      browGeom.dispose();
      noseGeom.dispose();
      torusGeom.dispose();
      bridgeGeom.dispose();
      templeGeom.dispose();
      mouthGeom.dispose();
      armGeom.dispose();
      leftHandGeom.dispose();
      lampBaseGeom.dispose();
      lampRodGeom.dispose();
      lampShadeGeom.dispose();
      lampBulbGeom.dispose();

      // Dispose materials
      skinMaterial.dispose();
      hoodieMaterial.dispose();
      innerHoodieMaterial.dispose();
      stringMaterial.dispose();
      glassesMaterial.dispose();
      hairMaterial.dispose();
      eyeMaterial.dispose();
      pupilMaterial.dispose();
      catchlightMaterial.dispose();
      mouthMaterial.dispose();
      metalMaterial.dispose();
      lampShadeMaterial.dispose();
      lampBulbMaterial.dispose();

      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  const speakGreeting = () => {
    if (!('speechSynthesis' in window)) {
      setSpeechError('Web Speech API is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    const text = "Hi, I am Karthik Chandhru from Erode. I am a MERN Stack, Dot net Developer and AIML Engineer, and I am happy to see you!";
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => 
      voice.lang.startsWith('en-') && 
      (voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('google') || voice.name.toLowerCase().includes('natural'))
    ) || voices.find(voice => voice.lang.startsWith('en-')) || voices[0];
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsSpeaking(false);
      setSpeechError(`Speech synthesis error: ${e.error}`);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="three-avatar-container">
      {/* 3D WebGL Render Target */}
      <div className="three-canvas-target" ref={mountRef}></div>

      {/* Speech Button Controller */}
      <div className="avatar-control-overlay">
        <button 
          className={`btn-greet ${isSpeaking ? 'active' : ''}`}
          onClick={speakGreeting}
          disabled={isSpeaking}
        >
          {isSpeaking ? (
            <>
              <span className="speech-wave-bar bar-1"></span>
              <span className="speech-wave-bar bar-2"></span>
              <span className="speech-wave-bar bar-3"></span>
              Speaking...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
                <line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
              Greet Me!
            </>
          )}
        </button>

        {speechError && (
          <div className="speech-error-tag">{speechError}</div>
        )}
      </div>
    </div>
  );
}
