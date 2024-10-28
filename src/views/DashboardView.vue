<script setup>
import { useCookies } from '@vueuse/integrations/useCookies'
import { useToast } from 'vue-toastification'
import { onMounted, ref, reactive } from 'vue'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL
const projects = ref([])

// State to hold form visibility and selected project details
const showEditForm = ref(false)
const showAssignForm = ref(false)
const showCreateForm = ref(false)
const selectedProject = reactive({})
const role = ref('')
// Fetch projects
const getProjects = async () => {
  try {
    const response = await axios.get(`${apiUrl}/projects`, {
      headers: {
        Authorization: `Bearer ${useCookies().get('token')}`,
      },
    })
    projects.value = response.data
  } catch (error) {
    console.log(error)
  }
}

// Functions to handle modal visibility
const openEditForm = project => {
  Object.assign(selectedProject, project)
  showEditForm.value = true
}

const openAssignForm = project => {
  Object.assign(selectedProject, project)
  showAssignForm.value = true
}

const openCreateForm = () => {
  showCreateForm.value = true
}

// Close form modals
const closeForm = async () => {
  try {
    const response = await axios.put(
      `${apiUrl}/projects/${selectedProject.id}`,
      {
        name: selectedProject.name,
        description: selectedProject.description,
      },
      {
        headers: {
          Authorization: `Bearer ${useCookies().get('token')}`,
        },
      },
    )
    getProjects()
    useToast().success(response.data.message)
  } catch (error) {
    console.log(error)
  }
  showEditForm.value = false
  // showAssignForm.value = false
  // showCreateForm.value = false
}

const name = ref('')
const description = ref('')
const startDate = ref('')
const endDate = ref('')

const createProject = async () => {
  if (!name.value || !description.value || !startDate.value || !endDate.value) {
    useToast().error('All fields are required')
    return
  }
  try {
    await axios.post(
      `${apiUrl}/projects/create`,
      {
        name: name.value,
        description: description.value,
        startDate: startDate.value,
        endDate: endDate.value,
      },
      {
        headers: {
          Authorization: `Bearer ${useCookies().get('token')}`,
        },
      },
    )
    getProjects()
    useToast().success('Project created')
    showCreateForm.value = false
  } catch (error) {
    useToast().error(error.response.data.message)
    console.log(error)
  }
}

const deleteProject = async id => {
  try {
    const response = await axios.delete(`${apiUrl}/projects/${id}`, {
      headers: {
        Authorization: `Bearer ${useCookies().get('token')}`,
      },
    })
    getProjects()
    useToast().success(response.data.message)
  } catch (error) {
    console.log(error)
    useToast().error(error.response.data.message)
  }
}

onMounted(() => {
  role.value = useCookies().get('role')
  getProjects()
})
</script>

