<template>
    <header class="navbar">
        <div class="navbar-container">
            <!-- Logo -->
            <a href="/home" class="navbar-logo">LIMA99</a>
            
            <!-- Navigation Links -->
            <nav>
                <ul class="navbar-links">
                    <li><router-link to="/barberos">Barberos</router-link></li>
                    <li><router-link to="/productos">Productos</router-link></li>
                    <li><router-link to="/servicios">Servicios</router-link></li>
                    <li><router-link to="/reservas">Reservas</router-link></li>
                    <li><router-link to="/ordenes">Ordenes</router-link></li>
                </ul>
            </nav>
            
            <!-- User Info and Logout Button -->
            <div class="user-info" v-if="isLoggedIn">
                <!-- Mostrar nombre para CLIENTE -->
                <router-link v-if="user.rol === 'CLIENTE'" to="/perfil" class="user-name">
                    {{ user.cliente.nombre }} {{ user.cliente.apellido }} ({{ user.rol }})
                </router-link>
                <!-- Mostrar solo el rol para ADMIN -->
                <span v-else class="user-name">
                    ({{ user.rol }})
                </span>
                <button @click="logout" class="logout-button">Cerrar sesión</button>
            </div>
            
            <!-- Login/Register Links if Not Logged In -->
            <div class="auth-links" v-else>
                <router-link to="/register" class="auth-link">Registrarse</router-link>
                <router-link to="/login" class="auth-link">Iniciar sesión</router-link>
            </div>
        </div>
    </header>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';

export default defineComponent({
    name: "Navbar",
    setup() {
        const isLoggedIn = ref(false);
        const user = ref({
            cliente: null, // Cambia a null por defecto para manejar ambos casos
            email: "",
            rol: "",
        });

        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const response = await axios.get("http://localhost:3000/auth/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Actualiza el objeto `user` con los datos del backend
                user.value = response.data.user;
                isLoggedIn.value = true;
            } catch (error) {
                console.error("Error al obtener el usuario:", error);
                isLoggedIn.value = false;
            }
        };
        
        const logout = () => {
            localStorage.removeItem("token");
            isLoggedIn.value = false;
            user.value = {
                cliente: null,
                email: "",
                rol: "",
            };
            location.reload();
        };

        onMounted(fetchUser);

        return {
            isLoggedIn,
            user,
            logout,
        };
    },
});
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: center;
    padding: 1rem 0;
    border-bottom: 1px solid #e0e0e0;
    background-color: #fff;
}

.navbar-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 90%;
    max-width: 1200px;
}

.navbar-logo {
    font-size: 1.75rem;
    font-weight: bold;
    color: #333;
    text-decoration: none;
}

.navbar-links {
    display: flex;
    gap: 1.5rem;
    list-style: none;
}

.navbar-links a {
    font-size: 1.1rem;
    color: #333;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: background-color 0.3s;
}

.navbar-links a:hover {
    background-color: #f0f0f0;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1rem;
    color: #333;
}

.user-name {
    font-weight: bold;
    color: #333;
}

.logout-button {
    background-color: #ff6b6b;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.logout-button:hover {
    background-color: #ff4b4b;
}

.auth-links {
    display: flex;
    gap: 1rem;
}

.auth-link {
    font-size: 1rem;
    color: #333;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: background-color 0.3s;
}

.auth-link:hover {
    background-color: #f0f0f0;
}
</style>
