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
async function logOut() {
	const { data } = await useFetch('/logout').get().json()
	if (data.value.errorCode === 0) {
		store.setAlert(t('Successfully logged out of Steam'))
		store.steamStatus.loggedIn = false
	} else if (data.errorMessage) {
		store.setError(t(data.errorMessage))
	}	else {
		store.setError(t('Unknown error'))
	}
}
async function login() {
	const url = '/login'
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username: username.value,
			password: password.value,
			remember: remember.value,
			steamGuardCode: steamGuardCode.value
		})
	})
	store.setStreamLoading(true)
	for await (const chunk of response.body) {
		store.setStream(new TextDecoder().decode(chunk), true)
	}
	store.setStreamLoading(false)
	const data = JSON.parse(store.streamText.match(/({.*})/)[1])
	if (data.errorCode === 0) {
		store.setAlert(t('Successfully logged in to Steam'))
		store.steamStatus.loggedIn = true
	} else if (data.errorMessage) {
		store.setError(t(data.errorMessage))
	} else {
		store.setError(t('Unknown error'))
	}
}
let username = ref('')
let password = ref('')
let remember = ref(false)
let steamGuardCode = ref('')
</script>

<template>
	<div v-if="store.steamStatus.loggedIn" class="grid">
		<div class="col-4 col-offset-4 text-center">{{ $t('Already logged in to steam') }}</div>
		<div class="col-12">
			<Button @click="logOut" severity="danger">{{ $t('Log out') }}</Button>
		</div>
	</div>
	<div v-else class="grid">
		<div class="col-4 col-offset-4 text-left">
			{{ $t('There are no saved Steam credentials. To install the server files and mods, please login to Steam') }}
		</div>
		<div class="col-4 col-offset-4 text-right">
			<div class="col-6 text-left p-0">
				<label for="username">{{ $t('Username') }}</label>
				<InputText id="username" v-model="username" autofocus />
			</div>
		</div>
		<div class="col-4 col-offset-4 text-right">
			<div class="col-6 text-left p-0">
				<label for="password">{{ $t('Password') }}</label>
				<Password id="password" v-model="password" :feedback="false" toggleMask />
			</div>
		</div>
		<div class="col-4 col-offset-4 text-right">
			<div class="col-6 text-left p-0">
				<label for="steamGuardCode">{{ $t('Steam Guard Code') }}</label>
				<InputText id="steamGuardCode" v-model="steamGuardCode" />
			</div>
		</div>
		<div class="col-4 col-offset-4 text-right">
			<div class="col-6 text-left p-0">
				<label for="remember">{{ $t('Remember Credentials') }}</label>
				<Checkbox inputId="remember" v-model="remember" binary />
			</div>
		</div>
		<div class="col-4 col-offset-4 text-left">
			<Button type="button" @click="login" :loading="store.streamLoading" icon="pi pi-user" :label="$t('Submit')"></Button>
		</div>
	</div>
</template>
