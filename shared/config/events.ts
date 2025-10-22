// Định nghĩa các loại sự kiện có thể xảy ra
export const events = {
  exp_surge: {
    name: 'Linh Khí Đột Biến',
    durationMinutes: 10,
    // Mô tả khi sự kiện bắt đầu và kết thúc
    startMessage: 'Một luồng linh khí cường đại đột nhiên bộc phát trong khu vực!',
    endMessage: 'Luồng linh khí đã dần ổn định trở lại.',
    // Hiệu ứng của sự kiện
    effects: [{ type: 'EXP_GAIN_MULTIPLIER', value: 1.5 }] // +50% EXP tu luyện và chiến đấu
  },
  monster_horde: {
    name: 'Thú Triều Bộc Phát',
    durationMinutes: 15,
    startMessage: 'Mặt đất rung chuyển! Một bầy quái thú đang tràn vào khu vực!',
    endMessage: 'Bầy quái thú đã bị đẩy lùi.',
    effects: [{ type: 'MONSTER_SPAWN_RATE', value: 2.0 }] // Tăng gấp đôi tỷ lệ xuất hiện quái
  },
  wandering_boss: {
    name: 'Boss Du Hành Xuất Hiện',
    durationMinutes: 20,
    startMessage: 'Một khí tức kinh hoàng bao trùm! Một con quái thú Vương Cấp lạc loài đã xuất hiện!',
    endMessage: 'Boss du hành đã rời khỏi khu vực.',
    effects: [{ type: 'SPAWN_BOSS', monsterId: 'armored_tiger' }] // Ví dụ spawn một con boss
  }
} as const

export type EventId = keyof typeof events
