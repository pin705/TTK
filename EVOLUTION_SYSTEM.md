# Evolution System - Post-Apocalyptic Game Features

## Overview
This document describes the evolution system implementation for the TTK game, transforming it from a traditional cultivation game into a post-apocalyptic sci-fi evolution system.

## Core Systems Implemented

### 1. Zone Types (Map System)

#### Base (Căn Cứ) - Safe Zones
- **Energy Cost**: 0
- **Death Penalty**: None
- **Features**: Safe area, allows cultivation/evolution, trading, quest NPCs
- **Examples**: Khu Dân Cư, Võ Quán, Chợ Giao Dịch, Cổng Căn Cứ

#### Wilderness (Khu Hoang Dã) - PVE Zones
- **Energy Cost**: 5-10 per move
- **Death Penalty**: 10-20% energy crystal loss
- **Features**: Monster hunting, resource gathering
- **Examples**: Hoang Dã 0201, Hoang Dã 0202

#### Chaos Zones (Khu Hỗn Loạn) - PVP Zones
- **Energy Cost**: 10+ per move
- **Death Penalty**: 30% energy crystal loss + 10% chance to drop inventory items
- **Features**: PVP enabled, contested resources, high-value rewards
- **Examples**: Mỏ Tinh Thể Tranh Chấp

#### Secret Realms (Bí Cảnh) - Instance Zones
- **Energy Cost**: 10-15 per move
- **Death Penalty**: 20% energy crystal loss
- **Features**: Boss battles, rare rewards, may require keys
- **Examples**: Sào Huyệt Mãnh Hổ

#### Space Zones (Vũ Trụ) - Future Implementation
- **Requirements**: Wargod rank or higher, spaceship item
- **Features**: Advanced zones on Moon, Mars, Asteroid Belt
- **Status**: Planned for future release

### 2. Energy System

#### Energy Crystals (Tinh Thể Năng Lượng)
- **Primary Currency**: Used for both trading and evolution
- **Sources**: 
  - Monster drops
  - Zone resource gathering
  - Quest rewards
- **Usage**:
  - Absorb for gene energy (10 gene energy per crystal)
  - Trade with NPCs
  - Crafting materials

#### Energy (Năng Lượng)
- **Function**: Replaces stamina/fatigue system
- **Consumption**: Every action costs energy (movement, combat, gathering)
- **Recovery**: 
  - Slow natural regeneration
  - Energy Solution items
  - Rest in safe zones

### 3. Evolution Ranks (Gene-based Progression)

#### Rank Structure
1. **Học Đồ (Apprentice)** - Levels 1-9
   - Starting rank
   - Auto-advance on sufficient gene energy
   - No breakthrough required until level 9

2. **Chiến Sĩ (Soldier)** - Low/Mid/High
   - Requires: Gene Evolution Solution (Basic)
   - Breakthrough chance: 95%
   - Failure penalty: -5 gene integrity

3. **Chiến Tướng (General)** - Low/Mid/High
   - Requires: Gene Evolution Solution (Advanced/Elite)
   - Breakthrough chance: 85-70%
   - Failure penalty: -10 to -15 gene integrity

4. **Chiến Thần (Wargod)**
   - Requires: Gene Evolution Solution (Legendary)
   - Breakthrough chance: 50%
   - Failure penalty: -20 gene integrity
   - Unlocks: Space travel

5. **Hành Tinh Cấp (Planetary)** - Low/Mid/High
   - Post-Earth ranks
   - Access to space zones

### 4. Gene Breakthrough System

#### Requirements
- Sufficient gene energy
- Gene Evolution Solution item
- Located in safe zone (Base)
- Gene integrity affects success rate (+/-0.2% per point)

#### Success
- Advance to next rank
- Stat increases (HP, Energy, Attack, Defense)
- Full HP and Energy restore

#### Failure
- Item consumed
- Gene integrity reduced
- Temporary "Gene Damage" debuff if integrity < 50
- Retry after recovery

### 5. Module System (Mechanization)

#### Module Types

**Cultivation Chips**
- Basic: +20% energy absorption speed
- Advanced: +50% speed
- Elite: +100% speed

**Combat Modules**
- Attack: +15 attack
- Defense: +10 defense
- Critical: +10% crit chance

**Survival Modules**
- Energy: -20% energy cost
- Recovery: +50% HP regen
- Shield: -15% damage taken

#### Module Slots
- Each character has 3 slots: cultivation, combat, survival
- Equip/unequip via `character/equipModule` action
- Only one module per slot

