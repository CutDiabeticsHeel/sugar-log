import { createGlucometer, createInsulinSyringe, setInsulinSyringeUnits } from "../models/Medicalmodels";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

class ColorGUIHelper {
    constructor(object, prop) {
        this.object = object;
        this.prop = prop;
    }
    get value() {
        return "#" + this.object[this.prop].getHexString();
    }
    set value(hexString) {
        this.object[this.prop].set(hexString);
    }
}

function MedicalScene() {
    const medicalRef = useRef(null);

    useEffect(() => {
        const container = medicalRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();

        const gluc = createGlucometer({ value: "5.6" });
        gluc.scale.setScalar(0.2);
        gluc.position.set(-2.5, 2, 0);
        gluc.rotation.y = Math.PI / 10;
        gluc.rotation.z = -Math.PI / 10;
        scene.add(gluc);

        const syringe = createInsulinSyringe()
        syringe.userData.cap.visible = false
        syringe.scale.setScalar(0.3);
        syringe.rotation.y = -Math.PI / 6;
        syringe.rotation.z = Math.PI - 0.15; 
        syringe.position.set(2, -1, 0);
        scene.add(syringe);

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 2, 6);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const light = new THREE.AmbientLight(0xffffff, 5);
        scene.add(light);

        const gui = new GUI();
        gui.addColor(new ColorGUIHelper(light, "color"), "value").name("color");
        gui.add(light, "intensity", 0, 5, 0.01);
        gui.hide();

        let frameId;
        const animate = (ms) => {
            const t = ms / 1000;
            frameId = requestAnimationFrame(animate);
            setInsulinSyringeUnits(syringe, 20 + (Math.sin(t * 0.9) + 1) / 2 * 75);
            renderer.render(scene, camera);
        };
        frameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(frameId);
            gui.destroy();
            container.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={medicalRef}
            style={{ width: "100vw", height: "100vh", position: "fixed", zIndex: -1 }}
        />
    );
}

export default MedicalScene;