export class ContactFormModal {
    constructor() {
        this.modal = null;
        this.mainSection = document.querySelector("#main");
    }

    createModalHTML(photographerName) {
      console.log('Creating a new modal');
        const modal = document.createElement("div");
        modal.id = "contact_modal";
        modal.setAttribute("aria-hidden", "true");
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "false");
        modal.innerHTML = `
        <div class="modal" alt="Contact me" aria-labelledby="">
            <header>
            <h2>Contactez, ${photographerName}</h2>
            <img src="assets/icons/close.svg" class="close-modal" alt="Close Contact form" role="img"/>
          </header>
          <form>
          <div>
            <label for="first_name">Prénom</label>
            <input id="first_name" name="first_name" aria-label="Prénom" />
          </div>

          <div>
            <label for="Last name">Nom</label>
            <input id="Last name" name="name" aria-label="nom" />
          </div>

          <div>
            <label for="email">Adresse e-mail</label>
            <input id="email" name="email" type="email" aria-label="Adresse e-mail" />
          </div>

          <div>
            <label for="Your message">Votre message</label>
            <textarea id="Your message" name="message" aria-label="Votre message"></textarea>
          </div>
          <button class="contact_button_submit" type="submit" alt="Send">Envoyer</button>
        </form>
        </div>
      `;
      const form = modal.querySelector("form");
      form.addEventListener("submit", (event) => this.handleFormSubmit(event));
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
    
      // Ajout écouteur d'événements "keydown" au niveau du document
      document.addEventListener("keydown", this.handleKeyDown);
    }
    
    displayModal(photographerName) {
      if (!this.modal) {
        this.initModal(photographerName);
      }
  
      this.modal.style.display = "block";
      this.modal.removeAttribute("aria-hidden");
      this.modal.setAttribute("aria-modal", "true");
      this.mainSection.setAttribute("aria-hidden", "true");
      this.disableBackgroundFocus();
    
      const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const firstFocusableElement = this.modal.querySelectorAll(focusableElements)[0];
      
      setTimeout(() => {
        firstFocusableElement.focus();
      }, 0);
    }
  
    closeModal() {
      if (this.modal) {
        this.modal.style.display = "none";
        this.modal.setAttribute("aria-hidden", "true");
        this.modal.removeAttribute("aria-modal");
        this.mainSection.setAttribute("aria-hidden", "false");
        this.enableBackgroundFocus();
        document.removeEventListener("keydown", this.handleKeyDown);
      }
      console.log("modal closed");
    }
    

    disableBackgroundFocus() {
      const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const backgroundFocusableElements = this.mainSection.querySelectorAll(focusableElements);

      backgroundFocusableElements.forEach((element) => {
        // Vérifiez si l'élément fait partie du menu déroulant
        if (!element.closest(".dropdown-menu")) {
          element.setAttribute('tabindex', '-1');
        }
      });
    }

    enableBackgroundFocus() {
      const disabledFocusableElements = this.mainSection.querySelectorAll('[tabindex="-1"]');
    
      disabledFocusableElements.forEach((element) => {
        // Vérifiez si l'élément fait partie du menu déroulant
        if (!element.closest(".dropdown-menu")) {
          element.removeAttribute('tabindex');
        }
      });
    
      // Rétablir le tabindex pour les boutons "like"
      const likeButtons = document.querySelectorAll(".likes[data-id]");
      likeButtons.forEach((button) => {
        button.setAttribute("tabindex", "0");
      });
    }
    

    
    handleKeyDown = (e) => {
      if (this.modal && this.modal.contains(document.activeElement)) {
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const firstFocusableElement = this.modal.querySelectorAll(focusableElements)[0];
        const focusableContent = this.modal.querySelectorAll(focusableElements);
        const lastFocusableElement = focusableContent[focusableContent.length - 1];
    
        let isTabPressed = e.key === "Tab" || e.keyCode === 9;
    
        if (!isTabPressed) {
          return;
        }
    
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      }
    };
  
    handleFormSubmit(event) {
      event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire
  
      const firstName = event.target.elements.first_name.value;
      const lastName = event.target.elements.name.value;
      const email = event.target.elements.email.value;
      const message = event.target.elements.message.value;
  
      console.log("Prénom :", firstName);
      console.log("Nom :", lastName);
      console.log("Email :", email);
      console.log("Message :", message);
  
      // Fermez le formulaire de contact après la soumission si nécessaire
      this.closeModal();
    }
  }
  