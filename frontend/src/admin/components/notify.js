import Swal from 'sweetalert2'
import './notify.css'

const navy = '#1a365d'
const danger = '#b42318'
const muted = '#6b7280'

const adminSwal = Swal.mixin({
  heightAuto: false,
  buttonsStyling: true,
  confirmButtonColor: navy,
  cancelButtonColor: muted,
  customClass: {
    container: 'admin-swal',
    popup: 'admin-swal-popup',
    title: 'admin-swal-title',
    htmlContainer: 'admin-swal-text',
    confirmButton: 'admin-swal-confirm',
    cancelButton: 'admin-swal-cancel',
  },
})

export function notifyFlash(type, message, { duration } = {}) {
  const text = String(message || '').trim()
  if (!text) return Promise.resolve()

  const isError = type === 'error'
  return adminSwal.fire({
    icon: isError ? 'error' : 'success',
    title: isError ? 'Could not complete' : 'Success',
    text,
    confirmButtonText: 'OK',
    confirmButtonColor: isError ? danger : navy,
    timer: isError ? undefined : duration ?? 3200,
    timerProgressBar: !isError,
    allowOutsideClick: true,
    allowEscapeKey: true,
  })
}

export function closeNotify() {
  Swal.close()
}

export function confirmAction({
  title = 'Please confirm',
  text,
  confirmLabel = 'Continue',
  cancelLabel = 'Cancel',
  icon = 'question',
  danger: isDanger = false,
} = {}) {
  return adminSwal
    .fire({
      icon,
      title,
      text,
      showCancelButton: true,
      focusCancel: true,
      reverseButtons: true,
      confirmButtonText: confirmLabel,
      cancelButtonText: cancelLabel,
      confirmButtonColor: isDanger ? danger : navy,
    })
    .then((result) => Boolean(result.isConfirmed))
}
