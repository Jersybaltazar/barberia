<template>
    <div>
        <Navbar />
        <div class="date-time-page">
            <!-- Contenedor de la selección de fecha y horario -->
            <div class="date-time-selection">
                <h1>Selecciona Fecha y Hora</h1>
                
                <!-- Selector de Fecha -->
                <div class="date-picker">
                    <input type="date" v-model="selectedDate" />
                    <button class="calendar-button">
                        <font-awesome-icon icon="calendar-alt" />
                    </button>
                </div>

                <!-- Selector de Hora -->
                <div class="time-slots">
                    <button
                        v-for="(time, index) in availableTimes"
                        :key="index"
                        :class="['time-slot', { selected: selectedTime === time }]"
                        @click="selectTime(time)"
                    >
                        {{ time }}
                    </button>
                </div>
            </div>

            <!-- Resumen de Reserva -->
            <div class="reservation-summary">
                <h2>{{ barber.name }}</h2>
                <p><strong>Ubicación:</strong> {{ barber.location }}</p>
                <p><strong>Calificación:</strong> {{ barber.rating }} ★</p>
                
                <div class="reservation-detail">
                    <p><strong>Paquete:</strong> Regular</p>
                    <p><strong>Total Servicio:</strong> IDR 30,000</p>
                </div>

                <!-- Selección de Productos -->
                <div v-if="products.length" class="product-selection">
                    <h3>Productos Adicionales:</h3>
                    <div v-for="(product, index) in products" :key="index" class="product-item">
                        <input 
                            type="checkbox" 
                            :value="product.price" 
                            v-model="selectedProducts" 
                        />
                        <label>{{ product.name }} - {{ product.price | currency }}</label>
                    </div>
                </div>

                <p><strong>Total Productos:</strong> {{ productsTotal | currency }}</p>
                <p><strong>Total Reserva:</strong> {{ totalReserva | currency }}</p>

                <button 
                    class="reserve-button" 
                    :disabled="!selectedDate || !selectedTime"
                    @click="confirmReservation"
                >
                    Confirmar Reserva
                </button>
            </div>
        </div>

        <!-- Diálogo de confirmación -->
        <div v-if="showConfirmationDialog" class="confirmation-dialog">
            <div class="dialog-content">
                <h3>Reserva Exitosa</h3>
                <p>La reserva ha sido confirmada para el {{ selectedDate }} a las {{ selectedTime }}.</p>
                <button @click="closeDialog" class="close-button">Cerrar</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import Navbar from '../components/Navbar.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useRoute } from 'vue-router';

export default defineComponent({
    name: 'DateAndTimeSelection',
    components: {
        Navbar,
        FontAwesomeIcon,
    },
    setup() {
        const route = useRoute();
        const barber = ref(JSON.parse(route.query.barber as string) || { name: '', location: '', rating: 0 });

        const selectedDate = ref('');
        const selectedTime = ref('');
        const selectedProducts = ref<number[]>([]);

        const availableTimes = [
            "10:00", "10:45", "11:30", "12:15", "13:00",
            "13:45", "14:30", "15:15", "16:00", "16:45",
            "17:30", "18:15", "19:00", "19:45", "20:30"
        ];

        const products = [
            { name: 'Gel de Peinado', price: 15 },
            { name: 'Crema para Afeitar', price: 10 },
            { name: 'Cera para el Cabello', price: 12 },
            { name: 'Aftershave', price: 8 },
            { name: 'Aceite para Barba', price: 18 },
        ];

        const selectTime = (time: string) => {
            selectedTime.value = time;
        };

        const productsTotal = computed(() => {
            return selectedProducts.value.reduce((sum, price) => sum + price, 0);
        });

        const totalReserva = computed(() => {
            return 30000 + productsTotal.value; // 30,000 es el precio del servicio base
        });

        const showConfirmationDialog = ref(false);

        const confirmReservation = () => {
            if (selectedDate.value && selectedTime.value) {
                showConfirmationDialog.value = true;
            }
        };

        const closeDialog = () => {
            showConfirmationDialog.value = false;
        };

        return {
            barber,
            selectedDate,
            selectedTime,
            availableTimes,
            selectTime,
            products,
            selectedProducts,
            productsTotal,
            totalReserva,
            confirmReservation,
            showConfirmationDialog,
            closeDialog,
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
.date-time-page {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    padding: 2rem;
}

.date-time-selection {
    max-width: 600px;
}

.date-picker {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.date-picker input[type="date"] {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
}

.calendar-button {
    background-color: #5561ff;
    color: white;
    padding: 0.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.time-slots {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
}

.time-slot {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

.time-slot.selected {
    background-color: #5561ff;
    color: white;
}

.reservation-summary {
    border: 1px solid #ddd;
    padding: 1.5rem;
    border-radius: 8px;
    width: 280px;
    text-align: left;
}

.reservation-summary h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

.reservation-summary p {
    margin: 0.5rem 0;
}

.reservation-detail {
    border-top: 1px solid #ddd;
    margin-top: 1rem;
    padding-top: 1rem;
}

.product-selection {
    margin-top: 1rem;
}

.product-item {
    margin: 0.5rem 0;
    display: flex;
    align-items: center;
}

.reserve-button {
    background-color: #5561ff;
    color: #fff;
    padding: 0.75rem;
    font-size: 1rem;
    width: 100%;
    border-radius: 8px;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s;
    margin-top: 1rem;
}

.reserve-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.reserve-button:hover:enabled {
    background-color: #404dcc;
}

/* Estilos para el diálogo de confirmación */
.confirmation-dialog {
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

.dialog-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    max-width: 400px;
    width: 80%;
}

.close-button {
    background-color: #5561ff;
    color: #fff;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 1rem;
}

.close-button:hover {
    background-color: #404dcc;
}
</style>
