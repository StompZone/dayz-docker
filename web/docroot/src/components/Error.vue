<script setup>
import Dialog from 'primevue/dialog'
import { useAppStore } from '@/store.js'
const store = useAppStore()
</script>

<template>
	<Dialog v-model:visible="store.errorText" modal :header="$t('Error')" :style="{ width: '25rem' }">
		{{ store.errorText }}
	</Dialog>
</template>
