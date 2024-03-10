function fetchAndDisplayPages() {
    const pageList = document.getElementById('pageList');
    const apiUrl = 'https://api.github.com/repos/COpener-gaming/copener-gaming.github.io/contents/pages';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(file => {
                if (file.name.endsWith('.html')) {
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = "https://copener-gaming.github.io/" + file.path;
                    link.textContent = file.name.replace('.html', '');
                    listItem.appendChild(link);
                    pageList.appendChild(listItem);
                }
            });
        })
        .catch(error => console.error('Error fetching GitHub content:', error));
}
