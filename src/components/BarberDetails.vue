<template>
    <div class="barber-details">
        <h2>{{ selectedBarber.nombre }} {{ selectedBarber.apellido }}</h2>
        <h3>Servicios Disponibles</h3>
        <ul>
            <li v-for="(service, index) in selectedBarber.services" :key="index">
                <input type="checkbox" :value="service" v-model="selectedServices" id="service-{{ index }}" />
                <label :for="'service-' + index">
                    {{ service.nombre }} - {{ service.precio | currency }}
                </label>
            </li>
        </ul>
        <p v-if="!selectedBarber.services || !selectedBarber.services.length">
            No hay servicios disponibles para este barbero.
        </p>
        <button @click="proceedToReservation" class="reserve-button" :disabled="!selectedServices.length">
            Reservar {{ selectedBarber.nombre }}
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
    name: "BarberDetails",
    props: {
        selectedBarber: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const selectedServices = ref([]);
        const router = useRouter();

        const proceedToReservation = () => {
            if (selectedServices.value.length > 0) {
                router.push({
                    name: "DateAndTimeSelection",
                    query: {
                        barber: JSON.stringify(props.selectedBarber),
                        services: JSON.stringify(selectedServices.value),
                    },
                });
            } else {
                alert("Por favor selecciona al menos un servicio para continuar.");
            }
        };

        return {
            selectedServices,
            proceedToReservation,
        };
    },
    filters: {
        currency(value: any) {
            return new Intl.NumberFormat("es-PE", {
                style: "currency",
                currency: "PEN",
            }).format(value);
        },
    },
});
</script>

<style scoped>
.barber-details {
    border: 1px solid #ddd;
    padding: 2rem;
    border-radius: 8px;
    width: 300px;
    text-align: left;
}

.reserve-button {
    background-color: #5561ff;
    color: #fff;
    padding: 0.75rem;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s;
    margin-top: 1rem;
}

.reserve-button:disabled {
    background-color: #aaa;
    cursor: not-allowed;
}

.reserve-button:hover:enabled {
    background-color: #404dcc;
}
</style>