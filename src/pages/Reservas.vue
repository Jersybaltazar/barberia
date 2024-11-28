<template>
  <div>
    <Navbar />
    <div class="reservations-page">
      <h1>Reservas de Hoy</h1>
      <table class="reservations-table">
        <thead>
          <tr>
            <th>Número de Reserva</th>
            <th>Hora</th>
            <th>Barbero</th>
            <th>Servicio</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Productos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(reserva, index) in reservas" :key="index">
            <td>{{ reserva.id_reserva }}</td>
            <td>{{ reserva.hora_reserva }}</td>
            <td>{{ reserva.barbero }}</td>
            <td>{{ reserva.servicio }}</td>
            <td>{{ reserva.cliente }}</td>
            <td>
              <span :class="['status', reserva.estado.toLowerCase()]">{{ reserva.estado }}</span>
            </td>
            <td>
              <input type="checkbox" v-model="reserva.incluirProductos" /> Agregar Productos
            </td>
            <td>
              <div class="actions">
                <button class="action-button success" @click="finalizeReservation(reserva.id_reserva)">
                  Reserva Concretada
                </button>
                <button class="action-button cancel" @click="cancelReservation(reserva.id_reserva)">
                  Cancelar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal para mostrar el total y selección de productos -->
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h2>Resumen de la Reserva</h2>
          <p><strong>Servicio:</strong> {{ selectedReserva.servicio }} - {{ selectedReserva.servicioPrecio | currency }}
          </p>

          <div v-if="selectedReserva.incluirProductos">
            <h3>Selecciona productos adicionales:</h3>
            <div v-for="(product, index) in products" :key="index" class="product-selection">
              <input type="checkbox" :value="product.price" v-model="selectedProducts" />
              <span>{{ product.name }} - {{ product.price | currency }}</span>
            </div>
          </div>

          <p v-if="selectedReserva.incluirProductos"><strong>Total Productos:</strong> {{ productsTotal | currency }}
          </p>
          <p><strong>Total:</strong> {{ totalReserva | currency }}</p>

          <button class="confirm-button" @click="finalizeReservation">Reserva Concretada</button>
          <button class="close-button" @click="closeModal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import Navbar from '../components/Navbar.vue';
import axios from "axios";
export default defineComponent({
  name: 'Reservas',
  components: {
    Navbar,
  },
  setup() {
    const reservas = ref([]);

    const products = [
      { name: 'Gel de Peinado', price: 15 },
      { name: 'Crema para Afeitar', price: 10 },
      { name: 'Cera para el Cabello', price: 12 },
      { name: 'Aftershave', price: 8 },
      { name: 'Aceite para Barba', price: 18 },
    ];

    const showModal = ref(false);
    const selectedReserva = ref<any>({});
    const selectedProducts = ref<number[]>([]);

    const cargarReservas = async () => {
      try {
        const response = await axios.get("http://localhost:3000/reservas");
        reservas.value = response.data.map((reserva: any) => ({
          id_reserva: reserva.numero_reserva, // Asegúrate de que este campo exista
          hora_reserva: reserva.hora_reserva,
          barbero: reserva.barbero,
          servicio: reserva.servicio,
          cliente: reserva.cliente,
          estado: reserva.estado,
          incluirProductos: false,
        }));
        console.log(reservas.value); 
      } catch (error) {
        console.error("Error al cargar reservas:", error);
        alert("No se pudieron cargar las reservas.");
      }
    };
    const confirmReservation = (reserva: any) => {
      selectedReserva.value = reserva;
      selectedProducts.value = [];
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const productsTotal = computed(() => {
      return selectedProducts.value.reduce((sum, price) => sum + price, 0);
    });

    const totalReserva = computed(() => {
      return selectedReserva.value.servicioPrecio + productsTotal.value;
    });

    const finalizeReservation = async (id_reserva: number) => {
      if (!id_reserva) {
        console.error("ID de reserva no definido");
        alert("No se puede completar la reserva. ID no válido.");
        return;
      }

      try {
        await axios.put(`http://localhost:3000/reservas/${id_reserva}`, {
          estado: "COMPLETADA",
        });
        alert(`Reserva ${id_reserva} marcada como COMPLETADA.`);
        cargarReservas();
      } catch (error) {
        console.error("Error al completar la reserva:", error);
        alert("No se pudo completar la reserva.");
      }
    };

    const cancelReservation = async (id_reserva: number) => {
      if (!id_reserva) {
        console.error("ID de reserva no definido");
        alert("No se puede cancelar la reserva. ID no válido.");
        return;
      }
      try {
        await axios.put(`http://localhost:3000/reservas/${id_reserva}`, {
          estado: "CANCELADA",
        });
        alert(`Reserva ${id_reserva} cancelada.`);
        cargarReservas();
      } catch (error) {
        console.error("Error al cancelar la reserva:", error);
        alert("No se pudo cancelar la reserva.");
      }
    };
    cargarReservas();
    return {
      reservas,
      products,
      showModal,
      selectedReserva,
      selectedProducts,
      productsTotal,
      confirmReservation,
      closeModal,
      totalReserva,
      finalizeReservation,
      cancelReservation,
    };
  },
  filters: {
    currency(value: number) {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    },
  },
});
</script>

<style scoped>
.reservations-page {
  padding: 2rem;
  text-align: center;
}

.reservations-table {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
}

.reservations-table th,
.reservations-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.reservations-table th {
  background-color: #f5f5f5;
  font-weight: bold;
  text-align: center;
}

.status {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-weight: bold;
  color: #fff;
}

.status.pendiente {
  background-color: #ffc107;
  /* Amarillo */
}

.status.completada {
  background-color: #4caf50;
  /* Verde */
}

.status.cancelada {
  background-color: #f44336;
  /* Rojo */
}


.actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  padding: 0.5rem 1rem;
  border: 1px solid #333;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.action-button.success {
  background-color: #5561ff;
  color: white;
}

.action-button.success:hover {
  background-color: #404dcc;
}

.action-button.cancel {
  background-color: #ff6b6b;
  color: white;
}

.action-button.cancel:hover {
  background-color: #ff4b4b;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  text-align: left;
}

.close-button,
.confirm-button {
  background-color: #5561ff;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;
}

.close-button:hover,
.confirm-button:hover {
  background-color: #404dcc;
}

.product-selection {
  margin: 0.5rem 0;
}
</style>