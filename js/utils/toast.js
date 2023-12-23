import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

export const toast = {
    sucsess (message) {
        Toastify({
          text: message,
          duration: 5000,
          close: true,
          gravity: 'top',
          position: 'right',
          stopOnFocus: true,
          style: {
            background: 'linear-gradient(to right, #388e3c, #81c784)',
          },
        }).showToast()
        
    },
    infor (message) {
        Toastify({
          text: message,
          duration: 5000,
          close: true,
          gravity: 'top',
          position: 'right',
          stopOnFocus: true,
          style: {
            background: 'linear-gradient(to right, #0288d1, #4fc3f7)',
          },
        }).showToast()
        
    },
    error (message) {
        Toastify({
          text: message,
          duration: 5000,
          close: true,
          gravity: 'top',
          position: 'right',
          stopOnFocus: true,
          style: {
            background: 'linear-gradient(to right, #d32f2f, #e57373)',
          },
        }).showToast()

    }
}