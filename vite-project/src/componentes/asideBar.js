const asideBar = (asideBar) => {

    const divContainer = document.createElement('div');
    const inputCheckBox = document.createElement('input');
    const labelClick = document.createElement('label');
    const iconSearch = document.createElement('i');
    const iconClose = document.createElement('i');

    const divSideNav = document.createElement('div');
    const divLogo = document.createElement('div');
    const title = document.createElement('h2');

    const divSearchBar = document.createElement('div');
    const form = document.createElement('form');

    const divIconItems = document.createElement('div');
    const ulIconItems = document.createElement('ul');
    const liHome = document.createElement('li');
    const liUsuario = document.createElement('li');
    const liCliente = document.createElement('li');
    const liEmpleado = document.createElement('li');
    const liMantenimiento = document.createElement('li');
    const liEquipos= document.createElement('li');
    const liProveedores = document.createElement('li');
    const liPagos = document.createElement('li');
    const liCerrarSesion = document.createElement('li');


    const iHome = document.createElement('i');
    const iUsuario = document.createElement('i');
    const iCiente = document.createElement('i');
    const iEmpleado = document.createElement('i');
    const iMantenimiento = document.createElement('i');
    const iEquipos= document.createElement('i');
    const iProveedores = document.createElement('i');
    const iPagos = document.createElement('i');

    const iCerrarSesion = document.createElement('i');


    const aHome = document.createElement('a');
    const aUsuario = document.createElement('a');
    const aCiente = document.createElement('a');
    const aEmpleado = document.createElement('a');
    const aMantenimiento = document.createElement('a');
    const aEquipos= document.createElement('a');
    const aProveedores = document.createElement('a');
    const aPagos = document.createElement('a');
    const aCerrarSesion  = document.createElement('a');


    divIconItems.classList.add('icon_items');
    iHome.classList.add("ri-home-line");
    iUsuario.classList.add("ri-user-3-line");
    iCiente.classList.add("ri-service-line");
    iEmpleado.classList.add("ri-user-smile-line");
    iMantenimiento.classList.add('ri-hammer-line');
    iEquipos.classList.add("ri-truck-line");
    iProveedores.classList.add("ri-shopping-bag-3-line");
    iPagos.classList.add("ri-wallet-3-line");
    iCerrarSesion.classList.add("ri-logout-box-r-line");

    divContainer.classList.add('container');
    iconClose.classList.add('ri-close-circle-line');
    iconSearch.classList.add('ri-menu-line');
    divSideNav.classList.add('sidenav');
    divLogo.classList.add('logo');
    divSearchBar.classList.add('search_bar');


    inputCheckBox.setAttribute('id', 'click');
    inputCheckBox.setAttribute('type', 'checkbox');
    form.setAttribute('action','#');

    aHome.setAttribute('href', '#inicio');
    aUsuario.setAttribute('href', '#usuario');
    aCiente.setAttribute('href', '#cliente');
    aEmpleado.setAttribute('href', '#empleado');
    aMantenimiento.setAttribute('href', '#mantenimiento');
    aEquipos.setAttribute('href', '#equipos');
    aProveedores.setAttribute('href', '#proveedores');
    aPagos.setAttribute('href', '#pagos');
    aCerrarSesion.setAttribute('href', '#cerrarSesion');

    liHome.append(iHome, aHome);
    liUsuario.append(iUsuario, aUsuario);
    liCliente.append(iCiente, aCiente);
    liEmpleado.append(iEmpleado, aEmpleado);
    liMantenimiento.append(iMantenimiento, aMantenimiento);
    liEquipos.append(iEquipos, aEquipos);
    liProveedores.append(iProveedores, aProveedores);
    liPagos.append(iPagos, aPagos);
    liCerrarSesion.append(iCerrarSesion, aCerrarSesion);

    ulIconItems.append(liHome, liUsuario, liCliente, liEmpleado, liMantenimiento, liEquipos, liProveedores, liPagos, liCerrarSesion);
    divIconItems.appendChild(ulIconItems);
    divSideNav.append(divLogo, title);
    labelClick.append(iconSearch, iconClose);
    divContainer.append(inputCheckBox,labelClick , divSideNav);
    asideBar.append(divContainer);

}

export default asideBar;