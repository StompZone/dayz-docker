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
        searchText: false,
        servers: [],
        steamStatus: {
            appid: 0,
            experimentalInstalled: false,
            loggedIn: false,
            stableInstalled: false,
            version: ''
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
            this.stream = true
            if (streamText) {
                this.streamText += streamText
            } else {
                this.streamText = ''
            }
        },
        setStreamLoading(streamLoading) {
            this.streamLoading = streamLoading
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
