// Array of image paths
const images = [
    'baucua/bau.png',
    'baucua/cua.png',
    'baucua/tom.png',
    'baucua/ca.png',
    'baucua/huou.png',
    'baucua/ga.png'
];

// Select all outcome images
const outcomeImages = document.querySelectorAll('.out-come img');

// Select all betting images and their corresponding count spans
const bauTag = document.getElementById('bau');
const cuaTag = document.getElementById('cua');
const tomTag = document.getElementById('tom');
const caTag = document.getElementById('ca');
const huouTag = document.getElementById('huou');
const gaTag = document.getElementById('ga');

const bauCount = document.getElementById('bauCount');
const cuaCount = document.getElementById('cuaCount');
const tomCount = document.getElementById('tomCount');
const caCount = document.getElementById('caCount');
const huouCount = document.getElementById('huouCount');
const gaCount = document.getElementById('gaCount');

// Select the buttons
const spinButton = document.getElementById('spinButton');
const resetButton = document.getElementById('resetButton');

// Variables to keep track of betting points
const bets = {
    bau: { points: 0 },
    cua: { points: 0 },
    tom: { points: 0 },
    ca: { points: 0 },
    huou: { points: 0 },
    ga: { points: 0 }
};

let totalPoints = 0;
const maxPoints = 3;

// Function to handle betting
function placeBet(tag, betObj, countDisplay) {
    if (totalPoints < maxPoints) {
        betObj.points++;
        totalPoints++;
        tag.style.border = '2px solid red'; // Optional: Highlight the image to indicate a bet
        countDisplay.textContent = betObj.points; // Update the display with the new betting count

        updateSpinButtonState(); // Update the state of the spin button
        console.log(`Đặt cược vào ${tag.alt}: ${betObj.points} lần`);
    } else {
        alert('Số lần đặt cược tối đa');
    }
}

// Function to handle resetting bets
function resetBets() {
    // Reset all betting points
    for (const key in bets) {
        bets[key].points = 0;
    }
    totalPoints = 0;

    // Reset the border style of all images
    document.querySelectorAll('.betting-place img').forEach(img => {
        img.style.border = 'none';
    });

    // Update the display for all bet counts
    bauCount.textContent = bets.bau.points;
    cuaCount.textContent = bets.cua.points;
    tomCount.textContent = bets.tom.points;
    caCount.textContent = bets.ca.points;
    huouCount.textContent = bets.huou.points;
    gaCount.textContent = bets.ga.points;

    updateSpinButtonState(); // Update the state of the spin button
}

// Function to update the spin button state
function updateSpinButtonState() {
    // Enable the spin button only if 3 points have been placed
    spinButton.disabled = totalPoints !== maxPoints;
}

// Function to get the spin result
function getSpinResult() {
    return Array.from(outcomeImages).map(img => img.src.split('/').pop());
}

// Function to count occurrences of each image in the result
function countResults(results) {
    return results.reduce((count, result) => {
        count[result] = (count[result] || 0) + 1;
        return count;
    }, {});
}

// Function to format the result counts into a string
function formatResults(counts) {
    return Object.entries(counts)
        .map(([image, count]) => {
            const name = image.split('.')[0]; // Extract the image name
            return `${name}: ${count}`;
        })
        .join(', ');
}

// Function to check if the player's bets match the spin result
function checkWin() {
    const spinResult = getSpinResult();
    const resultCounts = countResults(spinResult);

    // Collect the player's bets into an array
    const playerBets = [];
    for (const [key, betObj] of Object.entries(bets)) {
        if (betObj.points > 0) {
            playerBets.push(...Array(betObj.points).fill(document.getElementById(key).src.split('/').pop()));
        }
    }

    // Compare the player's bets with the spin result
    if (JSON.stringify(spinResult.sort()) === JSON.stringify(playerBets.sort())) {
        console.log("cHÚC MỪNG BẠN ĐÃ ĐOÁN ĐÚNG");
    } else {
        // Format and log the spin result counts
        const formattedResults = formatResults(resultCounts);
        console.log(`Bạn đã đoán sai, kết quả đúng là: ${formattedResults}`);
    }
}

// Function to disable buttons during spinning
function disableButtons() {
    spinButton.disabled = true;
    resetButton.disabled = true;
    bauTag.disabled = true;
    cuaTag.disabled = true;
    tomTag.disabled = true;
    caTag.disabled = true;
    huouTag.disabled = true;
    gaTag.disabled = true;
}

// Function to enable buttons after spinning
function enableButtons() {
    spinButton.disabled = false;
    resetButton.disabled = false;
    bauTag.disabled = false;
    cuaTag.disabled = false;
    tomTag.disabled = false;
    caTag.disabled = false;
    huouTag.disabled = false;
    gaTag.disabled = false;

    updateSpinButtonState(); // Re-check the spin button state
}

// Event listeners for each image
bauTag.addEventListener('click', () => placeBet(bauTag, bets.bau, bauCount));
cuaTag.addEventListener('click', () => placeBet(cuaTag, bets.cua, cuaCount));
tomTag.addEventListener('click', () => placeBet(tomTag, bets.tom, tomCount));
caTag.addEventListener('click', () => placeBet(caTag, bets.ca, caCount));
huouTag.addEventListener('click', () => placeBet(huouTag, bets.huou, huouCount));
gaTag.addEventListener('click', () => placeBet(gaTag, bets.ga, gaCount));

// Event listener for the reset button
resetButton.addEventListener('click', resetBets);

// Event listener for the spin button
spinButton.addEventListener('click', () => {
    // Disable all buttons during spinning
    disableButtons();

    outcomeImages.forEach((image, index) => {
        let count = 0;
        const interval = setInterval(() => {
            const randomImage = images[Math.floor(Math.random() * images.length)];
            image.src = randomImage;
            count++;
            if (count >= 100) {
                clearInterval(interval);
                // Check if all three results match the bets after the spin ends
                if (index === outcomeImages.length - 1) {
                    setTimeout(() => {
                        checkWin();
                        enableButtons(); // Re-enable buttons after the spin is complete
                    }, 500); // Give some time before checking win/lose
                }
            }
        }, 10); // Frequency of 10ms for spinning effect
    });
});

// Initialize the spin button state
updateSpinButtonState();