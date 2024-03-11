async function fetchAndDisplayPages() {
        const pageList = document.getElementById('pageList');
        const apiUrl = 'https://api.github.com/repos/COpener-gaming/copener-gaming.github.io/contents/pages/openers';

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            for (const file of data) {
                if (file.name.endsWith('.html')) {
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = "https://copener-gaming.github.io/" + file.path;

                    const pageResponse = await fetch(link.href);
                    const pageContent = await pageResponse.text();

                    const title = pageContent.match(/<title>(.*?)<\/title>/i);
                    link.textContent = title ? title[1] : file.name.replace('.html', '');

                    listItem.appendChild(link);
                    pageList.appendChild(listItem);
                }
            }
        } catch (error) {
            console.error('Error fetching GitHub content:', error);
        }
    }
