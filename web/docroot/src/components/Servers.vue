<script setup>
import { useAppStore} from '@/store.js'
const store = useAppStore()
</script>

<template>
	<div v-if="store.servers.length > 0">
		<h1>{{ $t('Servers') }}</h1>
	</div>
	<div v-else>
		{{ $t('No servers have been created') }}
	</div>
</template>
