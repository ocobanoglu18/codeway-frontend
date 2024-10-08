<template>
    <div class="signin-container">

      <h2>Please Login to App!</h2>
      <form @submit.prevent="signIn">
        <input
          type="email"
          v-model="email"
          placeholder="E-mail address"
          required
        />
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          required
        />
        <button type="submit">Log in</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
      <p>
      Don't have an account? 
      <router-link to="/signup" class="signup-link">Sign up</router-link>
    </p>
      <footer>Codeway © 2024</footer>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { auth } from '../firebase';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  
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
  
  <style scoped>
  /* Sign-in page styles for responsiveness */
  .signin-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #0d0f23;
    color: white;
  }
  
  .logo {
    width: 100px;
    margin-bottom: 20px;
  }
  
  form {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
  }
  
  input {
    margin-bottom: 15px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #7e57c2;
    background-color: #101233;
    color: #fff;
  }
  
  button {
    padding: 10px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #2980b9;
  }
  
  .error {
    color: red;
  }
  
  footer {
    margin-top: 20px;
    font-size: 12px;
    color: #888;
  }
  </style>
  