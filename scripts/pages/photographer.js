// créer une variable globale

// import * as monModule from '/modules/mon-module.js';
const getData2 = async () => {
    const response = await fetch("data/photographers.json");
    const data = await response.json();
    // console.table(data.media);

    return data;
    };
/* Ex 1 */
let dataGlobal;

const getData3 = async () => {
    const response = await fetch("data/photographers.json");
    const data = await response.json();
    const media = data.media;
    return media;
    
};

let media;

async function init ()
{
    dataGlobal = await getData2();
    media = await getData3();
    listenerSort();
    // Image media Filter
// const imageMedia = media.filter(mediaObject => 
//     mediaObject.type === "image");
//     console.table(imageMedia);
}



const mainSection = document.querySelector("#main");
const divMediaSection = document.createElement("media-section");
divMediaSection.classList.add("media-section");
const menuSection = document.createElement("dropdown-menu__container");
menuSection.classList.add("select-menu");
let changeMenuValue = document.querySelector("#monselect");

function createHTMLPhotographer(photographer) 
    {
        let photographersSection = document.querySelector(".photographer_section")
        const article = document.createElement("article");
        const pictureProfil = `assets/profil/${photographer.portrait}`;
        

        article.innerHTML = `
        <h2>${photographer.name}</h2>
        <h1>${photographer.city} ${photographer.country}</h1>
        <h3>${photographer.tagline}</h3>
        <img src=${pictureProfil}></img>
        `;

        const image = document.createElement("img");
        image.src = `assets/medias/${photographer.name}`;

        // article.innerHTML = `<img src=""></img>`

        photographersSection.appendChild(article)
    };

    function getPhotographersId()  
    {
        // let getPhotographers = fetch("data/photographers.json")
        //     .then(resp => resp.json())
        //     .then(data => 
        {
            const params = new URLSearchParams(window.location.search);
            // console.log(params);
            const userId = Number(params.get('id'));

            const user = dataGlobal.photographers.find(data => data.id === userId);
            console.log(user);
                
            createHTMLPhotographer(user)
        });
    }

// function createImage()
//     {
//         const mediaSection = document.createElement('section');
//         const img = document.createElement("img");
//         {
//             article.innerHTML = `
//             <img src=${mediaPictures}></img>
//             `;
//         }
//     };   

function mediaFactory()
    
    {
        // Requête HTTP pour récup les données du photographe
        let getPhotographers = fetch("data/photographers.json")
        .then(resp => resp.json())
        .then(data => 
        {
            const params = new URLSearchParams(window.location.search);
            const userId = Number(params.get('id'));
            const user = data.media.find(data => data.photographerId === userId);
            // console.log(user);
            const medias = data.media.filter(data => data.photographerId === userId);
            // console.log(medias);

            const { id, title, country, image, video, likes, date, price } = data.media;
            
            mainSection.appendChild(divMediaSection);
            // data.media.forEach(image => {
            //     createItem(image);
            // });

                for (const image of medias)
                {
                    createItem(image, sort());
                    console.log(createItem);
                }
        });
    };   

function createItem(media)
    {
        const mediaItem = document.createElement("article");
        const mediaFolder = `/assets/medias/${media.photographerId}`;
        
        // console.table(mediaFolder); // Faire une condition si "Video" alors...ou "Switch" !?
        
        // if (media.type === "image")
        // {
        //     mediaElement = document.createElement("img");
        // } else if (media.type === "video");
        //     {
        //         mediaElement = document.createElement("video");
        //     }
        mediaItem.innerHTML = `
            <h2>${media.photographerId}</h2>
            <p>${media.title}</p>
            <img src="${mediaFolder}/${media.image}" alt="Image de ${media.name}" class="img">
        `;

        divMediaSection.appendChild(mediaItem);
    };

//     function createMenuSelect()
//     {

//     }

//     // Section dropdown et tri des médias
// function onchangeMenu()
//     {
//         // document.getElementById('element_id').change = function() 
//         // {
//         // // your logic
//         // };
//     };

function listenerSort() 
    {
        let select = document.querySelector("select");

        select.addEventListener("change", () =>
        {
            sort("likes");
        });
    }


    function createDropdownMenu() // Avec Select
    {
        
        menuSection.innerHTML = `
        <label id="combo1-label" class="combo-label">Trier par :</label>
            <div class="">
                <select id="monselect">
                    <option value="likes" selected>Popularité</option>
                    <option value="title">Titre</option>
                    <option value="date">Date</option> 
                </select>
            </div>
        `;
        mainSection.appendChild(menuSection)
    }

    function createDropdownMenuBtn() // Avec Button
    {
        menuSection.innerHTML = `
            <label id="combo1-label" class="combo-label">Trier par :</label>
                <div class="combo js-select">
                    <button id="current-order">Popularité</button> */Masquer avec display none/*
                    <div id="options-order"> */Afficher avec display block/*
                    <button data-order="date">Date</button>
                    <button data-order="popularity">Popularité</button>
                    <button data-order="title">Titre</button>
                </div>
        `;
        mainSection.appendChild(menuSection)
    }

    function sort(type) // En parametre le data.media et le type
    {
            /* Avec switch */
        switch(type) 
        {
            case 'likes':  // si (type.likes === 'value1')
            console.log("trie like");
            
            break;
        //     case 'date':  // si (type.date === 'value2')
        //     ...
        //     [break]
        
        //     default:
        //     ...
        //     [break]
        }
            
            /* Trier par "likes" */
            const likesCounter = dataGlobal;
            const byValue = (a,b) => b.likes - a.likes;
            const sorted = [...likesCounter].sort(byValue);
            // console.table(sorted);

            /* Trier par "date" */

            // const dateSort = data.media.slice().sort((a, b) => b.date - a.date);
            // console.table(dateSort);

            /* Trier par "title" */

            // function titleSort(media)
            // {
            //     return media.sort(function(x, y)
    
            //     {
            //         console.log(x);
            //         return x.title.localeCompare(y.title);
            //     });
            // }
            // titleSort(data.media);

    }

  // Afficher le profil du photographe
getPhotographersId(); 
createDropdownMenu();
mediaFactory();
init();
