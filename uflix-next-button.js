// TODO rewrite it in main(), posibly with less bullshit
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


// utility for extracting id from 'S01E01' like syntax
function extractEpisodeAndSeason(string) {
    const episode = string
        .slice(string.indexOf("E") + 1, string.indexOf("E") + 3)
    const season = string
        .slice(string.indexOf("S") + 1, string.indexOf("S") + 3)
    return [episode, season];
}

function main() {
    // top element, that shows current episode
    const breadcrumbName = document.querySelector("li.breadcrumb-item.active");

    // extract exact number of episode end season
    const [currentEpisode, currentSeason] = extractEpisodeAndSeason(
        breadcrumbName.innerHTML
    );

    // uncompleate link
    // full link: https://uflix.cc/episode/house-2004/S07E15
    // reduced link: https://uflix.cc/episode/house-2004/
    const linkWithoutSeasonAndEpisode = document.URL.slice(0, document.URL.indexOf("/S")) + "/";


    // list of episodes
    const dropdown = document.createElement("select");
    dropdown.name = "Episodes";
    dropdown.style.backgroundColor = "#111113";
    dropdown.style.color = "#707080";
    dropdown.style.fontFamily = "Inter, sans-serif";
    dropdown.style.borderColor = "#707080";
    dropdown.style.borderRadius = "10px";
    dropdown.style.borderWidth = "1px";
    dropdown.style.padding = "3px";
    dropdown.style.paddingLeft = "10px";



    // lebel for dropdown
    const dropdownLabel = document.createElement("label");
    dropdownLabel.htmlFor = "Episodes";
    dropdownLabel.style.marginRight = "10px"
    const dropdownLabelText = document.createTextNode(`S${currentSeason}E:`);


    /*
        <label>`dropdownLabelText`</label>
        <select>...</select>
    */
    dropdownLabel.appendChild(dropdownLabelText);
    breadcrumbName.replaceChildren(dropdownLabel);
    breadcrumbName.appendChild(dropdown);


    // fetching series main page containing all seasons info
    let main_series_page_request = new XMLHttpRequest();

    // extract season info and use it
    // hope it won't take too much time
    // all tweaking ui happens after response of this request
    main_series_page_request.onload = function () {
        // safety first
        try {
            let parser = new DOMParser();
            let xmldoc = parser.parseFromString(this.responseText, "text/html");
            // get all divs that displays seasons, 
            // div#seasonAccordion contains all of the season, so dont need it
            // I noticed that season0 is usually some bullshit
            let seasonsdeoc = xmldoc.querySelectorAll("div[id^=season]:not(div#seasonAccordion):not(div#season0)");

            // main array of seasons
            let seasons = [];
            for (const seasondoc of seasonsdeoc) {
                // convention is to make season id in the "link style" 
                // so if it contains less than 2 characters add leading zero
                let seasonId = seasondoc.id.replace("season", "").length < 2 ? '0' + seasondoc.id.replace("season", "") : seasondoc.id.replace("season", "");
                // div containg all episodes
                let episodeCardDocArray = seasondoc.querySelectorAll("div.card-episode");
                let episodes = [];
                for (const epcard of episodeCardDocArray.values()) {
                    // "Episode 1" => ["Episode", "1"] => "1"
                    // I hope it always works
                    let id = epcard.querySelector("a.episode").innerHTML.split(" ")[1].trim();
                    // same convention as above
                    id = id.length < 2 ? '0' + id : id;
                    episodes.push({
                        id: id,
                        name: epcard.querySelector("a.name").innerHTML.trim(),
                    });
                }
                seasons.push({ id: seasonId, episodes: episodes });
            }


            // create opgroup for seasons
            seasons.forEach((season) => {
                /* It looks like: 
                    <optgroup label="Season X">
                        <option value="0711">11 `episode name`</option> // value is <season id><episode id>
                        ...
                    <optgroup/>
                    <optgroup label="Season X+1">
                        ...
                    <optgroup/>
                */
                const sOptGroup = document.createElement("optgroup");
                sOptGroup.label = "Season " + season.id;
                // create option for episodes
                season.episodes.forEach((episode) => {
                    const epName = Number(episode.id) + " " + episode.name;
                    const epOption = document.createElement("option");

                    epOption.value = season.id + episode.id; // to distinguish all episodes form different seasons

                    // complete link
                    const link = linkWithoutSeasonAndEpisode + `S${season.id}E${episode.id}`;
                    epOption.onclick = () => (window.location.href = link);

                    const epText = document.createTextNode(epName);

                    epOption.appendChild(epText);
                    sOptGroup.appendChild(epOption);
                })
                dropdown.appendChild(sOptGroup);
            });


            dropdown.value = currentSeason + currentEpisode;
            // style current episode so it stands out
            const currentOption = dropdown.querySelector(`option[value="${currentSeason + currentEpisode}"]`);
            currentOption.style.color = "#ffffff";
        } catch (e) {
            // I used it for debug, but I guess it could stay
            alert("uflix-nex-button error: " + e);
        }
    };

    main_series_page_request.open(
        "GET",
        "https://uflix.cc/serie/" + getSeriesName(),
        true
    );
    main_series_page_request.send();
}

main();