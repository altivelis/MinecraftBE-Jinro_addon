function role
function coinCooldown
tag @a remove death
tag @a remove hit
gamemode spectator @a[tag=spec]
gamemode 2 @a[tag=!spec]
scoreboard players set @a cooldown 0
execute as @r run scriptevent altivelis:repair
clear @a
tag @e remove tp
function tpPlayers
scoreboard players set "test" status 1
kill @e[type=altivelis:dead_body]
effect @a instant_health 1 255 true
scriptevent altivelis:resetLog


#アイテム配布
give @a[tag=!spec] minecraft:bow 1 0 {"keep_on_death": {},"item_lock":{"mode":"lock_in_inventory"}}
give @a[scores={role=4}] altivelis:ohuda 1 0 {"keep_on_death": {},"item_lock":{"mode":"lock_in_inventory"}}
give @a[scores={role=5}] altivelis:crystal 1 0 {"keep_on_death": {},"item_lock":{"mode":"lock_in_inventory"}}
give @a altivelis:role_book 1 0 {"keep_on_death": {},"item_lock":{"mode":"lock_in_inventory"}}


#役職表示
execute if score wolf_knows_each_other system matches 1 run title @a[scores={role=1}] subtitle §4 @a[scores={role=1}]
title @a[scores={role=1}] title §fあなたは§4人狼§fです
title @a[scores={role=2}] title §fあなたは§7狂人§fです
title @a[scores={role=3}] title §fあなたは§2村人§fです
title @a[scores={role=4}] title §fあなたは§3霊媒師§fです
title @a[scores={role=5}] title §fあなたは§5占い師§fです
tellraw @a[scores={role=1}] {"rawtext":[{"text":"§2あなたは§c人狼§2です"}]}
execute if score wolf_knows_each_other system matches 1 run tellraw @a[scores={role=1}] {"rawtext":[{"text":"§4仲間:§c"},{"selector":"@a[scores={role=1}]"}]}
tellraw @a[scores={role=2}] {"rawtext":[{"text":"§2あなたは§7狂人§2です"}]}
tellraw @a[scores={role=3}] {"rawtext":[{"text":"§2あなたは§a村人§2です"}]}
tellraw @a[scores={role=4}] {"rawtext":[{"text":"§2あなたは§b霊媒師§2です"}]}
tellraw @a[scores={role=5}] {"rawtext":[{"text":"§2あなたは§d占い師§2です"}]}

#gamreule 
gamerule dofiretick false
gamerule mobgriefing false
gamerule pvp true
gamerule keepinventory true
gamerule commandblockoutput false
gamerule sendcommandfeedback false
gamerule domobloot false
gamerule domobspawning false
gamerule randomtickspeed 0
gamerule dotiledrops false
gamerule doentitydrops false
gamerule showdeathmessages false
gamerule spawnradius 1
gamerule doimmediaterespawn true