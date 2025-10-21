export async function seedDatabase() {
  console.log('Seeding database...')

  // Clear existing data
  await Promise.all([Monster.deleteMany(), Zone.deleteMany(), Item.deleteMany(), Character.deleteMany()])

  // Create Items
  const ironScrap = await Item.create({ itemId: 'iron_scrap', name: 'Mảnh Vụn Cơ Khí', type: 'resource' })

  // Create Monsters
  const rustyBot = await Monster.create({
    name: 'Robot Bảo Trì rỉ sét',
    level: 1,
    hp: 50,
    attack: 5,
    defense: 2,
    drops: [{ itemId: ironScrap.itemId, dropChance: 0.8, quantity: [1, 3] }],
  })

  // Create Zones
  const startZone = await Zone.create({
    name: 'Tàn Tích Phi Thuyền',
    description: 'Bạn đang đứng giữa một khoang động cơ đổ nát. Những tia lửa điện yếu ớt vẫn còn lóe lên.',
    monsters: [{ monsterId: rustyBot._id, spawnChance: 1 }],
    resources: [{ itemId: ironScrap.itemId, spawnChance: 1, quantity: [1, 1] }],
  })

  const cockpitZone = await Zone.create({
    name: 'Buồng Lái',
    description: 'Bảng điều khiển chính đã bị phá hủy, nhưng một màn hình phụ vẫn còn sáng le lói.',
  })

  // Link zones
  startZone.connectedZones.push({ direction: 'north', zoneId: cockpitZone._id })
  await startZone.save()

  // Create a character
  // await Character.create({
  //   // Cần có userId từ một User đã đăng ký
  //   name: 'La Phong',
  //   currentZoneId: startZone._id,
  // })

  console.log('Database seeded!')
}

// Thêm một API để gọi hàm này, hoặc chạy nó một lần khi server khởi động
