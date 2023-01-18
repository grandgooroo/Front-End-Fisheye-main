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
let media;
let user;

async function init ()
{
    dataGlobal = await getData2();
    media = dataGlobal.media;
    listenerSort();
    getPhotographersId();
    createHTMLPhotographer();
    mediaFactory(); 
    sort();
    mediaFactory();
}

function getPhotographersId()  
{
        const params = new URLSearchParams(window.location.search);
        // console.log(params);
        const userId = Number(params.get('id'));

        const user = dataGlobal.photographers.find(data => data.id === userId);
        console.log(user);

        // createHTMLPhotographer(user)
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

function mediaFactory()
    
    {
            const params = new URLSearchParams(window.location.search);
            const userId = Number(params.get('id'));
            const user = media.find(data => data.photographerId === userId);
            // console.log(user);
            const medias = media.filter(data => data.photographerId === userId);
            // console.log(medias);
            
            mainSection.appendChild(divMediaSection);
            // data.media.forEach(image => {
            //     createItem(image);
            // });

                for (const image of medias)
                {
                    createItem(image, sort(user));
                    // console.log(createItem);
                }
    };   

function createItem(media)
    {
        const mediaItem = document.createElement("article");
        const mediaFolder = `/assets/medias/${media.photographerId}`;
        
        // Faire une condition si "Video" alors...ou "Switch" !?
        
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

function listenerSort() 
    {
        let select = document.querySelector("select");

        select.addEventListener("change", () =>
        {
            sort('date');
            // console.log(sort);
            // createItem(); // Dois je recréer les items ?
        });
    }


    function createDropdownMenu() // Avec Select
    {
        
        menuSection.innerHTML = `
        <label id="menuSelect" class="menuSelect">Trier par :</label>
            <div class="js-select">
                <select id="monselect">
                    <option value="likes" selected>Popularité</option>
                    <option value="title">Titre</option>
                    <option value="date">Date</option> 
                </select>
            </div>
        `;
        mainSection.appendChild(menuSection)
    }

    // function createDropdownMenuBtn() // Avec Button
    // {
    //     menuSection.innerHTML = `
    //         <label id="menuSelect" class="menuSelect">Trier par :</label>
    //             <div class="js-select">
    //                 <button id="current-order">Popularité</button> */Masquer avec display none/*
    //                 <div id="options-order"> */Afficher avec display block/*
    //                 <button data-order="date">Date</button>
    //                 <button data-order="popularity">Popularité</button>
    //                 <button data-order="title">Titre</button>
    //             </div>
    //     `;
    //     mainSection.appendChild(menuSection)
    // }

    function sort(value) // En parametre le data.media et le type et L'ID !?
    {
            /* Avec switch */
        switch(value) 
        {
            case 'likes':
                /* Trier par "likes" */
                media.sort((a, b) => b.likes - a.likes);
                // const likesCounter = media;
                // const byValue = (a,b) => b.likes - a.likes;
                // const sorted = [...likesCounter].sort(byValue);
                console.log("trie like");
                
                break;

            case 'date':
                /* Trier par "date" */
                const dateSort = media.slice().sort((a, b) => b.date - a.date)
                console.log("trie date");
                console.log(media);

                break;

            case 'title':
                console.log("trie titre");
                /* Trier par "title" */

                function titleSort(media)
                {
                    return media.sort(function(a, b)
                    {
                        // console.log(x);
                        return a.title.localeCompare(b.title);
                    });
                }
                titleSort(media);
        }   
    }

  // Afficher le profil du photographe

createDropdownMenu();
init();
