const maxBadges = 16;
const targetDate = new Date('2024-11-11');

// Function to update the countdown
function updateCountdown() {
    const now = new Date();
    const timeDiff = targetDate - now;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    document.getElementById('countdown').textContent = `${daysLeft} Days left`;
}

// Function to fetch JSON data from an external file
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        let completedBadges = 0;

        // Sort participants by total number of badges
        data.sort((a, b) =>
            (b['# of Skill Badges Completed'] + b['# of Arcade Games Completed']) -
            (a['# of Skill Badges Completed'] + a['# of Arcade Games Completed'])
        );

        const leaderboardBody = document.getElementById('leaderboard-body');

        // Loop through the data and dynamically insert rows
        data.forEach((participant, index) => {
            const totalBadges = participant['# of Skill Badges Completed'] + participant['# of Arcade Games Completed'];

            // Count participants with maximum badges
            if (totalBadges >= maxBadges) {
                completedBadges++;
            }

            // Calculate progress as a percentage
            const progressPercentage = (totalBadges / maxBadges) * 100;

            // Truncate the name to display first word and first character of the last word
            let nameParts = participant['User Name'].split(' ');
            let participantName = nameParts.length > 1 ?
                `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.` :
                nameParts[0];

            // Generate participant row HTML
            const row = `
                        <div class="participant-info">
                            <div class="participant-rank">${index + 1}</div>
                            <div class="participant-name">
                                ${participantName}
                                <span class="participant-badges">🌟 x ${totalBadges}</span>
                            </div>
                            <div class="progress-container">
                                <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                            </div>
                        </div>
                        <hr>
                    `;
            leaderboardBody.innerHTML += row;
        });

        // Calculate target progress
        const targetProgressPercentage = (completedBadges / data.length) * 100;
        document.getElementById('target-progress').style.width = `${targetProgressPercentage}%`;
        document.getElementById('target-text').textContent = `Target: ${completedBadges}/${data.length} completed`;
    })
    .catch(error => console.error('Error fetching data:', error));

// Call the countdown function
updateCountdown();