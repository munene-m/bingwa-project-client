<!-- AppLayout.vue -->
<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '../components/SideBar.vue'
import MenuIcon from '../components/icons/MenuIcon.vue'

const route = useRoute()

const authenticatedRoutes = [
  '/dashboard',
  '/users',
  '/customers',
  '/leads',
  '/settings',
]

const showSidebar = computed(() => authenticatedRoutes.includes(route.path))

const isSidebarOpen = ref(true)

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="app-layout">
    <button
      v-if="showSidebar"
      @click="toggleSidebar"
      class="fixed top-4 left-4 z-10 bg-primary text-white px-3 py-2 rounded-lg focus:outline-none"
    >
      <MenuIcon />
    </button>
    <Sidebar
      v-if="showSidebar"
      :isOpen="isSidebarOpen"
      :toggleSidebar="toggleSidebar"
    />

    <main :class="{ 'with-sidebar': showSidebar }">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.with-sidebar {
  margin-left: 16rem; /* Adjust margin based on sidebar width */
}
</style>
