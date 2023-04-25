"use client"
import { forwardRef, useEffect, useRef, useState } from 'react';
import './style.css'
import { FeatureGroup, Polygon, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import CleanButton from '../(CleanButton)/CleanButton';
import L from "leaflet";
import PolygonEditor from './PolygonEditor/PolygonEditor';

import "./PolygonEditor/style.css"

function StartButton(props) {

    const [text, setText] = useState("Start");

    const featureGroupRef = useRef(null);
    const resetDrawHexFunction = useRef(null);
    const [polygonStuff, setPolygonStuff] = useState(null)
    // const [zoomLvl, setZoom ] = useState(13)
    const [isPressed, setIsPressed] = useState(false);

    const h3 = require("h3-js");
    const [data, setData] = useState([]);  
    // const map = useMap();
    
    // const [editControl, setEditControl] = useState(null);
    const editRef = useRef();
    const polygonHandlerRef = useRef(null);
    
    const [drawing, setDrawing] = useState(false);

    const editControlRef = useRef(null);

    useEffect(() => {

      if (editRef.current && editRef.current._toolbars.draw) {
        const polygonHandler = editRef.current._toolbars.draw._modes.polygon.handler;
        polygonHandlerRef.current = polygonHandler;
      }

      var cb = document.getElementsByClassName('leaflet-draw-draw-polygon');
      console.log(cb)
      setPolygonStuff(cb[0])
    }, []);
  
    const handleClick = (e) => {
      
      const polygonHandler = polygonHandlerRef.current;
      e.preventDefault()
        setDrawing(!drawing)
        if(!drawing){
          var event = document.createEvent('Event');
          event.initEvent('click', true, true);
          // var cb = document.getElementsByClassName('leaflet-draw-draw-polygon');
          // console.log(cb)
          polygonStuff.dispatchEvent(event);
        } else {
          try {
            polygonHandler.completeShape();
            polygonHandler.disable();
          }
          catch(ex){
          console.log(ex);
          
        }
        }
      };

   

    const onShapeDrawn = (e) => {
        if(!editRef.current) { return; }
        
        setDrawing(false)
        e.layer.on('click', () => {
            editRef.current._toolbars.edit._modes.edit.handler.enable()
        })
        e.layer.on('contextmenu', () => {
            //do some contextmenu action here
        })
        e.layer.bindTooltip("Text", 
            {
              className: 'leaflet-draw-tooltip:before leaflet-draw-tooltip leaflet-draw-tooltip-visible',
              sticky: true,
              direction: 'right'
            }
        );
    }







    // const [draw, setDraw] = useState({
    //     circlemarker: false,
    //     marker: false,
    //     polyline: false,
    //     rectangle: false,
    //     circle: false
    // })

    // const edit={
    //     edit: false,
    //     remove: false
    // }

    // const { getData, resetDrawHexFunction } = props;
    
      // const _onDrawStart = () => featureGroupRef.current.clearLayers();

      // var renderedPolygon = data.map(coordinateSet => <Polygon key={data.indexOf(coordinateSet)} color="green" positions={coordinateSet}/>)
    

      // function resetDrawing() {
      //     setData([])
      // }

      // const _onCreated = (e :Event) => {
      //     let geometry = e.layer.getLatLngs()[0].map(points => Object.values(points));
      //     console.log(h3)
      //     try {
      //       const data = h3.polygonToCells(geometry, 12) //#polyfill(geometry, 12);
      //     }
      //     catch(ex){
      //       return
      //     }
      //     // getData(data);
      //     const coordinates = h3.cellsToMultiPolygon(data, false);
      //     setData(coordinates)
      //     _onDrawStart()
      // }

    // useEffect(() => {
    //   // resetDrawHexFunction.current = resetDrawing;
    //   map.on('zoom', function(e) { 
    //     if (e.sourceTarget.getZoom() < 16) {
    //       setDraw(prevInfo => ({...prevInfo, polygon: false, }))
    //     } else {
    //       setDraw(prevInfo => ({...prevInfo, polygon: true, }))
    //     }
    //   })
    // }, []);




    // const changeTextAndZoomLvl = () => {
    //   if (text === "Start") {
    //       setText("End");
    //       // props.changeZoomLvl(18)
    //       setIsPressed(true)
    //       map.flyTo(map.getCenter(), 18)
    //   } else {
    //       setText("Start");
    //       setIsPressed(false);
    //       // props.changeZoomLvl(13)
    //       map.flyTo(map.getCenter(), 13)
    //   }
    // };
    
    return (
          <>
            {/* <PolygonEditor /> */}
            <CleanButton changeCleanButton={setIsPressed} isPressed={isPressed} />

            {/* <PolygonEditor  onShapeDrawn={onShapeDrawn} editRef={editRef} /> */}
            <FeatureGroup >
              <EditControl
                onMounted={  mapInstance => { editRef.current= mapInstance } }
                position='bottomleft'
                onCreated={onShapeDrawn}
                //here you can specify your shape options and which handler you want to enable
                draw={{
                  rectangle: false,
                  circle: false,
                  polyline: false,
                  circlemarker: false,
                  marker: false,
                  polygon: {
                    allowIntersection: false,
                    shapeOptions: {
                      color: "#ff0000"
                    },
                  }
                }}
                />
            </FeatureGroup>


            <div
              ref={(ref) => {
                if (!ref) return;
                L.DomEvent.disableClickPropagation(ref).disableScrollPropagation(ref);
              }}
              >
              <button
                className="start-button"
                onClick={handleClick}
                style={{background: drawing ? 'rgb(241, 131, 124)' : 'rgb(146, 218, 146)'}}
                >
                  {drawing? "End" : "Start" }
                </button>
            </div>
        </>
    );
};

export default StartButton;