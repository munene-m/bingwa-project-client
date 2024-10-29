<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useToast } from 'vue-toastification'
import axios from 'axios'
const toast = useToast()
const email = ref('')
const password = ref('')
const apiUrl = import.meta.env.VITE_API_URL
const cookies = useCookies()

async function handleLogin() {
  if (!email.value || !password.value) {
    toast.error('Please enter all required fields')
    return
  }
  try {
    const response = await axios.post(`${apiUrl}/users/login`, {
      email: email.value.trim(),
      password: password.value.trim(),
    })
    cookies.set('token', response.data.token, {
      doNotParse: false,
      autoUpdateDependencies: false,
      maxAge: 86400,
    })
    cookies.set('role', response.data.user.role, {
      doNotParse: false,
      autoUpdateDependencies: false,
      maxAge: 86400,
    })
    cookies.set('username', response.data.user.username, {
      doNotParse: false,
      autoUpdateDependencies: false,
      maxAge: 86400,
    })
    cookies.set('id', response.data.user.id, {
      doNotParse: false,
      autoUpdateDependencies: false,
      maxAge: 86400,
    })
    toast.success('Login successful!')
    router.push({ name: 'dashboard' })
  } catch (error) {
    console.error('Error occurred during API call:', error)
    if (error.response && error.response.data) {
      toast.error(error.response.data.message || 'An error occurred')
    } else {
      toast.error('Failed to connect to the server')
    }
  }
}

const router = useRouter()

const props = defineProps({
  role: String,
})

async function handleSignupNav() {
  router.push(`/signup/${props.role}`)
}
</script>

<template>
  <main class="flex items-center justify-center flex-col">
    <h1 class="text-4xl font-bold text-secondary">Welcome back!</h1>
    <h1 class="text-2xl font-bold text-secondary mt-10">Log in</h1>
    <form
      @submit.prevent="handleLogin"
      class="flex flex-col items-center px-10 md:mx-0 w-full md:w-[30rem] m-auto"
    >
      <input
        v-model="email"
        required
        type="email"
        placeholder="Email"
        className="input input-bordered w-full mt-3"
      />

      <input
        v-model="password"
        required
        type="password"
        placeholder="Password"
        className="input input-bordered w-full mt-3"
      />

      <button
        type="submit"
        class="button w-full bg-primary text-white rounded-xl py-3 mt-3"
      >
        Log in
      </button>
    </form>
    <p>
      Don't have an account?
      <button
        @click="handleSignupNav"
        class="cursor-pointer text-primary underline mt-4"
      >
        Sign up
      </button>
    </p>
  </main>
</template>
