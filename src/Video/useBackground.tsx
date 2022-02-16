import React, {useRef,useState,useEffect} from "react";

import '@tensorflow/tfjs-backend-webgl';
import * as bodyPix from '@tensorflow-models/body-pix';

import TensorModel from "../utils/TensorModel";

interface UseBackGroundArg{
    width: number;
    height: number;
};
interface UseBackGroundRes{
    videoRef: React.RefObject<HTMLVideoElement>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    width: number;
    height: number;
};

const useBackground = ({width,height}: UseBackGroundArg):UseBackGroundRes =>{
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
  
    const [isLoaded,setIsLoaded] = useState<boolean>(false);
  
    useEffect(()=>{
      const constraints: MediaStreamConstraints = {
        audio: false,
        video:{
          width: width,
          height: height
        }
      };
      navigator.mediaDevices.getUserMedia(constraints).then((stream)=>{
        videoRef.current!.srcObject = stream;
      })
    },[]);
    useEffect(()=>{
      videoRef.current!.onloadeddata = (ev=>{
        PredictAndDraw(videoRef.current!,canvasRef.current!);
        setIsLoaded(true);
      })
    },[]);
    useEffect(()=>{
      const inter = setInterval(()=>{
        PredictAndDraw(videoRef.current!,canvasRef.current!);
      },10);
      return () => clearInterval(inter);
    },[isLoaded]);

    return {
        videoRef,
        canvasRef,
        width,
        height
    }
}

const makeSegment = async (video: HTMLVideoElement,net: bodyPix.BodyPix): Promise<bodyPix.SemanticPersonSegmentation>=>{
    return (await net.segmentPerson(video,{
        flipHorizontal: false,
        internalResolution: "medium",
        segmentationThreshold: 0.7
      }));
}

const drawBackground = (canvas: HTMLCanvasElement,segmentation: bodyPix.SemanticPersonSegmentation,video: HTMLVideoElement)=>{
    const foregroundColor = {r: 0, g: 0, b: 0, a: 0};
    const backgroundColor = {r: 0, g: 0, b: 0, a: 255};
    const backgroundDarkeningMask = bodyPix.toMask(
        segmentation, foregroundColor, backgroundColor);
  
    const opacity = 0.7;
    const maskBlurAmount = 3;
    const flipHorizontal = false;
    bodyPix.drawMask(canvas, video, backgroundDarkeningMask, opacity, maskBlurAmount, flipHorizontal);
}

const PredictAndDraw = async(video: HTMLVideoElement,canvas: HTMLCanvasElement)=>{
    const net = await TensorModel.instance;
    const segmentation = await makeSegment(video,net);
    drawBackground(canvas,segmentation,video);    
}

  export default useBackground;