<template>
  <div class="space-y-4 text-sm font-mono">
    <div class="p-3 bg-gray-900/50 border border-gray-700 shadow-inner">
      <h3 class="text-orange-400 border-b border-orange-700/50 pb-1 mb-3 font-bold uppercase tracking-wider">
        > KỸ NĂNG CHIẾN ĐẤU
      </h3>
      
      <div class="space-y-2">
        <div 
          v-for="skill in combatSkills" 
          :key="skill.id"
          class="border border-orange-600/30 bg-orange-900/10 p-3"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="text-orange-300 font-bold">{{ skill.name }}</p>
              <p class="text-xs text-gray-400">Cấp: {{ skill.level }} / {{ skill.maxLevel }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-400">Năng Lượng:</p>
              <p class="text-cyan-400 font-bold">{{ skill.energyCost }}</p>
            </div>
          </div>
          
          <p class="text-xs text-gray-300 mb-2">{{ skill.description }}</p>
          
          <div class="flex gap-2">
            <button 
              class="flex-1 px-2 py-1 border border-orange-600/50 bg-orange-900/30 text-orange-400 hover:bg-orange-900/50 transition-colors text-xs uppercase tracking-wider"
              @click="useSkill(skill.id)"
              :disabled="isLoading || !canUseSkill(skill)"
            >
              [ SỬ DỤNG ]
            </button>
            <button 
              v-if="skill.level < skill.maxLevel"
              class="px-2 py-1 border border-green-600/50 bg-green-900/30 text-green-400 hover:bg-green-900/50 transition-colors text-xs uppercase tracking-wider"
              @click="upgradeSkill(skill.id)"
              :disabled="isLoading"
            >
              [ NÂNG CẤP ]
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="combatSkills.length === 0" class="text-center py-6 text-gray-500 italic">
        [ CHƯA HỌC KỸ NĂNG CHIẾN ĐẤU NÀO ]
      </div>
    </div>

    <div class="p-3 bg-gray-900/50 border border-gray-700 shadow-inner">
      <h3 class="text-purple-400 border-b border-purple-700/50 pb-1 mb-3 font-bold uppercase tracking-wider">
        > KỸ NĂNG THỤ ĐỘNG
      </h3>
      
      <div class="space-y-2">
        <div 
          v-for="skill in passiveSkills" 
          :key="skill.id"
          class="border border-purple-600/30 bg-purple-900/10 p-3"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="text-purple-300 font-bold">{{ skill.name }}</p>
              <p class="text-xs text-gray-400">Cấp: {{ skill.level }} / {{ skill.maxLevel }}</p>
            </div>
            <div class="text-green-400 text-xs uppercase">
              [ ĐANG HOẠT ĐỘNG ]
            </div>
          </div>
          
          <p class="text-xs text-gray-300 mb-2">{{ skill.description }}</p>
          
          <div class="text-xs text-cyan-400">
            Hiệu Ứng: {{ skill.effect }}
          </div>
        </div>
      </div>
      
      <div v-if="passiveSkills.length === 0" class="text-center py-6 text-gray-500 italic">
        [ CHƯA CÓ KỸ NĂNG THỤ ĐỘNG NÀO ]
      </div>
    </div>

    <div class="p-3 bg-gray-900/50 border border-gray-700 shadow-inner">
      <h3 class="text-cyan-400 border-b border-cyan-700/50 pb-1 mb-3 font-bold uppercase tracking-wider">
        > KỸ NĂNG CHỦNG TỘC
      </h3>
      
      <div class="border border-cyan-600/30 bg-cyan-900/10 p-3">
        <div class="flex justify-between items-start mb-2">
          <div>
            <p class="text-cyan-300 font-bold">{{ racialSkillName }}</p>
            <p class="text-xs text-gray-400">Kỹ năng đặc biệt của chủng tộc {{ playerStore.character?.race }}</p>
          </div>
        </div>
        
        <p class="text-xs text-gray-300 mb-2">{{ racialSkillDesc }}</p>
        
        <button 
          class="w-full px-2 py-1.5 border border-cyan-600/50 bg-cyan-900/30 text-cyan-400 hover:bg-cyan-900/50 transition-colors text-xs uppercase tracking-wider"
          @click="useRacialSkill"
          :disabled="isLoading || racialSkillOnCooldown"
        >
          [ KÍCH HOẠT ]
          <span v-if="racialSkillCooldown > 0" class="text-gray-400"> ({{ racialSkillCooldown }}s)</span>
        </button>
      </div>
    </div>

    <div class="p-3 bg-gray-900/50 border border-gray-700 shadow-inner">
      <h3 class="text-yellow-400 border-b border-yellow-700/50 pb-1 mb-3 font-bold uppercase tracking-wider">
        > HỌC KỸ NĂNG MỚI
      </h3>
      
      <p class="text-xs text-gray-400 mb-3">Sử dụng Bí Tịch hoặc tìm Sư Phụ để học kỹ năng mới</p>
      
      <div class="space-y-2">
        <div 
          v-for="book in availableSkillBooks" 
          :key="book.id"
          class="border border-yellow-600/30 bg-yellow-900/10 p-2 flex justify-between items-center"
        >
          <div>
            <p class="text-yellow-300 font-semibold">{{ book.name }}</p>
            <p class="text-xs text-gray-400">{{ book.skillType }}</p>
          </div>
          <button 
            class="px-2 py-1 border border-green-600/50 bg-green-900/30 text-green-400 hover:bg-green-900/50 transition-colors text-xs uppercase tracking-wider"
            @click="learnSkill(book.id)"
            :disabled="isLoading"
          >
            [ HỌC ]
          </button>
        </div>
      </div>
      
      <div v-if="availableSkillBooks.length === 0" class="text-center py-4 text-gray-500 italic">
        [ KHÔNG CÓ BÍ TỊCH TRONG TÚI ĐỒ ]
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameAction } from '~/composables/useGameAction'
import { usePlayerStore } from '~/stores/player'

