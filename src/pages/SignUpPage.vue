<template>
  <div class="signup-container">
    <img src="@/assets/codewaylogo.png" class="logo animated-logo" alt="Codeway Logo" />
    <h2>Sign Up</h2>
    <form @submit.prevent="signup">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="Enter your email"
          required
        />
      </div>
      <div class="form-group">
        <label for="confirmEmail">Confirm Email</label>
        <input
          type="email"
          id="confirmEmail"
          v-model="confirmEmail"
          placeholder="Type your email again"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Enter your password"
          required
        />
      </div>
      <button type="submit" class="submit-btn">Sign Up</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <router-link to="/signin" class="signup-link">Already have an account?</router-link>
    <footer>Codeway © 2024</footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

// Import the external CSS file
import '@/assets/signup.css';

const router = useRouter();
const email = ref('');
const confirmEmail = ref('');
const password = ref('');
const errorMessage = ref('');

const signup = async () => {
  if (email.value !== confirmEmail.value) {
    errorMessage.value = "Emails do not match!";
    return;
  }
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    router.push('/');
  } catch (error) {
    errorMessage.value = 'Failed to sign up: ' + error.message;
  }
};
</script>
