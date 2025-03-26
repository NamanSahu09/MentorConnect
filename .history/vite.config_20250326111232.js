import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv'
import firebase from 'firebase/compat/app'

dotenv.config()  // Ensure environment variables are loaded
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  define: {
    'firebase.env': firebase.env  // Ensure environment variables work
  }
})
