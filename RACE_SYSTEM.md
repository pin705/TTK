# Race System Documentation

## Overview
The race system adds diverse character races to TTK, each with unique stats, growth rates, and innate abilities. Race is chosen at character creation and **cannot be changed**.

## Available Races

### 1. Human (Nhân Loại)
**Theme**: Balanced and adaptable survivors of the Great Apocalypse

**Base Stats**:
- HP: 100
- Energy: 500
- Attack: 10
- Defense: 8
- Speed: 10
- Spirit: 10

**Racial Bonuses**:
- +10% EXP gain
- +5% cultivation speed

**Innate Skills**:
1. **Thích Nghi (Adaptability)** - Passive
   - Gain 10% bonus EXP from all sources
   
2. **Ý Chí Sắt Đá (Iron Will)** - Active
   - Cooldown: 5 minutes
   - Energy Cost: 100
   - Effect: Heal 30% max HP and gain 20% defense buff for 30 seconds

**Growth Rates** (per level):
- HP: +10
- Energy: +20
- Attack: +1.5
- Defense: +1.2
- Speed: +1.0
- Spirit: +1.0

### 2. Mutant (Dị Nhân)
**Theme**: Genetically mutated humans with superior combat strength

**Base Stats**:
- HP: 120
- Energy: 400
- Attack: 15
- Defense: 10
- Speed: 8
- Spirit: 5

**Racial Bonuses**:
- +5% critical chance
- +20% critical damage

**Innate Skills**:
1. **Bạo Tẩu (Berserker)** - Passive
   - Gain 10% attack when HP below 50%
   - +20% critical damage
   
2. **Cuồng Nộ (Rage)** - Active
   - Cooldown: 3 minutes
   - Energy Cost: 150
   - Effect: +50% damage, -20% defense for 20 seconds

**Growth Rates** (per level):
- HP: +12
- Energy: +15
- Attack: +2.0
- Defense: +1.5
- Speed: +0.8
- Spirit: +0.5

### 3. Esper (Linh Năng Giả)
**Theme**: Psychic warriors with powerful mental abilities

**Base Stats**:
- HP: 80
- Energy: 600
- Attack: 5
- Defense: 5
- Speed: 12
- Spirit: 18

**Racial Bonuses**:
- +15% cultivation speed
- -10% energy costs for all actions

**Innate Skills**:
1. **Tâm Linh Thông (Psychic Connection)** - Passive
   - +15% cultivation speed
   - -10% energy costs
   
2. **Niệm Động Lực (Telekinesis)** - Active
   - Cooldown: 1 minute
   - Energy Cost: 80
   - Effect: Attack 5 targets with spirit-based AoE damage (150% spirit)

**Growth Rates** (per level):
- HP: +8
- Energy: +25
- Attack: +0.5
- Defense: +0.8
- Speed: +1.2
- Spirit: +2.5

### 4. Cyborg (Cơ Giới Chiến Binh)
**Theme**: Mechanically augmented humans with enhanced durability

**Base Stats**:
- HP: 110
- Energy: 480
- Attack: 12
- Defense: 12
- Speed: 9
- Spirit: 8

**Racial Bonuses**:
- +5 resistance
- +10% item drop rate

**Innate Skills**:
1. **Giáp Cơ Giới (Mechanical Armor)** - Passive
   - +5 resistance
   - -10% physical damage taken
   
2. **Quá Tải Hệ Thống (System Overload)** - Active
   - Cooldown: 4 minutes
   - Energy Cost: 120
   - Effect: All equipped modules gain 30% effectiveness for 25 seconds

**Growth Rates** (per level):
- HP: +11
- Energy: +18
- Attack: +1.2
- Defense: +1.8
- Speed: +0.9
- Spirit: +0.8

### 5. Beast Kin (Thú Nhân)
**Theme**: Human-beast hybrids with incredible agility and hunting instincts

**Base Stats**:
- HP: 95
- Energy: 520
- Attack: 13
- Defense: 7
- Speed: 15
- Spirit: 7

**Racial Bonuses**:
- +8% dodge chance
- +15% monster drop rate

**Innate Skills**:
1. **Bản Năng Thú Tính (Beast Instinct)** - Passive
   - +8% dodge chance
   - +15% monster loot drops
   
2. **Bản Năng Săn Mồi (Hunt Mode)** - Active
   - Cooldown: 2 minutes
   - Energy Cost: 90
   - Effect: +40% speed and +25% damage for 15 seconds

