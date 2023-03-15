// LightBox Prototype
// Launch LightBox event
function lightbox() {
    const mediaItem = document.querySelectorAll(`.media[data-lightbox]`);
    mediaItem.forEach(media => media.addEventListener("click", e => 
      {
        e.preventDefault()
        console.log(mediaItem);
      // Launch modal LightBox a déclancher avec target.dataset.id
      function openLightbox() {
        const nbSlide = mediaItem.lenght;
        // const btnLeft = ;
        // const btnRight =;
      const divLightboxContainer = document.createElement("div");
      divLightboxContainer.style.display = "block"; // Masquer pour clore la lightB
      divLightboxContainer.className = "lightbox-body";
      divLightboxContainer.innerHTML = `
      <p>Toto</p>
      `
      }
    }));

     // Ajoutez la Lightbox à la page
    document.body.appendChild(lightbox);
  }