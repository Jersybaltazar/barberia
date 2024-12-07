<template>
  <div class="barber-list">
    <h2>Nuestros Barberos</h2>
    <div class="barber-cards">
      <div class="barber-card" v-for="barber in barbers" :key="barber.id_barbero" @click="selectBarber(barber)">
        <img :src="barber.imagen" alt="Foto del Barbero" class="barber-image" />
        <p>{{ barber.nombre }} {{ barber.apellido }}</p>
        <p>{{ barber.especialidad }}</p>
        <p>{{ barber.horario }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BarberList',
  props: {
    barbers: Array, 
  },
  emits: ['barberSelected'],
  methods: {
    selectBarber(barber:any) {
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
    width: 180px; /* Incrementa un poco el tamaño para más espacio */
    text-align: center;
    transition: transform 0.3s;
}


.barber-card:hover {
  transform: scale(1.05);
}

.barber-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover; /* Esto asegura que no se deformen */
    margin-bottom: 0.5rem;
}

</style>
