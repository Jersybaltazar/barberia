<template>
    <div>
      <h1>Crear Servicio</h1>
      <form @submit.prevent="createService">
        <div>
          <label for="nombre">Nombre del Servicio</label>
          <input type="text" v-model="newService.nombre" id="nombre" required />
        </div>
        <div>
          <label for="precio">Precio</label>
          <input type="number" v-model="newService.precio" id="precio" required />
        </div>
        <div>
          <label for="barbero">Asignar a Barbero (opcional)</label>
          <select v-model="newService.id_barbero">
            <option value="" disabled>Seleccione un barbero</option>
            <option v-for="barber in barbers" :key="barber.id_barbero" :value="barber.id_barbero">
              {{ barber.nombre }} {{ barber.apellido }}
            </option>
          </select>
        </div>
        <button type="submit">Crear Servicio</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        newService: {
          nombre: "",
          precio: "",
          id_barbero: null,
        },
        barbers: [],
      };
    },
    methods: {
      async fetchBarbers() {
        try {
          const response = await axios.get("http://localhost:3000/barbers");
          this.barbers = response.data;
        } catch (error) {
          console.error("Error al obtener los barberos:", error);
        }
      },
      async createService() {
        try {
          const response = await axios.post("http://localhost:3000/services", this.newService);
          alert(response.data.message);
          this.newService = { nombre: "", precio: "", id_barbero: null }; // Limpiar formulario
        } catch (error) {
          console.error("Error al crear servicio:", error);
          alert("Error al crear servicio.");
        }
      },
    },
    mounted() {
      this.fetchBarbers();
    },
  };
  </script>
  