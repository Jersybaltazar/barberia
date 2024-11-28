<template>
    <div>
      <Navbar />
      <div class="profile-page">
        <div class="profile-container">
          <div class="profile-header">
            <img :src="userImage" alt="Foto de perfil" class="profile-image" />
            <!-- <button class="edit-button">Editar</button> -->
          </div>
          <h2>Perfil de {{ isClient ? cliente.nombre : barbero.nombre }}</h2>
  
          <div class="profile-details">
            <p><strong>Nombre Completo:</strong> {{ isClient ? cliente.nombre + ' ' + cliente.apellido : barbero.nombre + ' ' + barbero.apellido }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p v-if="isClient"><strong>Teléfono:</strong> {{ cliente.telefono }}</p>
            <p v-else><strong>Teléfono:</strong> {{ barbero.telefono }}</p>
            <p v-if="isClient"><strong>Dirección:</strong> {{ cliente.direccion }}</p>
            <p v-if="isClient"><strong>Fecha de Registro:</strong> {{ cliente.fechaRegistro }}</p>
            <p v-if="!isClient"><strong>Especialidad:</strong> {{ barbero.especialidad }}</p>
            <p v-if="!isClient"><strong>Disponibilidad:</strong> {{ barbero.horario }}</p>
          </div>
          
          <button @click="deleteAccount" class="delete-button">Dar de baja cuenta</button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import Navbar from '../components/Navbar.vue';
  
  export default defineComponent({
    name: 'UserProfile',
    components: {
      Navbar,
    },
    setup() {
      const user = ref({
        email: "jose@example.com",
        password: "password123",
        rol: "CLIENTE", 
      });
      
      const cliente = ref({
        nombre: "Juan",
        apellido: "Pérez",
        telefono: "123456789",
        correo: "cliente@example.com",
        direccion: "Calle Falsa 123",
        fechaRegistro: "2024-11-06T00:00:00",
      });
  
      const barbero = ref({
        nombre: "Pedro",
        apellido: "Gómez",
        telefono: "987654321",
        especialidad: "Corte",
        horario: "Disponible",
      });
  
      const isClient = user.value.rol === "CLIENTE";
      const userImage = new URL("../assets/perfilperfil.jpg", import.meta.url).href;
  
      const deleteAccount = () => {
        alert("Cuenta eliminada con éxito.");
      };
  
      return {
        user,
        cliente,
        barbero,
        isClient,
        userImage,
        deleteAccount,
      };
    },
  });
  </script>
  
  <style scoped>
  .profile-page {
    display: flex;
    justify-content: center;
    padding: 3rem 1rem;
    background-color: #f9f9f9;
    min-height: 60vh;
  }
  
  .profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    padding: 3rem;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    width: 100%;
  }
  
  .profile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 1.5rem;
  }
  
  .profile-image {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .edit-button {
    border: 1px solid #333;
    color: #333;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    background-color: transparent;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
  }
  
  .edit-button:hover {
    background-color: #f0f0f0;
  }
  
  .profile-info h2 {
    font-size: 1.8rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 1rem;
  }
  
  .profile-details {
    width: 100%;
    padding: 1.5rem;
    border: 1px solid #ddd;
    border-radius: 12px;
    margin-bottom: 2rem;
  }
  
  .profile-details p {
    font-size: 1rem;
    color: #555;
    margin: 0.5rem 0;
  }
  
  .delete-button {
    background-color: #ff6b6b;
    color: #fff;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .delete-button:hover {
    background-color: #ff4b4b;
  }
  </style>
  