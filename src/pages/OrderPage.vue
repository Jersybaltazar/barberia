<template>
    <div>
      <Navbar />
      <div class="orders-page">
        <h1>Órdenes</h1>
        <table class="orders-table">
          <thead>
            <tr>
              <th>ID Cliente</th>
              <th>Producto (cantidad) - precio</th>
              <th>Total por línea</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(orden, index) in ordenes" :key="index">
              <!-- Iteramos sobre cada producto de la orden -->
              <tr v-for="(producto, pIndex) in orden.productos" :key="pIndex">
                <td>{{ orden.id_cliente }}</td>
                <td>{{ producto.nombre }} (x{{ producto.cantidad }}) - {{ producto.precio | currency }}</td>
                <!-- Mostramos el subtotal por línea (precio * cantidad) -->
                <td>{{ (producto.precio * producto.cantidad) | currency }}</td>
              </tr>
              <!-- Después de listar todos los productos, agregamos una fila para el total de la orden -->
              <tr>
                <td colspan="2" style="text-align: right; font-weight: bold;">Total de la orden:</td>
                <td>{{ calcularTotal(orden.productos) | currency }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import Navbar from '../components/Navbar.vue';
  import axios from 'axios';
  
  export default defineComponent({
    name: 'Ordenes',
    components: {
      Navbar,
    },
    setup() {
      const ordenes = ref<any[]>([]);
      const isAdmin = ref(false);
      const user = ref<any>({});
  
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
  
      const cargarOrdenes = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get("http://localhost:3000/ordenes", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          // La respuesta se asume en la forma [{ id_cliente, productos: [ {...}, {...} ] }, ...]
          ordenes.value = response.data;
        } catch (error) {
          console.error("Error al cargar órdenes:", error);
          alert("No se pudieron cargar las órdenes.");
        }
      };
  
      const calcularTotal = (productos: any[]) => {
        return productos.reduce((sum, prod) => sum + (prod.precio * prod.cantidad), 0);
      };
  
      onMounted(async () => {
        await fetchUser();
        await cargarOrdenes();
      });
  
      return {
        ordenes,
        isAdmin,
        user,
        calcularTotal
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
  .orders-page {
    padding: 2rem;
    text-align: center;
  }
  
  .orders-table {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    border-collapse: collapse;
    font-family: Arial, sans-serif;
  }
  
  .orders-table th,
  .orders-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
    vertical-align: top;
  }
  
  .orders-table th {
    background-color: #f5f5f5;
    font-weight: bold;
    text-align: center;
  }
  </style>
  