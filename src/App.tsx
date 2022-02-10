import React,{useEffect,useRef, useState} from 'react';
import '@tensorflow/tfjs-backend-webgl';
import * as bodyPix from '@tensorflow-models/body-pix';
import logo from './logo.svg';
import './App.css';

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded,setLoaded] = useState<boolean>(false);
  useEffect(()=>{
    const constraints: MediaStreamConstraints = {
      audio: false,
      video:{
        width: 600,
        height: 400
      }
    };
    navigator.mediaDevices.getUserMedia(constraints).then((stream)=>{
      videoRef.current!.srcObject = stream;
    })
    setLoaded(true);
  },[]);
  useEffect(()=>{
    videoRef.current!.onloadeddata = (ev=>{
      const loadAndPredict = async()=>{
        const net = await bodyPix.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          multiplier: 0.75,
          quantBytes: 2
        });
        const segmentation = await net.segmentPerson(videoRef.current!,{
          flipHorizontal: false,
          internalResolution: "medium",
          segmentationThreshold: 0.7
        });
        console.log(segmentation);
      }
      loadAndPredict();
    })
  },[]);
  return (
    <div className="App">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width="600px"
        height="400px"
      />
    </div>
  );
}

export default App;
