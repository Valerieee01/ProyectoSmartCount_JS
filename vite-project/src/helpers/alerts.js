import Swal from "sweetalert2";

export const success = (response) => {
  Swal.fire({
    title: "Muy bien!",
    text: response.message,
    icon: "success",
    confirmButtonText: "Cool",
  });
};

export const error = (response) => {
  Swal.fire({
    title: "Error!",
    text: response.message,
    icon: "error",
    confirmButtonText: "Cool",
  });
};
