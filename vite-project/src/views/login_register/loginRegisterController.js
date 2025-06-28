
export const loginRegisterController = (params) => {
    // Select elements after the view is loaded into the DOM
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

        if (location.hash === "#registro") {
            container.classList.add('active');
        } else if (location.hash === "#login") {
            container.classList.remove('active');
        }
    } else {
        console.error("Login/Register elements not found in the DOM.");
    }

    
};
    

