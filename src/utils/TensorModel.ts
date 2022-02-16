import '@tensorflow/tfjs-backend-webgl';
import * as bodyPix from '@tensorflow-models/body-pix';

const ARCHITECTURE = 'MobileNetV1';
const OUTPUTSTRIDE = 16;
const MULTIPLIER = 0.75;
const QUANTBYTES = 2;

class TensorModel{
    private static _instance: bodyPix.BodyPix;

    private constructor(){}

    public static get instance():Promise<bodyPix.BodyPix>{
        // NOTE: なぜかインスタンスの生成が複数回呼び出される
        if(!this._instance){
            return (async()=>{
                this._instance =await bodyPix.load({
                    architecture: ARCHITECTURE,
                    outputStride: OUTPUTSTRIDE,
                    multiplier: MULTIPLIER,
                    quantBytes: QUANTBYTES
                });
                return this._instance;
            })();
        }else{
            return Promise.resolve(this._instance);
        }
    }
}

export default TensorModel;