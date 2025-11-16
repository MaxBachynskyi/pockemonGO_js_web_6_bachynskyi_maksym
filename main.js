import { initBattle } from './battle.js';
import { generateAttackButtons, generateHealsButtons } from './attackButtons.js';

document.addEventListener('DOMContentLoaded', () => {
    initBattle();
    generateAttackButtons();
    generateHealsButtons();
});

