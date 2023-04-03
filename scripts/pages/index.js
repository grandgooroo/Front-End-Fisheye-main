// Declaration d'une variable globale pour les Datas.

// import { PhotographerService } from './path/to/photographerService.js';

// const photographerService = new PhotographerService();
// photographerService.fetchData().then((data) => {
//   console.log(data);
// });

async function init ()
{
    dataGlobal = await getData2();
    console.log(dataGlobal);
}

// Class
class Photographer {
  constructor(name, id, city, country, price, portrait)
  {
    this.name = name;
    this.id = id;
    this.city = city;
    this.country = country;
    this.price = price;
    this.portrait = portrait;
  }
}
  
  /* récupérer les photographes*/
  function getPhotographersData()  
  {
    photographersData = fetch("data/photographers.json")
        .then(resp => resp.json())
        .then(data => 
        {
          
          for (const photographer of data.photographers)
          {
            // UserCardDom
            createHTMLPhotographer(photographer)
          }
        })
  };               

  function createHTMLPhotographer(photographer) {
    let photographersSection = document.querySelector(".photographer_section")
    const pictureProfil = `assets/profil/${photographer.portrait}`;
    const article = document.createElement("article");

    article.innerHTML = `
    <a href="./photographer.html?id=${photographer.id}"><img src=${pictureProfil}></a>
    <h2>${photographer.name}</h2>
    <h1>${photographer.city} ${photographer.country}</h1>
    <h3>${photographer.tagline}</h3>
    <p>${photographer.price}€/jour</p>
    `;

    photographersSection.appendChild(article)
  }

  // afficher tous le photographes
  getPhotographersData();  


// Gallerie 
// Déclarer le chemin des images
const media = "../assets/Sample Photos";

init();