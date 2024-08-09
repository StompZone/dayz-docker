/*
 A DayZ Linux server provisioning system.

 This is the web UI for provisioning a DayZ server running under Linux.
 It manages the main container that installs and maintains the base DayZ server files
 along with all mod base files. The goal being to keep all of these centralized and consistent,
 but to also make them available for the creation of server containers.
 */
import express from 'express'
import ViteExpress from 'vite-express'
import path from 'path'
import fs from 'fs'
import https from 'https'
import { spawn } from 'child_process'
import { config } from "./docroot/src/config.js";

/*
 File path delimiter
 */
const d = '/'

/*
 XML config files the system can handle. These are retrieved from values in templates located in /files/mods/:modId
 */
const configFiles = [
    'cfgeventspawns.xml',
    'cfgspawnabletypes.xml',
    'events.xml',
    'types.xml',
]

// From https://helpthedeadreturn.wordpress.com/2019/07/17/dayz-sa-mission-file
const allConfigFiles = {
    "db": [ // global server config and core loot economy files
        "events.xml", // dynamic events
        "globals.xml", // global settings
        "messages.xml", // server broadcast messages and shutdown
        "types.xml" // loot table
    ],
    "env": [ // coordinates, static and dynamic spawns for each entity
        "cattle_territories.xml",
        "domestic_animals_territories.xml",
        "hare_territories.xml",
        "hen_territories.xml",
        "pig_territories.xml",
        "red_deer_territories.xml",
        "roe_deer_territories.xml",
        "sheep_goat_territories.xml",
        "wild_boar_territories.xml",
        "wolf_territories.xml",
        "zombie_territories.xml"
    ],
    "root": [
        "cfgeconomycore.xml", // loot economy core settings and extensions
        "cfgeffectarea.json", // static contaminated area coordinates and other properties
        "cfgenvironment.xml", // includes env\* files and parameters
        "cfgeventgroups.xml", // definitions of groups of objects that spawn together in a dynamic event
        "cfgeventspawns.xml", // coordinates where events may occur
        "cfggameplay.json", // gameplay configuration settings.
        "cfgIgnoreList.xml", //  list of items that won’t be loaded from the storage
        "cfglimitsdefinition.xml", // list of valid categories, tags, usageflags and valueflags
        "cfglimitsdefinitionuser.xml", // shortcut groups of usageflags and valueflags
        "cfgplayerspawnpoints.xml", // new character spawn points
        "cfgrandompresets.xml", // collection of groups of items
        "cfgspawnabletypes.xml", // loot categorization (ie hoarder) as well as set of items that spawn as cargo or as attachment on weapons, vehicles or infected.
        "cfgundergroundtriggers.json", // used for triggering light and sounds in the Livonia bunker, not used for Chernarus
        "cfgweather.xml", // weather configuration
        "init.c", // mission startup file (PC only)
        "map*.xml",
        "mapgroupproto.xml", // structures, tags, maxloot and lootpoints
        "mapgrouppos.xml" // all valid lootpoints
    ]
}

const getVersion = () => {
    return "1.25.bogus"
}

const getDirSize = (dirPath) => {
    let size = 0
    if (! fs.existsSync(dirPath)) return size
    const files = fs.readdirSync(dirPath)
    for (let i = 0; i < files.length; i++) {
        const filePath = path.join(dirPath, files[i])
        const stats = fs.statSync(filePath)
        if (stats.isFile()) {
            size += stats.size
        } else if (stats.isDirectory()) {
            size += getDirSize(filePath)
        }
    }
    return size
}

const getCustomXML = (modId) => {
    const ret = []
    if (! fs.existsSync(config.modDir)) return ret
    for(const file of configFiles) {
        if (fs.existsSync(config.modDir + d + modId + d + file)) {
            ret.push({name:file})
        }
    }
    return ret
}

const getModNameById = (id) => {
    const files = fs.readdirSync(config.serverFiles, {encoding: 'utf8', withFileTypes: true})
    for (const file of files) {
        if (file.isSymbolicLink()) {
            const sym = fs.readlinkSync(serverFiles + d + file.name)
            if(sym.indexOf(id) > -1) return file.name
        }
    }
    return ''
}

const getMods = () => {
    const mods = []
    if (! fs.existsSync(config.modDir)) return mods
    fs.readdirSync(config.modDir).forEach(file => {
        const name = getModNameById(file)
        mods.push({name:name,id:file})
    })
    return mods
}

const sendError = (res, message) => {
    res.send({"errorCode": 42, "error": message})
}

const sendAlert = (res, message) => {
    res.send({"alert": message})
}

const steamcmd = async (args, res) => {
    return new Promise((resolve) => {
        let stdout = ''
        let stderr = ''
        const command = 'steamcmd +force_install_dir ' + config.serverFiles + ' ' + args + ' +quit'
        console.log(command)
        const proc = spawn(command, {shell: true})
        proc.stdout.on('data', (data) => {
            const out  = "[OUT] " + data + "\n"
            console.log(out)
            res.write(out)
            stdout += out
        })
        proc.stderr.on('data', (data) => {
            const err = "[ERROR] " + data + "\n"
            console.log(err)
            stderr += err
        })
        proc.on('error', (data) => {
            const err = "[ERROR] " + data + "\n"
            console.log(err)
            stderr += err
        })
        proc.on('close', (errorCode) => {
            console.log("Close")
            resolve({ out: stdout, err: stderr, errorCode: errorCode })
        })
    })
}

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.disable('etag')

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*'])
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.append('Access-Control-Allow-Headers', 'Content-Type')
    next()
})

