// plugins/toastification.ts
import { defineNuxtPlugin } from '#app';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css'; // Importa los estilos CSS

export default defineNuxtPlugin((nuxtApp) => {
  // Configuración de Vue Toastification
  const options = {
    transition: "Vue-Toastification__bounce",
    maxToasts: 5,
    newestOnTop: true,
    position: "top-right" as const, // Asegura el tipo literal
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
  };

  // Registra el plugin en la aplicación Nuxt
  nuxtApp.vueApp.use(Toast, options);
});