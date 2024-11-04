<template>
  <div>
    <h1>Product Title</h1>
    <img
      src="@/assets/logo.svg"
      width="125"
      height="125"
      class="product-image"
    />
    <p>
      Description of the product goes here. This can include features,
      specifications, and other relevant information.
    </p>

    <form :action="checkoutUrl" method="post">
      <input type="hidden" name="priceId" :value="productId" />
      <input type="hidden" name="successURL" value="http://google.com" />
      <input type="hidden" name="cancelURL" value="http://roboruud.nl" />
      <button type="submit" id="checkout-button">Checkout</button>
    </form>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  productId: string
}>()

const checkoutUrl = `${window.config.backEndUrl}/create-checkout-session` // Using template literals for better readability
</script>

<style scoped>
.product-image {
  max-width: 100%; /* Responsive image */
  height: auto; /* Maintain aspect ratio */
  margin: 20px 0; /* Spacing around the image */
}

#checkout-button {
  background-color: #4caf50; /* Green background */
  color: white; /* White text */
  border: none; /* No border */
  padding: 10px 20px; /* Padding */
  text-align: center; /* Centered text */
  text-decoration: none; /* No underline */
  display: inline-block; /* Inline block */
  font-size: 16px; /* Font size */
  margin: 4px 2px; /* Margin */
  cursor: pointer; /* Pointer cursor on hover */
  border-radius: 5px; /* Rounded corners */
  transition: background-color 0.3s; /* Smooth transition */
}

#checkout-button:hover {
  background-color: #45a049; /* Darker green on hover */
}
</style>
