<template>
    <div>
        <Navbar />
        <div class="barber-page">
            <h1>Elige tu Barbero</h1>
            <div class="barber-content">
                <!-- Muestra la lista de barberos -->
                <BarberList :barbers="barbers" @barberSelected="viewBarberDetails" />
                
                <!-- Muestra los detalles del barbero seleccionado junto a la lista -->
                <BarberDetails v-if="selectedBarber" :selectedBarber="selectedBarber" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Navbar from '../components/Navbar.vue';
import BarberList from '../components/BarberList.vue';
import BarberDetails from '../components/BarberDetails.vue';
import barber1 from '../assets/Ellipse15.png';
import barber2 from '../assets/Ellipse16.png';
import barber3 from '../assets/Ellipse17.png';

export default defineComponent({
    name: 'BarberPage',
    components: {
        Navbar,
        BarberList,
        BarberDetails,
    },
    setup() {
        const barbers = ref([
            {
                id: 1,
                name: 'Carlos',
                location: 'Centro, Ciudad',
                rating: 4.8,
                image: barber1,
                services: [
                    { name: 'Corte Clásico', price: 30 },
                    { name: 'Afeitado Completo', price: 20 },
                ],
            },
            {
                id: 2,
                name: 'Ana',
                location: 'Norte, Ciudad',
                rating: 4.5,
                image: barber2,
                services: [
                    { name: 'Corte Moderno', price: 35 },
                    { name: 'Arreglo de Barba', price: 25 },
                ],
            },
            {
                id: 3,
                name: 'Luis',
                location: 'Sur, Ciudad',
                rating: 4.7,
                image: barber3,
                services: [
                    { name: 'Corte Juvenil', price: 28 },
                    { name: 'Corte de Estilo', price: 40 },
                ],
            },
        ]);

        const selectedBarber = ref(null);

        const viewBarberDetails = (barber) => {
            selectedBarber.value = barber;
        };

        return {
            barbers,
            selectedBarber,
            viewBarberDetails,
        };
    },
});
</script>

<style scoped>
.barber-page {
    padding: 2rem;
    text-align: center;
}

.barber-content {
    display: flex;
    gap: 2rem;
    justify-content: center;
}

.back-button {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background-color: #5561ff;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
}

.back-button:hover {
    background-color: #404dcc;
}
</style>
