import { Pokemon, getEl, random } from './pokemon.js';
import { generateLog } from './logs.js';
import { generateAttackButtons, generateHealsButtons } from "./attackButtons.js";


export const $logs = getEl('logs');
export let currentCharacterIndex = 0;


export const playerTeam = [
    new Pokemon({
        name: 'Pikachu',
        defaultHP: 520,
        damageHP: 520,
        elHP: getEl('health-character'),
        elProgressbar: getEl('progressbar-character'),
        img: './assets/Pikachu_card_logo.png',
        attacks:[
            {
                name: "thunder jolt",
                maxDamage: 40,
                minDamage: 20,
                maxCount: 100,
            },
            {
                name: "electro ball",
                maxDamage: 60,
                minDamage: 45,
                maxCount: 6,
            },
            {
                name: "volt tackle",
                maxDamage: 75,
                minDamage: 60,
                maxCount: 4,
            },
            {
                name: "thunder crack",
                maxDamage: 160,
                minDamage: 130,
                maxCount: 2,
            }
        ],
        heals:[
            {
                name: "Potion Heal",
                minHP: 30,
                maxHP: 150,
                maxCount: 5,
            }
        ]
    }),
    new Pokemon({
        name: 'Mew',
        defaultHP: 300,
        damageHP: 300,
        elHP: getEl('health-character'),
        elProgressbar: getEl('progressbar-character'),
        img: './assets/Pokemon_Mew_card_logo.png',
        attacks:[
            {
                name: "Pound",
                maxDamage: 40,
                minDamage: 20,
                maxCount: 100,
            },
            {
                name: "Ancient Power",
                maxDamage: 60,
                minDamage: 45,
                maxCount: 6,
            },
            {
                name: "Aura Sphere",
                maxDamage: 75,
                minDamage: 60,
                maxCount: 4,
            },
            {
                name: "Psychic",
                maxDamage: 130,
                minDamage: 110,
                maxCount: 2,
            }
        ],
        heals:[
            {
                name: "Small Potion Heal",
                minHP: 20,
                maxHP: 80,
                maxCount: 10,
            }
        ]
    }),
];

export let character = playerTeam[currentCharacterIndex];

export const enemies = [
    new Pokemon({
        name: 'Charmander',
        defaultHP: 440,
        damageHP: 440,
        dmg: 40,
        level: 1,
        img: './assets/charmander_card_logo.png',
        elHP: getEl('health-enemy'),
        elProgressbar: getEl('progressbar-enemy'),
        attacks:[
            {
                name: "ember",
                minDamage: 30,
                maxDamage: 55,
                maxCount: 30,
            },
            {
                name: "fire fang",
                minDamage: 45,
                maxDamage: 70,
                maxCount: 15,
            },
            {
                name: "flamethrower",
                minDamage: 90,
                maxDamage: 120,
                maxCount: 5,
            }
        ]
    }),
    new Pokemon({
        name: 'Bisasam',
        defaultHP: 1100,
        damageHP: 1100,
        dmg: 20,
        level: 2,
        img: './assets/bisasam_card_logo.png',
        elHP: getEl('health-enemy'),
        elProgressbar: getEl('progressbar-enemy'),
        attacks:[
            {
                name: "Tackle",
                minDamage: 5,
                maxDamage: 15,
                maxCount: 40,
            },
            {
                name: "Vine Whip",
                minDamage: 20,
                maxDamage: 30,
                maxCount: 20,
            },
            {
                name: "Seed Bomb",
                minDamage: 30,
                maxDamage: 70,
                maxCount: 2,
            }
        ]
    })
];

export let currentEnemyIndex = 0;
export let enemy = enemies[currentEnemyIndex];

const enemyName = getEl('name-enemy'); 
const enemyImg = document.querySelector('.enemy .sprite');
const enemyLvl = document.querySelector('.enemy .lvl'); 

export function loadEnemy(pokemon) { 
    const { name, img, level } = pokemon; 
    enemyName.innerText = name; 
    enemyImg.src = img;
    enemyLvl.innerText = `Lv. ${level}`;
    pokemon.resetHP(); 
}

const playerName = getEl('name-character');
const playerImg = document.querySelector('.character .sprite');
const playerLvl = document.querySelector('.character .lvl');



export function loadCharacter(pokemon) {
    playerName.innerText = pokemon.name;
    if (pokemon.img) playerImg.src = pokemon.img;
    playerLvl.innerText = `Lv. ${pokemon.level}`;
    pokemon.renderHP();
}


export function disableButtons(state) {
    const attackButtons = document.querySelectorAll("#attack-buttons .button");
    const healButtons = document.querySelectorAll("#heal-buttons .button");

    attackButtons.forEach(btn => {
        btn.disabled = state;
    });
    healButtons.forEach(btn => {
        btn.disabled = state;
    });
}


export function addBattleLog({ firstPerson, secondPerson = '', dmg = 0, remainingHP, maxHP, customText = null }) {
    const logEntry = document.createElement('div');
    logEntry.style.marginBottom = '5px';

    const story = customText
        ? customText
        : (secondPerson ? generateLog(firstPerson, secondPerson) : `${firstPerson} програв`);

    logEntry.innerHTML = `
        <p>${story}</p>
        <small>Втрати: ${dmg > 0 ? dmg : 0} HP, залишилось: ${remainingHP} / ${maxHP}</small>
    `;
    $logs.prepend(logEntry);
}

export function switchToNextCharacter() {
    currentCharacterIndex++;

    if (currentCharacterIndex >= playerTeam.length) {
        addBattleLog({
            firstPerson: "",
            customText: "У вас закінчилися покемони! Ви програли!"
        });
        disableButtons(true);
        return false;
    }

    character = playerTeam[currentCharacterIndex];

    addBattleLog({
        firstPerson: character.name,
        customText: `${character.name} виходить у бій!`
    });

    loadCharacter(character);

    generateAttackButtons();
    generateHealsButtons();

    return true;
}


export function setEnemy(newEnemy) {
    enemy = newEnemy;
}

export function initBattle() {
    console.log('Start Game!');
    character.renderHP();
    loadEnemy(enemy);
}
