<script setup>
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'
import { ref } from 'vue'
const router = useRouter()
const toast = useToast()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const phone = ref('')
const address = ref('')
const kraPin = ref('')
const apiUrl = import.meta.env.VITE_API_URL

const props = defineProps({
  role: String,
})

async function handleSignup() {
  if (
    !firstName.value ||
    !lastName.value ||
    !email.value ||
    !password.value ||
    !phone.value ||
    !address.value ||
    !kraPin.value
  ) {
    toast.error('Please enter all required fields')
    return
  }
  try {
    const response = await axios.post(`${apiUrl}/users/${props.role}/create`, {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value.trim(),
      password: password.value.trim(),
      phoneNumber: phone.value,
      address: address.value,
      kraPin: kraPin.value,
    })
    console.log('API response:', response.data)
    toast.success('Account created successfully!')
    router.push(`/login/${props.role}`)
  } catch (error) {
    console.error('Error occurred during API call:', error)
    if (error.response && error.response.data) {
      toast.error(error.response.data.message || 'An error occurred')
    } else {
      toast.error('Failed to connect to the server')
    }
  }
}

async function handleLoginNav() {
  router.push(`/login/${props.role}`)
}
</script>

<template>
  <main class="flex items-center justify-center flex-col">
    <h1 class="text-4xl font-bold text-secondary">Welcome to Bingwa CRM</h1>
    <h2 class="text-2xl font-bold mt-10 text-secondary">Sign up</h2>
    <form
      @submit.prevent="handleSignup"
      class="flex flex-col items-center px-10 md:mx-0 w-full md:w-[30rem] m-auto"
    >
      <input
        required
        type="text"
        v-model="firstName"
        placeholder="First name"
        className="input input-bordered w-full mt-3"
      />
      <input
        required
        type="text"
        v-model="lastName"
        placeholder="Last name"
        className="input input-bordered w-full mt-3"
      />
      <input
        required
        type="email"
        v-model="email"
        placeholder="Email"
        className="input input-bordered w-full mt-3"
      />
      <input
        required
        type="text"
        v-model="address"
        placeholder="Address"
        className="input input-bordered w-full mt-3"
      />
      <input
        required
        type="password"
        v-model="password"
        placeholder="Password"
        className="input input-bordered w-full mt-3"
      />
      <input
        required
        type="text"
        v-model="kraPin"
        placeholder="KRA Pin"
        className="input input-bordered w-full mt-3"
      />
      <input
        required
        type="text"
        v-model="phone"
        placeholder="Phone number"
        className="input input-bordered w-full mt-3"
      />
      <button
        type="submit"
        class="button w-full bg-primary text-white rounded-xl py-3 mt-3"
      >
        Sign up
      </button>
    </form>
    <p>
      Already have an account?
      <button
        @click="handleLoginNav"
        class="cursor-pointer text-primary underline mt-4"
      >
        Log in
      </button>
    </p>
  </main>
</template>
