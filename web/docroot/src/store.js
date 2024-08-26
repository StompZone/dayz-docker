import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => ({
        alert: false,
        alertText: '',
        error: false,
        errorText: '',
        modId: 0,
        modFile: false,
        mods: [],
        search: false,
        searchText: '',
        servers: [],
        steamStatus: {
            installed: {
                experimental: false,
                stable: false,
            },
            loggedIn: false,
            version: {
                stable: '',
                experimental: '',
            }
        },
        stream: false,
        streamLoading: false,
        streamText: '',
    }),
    actions: {
        setAlert(alertText) {
            this.alertText = alertText
            this.alert = true
        },
        setStream(streamText) {
            this.streamText += streamText
        },
        setStreamLoading(streamLoading) {
            this.stream = true
            this.streamLoading = streamLoading
            if (streamLoading) {
                this.streamText = ''
            }
        },
        setError(error) {
            this.errorText = error
            this.error = true
        },
        setModId(modId) {
            this.modId = modId
        },
        setModFile(modFile) {
            this.modFile = modFile
        },
        setMods(mods) {
            this.mods = mods
        },
        setSearchText(searchText) {
            this.searchText = searchText
        },
        setServers(servers) {
            this.servers = servers
        },
        setSteamStatus(steamStatus) {
            this.steamStatus = steamStatus
        },
    },
})
