scoreboard players set "test" judge 0
execute if entity @a[scores={role=3..},tag=!death] run scoreboard players add "test" judge 1
execute if entity @a[scores={role=2},tag=!death] run scoreboard players add "test" judge 2
execute if entity @a[scores={role=1},tag=!death] run scoreboard players add "test" judge 4

execute if score "test" judge matches 1..3 run function winV
execute if score "test" judge matches 4 run function winW
execute if score "test" judge matches 6 run function winW
execute if score "test" judge matches 0 run function draw
