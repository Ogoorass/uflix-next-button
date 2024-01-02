
let current_episode_url_raw = document.URL

if (current_episode_url_raw.search("nextSeson") > 0){
    alert("Next seson!")
}

let position = current_episode_url_raw.indexOf("?")

// check if url ends with some parameters
var current_episode_url
if (position > 0){
    current_episode_url = current_episode_url_raw.slice(0, position)
} else {
    current_episode_url = current_episode_url_raw
}


let current_episode_number = parseInt(current_episode_url.slice(-2))
let next_episode_number = (current_episode_number + 1).toString().padStart(2, "0")

let next_episode_url = current_episode_url.slice(0, -2) + next_episode_number


let container = document.querySelector("div.mb-4")

// it means that there are no more episodes in seson
if (container == null) {
    // end of a series
    if (current_episode_url_raw.search("E01") > 0){
        alert("No more sesons!")
        exit()
    }

    let position = current_episode_url.lastIndexOf("/")
    let current_seson_number = parseInt(current_episode_url.slice(position + 2, position + 4))
    let next_seson_number = (current_seson_number + 1).toString().padStart(2, "0")
    let next_episode_url = current_episode_url.slice(0, position + 2) + next_seson_number + "E01?nextSeson=1"
    window.location.assign(next_episode_url)
}

// button for next episode
container.innerHTML += `
<div class="slw-next-button">
    <a href="` + next_episode_url + `">
        <button 
            style="background-color: #3568d3; 
            color: white; 
            border-radius: 20px; 
            border: #3568d3; 
            height: 40px; 
            width: 100px; 
            float: right; 
            margin-right: 100px">
        Next
        </button>
    </a>

</div>`
