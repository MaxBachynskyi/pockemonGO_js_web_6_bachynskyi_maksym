import { character } from "./battle.js";

export class Pokemon {
        constructor({ name, defaultHP, damageHP, level = 1, img, elHP, elProgressbar, attacks = [], dmg = 5, heals = [] }) {
        this.name = name;
        this.defaultHP = defaultHP;
        this.damageHP = damageHP;
        this.level = level;
        this.img = img;
        this.elHP = elHP;
        this.elProgressbar = elProgressbar;
        this.attacks = attacks;
        this.heals = heals;
        this.dmg = dmg; 
        this.isStunned = false;
    }


    renderHP() {
        this.renderHPLife();
        this.renderProgressbarHP();
    }

    renderHPLife() {
        const { elHP, damageHP, defaultHP } = this;
        elHP.innerText = `${damageHP} / ${defaultHP}`;
    }

    renderProgressbarHP() {
    const { elProgressbar, damageHP, defaultHP } = this;
    const percent = (damageHP / defaultHP) * 100;

    elProgressbar.style.width = `${percent}%`;

    elProgressbar.classList.remove("low", "critical");

    if (percent < 20) {
        elProgressbar.classList.add("critical");
    } else if (percent < 60) {
        elProgressbar.classList.add("low");
    }
}

    changeHP(count) {
    const newHP = this.damageHP - count;

    if (count > 0 && newHP <= 0) {
        this.damageHP = 0;
        this.renderHP();
        return true;
    }

    this.damageHP = Math.max(0, Math.min(this.defaultHP, newHP));
    this.renderHP();

    return false;
}

    resetHP() {
        this.damageHP = this.defaultHP;
        this.renderHP();
    }
}

export const getEl = (id) => document.getElementById(id);

export const random = (num) => Math.ceil(Math.random() * num);
export const random_dmg = (minDamage, maxDamage) => Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage;
