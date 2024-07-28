import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => ({
        errorText: '',
        modId: 0,
        modFile: '',
        messageText: '',
        mods: [],
        searchText: '',
        section: 'mods',
        steamStatus: {appid: 0, installed: false, loggedIn: false, version: ''},
    })
})
