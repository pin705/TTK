export const npcs = {
  vo_su_truong: {
    name: 'Võ Sư Trương',
    personality: 'neutral',
    dialogues: {
      greeting: [
        "Con đường võ đạo không có điểm dừng, chỉ có sự kiên trì.",
        "Cơ thể con người là một kho báu, hãy không ngừng khai phá nó.",
        "Một võ giả chân chính không chỉ có sức mạnh, mà còn có một trái tim kiên định.",
      ],
      farewell: ["Hãy chăm chỉ luyện tập."],
    },
    // quests: [{ questId: 'first_hunt', requiredLevel: 1 }] // Sẽ thêm sau
  },
  thuong_nhan_vat_lieu: {
    name: 'Lão Giả Bán Vật Liệu',
    personality: 'merchant',
    dialogues: {
      greeting: [
        "Vật liệu quái thú tươi mới đây! Cần gì cứ xem.",
        "Giá cả hôm nay lại biến động rồi, do tiểu đội Liệp Ưng vừa trở về đó.",
        "Cần Da Thú hay Gân Thú? Tôi có đủ cả, chỉ cần cậu có đủ tiền.",
      ],
      farewell: ["Hẹn gặp lại.", "Lần sau có hàng tốt tôi sẽ giữ cho cậu."],
    },
  },
  tinh_bao_vien: {
    name: 'Người Cung Cấp Tình Báo',
    personality: 'neutral',
    dialogues: {
        greeting: [
            "Tin tức mới nhất, muốn nghe không? Đương nhiên là không miễn phí.",
            "Nghe nói ở khu hoang dã 0203 mới xuất hiện một con Thú Tướng biến dị.",
            "Một số thứ không thể mua được bằng tiền, mà phải mua bằng tin tức."
        ],
        farewell: ["Hãy cẩn thận."
        ],
    },
  }
} as const

export type NpcId = keyof typeof npcs;
