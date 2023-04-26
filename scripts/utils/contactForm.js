export class ContactFormModal {
    constructor() {
        this.modal = null;
        this.mainSection = document.querySelector("#main");
    }

    createModalHTML(photographerName) {
        const modal = document.createElement("div");
        modal.id = "contact_modal";
        modal.setAttribute("aria-hidden", "true");
        modal.setAttribute("role", "modal");
        modal.setAttribute("aria-modal", "false");
        modal.innerHTML = `
        <div class="modal">
            <header>
            <h2>Contactez ${photographerName}</h2>
            <img src="assets/icons/close.svg" class="close-modal" />
          </header>
          <form>
          <div>
            <label for="first_name">Prénom</label>
            <input id="first_name" name="first_name" aria-label="Prénom" />
          </div>

          <div>
            <label for="name">Nom</label>
            <input id="name" name="name" aria-label="nom" />
          </div>

          <div>
            <label for="email">Adresse e-mail</label>
            <input id="email" name="email" type="email" aria-label="Adresse e-mail" />
          </div>

          <div>
            <label for="message">Votre message</label>
            <textarea id="message" name="message" aria-label="Votre message"></textarea>
          </div>
          <button class="contact_button" type="submit">Envoyer</button>
        </form>
        </div>
      `;
      return modal;
    }
  
    initModal(photographerName) {
      this.modal = this.createModalHTML(photographerName);
      document.body.appendChild(this.modal);
  
      const closeModalButton = this.modal.querySelector(".close-modal");
      closeModalButton.addEventListener("click", () => {
        this.closeModal();
      });
  
      // Écouteur d'événement pour la touche "Escape"
        window.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
            this.closeModal();
            }
        });
    }
  
    displayModal(photographerName) {
      if (!this.modal) {
        this.initModal(photographerName);
      }
  
      this.modal.style.display = "block";
      this.modal.removeAttribute("aria-hidden");
      this.modal.setAttribute("aria-modal", "true");
      this.mainSection.setAttribute("aria-hidden", "true");
    }
  
    closeModal() {
      if (this.modal) {
        this.modal.style.display = "none";
        this.modal.setAttribute("aria-hidden", "true");
        this.modal.removeAttribute("aria-modal");
        this.mainSection.setAttribute("aria-hidden", "false");
      }
    }
  }
  