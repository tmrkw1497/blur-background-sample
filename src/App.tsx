import React,{useEffect,useRef, useState} from 'react';
import '@tensorflow/tfjs-backend-webgl';
import * as bodyPix from '@tensorflow-models/body-pix';
import './App.css';

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isLoaded,setIsLoaded] = useState<boolean>(false);

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
  },[]);
  useEffect(()=>{
    videoRef.current!.onloadeddata = (ev=>{
      loadAndPredict(videoRef.current!,canvasRef.current!);
      setIsLoaded(true);
    })
  },[]);
  useEffect(()=>{
    const inter = setInterval(()=>{
      loadAndPredict(videoRef.current!,canvasRef.current!);
    },10);
    return () => clearInterval(inter);
  },[isLoaded]);
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
      <canvas
        ref={canvasRef}
        width="600px"
        height="400px"
      />
    </div>
  );
}

const loadAndPredict = async(video: HTMLVideoElement,canvas: HTMLCanvasElement)=>{
  const net = await bodyPix.load({
    architecture: 'MobileNetV1',
    outputStride: 16,
    multiplier: 0.75,
    quantBytes: 2
  });
  const segmentation = await net.segmentPerson(video,{
    flipHorizontal: false,
    internalResolution: "medium",
    segmentationThreshold: 0.7
  });
  const maskBackground = true;
  // Convert the segmentation into a mask to darken the background.
  const foregroundColor = {r: 0, g: 0, b: 0, a: 0};
  const backgroundColor = {r: 0, g: 0, b: 0, a: 255};
  const backgroundDarkeningMask = bodyPix.toMask(
      segmentation, foregroundColor, backgroundColor);

  const opacity = 0.7;
  const maskBlurAmount = 3;
  const flipHorizontal = false;
  bodyPix.drawMask(canvas, video, backgroundDarkeningMask, opacity, maskBlurAmount, flipHorizontal);
}

export default App;
