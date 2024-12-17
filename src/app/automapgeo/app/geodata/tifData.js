import GeoData from "./base";
import { IMAGE_OVERLAY } from "../consts";

export default class TifData extends GeoData {
  
    type: IMAGE_OVERLAY;
    constructor(imageUrl: string, bounds: any, zoom: number, center: any) {
        super(zoom, center);
        this.imageUrl = imageUrl;
        this.bounds = bounds;
    }
}