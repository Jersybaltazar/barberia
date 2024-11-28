<template>
    <div>
        <Navbar />
        <div class="product-page">
            <h1>Productos de la Barbería</h1>
            <div class="product-grid">
                <div v-for="(product, index) in products" :key="index" class="product-card">
                    <img :src="product.imagen" alt="Imagen del producto" class="product-image" />
                    <div class="product-info">
                        <h2>{{ product.nombre }}</h2>
                        <p>{{ product.descripcion }}</p>
                        <p class="product-price">{{ product.precio | currency }}</p>
                        <button class="reserve-button" @click="addToCart(product)">Agregar al Carrito</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="cart">
            <h2>Carrito de Compras</h2>
            <div v-if="cart.length === 0">
                <p>El carrito está vacío.</p>
            </div>
            <div v-else>
                <table class="cart-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in cart" :key="index">
                            <td>{{ item.producto }}</td>
                            <td>{{ item.precio | currency }}</td>
                            <td>
                                <input
                                    type="number"
                                    v-model.number="item.cantidad"
                                    min="1"
                                    @change="updateCartItem(item)"
                                />
                            </td>
                            <td>{{ (item.precio * item.cantidad) | currency }}</td>
                            <td>
                                <button class="remove-button" @click="removeFromCart(item.id_carrito)">Eliminar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="cart-summary">
                    <h3>Total: {{ cartTotal | currency }}</h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import axios from 'axios';

export default defineComponent({
    name: 'ProductList',
    components: {
        Navbar,
    },
    setup() {
        const products = ref([]);
        const cart = ref([]);
        const id_cliente = 1; // Reemplázalo por el ID del cliente autenticado

        const loadProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/productos');
                products.value = response.data;
            } catch (error) {
                console.error('Error al cargar productos:', error);
            }
        };

        const loadCart = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/carrito/${id_cliente}`);
                cart.value = response.data;
            } catch (error) {
                console.error('Error al cargar carrito:', error);
            }
        };
        const addToCart = async (product) => {
            try {
                await axios.post('http://localhost:3000/carrito', {
                    id_cliente,
                    id_producto: product.id_producto,
                    cantidad: 1,
                });
                alert('Producto agregado al carrito.');
                loadCart(); // Actualizar el carrito
            } catch (error) {
                console.error('Error al agregar producto al carrito:', error);
                alert('No se pudo agregar el producto al carrito.');
            }
        };

        const removeFromCart = async (id_carrito) => {
            try {
                await axios.delete(`http://localhost:3000/carrito/${id_carrito}`);
                alert('Producto eliminado del carrito.');
                loadCart(); // Actualizar el carrito
            } catch (error) {
                console.error('Error al eliminar producto del carrito:', error);
                alert('No se pudo eliminar el producto del carrito.');
            }
        };
        const updateCartItem = async (item) => {
            try {
                await axios.post('http://localhost:3000/carrito', {
                    id_cliente,
                    id_producto: item.id_producto,
                    cantidad: item.cantidad,
                });
                loadCart(); // Actualizar el carrito
            } catch (error) {
                console.error('Error al actualizar el carrito:', error);
                alert('No se pudo actualizar el carrito.');
            }
        };
        const cartTotal = computed(() => {
            return cart.value.reduce((total, item) => total + item.precio * item.cantidad, 0);
        });
        onMounted(() => {
            loadProducts();
            loadCart();
        });
        return {
            products,
            cart,
            addToCart,
            removeFromCart,
            updateCartItem,
            cartTotal,
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
.product-page {
    padding: 2rem;
    text-align: center;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
}

.product-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    text-align: left;
    transition: transform 0.3s;
}

.product-card:hover {
    transform: scale(1.05);
}

.product-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
}

.product-info {
    padding: 1rem;
}

.product-info h2 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
}

.product-price {
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
.cart {
    margin-top: 2rem;
    padding: 2rem;
    border-top: 1px solid #ddd;
}

.cart-table {
    width: 100%;
    border-collapse: collapse;
}

.cart-table th,
.cart-table td {
    padding: 1rem;
    text-align: center;
    border: 1px solid #ddd;
}

.cart-summary {
    text-align: right;
    margin-top: 1rem;
    font-size: 1.2rem;
    font-weight: bold;
}

.remove-button {
    background-color: #ff6b6b;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.remove-button:hover {
    background-color: #e63939;
}
</style>
