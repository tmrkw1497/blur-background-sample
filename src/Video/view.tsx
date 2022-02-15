import React from 'react';

interface VideoViewProps{
    videoRef: React.RefObject<HTMLVideoElement>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    width: number;
    height: number;
}; 

export default function View(props: VideoViewProps) {
    const {videoRef,canvasRef,width,height} = props;
    return (
      <div className="App">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          width={width}
          height={height}
        />
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
        />
      </div>
    );
  }

