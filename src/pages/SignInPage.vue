<template>
  <div class="signin-container">
    <img src="@/assets/codewaylogo.png" class="logo animated-logo" alt="Codeway Logo" />
    <h2 class="fade-in">Please Login to App!</h2>
    <form @submit.prevent="signIn">
      <input
        type="email"
        v-model="email"
        placeholder="E-mail address"
        required
        class="fade-in"
      />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
        class="fade-in"
      />
      <button type="submit" class="fade-in">Log in</button>
      <p v-if="errorMessage" class="error fade-in">{{ errorMessage }}</p>
    </form>
    <p class="fade-in">
      Don't have an account? 
      <router-link to="/signup" class="signup-link">Sign up</router-link>
    </p>
    <footer class="fade-in">Codeway © 2024</footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Import the separated CSS file
import '@/assets/signin.css';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const signIn = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/');
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>
