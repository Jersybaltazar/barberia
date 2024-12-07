<template>
  <div>
    <Navbar />
    <div class="services-page">
      <div class="page-header">
        <h1>Servicios Disponibles</h1>
        <button class="create-button" v-if="isAdmin" @click="showCreateServiceModal = true">
          Crear Servicio
        </button>
      </div>

      <div class="services-grid">
        <div v-for="(service, index) in services" :key="index" class="service-card">
          <div class="image-container">
            <img :src="service.imagen" alt="Imagen del servicio" class="service-image" />
            <div class="service-actions">
              <template v-if="isAdmin">
                <button class="action-button edit" @click="editService(service)">
                  <i class="fas fa-edit"></i>
                  Editar
                </button>
                <button class="action-button delete" @click="deleteService(service.id_servicio)">
                  <i class="fas fa-trash"></i>
                  Eliminar
                </button>
              </template>
              <template v-else>
                <button class="action-button reservar" @click="reservarService(service)">
                  Reservar
                </button>
              </template>
            </div>
          </div>
          <div class="service-info">
            <h2 class="service-title">{{ service.nombre }}</h2>
            <p class="service-price">{{ service.precio | currency }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para crear/editar servicio -->
    <div v-if="showCreateServiceModal" class="modal">
      <div class="modal-backdrop" @click="showCreateServiceModal = false"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Editar Servicio' : 'Crear Servicio' }}</h2>
          <button class="modal-close" @click="showCreateServiceModal = false">
            <span>&times;</span>
          </button>
        </div>
        <form @submit.prevent="createService" class="modal-form">
          <div class="form-group">
            <label for="nombre">Nombre del Servicio</label>
            <input type="text" v-model="newService.nombre" id="nombre" required
              placeholder="Ingrese el nombre del servicio" />
          </div>
          <div class="form-group">
            <label for="precio">Precio</label>
            <input type="number" v-model="newService.precio" id="precio" required placeholder="Ingrese el precio"
              step="0.01" />
          </div>
          <div class="form-group">
            <label for="imagen">Imagen del Servicio</label>
            <div class="file-input-container">
              <input type="file" @change="handleImageUpload" id="imagen" accept="image/*" class="file-input" />
              <label for="imagen" class="file-input-label">
                <i class="fas fa-cloud-upload-alt"></i>
                {{ newService.imagen ? 'Cambiar imagen' : 'Seleccionar imagen' }}
              </label>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="showCreateServiceModal = false">Cancelar</button>
            <button type="submit" class="btn-create" @click.prevent="isEditing ? updateService() : createService()">
              {{ isEditing ? "Guardar Cambios" : "Crear Servicio" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import axios from "axios";

export default defineComponent({
  name: "Servicios",
  components: {
    Navbar,
  },
  setup() {
    const isAdmin = ref(false);
    const services = ref([]);
    const showCreateServiceModal = ref(false);
    const isEditing = ref(false);
    const newService = ref({
      id_servicio: null,
      nombre: "",
      precio: "",
      imagen: null,
    });

    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:3000/servicios");
        services.value = response.data;
      } catch (error) {
        console.error("Error al cargar los servicios:", error);
      }
    };
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:3000/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const usuario = response.data.user;
        isAdmin.value = (usuario.rol === "ADMIN");
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };
    const handleImageUpload = (event: any) => {
      const file = event.target.files[0];
      newService.value.imagen = file;
    };
    const createService = async () => {
      try {
        const formData = new FormData();
        formData.append("nombre", newService.value.nombre);
        formData.append("precio", newService.value.precio);
        if (newService.value.imagen) {
          formData.append("imagen", newService.value.imagen);
        }

        const token = localStorage.getItem("token");
        const response = await axios.post("http://localhost:3000/services", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert(response.data.message);
        closeModal();
        fetchServices(); // Actualizar lista de servicios
      } catch (error) {
        console.error("Error al crear el servicio:", error);
        alert("Error al crear el servicio. Inténtalo nuevamente.");
      }
    };
    const editService = (service: any) => {
      newService.value = { ...service, imagen: null }; // Copia los datos del servicio
      isEditing.value = true; // Activar el modo edición
      showCreateServiceModal.value = true; // Mostrar el modal
    };

    const updateService = async () => {
      try {
        const formData = new FormData();
        formData.append("nombre", newService.value.nombre);
        formData.append("precio", newService.value.precio);
        if (newService.value.imagen) {
          formData.append("imagen", newService.value.imagen);
        }

        const token = localStorage.getItem("token");
        const response = await axios.put(
          `http://localhost:3000/servicios/${newService.value.id_servicio}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        alert(response.data.message);
        showCreateServiceModal.value = false;
        fetchServices(); // Recargar la lista de servicios
      } catch (error) {
        console.error("Error al actualizar el servicio:", error);
        alert("Error al actualizar el servicio. Inténtalo nuevamente.");
      }
    };

    const deleteService = async (id_servicio: number) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`http://localhost:3000/servicios/${id_servicio}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert(response.data.message);
        fetchServices();
      } catch (error) {
        console.error("Error al eliminar el servicio:", error);
        alert("Error al eliminar el servicio. Inténtalo nuevamente.");
      }
    };

    const closeModal = () => {
      showCreateServiceModal.value = false;
      isEditing.value = false;
      newService.value = {
        id_servicio: null,
        nombre: "",
        precio: "",
        imagen: null,
      };
    };
    onMounted(() => {
      fetchUser();
      fetchServices();
    });

    return {
      services,
      showCreateServiceModal,
      isEditing,
      newService,
      createService,
      handleImageUpload,
      editService,
      updateService,
      deleteService,
      closeModal,
      isAdmin
    };
  },
  filters: {
    currency(value: number) {
      return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "USD",
      }).format(value);
    },
  },
});
</script>

<style scoped>
.services-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #2d3748;
}

.create-button {
  background-color: #5561ff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(85, 97, 255, 0.2);
}

.create-button:hover {
  background-color: #404dcc;
  transform: translateY(-2px);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.service-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.image-container {
  position: relative;
  padding-top: 75%;
  width: 100%;
  background-color: #f5f5f5;
  overflow: hidden;
}

.service-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.service-actions {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.service-card:hover .service-actions {
  opacity: 1;
}

.action-button {
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.action-button.edit {
  background-color: #4299e1;
}

.action-button.edit:hover {
  background-color: #3182ce;
}

.action-button.delete {
  background-color: #e53e3e;
}

.action-button.delete:hover {
  background-color: #c53030;
}
.action-button.reservar {
    background-color: #48bb78 !important;
    color: white !important;
}

.service-info {
  padding: 1.5rem;
}

.service-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem;
}

.service-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #5561ff;
  margin: 0;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  z-index: 1001;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background-color: #f7fafc;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #4a5568;
}

.form-group input[type="text"],
.form-group input[type="number"] {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #5561ff;
  box-shadow: 0 0 0 3px rgba(85, 97, 255, 0.1);
}

.file-input-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #f7fafc;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-input-label:hover {
  border-color: #5561ff;
  color: #5561ff;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn-create,
.btn-cancel {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background-color: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.btn-cancel:hover {
  background-color: #edf2f7;
}

.btn-create {
  background-color: #5561ff;
  color: white;
  border: none;
}

.btn-create:hover {
  background-color: #404dcc;
}

@media (max-width: 640px) {
  .services-grid {
    grid-template-columns: 1fr;
    padding: 0.5rem;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .modal-actions button {
    width: 100%;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>