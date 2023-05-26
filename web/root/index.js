const template = `
	<div class="container-fluid">
		<div class="row jumbotron darkgrey">
		    <div class="col-7">
		        <h1>DayZ Docker Server</h1>
		    </div>
		    <div class="col-3 form-control-lg">
                <form @submit="handleSubmit">
                    <input name="search" placeholder="Search mods...">
                </form>
		    </div>
            <div class="col-2">
                <div>
                    Server files installed: {{ installed }}
                </div>
                <div>
                    Version: {{ version }}
                </div>
    		</div>
		</div>
		<div
			v-if="fetchError != ''"
			class="row jumbotron text-center alert alert-danger"
		>
			{{ fetchError }}
		</div>
        <div class="row jumbotron darkgrey">
            <div class="col-3">
                <h2 class="text-center">Mods</h2>
                <table>
                    <tr>
                        <th>Steam Link</th>
                        <th>Mod Info</th>
                    </tr>
                    <template
                        v-for="mod in mods"
                        :key="index"
                    >
                    <tr>
                        <td>
                            <a
                                target="_blank"
                                :href="'https://steamcommunity.com/sharedfiles/filedetails/?id=' + mod.id"
                            >
                                {{ mod.id }}
                            </a>
                        </td>
                        <td>
                            <a class="simulink" @click="getModInfo(mod.id)">{{ mod.name }}</a>
                        </td>                            
                    </tr>
                    </template>
                </table>
            </div>
            <div class="col-9 modInfo" v-if="searchResults != ''">
                <table>
                    <tr>
                        <th>Steam Link</th>
                        <th>Title</th>
                        <th>Size</th>
                        <th>Last Updated</th>
                        <th>Subscriptions</th>
                    </tr>
                    <tr v-for="result in searchResults">
                        <td>
                            <a
                                target="_blank"
                                :href="'https://steamcommunity.com/sharedfiles/filedetails/?id=' + result.publishedfileid"
                            >
                                <img data-bs-toggle="tooltip" data-bs-placement="right" :title="result.short_description" width="160" height="90" :src="result.preview_url">
                            </a>
                        </td>
                        <td>{{ result.title }}</td>                        
                        <td>{{ result.file_size }}</td>                        
                        <td>{{ new Date(result.time_updated * 1000) }}</td>
                        <td>{{ result.lifetime_subscriptions }}</td>                   
                    </tr>                
                </table>
            </div>
            <div class="col-9 modInfo" v-if="modInfo != ''">
                <div class="text-center col-12">
                    <h2>{{ modInfo.name }} mod info:</h2>                    
                </div>
                <div class="row">
                    <div class="col-2">
                        <div>
                            ID: {{ modInfo.id }}
                        </div>
                        <div>
                            Size: {{ modInfo.size.toLocaleString("en-US") }}
                        </div>
                        <div v-if="modInfo.customXML.length > 0">
                            Custom XML files:
                            <ul>
                                <li v-for="info in modInfo.customXML">
                                    <a
                                        :class="'simulink xmlfile ' + info.name"
                                        @click="getXMLInfo(modInfo.id,info.name)"
                                    >
                                        {{ info.name }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-10">
                        <textarea cols="120" rows="15" v-if="this.XMLInfo != ''">{{ this.XMLInfo }}</textarea>    
                    </div>
                </div>
            </div>
        </div>
	</div>
`

export default {
    name: 'DazDockerServer',
    template: template,
    data() {
        return {
            fetchError: "",
            installed: false,
            mods: [],
            modInfo: "",
            searchResults: [],
            version: "Unknown",
            XMLFile: "",
            XMLInfo: "",
        }
    },
    methods: {
        getModInfo(modId) {
            fetch('/mod/' + modId)
                .then(response => response.json())
                .then(response => {
                    this.modInfo = response
                    this.XMLInfo = ""
                    this.searchResults = ""
                })
                .catch((error) => {
                    console.error(error)
                    this.fetchError = error.message
                })
        },
        getXMLInfo(modId, file) {
            for (const e of document.getElementsByClassName("selected")) e.classList.remove("selected")
            fetch('/mod/' + modId + '/' + file)
                .then(response => response.text())
                .then(response => {
                    this.XMLFile = file
                    this.XMLInfo = response
                    for (const e of document.getElementsByClassName(file)) e.classList.add("selected")
                })
                .catch((error) => {
                    console.error(error)
                    this.fetchError = error.message
                })
        },
        handleSubmit(e) {
            e.preventDefault()
            fetch('/search/' + e.target.search.value)
                .then(response => response.json())
                .then(response => {
                    this.modInfo = ""
                    this.XMLInfo = ""
                    // const sortField = "time_updated"
                    const sortField = "lifetime_subscriptions"
                    response.response.publishedfiledetails.sort((a, b) =>
                        a[sortField] < b[sortField] ? 1 : -1
                    )
                    this.searchResults = response.response.publishedfiledetails
                })
                .then(() => {
                    // Enable all tooltips
                    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
                    tooltipTriggerList.map(function (tooltipTriggerEl) {
                        return new bootstrap.Tooltip(tooltipTriggerEl)
                    })
                })
                .catch((error) => {
                    console.error(error)
                    this.fetchError = error.message
                })
        }
    },
    mounted() {
        // Get the data
        fetch('/status')
            .then(response => response.json())
            .then(response => {
                this.installed = response.installed
                this.version = response.version
                this.mods = response.mods
                if(response.error) {
                    this.fetchError = response.error
                }
            })
            .catch((error) => {
                console.error(error)
                this.fetchError = error.message
            })
    }
}

/*

{ "result": 1, "publishedfileid": "2489240546", "creator": "76561199068873691", "creator_appid": 221100, "consumer_appid": 221100, "consumer_shortcutid": 0, "filename": "", "file_size": "276817803", "preview_file_size": "27678", "preview_url": "https://steamuserimages-a.akamaihd.net/ugc/2011465736408144669/A7137390FBB9F4F94E0BFE5389932F6DE7AB7B87/", "url": "", "hcontent_file": "4050838808220661564", "hcontent_preview": "2011465736408144669", "title": "LastDayZ_Helis", "short_description": "The author of the helicopter mod https://sibnic.info on the site you can download the latest version of free helicopters, If you need help with installation, go to discord https://sibnic.info/discord", "time_created": 1621186063, "time_updated": 1684985831, "visibility": 0, "flags": 5632, "workshop_file": false, "workshop_accepted": false, "show_subscribe_all": false, "num_comments_public": 0, "banned": false, "ban_reason": "", "banner": "76561197960265728", "can_be_deleted": true, "app_name": "DayZ", "file_type": 0, "can_subscribe": true, "subscriptions": 7935, "favorited": 3, "followers": 0, "lifetime_subscriptions": 22759, "lifetime_favorited": 5, "lifetime_followers": 0, "lifetime_playtime": "0", "lifetime_playtime_sessions": "0", "views": 535, "num_children": 0, "num_reports": 0, "tags": [ { "tag": "Animation", "display_name": "Animation" }, { "tag": "Environment", "display_name": "Environment" }, { "tag": "Sound", "display_name": "Sound" }, { "tag": "Vehicle", "display_name": "Vehicle" }, { "tag": "Mod", "display_name": "Mod" } ], "language": 0, "maybe_inappropriate_sex": false, "maybe_inappropriate_violence": false, "revision_change_number": "14", "revision": 1, "ban_text_check_result": 5 }

 */
