<template>
    <div class="login-view">
        <h1>Login</h1>
        <form @submit.prevent="login">
            <div>
                <label for="username">Username:</label>
                <input type="text" id="username" v-model="username" required />
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password" required />
            </div>
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'LoginView',
    data() {
        return {
            username: '',
            password: ''
        };
    },
    methods: {
        login() {
            // Handle login logic here
            console.log('Username:', this.username);
            console.log('Password:', this.password);
        }
    }
};
</script>

<style scoped>
.login-view {
    max-width: 400px;
    margin: 0 auto;
    padding: 1em;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.login-view h1 {
    text-align: center;
}

.login-view form {
    display: flex;
    flex-direction: column;
}

.login-view div {
    margin-bottom: 1em;
}

.login-view label {
    margin-bottom: 0.5em;
    color: #333333;
}

.login-view input {
    padding: 0.5em;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.login-view button {
    padding: 0.7em;
    font-size: 1em;
    color: #fff;
    background-color: #007BFF;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.login-view button:hover {
    background-color: #0056b3;
}
</style>