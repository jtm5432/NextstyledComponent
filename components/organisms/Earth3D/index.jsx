import React, { useEffect, useRef, useState,useMemo } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import Earth3D from '../../organisms/Earth3D';
import * as satellite from 'satellite.js';
import * as topojson from 'topojson';

/**
 * @description - This is a 3D globe component . 지구와 arc등은 Organism로 구성되어있고, 이를 조합하여 template 만들어진다.
 * @param {object} props - props object
 * @param {object} props.widgetRef - widgetRef object
 * @param {boolean} props.isResized - isResized boolean
 */
const World = (props) => {
    const globeEl = useRef();
    const [satData, setSatData] = useState();
    const [globeRadius, setGlobeRadius] = useState();
    const [time, setTime] = useState(new Date());
    const [Width, setWidth] = useState(100);
    const [Height, setHeight] = useState(100);
    const [polygonData, setPolygonData] = useState([]);

    const EARTH_RADIUS_KM = 6371; // km
    const SAT_SIZE = 80; // km
    const TIME_STEP = 3 * 1000; // per frame
    const globeContainerStyle = {
        width: '100px', // 원하는 너비를 설정하세요
        height: '100px' // 원하는 높이를 설정하세요
    };
    const widgetRef = props.widgetRef;
    const isResized = props.isResized;
    const polygonsMaterial = new THREE.MeshLambertMaterial({ color: 'darkslategrey', side: THREE.DoubleSide });
    console.log('World component rendered',polygonData);

    useEffect(() => {
      // Globe 인스턴스에 대한 설정 및 폴리곤 그리기 로직
    
      fetch('https://localhost:4000/renderSiem/js/ne_110m_admin_0_countries.geojson')
          .then(res => res.json())
          .then(countries => {
              const filteredCountries = countries.features.filter(d => d.properties.ISO_A2 !== 'AQ');
              console.log('filteredCountries',filteredCountries);
              // State에 폴리곤 데이터를 저장합니다.
              setPolygonData(filteredCountries);
           

              // globeInstance
              //     .backgroundColor('#00174A')
              //     .polygonCapColor(feat => 'rgba(173, 216, 230, 0.3)')
              //     .polygonSideColor(() => 'rgba(0, 100, 0, 0.05)')
              //     .polygonStrokeColor(() => 'rgba(0, 191, 255, 0.8)')
              //     .polygonsData(filteredCountries)
              //     .polygonAltitude(0.007);
          });
  }, []);
//   useEffect(() => {
//     // load data
//     fetch('//unpkg.com/world-atlas/land-110m.json').then(res => res.json())
//       .then(landTopo => {
//         setPolygonData(topojson.feature(landTopo, landTopo.objects.land).features);
//       });
//   }, []);
  useEffect(() => {
    console.log('polygonData updated:', polygonData);
}, [polygonData]);


    useEffect(() => {
        console.log('instanceGlobe',Width,widgetRef, widgetRef?.current?.clientWidth);
        const widgetRefwidth = widgetRef?.current?.clientWidth;
        const widgetRefheight = widgetRef?.current?.clientHeight;
        if(widgetRefwidth)setWidth(widgetRefwidth);
        if(widgetRefheight) setHeight(widgetRefheight);
       
        
    }, [ widgetRef, isResized]);
    return <div style={globeContainerStyle}>
      <Globe
        ref={globeEl}
        objectFacesSurface={true}
      
        width={Width} height={Height}
        backgroundColor={'#00174A'}
        polygonData={polygonData}
        polygonCapColor= {'rgba(173, 216, 230, 0.3)'}
        polygonSideColor ={'rgba(0, 100, 0, 0.05)'}
        polygonStrokeColor= { 'rgba(0, 191, 255, 0.8)'}
        polygonAltitude = {0.07}
         
      />
     
      
    </div>;
  };

  export default World;