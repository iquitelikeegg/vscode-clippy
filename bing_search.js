const bing_search = (() => {
    const bingUrl = "https://bing.com/search?q="
    const queryPrefix = "site:support.microsoft.com "

    function generate_link(input) {
        return bingUrl + encodeURI(queryPrefix + input)
    }

    return {
        generate_link
    }
})();

module.exports = {
    generate_link: bing_search.generate_link
}