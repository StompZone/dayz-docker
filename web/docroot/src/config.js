// The STEAMAPIKEY is added to this file from the value in the .env file.
import env from '/web/env.json' assert { type: "json" }

// The stable DayZ server Steam app ID.
const server_appid_stable = 223350

// The experimental DayZ server Steam app ID.
const server_appid_experimental = 1042420

// DayZ release client Steam app ID. This is for mods, as only the release client has them.
const client_appid = 221100

const server_files_stable = "/serverfiles"
const server_files_experimental = "/serverfiles_experimental"
const home_dir = "/home/user"

const search_url = `https://api.steampowered.com/IPublishedFileService/QueryFiles/v1/?numperpage=1000&appid=221100&return_short_description=true&strip_description_bbcode=true&key=${env.STEAMAPIKEY}&search_text=`

const config = {
    appid: {
        client: client_appid,
        experimental: server_appid_experimental,
        stable: server_appid_stable,
    },
    client_appid: client_appid,
    install_file: {
        experimental: server_files_experimental + "/DayZServer",
        stable: server_files_stable + "/DayZServer",
    },
    login_file: home_dir + "/steamlogin",
    mod_dir: "/mods/" + client_appid,
    port: 8000,
    search_url: search_url,
    server_appid: {
        experimental: server_appid_experimental,
        stable: server_appid_stable,
    },
    server_files: {
        experimental: server_files_experimental,
        stable: server_files_stable,
    },
    steamUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=',
    version: {
        experimental: "1.26.56789",
        stable: "1.26.123456",
    },
    version_experimental: "1.26.56789",
    version_stable: "1.26.123456",
}

export { config }
