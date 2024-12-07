<template>
  <div>
      <Navbar />
      <div class="profile-page" v-if="user">
          <div class="profile-container">
              <h2>Perfil de {{ user.cliente?.nombre || "Usuario" }}</h2>
              <p><strong>Nombre Completo:</strong> {{ user.cliente?.nombre }} {{ user.cliente?.apellido }}</p>
              <p><strong>Email:</strong> {{ user.email }}</p>
              <p v-if="user.rol === 'CLIENTE'"><strong>Teléfono:</strong> {{ user.cliente?.telefono }}</p>
              <p v-if="user.rol === 'CLIENTE'"><strong>Dirección:</strong> {{ user.cliente?.direccion }}</p>
          </div>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import Navbar from '../components/Navbar.vue';

export default defineComponent({
  name: 'UserProfile',
  components: {
      Navbar,
  },
  setup() {
      const user = ref(null);
      const cliente = ref(null);
      const barbero = ref(null);

      const fetchUserProfile = async () => {
          try {
              const token = localStorage.getItem("token");
              if (!token) return;

              const response = await axios.get("http://localhost:3000/auth/user", {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });

              user.value = response.data.user;

          } catch (error) {
              console.error("Error al obtener el perfil del usuario:", error);
          }
      };

      const deleteAccount = async () => {
          try {
              const token = localStorage.getItem("token");
              if (!token) return;

              await axios.delete(`http://localhost:3000/auth/delete/${user.value.id_usuario}`, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });

              alert("Cuenta eliminada con éxito.");
              localStorage.removeItem("token");
              location.reload();
          } catch (error) {
              console.error("Error al eliminar la cuenta:", error);
          }
      };

      onMounted(fetchUserProfile);

      return {
          user,
          cliente,
          barbero,
          deleteAccount,
          userImage: new URL("../assets/perfilperfil.jpg", import.meta.url).href,
      };
  },
});
</script>
