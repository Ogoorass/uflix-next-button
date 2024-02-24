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
    const indexOfE = string.indexOf("E");
    const indexOfS = string.indexOf("S");
    const episode = string.slice(indexOfE + 1, indexOfE + 3);
    const season = string.slice(indexOfS + 1, indexOfS + 3);
    return [episode, season];
}

// removes season and episode from link
function removeSeasonAndEpisode(url) {
    return url.slice(0, document.URL.indexOf("/S")) + "/";
}

// convention is to convert number like '1' to '01'
function numberToConventionNumber(number) {
    return number.length < 2 ? "0" + number : number;
}

// extracts season id from div's id in convenient way
// div id: season1
// extracted: 01
function getSeasonIdFromDivId(divId) {
    return numberToConventionNumber(divId.replace("season", ""));
}

function switchDropdown(dropdown) {
    dropdown.style.display === "block" ? dropdown.style.display = "none" : dropdown.style.display = "block";
}


function changeButtonStyle(button) {
    if (button.style.borderRadius === dropdownButtonStyle.borderRadius) {
        button.style.borderRadius = "8px 8px 0 0";
        button.style.padding = "0px 8px";
    } else {
        button.style.borderRadius = dropdownButtonStyle.borderRadius;
        button.style.padding = "1px 8px";
    };
}

// ########################## STYLES ################################

const dropdownButtonStyle = {
    display: "inline-block",
    padding: "1px 8px",
    textAlign: "left",
    backgroundColor: "#111113",
    border: "1px solid #ffffff",
    borderRadius: "8px",
    color: "#707080",
    width: "fit-content",
    minHeight: "25px", 
};

const dropdownStyle = {
    backgroundColor: "#111113",
    color: "#707080",
    fontFamily: "Inter, sans-serif",
    borderColor: "#707080",
    borderRadius: "10px",
    borderWidth: "1px",
    padding: "3px",
    position: "relative",
    display: "inline-block",
};

const dropdownContentStyle = {
    position: "absolute",
    top: "25px",
    zIndex: "1",
    display: "none",
    backgroundColor: "#111113",
    color: "#707080",
    minWidth: "200px",
    border: dropdownButtonStyle.border, // dropdown border same as button border
    borderRadius: "0 8px 8px 8px",
    overflow: "scroll",
    maxHeight: "60vh",
    
};

const dropdownLabelStyle = {
    marginRight: "10px",
};

//TODO reszte przerobić tak jak tu i w 190 linijce

// ######################### END STYLES ##############################

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
    let linkWithoutSeasonAndEpisode = removeSeasonAndEpisode(document.URL);



    // container for dropdown
    const dropdown = document.createElement("div");
    dropdown.id = "dropdown";
    Object.entries(dropdownStyle).forEach(([key, val]) => {
        dropdown.style[key] = val;
    });
    

    // list of episodes
    const dropdownContent = document.createElement("div");
    dropdownContent.id = "dropdown-content";
    Object.entries(dropdownContentStyle).forEach(([key, val]) => {
        dropdownContent.style[key] = val;
    });
    

    // lebel for dropdown
    const dropdownLabel = document.createElement("span");
    const dropdownLabelText = document.createTextNode(`S${currentSeason}E:`);
    Object.entries(dropdownLabelStyle).forEach(([key, val]) => {
        dropdownLabel.style[key] = val;
    });

    // button for dropdown
    const dropdownButton = document.createElement("button");
    dropdownButton.id = "dropdown-button";
    // set all style properties
    Object.entries(dropdownButtonStyle).forEach(([key, val]) => {
        dropdownButton.style[key] = val;
    })
    

    dropdownButton.onclick = () => { 
        switchDropdown(dropdownContent); 
        changeButtonStyle(dropdownButton); 
        const topPos = document.getElementById(currentSeason + currentEpisode).offsetTop;
        dropdownContent.scrollTop = topPos - 21.37 * 4;
    }


    dropdownLabel.appendChild(dropdownLabelText);
    breadcrumbName.replaceChildren(dropdownLabel);
    dropdown.appendChild(dropdownButton);
    dropdown.appendChild(dropdownContent);
    breadcrumbName.appendChild(dropdown);


    // add cursor change when hover on dropdown items
    var css = 'button#dropdown-button:hover, div#dropdown-content a:hover { background-color: #010103 !important; color: #9090A0 !important; }',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    head.appendChild(style);

    style.type = 'text/css';
    if (style.styleSheet) {
        // This is required for IE8 and below.
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }


    const breadcrumb = document.querySelector(".breadcrumb");
    breadcrumb.style.justifyContent = "center";
    breadcrumb.style.alignItems = "center";
    breadcrumbName.style.display = "flex";
    breadcrumbName.style.justifyContent = "center";
    breadcrumbName.style.alignItems = "center";

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
            let seasonsdeoc = xmldoc.querySelectorAll(
                "div[id^=season]:not(div#seasonAccordion):not(div#season0)"
            );

            // main array of seasons
            let seasons = [];
            for (const seasondoc of seasonsdeoc) {
                // convention is to make season id in the "link style"
                // so if it contains less than 2 characters add leading zero
                let seasonId = getSeasonIdFromDivId(seasondoc.id);
                // div containg all episodes
                let episodeCardDocArray =
                    seasondoc.querySelectorAll("div.card-episode");
                let episodes = [];
                for (const epcard of episodeCardDocArray.values()) {
                    // "Episode 1" => ["Episode", "1"] => "1"
                    // I hope it always works
                    const id = numberToConventionNumber(
                        epcard.querySelector("a.episode").innerHTML.split(" ")[1].trim()
                    );

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
                const sOptGroup = document.createElement("div");
                sOptGroup.id = "season" + season.id;
                sOptGroup.style.textAlign = "center";

                const seasonLabel = document.createElement("b");
                seasonLabel.style.paddingTop = "10px";
                seasonLabel.style.display = "inline-block";
                seasonLabel.style.color = "#757585";

                seasonLabel.appendChild(document.createTextNode("Season " + season.id));
                sOptGroup.appendChild(seasonLabel);
                // create option for episodes
                season.episodes.forEach((episode) => {
                    const epName = Number(episode.id) + " " + episode.name;
                    const epLink = document.createElement("a");
                    epLink.style.display = "block";
                    epLink.style.padding = "2px 8px";
                    epLink.style.textAlign = "left";

                    epLink.id = season.id + episode.id; // to distinguish all episodes form different seasons

                    // complete link
                    const link =
                        linkWithoutSeasonAndEpisode + `S${season.id}E${episode.id}`;
                    epLink.href = link;

                    const epText = document.createTextNode(epName);

                    epLink.appendChild(epText);
                    sOptGroup.appendChild(epLink);
                });
                dropdownContent.appendChild(sOptGroup);
            });

            const cuEp = seasons[Number(currentSeason) - 1].episodes[Number(currentEpisode) - 1];
            dropdownButton.appendChild(document.createTextNode(cuEp.id + " " + cuEp.name));
            // style current episode so it stands out
            const currentOption = dropdown.querySelector(`a[id="${ currentSeason + currentEpisode}"]`);
            currentOption.style.color = "#B0B0D0";
            currentOption.style.backgroundColor = "#212123";
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