**Growth Rates** (per level):
- HP: +9
- Energy: +22
- Attack: +1.8
- Defense: +1.0
- Speed: +1.5
- Spirit: +0.6

### 6. Void Walker (Hư Không Hành Giả)
**Theme**: Space-bending assassins with extreme critical potential

**Base Stats**:
- HP: 85
- Energy: 550
- Attack: 11
- Defense: 6
- Speed: 14
- Spirit: 12

**Racial Bonuses**:
- +10% critical chance
- +5% dodge chance

**Innate Skills**:
1. **Bóng Tối Hư Không (Void Shadow)** - Passive
   - +10% critical chance
   - +5% dodge chance
   - First strike always critical
   
2. **Nhất Kích Tất Sát (Assassinate)** - Active
   - Cooldown: 2.5 minutes
   - Energy Cost: 110
   - Effect: Single target attack with 300% critical damage, ignores 50% defense

**Growth Rates** (per level):
- HP: +8
- Energy: +23
- Attack: +1.6
- Defense: +0.9
- Speed: +1.3
- Spirit: +1.1

## Character Creation

When creating a character, race selection is **required**:

```json
POST /api/character/create
{
  "name": "CharacterName",
  "race": "human",  // Required: human, mutant, esper, cyborg, beastkin, voidwalker
  "class": "Warrior" // Optional: defaults to Warrior
}
```

## Using Racial Skills

### Passive Skills
Passive racial skills are always active and don't need to be activated.

### Active Skills
Active racial skills can be used through the action system:

```json
POST /api/action
{
  "action": "character/useRacialSkill",
  "payload": {
    "skillId": "human_willpower"  // Skill ID from race config
  }
}
```

**Example Skill IDs**:
- `human_willpower` - Human active skill
- `mutant_rage` - Mutant active skill
- `esper_telekinesis` - Esper active skill
- `cyborg_overload` - Cyborg active skill
- `beastkin_hunt` - Beast Kin active skill
- `voidwalker_strike` - Void Walker active skill

## Race-Specific Equipment

Some equipment items are restricted to specific races:

- **Human Valor Badge** - Human only (+10 attack, +10 defense, +100 HP)
- **Mutant Power Gauntlet** - Mutant only (+20 attack, +20% crit damage)
- **Esper Mind Crown** - Esper only (+25 spirit, +150 energy)
- **Cyborg Power Core** - Cyborg only (+15 defense, +10 resistance, +100 energy)
- **Beastkin Feral Totem** - Beast Kin only (+15 attack, +8 speed, +5% dodge)
- **Voidwalker Shadow Cloak** - Void Walker only (+10% crit, +8% dodge, +5 speed)

These items can be purchased from the **Mysterious Merchant** (Thương Nhân Bí Ẩn) for 12,000 Energy Crystals each.

## Stat Growth on Level Up

Each race has different stat growth rates. When you level up:
1. Base stats increase according to race growth rates
2. Racial bonuses are applied
3. You receive stat points to allocate manually
4. HP and Energy are fully restored

## Balancing Overview

| Race        | Role        | Strengths                    | Weaknesses        |
|-------------|-------------|------------------------------|-------------------|
| Human       | All-rounder | Balanced, EXP bonus          | No specialization |
| Mutant      | Berserker   | High damage, crit            | Low spirit        |
| Esper       | Mage        | High spirit, AoE, energy     | Low HP/defense    |
| Cyborg      | Tank        | High defense, resistance     | Average damage    |
| Beast Kin   | Scout       | Speed, dodge, item drops     | Low defense       |
| Void Walker | Assassin    | Critical damage, burst       | Low HP            |

## Integration with Existing Systems

### Combat
- Racial bonuses apply to all combat calculations
- Active racial skills can be used in combat
- Passive bonuses are always active

### Evolution/Cultivation
- Race cultivation bonuses affect absorption rates
- Human: +5% cultivation speed
- Esper: +15% cultivation speed

### Equipment
- Racial bonuses stack with equipment bonuses
- Some equipment is race-restricted

### Leveling
- Race growth rates determine stat gains per level
- All races receive same amount of allocatable stat points

## Future Enhancements

Planned features for the race system:
- Race-specific quest lines
- Race reputation system
- Cross-race relationships (ally/rival mechanics)
- Race-based guilds or factions
- Racial transformation abilities at high levels
- Hybrid races (requires special items/quests)
