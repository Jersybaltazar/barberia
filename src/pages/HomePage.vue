<template>
    <div>
        <!-- Navbar -->
        <Navbar />

        <!-- Hero Section -->
        <section class="hero">
            <div class="hero-content">
                <h1>LUCE TU MEJOR ESTILO</h1>
                <p>Reserva ahora y transforma tu apariencia con nuestros expertos</p>
                <button class="hero-button" @click="getLocation()">Nos Ubicamos</button>

            </div>
        </section>

        <!-- Recomendaciones Section -->
        <section class="recommendations">
            <h2>Nuestros Servicios</h2>
            <div class="recommendations-grid">
                <div class="recommendation-card" v-for="(item, index) in services" :key="index">
                    <img :src="item.image" alt="Servicio de Barbería" class="recommendation-image" />
                    <div class="recommendation-info">
                        <h3>{{ item.name }}</h3>
                        <p>{{ item.description }}</p>
                        <button class="reserve-button" @click="openModal(item)">Reservar</button>
                    </div>
                </div>
            </div>
        </section>

        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <h3>Reservar {{ selectedService.name }}</h3>
                <form @submit.prevent="confirmReservation">
                    <label for="date">Fecha y Hora</label>
                    <input type="datetime-local" v-model="reservationDate" required />

                    <button type="submit" class="confirm-button">Confirmar Reserva</button>
                    <button type="button" class="cancel-button" @click="closeModal">Cancelar</button>
                </form>
            </div>
        </div>


        <!-- Valores de la Empresa -->
        <section class="values">
            <h2>¿Por Qué Elegirnos?</h2>
            <p>Conoce nuestros valores y beneficios para tu estilo</p>
            <div class="values-grid">
                <div class="value-card" v-for="(value, index) in values" :key="index">
                    <img :src="value.icon" alt="Icono" />
                    <h3>{{ value.title }}</h3>
                    <p>{{ value.description }}</p>
                </div>
            </div>
        </section>

        <!-- Sobre Nosotros -->
        <section class="about">
            <div class="about-content">
                <div class="about-text">
                    <h2>Sobre Nosotros</h2>
                    <p>
                        Somos un equipo comprometido en hacerte lucir mejor. Nuestra misión es ofrecerte la mejor
                        experiencia de barbería,
                        sin largas esperas, con reservas fáciles y un servicio de calidad garantizada. Con la dedicación
                        de nuestros barberos expertos,
                        garantizamos que cada visita sea una experiencia única, adaptada a tus necesidades y estilo.
                    </p>
                </div>
                <div class="about-image">
                    <img src="../assets/seccion.png" alt="Equipo de Barbería" />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts">
import Navbar from '../components/Navbar.vue';
import image from '../assets/image.png';
import icon from '../assets/Icon.png';
import icon1 from '../assets/Icon1.png';
import icon2 from '../assets/Icon2.png';
import axios from 'axios';
export default {
    name: "HomePage",
    components: {
        Navbar,
    },
    data() {
        return {
            services: [
                { id: 1, image: image, name: 'Corte Clásico', description: 'Corte de cabello tradicional y elegante.' },
                { id: 2, image: image, name: 'Afeitado Completo', description: 'Afeitado suave y detallado con toallas calientes.' },
                { id: 3, image: image, name: 'Corte Moderno', description: 'Estilos modernos y personalizados para cada cliente.' },
                { id: 4, image: image, name: 'Arreglo de Barba', description: 'Perfilado y recorte de barba para un look impecable.' },
            ],
            values: [
                { icon: icon, title: 'Experiencia y Profesionalismo', description: 'Nuestros barberos son expertos en el arte de la barbería y se dedican a brindarte el mejor servicio.' },
                { icon: icon1, title: 'Calidad en Cada Corte', description: 'Utilizamos productos de alta calidad para asegurar que tu estilo se mantenga impecable.' },
                { icon: icon2, title: 'Reservas Sencillas y Rápidas', description: 'Olvídate de las largas esperas. Reserva en línea y llega directo a tu cita.' },
            ],
            showModal: false,
            selectedService: null,
            reservationDate: '',
        };
    },
    methods: {
        getLocation() {
            alert('Nos ubicamos en la Calle Principal, Ciudad');
            window.location.href = 'https://www.google.com/maps/place/13%C2%B031\'32.5%22S+71%C2%B057\'05.6%22W/@-13.525688,-71.9522007,19z/data=!3m1!4b1!4m12!1m7!3m6!1s0x916e7f550a5f8669:0x7cf6c40684069145!2sReal+Plaza+Cusco!8m2!3d-13.5239432!4d-71.9504727!16s%2Fg%2F1q5bmcssy!3m3!8m2!3d-13.525688!4d-71.951557?entry=ttu&g_ep=EgoyMDI0MTExMi4wIKXMDSoASAFQAw%3D%3D';
        },
        openModal(service) {
            this.selectedService = service;
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.selectedService = null;
            this.reservationDate = '';
        },
        async confirmReservation() {
            try {
                const id_cliente = localStorage.getItem('id_cliente'); // ID del cliente logueado
                if (!id_cliente) {
                    alert('Error: No se encontró información del cliente.');
                    return;
                }

                const id_servicio = this.selectedService.id;
                const fecha_hora = this.reservationDate;

                const response = await axios.post('http://localhost:3000/reservas', {
                    id_cliente,
                    id_servicio,
                    fecha_hora,
                });

                alert('Reserva confirmada: ' + response.data.message);
                this.closeModal();
            } catch (error) {
                console.error('Error al realizar la reserva:', error);
                alert('Error al realizar la reserva. Inténtalo de nuevo.');
            }
        },
    },

};
</script>

<style scoped>
.hero {
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #5561ff, #8e9bff);
    color: #fff;
    padding: 3rem 1rem;
    text-align: center;
}

.hero-content h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.hero-button {
    background-color: #fff;
    color: #5561ff;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s;
}

.hero-button:hover {
    background-color: #f0f0f0;
}

.recommendations {
    padding: 2rem 1rem;
    text-align: center;
}

.recommendations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.recommendation-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    text-align: left;
    padding: 1rem;
}

.recommendation-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
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
}

.reserve-button:hover {
    background-color: #404dcc;
}

.values {
    padding: 2rem 1rem;
    text-align: center;
}

.values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.value-card {
    text-align: center;
}

.about {
    padding: 2rem 1rem;
    text-align: center;
}

.about-content {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 2rem;
    text-align: left;
}

.about-text {
    max-width: 500px;
}

.about-image img {
    width: 300px;
    height: auto;
}

.team {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
}

.team-member img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
}
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 300px;
    text-align: center;
}

.confirm-button,
.cancel-button {
    background-color: #5561ff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    margin: 0.5rem;
    transition: background-color 0.3s;
}

.cancel-button {
    background-color: #ff4d4d;
}

.confirm-button:hover {
    background-color: #404dcc;
}

.cancel-button:hover {
    background-color: #cc0000;
}
</style>
