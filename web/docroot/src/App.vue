<script setup>
import Error from '@/components/Error.vue'
import Login from '@/components/Login.vue'
import Main from '@/components/Main.vue'
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
      <Error />
			<Login v-if="! store.steamStatus.loggedIn" />
      <Main v-else />
    </main>
  </Suspense>
</template>
