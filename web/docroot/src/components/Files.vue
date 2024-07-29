<script setup>
import Button from 'primevue/button'
import { useFetch } from '@vueuse/core'
import { useAppStore } from '@/store.js'
const store = useAppStore()
async function base() {
	let which = '/installbase'
	if (store.steamStatus.installed) {
		which = '/updatebase'
	}
	const { data } = await useFetch(which).get().json()
	store.errorText = data.value.message
}
</script>

<template>
	<Button @click="base" v-if="store.steamStatus.installed">{{ store.steamStatus.installed ? $t('Update Server Files') : $t('Install Server Files') }}</Button>
	<span v-else>{{ $t('Server files not installed') }}</span>
</template>
