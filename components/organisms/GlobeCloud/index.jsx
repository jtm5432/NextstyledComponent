import React , { useMemo,useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GlobeCloud = React.memo((props) => {
    const { scene } = useThree();
    const { globeRadius = 100 } = props;
    
    const cloudGeometry = useMemo(() => new THREE.SphereGeometry(globeRadius * 101, 32, 32), [globeRadius]);
    const materialClouds = useMemo(() => new THREE.MeshPhongMaterial({
        color: 0xffffff,
        map: new THREE.TextureLoader().load('/renderSiem/css/images/globe_clouds.png'),
        transparent: true,
        opacity: 1,
        depthTest: false
    }), []);

    const globeClouds = useMemo(() => new THREE.Mesh(cloudGeometry, materialClouds), [cloudGeometry, materialClouds]);
    
    useFrame(() => {
        // If you want to update something in the animation loop
    });

    useEffect(() => {
        globeClouds.renderOrder = 1;
        scene.add(globeClouds);
        console.log('globeClouds', globeClouds);
        console.log('scene current children:', scene); // 여기서 scene의 자식 객체들을 모두 로깅합니다.
        return () => scene.remove(globeClouds);
    }, [scene, globeClouds]);

    return null;
});

export default GlobeCloud;
