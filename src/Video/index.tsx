import React from "react";
import View from "./view";
import useBackground from "./useBackground";

interface VideoProps{
    width?: number;
    height?: number;
}

const Video = ({width=600,height=400}:VideoProps):JSX.Element =>{
    const videoViewProps =useBackground({width,height}); 
    return (
        <View {...videoViewProps}/>
    );
}

export default Video;