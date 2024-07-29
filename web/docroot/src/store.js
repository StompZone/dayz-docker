import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => ({
        errorText: false,
        modId: 0,
        modFile: false,
        messageText: false,
        mods: [],
        searchText: false,
        servers: [],
        steamStatus: {appid: 0, installed: false, loggedIn: false, version: ''},
    })
})
