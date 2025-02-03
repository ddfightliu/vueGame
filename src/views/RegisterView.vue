<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { supabase } from '../services/supabase';

export default {
  setup() {
    const email = ref('');
    const password = ref('');

    const register = async () => {
      const { error } = await supabase.auth.signUp({ email: email.value, password: password.value });
      if (error) {
        alert(error.message);
      } else {
        this.$router.push('/login');
      }
    };

    return { email, password, register };
  },
};
</script>
