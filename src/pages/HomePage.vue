<template>
  <div class="home-container">
        <!-- Welcome Popup -->
        <div v-if="showWelcomePopup" class="welcome-popup">
      <div class="welcome-popup-content">
        <h2>Welcome to the Configuration Dashboard!</h2>
        <p>You can manage your configurations from here.</p>
        <button @click="closeWelcomePopup" class="close-btn">Close</button>
      </div>
    </div>
    <div class="header">
    <!-- Profile icon -->
    <div class="profile-container" @click="togglePopup">
      <svg class="profile-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="white" d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 1.791-8 4v2h16v-2c0-2.209-3.582-4-8-4z"/>
        </svg>
      </div>
    <!-- Popup with email and logout button -->
    <div v-if="showPopup" class="popup">
      <div class="popup-content">
        <div class="email-info">
          <svg class="email-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="white" d="M12 13.758l8-5.758v-3h-16v3l8 5.758zm-8 1.518v6.724h16v-6.724l-8 5.758-8-5.758zm-4-13.276h24v24h-24v-24z"/>
            </svg>
          <span>{{ userEmail }}</span> <!-- Display the user's email dynamically -->
        </div>
        <button @click="logOut" class="logout-button">Log Out</button>
      </div>
    </div>
  </div>

      <!-- Display loading spinner -->
      <div v-if="loading" class="loading">Loading...</div>
      <!-- Display error message -->
      <div v-if="error" class="error">{{ error }}</div>

      <!-- Display configurations if available -->
      <div v-if="configurations && !loading" class="table">
          <!-- Table headers -->
          <div class="row header">
              <div class="parameter-key">Parameter Key</div>
              <div class="value">Value</div>
              <div class="description">Description</div>
              <div class="create-date" @click="sortByDate">Create Date</div>
              <div class="actions">Actions</div>
          </div>

          <!-- Table content -->
          <div v-for="(config, key) in configurations" :key="key" class="row">
              <div class="parameter-key">{{ key }}</div>
              <div class="value">{{ config.value }}</div>
              <div class="description">{{ config.description }}</div>
              <div class="create-date">{{ formatDate(config.createdDate) }}</div>
              <div class="actions">
                  <button class="edit-btn" @click="editConfiguration(key)">Edit</button>
                  <button class="delete-btn" @click="deleteConfiguration(key)">Delete</button>
              </div>
          </div>
      </div>

      <!-- Add new configuration form -->
      <div class="form add-form">
          <input v-model="newKey" placeholder="New Parameter" class="input-field" />
          <input v-model="newValue" placeholder="Value" class="input-field" />
          <input v-model="newDescription" placeholder="New Description" class="input-field" />
          <button @click="addConfiguration" class="add-btn">ADD</button>
      </div>
  </div>
</template>

  
  <script setup>
  import '@/assets/layout.css';   // Layout styles
import '@/assets/buttons.css';  // Button styles
import '@/assets/responsive.css';  // Responsive styles
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import { auth } from '../firebase'; // Firebase auth import
  import { signOut } from 'firebase/auth';
  
  const router = useRouter();
  const configurations = ref([]);
  const newKey = ref('');
  const newValue = ref('');
  const newDescription = ref('');
  const loading = ref(true);
  const error = ref('');
  const isAscending = ref(true); // Track sorting order
  const showPopup = ref(false);
  const userEmail = ref(auth.currentUser?.email || '');

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp._seconds) return 'N/A'; // Return 'N/A' if timestamp is missing or invalid
    const date = new Date(timestamp._seconds * 1000); // Convert seconds to milliseconds for JS Date object
    return date.toLocaleString(); // Use toLocaleString for a human-readable format
  };

  const sortByDate = () => {
    console.log('Sorting by date...');
    isAscending.value = !isAscending.value;
    const sortedConfigurations = [...configurations.value];
    sortedConfigurations.sort((a, b) => {
        console.log('Dates:', a.createdDate, b.createdDate); // Log the dates for debugging
        const dateA = new Date(a.createdDate?._seconds * 1000 || 0);
        const dateB = new Date(b.createdDate?._seconds * 1000 || 0);
        if (isAscending.value) {
            return dateA - dateB; // Sort ascending
        } else {
            return dateB - dateA; // Sort descending
        }
    });
    configurations.value = sortedConfigurations;
};

const togglePopup = () => {
  showPopup.value = !showPopup.value;
};

  const fetchConfigurations = async () => {
    loading.value = true;
    error.value = '';
    try {
      const user = auth.currentUser;
      if (user) {
        const idToken = await user.getIdToken();
        const response = await axios.get('http://localhost:5001/config', {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        configurations.value = response.data;
      } else {
        throw new Error('User not authenticated');
      }
    } catch (err) {
      error.value = 'Failed to fetch configurations';
    } finally {
      loading.value = false;
    }
  };
  
  const addConfiguration = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      await axios.post('http://localhost:5001/config/add', {
        key: newKey.value,
        value: newValue.value,
        description: newDescription.value,
      }, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      fetchConfigurations();
    } catch (err) {
      console.error('Error adding configuration:', err);
    }
  };
  
const editConfiguration = async (key) => {
  const updatedValue = prompt('Enter new value:');
  const updatedDescription = prompt('Enter new description:');
  if (!updatedValue || !updatedDescription) return;
  try {
    const idToken = await auth.currentUser.getIdToken();
    await axios.post('http://localhost:5001/config/update', {
      key, 
      value: updatedValue, 
      description: updatedDescription, 
    }, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    fetchConfigurations(); 
  } catch (err) {
    console.error('Error updating configuration:', err);
  }
};

  const deleteConfiguration = async (key) => {
    const confirmDelete = confirm('Are you sure you want to delete this configuration?');
    if (!confirmDelete) return;
    try {
      const idToken = await auth.currentUser.getIdToken();
      await axios({
        method: 'delete',
        url: 'http://localhost:5001/config/delete',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        data: { key }, 
      });
      fetchConfigurations();
    } catch (err) {
      console.error('Error deleting configuration:', err);
    }
  };
  
  // Logout function
  const logOut = async () => {
    try {
      await signOut(auth);
      router.push('/signin');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };
  
  // Fetch configurations on mount
  onMounted(() => {
    setTimeout(() => {
    showWelcomePopup.value = false;
  }, 5000);
    fetchConfigurations();
  });
  
  </script>
  
  
  <style scoped>
  </style>
  