<script setup>
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Files from '@/components/Files.vue'
import Home from '@/components/Home.vue'
import Steam from '@/components/Steam.vue'
import Servers from '@/components/Servers.vue'
import Mods from '@/components/Mods.vue'
import Status from '@/components/Status.vue'
</script>

<template>
	<div class="grid">
		<div class="col-8 col-offset-2 text-center">
			<Tabs value="0">
				<TabList>
					<Tab value="0">{{ $t('Home') }}</Tab>
					<Tab value="1">{{ $t('Steam') }}</Tab>
					<Tab value="2">{{ $t('Files') }}</Tab>
					<Tab value="3">{{ $t('Mods') }}</Tab>
					<Tab value="4">{{ $t('Servers') }}</Tab>
					<Tab value="5">{{ $t('Status') }}</Tab>
				</TabList>
				<TabPanels>
					<TabPanel value="0">
						<Home />
					</TabPanel>
					<TabPanel value="1">
						<Steam />
					</TabPanel>
					<TabPanel value="2">
						<Files />
					</TabPanel>
					<TabPanel value="3">
						<Mods />
					</TabPanel>
					<TabPanel value="4">
						<Servers />
					</TabPanel>
					<TabPanel value="5">
						<Status />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</div>
	</div>
</template>
