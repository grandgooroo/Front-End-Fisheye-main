export class DataService {
    constructor(jsonFile) {
        this.jsonFile = jsonFile;
    }

    async fetchData() {
        const response = await fetch(this.jsonFile);
        const data = await response.json();
        return data;
    }
}