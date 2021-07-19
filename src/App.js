/* eslint-disable react-hooks/exhaustive-deps */
import React, {useRef, useState, UseEffect, useEffect }  from 'react';
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import {drawRect} from "./utilities";
import { webcam } from '@tensorflow/tfjs-data';
require('@tensorflow/tfjs');
const toxicity = require('@tensorflow-models/toxicity');


function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);


  // Main function

  const runCoco = async () =>{
    const net = await cocossd.load();
    console.log("Handpose model loaded"); 

    setInterval(() => {
        detect(net);
    }, 10);
  };
  
  const detect = async (net) => {
    if(
      typeof webcamRef.current != "undefined" && 
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4

    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight; 

      const obj = await net.detect(video); 
      
      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx)

      const threshold = 0.9;

      toxicity.load(threshold).then(model => {
        const sentences = ['Ok.'];

        model.classify(sentences).then(predictions => {
          console.log(predictions);
        });
      });

      
    }
  }

  useEffect(()=> {runCoco()}, []);

  return (
    <div className="App">
        <h1>Motion Detection</h1>
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );

}
export default App;