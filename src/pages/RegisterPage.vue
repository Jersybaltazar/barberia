<template>
  <div class="register-container">
    <div class="register-box">
      <h1>Registro de Usuario</h1>
      <p>Regístrate para comenzar a utilizar nuestros servicios</p>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input type="email" id="email" v-model="email" placeholder="Ingresa tu correo electrónico" required />
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="password-wrapper">
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password"
              placeholder="Ingresa tu contraseña" required />
            <button type="button" class="toggle-password" @click="togglePasswordVisibility">
              <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
            </button>
          </div>
        </div>
        <div class="form-group">
          <label for="rol">Tipo de Usuario</label>
          <select id="rol" v-model="rol" required>
            <option value="CLIENTE">Cliente</option>
            <option value="BARBERO">Barbero</option>
          </select>
        </div>

        <!-- Campos específicos para CLIENTE -->
        <div v-if="rol === 'CLIENTE'" class="grid-container">
          <div class="form-group">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" v-model="cliente.nombre" placeholder="Ingresa tu nombre" required />
          </div>
          <div class="form-group">
            <label for="apellido">Apellido</label>
            <input type="text" id="apellido" v-model="cliente.apellido" placeholder="Ingresa tu apellido" required />
          </div>
          <div class="form-group">
            <label for="telefono">Teléfono</label>
            <input type="tel" id="telefono" v-model="cliente.telefono" placeholder="Ingresa tu teléfono" required />
          </div>
          <div class="form-group">
            <label for="direccion">Dirección</label>
            <input type="text" id="direccion" v-model="cliente.direccion" placeholder="Ingresa tu dirección" />
          </div>
        </div>

        <!-- Campos específicos para BARBERO -->
        <div v-if="rol === 'BARBERO'" class="grid-container">
          <div class="form-group">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" v-model="barbero.nombre" placeholder="Ingresa tu nombre" required />
          </div>
          <div class="form-group">
            <label for="apellido">Apellido</label>
            <input type="text" id="apellido" v-model="barbero.apellido" placeholder="Ingresa tu apellido" required />
          </div>
          <div class="form-group">
            <label for="telefono">Teléfono</label>
            <input type="tel" id="telefono" v-model="barbero.telefono" placeholder="Ingresa tu teléfono" required />
          </div>
          <div class="form-group">
            <label for="especialidad">Especialidad</label>
            <input type="text" id="especialidad" v-model="barbero.especialidad" placeholder="Ingresa tu especialidad" />
          </div>
          <div class="form-group">
            <label for="horario">Disponibilidad</label>
            <input type="text" id="horario" v-model="barbero.horario"
              placeholder="Ingresa tu disponibilidad" />
          </div> <!-- Cerré correctamente este div -->
        </div>

        <button type="submit" class="register-button">Crear Cuenta</button>
      </form>
      <p class="login-link">
        ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import FontAwesomeIcon from '../fontawesome';
import axios from 'axios';
export default defineComponent({
  name: 'RegisterPage',
  components: {
    FontAwesomeIcon,
  },
  setup() {
    const email = ref<string>('');
    const password = ref<string>('');
    const showPassword = ref<boolean>(false);
    const rol = ref<string>('CLIENTE'); // Por defecto, seleccionado como "CLIENTE"
    const cliente = ref({
      nombre: '',
      apellido: '',
      telefono: '',
      direccion: '',
    });
    const barbero = ref({
      nombre: '',
      apellido: '',
      telefono: '',
      especialidad: '',
      horario: '',
    });



    const handleRegister = async () => {
      try {
        const data = {
          email: email.value,
          password: password.value,
          rol: rol.value,
          cliente: rol.value === 'CLIENTE' ? cliente.value : null,
          barbero: rol.value === 'BARBERO' ? barbero.value : null,
        };

        const response = await axios.post('http://localhost:3000/register', data);
        console.log(response.data.message);
        alert('Usuario registrado exitosamente');
      } catch (error) {
        console.error(error.response.data.message || 'Error al registrar usuario');
        alert('Error al registrar usuario');
      }
    };


    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    return {
      email,
      password,
      showPassword,
      rol,
      cliente,
      barbero,
      handleRegister,
      togglePasswordVisibility,
    };
  },
});
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;
  padding: 1rem;
}

.register-box {
  width: 500px;
  padding: 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  text-align: center;
  background-color: #ffffff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 26px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 0.75rem;
}

p {
  font-size: 15px;
  color: #666666;
  margin-bottom: 1.75rem;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

label {
  font-size: 15px;
  font-weight: bold;
  display: block;
  color: #333333;
  margin-bottom: 0.5rem;
}

input[type="email"],
input[type="password"],
input[type="text"],
input[type="tel"],
select {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  color: #333333;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus,
select:focus {
  border-color: #6c63ff;
  outline: none;
}

.password-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #6c63ff;
  font-size: 18px;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.register-button {
  width: 100%;
  padding: 0.85rem;
  background-color: #6c63ff;
  color: #ffffff;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 17px;
  margin-top: 1rem;
}

.register-button:hover {
  background-color: #594dbe;
}

.login-link {
  margin-top: 1.5rem;
  font-size: 15px;
  color: #666666;
}

.login-link a {
  color: #6c63ff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
