const header = (navMenu) => {
    const divNavHeader = document.createElement('div');
    const divNavLogo = document.createElement('div');
    const divNavMenuBtn = document.createElement('div');
    const ulMenu = document.createElement('ul');
    const navBtn = document.createElement('div');

    const liNosotros = document.createElement('li');
    const liServicios = document.createElement('li');
    const liResponsable = document.createElement('li');
    const liContacto = document.createElement('li');

    const aNosotros = document.createElement('a');
    const aServicios = document.createElement('a');
    const aResponsable = document.createElement('a');
    const aContacto = document.createElement('a');
    const aLogo = document.createElement('a');

    const logoSpan = document.createElement('span');
    const menuLineSpan = document.createElement('span');
    const menuLineIcon = document.createElement('i');

    const btnRegistro = document.createElement('a');
    const btnInicioSesion = document.createElement('a');

    divNavHeader.classList.add('nav__header');
    divNavLogo.classList.add('nav__logo');
    divNavMenuBtn.classList.add('nav__menu__btn');
    menuLineIcon.classList.add('ri-menu-line');
    navBtn.classList.add('nav__btns');

    ulMenu.classList.add('nav__links');

    btnRegistro.classList.add('btn', 'sign__up');
    btnInicioSesion.classList.add('btn', 'sign__in');

    btnInicioSesion.setAttribute('href', '#login'); 
    btnRegistro.setAttribute('href', '#registro');

    aNosotros.setAttribute('href', '#nosotros');
    aServicios.setAttribute('href', '#servicios');
    aResponsable.setAttribute('href', '#responsable');
    aContacto.setAttribute('href', '#contacto');
    aLogo.setAttribute('href', '#home');

    divNavMenuBtn.setAttribute('id', 'menu-btn');
    ulMenu.setAttribute('id', 'nav-links');

    aNosotros.textContent = 'Nosotros';
    aServicios.textContent = 'Servicios';
    aResponsable.textContent = 'Responsable'; 
    aContacto.textContent = 'Contacto';
    aLogo.textContent = 'Fix';
    logoSpan.textContent = 'Master';

    btnInicioSesion.textContent = 'Inicia Sesion';
    btnRegistro.textContent = 'Registrate';

    liNosotros.appendChild(aNosotros);
    liServicios.appendChild(aServicios);
    liResponsable.appendChild(aResponsable);
    liContacto.appendChild(aContacto);

    ulMenu.append(liNosotros, liServicios, liResponsable, liContacto);
    navBtn.append(btnRegistro, btnInicioSesion);

    aLogo.appendChild(logoSpan);
    divNavLogo.append(aLogo);

    menuLineSpan.appendChild(menuLineIcon);
    divNavMenuBtn.append(menuLineSpan);

    divNavHeader.append(divNavLogo, divNavMenuBtn);

    btnInicioSesion.addEventListener('click', () => {
        location.hash = "#login"; // Router listens for hashchange
    });

    btnRegistro.addEventListener('click', () => {
        location.hash = "#registro"; // Router listens for hashchange
    });

    navMenu.append(divNavHeader, ulMenu, navBtn);
};

export default header;