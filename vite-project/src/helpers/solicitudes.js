const accessToken = localStorage.getItem("accessToken"); 

export const encabezados = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${accessToken}`,
};