### 6. Monster Tier System

#### Beast Soldier (Thú Binh)
- **Low**: Basic enemies, low threat
- **Mid**: Moderate threat
- **High**: Veteran enemies
- **Drops**: Common materials, 1-5 energy crystals

#### Beast General (Thú Tướng)
- **Low**: Mini-boss level
- **Mid**: Strong mini-boss
- **High**: Elite enemy
- **Drops**: Rare materials, 5-12 energy crystals, cosmic herbs

#### Beast King (Vương Cấp)
- **Tier**: Boss level
- **Drops**: Epic materials, 15-25 energy crystals, breakthrough items

### 7. Resources

#### Evolution Resources
- **Cosmic Herbs**: Crafting gene solutions
- **Alloy Ores**: Weapon/armor crafting
- **Ruin Modules**: Module upgrades

#### Gene Solutions
- **Basic**: Apprentice → Soldier breakthrough
- **Advanced**: Soldier → General breakthrough
- **Elite**: General → Wargod breakthrough
- **Legendary**: Wargod → Planetary breakthrough

## Action Handlers

### character/absorbEnergy
Absorb energy crystals to gain gene energy for evolution
- **Parameters**: `{ amount: number }`
- **Effect**: Converts crystals to gene energy (1:10 ratio)
- **Auto-rank**: Advances if ready and no breakthrough required

### character/geneBreakthrough
Attempt breakthrough to advance major rank
- **Requirements**: Safe zone, sufficient gene energy, breakthrough item
- **Success Rate**: Based on rank and gene integrity
- **Effect**: Advance rank or lose integrity

### character/equipModule
Equip or unequip body modules
- **Parameters**: `{ moduleId: string, slot: 'cultivation'|'combat'|'survival' }`
- **Effect**: Swap modules, apply stat bonuses

## Death Penalty System

When a character dies:
1. Respawn at designated safe zone
2. Restore to 5% HP
3. Apply "Heavy Wound" debuff (60 seconds)
4. Energy crystal loss based on zone type:
   - Wilderness: 10-20%
   - Chaos: 30% + item drop chance
   - Secret Realm: 20%
5. Reduce cultivation state of mind

## Future Features (Planned)

### Spirit Master Class (Niệm Sư)
- Parallel progression system
- Uses Spirit (Niệm Lực) instead of Physical stats
- Psychic abilities

### Crafting System
- Combine resources to create items
- Weapon/armor crafting
- Gene solution crafting

### Party System
- Team up for secret realms
- Shared loot
- Boss raids

### Guild System
- Create/join guilds
- Guild base building
- Guild wars

### Player Market
- Trade items between players
- Auction system
- Energy crystal economy

### Space Travel
- Unlocked at Wargod rank
- Moon base (safe zone)
- Mars mining operations
- Asteroid belt (secret realms)

### Random World Events
- Ancient ruin discoveries
- Temporary crystal mines (PVP)
- World bosses
- Energy storms

## Configuration Files

- **Zones**: `shared/config/zones.ts`
- **Evolution Ranks**: `shared/config/cultivation.ts`
- **Items**: `shared/config/items.ts`
- **Monsters**: `shared/config/monsters.ts`
- **Character Model**: `server/models/character.model.ts`

## Usage Examples

### Absorbing Energy Crystals
```javascript
// Player uses action to absorb 10 energy crystals
action: 'character/absorbEnergy'
payload: { amount: 10 }
// Result: Gain 100 gene energy, possible rank up
```

### Gene Breakthrough
```javascript
// Player attempts breakthrough with gene solution
action: 'character/geneBreakthrough'
// Requires: appropriate gene solution item in inventory
// Must be in safe zone (base)
```

### Equipping Module
```javascript
// Equip cultivation chip
action: 'character/equipModule'
payload: { 
  moduleId: 'cultivation_chip_advanced', 
  slot: 'cultivation' 
}
```

### Moving to Chaos Zone
```javascript
// Move to PVP zone (costs energy)
action: 'map/move'
payload: { direction: 'đến Mỏ Tinh Thể' }
// Energy cost deducted based on zone type
// Survival module can reduce cost by 20%
```

## Notes

- The old cultivation system remains intact for backward compatibility
- Evolution system can be used alongside or replace cultivation
- Energy crystals create a unified economy
- Module system provides RPG-style customization
- Zone types enable diverse gameplay (PVE, PVP, instances)
