function displayModal() {
    const modal = document.getElementById("contact_modal");
	modal.style.display = "block";
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
}
// Navigation au clavier
window.addEventListener('keydown', function (event) {
console.log(event.key)
})

// Prenom email
// Get Form inputs
const firstName = document.getElementById("firstName");
const nameReg = new RegExp(/^[A-zÀ-ú-']{2,}$/);
const eMail = document.getElementById("mail");
const emailReg = new RegExp(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/);
const msgError = document.getElementsByClassName("msgerror");

  // First name input
  // if (firstNameInput.value === "") // Test if first name is empty
  // {
  //   createMsgError(firstNameInput, "Le champ Prenom est obligatoire.");
  //   formIsValid = false;
  //   console.log(formIsValid);
  // } else {

  //   if (!nameReg.test(firstNameInput.value)) // Test if first name match with Regex
  //   {
  //     createMsgError(firstNameInput, "Le Prenom doit avoir deux characters minimum.");
  //     formIsValid = false;  
  //   } else {}
  // }

  // // Last name input
  // if (lastNameInput.value === "") // Test if last Name is empty
  // {
  //   createMsgError(lastNameInput, "Le champ Nom est obligatoire.")
  //   formIsValid = false;
  // } else {

  //   if (!nameReg.test(lastNameInput.value)) // Test if last name match with Regex
  //   {
  //     createMsgError(lastNameInput, "Le Nom doit avoir deux characters minimum.");
  //     formIsValid = false;
  //   }
  // }

  // // Email  input
  // if (emailInput.value === "") // Test if e-mail is empty
  // {
  //   createMsgError(emailInput, "Le champ E-mail est obligatoire.");
  //   formIsValid = false; 
  // }
  
  // else if (!emailReg.test(emailInput.value)) // Test if e-mail match with Regex
  // {
  //   createMsgError(emailInput, "Veuillez renseigner une E-mail valide.");
  //   formIsValid = false;    
  // }