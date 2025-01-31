<script setup>
import { useAppStore} from '@/store.js'
const store = useAppStore()
</script>

<template>
	<div v-if="store.servers.length === 0">
		{{ $t('No servers have been created') }}
	</div>
	<div>
		Add a server:
	</div>
</template>
