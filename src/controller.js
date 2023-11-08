import Scene from './Scene';
import newData from './data/new.json'

export default class Controller {
    constructor() {

    }

    example() {
        
        if (this.scene) {
            this.scene.dispose();
        }

        this.array = newData;

        this.stop();
    }

    start() {
        this.array = [];

        this.count = 0;
        this.timer = requestAnimationFrame(this.loop);
        
        if (this.scene) {
            this.scene.dispose();
        }
    }

    loop = async () => {

        this.count++;

        if (this.count % 3 !== 0) {
            this.timer = requestAnimationFrame(this.loop);
            return;
        }

        const data = await this.getGeoData();
        this.array.push(data);

        this.timer = requestAnimationFrame(this.loop);
    }

    stop() {
        cancelAnimationFrame(this.timer);

        if (!this.scene) {
            this.scene = new Scene();
        }
        this.scene.start(this.array);
    }

    getGeoData() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition((position) => {
                const data = {
                    altitude: position.coords.altitude ?? 0,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                resolve(data);
            }, () => {

            }, {
                enableHighAccuracy: true
            });
        })
    }
}