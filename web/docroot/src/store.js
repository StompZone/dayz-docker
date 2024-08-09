import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => ({
        alert: false,
        alertLoading: false,
        alertText: '',
        error: false,
        errorText: '',
        loading: false,
        modId: 0,
        modFile: false,
        messageText: false,
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
    }),
    actions: {
        setAlert(alertText, loading = false) {
            this.alert = true
            this.setAlertLoading(loading)
            if (loading) {
                this.alertText += alertText
            } else {
                this.alertText = alertText
            }
        },
        setAlertLoading(alertLoading) {
            this.alertLoading = alertLoading
        },
        setError(error) {
            this.error = error
        },
        setLoading(loading) {
            this.loading = loading
        },
        setModId(modId) {
            this.modId = modId
        },
        setModFile(modFile) {
            this.modFile = modFile
        },
        setMessageText(messageText) {
            this.messageText = messageText
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
