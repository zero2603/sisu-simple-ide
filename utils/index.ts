export const parseStringToHtml = (md: string) => {
    //links
    md = md.replace(/[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<a href="$2" title="$4">$1</a>');

    //font styles
    md = md.replace(/[\*]{2}([^\*]+)[\*]{2}/g, '<b>$1</b>');
    md = md.replace(/[\*]{1}([^\*]+)[\*]{1}/g, '<i>$1</i>');
    md = md.replace(/[\-]{2}([^\-]+)[\-]{2}/g, '<strike>$1</strike>');
    md = md.replace(/[\_]{2}([^\_]+)[\_]{2}/g, '<u>$1</u>');
    md = md.replace(/[\~]{2}([^\~]+)[\~]{2}/g, '<del>$1</del>');

    //p
    md = md.replace(/^\s*(\n)?(.+)/gm, function (m) {
        return /\<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>' + m + '</p>';
    });

    //strip p from pre
    md = md.replace(/(\<pre.+\>)\s*\n\<p\>(.+)\<\/p\>/gm, '$1$2');

    return md;

}

export const parseHtmlToString = (htmlContent: HTMLCollection) => {
    console.log(htmlContent)
    const results: string[] = [];

    for (let item of htmlContent) {
        let resultItem = item.outerHTML;

        resultItem = resultItem.replaceAll('<p>', '');
        resultItem = resultItem.replaceAll('</p>', '\n');
        resultItem = resultItem.replaceAll('<b>', '**');
        resultItem = resultItem.replaceAll('</b>', '**');
        resultItem = resultItem.replaceAll('<i>', '*');
        resultItem = resultItem.replaceAll('</i>', '*');
        resultItem = resultItem.replaceAll('<u>', '__');
        resultItem = resultItem.replaceAll('</u>', '__');
        resultItem = resultItem.replaceAll('<strike>', '--');
        resultItem = resultItem.replaceAll('</strike>', '--');
        // handle a tags
        resultItem = resultItem.replaceAll(/<a.*?href="(.*?)".*?>(.*?)<\/a>/g, '[$2]($1)');

        results.push(resultItem);
    }

    return results.join('');
}
