<template>
    <div class="barber-page-container">
        <Navbar />
        <div class="barber-page">
            <div class="page-header">
                <h1>Barberos Disponibles</h1>
                <button class="create-button" v-if="isAdmin" @click="showCreateBarberModal = true">
                    Crear Barbero
                </button>
            </div>
            <div class="barber-grid">
                <div v-for="barber in barbers" :key="barber.id_barbero" class="barber-card">
                    <div class="image-container">
                        <img :src="barber.imagen || 'ruta_de_imagen_por_defecto.jpg'" alt="Foto del barbero"
                            class="barber-image" />


                        <div class="barber-actions">
                            <template v-if="isAdmin">
                                <button class="action-button edit" @click="editBarber(barber)">
                                    <i class="fas fa-edit"></i>
                                    Editar
                                </button>
                                <button class="action-button delete" @click="deleteBarber(barber.id_barbero)">
                                    <i class="fas fa-trash"></i>
                                    Eliminar
                                </button>
                            </template>
                            <template v-else>
                                <button class="action-button reservar" @click="reservarBarber(barber)">
                                    Reservar
                                </button>
                            </template>
                        </div>
                    </div>
                    <div class="barber-info">
                        <h2 class="barber-name">{{ barber.nombre }} {{ barber.apellido }}</h2>
                        <p class="barber-service">Servicio: {{ barber.id_servicio }}</p>
                        <p class="barber-schedule">Horario: {{ barber.horario }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showCreateBarberModal" class="modal">
            <div class="modal-backdrop" @click="showCreateBarberModal = false"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Crear Barbero</h2>
                    <button class="modal-close" @click="showCreateBarberModal = false">
                        <span>&times;</span>
                    </button>
                </div>

                <form @submit.prevent="isEditing ? updateBarber() : createBarber()" class="modal-form">
                    <div class="form-group">
                        <label for="nombre">Nombre</label>
                        <input type="text" id="nombre" v-model="newBarber.nombre" required />
                    </div>
                    <div class="form-group">
                        <label for="apellido">Apellido</label>
                        <input type="text" id="apellido" v-model="newBarber.apellido" required />
                    </div>
                    <div class="form-group">
                        <label for="telefono">Teléfono</label>
                        <input type="tel" id="telefono" v-model="newBarber.telefono" />
                    </div>
                    <div class="form-group">
                        <label for="id_servicio">Servicio</label>
                        <select v-model="newBarber.id_servicio" id="id_servicio" required>
                            <option v-for="service in services" :key="service.id_servicio" :value="service.id_servicio">
                                {{ service.nombre }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="horario">Horario</label>
                        <input type="text" id="horario" v-model="newBarber.horario" required />
                    </div>
                    <div class="form-group">
                        <label for="imagen">Imagen del Barbero</label>
                        <input type="file" @change="handleImageUpload" id="imagen" accept="image/*" />
                    </div>
                    <div class="modal-actions">
                        <button type="submit" class="btn-create">{{ isEditing ? "Guardar Cambios" : "Crear" }}</button>
                        <button type="button" class="btn-cancel" @click="closeModal">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
        <div v-if="showReservationModal" class="modal">
            <div class="modal-backdrop" @click="closeReservationModal"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Reservar Barbero</h2>
                    <button class="modal-close" @click="closeReservationModal">
                        <span>&times;</span>
                    </button>
                </div>
                <form @submit.prevent="createReservation" class="modal-form">
                    <div class="form-group">
                        <label for="fecha_hora">Fecha y Hora de la Reserva</label>
                        <input type="datetime-local" v-model="newReservation.fecha_hora" id="fecha_hora" required />
                    </div>
                    <div class="form-group">
                        <label for="estado">Estado de la Reserva</label>
                        <select v-model="newReservation.estado" id="estado" required>
                            <option value="PENDIENTE">PENDIENTE</option>
                            <option value="CONFIRMADA">CONFIRMADA</option>
                            <option value="CANCELADA">CANCELADA</option>
                        </select>
                    </div>

                    <div class="modal-actions">
                        <button type="button" class="btn-cancel" @click="closeReservationModal">Cancelar</button>
                        <button type="submit" class="btn-create">Reservar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import BarberList from "../components/BarberList.vue";
import BarberDetails from "../components/BarberDetails.vue";
import axios from "axios";

export default defineComponent({
    name: 'BarberPage',
    components: {
        Navbar,
        BarberList,
        BarberDetails,
    },
    setup() {
        const isAdmin = ref(false);
        const barbers = ref([]);
        const services = ref([]);
        const isEditing = ref(false);
        const showCreateBarberModal = ref(false);
        const newBarber = ref({
            nombre: "",
            apellido: "",
            telefono: "",
            id_servicio: null,
            horario: "",
            imagen: null,
        });
        const user = ref({
            id_cliente: null,
            rol: "",
            nombre: "",
            apellido: ""
        });
        const showReservationModal = ref(false);
        const selectedBarberId = ref(null);
        const newReservation = ref({
            id_cliente: null,
            id_barbero: null,
            fecha_hora: "",
            estado: "PENDIENTE"
        });

        const handleImageUpload = (event: any) => {
            const file = event.target.files[0];
            newBarber.value.imagen = file;
            console.log("Archivo seleccionado:", file);
        };

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
                user.value = usuario;
                isAdmin.value = (usuario.rol === "ADMIN");
            } catch (error) {
                console.error("Error al obtener el usuario:", error);
            }
        };
        const fetchBarbers = async () => {
            try {
                const response = await axios.get("http://localhost:3000/barberos");
                barbers.value = response.data;
            } catch (error) {
                console.error("Error al cargar los barberos:", error);
            }
        };

        const createBarber = async () => {
            try {
                const formData = new FormData();
                formData.append("nombre", newBarber.value.nombre);
                formData.append("apellido", newBarber.value.apellido);
                formData.append("telefono", newBarber.value.telefono);
                formData.append("id_servicio", newBarber.value.id_servicio as any);
                formData.append("horario", newBarber.value.horario);
                if (newBarber.value.imagen) {
                    formData.append("imagen", newBarber.value.imagen);
                }

                const response = await axios.post("http://localhost:3000/barberos", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                alert("Barbero creado exitosamente.");
                fetchBarbers();
                showCreateBarberModal.value = false;
            } catch (error) {
                console.error("Error al crear el barbero:", error);
                alert("Error al crear el barbero.");
            }
        };

        const editBarber = (barber: any) => {
            // Precargar los datos del barbero en el formulario del modal
            newBarber.value = {
                id_barbero: barber.id_barbero, // Importante para identificar al barbero en el backend
                nombre: barber.nombre,
                apellido: barber.apellido,
                telefono: barber.telefono,
                id_servicio: barber.id_servicio,
                horario: barber.horario,
                imagen: null, // La imagen no se precarga como archivo, pero puedes mostrar una vista previa si es necesario
            };
            showCreateBarberModal.value = true; // Mostrar el modal
            isEditing.value = true; // Activar modo edición
        };

        const updateBarber = async () => {
            try {
                const formData = new FormData();
                formData.append("nombre", newBarber.value.nombre);
                formData.append("apellido", newBarber.value.apellido);
                formData.append("telefono", newBarber.value.telefono);
                formData.append("id_servicio", newBarber.value.id_servicio);
                formData.append("horario", newBarber.value.horario);

                if (newBarber.value.imagen) {
                    formData.append("imagen", newBarber.value.imagen);
                }

                const response = await axios.put(
                    `http://localhost:3000/barberos/${newBarber.value.id_barbero}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                alert(response.data.message);
                fetchBarbers(); // Recargar la lista de barberos
                closeModal(); // Cerrar el modal
            } catch (error) {
                console.error("Error al actualizar el barbero:", error);
                alert("Error al actualizar el barbero. Inténtalo nuevamente.");
            }
        };


        const closeModal = () => {
            showCreateBarberModal.value = false;
            isEditing.value = false;
            newBarber.value = {
                id_barbero: null,
                nombre: "",
                apellido: "",
                telefono: "",
                id_servicio: null,
                horario: "",
                imagen: null,
            };
        };



        const deleteBarber = async (id_barbero: any) => {
            if (!confirm("¿Estás seguro de que deseas eliminar este barbero?")) {
                return; // Si el usuario cancela, no se realiza la acción
            }

            try {
                const response = await axios.delete(`http://localhost:3000/barberos/${id_barbero}`);
                alert(response.data.message);
                fetchBarbers(); // Recargar la lista de barberos después de eliminar
            } catch (error) {
                console.error("Error al eliminar el barbero:", error);
                alert("Error al eliminar el barbero. Inténtalo nuevamente.");
            }
        };
        const reservarBarber = (barber: any) => {
            // Guardamos el id del barbero seleccionado y abrimos el modal de reserva
            selectedBarberId.value = barber.id_barbero;
            newReservation.value = {
                id_cliente: user.value.cliente.id_cliente,
                id_barbero: barber.id_barbero,
                fecha_hora: "",
                estado: "PENDIENTE"
            };
            showReservationModal.value = true;
        };

        const closeReservationModal = () => {
            showReservationModal.value = false;
            newReservation.value = {
                id_cliente: user.value.id_cliente,
                id_barbero: selectedBarberId.value,
                fecha_hora: "",
                estado: "PENDIENTE"
            };
        };

        const createReservation = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.post("http://localhost:3000/reservas", newReservation.value, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                alert("Reserva creada exitosamente.");
                closeReservationModal();
            } catch (error) {
                console.error("Error al crear la reserva:", error);
                alert("Error al crear la reserva. Inténtalo nuevamente.");
            }
        };

        onMounted(() => {
            fetchServices();
            fetchBarbers();
            fetchUser()
        });

        return {
            barbers,
            services,
            isEditing,
            showCreateBarberModal,
            newBarber,
            createBarber,
            handleImageUpload,
            deleteBarber,
            editBarber,
            updateBarber,
            closeModal,
            isAdmin,
            user,
            reservarBarber,
            showReservationModal,
            newReservation,
            createReservation,
            closeReservationModal
        };
    },
});
</script>

<style scoped>
.barber-page {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.barber-page-container {
    min-height: 100vh;
    background-color: #f4f4f8;
}

.action-button.reservar {
    background-color: #48bb78;
    color: white;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.create-button {
    background-color: #5561ff;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.create-button:hover {
    background-color: #404dcc;
}

.barber-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}

.barber-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.barber-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.image-container {
    position: relative;
    padding-top: 75%;
    background-color: #f5f5f5;
    overflow: hidden;
}

.barber-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
}


.barber-actions {
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

.barber-card:hover .barber-actions {
    opacity: 1;
}

.action-button {
    padding: 0.75rem 1.25rem;
    border-radius: 6px;
    color: white;
    cursor: pointer;
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

.barber-info {
    padding: 1.5rem;
    text-align: center;
}

.barber-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 0.5rem;
}

.barber-service,
.barber-schedule {
    font-size: 0.9rem;
    color: #4a5568;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    border-radius: 12px;
    width: 500px;
    max-width: 90%;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f0f0f5;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
    margin: 0;
    color: #333;
    font-size: 1.25rem;
}

.modal-close {
    background: none;
    border: none;
    font-size: 2rem;
    color: #999;
    cursor: pointer;
    transition: color 0.3s ease;
}

.modal-close:hover {
    color: #333;
}

.modal-form {
    padding: 1.5rem;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #555;
    font-weight: 500;
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    transition: border-color 0.3s ease;
}

.form-group input:focus {
    outline: none;
    border-color: #5561ff;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
}

.btn-cancel {
    background-color: #f0f0f5;
    color: #555;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn-create {
    background-color: #5561ff;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn-cancel:hover {
    background-color: #e0e0e5;
}

.btn-create:hover {
    background-color: #404dcc;
}

.barber-content {
    display: flex;
    gap: 2rem;
    justify-content: center;
}
</style>
