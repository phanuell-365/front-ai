<script setup lang="ts">
import {useField} from "vee-validate";
import {useRouter} from "vue-router";
import {reactive, watch, ref} from "vue";
import {googleTokenLogin, decodeCredential} from "vue3-google-login"
import {useAuthStore} from "../../stores/auth.ts";

const router = useRouter();
const authStore = useAuthStore();

const loginData = reactive({
  email: '',
  password: '',
});

const emailValidator = (value: string) => {
  if (!value) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    return 'Email must be valid';
  }

  if (value.length > 50) {
    return 'Email must be less than 50 characters';
  }

  return true;
};

const {
  value: email,
  errorMessage: emailErrorMessage,
  meta: emailMeta,
} = useField('email', emailValidator);

watch(() => loginData.email, (value) => {
  email.value = value;
});


const passwordValidator = (value: string) => {
  if (!value) {
    return 'Password is required';
  }

  // if (value.length < 4) {
  //   return 'Password must be at least 4 characters';
  // }

  if (value.length > 50) {
    return 'Password must be less than 50 characters';
  }

  return true;
};

const {
  value: password,
  errorMessage: passwordErrorMessage,
  meta: passwordMeta,
} = useField('password', passwordValidator);

watch(() => loginData.password, (value) => {
  password.value = value;
});

const BASE_URL = import.meta.env.VITE_API_URL as string;

const loginWithGoogle = () => {
  googleTokenLogin()
      .then((response) => {
        console.log("Handle the response", response);

        fetch(`${BASE_URL}/register/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            mode: "cors",
          },
          body: JSON.stringify({
            ...response,
          }),
        })
            .then(console.log)
            .catch(console.error);

        // get user info from response
        return fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
          // body: JSON.stringify({
          // get the user phone number
          // 'scope': 'email profile openid https://www.googleapis.com/auth/user.phonenumbers.read',
          // }),
        });
      })
      .then((response) => {
        console.log("Handle the response", response)
        return response.json();
      })
      .then((userInfo) => {
        console.log("User info", userInfo)
        // use userInfo in your project
      })
}


const isLoadingResource = ref(false);
const loginFailed = ref(false);

const onLoginClick = () => {
  if (!emailMeta.valid || !passwordMeta.valid) {
    return;
  }

  loginFailed.value = false;
  isLoadingResource.value = true;


  authStore.adminLogin(loginData)
      .then((response) => {
        isLoadingResource.value = false;
        console.log(response);
        router.push({name: 'AdminHome'});
      })
      .catch((error) => {
        console.log(error);
      })
};

</script>

<template>
  <main class="w-full mx-auto p-6 flex items-center justify-center h-screen">
    <div
        class="w-full md:w-6/12 lg:w-5/12 xl:w-4/12 px-4 md:px-2 lg:px-0 mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div class="p-4 sm:p-7">
        <div class="text-center">
          <h1 class="block text-2xl font-bold text-gray-800 dark:text-white">Login</h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Don't have an account yet?
            <router-link
                class="text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                to="signup">
              Create account
            </router-link>
          </p>
        </div>

        <div class="mt-5">
          <button type="button" @click="loginWithGoogle"
                  class="btn btn-ghost btn-sm md:btn-md normal-case text-xs md:text-sm w-full border border-gray-200 shadow-sm">
            <svg class="w-4 h-auto" width="46" height="47" viewBox="0 0 46 47" fill="none">
              <path
                  d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                  fill="#4285F4"/>
              <path
                  d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                  fill="#34A853"/>
              <path
                  d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                  fill="#FBBC05"/>
              <path
                  d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                  fill="#EB4335"/>
            </svg>
            Login with Google
          </button>

          <div
              class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ms-6 dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600">
            Or
          </div>

          <!-- Form -->
          <form @submit.prevent="onLoginClick" class="my-4">
            <div class="grid gap-y-4">
              <div class="flex flex-col space-y-1">
                <div class="flex justify-between items-center">
                  <label class="label font-semibold text-sm" for="email">
                    Email
                  </label>
                  <router-link
                      class="text-sm text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                      to="forgot-password">Forgot password?
                  </router-link>
                </div>
                <input
                    id="email"
                    v-model="loginData.email"
                    :class="{'input-error': (emailMeta.validated && !emailMeta.valid), 'input-primary': emailMeta.validated && emailMeta.valid}"
                    class="input input-primary input-bordered w-full text-sm" placeholder="Email" type="text"/>
                <small v-if="(emailMeta.validated && !emailMeta.valid)"
                       class="text-sm text-rose-500">
                  {{ emailErrorMessage }}
                </small>
              </div>

              <div class="flex flex-col space-y-1">
                <label class="label font-semibold text-sm" for="password">
                  Password
                </label>
                <input
                    id="password"
                    v-model="loginData.password"
                    :class="{'input-error': (passwordMeta.validated && !passwordMeta.valid), 'input-primary': passwordMeta.validated && passwordMeta.valid}"
                    class="input input-primary input-bordered w-full text-sm" placeholder="Password" type="password"/>
                <small v-if="(passwordMeta.validated && !passwordMeta.valid)"
                       class="text-sm text-rose-500">
                  {{ passwordErrorMessage }}
                </small>
              </div>

              <div class="flex flex-col space-y-1 my-1">
                <button @click="onLoginClick" :disabled="isLoadingResource"
                        type="submit" class="btn btn-primary btn-sm md:btn-md normal-case text-xs md:text-sm w-full">
                  <span v-if="isLoadingResource" class="loading loading-md loading-spinner text-neutral-400"></span>
                  Sign
                  in
                </button>
              </div>
            </div>
          </form>
          <!-- End Form -->
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>