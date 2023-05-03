import { DataService } from '../factories/dataService.js';

// Class
class PhotographersList {
  constructor(jsonFile) {
    this.jsonFile = jsonFile;
    this.photographers = [];
  }

  async init() {
    const dataService = new DataService(this.jsonFile);
    const data = await dataService.fetchData();
    this.photographers = data.photographers;

    // Appeler ici les méthodes pour afficher les photographes sur la page d'accueil
    this.getPhotographersData(this.photographers);
  }

  getPhotographersData(photographers) {
    for (const photographer of photographers) {
      this.createHTMLPhotographer(photographer);
    }
  }

  createHTMLPhotographer(photographer) {
    let photographersSection = document.querySelector(".photographers_section");
    const pictureProfil = `assets/profil/${photographer.portrait}`;
    const article = document.createElement("article");

    article.innerHTML = `
      <a href="./photographer.html?id=${photographer.id}"><img src=${pictureProfil} alt="${photographer.name}" tabindex="0"></a>
      <h2>${photographer.name}</h2>
      <h1>${photographer.city} ${photographer.country}</h1>
      <h3>${photographer.tagline}</h3>
      <p>${photographer.price}€/jour</p>
    `;

    photographersSection.appendChild(article);
  }
}

const photographersList = new PhotographersList("data/photographers.json");
photographersList.init();
