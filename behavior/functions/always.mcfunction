#marker
execute as @e[type=arrow,tag=!hit] at @s run particle minecraft:explosion_particle ~ ~ ~
execute if entity @a[hasitem={item=altivelis:marker_white,location=slot.weapon.mainhand,slot=0}] as @e[type=altivelis:marker,tag=white] at @s run particle minecraft:balloon_gas_particle ~~~
execute if entity @a[hasitem={item=altivelis:marker_red,location=slot.weapon.mainhand,slot=0}] as @e[type=altivelis:marker,tag=red] at @s run particle minecraft:redstone_wire_dust_particle ~~~
execute if entity @a[hasitem={item=altivelis:marker_purple,location=slot.weapon.mainhand,slot=0}] as @e[type=altivelis:marker,tag=purple] at @s run particle minecraft:eyeofender_death_explode_particle ~~~
execute if entity @a[hasitem={item=altivelis:marker_blue,location=slot.weapon.mainhand,slot=0}] as @e[type=altivelis:marker,tag=blue] at @s run particle minecraft:water_wake_particle ~~~
execute if entity @a[hasitem={item=altivelis:marker_yellow,location=slot.weapon.mainhand,slot=0}] as @e[type=altivelis:marker,tag=yellow] at @s run particle minecraft:basic_flame_particle ~~~

execute as @e[type=altivelis:marker,tag=white,tag=!spawn] run kill @e[type=altivelis:marker,tag=white,tag=spawn]
execute as @e[type=altivelis:marker,tag=white,tag=!spawn] at @s run setworldspawn ~~~
execute as @e[type=altivelis:marker,tag=white,tag=!spawn] at @s run spawnpoint @a ~~~
tag @e[type=altivelis:marker,tag=white] add spawn

#市民の人数カウント
execute if score "test" status matches 0 run scoreboard players set "市民" roleList 0
execute if score "test" status matches 0 as @a[tag=!spec] run scoreboard players add "市民" roleList 1
execute if score "test" status matches 0 run scoreboard players operation "市民" roleList -= "人狼" roleList
execute if score "test" status matches 0 run scoreboard players operation "市民" roleList -= "狂人" roleList
execute if score "test" status matches 0 run scoreboard players operation "市民" roleList -= "霊媒師" roleList
execute if score "test" status matches 0 run scoreboard players operation "市民" roleList -= "占い師" roleList

#status:0=ホーム,1=ゲーム中,2=リザルト
execute if score "test" status matches 1 run function judge
execute if score "test" status matches 1 run function inGame
execute if score "test" status matches 2.. run scoreboard players add "test" status 1
execute if score "test" status matches 2 run effect @a resistance 10 255 true
execute if score "test" status matches 202 run function gameEnd
execute if score "test" status matches 202 run scoreboard players set "test" status 0

#部外者観戦
execute if score "test" status matches 1 as @a[tag=!spec,tag=!death] unless score @s role matches 1.. run tag @s add spec
execute if score "test" status matches 1 as @a[tag=!spec,tag=!death] unless score @s role matches 1.. run gamemode spectator @s

#矢のクールダウン
scoreboard players operation @a[tag=shot,tag=!handi2,tag=!hit] cooldown = arrow_cooldown system
scoreboard players operation @a[tag=shot,tag=!handi2,tag=!hit] cooldown *= tick cooldown
scoreboard players operation @a[tag=shot,tag=handi2,tag=!hit] cooldown = arrow_handi_cooldown system
scoreboard players operation @a[tag=shot,tag=handi2,tag=!hit] cooldown *= tick cooldown
scoreboard players operation @a[tag=hit] cooldown = arrow_hit_cooldown system
scoreboard players operation @a[tag=hit] cooldown *= tick cooldown
execute as @a[tag=shot] run scoreboard players operation @s cooldown_max = @s cooldown
execute as @a[tag=hit] run scoreboard players operation @s cooldown_max = @s cooldown
clear @a[tag=shot] minecraft:arrow
clear @a[tag=hit] minecraft:arrow
tag * remove shot
tag * remove hit

execute as @a unless entity @s[hasitem={item=minecraft:arrow}] if score @s cooldown matches 0 run replaceitem entity @s slot.inventory 0 minecraft:arrow 1 0 {"keep_on_death": {},"item_lock":{"mode":"lock_in_slot"}}
execute as @a unless entity @s[hasitem={item=minecraft:arrow}] unless score @s cooldown matches 0 run clear @s minecraft:arrow
execute as @a unless entity @s[hasitem={item=minecraft:arrow}] unless score @s cooldown matches 0 run replaceitem entity @s slot.inventory 0 minecraft:barrier 1 0 {"keep_on_death": {},"item_lock":{"mode":"lock_in_slot"}}
execute as @a if score @s cooldown matches 1.. run scoreboard players add @s cooldown -1

#観戦
execute if score "test" status matches 0 run tag @a remove spec
execute if score "test" status matches 0 as @a at @s if block ~~-3~ minecraft:iron_block run tag @s add spec
scoreboard players reset "観戦" roleList
execute as @a[tag=spec] run scoreboard players add "観戦" roleList 1
title @a[tag=spec] actionbar §7観戦モード

gamemode spectator @a[tag=death]

#常時コマンド
effect @a saturation 1 0 true
enchant @a infinity
execute if score "test" status matches 0 run effect @a instant_health 1 255 true
execute as @a unless entity @s[hasitem={item=altivelis:role_book}] run give @s altivelis:role_book 1 0 {"keep_on_death": {},"item_lock":{"mode":"lock_in_inventory"}}

#死体
execute as @e[type=altivelis:dead_body] at @s run particle minecraft:sculk_soul_particle ~~~

#スモーク
scoreboard players add @e[type=altivelis:marker,tag=smoke,tag=spawn] smoke -1
scoreboard players set @e[type=altivelis:marker,tag=!spawn,tag=smoke] smoke 400
tag @e[type=altivelis:marker,tag=smoke] add spawn
kill @e[type=altivelis:marker,tag=smoke,scores={smoke=..0}]
execute as @e[type=altivelis:smoke_grenade] at @s run particle minecraft:water_evaporation_manual ~~~

#発光
scoreboard players add @a glow 0
execute as @a[tag=!death,tag=!spec,scores={glow=..0},hasitem={item=altivelis:glow_chestplate_red,location=slot.armor.chest,slot=0}] run replaceitem entity @s slot.armor.chest 0 air
execute as @a[tag=!death,tag=!spec,scores={glow=1..}] run replaceitem entity @s slot.armor.chest 0 altivelis:glow_chestplate_red 1 0 {"keep_on_death": {},"item_lock":{"mode":"lock_in_slot"}}
scoreboard players add @a glow -1
