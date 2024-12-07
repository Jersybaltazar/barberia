<template>
    <div>
        <Navbar />
        <div class="product-page">
            <div class="page-header">
                <h1>Productos de la Barbería</h1>
                <button class="create-button" v-if="isAdmin" @click="openCreateModal">Crear Producto</button>
                <button class="reserve-button" v-if="!isAdmin" @click="showCart">
                    Ver Carrito ({{ cart.length }})
                </button>
            </div>
            <div class="product-grid">
                <div v-for="(product, index) in products" :key="index" class="product-card">
                    <div class="image-container">
                        <img :src="product.imagen" alt="Imagen del producto" class="product-image" />

                        <div class="product-actions">
                            <template v-if="isAdmin">
                                <button class="action-button edit" @click="editProduct(product)">
                                    <i class="fas fa-edit"></i> Editar
                                </button>
                                <button class="action-button delete" @click="deleteProduct(product.id_producto)">
                                    <i class="fas fa-trash"></i> Eliminar
                                </button>
                            </template>
                            <template v-else>
                                <button class="action-button buy" @click="buyProduct(product)">
                                    Comprar
                                </button>
                            </template>
                        </div>

                    </div>
                    <div class="product-info">
                        <h2 class="product-title">{{ product.nombre }}</h2>
                        <p class="product-description">{{ product.descripcion }}</p>
                        <p class="product-price">{{ product.precio | currency }}</p>
                        <p class="product-stock">Stock: {{ product.stock }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal para crear/editar producto -->
        <div v-if="showCreateProductModal" class="modal">
            <div class="modal-backdrop" @click="closeModal"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>{{ isEditing ? 'Editar Producto' : 'Crear Producto' }}</h2>
                    <button class="modal-close" @click="closeModal">
                        <span>&times;</span>
                    </button>
                </div>
                <form @submit.prevent="isEditing ? updateProduct() : createProduct()" class="modal-form">
                    <div class="form-group">
                        <label for="nombre">Nombre del Producto</label>
                        <input type="text" v-model="newProduct.nombre" id="nombre" required />
                    </div>
                    <div class="form-group">
                        <label for="descripcion">Descripción</label>
                        <textarea v-model="newProduct.descripcion" id="descripcion" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="precio">Precio</label>
                        <input type="number" v-model="newProduct.precio" id="precio" step="0.01" required />
                    </div>
                    <div class="form-group">
                        <label for="stock">Stock</label>
                        <input type="number" v-model="newProduct.stock" id="stock" required />
                    </div>
                    <div class="form-group">
                        <label for="imagen">Imagen del Producto</label>
                        <div class="file-input-container">
                            <input type="file" @change="handleImageUpload" id="imagen" accept="image/*"
                                class="file-input" />
                            <label for="imagen" class="file-input-label">
                                Seleccionar imagen
                            </label>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-cancel" @click="closeModal">Cancelar</button>
                        <button type="submit" class="btn-create">
                            {{ isEditing ? "Guardar Cambios" : "Crear Producto" }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <!-- Modal del Carrito -->
        <div v-if="showCartModal" class="modal">
            <div class="modal-backdrop" @click="closeCart"></div>
            <div class="modal-content">
                <h2>Carrito de Compras</h2>
                <div v-if="cart.length === 0">
                    <p>Tu carrito está vacío.</p>
                </div>
                <div v-else>
                    <ul>
                        <li v-for="item in cart" :key="item.id_producto">
                            {{ item.nombre }} - {{ item.precio | currency }} x {{ item.quantity }}
                            <button @click="decrementQuantity(item)">-</button>
                            <button @click="incrementQuantity(item)">+</button>
                            <button @click="removeFromCart(item.id_producto)">Eliminar</button>
                        </li>
                    </ul>
                    <p><strong>Total:</strong> {{ cartTotal | currency }}</p>
                    <button @click="checkout">Comprar</button>
                </div>
                <button class="close-button" @click="closeCart">Cerrar</button>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import Navbar from '../components/Navbar.vue';
import axios from 'axios';

export default defineComponent({
    name: 'ProductList',
    components: {
        Navbar,
    },
    setup() {
        const isAdmin = ref(false);
        const products = ref([]);
        const isEditing = ref(false);
        const showCreateProductModal = ref(false);
        const newProduct = ref({
            id_producto: null,
            nombre: "",
            descripcion: "",
            precio: null,
            stock: null,
            imagen: null,
        });
        const cart = ref([]);
        const showCartModal = ref(false);

        const handleImageUpload = (event: any) => {
            const file = event.target.files[0];
            newProduct.value.imagen = file;
        };

        const loadProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/productos');
                products.value = response.data;
            } catch (error) {
                console.error('Error al cargar productos:', error);
            }
        };
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
                isAdmin.value = (usuario.rol === "ADMIN");
            } catch (error) {
                console.error("Error al obtener el usuario:", error);
            }
        };
        const openCreateModal = () => {
            isEditing.value = false;
            showCreateProductModal.value = true;
            newProduct.value = {
                id_producto: null,
                nombre: "",
                descripcion: "",
                precio: null,
                stock: null,
                imagen: null,
            };
        };

        const createProduct = async () => {
            try {
                const formData = new FormData();
                formData.append("nombre", newProduct.value.nombre);
                formData.append("descripcion", newProduct.value.descripcion);
                formData.append("precio", newProduct.value.precio as any);
                formData.append("stock", newProduct.value.stock as any);
                if (newProduct.value.imagen) {
                    formData.append("imagen", newProduct.value.imagen);
                }

                const token = localStorage.getItem("token");
                await axios.post("http://localhost:3000/productos", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                alert("Producto creado exitosamente");
                loadProducts();
                closeModal();
            } catch (error) {
                console.error("Error al crear el producto:", error);
                alert("Error al crear el producto. Inténtalo nuevamente.");
            }
        };

        const editProduct = (product: any) => {
            isEditing.value = true;
            showCreateProductModal.value = true;
            newProduct.value = { ...product, imagen: null }; // Mantener la imagen actual y permitir cargar una nueva
        };

        const updateProduct = async () => {
            try {
                const formData = new FormData();
                formData.append("nombre", newProduct.value.nombre);
                formData.append("descripcion", newProduct.value.descripcion);
                formData.append("precio", newProduct.value.precio);
                formData.append("stock", newProduct.value.stock);
                if (newProduct.value.imagen) {
                    formData.append("imagen", newProduct.value.imagen);
                }

                const token = localStorage.getItem("token");
                await axios.put(
                    `http://localhost:3000/productos/${newProduct.value.id_producto}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                alert("Producto actualizado exitosamente");
                loadProducts();
                closeModal();
            } catch (error) {
                console.error("Error al actualizar el producto:", error);
                alert("Error al actualizar el producto. Inténtalo nuevamente.");
            }
        };
        const deleteProduct = async (id_producto: number) => {
            const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este producto?");
            if (!confirmDelete) return;

            try {
                const token = localStorage.getItem("token");
                await axios.delete(`http://localhost:3000/productos/${id_producto}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert("Producto eliminado exitosamente.");
                loadProducts();
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
                alert("Error al eliminar el producto. Inténtalo nuevamente.");
            }
        };
        const closeModal = () => {
            showCreateProductModal.value = false;
            isEditing.value = false;
            newProduct.value = {
                id_producto: null,
                nombre: "",
                descripcion: "",
                precio: null,
                stock: null,
                imagen: null,
            };
        };


        const buyProduct = (product: any) => {
            // Verificamos si el producto ya está en el carrito
            const existingItem = cart.value.find((item: any) => item.id_producto === product.id_producto);
            if (existingItem) {
                existingItem.quantity += 1; // Si ya existe, incrementamos la cantidad
            } else {
                // Si no existe, lo agregamos con cantidad 1
                cart.value.push({ ...product, quantity: 1 });
            }
            alert("Producto agregado al carrito");
        };

        // Computed para calcular el total del carrito
        const cartTotal = computed(() => {
            return cart.value.reduce((sum: number, item: any) => sum + (item.precio * item.quantity), 0);
        });

        const showCart = () => {
            showCartModal.value = true;
        };

        const closeCart = () => {
            showCartModal.value = false;
        };

        // Función para eliminar un producto del carrito
        const removeFromCart = (id_producto: number) => {
            cart.value = cart.value.filter((item: any) => item.id_producto !== id_producto);
        };
        const incrementQuantity = (item: any) => {
            item.quantity += 1;
        };

        const decrementQuantity = (item: any) => {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                // Si la cantidad llega a 0, removemos el producto
                removeFromCart(item.id_producto);
            }
        };
        const checkout = async () => {
            try {
                const token = localStorage.getItem("token");
                const orderData = {
                    productos: cart.value.map(item => ({ id_producto: item.id_producto, quantity: item.quantity })),
                    total: cartTotal.value
                };

                const response = await axios.post("http://localhost:3000/ordenes", orderData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Supongamos que el backend te envía algo como:
                // { message: "Orden creada exitosamente.", comprobante: "base64delpdf..." }
                const { comprobante } = response.data;

                if (comprobante) {
                    // Convertir base64 a Blob
                    const pdfBlob = base64ToBlob(comprobante, "application/pdf");
                    // Crear una URL temporal para el blob
                    const pdfUrl = URL.createObjectURL(pdfBlob);

                    // Opción 1: Abrir una nueva ventana o pestaña con el PDF
                    // window.open(pdfUrl, '_blank');

                    // Opción 2: Forzar la descarga del PDF
                    const a = document.createElement("a");
                    a.href = pdfUrl;
                    a.download = "comprobante.pdf";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(pdfUrl);

                    alert("Compra realizada con éxito. Tu comprobante se ha descargado.");
                } else {
                    alert("Compra realizada con éxito, pero no se recibió comprobante.");
                }

                // Limpiamos el carrito
                cart.value = [];
                closeCart();
            } catch (error) {
                console.error("Error al crear la orden:", error);
                alert("No se pudo realizar la compra.");
            }
        };

        // Función auxiliar para convertir base64 a Blob
        function base64ToBlob(base64, mimeType) {
            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            return new Blob([byteArray], { type: mimeType });
        }
        // Función para vaciar el carrito
        const clearCart = () => {
            cart.value = [];
            alert("Carrito vaciado");
        };

        onMounted(async () => {
            await fetchUser();   // Primero obtenemos el rol del usuario
            await loadProducts(); // Luego cargamos los productos
        });

        return {
            products,
            showCreateProductModal,
            isEditing,
            newProduct,
            openCreateModal,
            createProduct,
            editProduct,
            updateProduct,
            deleteProduct,
            closeModal,
            handleImageUpload,
            isAdmin,
            cart,
            buyProduct,
            showCartModal,
            showCart,
            closeCart,
            removeFromCart,
            clearCart,
            cartTotal,
            incrementQuantity,
            decrementQuantity,
            checkout
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
    max-width: 1200px;
    margin: 0 auto;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding: 0 1rem;
}

.page-header h1 {
    font-size: 2rem;
    color: #333;
}

.create-button {
    background-color: #5561ff;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    box-shadow: 0 4px 6px rgba(85, 97, 255, 0.2);
}

.create-button:hover {
    background-color: #404dcc;
    transform: translateY(-2px);
}

.product-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    position: relative;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.image-container {
    position: relative;
    padding-top: 75%;
    width: 100%;
    background-color: #f5f5f5;
    overflow: hidden;
}

.product-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.product-actions {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.product-card:hover .product-actions {
    opacity: 1;
}

.action-button {
    padding: 0.75rem 1.25rem;
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
}

.action-button.edit {
    background-color: #4299e1;
}

.action-button.edit:hover {
    background-color: #3182ce;
}

.action-button.delete {
    background-color: #e53e3e;
}

.action-button.delete:hover {
    background-color: #c53030;
}

.action-button.buy {
    background-color: #48bb78;
    /* Un color verde */
    color: white;
}

.action-button.buy:hover {
    background-color: #38a169;
    /* Un verde más oscuro */
}

.product-info {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    flex: 1;
}

.product-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.product-description {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0;
    flex-grow: 1;
}

.product-price {
    font-size: 1.25rem;
    font-weight: 700;
    color: #5561ff;
    margin: 0;
}

.product-stock {
    color: #888;
    font-size: 0.9rem;
    margin: 0;
}

.reserve-button {
    background-color: #5561ff;
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-weight: 600;
    width: 100%;
    margin-top: auto;
}

.reserve-button:hover {
    background-color: #404dcc;
}


.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
}

.modal-content {
    position: relative;
    background-color: white;
    border-radius: 16px;
    width: 90%;
    max-width: 600px;
    padding: 2rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    z-index: 1001;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
}

.modal-header h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.modal-close {
    background: none;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.modal-close:hover {
    color: #333;
}

.modal-close span {
    font-size: 1.5rem;
    line-height: 1;
    color: #666;
}

.modal-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #374151;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s ease;
    background-color: #fff;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #5561ff;
    box-shadow: 0 0 0 3px rgba(85, 97, 255, 0.1);
}

.form-group textarea {
    min-height: 100px;
    resize: vertical;
}

.file-input-container {
    position: relative;
}

.file-input {
    opacity: 0;
    width: 0.1px;
    height: 0.1px;
    position: absolute;
}

.file-input-label {
    display: block;
    padding: 0.75rem;
    background-color: #f3f4f6;
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #666;
}

.file-input-label:hover {
    background-color: #e5e7eb;
    border-color: #5561ff;
    color: #5561ff;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 1.5rem;
    border-top: 1px solid #eee;
}

.btn-cancel {
    padding: 0.75rem 1.5rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background-color: white;
    color: #374151;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-cancel:hover {
    background-color: #f3f4f6;
    border-color: #9ca3af;
}

.btn-create {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    background-color: #5561ff;
    color: white;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-create:hover {
    background-color: #404dcc;
    transform: translateY(-1px);
}


.btn-cancel {
    background-color: #f0f0f0;
    color: #555;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.btn-cancel:hover {
    background-color: #ddd;
}


.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
}
</style>