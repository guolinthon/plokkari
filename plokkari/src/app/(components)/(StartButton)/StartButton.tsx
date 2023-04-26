"use client"
import { useEffect, useRef, useState } from 'react';
import './style.css'
import { FeatureGroup, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import CleanButton from '../(CleanButton)/CleanButton';
import L from "leaflet";

import "./PolygonEditor/style.css"

function StartButton(props) {
  
    const [hasShape, setHasShape] = useState(0);
    const [polygonStuff, setPolygonStuff] = useState(null)
    const [isPressed, setIsPressed] = useState(false);
    const h3 = require("h3-js");
    const editRef = useRef();
    const polygonHandlerRef = useRef(null);
    const [hasPolygon, setHasPolygon] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);

    const [polygon, setPolygon] = useState(null)

    const map = useMap();
    useEffect(() => {
      if (editRef.current && editRef.current._toolbars.draw) {
        const polygonHandler = editRef.current._toolbars.draw._modes.polygon.handler;
        polygonHandlerRef.current = polygonHandler;
      }
      var cb = document.getElementsByClassName('leaflet-draw-draw-polygon');
      console.log(cb)
      setPolygonStuff(cb[0])
    }, []);

    const polygonHandler = polygonHandlerRef.current;

    const startDrawing = (e) => {
      setIsDrawing(true)
      map.eachLayer((layer) => {
        if (layer instanceof L.Polygon) {
          layer.setStyle({ opacity: 0 });
          }
        });
      map.flyTo(map.getCenter(), 18, {animate: true, duration: 1})
      e.preventDefault()
      var event = document.createEvent('Event');
      event.initEvent('click', true, true);
      polygonStuff.dispatchEvent(event);
    }; 

    const finishDrawingPolygon = (e) => {
      if (hasShape > 2) {
        try {
          polygonHandler.completeShape();
          polygonHandler.disable();
          }
        catch(ex){
          console.log(ex);
        }}
      }; 

    const cancelWhileDrawingPolygon = (e) => {  
      setIsDrawing(false)
      setHasShape(0)
        try {
          polygonHandler.disable();
          }
        catch(ex){
          // console.log(ex);
        }
        map.setView(map.getCenter(), 13)
        map.eachLayer((layer) => {
          if (layer instanceof L.Polygon) {
            layer.setStyle({ opacity: 1 });
          }
        });
      }; 

      const cancelNotComfirming = () => {
        
        polygon._map.eachLayer(layer => {
          if(layer._leaflet_id  == polygon._leaflet_id){layer.remove()}
        })
        setPolygon(null)
        setIsDrawing(false)
        setHasPolygon(false)
        setHasShape(0)
        map.setView(map.getCenter(), 13)
        map.eachLayer((layer) => {
          if (layer instanceof L.Polygon) {
            layer.setStyle({ opacity: 1 });
          }
        });
      }

      const confirm = () => {
        console.log("Confirm")
        console.log(polygon.getLatLngs())
        let geometry = polygon.getLatLngs()[0].map(points => Object.values(points));
        // console.log(h3)
        const data = h3.polygonToCells(geometry, 12);
        console.log(data);
        setHasShape(0)
      }

    const onShapeDrawn = (e) => {
        if(!editRef.current) { return; }
        setPolygon(e.layer)
        e.layer.editing.enable()
        // editRef.current._toolbars.edit._modes.edit.handler.enable()
        e.layer.on('click', () => {
            editRef.current._toolbars.edit._modes.edit.handler.enable()
            console.log("Halo")
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
        setHasPolygon(true)
        setHasShape(0)
    }
    
    const onVertexDraw = () => {
      setHasShape(prevHasShape => prevHasShape + 1);
    };
    
    return (
          <> {hasShape}
            <CleanButton changeCleanButton={setIsPressed} isPressed={isPressed} />
            <FeatureGroup >
              <EditControl
                onMounted={  mapInstance => { editRef.current= mapInstance } }
                position='bottomleft'
                onCreated={onShapeDrawn}
                onDrawVertex={onVertexDraw}
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
                      color: "black",
                      fillColor: "green"
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
              > { !isDrawing ? (
               <div className='blobs'
               ref={(ref) => {
                if (!ref) return;
                /** import L from "leaflet"; */
                L.DomEvent.disableClickPropagation(ref).disableScrollPropagation(ref);
              }}
               >
                  <button className="start-button" onClick={startDrawing} style={{background: isPressed ? 'rgb(241, 131, 124)' : 'rgb(146, 218, 146)'}}>
                    Start 
                  </button> 
                </div>
                )
                : 
                !hasPolygon ? (
                  <div className='blobs'
                  ref={(ref) => {
                    if (!ref) return;
                    /** import L from "leaflet"; */
                    L.DomEvent.disableClickPropagation(ref).disableScrollPropagation(ref);
                  }}>
                    <button className="finish-button" onClick={finishDrawingPolygon} style={{background: hasShape < 3 ? 'grey' : 'rgb(146, 218, 146)'}}>
                      {hasShape < 3 ? `Click at least ${3 - hasShape} points` : "Finish"}
                    </button> 
                    <button className="cancel-button" onClick={cancelWhileDrawingPolygon} style={{background: isPressed ? 'rgb(241, 131, 124)' : 'rgb(146, 218, 146)'}}>
                      Cancel  
                    </button> 
                  </div>
                  ) : (
                    <div className='blobs'
                    ref={(ref) => {
                      if (!ref) return;
                      /** import L from "leaflet"; */
                      L.DomEvent.disableClickPropagation(ref).disableScrollPropagation(ref);
                    }}>
                      <button className="edit-button" onClick={confirm} style={{background: isPressed ? 'rgb(241, 131, 124)' : 'rgb(146, 218, 146)'}}>
                        Confirm  
                      </button> 
                      <button className="cancel-button" onClick={cancelNotComfirming} style={{background: isPressed ? 'rgb(241, 131, 124)' : 'rgb(146, 218, 146)'}}>
                        Cancel  
                      </button> 
                    </div>
                  )
                } 
            </div>
        </>
    );
};

export default StartButton;