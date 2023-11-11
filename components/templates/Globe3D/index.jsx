import React, { useEffect, useRef, useReducer, useMemo, useState } from 'react';
import Globe from 'react-globe.gl';
import { Canvas } from '@react-three/fiber';
import { useThree, useFrame } from '@react-three/fiber';

import * as THREE from 'three';
import useSocketData from '../../../app/hooks/useSocketData';
import useRecentData from '../../../app/queries/providerDashboard/useRecentData';
import { useQueryClient } from 'react-query';

const initialState = {
  globeRadius: undefined,
  Width: 100,
  Height: 100,
  polygonData: [],
  arcData: [],

};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA_VAL":
      return {
        ...state,
        arcData: [action.routeinfo]
      };
    case "SET_COUNTRIES":
      return {
        ...state,
        polygonData: action.filteredCountries
      };
    case "SET_DIMENSIONS":
      return {
        ...state,
        Width: action.width,
        Height: action.height
      };
    default:
      return state;
  }
};
// World 컴포넌트 내부에 GlobeCloud 함수를 추가
const GlobeCloud = async (globe, globeRadius = 100) => {
  let globeClouds;
  await new THREE.TextureLoader().load('/renderSiem/css/images/globe_clouds.png', cloudsTexture => {
    globeClouds = new THREE.Mesh(
      new THREE.SphereGeometry(globe.getGlobeRadius() * (1.02), 75, 75),
      new THREE.MeshPhongMaterial({
        map: cloudsTexture, transparent: true,
        opacity: 0.5,
      })
    );
    globe.scene().add(globeClouds);
    rotateClouds();
  });

  // This function will be called recursively to animate the clouds rotation
  function rotateClouds() {
    //console.log('rotateClouds', globeClouds)
    if (globeClouds) {
      globeClouds.rotation.y += 0.001;  // Adjust this value to control the rotation speed
      requestAnimationFrame(rotateClouds);
    }
  }
  
  // Start the rotation


  return globeClouds;
}



const World = (props) => {
  const globeEl = useRef();
  const { data, error } = useSocketData('firewall');
  const [state, dispatch] = useReducer(reducer, initialState);
  const rtimestamp = Date.now();
  const addRecentData = useRecentData();
  const queryClient = useQueryClient();
  const [initialized, setInitialized] = useState(false);

  const globeContainerStyle = {
    width: '100px',
    height: '100px'
  };
  const polygonsMaterial = new THREE.MeshPhongMaterial({
    color: 'royalblue',
    opacity: 0.8,
    blending: THREE.NormalBlending,
    side: THREE.DoubleSide
  });
  const globeMaterial = new THREE.MeshPhongMaterial({

    color: 'navy',
    opacity: 1,
    blending: THREE.NormalBlending,
    side: THREE.FrontSide
  });

  useEffect(() => {
    if (data) {
      const socketdata = JSON.parse(data);
      const dataVal = socketdata?.value ? JSON.parse(socketdata.value) : null;
      // console.log('dataVal', dataVal)
      if (dataVal) {
        const lat = dataVal.geo.ll[0];
        const lng = dataVal.geo.ll[1];
        const cityinfo = {
          "lat": lat,
          "lng": lng,
          "weight": 1,
          "timestamp": rtimestamp,
          "severity": dataVal.severity,
          "label": dataVal.geo.location,
          "zappname": dataVal.zappname,
          "victim": dataVal.victim,
          "city": dataVal.geo.location
        };
        const routeinfo = {
          "airline": dataVal.hostname,
          "timestamp": rtimestamp,
          srcAirport: { "lat": lat, "lng": lng },
          dstIata: dataVal.geo,
          ostIata: dataVal.geo2,
          dstAirport: { icao: "LPPT", lat: "37", lng: "127" },
          srcAirportId: "1638",
          srcIata: "LIS",
          stops: "0"
        };
        addRecentData(routeinfo);
        const recentData = queryClient.getQueryData('recentData');
       // console.log('recentData', recentData);
        if (recentData && recentData.length > 1) {
          dispatch({
            type: "SET_DATA_VAL",
            routeinfo: recentData
          });
        }

      }
    }
    if (error) {
      console.error('reactsocketError:', error);
    }
  }, [data]);
  // World 컴포넌트의 useEffect 내에서 GlobeCloud를 호출
  let lastUpdateTime = useRef(Date.now());

  useEffect(() => {
    if (!globeEl.current || initialized) return;

    const renderer = globeEl.current.renderer();
    const camera = globeEl.current.camera();

    const scene = globeEl.current.scene();
    let angle = 0;
    let cleanup
    // console.log('globeEl', globeEl.current)
    if (globeEl.current) {
      cleanup = GlobeCloud(globeEl.current, state.globeRadius);

    }


    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Ambient light for soft lightings
    const ambientLight = new THREE.AmbientLight(0x333333); // 0.2 intensity
    scene.add(ambientLight);


    async function animate(directionalLight, cleanup) {

      if (globeEl.current && !initialized) {
       
        requestAnimationFrame(animate);

        const currentTime = Date.now();
        const deltaTime = currentTime - lastUpdateTime.current;

        renderer.clear();
        renderer.render(scene, camera);
      

       

      }

    
      return () => {
        // 애니메이션 정리 로직, 필요한 경우 requestAnimationFrame을 취소합니다.
      };
    }
    //animate(directionalLight, cleanup);
    setInitialized(true);

  }, [globeEl.current]);

  useEffect(() => {
    // console.log('gg')
    fetch('/renderSiem/js/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(countries => {
        const filteredCountries = countries.features.filter(d => d.properties.ISO_A2 !== 'AQ');
        dispatch({
          type: "SET_COUNTRIES",
          filteredCountries: filteredCountries
        });
      });
    if (!globeEl.current) return;

  }, []);

  useEffect(() => {
    console.log('resized')
    const widgetRefwidth = props.widgetRef?.current?.clientWidth;
    const widgetRefheight = props.widgetRef?.current?.clientHeight;
    if (widgetRefwidth && widgetRefheight) {
      dispatch({
        type: "SET_DIMENSIONS",
        width: widgetRefwidth-10,
        height: widgetRefheight
      });
    }
  }, [props.widgetRef, props.isResized]);
  return <div style={globeContainerStyle}>

    <Globe
      showGlobe={true}
      ref={globeEl}
      globeMaterial={globeMaterial}
      showAtmosphere={false}
      backgroundColor={'#00174A'}
      width={state.Width}
      height={state.Height}
      polygonsData={state.polygonData}
      polygonCapMaterial={polygonsMaterial}
      polygonSideColor={() => 'rgba(0, 100, 0, 0.05)'}
      polygonCapColor={() => 'rgba(173, 216, 230, 0.3)'}
      polygonStrokeColor={() => 'rgba(0, 191, 255, 0.8)'}
      polygonAltitude={() => 0.007}
      arcsData={state.arcData[0]}
      arcStartLat={d => d.srcAirport.lat}
      arcStartLng={d => d.srcAirport.lng}
      arcEndLat={d => d.dstAirport.lat}
      arcEndLng={d => d.dstAirport.lng}
      arcStroke={0.5}
      arcCircularResolution={64}
      arcDashLength={0.3}// 애니메이션 선 길이
      arcDashGap={(0.01)} // 애니매이션 재생 gap
      arcDashAnimateTime={(1500)} //애니매이션속도
      arcAltitude={(d => 0.5)}

    />
  </div>;
};

export default World;