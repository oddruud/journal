<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import ProductOfferingItem from '../components/ProductOfferingItem.vue';

    const products = ref([]); // Create a reactive variable to hold the products
    const prices = ref([]);
    onMounted(async () => {
        try {
            const responsePrices = await fetch('http://localhost:8080/prices'); // Replace with your API URL
            if (!responsePrices.ok) {
                throw new Error('Network response was not ok');
            }
            prices.value = await responsePrices.json(); // Store the fetched products

        } catch (error) {
            console.error('Error fetching products:', error);
        }
    });
</script>

<template>
    <div>products</div>
    <div v-for="price in prices" :key="price.id">
        <ProductOfferingItem :productId="price.id">

        </ProductOfferingItem>
    </div>
</template>





