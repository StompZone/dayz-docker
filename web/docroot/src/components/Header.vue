<script setup>
import Search from '@/components/Search.vue'
import Status from '@/components/Status.vue'
import Servers from '@/components/Servers.vue'
import { useFetch } from '@vueuse/core'
import { useAppStore } from '@/store.js'
const store = useAppStore()
const set = (w, e) => {
  store.section = w
  const active = Array.from(document.getElementsByClassName('active'))
  active.forEach((a) => a.classList.remove('active'))
  e.target.classList.add('active')
}
async function base() {
	let which = '/installbase'
	if (store.steamStatus.installed) {
		which = '/updatebase'
	}
	const { data } = await useFetch(which).get().json()
	store.errorText = data.value.message
}
</script>

<template>
  <div v-if="store.steamStatus" class="row">
    <div class="col-3 text-center">
      <h1>DayZ Docker Server</h1>
    </div>
    <div class="col-5">
      <button
          @click="base"
          class="btn btn-sm btn-success"
      >
        {{ store.steamStatus.installed ? "Update" : "Install" }} Server Files
      </button>
      <button @click="updatemods" class="btn btn-sm btn-outline-success">Update Mods</button>
      <button type="button" @click="set('servers', $event)" class="btn btn-sm btn-outline-primary">Servers</button>
      <button type="button" @click="set('mods', $event)" class="btn btn-sm btn-outline-primary active" data-bs-toggle="button">Mods</button>
      <button type="button" @click="set('search', $event)" class="btn btn-sm btn-outline-primary">Search</button>
    </div>
    <Search />
    <Status />
    <Servers />
  </div>
</template>
