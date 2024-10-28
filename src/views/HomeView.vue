<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function handleEngineer() {
  router.push('/login/engineer')
}
function handlePm() {
  router.push('/login/project-manager')
}
function handleAdmin() {
  router.push('/login/admin')
}
</script>

<template>
  <div class="h-[80vh] flex flex-col items-center justify-center">
    <h1 class="text-xl pb-4 font-semibold">Proceed as:</h1>
    <div class="flex gap-4">
      <button
        class="button w-36 bg-primary text-white rounded-md py-3 px-2"
        @click="handleAdmin"
      >
        Admin
      </button>
      <button
        class="button w-36 bg-primary text-white rounded-md py-3 px-2"
        @click="handleEngineer"
      >
        Engineer
      </button>
      <button
        class="button w-36 bg-primary text-white rounded-md py-3 px-2"
        @click="handlePm"
      >
        Project Manager
      </button>
    </div>
    <router-view />
  </div>
</template>