// Install a mod
app.get(('/install/:modId'), (req, res) => {
    const modId = req.params["modId"]
    // Shell out to steamcmd, monitor the process, and display the output as it runs
    res.send(modId + " was installed")
})

// Install base files
app.get('/installbase', async (req, res) => {
    let which = req.query?.which
    const username = fs.readFileSync(config.loginFile, 'utf8')
    if (which === "experimental") {
        which = config.experimental_server_appid
    } else if (which === "stable") {
        which = config.stable_server_appid
    } else {
        sendError(res, "Invalid base file type")
    }
    let args = `+login "${username}" +app_update "${which}" validate`
    const result = await steamcmd(args, res)
    if (result.errorCode === 0) {
    }
    res.send(result)
})

// Login to Steam
app.post(('/login'), async (req, res) => {
    const username = req.body?.username;
    const password = req.body?.password;
    const steamGuardCode = req.body?.steamGuardCode;
    const remember = req.body?.remember;
    let args = `+login "${username}" "${password}"`
    if (steamGuardCode) args += ` "${steamGuardCode}"`
    const result = await steamcmd(args)
    if (result.errorCode === 0) {
        if (remember) {
            console.log("Writing login file")
            fs.writeFileSync(config.loginFile, username)
        }
    }
    res.append('Content-Type', 'application/json')
    res.send(result)
})

// Logout from Steam
app.get(('/logout'), async (req, res) => {
    let result = {"status": 304}
    if (fs.existsSync(config.loginFile)) {
        fs.unlinkSync(config.loginFile, (err) => {
            if (err) {
                result.status = 500
                result.error = err
            }
            result.status = 200
        })
    }
    res.append('Content-Type', 'application/json')
    res.send(result)
})

// Get mod metadata by ID
app.get('/mod/:modId', (req, res) => {
    const modId = req.params["modId"]
    const modDir = config.modDir + d + modId
    const customXML = getCustomXML(modId)
    const ret = {
        id: modId,
        name: getModNameById(modId),
        size: getDirSize(modDir),
        customXML: customXML
    }
    res.send(ret)
})

// Get a mod's XML file
app.get('/mod/:modId/:file', (req, res) => {
    const modId = req.params["modId"]
    const file = req.params["file"]
    if (fs.existsSync(config.modDir + d + modId + d + file)) {
        const contents = fs.readFileSync(config.modDir + d + modId + d + file)
        res.set('Content-type', 'application/xml')
        res.send(contents)
    }
})

/*
 Get all mod metadata
 */
app.get('/mods', (req, res) => {
    const mods = getMods()
    const ret = {
        "mods": mods
    }
    res.send(ret)
})

// Remove a mod
app.get(('/remove/:modId'), (req, res) => {
    const modId = req.params["modId"]
    // Shell out to steamcmd, monitor the process, and display the output as it runs
    res.send(modId + " was removed")
})

// Search for a mod
app.get(('/search/:searchString'), (req, res) => {
    const searchString = req.params["searchString"]
    const url = config.searchUrl + searchString
    // const url = "https://api.steampowered.com/IPublishedFileService/QueryFiles/v1/?numperpage=1000&appid=221100&return_short_description=true&strip_description_bbcode=true&key=" + config.steamAPIKey + "&search_text=" + searchString
    https.get(url, resp => {
        let data = '';
        resp.on('data', chunk => {
            data += chunk;
        });
        resp.on('end', () => {
            res.send(JSON.parse(data))
        })
    }).on('error', err => {
        console.log(err.message)
    })
})

/*
 Get the status of things:
 If the base files are installed, the version of the server, the appid (If release or experimental)
 */
app.get('/status', (_, res) => {
    const installed = fs.existsSync(config.installFile)
    const loggedIn = fs.existsSync(config.loginFile)
    const ret = {
        "appid": config.appid_version,
        "installed": installed,
        "loggedIn": loggedIn,
    }
    if (installed) {
        ret.version = getVersion()
    }
    res.send(ret)
})

app.get('/test', async (req, res) => {
    const type = req.query.type
    if (type === "error") {
        const ret = {
            "errorCode": 42,
            "alert": "This is a test server error",
        }
        res.send(ret)
    } else if (type === "alert") {
        const ret = {
            "errorCode": 0,
            "alert": "This is a test server alert",
        }
        res.send(ret)
    } else if (type === "continuous") {
        res.set('Content-Type', 'text/plain')
        res.write("data: This is a test server continuous output 1\n")
        await new Promise(resolve => setTimeout(resolve, 1000));
        res.write("data: This is a test server continuous output 2\n")
        await new Promise(resolve => setTimeout(resolve, 1000));
        res.write("data: This is a test server continuous output 3 but it's a very long line intended to force wrapping of text because the length is so long and the girth is so gorth\n")
        await new Promise(resolve => setTimeout(resolve, 1000));
        res.write("data: This is a test server continuous output 4\nDone!")
        res.end()
    } else {
        res.send("Unknown test type")
    }
})

// Update base files
app.get('/updatebase', (req, res) => {
    res.send("Base files were updated")
})

// Update mods
app.get('/updatemods', (req, res) => {
    res.send("Mod files were updated")
})

ViteExpress.listen(app, config.port, () =>
    console.log(`Server is listening on port ${config.port}`)
)
