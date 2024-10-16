// Define maximum badges and target date for the countdown
const maxBadges = 16;
const targetDate = new Date('2024-11-11');

// Function to update the countdown timer
function updateCountdown() {
    const now = new Date();
    const timeDiff = targetDate - now;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    document.getElementById('countdown').textContent = `${daysLeft} Day(s) left`;
}

// Function to filter participants based on search input
document.getElementById('search-input').addEventListener('input', function () {
    const searchValue = this.value.toLowerCase();
    const participants = document.querySelectorAll('.participant-info');

    participants.forEach(participant => {
        const name = participant.querySelector('.participant-name').textContent.toLowerCase();
        participant.style.display = name.includes(searchValue) ? 'flex' : 'none';
    });
});

// Fetch participant data and populate leaderboard
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        let totalCompletedBadges = 0;
        let completedParticipantsCount = 0; // Track how many participants completed all badges

        // Sort participants by total badges earned
        data.sort((a, b) =>
            (b['# of Skill Badges Completed'] + b['# of Arcade Games Completed']) -
            (a['# of Skill Badges Completed'] + a['# of Arcade Games Completed'])
        );

        const leaderboardBody = document.getElementById('leaderboard-body');

        data.forEach((participant, index) => {
            const totalBadges = participant['# of Skill Badges Completed'] + participant['# of Arcade Games Completed'];
            const progressPercentage = Math.min((totalBadges / maxBadges) * 100, 100);
            totalCompletedBadges += totalBadges;

            const participantRow = document.createElement('div');
            participantRow.classList.add('participant-info');

            participantRow.innerHTML = `
                <span class="participant-rank">#${index + 1}</span>
                <span class="participant-name">${participant['User Name']}  
                    <span class="participant-badges">${totalBadges}X⭐</span>
                </span>
                <span class="more-details" data-index="${index}" style="cursor: pointer; margin-left: 10px;">▼ More</span>
                <div class="progress-container">
                    <div class="progress-fill" style="width: ${progressPercentage}%;"></div>
                </div>
            `;

            // Add event listener to show modal on click
            participantRow.querySelector('.more-details').addEventListener('click', function() {
                // Populate modal with participant details
                const modalBody = document.getElementById('modal-details-body');
                modalBody.innerHTML = `
                    <p><strong>Skill Badges Completed:</strong> ${participant['# of Skill Badges Completed']}</p>
                    <p><strong>Names of Completed Skill Badges:</strong> ${participant['Names of Completed Skill Badges']}</p>
                    <p><strong>Arcade Games Completed:</strong> ${participant['# of Arcade Games Completed']}</p>
                    <p><strong>Names of Completed Arcade Games:</strong> ${participant['Names of Completed Arcade Games']}</p>
                `;
                
                // Show the modal
                const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
                detailsModal.show();
            });

            leaderboardBody.appendChild(participantRow);

            // Increment completedParticipantsCount if participant completed all badges
            if (totalBadges === maxBadges) {
                completedParticipantsCount++;
            }
        });

        // Update target badges count
        document.getElementById('target-progress').style.width = `${(completedParticipantsCount / data.length) * 100}%`;
        document.getElementById('target-text').textContent = `Completed: ${completedParticipantsCount} / ${data.length}`;
    });

// Update countdown every day
updateCountdown();
setInterval(updateCountdown, 1000 * 60 * 60 * 24);
