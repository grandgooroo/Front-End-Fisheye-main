export class DataService {
    constructor(jsonFile) {
        this.jsonFile = jsonFile;
    }

    async fetchData() {
        const response = await fetch(this.jsonFile); // utilise le chemin du fichier json passé en paramètre ()
        const data = await response.json();            // this.jsonFile déclaré dans PhotographerService
        return data; // retourne les données
    }
}