<script setup>
import Button from 'primevue/button'
import { useAppStore } from '@/store.js'
const store = useAppStore()
async function install(which) {
	const url = '/install/server/' + which
	store.setStreamLoading(true)
	const response = await fetch(url)
	for await (const chunk of response.body) {
		store.setStream(new TextDecoder().decode(chunk), true)
	}
	store.setStreamLoading(false)
	const data = JSON.parse(store.streamText.match(/({.*})/)[1])
	if (data.errorCode === 0) {
		store.setAlert(t('Successfully installed server files'))
		store.steamStatus.installed[which] = true
	} else if (data.errorMessage) {
		store.setError(t(data.errorMessage))
	} else {
		store.setError(t('Unknown error'))
	}
}
</script>

<template>
	<div v-if="! store.steamStatus.loggedIn" class="grid">
		<div class="col-6 col-offset-3">
			{{ $t('Please log in to Steam to install server files') }}
		</div>
	</div>
	<div class="grid">
		<div class="col-6 col-offset-3">
			<div>
				<Button v-if="! store.steamStatus.installed['stable']" @click="install('stable')" :disabled="! store.steamStatus.loggedIn">{{ $t('Install Stable Server Files') }}</Button>
				<Button v-else severity="warn" @click="install('stable')" :disabled="! store.steamStatus.loggedIn">{{ $t('Stable Server files are installed')  + ' - ' + $t('Update Stable Server Files') }}</Button>
			</div>
		</div>
	</div>
	<div class="grid">
		<div class="col-6 col-offset-3">
			<div>
				<Button v-if="! store.steamStatus.installed['experimental']" @click="install('experimental')" :disabled="! store.steamStatus.loggedIn">{{ store.steamStatus.installed_experimental ? $t('Update Experimental Server Files') : $t('Install Experimental Server Files') }}</Button>
				<Button v-else severity="warn" @click="install('experimental')" :disabled="! store.steamStatus.loggedIn">{{ $t('Experimental Server files are installed') + ' - ' + $t('Update Experimental Server Files') }}</Button>
			</div>
		</div>
	</div>
</template>
