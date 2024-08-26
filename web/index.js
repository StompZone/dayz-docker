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
import { config } from './docroot/src/config.js'

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
    if (! fs.existsSync(config.mod_dir)) return ret
    for(const file of configFiles) {
        if (fs.existsSync(config.mod_dir + d + modId + d + file)) {
            ret.push({name:file})
        }
    }
    return ret
}

const getModNameById = (id) => {
    const files = fs.readdirSync(config.server_files, {encoding: 'utf8', withFileTypes: true})
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
    if (! fs.existsSync(config.mod_dir)) return mods
    fs.readdirSync(config.mod_dir).forEach(file => {
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

const cmd = async (command, args, res) => {
    return new Promise((resolve) => {
        let stdout = ''
        let stderr = ''
        const re = /(\u001b\[.*?m)/g
        console.log(command, args)
        const proc = spawn(command, args)
        proc.stdout.on('data', (data) => {
            const out  = "[OUT] " + data.toString().replace(re,'') + "\n"
            console.log(out)
            res.write(out)
            stdout += out
        })
        proc.stderr.on('data', (data) => {
            const err = "[ERROR] " + data.toString().replace(re,'') + "\n"
            res.write(err)
            console.log(err)
            stderr += err
        })
        proc.on('error', (data) => {
            const err = "[ERROR] " + data.toString().replace(re,'') + "\n"
            console.log(err)
            stderr += err
        })
        proc.on('close', (errorCode) => {
            console.log("Close")
            resolve({ out: stdout, err: stderr, errorCode: errorCode })
        })
    })
}

const steamcmd = async (args, which, res) => {
    return await cmd('steamcmd', [ '+force_install_dir', config.server_files[which] ].concat(args).concat("+quit"), res)
}

const dz = async (args, res) => {
    return cmd('dz', args, res)
}

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.disable('etag')

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', '*')
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.append('Access-Control-Allow-Headers', 'Content-Type')
    next()
})

// Install a mod
app.get(('/install/mod/:modId'), async (req, res) => {
    const modId = req.params["modId"]
    // Shell out to steamcmd, monitor the process, and display the output as it runs
    await dz('a', [ modId ], res)
    res.end()
})

// Install base files
app.get('/install/server/:which', async (req, res) => {
    const which = req.params["which"]
    const appid = config.appid[which]
    const username = fs.readFileSync(config.login_file, 'utf8')
    let args = ['+login', username, '+app_update', appid, 'validate']
    const result = await steamcmd(args, which, res)
    res.write(JSON.stringify(result))
    res.end()
})

// Login to Steam
app.post(('/login'), async (req, res) => {
    const username = req.body?.username;
    const password = req.body?.password;
    const steamGuardCode = req.body?.steamGuardCode;
    const remember = req.body?.remember;
    let args = ['+login', username, password ]
    if (steamGuardCode) args.push(steamGuardCode)
    const result = await steamcmd(args, 'stable', res)
    if (result.errorCode === 0) {
        if (remember) {
            console.log("Writing login file")
            fs.writeFileSync(config.login_file, username)
        } else {
            console.log("Not writing login file")
        }
    }
    res.write(JSON.stringify(result))
    res.end()
})

// Logout from Steam
app.get(('/logout'), async (req, res) => {
    let result = {"errorCode": 0}
    if (fs.existsSync(config.login_file)) {
        fs.rmSync('/home/user/.local/share/Steam/userdata', { recursive: true, force: true })
        fs.unlinkSync(config.login_file, (err) => {
            if (err) {
                result.errorCoder = 1
                result.error = err
            }
        })
    }
    res.send(result)
})

// Get mod metadata by ID
app.get('/mod/:modId', (req, res) => {
    const modId = req.params["modId"]
    const modDir = config.mod_dir + d + modId
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
    if (fs.existsSync(config.mod_dir + d + modId + d + file)) {
        const contents = fs.readFileSync(config.mod_dir + d + modId + d + file)
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
    const url = config.search_url + searchString
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
    const ret = {
        "appid": config.version['stable'],
        "installed": {
            "experimental": fs.existsSync(config.install_file['experimental']),
            "stable": fs.existsSync(config.install_file['stable']),
        },
        "loggedIn": fs.existsSync(config.login_file),
    }
    if (ret.installed.stable) {
        ret.version = {
            stable: getVersion('stable'),
            experimental: getVersion('experimental')
        }
    }
    res.send(ret)
})

app.get('/test', async (req, res) => {
    const type = req.query.type
    if (type === "error") {
        const ret = {
            "errorCode": 42,
            "error": "This is a test server error",
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
        res.write("This is a test server continuous output 1\n")
        await new Promise(resolve => setTimeout(resolve, 1000))
        res.write("This is a test server continuous output 2\n")
        await new Promise(resolve => setTimeout(resolve, 1000))
        res.write("This is a test server continuous output 3 but it's a very long line intended to force wrapping of text because the length is so long and the girth is so gorth\n")
        await new Promise(resolve => setTimeout(resolve, 1000))
        res.write("This is a test server continuous output 4\n")
        await new Promise(resolve => setTimeout(resolve, 1000))
        res.write("This is a test server continuous output 5 with a whole SHIT TON of text! Lorem ipsum ain't got nothing on this! Hell yeah! Let's add a lot\nof\n\nnewlines and ellipses and other garbage...\nthis and that...and the other!\nLet's keep pushing this down...WAY DOWN...\nDOWN\nDOWN\nDOWN...\n\n...")
        await new Promise(resolve => setTimeout(resolve, 1000))
        res.write("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia tristique porta. Integer luctus dui non augue egestas, vitae faucibus massa placerat. In ornare sodales risus quis faucibus. Cras viverra mauris vel neque sollicitudin pretium. Integer quis consectetur purus. Nulla sed accumsan tortor. Nulla felis eros, egestas quis eros ut, hendrerit aliquam ante. Nulla sagittis tortor nulla, eu consectetur tellus tempus eget. In hac habitasse platea dictumst. Mauris interdum cursus massa ac vestibulum. Morbi sodales justo sed feugiat consequat. Nunc purus nibh, faucibus id porttitor eget, dignissim eu purus. Duis efficitur varius libero vitae tristique. Mauris libero dolor, tempor at sagittis in, malesuada auctor sapien. Nulla eu accumsan odio. Phasellus dapibus dictum nulla ac feugiat.\n")
        await new Promise(resolve => setTimeout(resolve, 500))
        res.write("Pellentesque at massa vel eros auctor fringilla. Vestibulum at molestie augue. Proin dictum, tortor quis efficitur finibus, tortor nisi viverra libero, eget placerat lectus dolor a felis. Pellentesque vitae felis vulputate enim feugiat rutrum. Pellentesque auctor tempor eros sed consectetur. Integer id pellentesque massa, quis suscipit nisi. Fusce tempor cursus nulla nec imperdiet. Phasellus sodales iaculis eros, sed auctor lacus elementum vitae. Sed efficitur condimentum risus. Cras varius risus at quam condimentum, vitae cursus leo facilisis. Suspendisse pellentesque erat leo, a cursus augue blandit sed. Aliquam quis nibh vel sapien pulvinar feugiat quis eu diam. Pellentesque ullamcorper vestibulum leo non imperdiet.\n")
        await new Promise(resolve => setTimeout(resolve, 500))
        res.write("In et nulla risus. Fusce luctus ligula vitae velit lacinia egestas. Nullam semper, nisl vel ultrices semper, magna sem vestibulum ipsum, in pulvinar elit diam ac odio. Etiam id laoreet odio, a vehicula est. Sed luctus lobortis sollicitudin. Morbi hendrerit erat vel lacus pellentesque, eget pretium nisi faucibus. Nunc a orci sed mauris commodo cursus. Morbi at ipsum fermentum, placerat felis at, porta felis. Pellentesque sit amet sollicitudin est, aliquet consequat tortor. Cras efficitur egestas pulvinar. Morbi ultrices, ligula ac luctus ullamcorper, risus metus hendrerit eros, et ultricies diam justo eget lorem. Duis varius pulvinar nulla a luctus. Curabitur sed quam cursus risus pellentesque dignissim id vel arcu.\n")
        await new Promise(resolve => setTimeout(resolve, 500))
        res.write("This is a test server continuous output 5 with a whole SHIT TON of text! Lorem ipsum ain't got nothing on this! Hell yeah! Let's add a lot\nof\n\nnewlines and ellipses and other garbage...\nthis and that...and the other!\nLet's keep pushing this down...WAY DOWN...\nDOWN\nDOWN\nDOWN...\n\n...\n\nDone!")
        res.end()
    } else {
        res.send("Unknown test type")
    }
})

ViteExpress.listen(app, config.port, () =>
    console.log(`Server is listening on port ${config.port}`)
)
