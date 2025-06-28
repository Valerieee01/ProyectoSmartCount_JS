import header from "./componentes/header.js";
import "./style.css";
import { router } from "./routes/router.js";


const nav = document.querySelector('.nav_menu');
console.log(nav);
header();



window.addEventListener('DOMContentLoaded', () => {
    router(nav);
});

window.addEventListener('hashchange', () => {
 router(nav);
});


