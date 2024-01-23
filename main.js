
let username = johnpapa;
let currentPage = 1;
let reposPerPage = 10;
let totalRepos = 0;
// const url = `https://api.github.com/repos/${owner}/${repo}`;
// const headers = {
//   Accept: "application/vnd.github.mercy-preview+json",
// };

function fetchGitHubData(username, page, perPage) {
    showLoader();

    // Fetch user data
    fetch(`https://api.github.com/users/${username}`)
        .then(response => response.json())
        .then(data => {
            hideLoader();
            const profileContainer = document.getElementById('profile-container');
            if (data.name == null) {
                
                profileContainer.innerHTML = `
                    <div class="container flex user-error">
                        <h1>Please Enter Valid Username...</h1>
                    </div>`;
            } else {
                // Clear previous content
                profileContainer.innerHTML = '';

                // Display user profile
                profileContainer.innerHTML += `
                    <div class="container flex main-content">
                        <div class="profile-pic">
                            <img src="${data.avatar_url}" alt="Profile Picture" width="100">
                        </div>
                        <div class="profile-data">
                            <h2 id="h2-text">Name: ${data.name}</h2>
                            <p>Bio: ${data.bio}</p>
                            <p>📍: ${data.location}</p>
                            <p>Twitter: <a href="https://twitter.com/${data.twitter_username}" target="_blank">https://twitter.com/${data.twitter_username}</a></p>
                        </div>
                    </div>
                    <div class="container">
                        <p>🔗: <a href="https://github.com/${data.login}?tab=repositories" target="_blank">https://github.com/${data.login}?tab=repositories</a> </p>
                    </div>`;

                // Fetch user repositories with pagination
                fetch(`https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`)
                    .then(response => response.json())
                    .then(repos => {
                        const reposContainer = document.getElementById('repos-container');
                        reposContainer.innerHTML = '';
                        
                        

                        // Display user repositories
                        repos.forEach(repo => {
                            let Ttopics = repo.topics;
                            const topicsHTML = repo.topics && repo.topics.length > 0
        ? repo.topics.map(topic => `<span class="blue-background">${topic}</span>`).join(' ')
        : '<span class="blue-background">NULL</span>';
                            //console.log(Ttopics);
                            reposContainer.innerHTML += `
                                <div class="repo">
                                    <h3><a href="https://github.com/${username}/${repo.name}" target="_blank">${repo.name}</a></h3>
                                    <p>${repo.description}</p>
                                    <p>🌟: ${repo.stargazers_count}</p>
                                    <p>⑂: ${repo.forks_count}</p>
                                    <span class="topics"> Topics: ${topicsHTML}</span>
                                    
                                    
                                </div>`;
                        });
                    })
                    .catch(error => console.error('Error fetching repositories:', error));


            }

        })
        .catch(error => {
            hideLoader();
            console.error('Error fetching user data:', error);
        });
        
        
}

function searchGitHub() {
    const searchText = document.getElementById('search-text').value;

    // Update the GitHub username in the existing script
    username = searchText;

    // Reset pagination to page 1 when searching
    currentPage = 1;

    // Fetch GitHub data with pagination
    fetchGitHubData(username, currentPage, reposPerPage);
    
}

// Initial fetch
fetchGitHubData(username, currentPage, reposPerPage);

function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

function changePage(change) {
    currentPage += change;
    if (currentPage < 1) {
        currentPage = 1;
    }
    updatePageNumber();
    fetchGitHubData(username, currentPage, reposPerPage);
}

function changeReposPerPage() {
    reposPerPage = parseInt(document.getElementById('repos-per-page').value);
    currentPage = 1;
    updatePageNumber();
    fetchGitHubData(username, currentPage, reposPerPage);
}

function updatePageNumber() {
    document.getElementById('page-number').innerText = currentPage;
    
}
