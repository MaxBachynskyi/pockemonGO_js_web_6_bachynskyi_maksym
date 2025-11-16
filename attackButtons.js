import { character, enemy, enemies, setEnemy, loadEnemy, disableButtons, addBattleLog, switchToNextCharacter } from "./battle.js";
import { random_dmg } from "./pokemon.js";

function enemyAttack() {
    const availableAttacks = enemy.attacks.filter(a => !a.used || a.used < a.maxCount);

    if (availableAttacks.length === 0) {
        return 0;
    }

    const attack = availableAttacks[Math.floor(Math.random() * availableAttacks.length)];

    if (!attack.used) attack.used = 0;
    attack.used++;

    const damage = random_dmg(attack.minDamage, attack.maxDamage);

    return {
        damage,
        attackName: attack.name
    };
}

export function generateAttackButtons() {
    const container = document.getElementById("attack-buttons");
    container.innerHTML = "";

    character.attacks.forEach(attack => {
        const btn = document.createElement("button");
        btn.className = "button";
        btn.innerText = `${attack.name} (${attack.maxCount})`;

        let count = 0;

        btn.addEventListener("click", () => {
            if (count >= attack.maxCount) return;

            count++;
            btn.innerText = `${attack.name} (${attack.maxCount - count})`;

            disableButtons(true);

            const dmg = random_dmg(attack.minDamage, attack.maxDamage);
            const enemyIsDead = enemy.changeHP(dmg);

            addBattleLog({
                firstPerson: character.name,
                secondPerson: enemy.name,
                dmg: dmg,
                remainingHP: enemy.damageHP,
                maxHP: enemy.defaultHP
            });

            if (enemyIsDead) {
                const nextIndex = enemies.indexOf(enemy) + 1;

                if (nextIndex < enemies.length) {
                    const newEnemy = enemies[nextIndex];
                    addBattleLog({
                        firstPerson: enemy.name,
                        customText: `${enemy.name} програв 🏆!`
                    });

                    setEnemy(newEnemy);
                    loadEnemy(newEnemy);
                } else {
                    disableButtons(true);
                    return;
                }
            }

            setTimeout(() => {
                if (!enemy.isStunned) {
                    const attackInfo = enemyAttack();
                    const dmgEnemy = attackInfo.damage;

                    const characterIsDead = character.changeHP(dmgEnemy);

                    addBattleLog({
                        firstPerson: enemy.name,
                        secondPerson: character.name,
                        dmg: dmgEnemy,
                        remainingHP: character.damageHP,
                        maxHP: character.defaultHP,
                        customText: `${enemy.name} використав ${attackInfo.attackName}!`
                    });

                    if (characterIsDead) {
                        addBattleLog({
                            firstPerson: character.name,
                            customText: `${character.name} вибув з бою!`
                        });

                        const hasNext = switchToNextCharacter();
                        if (!hasNext) return;
                    }

                }

                disableButtons(false);
            }, 700);
        });

        container.appendChild(btn);
    });
}

export function generateHealsButtons() {
    const container = document.getElementById("heal-buttons");
    container.innerHTML = "";

    if (!character.heals || character.heals.length === 0) {
        console.warn("character.heals is empty!");
        return;
    }

    character.heals.forEach(heal => {
        const btn = document.createElement("button");
        btn.className = "button";
        btn.innerText = `${heal.name} (${heal.maxCount})`;

        let count = 0;

        btn.addEventListener("click", () => {
            if (count >= heal.maxCount) return;

            const min = typeof heal.minHeal === 'number' ? heal.minHeal : (typeof heal.minHP === 'number' ? heal.minHP : undefined);
            const max = typeof heal.maxHeal === 'number' ? heal.maxHeal : (typeof heal.maxHP === 'number' ? heal.maxHP : undefined);

            if (min === undefined || max === undefined) {
                console.error("Heal object missing min/max fields:", heal);
                return;
            }

            count++;
            btn.innerText = `${heal.name} (${heal.maxCount - count})`;

            disableButtons(true);

            const healAmount = random_dmg(min, max);

            character.changeHP(-healAmount);

            addBattleLog({
                firstPerson: character.name,
                customText: `${character.name} відновив ${healAmount} HP 💚`,
                remainingHP: character.damageHP,
                maxHP: character.defaultHP
            });

            setTimeout(() => {
                if (!enemy.isStunned) {
                    const attackInfo = enemyAttack();
                    const dmgEnemy = attackInfo.damage;

                    const characterIsDead = character.changeHP(dmgEnemy);

                    addBattleLog({
                        firstPerson: enemy.name,
                        secondPerson: character.name,
                        dmg: dmgEnemy,
                        remainingHP: character.damageHP,
                        maxHP: character.defaultHP,
                        customText: `${enemy.name} використав ${attackInfo.attackName}!`
                    });

                    if (characterIsDead) {
                        addBattleLog({
                            firstPerson: character.name,
                            customText: `${character.name} вибув з бою!`
                        });

                        const hasNext = switchToNextCharacter();
                        if (!hasNext) return;
                    }
                }

                disableButtons(false);
            }, 700);
        });

        container.appendChild(btn);
    });
}


