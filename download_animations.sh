#!/bin/bash

# Create animations directory if it doesn't exist
mkdir -p assets/animations

# Download animations
curl -o assets/animations/fitness.json "https://assets5.lottiefiles.com/packages/lf20_jR229r.json"
curl -o assets/animations/premium.json "https://assets5.lottiefiles.com/packages/lf20_xwmj0hsk.json"
curl -o assets/animations/confetti.json "https://assets5.lottiefiles.com/packages/lf20_u4yrau.json"
curl -o assets/animations/success.json "https://assets5.lottiefiles.com/packages/lf20_jmejybvu.json"

echo "Animations downloaded successfully!" 