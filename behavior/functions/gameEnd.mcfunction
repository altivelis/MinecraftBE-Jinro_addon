gamemode 2 @a
tp @a @e[type=altivelis:marker,tag=white,c=1]
tag * remove death
tag * remove spec
clear @a
kill @e[type=altivelis:dead_body]
kill @e[type=minecraft:item]
execute as @r run scriptevent altivelis:repair
scoreboard players set エメラルド配布まで roleList -1
scriptevent altivelis:gameend