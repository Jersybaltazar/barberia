<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Bienvenido</h1>
      <p>Inicia sesión para comenzar a realizar tus pedidos</p>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Ingresa tu correo electrónico"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="password-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              placeholder="Ingresa tu contraseña"
              required
            />
            <button
              type="button"
              class="toggle-password"
              @click="togglePasswordVisibility"
            >
              <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
            </button>
          </div>
        </div>
        <button type="submit" class="login-button">Iniciar Sesión</button>
      </form>
      <p class="register-link">
        ¿No tienes una cuenta? <a href="/register">Crear una cuenta</a>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import FontAwesomeIcon from "../fontawesome";
import axios from "axios";

export default defineComponent({
  name: "LoginPage",
  components: {
    FontAwesomeIcon,
  },
  setup() {
    const email = ref<string>("");
    const password = ref<string>("");
    const showPassword = ref<boolean>(false);
    const router = useRouter();

    const handleLogin = async () => {
      if (!email.value || !password.value) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      try {
        const response = await axios.post("http://localhost:3000/login", {
          email: email.value,
          password: password.value,
        });

        const { token, user } = response.data;

        // Guardar el token en localStorage
        localStorage.setItem("token", token);

        // Guardar información adicional según el rol del usuario
        if (user.rol === "CLIENTE") {
          localStorage.setItem("id_cliente", user.id_cliente);
          router.push("/home"); // Redirigir a la página principal de clientes
        } else if (user.rol === "ADMIN") {
          router.push("/home"); // Redirigir al panel administrativo
        } else {
          throw new Error("Rol no válido o datos incompletos.");
        }
      } catch (error:any) {
        console.error("Error al iniciar sesión:", error);
        alert(
          error.response?.data?.message ||
            "Error al iniciar sesión. Inténtalo de nuevo."
        );
      }
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    return {
      email,
      password,
      showPassword,
      handleLogin,
      togglePasswordVisibility,
    };
  },
});
</script>
<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;
  padding: 1rem;
}

.login-box {
  width: 420px;
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
input[type="text"] {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  color: #333333;
  transition: border-color 0.3s, background-color 0.3s;
  padding-right: 2.5rem;
  box-sizing: border-box;
}

input[type="email"]:focus,
input[type="password"]:focus,
input[type="text"]:focus {
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

.login-button {
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

.login-button:hover {
  background-color: #594dbe;
}

.register-link {
  margin-top: 1.5rem;
  font-size: 15px;
  color: #666666;
}

.register-link a {
  color: #6c63ff;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>