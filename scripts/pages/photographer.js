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
    // media = dataGlobal.media;
    // photographer = dataGlobal.photographer;

    mainSection.appendChild(divMediaSection);
    listenerSort();
    // getPhotographersId();
    
    const id = getURLId();
    const photographer = getPhotographersId(id);
    media = getPhotographersMedia(id);
    createHTMLPhotographer(photographer);
    mediaFactory(); 
    sort(media);
}

function getURLId()
{
    const params = new URLSearchParams(window.location.search);
        console.log(params);
        const userId = Number(params.get('id'));
        return userId
}

function getPhotographersId(userId)  // Compare l'ID de l'URL à celui du tableau photographers.photographe
{
        const user = dataGlobal.photographers.find(data => 
            data.id === userId);
        console.log(user);
        return user;
}

function getPhotographersMedia(userId)  // Compare l'ID de l'URL à celui du tableau photographers.photographe
{
        const medias = dataGlobal.media.filter(data => 
            data.photographerId === userId);
        console.log(medias);
        return medias;
}

const params = new URLSearchParams(window.location.search);
const userId = Number(params.get('id'));
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
        divMediaSection.innerHTML = "";
            for (const image of media) // Pour un tableau et par pour chaque image avec le trie !?
            {
                createItem(image);
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
        let SelectValue = document.querySelector("#monselect");

        SelectValue.addEventListener("change", () =>
        {
            console.log("You selected: ", SelectValue.value);
            const value = SelectValue.value;
            console.log(value);
            sort(value);
            mediaFactory();
        });
    }


    function createDropdownMenu()
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

    function sort(value)
    {
            /* Avec switch */
        switch(value) 
        {
            case 'likes':
                /* Trier par "likes" */
                media.sort((a, b) => b.likes - a.likes);
                console.log("trie like OK");
                // console.table(media);
                
                break;

            case 'date':
                /* Trier par "date" */
                
                media.sort((a, b) => {
                    return new Date(a.date) - new Date(b.date); // descending
                    })
                console.log("trie date OK");
                // console.table(media);

                break;

            case 'title':
                
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
                console.log("trie titre OK");
                // console.table(media);
                break;
        }   
    }

  // Afficher le profil du photographe

createDropdownMenu();
init();
