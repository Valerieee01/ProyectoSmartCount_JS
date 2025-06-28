import { loginController } from "./loginController";
import { registroController } from "./registroController";

export const loginRegisterController = () => {
    
    const container = document.querySelector('.container');
    const registerBtn = document.querySelector('.register-btn');
    const loginBtn = document.querySelector('.login-btn');

    if (container && registerBtn && loginBtn) { 
        registerBtn.addEventListener('click', (event) => {
            event.preventDefault(); 
            container.classList.add('active');
            
        });

        loginBtn.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            container.classList.remove('active');
           
        });

        
    } else {
        console.error("Login/Register elements not found in the DOM.");
    }
    
    registerBtn.addEventListener('click' , () => { 
        location.hash = "#registro";
    });
    loginBtn.addEventListener('click' , () => {
        location.hash = "#login";
    });
    
    if (location.hash === "#registro") {
        registroController(container);
    } else if (location.hash === "#login") {
        loginController(container)
    }
};
    

