<script setup>
import { useAppStore } from '@/store.js'
const store = useAppStore()
</script>

<template>
  <div class="col">
		<div>
			Logged into Steam:
			<span v-if="store.steamStatus.loggedIn" class="bi bi-check h2 text-success"></span>
			<span v-else class="bi bi-x h2 danger text-danger"></span>
		</div>
    <div>
      Server files installed:
      <span v-if="store.steamStatus.installed" class="bi bi-check h2 text-success"></span>
      <span v-else class="bi bi-x h2 danger text-danger"></span>
    </div>
    <div v-if="store.steamStatus.version">
      Version: <span class="text-success fw-bold">{{ store.steamStatus.version }}</span>
      <span class="text-success fw-bold">({{ store.steamStatus.appid }})</span>
    </div>
  </div>
</template>
