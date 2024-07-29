<script setup>
import Button from 'primevue/button'
import { useAppStore } from '@/store.js'
const store = useAppStore()
</script>

<template>
  <div class="col">
		<div>
			{{ $t('Logged into Steam') }}:
			<span v-if="store.steamStatus.loggedIn" class="pi pi-check" style="color: green"></span>
			<span v-else class="pi pi-times" style="color: red"></span>
		</div>
    <div>
      {{ $t('Server files installed') }}:
      <span v-if="store.steamStatus.installed" class="pi pi-check" style="color: green"></span>
      <span v-else class="pi pi-times" style="color: red"></span>
    </div>
    <div v-if="store.steamStatus.version">
      {{ $t('Version') }}: <span style="color: green;">{{ store.steamStatus.version }}</span>
      <span class="bold">({{ store.steamStatus.appid }})</span>
    </div>
		<div>
			<Button @click="store.errorText = $t('This is an error message')">{{ $t('Test error') }}</Button>
		</div>
  </div>
</template>
