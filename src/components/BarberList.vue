<template>
    <div class="barber-list">
        <h2>Barberos Disponibles</h2>
        <div class="barber-cards">
            <div
                class="barber-card"
                v-for="barber in barbers"
                :key="barber.id"
                @click="selectBarber(barber)"
            >
                <img :src="barber.image" alt="Foto del Barbero" class="barber-image" />
                <p>{{ barber.name }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'BarberList',
    props: {
        barbers: Array, // Array de barberos pasado desde el componente padre
    },
    emits: ['barberSelected'],
    methods: {
        selectBarber(barber) {
            this.$emit('barberSelected', barber);
        },
    },
});
</script>

<style scoped>
.barber-list {
    padding: 2rem;
    text-align: center;
}

.barber-cards {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
}

.barber-card {
    cursor: pointer;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    width: 150px;
    text-align: center;
    transition: transform 0.3s;
}

.barber-card:hover {
    transform: scale(1.05);
}

.barber-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-bottom: 0.5rem;
}
</style>
