<script setup>
import Dialog from '@/components/Dialog.vue'
import Header from '@/components/Header.vue'
import { useFetch } from '@vueuse/core'
import { useAppStore } from '@/store.js'
const store = useAppStore()
useFetch('/status', {
	afterFetch(response) {
		store.steamStatus = response.data
		return response
	}
}).get().json()
</script>

<template>
  <Suspense>
    <main>
      <Dialog />
      <Header />
    </main>
  </Suspense>
</template>
