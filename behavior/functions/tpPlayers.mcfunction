execute if entity @a[tag=!spec,tag=!tp] run tp @r[tag=!spec,tag=!tp] @r[type=altivelis:marker,tag=red,tag=!tp]
execute as @e[type=altivelis:marker,tag=red] at @s run tag @p[r=1] add tp
execute as @a[tag=tp] at @s run tag @e[type=altivelis:marker,tag=red,r=1] add tp
execute if entity @a[tag=!spec,tag=!tp] run function tpPlayers
execute unless entity @a[tag=!spec,tag=!tp] run tag * remove tp
