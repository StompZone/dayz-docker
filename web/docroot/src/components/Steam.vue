<script setup>
import { ref } from 'vue'
import { useFetch } from '@vueuse/core'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import { useAppStore } from '@/store.js'
const store = useAppStore()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
function steamStatus(data) {
	console.log(data)
	if (data.errorCode === 0) {
		store.setAlert(t('Successfully logged in to Steam'))
		store.steamStatus.loggedIn = true
	} else {
		store.setError(t(data.errorMessage))
		store.steamStatus.loggedIn = false
	}
}
async function logOut() {
	const { data } = await useFetch('/logout').get().json()
	steamStatus(data)
}
async function login(e) {
	loading.value = true
	e.preventDefault()
	const { data } = await useFetch('/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username: username.value,
			password: password.value,
			remember: remember.value,
			steamGuardCode: steamGuardCode.value
		}).post().json()
	})
	loading.value = false
	steamStatus(data)
}
let loading = ref(false)
let username = ref('')
let password = ref('')
let remember = ref(false)
let steamGuardCode = ref('')
</script>

<template>
	<div>
		<div v-if="store.steamStatus.loggedIn" class="grid">
			<div class="col-12">{{ $t('Already logged in to steam') }}</div>
			<div class="col-12">
				<Button @click="logOut">{{ $t('Log out') }}</Button>
			</div>
		</div>
		<div v-else class="grid">
			<div class="col-12">
				<h2>{{ $t('There are no saved Steam credentials. To install the server files and mods, please login to Steam') }}</h2>
			</div>
			<div class="col-12">
			</div>
			<div class="col-2 col-offset-4 text-right">
				<label for="username">{{ $t('Username') }}</label>
			</div>
			<div class="col-2 text-left">
				<InputText id="username" v-model="username" />
			</div>
			<div class="col-2 col-offset-4 text-right">
				<label for="password">{{ $t('Password') }}</label>
			</div>
			<div class="col-2 text-left">
				<Password id="password" v-model="password" :feedback="false" toggleMask />
			</div>
			<div class="col-2 col-offset-4 text-right">
				<label for="steamGuardCode">{{ $t('Steam Guard Code') }}</label>
			</div>
			<div class="col-2 text-left">
				<InputText id="steamGuardCode" v-model="steamGuardCode" />
			</div>
			<div class="col-2 col-offset-4 text-right">
				<label for="remember">{{ $t('Remember Credentials') }}</label>
			</div>
			<div class="col-2 text-left">
				<Checkbox id="remember" v-model="remember" binary />
			</div>
			<div class="col-12 text-center">
				<Button @click="login" :icon="loading ? 'pi pi-spin pi-spinner' : ''">{{ $t('Submit') }}</Button>
			</div>
		</div>
	</div>
</template>
