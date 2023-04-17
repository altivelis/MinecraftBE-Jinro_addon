#エメラルド配布時間カウント
execute if score coin cooldown matches 1.. run scoreboard players add coin cooldown -1
scoreboard players set エメラルド配布まで roleList 0
scoreboard players operation エメラルド配布まで roleList = coin cooldown
scoreboard players operation エメラルド配布まで roleList /= tick cooldown
#エメラルド配布
execute if score coin cooldown matches 0 run scriptevent altivelis:coin
execute if score coin cooldown matches 0 run function coinCooldown
