<template>
  <div class="home-container">
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
    fetchConfigurations();
  });
  
  </script>
  
  
  <style scoped>
  .logout-button{
    background-color:#7e57c2 ;
    border: none;
    color: white;
    padding: 10px;
    border-radius: 10px;
  }
  .home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background-color: #11172a;
    color: white;
    padding: 20px;
  }
  
  .header {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    font-weight: bold;
    border-bottom: 2px solid #7e57c2;
  }
  
  .table {
    width: 100%;
    max-width: 1200px;
    margin-bottom: 20px;
  }
  
  .row {
    display: flex;
    justify-content: space-between;
    padding: 40px;
    border-bottom: 1px solid #7e57c2;
  }
  
  .parameter-key, .value, .description, .create-date {
    flex: 1;
    text-align:left
  }

  
  .actions {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    gap: 10px;
  }
  
  .add-form {
    display: flex;
    width: 100%;
    max-width: 1200px;
    margin-top: 20px;
  }
  
  .input-field {
    flex: 1;
    margin-right: 10px;
    padding: 10px;
    border-radius: 5px;
    border: none;
    background-color: #1b2a47;
    color: white;
  }
  
  .add-btn {
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    background-color: #0056b3;
    color: white;
    cursor: pointer;
  }
  
  .add-btn:hover {
    background-color: #007abf;
  }
  
  .edit-btn {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    padding: 6px;
  }
  
  .delete-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    padding: 6px;
  }
  
  .edit-btn:hover {
    background-color: #0056b3;
  }
  
  .delete-btn:hover {
    background-color: #c82333;
  }

.create-date {
    cursor: pointer; /* Specifically making the Create Date header clickable */
}

.header {
  display: flex;
  justify-content: flex-end;
}

.profile-container {
  position: relative;
  cursor: pointer;
}

.profile-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.popup {
  position: absolute;
  top: 70px; /* Adjust the position based on your layout */
  right: 20px;
  background-color: #1b2a47;
  border: 1px solid #7e57c2;
  border-radius: 8px;
  padding: 10px;
  width:fit-content;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.email-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.email-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.logout-button {
  width: 100%;
  padding: 8px 0;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
}

.logout-button:hover {
  background-color: #c82333;
}
@media (max-width: 768px) {
  .row {
    flex-direction: column;
    flex-wrap: wrap; /* Allow items to wrap inside the row */
    padding: 10px 0;
  }

  .parameter-key, .value, .description, .create-date {
    width: 100%; /* Take full width of container in mobile view */
    display: flex;
    justify-content: space-between; /* Ensure label is followed by its value */
    padding: 5px 0;
  }

  .parameter-key::before {
    content: 'Parameter Key: ';
    font-weight: bold;
  }
  
  .value::before {
    content: 'Value: ';
    font-weight: bold;
  }

  .description::before {
    content: 'Description: ';
    font-weight: bold;
  }

  .create-date::before {
    content: 'Create Date: ';
    font-weight: bold;
  }

  .actions::before {
    content: 'Actions: ';
    font-weight: bold;
  }
  .actions{
    flex-direction: column;
    gap: 10px;  
  }

  .parameter-key, .value, .description, .create-date, .actions {
    padding: 5px 0; /* Reduce padding for better fit */
  }

  .input-field {
    flex: 1 100%; /* Make input fields full width */
    margin-right: 0;
  }

  .add-btn {
    width: 100%; /* Make Add button full width */
  }

  .actions {
    justify-content: flex-start;
  }

  .add-form {
    flex-direction: column;
    gap: 10px;
  }
}


  </style>
  