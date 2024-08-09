<script setup>

import Button from 'primevue/button'
import { useAppStore } from '@/store.js'
import { useFetch } from '@vueuse/core'
const store = useAppStore()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const test = async (type) => {
	const { data, error } = await useFetch('/test?type=' + type).get().json()
	if (data.value.alert) {
		store.setAlert(t(data.value.alert))
	} else if (data.value.error) {
		store.setError(t(data.value.error))
	} else if (error) {
		store.setError(t(error.value))
	} else {
		store.setError(t('Unknown error'))
	}
}

const continuous = async () => {
	store.setAlert('')
	store.alertLoading = true
	const url = '/test?type=continuous'
	const response = await fetch(url)
	for await (const chunk of response.body) {
		store.alertText += new TextDecoder().decode(chunk)
	}
	store.alertLoading = false
}

</script>

<template>
  <div class="grid">
		<div class="col-6 col-offset-3">
			<div>
				{{ $t('Logged into Steam') }}:
				<span v-if="store.steamStatus.loggedIn" class="pi pi-check" style="color: green"></span>
				<span v-else class="pi pi-times" style="color: red"></span>
			</div>
		</div>
	</div>
	<div class="grid">
		<div class="col-6 col-offset-3">
			<div>
				{{ $t('Stable Server files installed') }}:
				<span v-if="store.steamStatus.stableInstalled" class="pi pi-check" style="color: green"></span>
				<span v-else class="pi pi-times" style="color: red"></span>
			</div>
		</div>
	</div>
	<div class="grid">
		<div class="col-6 col-offset-3">
			<div>
				{{ $t('Experimental Server files installed') }}:
				<span v-if="store.steamStatus.experimentalInstalled" class="pi pi-check" style="color: green"></span>
				<span v-else class="pi pi-times" style="color: red"></span>
			</div>
		</div>
	</div>
	<div class="grid">
		<div class="col-6 col-offset-3">
			<div v-if="store.steamStatus.version">
				{{ $t('Version') }}: <span style="color: green;">{{ store.steamStatus.version }}</span>
				<span class="bold">({{ store.steamStatus.appid }})</span>
			</div>
		</div>
	</div>
	<div class="grid">
		<div class="col-6 col-offset-3">
			<div>
				<Button @click="store.alertText = $t('This is an alert message')">{{ $t('Test alert') }}</Button>
			</div>
		</div>
	</div>
	<div class="grid">
		<div class="col-6 col-offset-3">
			<div>
				<Button @click="store.errorText = $t('This is an error message')">{{ $t('Test error') }}</Button>
			</div>
		</div>
	</div>
	<div class="grid">
		<div class="col-6 col-offset-3">
			<div>
				<Button @click="test('alert')">{{ $t('Test server alert response') }}</Button>
			</div>
		</div>
	</div>
	<div class="grid">
		<div class="col-6 col-offset-3">
			<div>
				<Button @click="test('error')">{{ $t('Test server error response') }}</Button>
			</div>
		</div>
	</div>
	<div class="grid">
		<div class="col-6 col-offset-3">
			<div>
				<Button @click="continuous">{{ $t('Test server continuous output') }}</Button>
			</div>
		</div>
	</div>
</template>
