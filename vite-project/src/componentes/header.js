
const header = () => {

    
    const ulMenu = document.querySelector('.nav__links');
    const navBtn = document.querySelector('.nav__btns');


    const liNosotros = document.createElement('li');
    const liServicios = document.createElement('li');
    const liResponsable = document.createElement('li');
    const liContacto = document.createElement('li');

    const aNosotros = document.createElement('a');
    const aServicios = document.createElement('a');
    const aResponsable = document.createElement('a');
    const aContacto = document.createElement('a');

    const btnRegistro = document.createElement('button');
    const btnInicioSesion = document.createElement('button');

    btnRegistro.classList.add('btn');
    btnRegistro.classList.add('sign__up');
    btnInicioSesion.classList.add('btn');
    btnInicioSesion.classList.add('sign__in');


    aNosotros.setAttribute('href', '#nosotros');
    aServicios.setAttribute('href', '#servicios');
    aResponsable.setAttribute('href', '#responsable');
    aContacto.setAttribute('href', '#contacto');

    aNosotros.textContent = 'Nosotros';
    aServicios.textContent = 'Servicios';
    aResponsable.textContent = 'Resposable';
    aContacto.textContent = 'Contacto';

    btnInicioSesion.textContent = 'Inicia Sesion';
    btnRegistro.textContent = 'Registrate';

    liNosotros.appendChild(aNosotros);
    liServicios.appendChild(aServicios);
    liResponsable.appendChild(aResponsable);
    liContacto.appendChild(aContacto);

    ulMenu.append(liNosotros, liServicios, liResponsable, liContacto);
    navBtn.append(btnRegistro, btnInicioSesion);

    
}

export default header;
