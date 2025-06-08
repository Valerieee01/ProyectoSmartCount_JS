
export const loadView = async (elemento, template) => {    
    const response = await fetch(`/src/views/${template}`);
    const html = await response.text();
    elemento.innerHTML = html;
}


