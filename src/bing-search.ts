export const bing_search = (() => {
    const bingUrl = "https://bing.com/search?q="
    const msSupportSites = [
        "support.microsoft.com",
        "support.microsoft.com/en-us/microsoft-365",
        "support.microsoft.com/en-us/outlook",
        "support.microsoft.com/en-us/word",
        "support.microsoft.com/en-us/excel",
        "support.microsoft.com/en-us/powerpoint",
        "support.microsoft.com/en-us/teams",
        "docs.microsoft.com/en-us/windows"
    ]
    let roundRobinPointer = 0

    function generate_link(input:string) {
        let queryPrefix = `site:${msSupportSites[roundRobinPointer]} `

        roundRobinPointer++

        if (roundRobinPointer > msSupportSites.length - 1)
            roundRobinPointer = 0

        return bingUrl + encodeURI(queryPrefix + input)
    }

    return {
        generate_link
    }
})();
