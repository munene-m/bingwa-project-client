<script setup>
import { useCookies } from '@vueuse/integrations/useCookies'
import { useToast } from 'vue-toastification'
import EditIcon from '../components/icons/EditIcon.vue'
import TrashIcon from '../components/icons/TrashIcon.vue'
import axios from 'axios'
import { onMounted, ref } from 'vue'

const cookies = useCookies()
const toast = useToast()
const apiUrl = import.meta.env.VITE_API_URL
const role = ref('')
const token = ref('')
const users = ref([])

const showModal = ref(false)
const selectedUser = ref(null)
const updatedRole = ref('')
const showDeleteConfirmation = ref(false)
const userIdToDelete = ref(null)

const getUsers = async () => {
  try {
    const response = await axios.get(`${apiUrl}/users`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })
    users.value = response.data
  } catch (error) {
    toast.error(error.response.data.message || 'Unable to get users')
  }
}

const openEditModal = user => {
  console.log(showModal.value)
  selectedUser.value = user
  updatedRole.value = user.role
  showModal.value = true
}

const updateUserRole = async () => {
  try {
    await axios.put(
      `${apiUrl}/users/edit/${selectedUser.value.id}`,
      { role: updatedRole.value },
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      },
    )
    toast.success('User role updated successfully')
    showModal.value = false
    getUsers()
  } catch (error) {
    toast.error(error.response.data.message || 'Failed to update user role')
  }
}

const confirmDeleteUser = userId => {
  userIdToDelete.value = userId
  showDeleteConfirmation.value = true
}

const deleteUser = async () => {
  try {
    await axios.delete(`${apiUrl}/users/${userIdToDelete.value}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })
    toast.success('User deleted successfully')
    getUsers()
  } catch (error) {
    toast.error(error.response.data.message || 'Failed to delete user')
  } finally {
    showDeleteConfirmation.value = false
    userIdToDelete.value = null
  }
}

onMounted(() => {
  role.value = cookies.get('role') || 'guest'
  token.value = cookies.get('token') || ''

  if (role.value !== 'ENGINEER') {
    getUsers()
  }
})
</script>

<template>
  <main>
    <h1 class="text-center mt-4" v-if="role === 'ENGINEER'">
      Not enough permissions to view users
    </h1>
    <div v-else>
      <h1 class="text-center mt-4">Current users</h1>
      <table class="table table-striped mt-4" v-if="users.length">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>KRA PIN</th>
            <th>Role</th>
            <th v-if="role === 'ADMIN'">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.email">
            <td>{{ user.firstName }}</td>
            <td>{{ user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.address }}</td>
            <td>{{ user.kraPin }}</td>
            <td>{{ user.role }}</td>
            <td v-if="role === 'ADMIN'">
              <button
                @click="openEditModal(user)"
                title="Edit User"
                class="text-blue-500"
              >
                <EditIcon />
              </button>
              <button
                @click="confirmDeleteUser(user.id)"
                title="Delete User"
                class="text-red-500 ml-2"
              >
                <TrashIcon />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>No users available to display.</p>
    </div>

    <!-- Edit Role Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-backdrop">
        <div class="modal-container text-black">
          <div class="modal-content">
            <h3 class="font-medium text-lg mb-4">Edit User Role</h3>
            <div class="mb-4">
              <label for="role" class="block mb-2">Role:</label>
              <select
                v-model="updatedRole"
                id="role"
                class="w-full p-2 border rounded"
              >
                <option value="ADMIN">Admin</option>
                <option value="PROJECT_MANAGER">Project Manager</option>
                <option value="ENGINEER">Engineer</option>
              </select>
            </div>
            <div class="modal-actions">
              <button
                @click="updateUserRole"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                @click="showModal = false"
                class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteConfirmation" class="modal-backdrop">
        <div class="modal-container text-black">
          <div class="modal-content">
            <h3 class="font-medium text-lg mb-4">
              Are you sure you want to delete this user?
            </h3>
            <div class="modal-actions">
              <button
                @click="deleteUser"
                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                @click="showDeleteConfirmation = false"
                class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th,
.table td {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
}
.table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-container {
  position: relative;
  z-index: 51;
  width: 100%;
  max-width: 500px;
  margin: 0 20px;
}

.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
