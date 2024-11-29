import Swal from 'sweetalert2'

export class SweetAlertUtils {
  static errorAlert(message: string) {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
    })
  }

  static successAlert(message: string) {
    return Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
    })
  }
}
