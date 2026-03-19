#!/bin/bash
npm run build
rsync -avz --delete dist/ raoul@72.61.195.127:/var/www/monsalon/
echo "✅ Déployé avec succès"
