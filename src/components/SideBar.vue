<!-- Sidebar.vue -->
<script setup>
import { onMounted, ref } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'

import { RouterLink } from 'vue-router'
import CloseIcon from './icons/CloseIcon.vue'

const username = ref('')
const role = ref('')
const cookies = useCookies()

onMounted(() => {
  username.value = cookies.get('username') || 'Guest'
  role.value = cookies.get('role') || 'Guest'
})

const props = defineProps({
  isOpen: Boolean,
  toggleSidebar: Function,
})

function logout() {
  cookies.remove('token')
  cookies.remove('username')
  cookies.remove('role')
  location.reload()
}
</script>

<template>
  <aside
    v-if="props.isOpen"
    class="fixed top-0 left-0 h-full w-64 bg-secondary text-white shadow-lg transition-transform transform"
  >
    <div class="flex items-center justify-between p-5 bg-gray-900">
      <h2 class="text-lg font-bold"></h2>
      <button
        @click="props.toggleSidebar"
        class="text-gray-400 hover:text-white focus:outline-none"
      >
        <CloseIcon />
      </button>
    </div>
    <div class="flex flex-col gap-1 justify-end items-start fixed bottom-2 p-4">
      <p class="px-4">{{ username }}</p>
      <p class="px-4">{{ role }}</p>
    </div>
    <nav class="p-4">
      <ul class="space-y-4">
        <li>
          <RouterLink
            to="/dashboard"
            class="block py-2 px-4 rounded hover:bg-primary"
            >Dashboard</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/users"
            class="block py-2 px-4 rounded hover:bg-primary"
            >Users</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/customers"
            class="block py-2 px-4 rounded hover:bg-primary"
            >Customers</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/leads"
            class="block py-2 px-4 rounded hover:bg-primary"
            >Leads</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/settings"
            class="block py-2 px-4 rounded hover:bg-primary"
            >Settings</RouterLink
          >
        </li>
        <li
          @click="logout"
          class="block py-2 cursor-pointer px-4 rounded hover:bg-primary"
        >
          Log Out
        </li>
      </ul>
    </nav>
    <div class="flex flex-col gap-1 justify-end items-start fixed bottom-2 p-4">
      <p class="px-4">{{ username }}</p>
      <p class="px-4">{{ role }}</p>
    </div>
  </aside>
</template>
