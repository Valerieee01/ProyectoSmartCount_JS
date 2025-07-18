import { cleanLocalStorage } from "../helpers/auth";
import header from "./header";

const asideBar = (asideContainer) => {

    const divContainer = document.createElement('div');
    const inputCheckBox = document.createElement('input');
    const labelClick = document.createElement('label');
    const iconSearch = document.createElement('i');
    const iconClose = document.createElement('i');

    const divSideNav = document.createElement('div');
    const divLogo = document.createElement('div');
    const title = document.createElement('h2');

    const form = document.createElement('form');

    const br = document.createElement('br');

    const divIconItems = document.createElement('div');
    const ulIconItems = document.createElement('ul');
    const liHome = document.createElement('li');
    const liUsuario = document.createElement('li');
    const liCliente = document.createElement('li');
    const liEmpleado = document.createElement('li');
    const liMantenimiento = document.createElement('li');
    const liEquipos = document.createElement('li');
    const liProveedores = document.createElement('li');
    const liPagos = document.createElement('li');
    // const liReportes = document.createElement('li');
    const liPersonas = document.createElement('li');
    const liCerrarSesion = document.createElement('li');


    const iHome = document.createElement('i');
    const iUsuario = document.createElement('i');
    const iCiente = document.createElement('i');
    const iEmpleado = document.createElement('i');
    const iMantenimiento = document.createElement('i');
    const iEquipos = document.createElement('i');
    const iProveedores = document.createElement('i');
    const iPagos = document.createElement('i');
    const iPersonas = document.createElement('i');
    // const iReportes = document.createElement('i');

    const iCerrarSesion = document.createElement('i');


    const aHome = document.createElement('a');
    const aUsuario = document.createElement('a');
    const aCiente = document.createElement('a');
    const aEmpleado = document.createElement('a');
    const aMantenimiento = document.createElement('a');
    const aEquipos = document.createElement('a');
    const aProveedores = document.createElement('a');
    const aPagos = document.createElement('a');
    // const aReportes = document.createElement('a');
    const aPersonas = document.createElement('a');
    const aCerrarSesion = document.createElement('a');


    divIconItems.classList.add('icon_items');
    iHome.classList.add("ri-home-line");
    iUsuario.classList.add("ri-user-3-line");
    iCiente.classList.add("ri-service-line");
    iEmpleado.classList.add("ri-user-smile-line");
    iMantenimiento.classList.add('ri-hammer-line');
    iEquipos.classList.add("ri-truck-line");
    iProveedores.classList.add("ri-shopping-bag-3-line");
    iPagos.classList.add("ri-wallet-3-line");
    // iReportes.classList.add("ri-file-chart-line");
    iPersonas.classList.add("ri-team-line");
    iCerrarSesion.classList.add("ri-logout-box-r-line");


    divContainer.classList.add('containerSidebar');
    iconClose.classList.add('ri-close-circle-line');
    iconClose.classList.add('close-btn');
    iconSearch.classList.add('ri-menu-line');
    iconSearch.classList.add('menu-btn');
    divSideNav.classList.add('sidenav');
    divLogo.classList.add('logo');


    inputCheckBox.setAttribute('id', 'click');
    inputCheckBox.setAttribute('type', 'checkbox');
    form.setAttribute('action', '#');
    labelClick.setAttribute('for', 'click');

    aHome.setAttribute('href', '#inicio');
    aUsuario.setAttribute('href', '#user/me');
    aCiente.setAttribute('href', '#cliente');
    aEmpleado.setAttribute('href', '#empleado');
    aMantenimiento.setAttribute('href', '#mantenimiento');
    aEquipos.setAttribute('href', '#equipos');
    aProveedores.setAttribute('href', '#proveedores');
    aPagos.setAttribute('href', '#pagos');
    // aReportes.setAttribute('href', '#reportes');
    aPersonas.setAttribute('href', '#personas');
    aCerrarSesion.setAttribute('href', '#cerrarSesion');

    aHome.textContent = 'Inicio';
    aUsuario.textContent = 'Usuario';
    aCiente.textContent = 'Cliente';
    aEmpleado.textContent = 'Empleado';
    aMantenimiento.textContent = 'Mantenimiento';
    aEquipos.textContent = 'Equipos';
    aProveedores.textContent = 'Proveedores';
    aPagos.textContent = 'Pagos';
    // aReportes.textContent = 'Reportes';
    aPersonas.textContent = 'Personas'

    aCerrarSesion.textContent = 'Cerrar Sesion';

    liHome.append(iHome, aHome);
    liUsuario.append(iUsuario, aUsuario);
    liCliente.append(iCiente, aCiente);
    liEmpleado.append(iEmpleado, aEmpleado);
    liMantenimiento.append(iMantenimiento, aMantenimiento);
    liEquipos.append(iEquipos, aEquipos);
    liProveedores.append(iProveedores, aProveedores);
    liPagos.append(iPagos, aPagos);
    // liReportes.append(iReportes, aReportes);
    liPersonas.append(iPersonas, aPersonas);
    liCerrarSesion.append(iCerrarSesion, aCerrarSesion);

    ulIconItems.append(liHome, liUsuario, liCliente, liEmpleado, liMantenimiento, liEquipos, liProveedores, liPagos, /*liReportes*/ liPersonas, br, liCerrarSesion);
    divIconItems.appendChild(ulIconItems);
    divSideNav.append(divLogo, title, divIconItems);
    labelClick.append(iconSearch, iconClose);
    divContainer.append(inputCheckBox, labelClick, divSideNav);
    asideContainer.append(divContainer);


    const menuItems = [
        { element: liHome, hash: '#inicio' },
        { element: liUsuario, hash: '#user/me' },
        { element: liCliente, hash: '#cliente' },
        { element: liEmpleado, hash: '#empleado' },
        { element: liMantenimiento, hash: '#mantenimiento' },
        { element: liEquipos, hash: '#equipos' },
        { element: liProveedores, hash: '#proveedores' },
        { element: liPagos, hash: '#pagos' },
        // { element: liReportes, hash: '#reportes' },
        { element: liPersonas, hash: '#personas' },

    ];

    menuItems.forEach(item => {
        item.element.addEventListener('click', (e) => {
            // Previene el comportamiento por defecto del <a> si el click fue directamente en él
            // Aunque estamos añadiendo el listener al LI, es una buena práctica.
            e.preventDefault();
            location.hash = item.hash; // Establece el hash de la URL

        });
    });

    // Manejo específico para cerrar sesión (ya lo tenías, lo mantengo separado para claridad)
    liCerrarSesion.addEventListener('click', (e) => {
        e.preventDefault();
        cleanLocalStorage();
        location.hash = "#home";

        // Dispara el evento personalizado para que app.js sepa que el estado de autenticación ha cambiado
        window.dispatchEvent(new Event('modificandoHeader'));
    });
}

export default asideBar;