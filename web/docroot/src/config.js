/*
 * The stable DayZ server Steam app ID.
 */
const stable_server_appid = 223350

/*
 * The experimental DayZ server Steam app ID.
 */
const experimental_server_appid = 1042420

/*
 * DayZ release client Steam app ID. This is for mods, as only the release client has them.
 */
const client_appid = 221100

const serverFiles = "/serverfiles"
const homeDir = "/home/user"

const steamAPIKey = process?.env["STEAMAPIKEY"] || ""

const searchUrl = "https://api.steampowered.com/IPublishedFileService/QueryFiles/v1/?numperpage=1000&appid=221100&return_short_description=true&strip_description_bbcode=true&key=" + steamAPIKey + "&search_text="

const config = {
    client_appid: client_appid,
    experimental_server_appid: experimental_server_appid,
    installFile: serverFiles + "/DayZServer",
    loginFile: homeDir + "/steamlogin",
    modDir: "/mods/" + client_appid,
    port: 8000,
    searchUrl: searchUrl,
    serverFiles: serverFiles,
    stable_server_appid: stable_server_appid,
    steamUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=',
}

export { config }