<template>
  <div class="m-5">
    <h1 v-if="role === 'ADMIN'" class="text-3xl font-bold text-secondary my-4">
      Recent Projects
    </h1>
    <h1 v-else class="text-3xl font-bold text-secondary my-4">My projects</h1>

    <button
      @click="openCreateForm"
      class="px-4 py-2 bg-blue-500 text-white rounded mb-4"
    >
      Create New Project
    </button>

    <!-- Projects list -->
    <div class="flex flex-row flex-wrap gap-4">
      <div
        v-for="project in projects"
        :key="project.id"
        class="border rounded-lg p-4 shadow-md transition-transform max-w-sm flex justify-between flex-col"
      >
        <h2 class="text-xl font-semibold mb-2">{{ project.name }}</h2>
        <p class="text-gray-600">
          {{ project.description }}
        </p>

        <div class="mt-4">
          <span
            :class="{
              'bg-purple-200 text-purple-800': project.status === 'PENDING',
              'bg-red-200 text-red-800': project.status === 'ON_HOLD',
              'bg-cyan-200 text-cyan-800': project.status === 'IN_PROGRESS',
              'bg-green-200 text-green-800': project.status === 'COMPLETED',
            }"
            class="inline-block px-3 py-1 rounded-full text-sm font-medium"
          >
            {{ project.status.replace('_', ' ') }}
          </span>
        </div>

        <div class="mt-4">
          <span class="font-semibold">Assigned to:</span>
          <div v-if="project.projectManager">
            <p class="mt-1">
              Project Manager: {{ project.projectManager.firstName }}
              {{ project.projectManager.lastName }}
            </p>
            <p class="text-sm text-gray-500">
              Email: {{ project.projectManager.email }}
            </p>
          </div>
          <div v-else-if="project.engineer">
            <p class="mt-1">
              Engineer: {{ project.engineer.firstName }}
              {{ project.engineer.lastName }}
            </p>
            <p class="text-sm text-gray-500">
              Email: {{ project.engineer.email }}
            </p>
          </div>
          <div v-else>
            <p class="mt-1 text-gray-500">Not assigned yet</p>
          </div>
        </div>

        <p class="mt-4 text-sm text-gray-400">
          Start Date: {{ new Date(project.startDate).toLocaleDateString() }}
        </p>
        <p class="text-sm text-gray-400">
          End Date: {{ new Date(project.endDate).toLocaleDateString() }}
        </p>

        <div class="mt-4 gap-3 flex">
          <button
            @click="openEditForm(project)"
            class="px-2 py-1 bg-green-500 text-white rounded"
          >
            Edit
          </button>
          <button
            @click="openAssignForm(project)"
            class="px-2 py-1 bg-yellow-500 text-white rounded"
          >
            Assign
          </button>
          <button
            @click="deleteProject(project.id)"
            class="px-2 py-1 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Form Modal -->
    <div
      v-if="showEditForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <form
        @submit.prevent="closeForm"
        class="bg-white p-4 rounded shadow-lg w-1/3"
      >
        <h2 class="text-lg font-semibold mb-4">Edit Project</h2>
        <label>Name:</label>
        <input
          v-model="selectedProject.name"
          class="border p-2 rounded w-full mb-2"
        />
        <label>Description:</label>
        <textarea
          v-model="selectedProject.description"
          class="border p-2 rounded w-full mb-4"
        ></textarea>
        <button type="submit" class="px-3 py-1 bg-primary text-white rounded">
          Save
        </button>
      </form>
    </div>

    <!-- Assign Form Modal -->
    <div
      v-if="showAssignForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-4 rounded shadow-lg w-1/3">
        <h2 class="text-lg font-semibold mb-4">Assign Project</h2>
        <label>Assign to:</label>
        <select
          v-model="selectedProject.assignedTo"
          class="border p-2 rounded w-full mb-4"
        >
          <option value="projectManager">Project Manager</option>
          <option value="engineer">Engineer</option>
        </select>
        <button
          @click="closeForm"
          class="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Assign
        </button>
      </div>
    </div>

    <!-- Create Project Modal -->
    <div
      v-if="showCreateForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <form
        @submit.prevent="createProject"
        class="bg-white p-4 rounded shadow-lg w-1/3"
      >
        <h2 class="text-lg font-semibold mb-4">Create New Project</h2>
        <label>Name:</label>
        <input v-model="name" class="border p-2 rounded w-full mb-2" />
        <label>Description:</label>
        <textarea
          v-model="description"
          class="border p-2 rounded w-full mb-4"
        ></textarea>
        <label>Start Date:</label>
        <input
          type="date"
          v-model="startDate"
          class="border p-2 rounded w-full mb-2"
        />
        <label>End Date:</label>

        <input
          type="date"
          v-model="endDate"
          class="border p-2 rounded w-full mb-2"
        />
        <button type="submit" class="px-3 py-1 bg-blue-500 text-white rounded">
          Create
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
h1 {
  color: #4a5568; /* Custom color for section title */
}
</style>
