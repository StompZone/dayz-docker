<script setup>
import Button from 'primevue/button'
import { useFetch } from '@vueuse/core'
import { useAppStore } from '@/store.js'
const store = useAppStore()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
async function base() {
	let which = '/installbase'
	if (store.steamStatus.stableInstalled) {
		which = '/updatebase'
	}
	const { data } = await useFetch(which).get().json()
	store.setAlert(t(data.value.message))
}
</script>

<template>
	<div class="grid">
		<div class="col-6 col-offset-3">
			<div>
				<Button @click="base('stable')" v-if="! store.steamStatus.stableInstalled">{{ store.steamStatus.stableInstalled ? $t('Update Stable Server Files') : $t('Install Stable Server Files') }}</Button>
				<span v-else>{{ $t('Stable Server files are installed') }}</span>
			</div>
		</div>
	</div>
	<div class="grid">
		<div class="col-6 col-offset-3">
			<div>
				<Button @click="base('experimental')" v-if="! store.steamStatus.experimentalInstalled">{{ store.steamStatus.experimentalInstalled ? $t('Update Experimental Server Files') : $t('Install Experimental Server Files') }}</Button>
				<span v-else>{{ $t('Experimental Server files are installed') }}</span>
			</div>
		</div>
	</div>
</template>
