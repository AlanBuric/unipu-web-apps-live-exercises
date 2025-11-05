<script setup lang="ts">
  import { ref } from "vue";
  import { useRouter } from 'vue-router';

  const registrationData = ref({
    username: "",
    password: "",
  });
  const loginData = ref({
    username: "",
    password: "",
  });
  const registrationMessage = ref<string>();
  const loginMessage = ref<string>();

  const router = useRouter();

  async function registerUser() {
    registrationMessage.value = undefined;

    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registrationData.value),
    });

    if (response.ok) {
      registrationMessage.value = "Registration successful! You can now log in.";
      registrationData.value.username = "";
      registrationData.value.password = "";
    } else {
      const error = await response.text();
      registrationMessage.value = `${error || "Unknown registration error"}`;
    }
  }

  async function loginUser() {
    loginMessage.value = undefined;

    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData.value),
    });

    if (response.ok) {
      const { accessToken } = await response.json();

      localStorage.setItem("accessToken", accessToken);

      loginMessage.value = "Login successful!";
      loginData.value.username = "";
      loginData.value.password = "";

      router.push("/tasks");
    } else {
      const error = await response.text();
      loginMessage.value = `${error || "Invalid credentials"}`;
    }
  }
</script>

<template>
  <div class="w-full h-full flex items-center justify-center">
    <div class="max-w-4xl flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="w-full md:w-1/2 p-6 max-md:border-b md:border-r border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Register</h2>
        <form @submit.prevent="registerUser" class="space-y-4">
          <div>
            <label class="block text-gray-700 mb-1">Username</label>
            <input
              type="text"
              v-model="registrationData.username"
              class="w-full px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label class="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              v-model="registrationData.password"
              class="w-full px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter your password"
              required
              minlength="8"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600"
          >
            Register
          </button>
          <p
            v-if="registrationMessage"
            class="text-sm text-center mt-2"
            :class="
              registrationMessage.startsWith('Registration successful')
                ? 'text-emerald-500'
                : 'text-red-500'
            "
          >
            {{ registrationMessage }}
          </p>
        </form>
      </div>
      <div class="w-full md:w-1/2 p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Login</h2>
        <form @submit.prevent="loginUser" class="space-y-4">
          <div>
            <label class="block text-gray-700 mb-1">Username</label>
            <input
              type="text"
              v-model="loginData.username"
              class="w-full px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label class="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              v-model="loginData.password"
              class="w-full px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600"
          >
            Login
          </button>
          <p
            v-if="loginMessage"
            class="text-sm text-center mt-2"
            :class="loginMessage === 'Login successful!' ? 'text-emerald-500' : 'text-red-500'"
          >
            {{ loginMessage }}
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
