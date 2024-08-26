<script setup>
import Dialog from 'primevue/dialog'
import { useAppStore } from '@/store.js'
const store = useAppStore()
</script>

<template>

	<Dialog v-model:visible="store.stream" maximizable modal :style="{ width: '50rem' }">
		<template #header>
			<div class="grid">
				<div class="col align-content-center justify-content-center" style="font-size: 1.5em;">
					<i v-if="store.streamLoading" class="pi pi-spin pi-cog" style="color: orange;"></i>
					<i v-else class="pi pi-exclamation-circle" style="color: green;"></i>
				</div>
				<div class="col align-content-center justify-content-center white-space-nowrap">{{ $t('Server Output') }}</div>
			</div>
		</template>
		<template #default>
			<div class="container">
				<div class="autoscroll">{{ store.streamText }}</div>
			</div>
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
.container {
	height: 300px;
	min-height: 300px;
}
.autoscroll {
	overflow-y: scroll;
	scroll-behavior: smooth;
	max-height: 100%;
	display: flex;
	flex-direction: column-reverse;
	white-space: pre-wrap;
	font-family: monospace;
}
</style>
