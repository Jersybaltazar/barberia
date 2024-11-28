<template>
    <div>
      <Navbar />
      <div class="services-page">
        <h1>Servicios Disponibles</h1>
        <div class="services-grid">
          <div v-for="(service, index) in services" :key="index" class="service-card">
            <img :src="service.image" alt="Imagen del servicio" class="service-image" />
            <div class="service-info">
              <h2>{{ service.name }}</h2>
              <p>{{ service.description }}</p>
              <button class="reserve-button">Seleccionar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import Navbar from '../components/Navbar.vue';
  import Image1 from '../assets/image.png';
  
  export default defineComponent({
    name: 'Servicios',
    components: {
      Navbar,
    },
    setup() {
      const services = ref([
        {
          name: 'Corte de Cabello',
          description: 'Corte profesional para cualquier estilo.',
          price: 15,
          image: Image1,
        },
        {
          name: 'Afeitado Completo',
          description: 'Afeitado con navaja y tratamiento de piel.',
          price: 10,
          image: Image1,
        },
        {
          name: 'Corte y Afeitado',
          description: 'Paquete completo de corte de cabello y afeitado.',
          price: 20,
          image: Image1,
        },
        {
          name: 'Mascarilla Facial',
          description: 'Tratamiento facial relajante y revitalizante.',
          price: 12,
          image: Image1,
        },
        {
          name: 'Tratamiento Capilar',
          description: 'Hidratación y revitalización del cabello.',
          price: 18,
          image: Image1,
        },
        {
          name: 'Peinado',
          description: 'Peinado para eventos especiales.',
          price: 25,
          image: Image1,
        },
      ]);
  
      return {
        services,
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
  .services-page {
    padding: 2rem;
    text-align: center;
  }
  
  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
  }
  
  .service-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    text-align: left;
    transition: transform 0.3s;
  }
  
  .service-card:hover {
    transform: scale(1.05);
  }
  
  .service-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
  
  .service-info {
    padding: 1rem;
  }
  
  .service-info h2 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
  
  .service-price {
    font-weight: bold;
    color: #5561ff;
    margin-top: 0.5rem;
  }
  
  .reserve-button {
    background-color: #5561ff;
    color: #fff;
    padding: 0.5rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 0.5rem;
    width: 100%;
  }
  
  .reserve-button:hover {
    background-color: #404dcc;
  }
  </style>
  