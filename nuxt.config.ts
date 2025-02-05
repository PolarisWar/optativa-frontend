export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@sidebase/nuxt-auth",
  ],

  css: ["assets/css/tailwind.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      BACKEND_URL: process.env.BACKEND_URL, // Variable de entorno para el backend
    },
  },

  auth: {
    baseURL: process.env.BACKEND_URL,
    provider: {
      type: "local",
      endpoints: {
        signIn: {
          path: "/auth/login",
          method: "post"
        },
        signUp: {
          path: "/auth/register",
          method: "post"
        },
        signOut: {
          path: "/auth/logout",
          method: "post"
        },
        getSession: {
          path: "/session",
          method: "get"
        }
      },
      pages: {
        login: "/login"
      },
      session: {
        dataType: {
          id: 'number',
          userName: 'string',
          correoElectronico: 'string',
          rol: "'admin' | 'usuario'",
          twoFactorEnabled: "boolean",
        },
        dataResponsePointer: "/"
      },
      token: {
        signInResponseTokenPointer: "/accessToken",
        maxAgeInSeconds: 3600,
        type: "Bearer",
        headerName: "Authorization"
      },
      refresh: {
        isEnabled: true,
        endpoint: {
          path: '/auth/refreshToken',
          method: 'post'
        },
        refreshOnlyToken: true,
        token: {
          signInResponseRefreshTokenPointer: '/refreshToken',
          maxAgeInSeconds: 604800
        }
      }
    },
    globalAppMiddleware: {
      isEnabled: true,
      allow404WithoutAuth: true
    }
  },
  compatibilityDate: '2025-01-15'
});
