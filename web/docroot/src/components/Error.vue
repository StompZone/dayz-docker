<script setup>
import Dialog from 'primevue/dialog'
import { useAppStore } from '@/store.js'
const store = useAppStore()
</script>

<template>
	<Dialog v-model:visible="store.alert" maximizable modal :style="{ width: '50rem' }">
		<template #header>
			<div>
				{{ $t('Alert') }}
			</div>
		</template>
		<template #default>
			<div class="steamcmd">
				<pre class="pre">{{ store.alertText }}</pre>
			</div>
		</template>
		<template #footer>
			<i v-if="store.alertLoading" class="pi pi-spin pi-cog" style="color: red;"></i>
			<i v-else class="pi pi-check" style="color: green;"></i>
		</template>
	</Dialog>
	<Dialog v-model:visible="store.error" modal :header="$t('Error')" :style="{ width: '25rem' }">
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