const { execute, isLoading } = useGameAction()
const playerStore = usePlayerStore()

// Mock data - would come from API/store in reality
const combatSkills = ref([])
const passiveSkills = ref([])
const availableSkillBooks = ref([])
const racialSkillCooldown = ref(0)

const racialSkillName = computed(() => {
  const race = playerStore.character?.race
  const names: Record<string, string> = {
    human: 'Tiềm Năng Vô Hạn',
    mutant: 'Đột Biến Gen',
    esper: 'Năng Lực Siêu Nhiên',
    cyborg: 'Quá Tải Hệ Thống',
    beastkin: 'Bản Năng Dã Thú',
    voidwalker: 'Bước Hư Không'
  }
  return names[race || 'human'] || 'Kỹ Năng Chủng Tộc'
})

const racialSkillDesc = computed(() => {
  const race = playerStore.character?.race
  const descs: Record<string, string> = {
    human: 'Tăng 20% kinh nghiệm nhận được trong 10 phút',
    mutant: 'Tăng tất cả chỉ số 15% trong 30 giây',
    esper: 'Gây sát thương tinh thần lên tất cả kẻ thù gần đó',
    cyborg: 'Tăng tốc độ và sát thương 50% nhưng mất HP mỗi giây',
    beastkin: 'Biến hình thành dã thú, tăng tốc độ và né tránh',
    voidwalker: 'Dịch chuyển tức thời và vô hình 3 giây'
  }
  return descs[race || 'human'] || 'Kỹ năng đặc biệt của chủng tộc'
})

const racialSkillOnCooldown = computed(() => racialSkillCooldown.value > 0)

function canUseSkill(skill: any) {
  return playerStore.character && playerStore.character.energy >= skill.energyCost
}

async function useSkill(skillId: string) {
  await execute('character/useSkill', { skillId })
}

async function upgradeSkill(skillId: string) {
  await execute('character/upgradeSkill', { skillId })
}

async function useRacialSkill() {
  await execute('character/useRacialSkill')
  racialSkillCooldown.value = 300 // 5 minutes
}

async function learnSkill(bookId: string) {
  await execute('character/learnSkill', { bookId })
}

// Countdown timer for racial skill
onMounted(() => {
  setInterval(() => {
    if (racialSkillCooldown.value > 0) {
      racialSkillCooldown.value--
    }
  }, 1000)
})
</script>
