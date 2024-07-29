<script setup>
import { useFetch } from '@vueuse/core'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import { useAppStore } from '@/store.js'
const store = useAppStore()
async function logOut() {
	const response = await useFetch('/logout')
	if (response.ok) {
		store.steamStatus.loggedIn = false
	} else if (response.err) {
		store.errorText = response.err
	}
}
function submit(e) {
	console.log("Submit")
}
let username = ''
let password = ''
let remember = false
let steamGuardCode = ''
</script>

<template>
	<div v-if="store.steamStatus.loggedIn">
		<div>{{ $t('Already logged in to steam') }}</div>
		<div>
			<Button @click="logOut">{{ $t('Log out') }}</Button>
		</div>
	</div>
	<div class="grid">
		<div class="col-6 col-offset-3">
			<div class="flex flex-column gap-2">
				{{ $t('There are no saved Steam credentials. To install the server files and mods, please login to Steam') }}
			</div>
			<div class="">
			</div>
			<div class="flex flex-column gap-2">
				<label for="username">{{ $t('Username') }}</label>
				<InputText id="username" v-model="username" />
			</div>
			<div class="flex flex-column gap-2">
				<label for="password">{{ $t('Password') }}</label>
				<Password id="username" v-model="password" :feedback="false" toggleMask />
			</div>
			<div class="flex flex-column gap-2">
				<label for="steamGuardCode">{{ $t('Steam Guard Code') }}</label>
				<InputText id="steamGuardCode" v-model="steamGuardCode" />
			</div>
			<div class="flex flex-column gap-2">
				<label for="remember">{{ $t('Remember Credentials') }}</label>
				<Checkbox v-model="remember" />
			</div>
			<div class="flex flex-column gap-2">
				<Button type="submit" onclick="submit()">{{ $t('Submit') }}</Button>
			</div>
		</div>
	</div>
</template>
