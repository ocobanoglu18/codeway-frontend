<template>
    <div class="signup-container">
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
  
  <style scoped>
  .signup-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #0d0f23;
    color: white;
    padding: 20px;
  }
  
  h2 {
    margin-bottom: 20px;
  }
  
  form {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    background-color: #1a1b41;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  }
  
  .form-group {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
  }
  
  label {
    font-size: 14px;
    margin-bottom: 5px;
  }
  
  input {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #7e57c2;
    background-color: #101233;
    color: #fff;
    font-size: 14px;
  }
  
  input:focus {
    outline: none;
    border-color: #3498db;
  }
  
  .submit-btn {
    padding: 10px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    font-size: 16px;
    font-weight: bold;
    transition: background-color 0.3s ease;
  }
  
  .submit-btn:hover {
    background-color: #2980b9;
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  
  footer {
    margin-top: 20px;
    font-size: 12px;
    color: #888;
  }
  </style>
  