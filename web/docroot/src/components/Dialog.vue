<script setup>
import Dialog from 'primevue/dialog'
import { useAppStore } from '@/store.js'
const store = useAppStore()
</script>

<template>
	<Dialog v-model:visible="store.stream" maximizable modal :style="{ width: '50rem' }">
		<template #header>
			<div class="grid">
				<div class="col align-content-center justify-content-center"><i class="pi pi-exclamation-circle" style="color: green;"></i></div>
				<div class="col align-content-center justify-content-center white-space-nowrap">{{ $t('Server Output') }}</div>
			</div>
		</template>
		<template #default>
			<div class="steamcmd">
				<pre class="pre">{{ store.streamText }}</pre>
			</div>
		</template>
		<template #footer>
			<i v-if="store.streamLoading" class="pi pi-spin pi-cog" style="color: red;"></i>
			<i v-else class="pi pi-check" style="color: green;"></i>
		</template>
	</Dialog>
	<Dialog v-model:visible="store.alert" modal :header="$t('Alert')" :style="{ width: '25rem' }">
		<template #header>
			<div class="grid">
				<div class="col align-content-center justify-content-center"><i class="pi pi-exclamation-circle" style="color: green;"></i></div>
				<div class="col align-content-center justify-content-center">{{ $t('Alert') }}</div>
			</div>
		</template>
		{{ store.alertText }}
	</Dialog>
	<Dialog v-model:visible="store.error" modal :header="$t('Error')" :style="{ width: '25rem' }">
		<template #header>
			<div class="grid">
				<div class="col align-content-center justify-content-center"><i class="pi pi-exclamation-triangle" style="color: red;"></i></div>
				<div class="col align-content-center justify-content-center">{{ $t('Error') }}</div>
			</div>
		</template>
		{{ store.errorText }}
	</Dialog>
</template>

<style scoped>
.steamcmd {
	min-height: 300px;
}
.pre {
	white-space: pre-wrap;
}
</style>
