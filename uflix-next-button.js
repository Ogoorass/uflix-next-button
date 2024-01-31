let current_episode_url_raw = document.URL;

if (current_episode_url_raw.search("nextSeson") > 0) {
    alert("Next seson!");
}

let position = current_episode_url_raw.indexOf("?");

// check if url ends with some parameters
var current_episode_url;
if (position > 0) {
    current_episode_url = current_episode_url_raw.slice(0, position);
} else {
    current_episode_url = current_episode_url_raw;
}

let current_episode_number = parseInt(current_episode_url.slice(-2));
let next_episode_number = (current_episode_number + 1)
    .toString()
    .padStart(2, "0");

let next_episode_url = current_episode_url.slice(0, -2) + next_episode_number;

let container = document.querySelector("div.mb-4");

// it means that there are no more episodes in seson
if (container == null) {
    // end of a series
    if (current_episode_url_raw.search("E01") > 0) {
        alert("No more sesons!");
        exit();
    }

    let position = current_episode_url.lastIndexOf("/");
    let current_seson_number = parseInt(
        current_episode_url.slice(position + 2, position + 4)
    );
    let next_seson_number = (current_seson_number + 1)
        .toString()
        .padStart(2, "0");
    let next_episode_url =
        current_episode_url.slice(0, position + 2) +
        next_seson_number +
        "E01?nextSeson=1";
    window.location.assign(next_episode_url);
}

// button for next episode
container.innerHTML +=
    `
<div class="slw-next-button">
    <a href="` +
    next_episode_url +
    `">
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

</div>`;

function getSeriesName() {
    // urls are always in this format
    // https://uflix.cc/episode/<series-name>/S<seson-number>E<episode-number>
    // so reduced is <series-name>/S<seson-number>E<episode-number>
    // so name is first element of split("/") array
    return document.URL.replace("https://uflix.cc/episode/", "").split("/")[0];
}

function getListOfEpisodes(season) {

}



function addDropdown(episodes) {

}

function extractEpisodeAndSeason(string) {
    const episode = string.slice(string.indexOf("E") + 1, string.indexOf("E") + 3).trimStart("0");
    const season = string.slice(string.indexOf("S") + 1, string.indexOf("S") + 3).trimStart("0");
    return [episode, season];
}



function main() {
    /*TODO features below
        add ui elements with loading animation
        fetch data
        populate ui elements
    */

    // top element, that shows current episode
    const breadcrumbName = document.querySelector("li.breadcrumb-item.active");

    // extract exact number
    const [currentEpisode, currentSeason] = extractEpisodeAndSeason(breadcrumbName.innerHTML);

    // new element to replace old breadcrumbName
    const dropdownAnchor = document.createElement("select");
    dropdownAnchor.name = "Episodes";

    breadcrumbName.replaceChildren(dropdownAnchor);

    let main_series_page_request = new XMLHttpRequest();

    // parse response as XML doc
    // extract wanted episode
    // parse it to the array as objects { id, name }
    main_series_page_request.onload = function () {
        try {
            let parser = new DOMParser();
            let xmldoc = parser.parseFromString(this.responseText, "text/html");
            let seasondoc = xmldoc.querySelector(`div#season${Number(currentSeason).toString()}`);
            let episodeCardDocArray = seasondoc.querySelectorAll("div.card-episode");
            let episodes = [];
            for (const epcard of episodeCardDocArray.values()) {
                episodes.push({
                    id: epcard.querySelector("a.episode").innerHTML.split(" ")[1].trim(),
                    name: epcard.querySelector("a.name").innerHTML.trim()
                });
            }

            episodes.forEach((episode) => {
                const epName = episode.id + " " + episode.name;
                const epOption = document.createElement("option");
                epOption.value = episode.id;
                
                const link = document.URL.slice(0, document.URL.indexOf("/S")) + `/S${currentSeason}E${episode.id.length < 2 ? '0' + episode.id : episode.id}`;
                epOption.onclick = () => window.location.href = link;

                const epText = document.createTextNode(epName);
                

                epOption.appendChild(epText);
                dropdownAnchor.appendChild(epOption);
            })

            dropdownAnchor.value = Number(currentEpisode).toString();
            


        }
        catch (e) {
            alert(e);
        }
    };

    main_series_page_request.open(
        "GET",
        "https://uflix.cc/serie/house-2004",
        true
    );
    main_series_page_request.send();
}






main();